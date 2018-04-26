var timeFormat = require('../../utils/timeFormat');
// 图片路径添加https前缀
var convertUrl = require('../../utils/util').convertUrl;
var config = require('../../global/config');
var lastShowTimeStamp = 0;
var firstShowTimeStamp = 0;
var isLoadingMore = false;
var isBackToUpper = false;
var getMsgCount = 10;
var lastScrollHeight = 0;
var lastScrollTop = 0;

var im = require('../../index');
var sdk;
var me;
var contact;
var responseId;
var msgReceivedHandler;

// 表情对应文案
var emotionTitles = [
    '微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡觉', '大哭', '尴尬',
    '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑',
    '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '悠闲', '奋斗',
    '咒骂', '疑问', '嘘', '晕', '疯了', '衰', '骷髅', '敲打', '再见', '擦汗',
    '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了',
    '阴险', '亲亲', '惊吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡',
    '米饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹',
    '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼品', '拥抱', '强', '弱',
    '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', '不', 'OK'
];
var convertText = function (content) {
    if (typeof(content) !== 'string') {
        return content;
    }
    var resultArr = [];
    var subStr = content;
    content.replace(/(\[[^[\]]*\])/g, function (item) {
        var emotionID = emotionTitles.indexOf(item.replace(/[[\]]/g, ''));
        var startIndex = subStr.indexOf(item);
        var endIndex = startIndex + item.length;
        // 表情文本
        if (emotionID !== -1) {
            if (startIndex !== 0) {
                resultArr.push({
                    type: 'text',
                    value: subStr.substr(0, startIndex)
                });
            }
            resultArr.push({
                type: 'emotion',
                value: emotionID
            });
        } else {
            resultArr.push({
                type: 'text',
                value: subStr.substr(0, endIndex)
            });
        }
        subStr = subStr.substr(endIndex);
        return content;
    });
    if (subStr !== '') {
        resultArr.push({
            type: 'text',
            value: subStr
        })
    }
    return resultArr;
};

// 图片宽高修改
var imagePros = function (content) {
    var imagePros = {};
    var ratio;

    var msgcontent = content,
        minsize = 50,
        maxsize = 150,
        width,
        height;

    if (!msgcontent.image_width || !msgcontent.image_height) {
        imagePros.width = minsize;
        imagePros.height = minsize;
        imagePros.size = 'auto auto';
        imagePros.image = msgcontent.url;
        return imagePros;
    }

    if (msgcontent.image_width > msgcontent.image_height) {
        ratio = msgcontent.image_width / msgcontent.image_height;
        if (ratio > maxsize / minsize) {
            height = minsize;
            width = maxsize;
        } else {
            if (msgcontent.image_width > maxsize) {
                width = maxsize;
                height = width / ratio;
            } else {
                width = msgcontent.image_width;
                height = msgcontent.image_height;
            }
        }
    } else {
        ratio = msgcontent.image_height / msgcontent.image_width;
        if (ratio > maxsize / minsize) {
            width = minsize;
            height = maxsize;
        } else {
            if (msgcontent.image_height > maxsize) {
                height = maxsize;
                width = height / ratio;
            } else {
                width = msgcontent.image_width;
                height = msgcontent.image_height;
            }
        }
    }

    var src;
    if (msgcontent.url.indexOf('data:') === -1) {
        src = msgcontent.url + '?crop=1' + '&cpos=northwest' + '&h=' + height + '&w=' + width;
    } else {
        src = msgcontent.url;
    }

    var background_size = '';
    if (height === minsize && width === maxsize) {
        background_size = 'auto 100%';
    } else if (height === maxsize && width === minsize) {
        background_size = '100% auto';
    } else {
        background_size = '100% 100%';
    }
    imagePros.width = width;
    imagePros.height = height;
    imagePros.size = background_size;
    imagePros.image = src;
    return imagePros;
};

