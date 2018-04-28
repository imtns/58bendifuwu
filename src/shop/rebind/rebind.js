// shop/rebind/rebind.js
var tk;//获取页面传过来的参数token

const app = require('../../app');
Page({
  data:{
    qrcode:'',
    hidden:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    tk = options.tk;
    if(tk){
      console.log("获取二维码")
      this.getQrcode();
    }
    
  },
  getQrcode: function(){
    var _self = this;

    wx.request({
      url: app.globalData.domain+'/smallapp/im-shop/qrcode', 
      header: {
          'access-token': tk
      },
      success: function(res) {
        if(res.data.code == 10){
            app.login(_self.getQrcode);
            return;
        }
        if(res.data.code==1){
          _self.setData({
            qrcode:res.data.result,
            hidden:true
          });
        }
      }
    });
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
  onShareAppMessage: function () {
    return {
      title: '变更绑定',
      path: '/shop/rebind/rebind?tk='+tk,
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  }
})