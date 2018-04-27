const app = require('../../app');
Page({
  data: {
    motto: '请扫描58同城本地服务帖子二维码！',
    userInfo: {}
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})