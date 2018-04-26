Page({

  data: {
    
  },

  urlFn:function(e){
      var name = e.currentTarget.dataset.name;
      getApp().globalData.hyname = name;
  },

})