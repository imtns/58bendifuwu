const util = require('../utils/util.js');
const app = require('../app');

Page({
    data: {
        role: '',
        me: {},
        hidden: false,
    },
    onLoad(options) {
        const _self = this;
        _self.setData({
            role: wx.getStorageSync('role'),
        });
        getProfile();
        function getProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(getProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile`,
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code == 10) {
                        app.login(getProfile);
                        return;
                    }
                    if (res.data.code == 1) {
                        _self.setData({
                            me: res.data.ret.profile,
                            hidden: true,
                        });
                        wx.setStorageSync('me', res.data.ret.profile);
                        console.log(`role=${_self.data.role}`);
                    }
                },
            });
        }
    },
    onShow() {},
    onHide() {},
    onUnload() {},
    tradeUrl(e) {
        const url = e.currentTarget.dataset.url;
        wx.navigateTo({
            url: url,
        });
    },
    callService() {
        wx.makePhoneCall({
            // TODO: 填写正确的客服电话
            phoneNumber: '40056782991',
        });
    },
});