// 添加消息
var addMsgs = function (msglist, direct) {
    var that = this;
    var old_imgUrl = [];
    // 消息体修改
    msglist = msglist.map(function (msgitem) {
        // 消息结构处理,不支持类型转成文本类型消息（后续统一对文本类型消息再次处理）
        if (['call_audio', 'call_video', 'location'].indexOf(msgitem.show_type) > -1) {
            // 将音频和视频邀请转换为文案
            var converttext = '';
            if (msgitem.show_type === 'call_audio') {
                converttext = '[收到一条语音聊天消息，请在客户端查看]';
            } else if (msgitem.show_type === 'call_video') {
                converttext = '[收到一条视频聊天消息，请在客户端查看]';
            } else if (msgitem.show_type === 'location') {
                converttext = '[消息格式暂不支持，请在客户端查看]';
            }
            msgitem.content.msg = converttext;
            msgitem.show_type = 'text';
            msgitem.content.type = 'text';
        }
        return msgitem;
    }).map(function (msgitem) {
        // 外部配置，消息体转换
        msgitem = config.get('msg-show-converter')(msgitem);
        // 消息各属性值格式化处理
        // 时间戳格式转换
        msgitem.format_time = timeFormat.formatRecentTime(msgitem.send_time, 'chat');
        msgitem.ismine = (msgitem.sender_id + '' === me.user_id + '' && msgitem.sender_source + '' === me.user_source + '') ? 'true' : 'false';
        // 补全消息发送者的信息
        if (!msgitem.sender_info || !msgitem.sender_info.avatar || msgitem.sender_info.avatar === '') {
            if (msgitem.ismine === 'false') {
                msgitem.sender_info = contact;
            } else {
                msgitem.sender_info = me;
            }
        } else {
            msgitem.sender_info.avatar = convertUrl(msgitem.sender_info.avatar);
        }
        // 消息内容转换
        if (msgitem.show_type === 'text') {
            msgitem.content.msg = convertText(msgitem.content.msg);

        } else if (msgitem.show_type === 'audio') {
            if (msgitem.is_playing === undefined) {
                msgitem.is_playing = false;
            }
        } else if (msgitem.show_type === 'image') {
            var imgPros = imagePros(msgitem.content);
            msgitem.content.image_width = imgPros.width;
            msgitem.content.image_height = imgPros.height;
            msgitem.content.thumb_url = imgPros.image;
            msgitem.content.size = imgPros.size;
            old_imgUrl.push(convertUrl(msgitem.content.url));
        }
        // 时间戳隐藏设置
        var time_stamp_type;
        if (direct === 'down') {
            time_stamp_type = lastShowTimeStamp;
        } else if (direct === 'up') {
            time_stamp_type = firstShowTimeStamp;
        }
        var delta = Math.abs(msgitem.send_time - time_stamp_type);
        if (delta < 2 * 60 * 1000) {
            msgitem.is_show_time = 'false';
        } else {
            if (direct === 'down') {
                lastShowTimeStamp = msgitem.send_time;
                if (that.data.msglist.length === 1) {
                    firstShowTimeStamp = msgitem.send_time;
                }
            } else if (direct === 'up') {
                firstShowTimeStamp = msgitem.send_time;
            }
        }
        return msgitem;
    });

    // 消息过滤
    msglist.filter(function (msgitem) {
        // 过滤自己的tips
        if (msgitem.show_type === 'tip' && msgitem.sender_id + '' === me.user_id + '' && msgitem.sender_source + '' === me.user_source + '') {
            return false;
        } else {
            return true;
        }
    });

    // 添加消息和图片列表
    var new_msglist = that.data.msglist;
    var new_imgUrl = that.data.imgArr;
    if (direct === 'down') {
        Array.prototype.push.apply(new_msglist, msglist);
        Array.prototype.push.apply(new_imgUrl, old_imgUrl);
    } else if (direct === 'up') {
        Array.prototype.unshift.apply(new_msglist, msglist);
        Array.prototype.unshift.apply(new_imgUrl, old_imgUrl);
    }

    // 渲染新的消息和图片列表
    that.setData({
        msglist: new_msglist,
        imgArr: new_imgUrl
    });
    isLoadingMore = false;
};

// 更新消息
var updateMsg = function (num, new_msgitem) {
    var that = this;
    that.data.msglist.splice(num, 1, new_msgitem);
    that.setData({
        msglist: that.data.msglist
    });
    var last_num = that.data.msglist.length - 1;
    that.setData({
        toView: 'msg-' + last_num
    });
};

// sdk获取消息列表
var getMsgs = function (contact, last_msg_id, success, error) {
    var options = {
        count: getMsgCount,
        msg_id: last_msg_id,
        option: -1,
        user_id: contact.user_id,
        user_source: contact.user_source
    };
    sdk.getMsgRecords(options, function (msgs) {
        success(msgs);
    }, error);
};

