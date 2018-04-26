var SDK = require('./sdk/index');
var extend = require('./utils/extend');
var config = require('./global/config');

var _sdk = null;
var _me = null;
// 聊天页面容器高度
var _chatVH = 0;
// 聊天用户头部卡片信息
var _usersTopic = {};

//打开页面方式：navigateTo（默认），redirectTo,navigateBack,switchTab,reLaunch
var gotoPageByRout = function (router_type, url) {
    switch (router_type) {
        case 'redirectTo':
            wx.redirectTo({
                url: url
            });
            break;
        case 'navigateBack':
            wx.navigateBack({
                url: url
            });
            break;
        case 'switchTab':
            wx.switchTab({
                url: url
            });
            break;
        case 'reLaunch':
            wx.reLaunch({
                url: url
            });
            break;
        case 'navigateTo':
        default:
            wx.navigateTo({
                url: url
            });
            break;
    }
};

/**
 * 获取失败原因实体
 * @param code 1：未登录，2：参数错误, 0：其他
 * @private
 * @return 失败信息{msg:'失败原因',code:'失败原因编号'}
 */
var _getError = function (code) {
    let error = {code: code};
    switch (code) {
        case 1:
            error.msg = '未登录';
            break;
        case 2:
            error.msg = '参数错误';
            break;
        case 3:
            error.msg = 'im-token非法';
            break;
        default:
            error.msg = '其他错误';
            error.code = 0;
            break;
    }
    console.log('发送错误', error);
    return error;
};

// 是否为空
var _isEmpty = function (input) {
    return input + '' === 'null' || input + '' === 'undefined' || input === '';
};

// 判断用户是否登录
var _isLogined = function () {
    var self = this;
    var _isLogined = false;
    if (self.me() && self.me().user_id && self.me().user_source) {
        _isLogined = true;
    }
    return _isLogined;
};

module.exports = {
    init: function (options) {
        var sdkoptions = options.sdk;
        var uiconfig = options.ui;
        var defaultsdkopts = {
            user_id: '',
            source: '',
            client_version: '',
            im_token: '',
            device_id: '',
            appid: '',
            ws: '',
            api: '',
            getNewToken: function (cb) {
                cb('todo');
            }
        };
        extend(defaultsdkopts, sdkoptions);
        config.set(uiconfig);

        _sdk = new SDK(defaultsdkopts);
        _sdk.start();

        _me = {
            "user_id": defaultsdkopts.user_id,
            "user_source": defaultsdkopts.source
        };
    },
    sdk: function () {
        return _sdk;
    },
    // 获取当前用户：user_id, user_source
    me: function () {
        return _me;
    },
    // 获取聊天容器高度
    getChatViewHeight: function () {
        if (_chatVH) {
            return _chatVH;
        } else {
            wx.getSystemInfo({
                success: function (res) {
                    _chatVH = res.windowHeight;
                }
            });
            return _chatVH;
        }
    },
    /**
     * 跳转至会话列表页面
     * @param options {router_type}
     * @param success
     * @param error
     * @returns {*}
     */
    gotoSessions: function (options, success, error) {
        let router_type = options ? options.router_type : 'navigateTo';
        // 错误验证
        // 如果未登录
        if (!_isLogined.call(this)) {
            error && error(_getError(1));
            return config.get('on-notlogin')();
        }
        let url = config.get('im-absolute-path') + '/pages/sessions/sessions';
        gotoPageByRout(router_type, url);
        success && success();
    },
    /**
     * 跳转至某用户聊天页面
     * @param options {user_id, user_source,router_type}
     * @param success
     * @param error
     * @returns {*}
     */
    gotoChat: function (options, success, error) {
        // 错误验证
        // 如果未登录
        if (!_isLogined.call(this)) {
            error && error(_getError(1));
            return config.get('on-notlogin')();
        } else if (_isEmpty(options) || _isEmpty(options.user_id) || _isEmpty(options.user_source)) {
            return error && error(_getError(2));
        }
        // 设置refer字段
        if (!_isEmpty(options.refer)) {
            _sdk.setRefer(options.user_id, options.user_source, options.refer);
        }
        let url = config.get('im-absolute-path') + '/pages/chat/chat?userid=' + options.user_id + '&usersource=' + options.user_source;
        gotoPageByRout(options.router_type, url);
        success && success();
    },
    /**
     * 设置消息窗口头部卡片（帖子）
     * @param user_id
     * @param user_source
     * @param topic 头部卡片信息{url:'', img:'',title:'',extrainfo:''}}
     */
    setTopic: function (user_id, user_source, topic) {
        if (!topic)
            return;
        // 保存用户topic信息
        var paramKey = user_id + '@' + user_source;
        _usersTopic[paramKey] = topic;
        // 如果当前是聊天页面则触发
        var pages = getCurrentPages();
        var currentPage = pages[pages.length - 1];
        var immeta = currentPage.immeta;
        if (!immeta)
            return;
        // 当前页面为聊天页面，则设置topic
        if (immeta.name === 'chat') {
            currentPage.setTopic({
                user_id: user_id,
                user_source: user_source
            }, topic);
        }
    },
    /**
     * 获取内存中聊天对象头部卡片信息
     * @param contact:{user_id:'',user_source:''}
     * @return topic
     */
    getTopic: function (contact) {
        return _usersTopic[contact.user_id + '@' + contact.user_source];
    },
    // IM统一跳转入口
    gotoIM: function (options, success, error) {
        // sdk初始化
        var oldGetNewToken = options.initOpts.sdk.getNewToken;
        options.initOpts.sdk.getNewToken = function () {
            error && error(_getError(3));
            oldGetNewToken();
        };
        this.init(options.initOpts);
        if (options.pageName + '' === 'chat') {
            this.gotoChat(options.pageOpts, success, error);
        } else if (options.pageName + '' === 'sessions') {
            this.gotoSessions(options.pageOpts, success, error);
        }
    }
};
