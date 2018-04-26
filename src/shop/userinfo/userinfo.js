var util = require('../../utils/util.js');

Page({
  data:{
      user:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var _self = this;
    options.role && wx.setStorageSync('role', options.role);

    var url_id= options.id;
    var storage_data = wx.getStorageSync('userlistData');
    if(storage_data){
      if(storage_data[url_id]){
        console.log("读取缓存数据")
        _self.setData({
          user:storage_data[url_id]
        });
      };
    };

    getUserInfo();
    function getUserInfo(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(getUserInfo);
        return;
      }
      wx.request({
          url: getApp().globalData.domain+'/smallapp/shop/user-info', 
          data:{id:options.id},
          header: {
              'access-token': wx.getStorageSync('token')
          },
          success: function(res) {
              if(res.data.code == 10){
                  getApp().login(getUserInfo);
                  return;
              }
               _self.setData({
                  user:res.data.ret.user
              });

               //设置缓存
               var kid = res.data.ret.user.id;
               var userlistData = {};
               var resUser=  res.data.ret.user;
               resUser.time =  res.data.time;     
               userlistData[kid] = resUser;
               //深层复制
               var userlistDatas= util.constDeepMixin(userlistData, wx.getStorageSync('userlistData'));
               //管理缓存
               var timestamp = Date.parse(new Date()) / 1000; //获取当前时间戳 
               timestamp = timestamp - 259200;//三天前时间戳
               var x ;
               for(x in userlistDatas){
                   var time = userlistDatas[x].time;//获取时间戳
                   if(time){
                       if(timestamp>time){//三天前>缓存时间 删除
                           console.log("删除三天前的缓存");
                           delete userlistDatas[x];
                       }
                   }
               };
               //设置最新的缓存
               wx.setStorageSync('userlistData', userlistDatas);

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
  bindTopInput:function(e){
    //   console.log(e.detail.value);
    var _self = this;
    if (_self.data.user==""){
      return;
    }
    _self.data.user.top = e.detail.value?1:2;
    this.setData({
      user: _self.data.user
    });
    userSet();
    function userSet(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(userSet);
        return;
      }
      wx.request({
          url: getApp().globalData.domain+'/smallapp/im-shop/user-set', 
          data:"id="+_self.data.user.id+"&top="+_self.data.user.top,
          method:'POST',
          header: {
              'access-token': wx.getStorageSync('token'),
              "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
              if(res.data.code == 10){
                  getApp().login(userSet);
                  return;
              }
              var jsondata = res.data;
              if(jsondata.code==1){
                  
              }
          }
      });
    }

  },
  bindRemarkInput:function(e){
    //   console.log(e.detail.value);
    var _self = this;
    if (_self.data.user == "") {
      return;
    }
    _self.data.user.remark = e.detail.value;
    this.setData({
      user: _self.data.user
    });
    userSet();
    function userSet(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(userSet);
        return;
      }
      wx.request({
          url: getApp().globalData.domain+'/smallapp/im-shop/user-set', 
          data:"id="+_self.data.user.id+"&remark="+_self.data.user.remark,
          method:'POST',
          header: {
              'access-token': wx.getStorageSync('token'),
              "Content-Type": "application/x-www-form-urlencoded"
          },
          success: function(res) {
              if(res.data.code == 10){
                  getApp().login(userSet);
                  return;
              }
              var jsondata = res.data;
              if(jsondata.code==1){
                  
              }
          }
      });
    }
  },

  sendMsg:function(){
    console.log(this.data);
    var _self = this;
    wx.navigateTo({
      url: '/'+wx.getStorageSync('role')+'/room/room?id='+_self.data.user.id
      +"&name="+_self.data.user.name
      +"&photo="+_self.data.user.photo
    });
  }
 
});