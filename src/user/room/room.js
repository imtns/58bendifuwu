// shop/room/room.js

var util = require('../../utils/util.js');
const app = require('../../app');
Page({
  data:{
    sendType:"input",
    inputValue:"",
    shop_name:"",
    shop_photo:"",
    shop_id:"",
    message:{},
    toView:"msgbottom",
    time:Date.parse(new Date())/1000,
    firstmsgid:0,
    isTop:false,
    voice_time:0,
    getNewMsg:true,
    last_msg_time:0,
    shopinfo_url:"",
    packupBound: 30,
    newsdata:{}, //缓存数据
    first_options:{},
    ismusic:false,
  },
  msgPackupSwitch: function(e){
    var self = this;
    var msgid = e.currentTarget.dataset.msgid;
    var msgMix = {};
    msgMix[msgid] = {};
    if(this.data.message[msgid].unPackedUp){
      msgMix[msgid].unPackedUp = false;
    } else{
      msgMix[msgid].unPackedUp = true;
    }
    self.setData({
      message: util.constDeepMixin(self.data.message, msgMix)
    });
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    var url_id  = options.id;
    wx.setNavigationBarTitle({ title: options.name });
    this.setData({
      first_options:options,
      shop_name: options.name,
      shop_photo: options.photo,
      shop_id: options.id,
      shopinfo_url: '/user/shopinfo/shopinfo?id=' + options.id,
      user: wx.getStorageSync('user_me'),
    });

    var news = wx.getStorageSync('news');
    if(news){
      if(news[url_id]){
        console.log("读取缓存数据开始")
        this.setData({
          message:news[url_id].message,
          shop_name:news[url_id].shop_name,
          shop_photo:news[url_id].shop_photo,
          shop_id:news[url_id].shop_id,
          shopinfo_url:news[url_id].shopinfo_url,
          user:news[url_id].user,
          newsdata:news
        });
        console.log("读取缓存数据结束")
        this.setData({
          toView:"msgbottom"
        })
      }else{
        console.log("有缓存，没有这个聊天的缓存")
        this.setData({
          newsdata:news
        });
      };
    }else{
      console.log("没有缓存")
    };

    msgRecord();

    function msgRecord(){
      if(!app.globalData.tokenFirstReady){
        app.login(msgRecord);
        return;
      }
      wx.request({
        url: app.globalData.domain+'/smallapp/im-user/msg-record', 
        data:{id:options.id},
        header: {
            'access-token': wx.getStorageSync('token')
        },
        success: function(res) {
          if(res.data.code == 10){
              app.login(msgRecord);
              return;
          }
          _self.setData({
                time:res.data.time
          });
          if(res.data.code==1){
            _self.setData({
              message:_self.messageFormat(res.data.ret.msg),
              shop_name:options.name,
              shop_photo:options.photo,
              shop_id:options.id,
              shopinfo_url:'/user/shopinfo/shopinfo?id='+options.id,
              user:wx.getStorageSync('user_me'),
              getNewMsg:true
            });
            _self.setData({
                toView:"msgbottom"
            });

          };
        }
      })
    }
  },
  onReady:function(){
    // 页面渲染完成
     var _self = this
    _self.animation = wx.createAnimation();
  },
  onShow:function(){
    // 页面显示
    this.setData({
        getNewMsg:true
    });
    setTimeout(this.newMsg,3000);
  },
  onHide:function(){
    // 页面隐藏
    this.setData({
        getNewMsg:false
    });
  },
  onUnload:function(){
    // 页面关闭
    console.log("页面关闭le ....");
    var _self = this;
    var optionsData = _self.data.first_options;
    msgRecord();
    function msgRecord(){
      wx.request({
        url: app.globalData.domain+'/smallapp/im-user/msg-record', 
        data:{id:optionsData.id},
        header: {
            'access-token': wx.getStorageSync('token')
        },
        success: function(res) {
          _self.setData({
                time:res.data.time
          });
          if(res.data.code==1){
            //设置缓存
            var obj = _self.data.newsdata;
            obj[optionsData.id] = {
              time:res.data.time,
              message:_self.messageFormat(res.data.ret.msg),
              shop_name:optionsData.name,
              shop_photo:optionsData.photo,
              shop_id:optionsData.id,
              shopinfo_url:'/user/shopinfo/shopinfo?id='+optionsData.id,
              user:wx.getStorageSync('user_me')
            };

            //管理缓存
            var timestamp = Date.parse(new Date()) / 1000; //获取当前时间戳 
            timestamp = timestamp - 172800;//两天前时间戳
            for(var x in obj){
                var time = obj[x].time;//获取时间戳
                if(time){
                    if(timestamp>time){//两天前>缓存时间 删除
                        console.log("删除2天前的缓存");
                        delete obj[x];
                    }
                }
            };
            
            wx.setStorageSync('news', obj);

          };
        }
      })
    };

    this.setData({
        getNewMsg:false
    });
  },
  send:function(e) {
    if(e.detail.value != null && e.detail.value.trim() !== ''){
      var _self = this;
      var content = e.detail.value;
      sendReq();
      function sendReq(){
        if(!app.globalData.tokenFirstReady){
          app.login(sendReq);
          return;
        }
        wx.request({
          url: app.globalData.domain+'/smallapp/im-user/send', 
          data:"id="+_self.data.shop_id+"&content="+content+"&type=1&from=1",
          method:'POST',
          header: {
              'access-token': wx.getStorageSync('token'),
              "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
            if(res.data.code == 10){
                app.login(sendReq);
                return;
            }
            var jsondata = res.data;
            if(jsondata.code==1){
              jsondata.ret.msg['from']=1;
              _self.data.message[jsondata.ret.msg.id] = jsondata.ret.msg;
              _self.setData({
                message:_self.messageFormat(_self.data.message),
                inputValue: ""
              });
              _self.setData({
                toView:"msgbottom"
              });

            };
            _self.setData({
              time:res.data.time
            });
          }
        })
      }
    }
  },
  sendType:function(e){
      var that = this;
      var type = that.data.sendType === 'input' ? 'voice' : 'input';
      that.setData({
        sendType: type
      });
  },
  
  chooseImg:function(){
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
          if(!app.globalData.tokenFirstReady){
            app.login(sendFile);
            return;
          }
          wx.uploadFile({
            url: app.globalData.domain +'/smallapp/im-user/send', 
            filePath:tempFilePaths[0],
            formData: { id: _self.data.shop_id, type: 2, from: 1, content: 'img'},
            header: {
                'access-token': wx.getStorageSync('token'),
                'Content-Type': 'application/json'
            },
            name:'file',
            success: function(res) {
              if(res.data.code == 10){
                  app.login(sendFile);
                  return;
              }
              var jsondata = JSON.parse(res.data);
              // console.log(jsondata);
              if(jsondata.code==1){
                jsondata.ret.msg['from']=1;
                _self.data.message[jsondata.ret.msg.id]=jsondata.ret.msg;
                _self.setData({
                  message:_self.messageFormat(_self.data.message),
                });
                _self.setData({
                  toView:"msgbottom"
                });
              }
              _self.setData({
                time:res.data.time
              });
            }
          })
        }
      }
    })
  },
  preViewImage:function(e){
    // console.log(e);
    wx.previewImage({
      urls: [e.currentTarget.id] // 需要预览的图片http链接列表
    });
  },
  getvoice:function(){
    var _self = this;
    console.log("开始录音");
    _self.setData({
        voice_time:new Date(),
        ismusic:true,
    });
    // wx.showToast({
    //   title: '录音中...',
    //   icon: 'loading',
    //   image:'/image/voice_input.png',
    //   duration: 60000
    // });
    wx.startRecord({
      success: function(res) {
        console.log("录音成功")
        var tempFilePath = res.tempFilePath 

        sendFile();
        function sendFile(){
          if(!app.globalData.tokenFirstReady){
            app.login(sendFile);
            return;
          }
          wx.uploadFile({
            url: app.globalData.domain +'/smallapp/im-user/send', 
            filePath:tempFilePath,
            formData: { id: _self.data.shop_id, type: 3, from: 1, remark: parseInt(_self.data.voice_time / 1000), content: 'voice'},
            header: {
                'access-token': wx.getStorageSync('token'),
                'Content-Type': 'application/json'
            },
            name:'file',
            success: function(res) {
              if(res.data.code == 10){
                  app.login(sendFile);
                  return;
              }
              var jsondata = JSON.parse(res.data);
              console.log(jsondata);
              if(jsondata.code==1){
                jsondata.ret.msg['from']=1;
                _self.data.message[jsondata.ret.msg.id]=jsondata.ret.msg;
                _self.setData({
                  message:_self.messageFormat(_self.data.message),
                });
                _self.setData({
                  toView:"msgbottom"
                });
              }
              _self.setData({
                time:res.data.time,
                voice_time:0
              });
            }
          })
        }

      },
      complete:function(res){
        console.log("complete"+res)
      },
      fail: function(res) {
        //录音失败
        console.log("fail"+res)
      }
    })
  },
  stopvoice:function(){
    wx.stopRecord();
    console.log("stop");
    this.setData({
        voice_time:new Date() - this.data.voice_time,
        ismusic:false,
    });
    // wx.hideToast();
  },
  playVoice:function(event){
    var id = event.currentTarget.dataset.id;
    var _self = this;
    _self.data.message[id].playing=1;
    _self.setData({
      message:_self.data.message,
    });
    setTimeout(function(){
      _self.data.message[id].playing=0;
      _self.setData({
        message:_self.data.message,
      });
    },_self.data.message[id].remark*1000);
    wx.downloadFile({
      url: event.currentTarget.dataset.content, 
      success: function(res) {
        console.log(res.tempFilePath);
        wx.playVoice({
          filePath: res.tempFilePath,
          success:function(){
            console.log("成功")
          },
          complete:function(res){
            console.log(res)
          },
        });
      }
    });
  },
  messageFormat:function(message)
  {
    var sysdate = util.dateToArray(new Date(this.data.time*1000));
    console.log(this.data.time);
    var week = ['日','一','二','三','四','五','六'];
    var pre_time = this.data.last_msg_time;
    var flag = 0;
    for(var i in message){
      if(flag==0){
        this.setData({firstmsgid:message[i].id});
        flag=1;
      }
       if(message[i].send_time - pre_time>600){
          var date = util.dateToArray(new Date(message[i].send_time*1000));
          var ap = date['h']<12?"上午":(date['h']>12?"下午":"中午");
          if(date['y']>sysdate['y']){
            message[i].send_time_f = 
            date['y']+'年'+date['m']+'月'+date['d']+'日 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
          }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==1){
            message[i].send_time_f =
            '昨天 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
          }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==0){
            message[i].send_time_f =
            ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
          }else if(this.data.time-message[i].send_time<604800 && sysdate['w']>date['w']){
            message[i].send_time_f = 
            '星期'+week[date['w']]+' '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
          }else{
            message[i].send_time_f = 
            date['m']+'月'+date['d']+'日 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
          }
          pre_time = message[i].send_time;
       }
    }
    this.setData({
      last_msg_time:pre_time
    });
    return message;
  },
  msgRecord:function()
  {
    var _self = this;
    var currentmsgid = _self.data.firstmsgid;
    var toView = "msg"+currentmsgid;
    if(_self.data.isTop==false){
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 60000
      });
      getMsgRecord();
      function getMsgRecord(){
        if(!app.globalData.tokenFirstReady){
          app.login(getMsgRecord);
          return;
        }
        wx.request({
          url: app.globalData.domain+'/smallapp/im-user/msg-record', 
          data:{id:_self.data.shop_id,first_msg_id:currentmsgid},
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
            if(res.data.code == 10){
                app.login(getMsgRecord);
                return;
            }
            _self.setData({
                  time:res.data.time
            });
            if(res.data.code==1){
              if(res.data.ret.msg==''){
                _self.setData({
                  isTop:true
                });
              }else{
                var message = res.data.ret.msg;
                _self.setData({
                  last_msg_time:0
                });
                for(var i in _self.data.message){
                    message[i] = _self.data.message[i];
                }
                _self.setData({
                  message:_self.messageFormat(message),
                });
                _self.setData({
                  toView:toView
                });
              }
            }
            wx.hideToast();
          }
        });
      }
    }
  },
  newMsg:function(){
    var _self = this;
    if(!app.globalData.tokenFirstReady){
      app.login(_self.newMsg);
      return;
    }
    var uid = _self.data.shop_id;
    if(_self.data.getNewMsg){
      wx.request({
          url: app.globalData.domain+'/smallapp/im-user/msg', 
          data: { id: uid, t: new Date().getTime()},
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
            if(res.data.code == 10){
                app.login(_self.newMsg);
                return;
            }
            _self.setData({
                  time:res.data.time
            });
            if(res.data.code==1){
              if(res.data.ret.msg.length > 0){
                var message = _self.messageFormat(res.data.ret.msg);
                
                for(var i in message){
                    message[i].from = 2;
                    _self.data.message[message[i].id] = message[i];
                }
                _self.setData({
                  message:_self.data.message,
                });
                _self.setData({
                  toView:"msgbottom"
                });
              }
            }
          }
        });
      setTimeout(_self.newMsg,3000);
    }
  },
  onPullDownRefresh: function(){
     wx.stopPullDownRefresh();
  },
});