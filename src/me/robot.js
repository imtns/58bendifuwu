Page({
  data:{
      shop:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    getShopInfo();
    function getShopInfo(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(getShopInfo);
        return;
      }
      wx.request({
          url: getApp().globalData.domain+'/smallapp/im-user/shop-info', 
          data:{id:5},
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
              if(res.data.code == 10){
                  getApp().login(getShopInfo);
                  return;
              }
              _self.setData({
                  shop:res.data.ret.shop
              });
          }
      });
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
 
  sendMsg:function(){
      wx.navigateBack({delta: 1});
  }
 
});