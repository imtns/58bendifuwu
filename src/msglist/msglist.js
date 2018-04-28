// shop/msglist/msglist.js
var util = require('../utils/util.js');
const app = require('../app');
Page({
  data:{
    role: '',
    loading: true,
    msglist: {
      data: [],
      unread:0,
      dataTemp: [],
      unreadTemp: 0,
      readyStatus: 0 //ready状态为2。更新msglist需要去请求微聊和小程序聊天两个接口，只有两个接口都完成后，msglist.data才是ready状态 每次需要更新msglist时，请求前把readyStatus置0，每完成一个请求，把readyStatus加1，这样当两个请求完成时，readyStatus必定为2
    },
    time:Date.parse(new Date()),
    hidenGuidePage: true
  },
  onLoad:function(options){
    var _self = this;
    var token = wx.getStorageSync('token');
    options.role && wx.setStorageSync('role', options.role);
    _self.setData({
         role:options.role || wx.getStorageSync('role')
    });
    _self.getProfile();
  },
  getProfile: function(){
    var _self = this;
    if(!app.globalData.tokenFirstReady){
      app.login(_self.getProfile);
      return;
    }
    var token = wx.getStorageSync('token');
    wx.request({
      url: app.globalData.domain + '/smallapp/im-' + _self.data.role + '/profile', 
        header: {
            'access-token': token
        },
        success: function(res) {
          if (res.data.code == 1 && res.data.ret.profile!=undefined){
              wx.setStorageSync('me', res.data.ret.profile);
              _self.setData({
                time: res.data.time * 1000
              });
            }
        }
    });
    wx.request({
        url: app.globalData.domain+'/smallapp/im-user/profile', 
        header: {
            'access-token': token
        },
        success: function(res) {
          if (res.data.code == 1 && res.data.ret.profile != undefined){
              wx.setStorageSync('user_me', res.data.ret.profile);
              _self.setData({
                time: res.data.time * 1000
              });
            } else if(res.data.code==10){
              app.login(_self.getProfile);
              return;
            }
        }
    });
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow: function(){
    this.updataMsgList();
  },
  updataMsgList:function(){
    // 页面显示
    var _self = this;

    _self.setData({
      msglist: util.constDeepMixin(_self.data.msglist, {
        readyStatus: 0,
        dataTemp: [],
        unreadTemp: 0
      })
    });
    getMsgList();
    function getMsgList(){
      if(!app.globalData.tokenFirstReady){
        app.login(getMsgList);
        return;
      }
     
      wx.request({
        url: app.globalData.domain + '/smallapp/im-' + _self.data.role + '/msg-list', 
        header: {
            'access-token': wx.getStorageSync('token')
        },
        success: function(res) {
          if(res.data.code == 10){
              app.login(getMsgList);
              return;
          } else if (res.data.code == 11){
            wx.setStorageSync('role', 'user');
            _self.setData({role: 'user'});
            _self.updataMsgList();
            return;
          }
          if (res.data.code == 1 && res.data.ret.msg_list!=undefined){
            _self.setData({
              time: res.data.time * 1000,
              msglist:util.constDeepMixin(_self.data.msglist, {
                readyStatus: _self.data.msglist.readyStatus + 1,
                unreadTemp: _self.data.msglist.unreadTemp + parseInt(res.data.ret.unread),
                dataTemp: _self.data.msglist.dataTemp.concat( _self.messageFormat(res.data.ret.msg_list) )
              }),
              hidenGuidePage: true
            });
            _self.data.msglist.readyStatus == 2 && complete();
          }else{
            _self.setData({
              hidenGuidePage: false //展示说明
            });
          }
        }
      });
    }
    if (_self.data.role == "shop"){
      getShopWeiliaoMsgList();
      function getShopWeiliaoMsgList(){
        // if(!app.globalData.tokenFirstReady){
        //   app.login(getShopWeiliaoMsgList);
        //   return;
        // }
        wx.request({
          url: app.globalData.domain + '/smallapp/weiliao/shop-msg-list',
          header: {
            'access-token': wx.getStorageSync('token')
          },
          success: function (res) {
            // if(res.data.code == 10){
            //     app.login(getShopWeiliaoMsgList);
            //     return;
            // }
            if (res.data.code == 0 && res.data.data.msg_list!=undefined) {
              if (res.data.time != 0){
                _self.setData({
                  time: res.data.time
                });
              }
              _self.setData({
                msglist:util.constDeepMixin(_self.data.msglist, {
                  readyStatus: _self.data.msglist.readyStatus + 1,
                  unreadTemp: _self.data.msglist.unreadTemp + parseInt(res.data.data.unread),
                  dataTemp: _self.data.msglist.dataTemp.concat( _self.weiLiaoMessageFormat(res.data.data.msg_list) )
                })
              });
              _self.data.msglist.readyStatus == 2 && complete();
            }else{
              _self.setData({
                msglist: util.constDeepMixin(_self.data.msglist, {
                  readyStatus: _self.data.msglist.readyStatus + 1,
                })
              });
              _self.data.msglist.readyStatus == 2 && complete();
            }
          }
        });
      }
    } else{
      _self.setData({
        msglist:util.constDeepMixin(_self.data.msglist, {
          readyStatus: _self.data.msglist.readyStatus + 1,
        })
      });
      _self.data.msglist.readyStatus == 2 && complete();
    }

    function complete(){
      console.log('complete update...');
      _self.setData({
        msglist:util.constDeepMixin(_self.data.msglist, {
          data: _self.sortMsglist( _self.data.msglist.dataTemp ),
          unread: _self.data.msglist.unreadTemp,
        }),
        loading: false
      });
      if(_self.data.msglist.unread>0){
        wx.setNavigationBarTitle({
          title: '消息('+_self.data.msglist.unread+')'
        })
      }else{
        wx.setNavigationBarTitle({
          title: '消息'
        })
      }
    }
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  openRoom:function(event){
      wx.navigateTo({
        url: '/'+this.data.role+'/room/room?id='+event.currentTarget.dataset.user.id
        +"&name="+event.currentTarget.dataset.user.name
        +"&photo="+event.currentTarget.dataset.user.photo
      });
  },
  messageFormat:function(message)
  {
    var _self = this;
    var sysdate = util.dateToArray(new Date(this.data.time));
    var week = ['日','一','二','三','四','五','六'];
    var pre_time = this.data.time;
    for(var i in message){
        message[i].times = message[i].time*1000;
        var date = util.dateToArray(new Date(message[i].time*1000));
        var ap = date['h']<12?"上午":(date['h']>12?"下午":"中午");
        if(date['y']>sysdate['y']){
          message[i].time = 
          date['y']+'年'+date['m']+'月'+date['d']+'日';
        }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==1){
          message[i].time ='昨天';
        }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==0){
          message[i].time = ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
        }else if(this.data.time-message[i].send_time<604800 && sysdate['w']>date['w']){
          message[i].time = '星期'+week[date['w']];
        }else{
          message[i].time = date['m']+'月'+date['d']+'日';
        }
        message[i].source = 1;
    }
    return message;
  },

  openWeiLiaoRoom: function (event) {
    wx.navigateTo({
      url: '/weiliao/room?id=' + event.currentTarget.dataset.user.id
      + "&name=" + event.currentTarget.dataset.user.name
      + "&photo=" + event.currentTarget.dataset.user.photo
    });
  },
  weiLiaoMessageFormat: function (message) {
    var _self = this;
    var sysdate = util.dateToArray(new Date(this.data.time));
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var pre_time = this.data.time;
    for (var i in message) {
      message[i].times = message[i].time;
      message[i].top = 0;
      var date = util.dateToArray(new Date(message[i].time));
      var ap = date['h'] < 12 ? "上午" : (date['h'] > 12 ? "下午" : "中午");
      console.log(date['y'] + '|' + sysdate['y']);
      if (date['y'] > sysdate['y']) {
        message[i].time =
          date['y'] + '年' + date['m'] + '月' + date['d'] + '日';
      } else if (sysdate['m'] - date['m'] == 0 && sysdate['d'] - date['d'] == 1) {
        message[i].time = '昨天';
      } else if (sysdate['m'] - date['m'] == 0 && sysdate['d'] - date['d'] == 0) {
        message[i].time = ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
      } else if (this.data.time - message[i].send_time < 604800 && sysdate['w'] > date['w']) {
        message[i].time = '星期' + week[date['w']];
      } else {
        message[i].time = date['m'] + '月' + date['d'] + '日';
      }
      message[i].source = 2;
    }
    return message;
  },
  sortMsglist: function(msgList){
    msgList.sort(function (a, b) {
      return b.times*(b.top+1) - a.times*(a.top+1)
    });
    return msgList;
  },

  onPullDownRefresh: function(){
     this.onShow();
     wx.stopPullDownRefresh();
  }
})