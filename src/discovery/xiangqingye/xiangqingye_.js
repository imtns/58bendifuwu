// discovery/xiangqingye/xiangqingye.js
var util = require('../../utils/util.js');
const app = require('../../app');
var timerId = null;//定时器
var urlMap = null;//首次加载是否展示地图
var urlTel = null;//首次加载是否展示电话弹窗
var im = require('../../utils/IMInit.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoDetail: {
      pinzhong: '', //品种
      price: '',  //价格
      yimiao: '',  //疫苗情况
      quchong: '',  //驱虫情况
      images: {
        count: 12,  //一共有多少张图片
        urls: []
      },

      /*黄页类别独有*/
      enterpriseName: '',  //公司名称
      serviceType: '',  //服务类型
      vipTerm: '',  //会员年限
      serviceIntroduce: '', //服务介绍

      /*共有*/
      title: '',  //title
      date: '',  //发布时间
      longitude: '',  //经度
      latitude: '',  //纬度
      enterpriseAddress: '',  //公司名称
      infoid: "",
      userId: "",
      username: "",  //用户昵称
      photo: '', //用户头像
    },

    serviceIntroduceContentPackup: true,
    mapMarkers: [{
      iconPath: "/image/map_marker_icon.png",
      id: 0,
      latitude: 0,
      longitude: 0,
      width: 30,
      height: 30
    }],
    isPet: false,
    cate2ListName: "",
    infoid: "",
    wchatable: 0,
    sign: 0,
    city: 'tj',
    cityId: 18,
    call: {
      teleNumber: 400000000,
      tick: 0,
      hidden: true
    },
    wechat: {
      shopid : '商家id',
      photo : '商家头像',
      name:'商家名称'
    },
    ismap:false,
    detail_telData:{}, //缓存数据
    openid:'' //pc扫码弹出电话新增参数
  },
  preViewImage:function(){
    var self = this;
    var urls = [];
    self.data.infoDetail.images.forEach(val => {
      urls.push( val.image );
    });
    wx.previewImage({
      urls: urls// 需要预览的图片http链接列表
    });
  },
  serviceIntroducePackupSwitch: function(){
    if(this.data.serviceIntroduceContentPackup){
      this.setData({serviceIntroduceContentPackup: false});
    } else{
      this.setData({serviceIntroduceContentPackup: true});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (app.globalData.testHeader["id58"] == "") {
      app.globalData.testHeader["id58"] = util.getId58();
    }
    urlMap = false;
    urlTel = false;

    if(options.map){ urlMap = true; };
    if(options.tel){ urlTel = true; };

    //initiate data
    this.setData({
      cate2ListName: options.cate2ListName,
      infoid: options.infoid,
      city: options.city,
      cityId: options.cityId,
      wchatable: options.wchatable,
      sign: options.sign,
      isPet: options.isPet == 'true',
      openid: options.openid ? options.openid : ''
    });
    this.loadDetailInfo();
  },
  loadDetailInfo: function(){
    var self = this;
    wx.request({
      url: app.globalData.domain+`/smallapp/detail/${self.data.cate2ListName}/${self.data.infoid}`,
      data: {
         localName: self.data.city
      },
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        if(res.data.code === 0){
          var formatedData = self.customFormatDetailData(res.data.data);
          if(formatedData.coord){
            self.setData({
              infoDetail: util.constDeepMixin(self.data.infoDetail, formatedData),
              ismap:true,
              mapMarkers: [{
                iconPath: "/image/map_marker_icon.png",
                id: 0,
                latitude: formatedData.coord.latitude,
                longitude: formatedData.coord.longitude,
                width: 30,
                height: 30
              }]
            });
          }else{
            //针对拼车等没有地址做判断
            self.setData({
              infoDetail: util.constDeepMixin(self.data.infoDetail, formatedData),
              ismap:false,
              mapMarkers: [{
                iconPath: "/image/map_marker_icon.png",
                id: 0,
                width: 30,
                height: 30
              }]
            });
          };

          if(urlMap){
            self.onmapFun();
          };
          if(urlTel){
            self.first_call();
          };

        } else{
          console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/detail", and the response is:\n', res);
        }
      }
    });
  },
  customFormatDetailData: function(srcData){
    var ret = srcData;
    if(ret.params.gobcompanyname){  //公司名称变态修改
      ret.params.gobcompanyname.value = ret.params.gobcompanyname.value.replace(/.*\|/, '');
    }
    if(ret.content){ //去掉html标签
      ret.content = ret.content.replace(/<br>/g, '\n');
      ret.content = ret.content.replace(/<.*?>/g, '');
      ret.content = ret.content.replace(/&nbsp;/g, '');
    }
    return ret;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("详情页卸载清空缓存")
    wx.setStorageSync('detail_telData', {});
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
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
  onmapFun(){
    var that= this;
    var x = Math.floor(that.data.mapMarkers[0].latitude*100000)/100000;
    var y = Math.floor(that.data.mapMarkers[0].longitude*100000)/100000;
    wx.openLocation({
      latitude: x,
      longitude: y,
      address: that.data.infoDetail.address,
      name: that.data.infoDetail.params.gobcompanyname.value ? that.data.infoDetail.params.gobcompanyname.value:""
    })
  },
  /*小程序聊天 s*/
  wechat: function(e){
    var self = this;
    //请求回来聊天需要的数据
    console.log(e);
    getShopInfo();
    function getShopInfo(){
      if(!getApp().globalData.tokenFirstReady){
        getApp().login(getShopInfo);
        return;
      }
      wx.request({
        url: app.globalData.domain+'/smallapp/im-shop/shop-info',
        data: {
          infoid: e.currentTarget.dataset.infoid,
        },
        header: {
            'content-type': 'application/json',
            'access-token': wx.getStorageSync('token')
        },
        success: function(res) {
          if(res.data.code === 1){
            self.setData({
              wechat: util.constDeepMixin(self.data.wechat, res.data.ret)
            });
            //开始聊天
            openRoom();
          } else if(res.data.code==10){
            getApp().login(getShopInfo);
          } else{
            console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/im-shop/shop-info", and the response is:\n', res);
          }
        }
      });
    }
    function openRoom(){
        wx.navigateTo({
          url: '/user/room/room?id='+self.data.wechat.shopid
          +"&name="+self.data.wechat.name
          +"&photo="+self.data.wechat.photo
        });
    };
  },
  /*小程序聊天 e*/
/*接入微聊*/
  goChat: function (e) {
    console.log("从发的烧烤富家大室分开");
    var userid = e.currentTarget.dataset.userid;
    var options = {
      user_id: userid,
      user_source: 2,
      refer: {
        invitation: {
          id: e.currentTarget.dataset.infoid,              //帖子id
          rootcateid: e.currentTarget.dataset.listName,  //一级分类id(表现类别)
          cateid: "",          //最细类别id(表现类别)
          scene: "",            // 聊天触发的场景(listing"为列表详情页，其余由业务侧自己定义)
          role: 1,                 // 角色标识,"1"为发帖者(业务线统一都传"1")
          refer_time: (new Date()).getTime()
        }
      },
      router_type: 'navigateTo'
    }
    im.gotoChat(options);
  },
  IMsuccess: function () {

  },
  IMerror: function (err) {
    console.log(err.msg);
    // wx.redirectTo({
    //   url: '../vendors/passport/login/login',
    // })
  },
  /*打电话 s*/
  call_tick: function(e){
    var self = this;

    //读取缓存
    var detail_telData = wx.getStorageSync('detail_telData');
    var _id = e.currentTarget.dataset.infoid;
    if(detail_telData){
      if(detail_telData[_id]){
        console.log("有缓存");
        var newtime = Date.parse(new Date()) / 1000; //获取当前时间戳 
        var oldtime = detail_telData[_id].time + 180; //缓存多少秒
        var _time = oldtime - newtime ;
        if( _time >=0 ){
          console.log("走的缓存时间,需要弹出电话弹框："+ _time)
          self.setData({
            call: util.constDeepMixin(self.data.call, {
              teleNumber: detail_telData[_id].teleNumber,
              tick: _time,
              hidden: false
            })
          });
          self.callTimer();
        }else{
          console.log("过期了，重新ajax获取并缓存了")
          self.setData({ detail_telData:detail_telData });    
          telfn();
        };
      }else{
        //没有缓存 id 执行ajax
        console.log("有缓存，但是没有此电话号码的缓存");
        self.setData({ detail_telData:detail_telData });          
        telfn();
      }
    }else{
      //没有缓存  执行ajax，添加缓存。  缓存id、电话、和 当前时间戳（js获取）
      console.log("没有缓存");
      telfn();
    };

    //telfn();
    function telfn(){
      wx.request({
        url: app.globalData.domain+'/smallapp/common/link',
        data: {
          sign: e.currentTarget.dataset.sign,
          infoId: e.currentTarget.dataset.infoid,
          source: e.currentTarget.dataset.source,
          type: 0,
        },
        header: app.globalData.testHeader,
        success: function(res) {
          if(res.data.code === 0){
            self.setData({
              call: util.constDeepMixin(self.data.call, {
                teleNumber: parseInt(res.data.data[0])+1 ? res.data.data : "服务忙",
                tick: 180,
                hidden: false
              })
            });
            self.callTimer();

            //设置缓存
            var timestamp = Date.parse(new Date()) / 1000; //获取当前时间戳 
            var obj = self.data.detail_telData;
            obj[_id] = {
              time:timestamp,
              teleNumber:parseInt(res.data.data[0])+1 ? res.data.data : "服务忙",
            };

            wx.setStorageSync('detail_telData', obj);


          } else{
            console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/common/link", and the response is:\n', res);
          }
        }
      });
    };

  },
  callTimer: function(){
    var self = this;
    clearInterval(timerId);
    timerId = setInterval(function(){
      if( self.data.call.tick > 1 ){
        self.setData({
          call: util.constDeepMixin(self.data.call, {
            tick: --self.data.call.tick
          })
        });
      } else{
        clearInterval(timerId);
        self.setData({
          call: util.constDeepMixin(self.data.call, {
            tick: 0,
            hidden: true
          })
        });
      }
    }, 1000);
  },
  cancel_call: function(){
    var self = this;
    clearInterval(timerId);
    self.setData({
      call: util.constDeepMixin(self.data.call, {
        tick: 0,
        hidden: true
      })
    });
  },
  call: function(){
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.call.teleNumber
    })
  },
  /*打电话 e*/

  /*第一次是否打电话 s*/
  first_call: function(e){
    var self = this;

      wx.request({
        url: app.globalData.domain+'/smallapp/common/link',
        data: {
          sign: self.data.sign,
          infoId: self.data.infoid,
          source: 1,
          type: 0,
          openid: self.data.openid
        },
        header: app.globalData.testHeader,
        success: function(res) {
          if(res.data.code === 0){
            self.setData({
              call: util.constDeepMixin(self.data.call, {
                teleNumber: parseInt(res.data.data[0])+1 ? res.data.data : "服务忙",
                tick: 180,
                hidden: false
              })
            });
            self.callTimer();

            //设置缓存
            var timestamp = Date.parse(new Date()) / 1000; //获取当前时间戳 
            var obj = self.data.detail_telData;
            obj[self.data.infoid] = {
              time:timestamp,
              teleNumber:parseInt(res.data.data[0])+1 ? res.data.data : "服务忙",
            };
            wx.setStorageSync('detail_telData', obj);

          } else{
            console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/common/link", and the response is:\n', res);
          }
        }
      });

  }
  /*第一次是否打电话 e*/

})