// sdk发送消息
var sendMsg = function (info, events) {
    var contact = info.contact;
    var msg = {
        content: info.msg.content,
        msg_type: 2,
        send_time: info.msg.send_time,
        sender_info: info.msg.sender_info,
        show_type: info.msg.show_type,
        to_id: contact.user_id,
        to_source: contact.user_source
    };
    var finalMsg = config.get('msg-send-converter')(msg);
    var options = {
        msg: finalMsg,
        onSendMsgBegin: events.begin,
        onSendMsgSuccess: events.success,
        onSendMsgFail: events.error
    };
    sdk.sendMsg(options);
};

// sdk获取用户信息
var getContact = function (user, success) {
    sdk.getContact(user.user_id, user.user_source, function (userinfo) {
        success && success(userinfo);
    });
};

// sdk接收到消息
var receivedMsgs = function (msgs) {
    if (contact === null || !contact.user_id || !contact.user_source)
        return;
    var that = this;
    var needShowMsgs = [];
    // 未读消息数置为零
    sdk.read(contact.user_id, contact.user_source);
    msgs.forEach(function (msg) {
        var isMine;
        if (me.user_id + '' === msg.sender_id + '' && me.user_source + '' === msg.sender_source + '') {
            isMine = 'true';
        } else if (contact.user_id + '' === msg.sender_id + '' && contact.user_source + '' === msg.sender_source + '') {
            isMine = 'false';
        } else {
            return;
        }
        var msglist = msg.msg_list;
        msglist.forEach(function (msgitem) {
            // 对于从其他端同步过来的，不是发给当前联系人的消息，不保存
            if (isMine === 'true' && (msgitem.to_id + '' !== contact.user_id + '' || msgitem.to_source + '' !== contact.user_source + '')) {
                return true;
            }
            msgitem.send_status = '';
            msgitem.ismine = isMine;
            msgitem.feedback_info = '';
            needShowMsgs.unshift(msgitem);
        });
        needShowMsgs.sort(function (a, b) {
            return a.msg_id > b.msg_id ? 1 : a.msg_id < b.msg_id ? -1 : 0;
        });
        addMsgs.call(that, needShowMsgs, 'down');
    });
};

// 验证码
var getCaptcha = function (params, success, error) {
    sdk.getCaptcha(params, success, error);
};
var validateCaptcha = function (params, success, error) {
    sdk.validateCaptcha(params, success, error);
};

// 加载更多消息
var addMoreMsg = function () {
    var that = this;
    var msgs = that.data.msglist;
    var last_msg_id = null;
    /*console.log('isLoadingMore:', isLoadingMore);
     console.log('isBackToUpper:', isBackToUpper);*/
    // 上次拉取未结束
    if (!isBackToUpper || isLoadingMore) {
        /*  console.log('.....return');*/
        return;
    }
    isLoadingMore = true;
    // 显示加载中图片
    that.setData({
        loadStatus: {
            showLoading: true,
            loadInfo: ''
        }
    });
    // 不存在消息列表
    if (msgs.length === 0) {
        return;
    } else if (msgs.length > 0 && msgs[0].msg_id && msgs[0].msg_id !== '') {
        last_msg_id = msgs[0].msg_id;
    }
    // 调起api获取更多历史消息
    getMsgs(contact, last_msg_id, function (msglist) {
        if (msglist.length === 0) {
            that.setData({
                loadStatus: {
                    showLoading: false,
                    loadInfo: '全部加载完毕'
                }
            });
            return;
        }
        msglist.sort(function (a, b) {
            return a.msg_id > b.msg_id ? 1 : a.msg_id < b.msg_id ? -1 : 0;
        });
        // 防止滚动加载之后，先看到上面的内容，出现消息闪屏
        if (that.data.msglist.length > 0) {
            that.setData({
                isShowMark: true,
                msglistMark: that.data.msglist.slice(0, getMsgCount - 1)
            });
        }
        addMsgs.call(that, msglist, 'up');
        that.setData({
            loadStatus: {
                showLoading: false
            }
        });
        /*// 滚动到加载前位置
         var add_num = msglist.length;
         that.setData({
         toView: 'msg-' + add_num
         });*/
        // 由于加载新内容后会自动跳到顶部，设置scrollTop手动触发onscroll
        that.setData({
            scrollTop: lastScrollTop !== 0 ? lastScrollTop : 1
        });
    }, function () {
        that.setData({
            loadStatus: {
                showLoading: true,
                loadInfo: '加载失败,请重试~'
            }
        });
        isLoadingMore = false;
    });
};

