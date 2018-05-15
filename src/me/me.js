const util = require('../utils/util.js');
const app = require('../app');

Page({
    data: {
        role: '',
        me: {},
        hidden: false,
        serviceIntroducePackup: {
            unpack: false,
            packupBound: 100,
            show: false,
        },
    },
    onLoad() {
        const _self = this;
        _self.setData({
            role: wx.getStorageSync('role'),
        });

        function getProfile() {
            // if (!app.globalData.tokenFirstReady) {
            //     app.login(getProfile);
            //     return;
            // }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile`,
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    console.log(res);
                    if (res.data.code === 10) {
                        app.login(getProfile);
                        return;
                    }
                    if (res.data.code === 1) {
                        _self.setData({
                            me: res.data.ret.profile,
                            hidden: true,
                        });
                        wx.setStorageSync('me', res.data.ret.profile);
                        console.log(`role= ${_self.data.role}`);
                    }
                },
            });
        }
        getProfile();
    },
    serviceIntroducePackupSwitch() {
        const _self = this;
        if (this.data.serviceIntroducePackup.unpack === true) {
            _self.setData({
                serviceIntroducePackup: util.constDeepMixin(_self.data.serviceIntroducePackup, {
                    unpack: false,
                }),
            });
        } else {
            _self.setData({
                serviceIntroducePackup: util.constDeepMixin(_self.data.serviceIntroducePackup, {
                    unpack: true,
                }),
            });
        }
    },

    onShow() {
        this.onshowFn();
    },
    onshowFn() {
        const { hyname } = app.globalData;
        console.log(`选择的行业是：${hyname}`);
        function setProfile() {
            const _self = this;
            if (!app.globalData.tokenFirstReady) {
                app.login(this.setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `trade=${_self.data.me.trade}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(this.setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                        console.log('有值，更新数据');
                    }
                },
            });
        }
        if (hyname) {
            const _self = this;
            _self.data.me.trade = hyname;
            this.setData({
                me: _self.data.me,
            });
            setProfile();
        }
    },

    bindAddressInput(e) {
        const _self = this;
        _self.data.me.address = e.detail.value;
        this.setData({
            me: _self.data.me,
        });
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `address=${_self.data.me.address}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        setProfile();
    },
    bindPhoneInput(e) {
        const _self = this;
        _self.data.me.phone = e.detail.value;
        this.setData({
            me: _self.data.me,
        });
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `phone=${_self.data.me.phone}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        setProfile();
    },
    bindIntroInput(e) {
        const _self = this;
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `intro=${_self.data.me.intro}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        if (e.detail.value !== '') {
            _self.data.me.intro = e.detail.value;
            _self.setData({
                me: _self.data.me,
            });

            setProfile();
        }
    },
    bindTradeInput(e) {
        const _self = this;
        _self.data.me.trade = e.detail.value;
        this.setData({
            me: _self.data.me,
        });
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `trade=${_self.data.me.trade}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        setProfile();
    },
    bindAgeInput(e) {
        const _self = this;
        _self.data.me.age = e.detail.value;
        this.setData({
            me: _self.data.me,
        });
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `age=${_self.data.me.age}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        setProfile();
    },
    bindPositionInput(e) {
        const _self = this;
        function setProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/profile-set`,
                data: `position=${_self.data.me.position}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setProfile);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        wx.setStorageSync('me', _self.data.me);
                    }
                },
            });
        }
        if (e.detail.value !== '') {
            _self.data.me.position = e.detail.value;
            _self.setData({
                me: _self.data.me,
            });
            setProfile();
        }
    },
    refreshShopInfo() {
        // 页面显示
        const _self = this;
        const profileSetUrl = `${app.globalData.domain}/smallapp/shop/refresh`;
        wx.request({
            url: `${profileSetUrl}?uid=${_self.data.me.uid}`,
            method: 'GET',
            success(res) {
                const jsondata = res.data;
                if (jsondata.code === 1 && res.data.ret.profile) {
                    _self.setData({
                        me: res.data.ret.profile,
                        hidden: true,
                    });
                    wx.setStorageSync('me', res.data.ret.profile);
                }
            },
        });
    },
    onPullDownRefresh() {
        this.onLoad();
        wx.stopPullDownRefresh();
    },
    tradeUrl() {
        wx.navigateTo({
            url: '/me/trade/trade',
        });
    },
});
