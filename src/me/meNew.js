const app = require('../app');
const { track } = require('../utils/track.js');

Page({
    data: {
        role: '',
        me: {},
        hidden: false,
        url: '',
    },
    onLoad() {
        track('show', {
            pagetype: 'me', // 页面类型，没有置空【必填】
        });
        const _self = this;
        _self.setData({
            role: wx.getStorageSync('role'),
        });
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        success(resp) {
                            _self.setData({
                                userInfo: resp.userInfo,
                            });
                            _self.getProfile();
                        },
                    });
                }
            },
        });
    },
    getProfile(callback) {
        const _self = this;
        wx.request({
            url: `${app.globalData.domain}/smallapp/user/profile`,
            header: {
                'access-token': wx.getStorageSync('token'),
            },
            success(res) {
                if (res.data.code === 10) {
                    // app.login(this.getProfile);
                    //  return;
                }
                if (res.data.code === 1) {
                    _self.setData({
                        me: res.data.ret.profile,
                        hidden: true,
                    });
                    wx.setStorageSync('me', res.data.ret.profile);
                    console.log(`role=${_self.data.role}`);
                    callback && callback();
                }
            },
        });
    },
    bindGetUserInfo(e) {
        if (e.detail.userInfo) {
            this.getProfile();
            if (e.currentTarget.dataset.url) {
                wx.navigateTo({
                    url: e.currentTarget.dataset.url,
                });
            }
            console.log(e.detail.userInfo);
        }
    },
    onShow() {},
    onHide() {},
    onUnload() {},
    tradeUrl(e) {
        if (e) {
            const { url } = e.currentTarget.dataset;
            this.setData({
                url,
            });
        }
        if (Object.keys(this.data.me).length === 0) {
            this.getUserInfo(this.tradeUrl);
        } else {
            wx.navigateTo({
                url: this.data.url,
            });
        }
    },
    callService() {
        wx.makePhoneCall({
            phoneNumber: '4008107258',
        });
    },
});
