var util = require('../utils/util.js');
Page({
  data:{
      role:'',
      me:{},
      hidden: false
  },
  onLoad:function(options){
    var _self = this;
    _self.setData({
      role:wx.getStorageSync('role'),
    });
    getProfile();
    function getProfile(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(getProfile);
        return;
      }
      wx.request({
          url: getApp().globalData.domain + '/smallapp/user/profile', 
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
              if(res.data.code == 10){
                  getApp().login(getProfile);
                  return;
              }
              if (res.data.code==1){
                _self.setData({
                    me:res.data.ret.profile,
                    hidden:true
                });
                wx.setStorageSync('me', res.data.ret.profile);
                console.log("role=" + _self.data.role);               
              }
          }
      });
    }
    
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  },
  tradeUrl:function(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  }
 
});