/* eslint-disable */
var _config = {};
_config['default-avatar'] = 'https://pic1.58cdn.com.cn/p1/n_v1bkuymc2tsxlfo5wrgb7a.png';
// 消息转换器，将消息结构转换成相应ui的标准结构
_config['msg-show-converter'] = function (msg) {
    return msg;
};
// 发送消息转换器，将内部标准消息结构转换成发送需要的结构
_config['msg-send-converter'] = function (msg) {
    return msg;
};
// 会话上展示的消息转换器
_config['session-msg-converter'] = function (msg) {
    return null;
};
// 是否显示头像
_config['msg-avatar'] = true;
// 埋点统计
_config['stat'] = {
    appversion: '1.0',
    appid: '123',
    appkey: 'abcdefg',
    cookiename: 'wmda',
    pn: 'demo',
    reportIntervalTime: 5,
    reportIntervalCount: 3
};
// 消息声音提醒
_config['msg-sound'] = 'https://wx.qq.com/zh_CN/htmledition/v2/sound/msg.mp3';
//默认卡片图片
_config['default-card-img'] = '//pic3.58cdn.com.cn/nowater/webim/big/n_v1bl2lwxtpeksfrr3aea3q.png';
// 获取用户信息
_config['getUserinfo'] = function () {
};
// 默认用户的source
_config['default-source'] = '';
// 绑定手机号
_config['bind-cellphone'] = function () {
};
// 切换会话时，获取当前会话对象；主页下，两参数均为''
_config['on-contactchange'] = function (to_id, to_source) {
};
// 聊天页面创建完毕回调方法（外部可根据用户id，source进行输入框隐藏）
_config['on-chatwindowcreate'] = function (user_id, user_source) {
};
// session列表处理（如:将部分账号置顶）
_config['sessions-converter'] = function (sessions, cb) {
  // sessions.push({ user: { user_id: "50152668611859", user_source: "2" }, msg: { msg_id: "948387038661468160", content: { msg: "非法用户", type: "text" }, send_time: 1514948064865, msg_type: 2 }, sort_time: 1514948064865 });
  // sessions.push({ user: { user_id: "50152668611858", user_source: "2" }, msg: { msg_id: "948387038661468160", content: { msg: "哈哈", type: "text" }, send_time: 1514948064865, msg_type: 2 }, sort_time: 1514948064865 });
  // sessions.push({ user: { user_id: "50152668611859", user_source: "2" }, msg: { msg_id: "948387038661468160", content: { msg: "非法用户", type: "text" }, send_time: 1514948064865, msg_type: 2 }, sort_time: 1514948064865 });
  var sessionsNew = sessions.filter(function(session, index){
    if (session.user.user_id !== '50152668611859'){
      return session;
    }
  })
  cb(sessionsNew);
};
// 未登录场景处理
_config['on-notlogin'] = function () {
    wx.redirectTo({
        url: '/passport/pages/login/login'
    });
};
// im模块绝对路径，包含im
_config['im-absolute-path'] = '/im';

// 聊天页点击topic事件
_config['on-topic-click'] = function (topic) {

};

// 为业务线提供forminfo
_config['on-msg-sent'] = function (forminfo) {

};

module.exports = {
    set: function (config) {
        Object.assign(_config, config);
    },
    get: function (key) {
        return _config[key];
    }
};
