// contacts/contacts.js
var util = require('../utils/util.js');
const app = require('../app');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search: {
      enterText: '取消',
      hidden: true,
      inputFocus: false,
      status: 'notready', // 'ready on the other hand'
      queryValue: '',
      suggestQueryValue: '',
      searchSuggestValue: false,
      suggestQueryValues: []
    },
    isShangjia: false,
    contacts: []
  },
  /*搜索相关 start*/
  showRealSearch: function(){
    this.setData({
      search: util.constDeepMixin(this.data.search, {hidden: false, inputFocus: true})
    });
  },
  inputting: function(e){
    this.data.search.queryValue = e.detail.value;
    if(e.detail.value.length > 0){
      this.setData({
        search: util.constDeepMixin(this.data.search, {enterText: '确定', status: 'ready'})
      });
    } else{
      this.setData({
        search: util.constDeepMixin(this.data.search, {enterText: '取消', status: 'notready'})
      });
    }
  },
  searchEnter: function(){
    this.hideSearchMask();
    if(this.data.search.status === 'ready'){
      this.setData({
        search: util.constDeepMixin(this.data.search, {
          searchSuggestValue: false
        })
      });
      this.searchQuery(false);
    }
  },
  hideSearchMask: function(){
    this.setData({
      search: util.constDeepMixin(this.data.search, {inputFocus: false, hidden: true})
    });
  },
  //点击建议搜索关键词的handler
  searchSuggestQuery: function(e){
    this.hideSearchMask();
    this.data.search.suggestQueryValue = e.target.dataset.value;
    this.setData({
      search: util.constDeepMixin(this.data.search, {
        searchSuggestValue: true
      })
    });
    this.searchQuery(false);
  },

  //发请求去查找
  searchQuery: function(appendInfo){
    var self = this;
    searchQueryRequest();
    function searchQueryRequest(){
      if(!app.globalData.tokenFirstReady){
        app.login(searchQueryRequest);
        return;
      }
      wx.request({
        url: app.globalData.domain+'/smallapp/user/contacts-search',
        data: {
           keyword: self.data.search.searchSuggestValue ? self.data.search.suggestQueryValue : self.data.search.queryValue,
        },
        header: {
            'content-type': 'application/json',
            'access-token': wx.getStorageSync('token')
        },
        success: function(res) {
          if(res.data.code == 1){
            if(self.data.isShangjia){
              res.data.data.forEach((item) => {
                item.last_time = self.formatTimeStamp(item.last_time);
              });
            }
            self.setData({
              contacts: res.data.ret
            });
          } else if(res.data.code==10){
            app.login(searchQueryRequest);
          } else{
            if(res.data.code != 0){
              console.log(res.msg);
            }
          }
        }
      })
    }
  },
  /*搜索相关 end*/

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      isShangjia: wx.getStorageSync('role') == 'shop'
    });
  },
  //搜索浮层建议搜索类别
  loadSearchSuggest: function(){
    var self = this;
    if(!app.globalData.tokenFirstReady){
      app.login(self.loadSearchSuggest);
      return;
    }
    wx.request({
      url: app.globalData.domain+'/smallapp/user/contacts-map',
      data: {
      },
      header: {
          'content-type': 'application/json',
          'access-token': wx.getStorageSync('token')
      },
      success: function(res) {
        if(res.data.code == 10){
          app.login(self.loadSearchSuggest);
        }
        if(res.data.code === 1 && Array.isArray(res.data.ret)){
          res.data.ret = res.data.ret.slice(0, 6);
          self.setData({
            search: util.constDeepMixin(self.data.search, {suggestQueryValues: res.data.ret})
          });
        } else{
          console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/query/hot", and the response is:\n', res);
        }
      }
    });
  },
  loadContacts: function(){
    var self = this;
    if(!app.globalData.tokenFirstReady){
      app.login(self.loadContacts);
      return;
    }
      
    wx.request({
      url: `${app.globalData.domain}/smallapp/user/contacts`,
      data: {
      },
      header: {
          'content-type': 'application/json',
          'access-token': wx.getStorageSync('token')
      },
      success: function(res) {
        var result_data = "";
        if (!res.data){
          wx.showToast({
            title: '您目前通讯录为空',
          })
          return false;
        }else{
            result_data = res.data.ret;
          
        }
         if (res.data.code === 1 && Array.isArray(result_data)){
          if(self.data.isShangjia){
            result_data.forEach((item) => {
              item.last_time = self.formatTimeStamp(item.last_time);
            });
          }
          self.setData({
            contacts: result_data
          });
          //设置缓存
          var addData = result_data;
          var addressBook = addData.slice(0,30);  //设置缓存数量
          wx.setStorageSync('addressBook', addressBook);

        } else if(res.data.code==10){
          app.login(self.loadContacts);
        } else{
          console.error('API REQUEST ERROR. Something went wrong when request "/wechat/huangye/user/contacts", and the response is:\n', res);
        }
      }
    });
  },
  formatTimeStamp: function(primaryTimeStamp){
    var sysdate = util.dateToArray(new Date(this.data.time*1000));
    var week = ['日','一','二','三','四','五','六'];
    var date = util.dateToArray(new Date(primaryTimeStamp*1000));
    var ret = '';
    var ap = date['h']<12?"上午":(date['h']>12?"下午":"中午");
    if(date['y']>sysdate['y']){
      ret = 
      date['y']+'年'+date['m']+'月'+date['d']+'日 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
    }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==1){
      ret =
      '昨天 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
    }else if(sysdate['m']-date['m']==0 && sysdate['d']-date['d']==0){
      ret =
      ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
    }else{
      ret = 
      date['m']+'月'+date['d']+'日 '+ap+util.formatNumber(date['h'])+':'+util.formatNumber(date['i']);
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

    var addressBook = wx.getStorageSync('addressBook');
    if(addressBook){
      this.setData({
        contacts: addressBook
      });
    };
    this.loadContacts();
    this.loadSearchSuggest();

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
  
  }
})