// 存储语音对象数组，{idx:消息位置, audioId: 语音组件id, audio: 语音组件}
var _audioArr = [];
// 语音对象是否已在数组中{audioId:bool}
var _audioObj = {};
var _isEmpty = function (input) {
    return input + '' === 'null' || input + '' === 'undefined' || input === '';
};

Page({
    data: {
        msglist: [],
        inputdata: '',
        scrollHeight: 0,
        scrollTop: 0,
        upperThreshold: 0,
        toView: '',
        imgArr: [],
        loadStatus: {
            showLoading: false,
            loadInfo: ''
        },
        captcha: {
            isShow: false,
            isError: false,
            captcha_image: '',
            captcha_tips: '请输入图片验证码',
            inputdata: '',
            focus: false
        },
        hidemsg: true,
        isShowMark: false,
        msglistMark: [],
        topic: null
    },
    onLoad: function (options) {
        sdk = im.sdk();
        me = im.me();
        var that = this;
        var userid = options.userid;
        var usersource = options.usersource;
        // 联系人非法，直接返回上一页
        if (_isEmpty(userid) || _isEmpty(usersource)) {
            wx.navigateBack({
                delta: 1
            });
            return;
        }

        contact = {
            user_id: userid,
            user_source: usersource
        };
        that.setData({
            scrollHeight: im.getChatViewHeight()
        });
        //  获取自身信息
        getContact(me, function (userinfo) {
            me = userinfo;
            me.avatar = convertUrl((me.avatar && me.avatar !== '') ? me.avatar : config.get('default-avatar'));
        });
        //  获取当前联系人信息
        getContact({
            user_id: userid,
            user_source: usersource
        }, function (userinfo) {
            contact = userinfo;
            contact.avatar = convertUrl((contact.avatar && contact.avatar !== '') ? contact.avatar : config.get('default-avatar'));
            wx.setNavigationBarTitle({title: contact.user_name ? contact.user_name : contact.remark_name})
        });
        // 监听消息接收事件
        msgReceivedHandler = function (data) {
            receivedMsgs.call(that, data);
            // 滚动到底部
            var last_num = that.data.msglist.length - 1;
            that.setData({
                toView: 'msg-' + last_num
            });
        };
        sdk.listen('msgReceived', msgReceivedHandler);
    },
    onReady: function () {
        /*console.log('聊天页面onReady');*/
        // 联系人非法，直接返回上一页
        if (_isEmpty(contact) || _isEmpty(contact.user_id) || _isEmpty(contact.user_source)) {
            wx.navigateBack({
                delta: 1
            });
            return;
        }
        // 禁止下拉刷新
        wx.stopPullDownRefresh();
        var that = this;
        // 获取消息列表
        getMsgs(contact, null, function (msglist) {
            msglist.sort(function (a, b) {
                return a.msg_id > b.msg_id ? 1 : a.msg_id < b.msg_id ? -1 : 0;
            });
            addMsgs.call(that, msglist, 'down');
            // 滚动到底部
            var last_num = that.data.msglist.length - 1;
            that.setData({
                toView: 'msg-' + last_num,
                hidemsg: false
            });
            if (msglist.length < getMsgCount) {
                that.setData({
                    loadStatus: {
                        showLoading: false,
                        loadInfo: '全部加载完毕'
                    }
                });
            }
        }, function () {
        });
        // 将当前联系人未读消息置为零
        if (contact !== null && contact.user_id && contact.user_source) {
            sdk.read(contact.user_id, contact.user_source);
        }
        // 会话变更
        config.get('on-contactchange')(contact.user_id, contact.user_id);
        // 聊天窗口渲染完毕回调
        config.get('on-chatwindowcreate')(contact.user_id, contact.user_id);
        // 如果内存中含有用户topic信息，则更新ui
        var topic = im.getTopic(contact);
        if (topic) {
            this.setData({
                topic: topic
            });
        }
    },
    onUnload: function () {
        /*    console.log('聊天页面onUnload');*/
        // 恢复默认设置
        lastShowTimeStamp = 0;
        firstShowTimeStamp = 0;
        isLoadingMore = false;
        isBackToUpper = false;
        getMsgCount = 10;
        lastScrollHeight = 0;
        lastScrollTop = 0;
        me = {};
        contact = {};
        responseId = null;
        sdk.remove('msgReceived', msgReceivedHandler);
    },
    oneditorbindinput: function (e) {
        var that = this;
        that.data.inputdata = e.detail.value;
    },
    /* oneditorbindconfirm: function (e) {
     this.onsendmsg(e);
     },*/
    onsendmsg: function (data) {
        var forminfo = {
            formId: data.detail && data.detail.formId ? data.detail.formId : ''
        };
        var that = this;
        var msg = {
            send_time: new Date().getTime(),
            sender_info: me,
            sender_id: me.user_id,
            sender_source: me.user_source,
            content: {
                msg: that.data.inputdata,
                type: 'text'
            },
            msg_id: '',
            show_type: 'text',
            ismine: 'true',
            send_status: 'sending',
            feedback_info: ''
        };
        var new_msg = !data ? msg : !data.target ? data : msg;
        if (new_msg.content.msg === '')
            return;
        var info = {
            contact: contact,
            msg: new_msg
        };
        // 发送消息s
        sendMsg(info, {
            begin: function () {
                // 修改UI并滚动到底部
                addMsgs.call(that, [new_msg], 'down');
                that.setData({
                    inputdata: ''
                });
                var last_num = that.data.msglist.length - 1;
                that.setData({
                    toView: 'msg-' + last_num
                });
            },
            success: function (data) {
                new_msg.send_status = '';
                new_msg.feedback_info = '';
                new_msg.send_time = data.send_time;
                new_msg.msg_id = data.msg_id;
                var last_num = that.data.msglist.length - 1;
                updateMsg.call(that, last_num, new_msg);
                config.get('on-msg-sent')(forminfo);
            },
            error: function (error) {
                var feedback = error.error_msg ? error.error_msg : '';
                new_msg.feedback_msg_hide = error.msg_hide;
                if (error === '') {
                    feedback = '您的网络未连接，请检查后重试。';
                } else if (error.error_code === 42009) {
                    // 弹窗提示是否跳转到绑定手机号页面
                    wx.showModal({
                        title: '发送失败！',
                        content: '您未绑定手机号，请绑定后重试',
                        confirmText: '去绑定',
                        success: function (res) {
                            if (res.confirm) {
                                return config.get('bind-cellphone')();
                            }
                        }
                    });
                } else if (error.error_code === 40021) {
                    // 触发验证码
                    that.setData({
                        captcha: {
                            isShow: true,
                            isError: false,
                            captcha_image: '',
                            captcha_tips: '请输入图片验证码',
                            inputdata: '',
                            focus: true
                        }
                    });
                    that.onchangecaptchaimg();
                }
                new_msg.send_status = 'fail';
                new_msg.feedback_info = feedback;
                var last_num = that.data.msglist.length - 1;
                updateMsg.call(that, last_num, new_msg);
            }
        });
    },
    onresendmsg: function (e) {
        var that = this;
        var num = e ? e.target.id.split('-')[1] : that.data.msglist.length - 1;
        var resend_msg = that.data.msglist[num];
        that.data.msglist.splice(num, 1);
        resend_msg.send_status = 'sending';
        resend_msg.feedback_info = '';
        // 对于重发的文本消息，将消息体格式还原（断网重发，消息体已经修改为数组）
        if (resend_msg.show_type === 'text' && resend_msg.content.msg instanceof Array) {
            resend_msg.content.msg = resend_msg.content.msg[0].value;
        }
        that.onsendmsg(resend_msg);
    },
    onupper: function () {
        addMoreMsg.call(this);
    },
    onscroll: function (e) {
        var that = this;
        var scrollHeight = e.detail.scrollHeight;
        lastScrollTop = e.detail.scrollTop;
        if (e.detail.scrollTop === 0) {
            isBackToUpper = true;
            addMoreMsg.call(that);
        } else {
            isBackToUpper = false;
        }
        /* console.log('scrollTop:', e.detail.scrollTop);
         console.log('scrollHeight', scrollHeight);*/
        if (lastScrollHeight < scrollHeight) {
            that.setData({
                scrollTop: lastScrollTop + (scrollHeight - lastScrollHeight)
            });
            lastScrollHeight = scrollHeight;
        }
        that.setData({
            isShowMark: false
        });
    },
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },
    /** 图片预览 */
    onimagepreview: function (event) {
        /* console.log('图片预览');*/
        var self = this;
        wx.previewImage({
            current: convertUrl(event.target.dataset.url),
            urls: self.data.imgArr
        });
    },
    /** 播放语音 */
    onaudioplay: function (event) {
        let self = this;
        let ds = event.currentTarget.dataset;
        let audioId = ds.audio; // 当前音频组件id
        let idx = parseInt(ds.idx); // 当前消息索引
        let audio = wx.createAudioContext(audioId); // 当前音频组件
        let msgList = self.data.msglist;
        let current_msg = msgList[idx];
        // 播放音频时，停止播放其他音频，同时只播放一个
        let stopAllAudio = () => {
            _audioArr.forEach(item => {
                item.audio.seek(0);
                item.audio.pause();
                msgList[item.idx].is_playing = false;
            });
        };
        // 确认语音消息已阅读
        let ackMsgRead = audioObj => {
            var ackMsgArray = [];
            ackMsgArray.push(audioObj);
            sdk.ackMsgRead(ackMsgArray);
        };
        // 初次播放设置播放时间
        if (current_msg.play_time === 0) {
            current_msg.play_time = (new Date()).getTime();
            ackMsgRead(current_msg);
        }
        // 播放、停止播放
        if (!current_msg.is_playing) {
            stopAllAudio();
            current_msg.is_playing = true;
            audio.play();
        } else {
            current_msg.is_playing = false;
            audio.seek(0);
            audio.pause();
        }
        // 将音频存储在数组中
        if (!_audioObj[audioId]) {
            _audioObj[audioId] = true;
            _audioArr.push({"idx": idx, "audioId": audioId, "audio": audio});
        }
        // ui音频播放状态更新
        self.setData({
            msglist: msgList
        });
    },
    onoverplay: function (event) {
        /*   console.log('播放完毕');*/
        var self = this;
        var idx = parseInt(event.currentTarget.dataset.idx);
        self.data.msglist[idx].is_playing = false;
        self.setData({
            msglist: self.data.msglist
        });
    },
    oncaptchabindinput: function (e) {
        var that = this;
        var new_captcha = that.data.captcha;
        new_captcha.inputdata = e.detail.value;
        that.setData({
            captcha: new_captcha
        });
    },
    onchangecaptchaimg: function () {
        var that = this;
        getCaptcha({
            normal_get: 1
        }, function (data) {
            // 修改验证码图片
            var new_captcha = that.data.captcha;
            new_captcha.captcha_image = 'data:image/png;base64,' + data.param.pic_base64_data;
            that.setData({
                captcha: new_captcha
            });
            responseId = data.responseId;
        }, function () {

        });
    },
    oncaptchaclosure: function () {
        var that = this;
        var new_captcha = that.data.captcha;
        new_captcha.isShow = false;
        new_captcha.focus = false;
        that.setData({
            captcha: new_captcha
        });
    },
    oncaptchasubmit: function () {
        var that = this;
        var params = {
            userInput: that.data.captcha.inputdata,
            responseId: responseId
        };
        var new_captcha = that.data.captcha;
        validateCaptcha(params, function (data) {
            // 隐藏验证码模块并重发最后一条消息
            new_captcha.isShow = false;
            new_captcha.focus = false;
            that.setData({
                captcha: new_captcha
            });
            that.onresendmsg();
        }, function (error) {
            // 验证失败，提示文案修改
            if (error.error_code === 40020) {
                new_captcha.isError = true;
                new_captcha.captcha_tips = '填写错误，请重试';
            } else {
                new_captcha.isError = false;
                new_captcha.captcha_tips = '验证超时，请重试';
            }
            that.setData({
                captcha: new_captcha
            });
            that.onchangecaptchaimg();
        });
    },
    // 关闭输入法
    ontouchstart: function (e) {
        if (e.target.dataset.type !== 'input') {
            wx.hideKeyboard();
        }
    },
    // 设置topic信息
    setTopic: function (users, topic) {
        if (contact.user_id + '@' + contact.user_source === users.user_id + '@' + users.user_source) {
            this.setData({
                topic: topic
            });
        }
    },
    // im自定义页面信息
    immeta: {
        name: 'chat'
    },
    onTopicClick: function () {
        config.get('on-topic-click')(this.data.topic);
    }
});
