const app = require('../app');

Page({
    data: {
        shop: '',
    },
    onLoad() {
        // 页面初始化 options为页面跳转所带来的参数
        const _self = this;

        function getShopInfo() {
            if (!app.globalData.tokenFirstReady) {
                app.login(getShopInfo);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/shop-info`,
                data: { id: 5 },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(getShopInfo);
                        return;
                    }
                    _self.setData({
                        shop: res.data.ret.shop,
                    });
                },
            });
        }
        getShopInfo();
    },
    onReady() {
        // 页面渲染完成
    },
    onShow() {
        // 页面显示
    },
    onHide() {
        // 页面隐藏
    },
    onUnload() {
        // 页面关闭
    },
    sendMsg() {
        wx.navigateBack({ delta: 1 });
    },
});
