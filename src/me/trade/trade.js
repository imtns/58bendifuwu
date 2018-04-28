import globalDataService from '../../globalDataService.js';
Page({

  data: {
    
  },

  urlFn:function(e){
      var name = e.currentTarget.dataset.name;
      globalDataService.set('hyname',name)
      //app.globalData.hyname = name;
  },

})