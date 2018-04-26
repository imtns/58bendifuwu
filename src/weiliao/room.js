// weiliao/room.js
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendType: "input",
    inputValue: "",
    user_name: "",
    user_photo: "",
    user_id: "",
    message: {},
    toView: "msgbottom",
    time: Date.parse(new Date()) / 1000,
    firstMsgId: 0,
    isTop: false,
    voice_time: 0,
    getNewMsg: true,
    last_msg_time: 0,
    userinfo_url: "",
    newsdata:{}, //缓存数据
    first_options:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self = this;
    wx.setNavigationBarTitle({
      title: options.name
    })
    var currentMsgId = _self.data.firstMsgId;

    this.setData({
      first_options:options
    });
    var url_id  = options.id;
    var w_news = wx.getStorageSync('w_news');
    if(w_news){
      if(w_news[url_id]){
        console.log("读取缓存数据开始")
        this.setData({
          message:w_news[url_id].message,
          user_name:w_news[url_id].user_name,
          user_photo:w_news[url_id].user_photo,
          user_id:w_news[url_id].user_id,
          userinfo_url:w_news[url_id].userinfo_url,
          shop:w_news[url_id].shop,
          newsdata:w_news,
          getNewMsg:true
        });
        console.log("读取缓存数据结束")
        this.setData({
          toView:"msgbottom"
        })
      }else{
        console.log("有缓存，没有这个聊天的缓存")
        this.setData({
          newsdata:w_news
        });
      };
    }else{
      console.log("没有缓存")
    };

    getShopMsgRecord();
    function getShopMsgRecord(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(getShopMsgRecord);
        return;
      }
      wx.request({
        url: getApp().globalData.domain + '/smallapp/weiliao/shop-msg-record',
        data: { id: options.id, first_msg_id: currentMsgId},
        header: {
          'access-token': wx.getStorageSync('token')
        },
        success: function (res) {
          if(res.data.code == 10){
              getApp().login(getShopMsgRecord);
              return;
          }
          _self.setData({
            time: res.data.time
          });
          if (res.data.code == 0) {
            _self.setData({
              message: _self.messageFormat(res.data.data.msg),
              user_name: options.name,
              user_photo: options.photo,
              user_id: options.id,
              shop: wx.getStorageSync('me'),
              getNewMsg: true
            });
            _self.setData({
              toView: "msgbottom"
            });
          }
        }
      })

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _self = this
    _self.animation = wx.createAnimation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      getNewMsg: true
    });
    setTimeout(this.newMsg, 3000);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      getNewMsg: false
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

    console.log("页面关闭le ....");
    var _self = this;
    var optionsData = _self.data.first_options;

    getShopMsgRecord();

    function getShopMsgRecord(){

      wx.request({
        url: getApp().globalData.domain + '/smallapp/weiliao/shop-msg-record',
        data: { id: optionsData.id, first_msg_id: 0},
        header: {
          'access-token': wx.getStorageSync('token')
        },
        success: function (res) {

          _self.setData({
            time: res.data.time
          });
          if (res.data.code == 0) {

            //设置缓存
            var obj = _self.data.newsdata;
            obj[optionsData.id] = {
              time:res.data.time,
              message:_self.messageFormat(res.data.data.msg),
              user_name:optionsData.name,
              user_photo:optionsData.photo,
              user_id:optionsData.id,
              shop:wx.getStorageSync('me'),
            };

            //管理缓存   ...这个页面返回的是毫秒   
            var timestamp = Date.parse(new Date()) ; //获取当前时间戳   
            timestamp = timestamp - 172800000;//两天前时间戳
            for(var x in obj){
                var time = obj[x].time;//获取时间戳
                if(time){
                    if(timestamp>time){//两天前>缓存时间 删除
                        console.log("删除2天前的缓存");
                        delete obj[x];
                    }
                }
            };
            wx.setStorageSync('w_news', obj);
          }

        }
      })

    };

    this.setData({
      getNewMsg: false
    });

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  send: function (e) {
    if (e.detail.value != null && e.detail.value.trim() !== '') {
      var _self = this;
      var content = e.detail.value;
      shopSend();
      function shopSend(){
        if(!getApp().globalData.tokenFirstReady){
          getApp().login(shopSend);
          return;
        }
        wx.request({
          url: getApp().globalData.domain + '/smallapp/weiliao/shop-send',
          data: "id=" + _self.data.user_id + "&content=" + content + "&type=1",
          method: 'POST',
          header: {
            'access-token': wx.getStorageSync('token'),
            "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function (res) {
            if(res.data.code == 10){
                getApp().login(shopSend);
                return;
            }
            var jsondata = res.data;
            if (jsondata.code == 0) {
              jsondata.data.msg['from'] = 2;
              _self.data.message[jsondata.data.msg.id] = jsondata.data.msg;
              _self.setData({
                message: _self.messageFormat(_self.data.message),
                inputValue: ""
              });
              _self.setData({
                toView: "msgbottom"
              });
            }
            _self.setData({
              time: res.data.time
            });
          }
        })
      }
    }
  },


  chooseImg: function () {
    var _self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表， tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        var tempFilePaths = res.tempFilePaths;
        sendFile();
        function sendFile(){
          if(!getApp().globalData.tokenFirstReady){
            getApp().login(sendFile);
            return;
          }
          wx.uploadFile({
            url: getApp().globalData.domain + '/smallapp/weiliao/shop-send-file',
            filePath: tempFilePaths[0],
            formData: { id: _self.data.user_id, type: 2 ,content:"content"},
            header: {
              'access-token': wx.getStorageSync('token'),
              'Content-Type': 'application/json'
            },
            name: 'file',
            success: function (res) {
              if(res.data.code == 10){
                  getApp().login(sendFile);
                  return;
              }
              var jsondata = JSON.parse(res.data);
              console.log(jsondata);
              if (jsondata.code == 0) {
                jsondata.data.msg['from'] = 2;
                _self.data.message[jsondata.data.msg.id] = jsondata.data.msg;
                _self.setData({
                  message: _self.messageFormat(_self.data.message),
                });
                _self.setData({
                  toView: "msgbottom"
                });
              }
              _self.setData({
                time: res.data.time
              });
            },
            fail: function (res) {
              console.log(res)
            },
            complete: function (res) {
              console.log(res)
            }
          });
        }

      }
    })
  },

  preViewImage: function (e) {
    // console.log(e);
    wx.previewImage({
      urls: [e.currentTarget.id] // 需要预览的图片http链接列表
    });
  },


  messageFormat: function (message) {
    var sysdate = util.dateToArray(new Date(this.data.time));
    console.log(this.data.time);
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    var pre_time = this.data.last_msg_time;
    var flag = 0;

    var newkey = Object.keys(message).sort();
    var newObj = {};
    for (var j = 0; j < newkey.length; j++) {
      var i = newkey[j]; 
      if (flag == 0) {
        this.setData({ firstMsgId: message[i].id });
        flag = 1;
      }
      if (message[i].send_time - pre_time > 600000) {
        var date = util.dateToArray(new Date(message[i].send_time));
        var ap = date['h'] < 12 ? "上午" : (date['h'] > 12 ? "下午" : "中午");
        if (date['y'] > sysdate['y']) {
          message[i].send_time_f =
            date['y'] + '年' + date['m'] + '月' + date['d'] + '日 ' + ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
        } else if (sysdate['m'] - date['m'] == 0 && sysdate['d'] - date['d'] == 1) {
          message[i].send_time_f =
            '昨天 ' + ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
        } else if (sysdate['m'] - date['m'] == 0 && sysdate['d'] - date['d'] == 0) {
          message[i].send_time_f =
            ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
        } else if (this.data.time - message[i].send_time < 604800 && sysdate['w'] > date['w']) {
          message[i].send_time_f =
            '星期' + week[date['w']] + ' ' + ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
        } else {
          message[i].send_time_f =
            date['m'] + '月' + date['d'] + '日 ' + ap + util.formatNumber(date['h']) + ':' + util.formatNumber(date['i']);
        }
        pre_time = message[i].send_time;
      }
      newObj[i] = message[i];
    }
    this.setData({
      last_msg_time: pre_time
    });
    return newObj;
  },
  msgRecord: function () {
    var _self = this;
    var currentMsgId = _self.data.firstMsgId;
    var toView = "msg" + currentMsgId;
    if (_self.data.isTop == false) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 60000
      });
      shopMsgRecord();
      function shopMsgRecord(){
        if(!getApp().globalData.tokenFirstReady){
          getApp().login(shopMsgRecord);
          return;
        }
        wx.request({
          url: getApp().globalData.domain + '/smallapp/weiliao/shop-msg-record',
          data: { id: _self.data.user_id, first_msg_id: currentMsgId },
          header: {
            'access-token': wx.getStorageSync('token')
          },
          success: function (res) {
            if(res.data.code == 10){
                getApp().login(shopMsgRecord);
                return;
            }
            _self.setData({
              time: res.data.time
            });
            if (res.data.code == 0) {
              if (res.data.data.msg == '') {
                _self.setData({
                  isTop: true
                });
              } else {
                var message = res.data.data.msg;

                _self.setData({
                  last_msg_time: 0
                });

                for (var i in _self.data.message) {
                  message[i] = _self.data.message[i];
                }

                _self.setData({
                  message: _self.messageFormat(message),
                });
                _self.setData({
                  toView: toView
                });
              }
            }
            wx.hideToast();
          }
        });
      }
    }
  },
  newMsg: function () {
    var _self = this;
    if(!getApp().globalData.tokenFirstReady){
      getApp().login(_self.newMsg);
      return;
    }
    var uid = _self.data.user_id;
    if (_self.data.getNewMsg) {
      wx.request({
        url: getApp().globalData.domain + '/smallapp/weiliao/shop-msg',
        data: { id: uid },
        header: {
          'access-token': wx.getStorageSync('token')
        },
        success: function (res) {
          if(res.data.code == 10){
              getApp().login(_self.newMsg);
              return;
          }
          _self.setData({
            time: res.data.time
          });
          if (res.data.code == 0) {
            if (Object.keys(res.data.data.msg).length > 0) {
              var message = _self.messageFormat(res.data.data.msg);
              console.log(message);
              for (var i in message) {
                message[i].from = 1;
                _self.data.message[message[i].id] = message[i];
              }
              _self.setData({
                message: _self.data.message,
              });
              _self.setData({
                toView: "msgbottom"
              });
            }
          }
        }
      });
      setTimeout(_self.newMsg, 3000);
    }
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }
})