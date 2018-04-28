var util = require('../utils/util.js');
const app = require('../app');
Page({
  data:{
      role:'',
      me:{},
      hidden: false,
      serviceIntroducePackup:{
        unpack: false,
        packupBound: 100,
        show: false
      }
  },
  onLoad:function(options){

    var _self = this;
    _self.setData({
      role:wx.getStorageSync('role'),
    });

    getProfile();

    function getProfile(){
      if(!app.globalData.tokenFirstReady){
        app.login(getProfile);
        return;
      }
      wx.request({
          url: app.globalData.domain + '/smallapp/user/profile', 
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
              console.log(res);
              if(res.data.code == 10){
                  app.login(getProfile);
                  return;
              }
              if (res.data.code==1){
                _self.setData({
                    me:res.data.ret.profile,
                    hidden:true,
                });
                wx.setStorageSync('me', res.data.ret.profile);
                
                console.log("role=" + _self.data.role);
              }
          }
      });
    }
    
  },
  serviceIntroducePackupSwitch: function(){
    var _self = this;
    if(this.data.serviceIntroducePackup.unpack == true){
      _self.setData({
          serviceIntroducePackup: util.constDeepMixin(_self.data.serviceIntroducePackup, {
            unpack: false
          }),
      });
    } else{
      _self.setData({
          serviceIntroducePackup: util.constDeepMixin(_self.data.serviceIntroducePackup, {
            unpack: true
          }),
      });
    }
  },
  onShow(){
      this.onshowFn();
  },
  onshowFn:function(){
    var hyname = app.globalData.hyname;
    console.log("选择的行业是："+hyname);
    if(hyname){
      var _self = this;
      _self.data.me.trade = hyname;
      this.setData({
        me: _self.data.me
      });
      setProfile();
      function setProfile(){
          if(!app.globalData.tokenFirstReady){
            app.login(setProfile);
            return;
          }
          wx.request({
            url: app.globalData.domain + '/smallapp/user/profile-set', 
              data:"trade="+_self.data.me.trade,
              method:'POST',
              header: {
                  'access-token': wx.getStorageSync('token'),
                  "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function(res) {
                  if(res.data.code == 10){
                      app.login(setProfile);
                      return;
                  }
                  var jsondata = res.data;
                  if(jsondata.code==1){
                      wx.setStorageSync('me',_self.data.me);
                      console.log("有值，更新数据");
                  }
              }
          });
      }
    }
  },
  bindAddressInput:function(e){
    var _self = this;
    _self.data.me.address = e.detail.value;
    this.setData({
      me: _self.data.me
    });
    setProfile();
    function setProfile(){
        if(!app.globalData.tokenFirstReady){
          app.login(setProfile);
          return;
        }
        wx.request({
            url: app.globalData.domain + '/smallapp/user/profile-set', 
            data:"address="+_self.data.me.address,
            method:'POST',
            header: {
                'access-token': wx.getStorageSync('token'),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                if(res.data.code == 10){
                    app.login(setProfile);
                    return;
                }
                var jsondata = res.data;
                if(jsondata.code==1){
                    wx.setStorageSync('me',_self.data.me);
                }
            }
        });
    }

  },
  bindPhoneInput:function(e){
    var _self = this;
    _self.data.me.phone = e.detail.value;
    this.setData({
      me: _self.data.me
    });
    setProfile();
    function setProfile(){
        if(!app.globalData.tokenFirstReady){
          app.login(setProfile);
          return;
        }
        wx.request({
          url: app.globalData.domain + '/smallapp/user/profile-set', 
            data:"phone="+_self.data.me.phone,
            method:'POST',
            header: {
                'access-token': wx.getStorageSync('token'),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                if(res.data.code == 10){
                    app.login(setProfile);
                    return;
                }
                var jsondata = res.data;
                if(jsondata.code==1){
                    wx.setStorageSync('me',_self.data.me);
                }
            }
        });
    }
  },
  bindIntroInput:function(e){
    var _self = this;
    if(e.detail.value!=''){
        _self.data.me.intro = e.detail.value;
        _self.setData({
        me: _self.data.me
        });
    
        setProfile();
        function setProfile(){
            if(!app.globalData.tokenFirstReady){
              app.login(setProfile);
              return;
            }
            wx.request({
              url: app.globalData.domain + '/smallapp/user/profile-set', 
                data:"intro="+_self.data.me.intro,
                method:'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    if(res.data.code == 10){
                        app.login(setProfile);
                        return;
                    }
                    var jsondata = res.data;
                    if(jsondata.code==1){
                        wx.setStorageSync('me',_self.data.me);
                    }
                }
            });
        }
    }
  },

  bindTradeInput:function(e){
    var _self = this;
    _self.data.me.trade = e.detail.value;
    this.setData({
      me: _self.data.me
    });
    setProfile();
    function setProfile(){
        if(!app.globalData.tokenFirstReady){
          app.login(setProfile);
          return;
        }
        wx.request({
          url: app.globalData.domain + '/smallapp/user/profile-set', 
            data:"trade="+_self.data.me.trade,
            method:'POST',
            header: {
                'access-token': wx.getStorageSync('token'),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                if(res.data.code == 10){
                    app.login(setProfile);
                    return;
                }
                var jsondata = res.data;
                if(jsondata.code==1){
                    wx.setStorageSync('me',_self.data.me);
                }
            }
        });
    }
  },

  bindAgeInput:function(e){
    var _self = this;
    _self.data.me.age = e.detail.value;
    this.setData({
      me: _self.data.me
    });
    setProfile();
    function setProfile(){
        if(!app.globalData.tokenFirstReady){
          app.login(setProfile);
          return;
        }
       
        wx.request({
          url: app.globalData.domain + '/smallapp/user/profile-set', 
            data:"age="+_self.data.me.age,
            method:'POST',
            header: {
                'access-token': wx.getStorageSync('token'),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(res) {
                if(res.data.code == 10){
                    app.login(setProfile);
                    return;
                }
                var jsondata = res.data;
                if(jsondata.code==1){
                    wx.setStorageSync('me',_self.data.me);
                }
            }
        });
    }
  },

  bindPositionInput:function(e){
    var _self = this;
    if(e.detail.value!=''){
        _self.data.me.position = e.detail.value;
        _self.setData({
            me: _self.data.me
        });
    
        setProfile();
        function setProfile(){
            if(!app.globalData.tokenFirstReady){
              app.login(setProfile);
              return;
            }
           
            wx.request({
              url: app.globalData.domain + '/smallapp/user/profile-set', 
                data:"position="+_self.data.me.position,
                method:'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function(res) {
                    if(res.data.code == 10){
                        app.login(setProfile);
                        return;
                    }
                    var jsondata = res.data;
                    if(jsondata.code==1){
                        wx.setStorageSync('me',_self.data.me);
                    }
                }
            });
        }
    }
  },

  refreshShopInfo: function () {
    // 页面显示
    
      var _self = this;
        var profile_set_url = app.globalData.domain + '/smallapp/shop/refresh';
        
        wx.request({
          url: profile_set_url + "?uid=" + _self.data.me.uid,
          method: 'GET',
          success: function (res) {
            var jsondata = res.data;
            if (jsondata.code == 1 && res.data.ret.profile) {
              _self.setData({
                me: res.data.ret.profile,
                hidden: true,
              });
              wx.setStorageSync('me', res.data.ret.profile);
            }
          }
        });
  
   },

  
  onPullDownRefresh: function(){
      this.onLoad();
     wx.stopPullDownRefresh();
  },

  tradeUrl:function(){
    wx.navigateTo({
      url: "/me/trade/trade"
    });
  }
 
});