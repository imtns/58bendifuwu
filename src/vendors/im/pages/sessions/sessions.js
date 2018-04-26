//sessions.js
var im = require('../../../..//utils/IMInit.js');

var _im = require('../../index');
var _timeFormat = require('../../utils/timeFormat.js');
// 图片路径添加https前缀
var _convertUrl = require('../../utils/util').convertUrl;
var _config = require('../../global/config');

var _sdk;
var _have_more = true; // 是否仍有未加载的会话
var _load_count = 0; // 已加载会话数量
var _first_min_count = 15; // 首页占满需加载会话数量(暂时定死)
var _getSessions; // 获取会话列表方法

// 会话列表中最后一条消息内容格式处理
var _sessionLastMsg = session => {
    let content = session.msg.content || {'type': 'text'};
    let status = session.msg.status || 'SUCCESS';
    let lastMsg = '';
    switch (status) {
        case 'IMAGE_UPLOADING':
        case 'SENDING':
            session.status = 'sending';
            break;
        case 'IMAGE_FAIL':
        case 'FAIL':
            session.status = 'fail';
            break;
        case 'SUCCESS':
            break;
    }
    switch (content.type) {
        case 'text':
            lastMsg += content.msg || '';
            break;
        case 'tip':
            lastMsg += content.text;
            break;
        case 'image':
            lastMsg += '[图片]';
            break;
        case 'location':
            lastMsg += '[位置]';
            break;
        case 'audio':
            lastMsg += '[语音]';
            break;
        case 'call_audio':
            lastMsg += '[语音聊天]';
            break;
        case 'call_video':
            lastMsg += '[视频聊天]';
            break;
        case 'card':
        case 'minicard':
            lastMsg += '[帖子]';
            break;
    }
    session.lastMsg = lastMsg;
};
var handleSession;

Page({
    /**
     * 页面的初始数据
     */
    data: {
        sessionList: [],
        loadStatus: {
            showLoading: true,
            loadInfo: ''
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        var self = this;
        if (!wx.getStorageSync('ppu')) {
            console.log("没有ppu")
            try {
                wx.navigateToMiniProgram({
                    appId: 'wx2a9c6eeb1c44a284',
                    path: 'pages/index/index',
                    extraData: {},
                    envVersion: 'release',//trial release
                    success(res) {
                        // 打开成功
                        console.log('打开成功！');
                    },
                    complete: function (resp) {
                        console.log(resp.errMsg)
                    }
                });
            } catch (e) {
                wx.showToast({
                    title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
                    icon: '',
                    duration: 5000
                });
            }
        }
        //有改动
        // if (!_im.me()) {
        //     return;
        // }

        _sdk = _im.sdk();

        // 会话列表更新时，更新UI会话列表
        handleSession = () => {
            let sessions = _sdk.getAllSessions();
            
            if (sessions.length === 0) {
                this.setData({
                    loadStatus: {
                        showLoading: true,
                        loadInfo: '暂无会话列表~'
                    }
                });
                return;
            }
            // 外部session列表处理
            _config.get('sessions-converter')(sessions, sessions => {
            
                _load_count = sessions.length;
                let unread = _sdk.getAllUnreadAmount();
                let userkeys = sessions.map(session => ({
                    'user_id': session.user.user_id,
                    'user_source': session.user.user_source
                }));
                
                _sdk.getContact(userkeys, contacts => {
                    sessions.forEach(session => {
                        let session_user = session.user;
                        let key = session_user.user_id + '@' + session_user.user_source;
                        session.contact = contacts[key] || {};
                        session.unread = unread[key] ? unread[key] : 0;
                        let session_contact = session.contact;
                        // 无头像联系人设置默认头像
                        let avatar = session_contact.avatar;
                        if (!avatar) {
                            session_contact.avatar = _convertUrl(_config.get("default-avatar"));
                        } else {
                            session_contact.avatar = _convertUrl(avatar);
                        }
                        // 消息时间格式转换
                        if (!session.msg || !session.msg.send_time) {
                            session.msg = {
                                'send_time': new Date().getTime()
                            };
                        }
                        let session_msg = session.msg;
                        session_msg.send_time = _timeFormat.formatRecentTime(session_msg.send_time);
                        // 最后一条消息内容及状态
                        _sessionLastMsg(session);
                    });
                    
                    // 更新会话列表
                    this.setData({
                        sessionList: sessions,
                        loadStatus: {
                            showLoading: false,
                            loadInfo: '加载成功！'
                        }
                    });

                    // 如果首屏未加载满则继续加载
                    if (_first_min_count > _load_count && _have_more) {
                        _getSessions(have_more => _have_more = have_more);
                    }
                });
            });
        };
        // 注册session列表数据变更事件，通知页面更新
        _sdk.listen('sessionChanged', handleSession);
        // 未读消息数变更时，更新会话列表
        _sdk.listen('unreadChanged', handleSession);

        // 初次进入页面加载会话列表，保证铺满屏幕(每个会话item所占高度：148 rpx)
        /*wx.getSystemInfo({
         success: function (res) {
         // 通过rpx单位处理
         _first_min_count = parseInt(res.windowHeight * res.pixelRatio / 148) + 2;
         _getSessions.call(self, function (sessions, have_more) {
         _have_more = have_more;
         });
         }
         });*/

        // 获取会话列表
        _getSessions = (success, fail) => {
            _sdk.getSessions({}, (sessionlist, have_more) => {
                _have_more = have_more;
                success && success(have_more);
            }, () => {
                this.setData({
                    loadStatus: {
                        showLoading: true,
                        loadInfo: '加载失败,请重试~'
                    }
                });
                fail && fail();
            });
        };
        // 每次进入页面,如果有更多数据则触发一次会话列表查询（包含首次进入或再次进入场景）
        if (_have_more) {
            _getSessions(have_more => {
                setTimeout(() => {
                    if (this.data.sessionList.length === 0) {
                        if (have_more) {
                            console.error('sessions查询接口未返回数据，但have_more为1');
                        } else {
                            this.setData({
                                loadStatus: {
                                    showLoading: true,
                                    loadInfo: '暂无会话列表~'
                                }
                            });
                        }
                    }
                }, 5000);
            });
        }

        // 再次进入页面时，加载sdk已经查询出的会话列表
        if (_sdk.getAllSessions().length > 0)
            handleSession();
    },
    onUnload: function () {
      // changed
      if (!_sdk) {
        return;
      }
        // 恢复默认设置
        _have_more = true;
        _load_count = 0;
        _first_min_count = 15;
        _sdk.remove('sessionChanged', handleSession);
        // 未读消息数变更时，更新会话列表
        _sdk.remove('unreadChanged', handleSession);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (_have_more) {
            this.setData({
                loadStatus: {
                    showLoading: true,
                    loadInfo: ''
                }
            });
            _getSessions(have_more => _have_more = have_more);
        }
    }
});
