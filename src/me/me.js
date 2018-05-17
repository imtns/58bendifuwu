/* eslint-disable */
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
        wx.request({
            url: `${app.globalData.domain}/smallapp/user/profile`,
            header: {
                'access-token': wx.getStorageSync('token'),
            },
            success(res) {
                console.log(res);
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
        const { hyname } = app.globalData;
        if (hyname) {
            this.setData({
                ['me.trade']: hyname,
            });
            this.setProfile()
        }
    },
    bindAddressInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.address']: e.detail.value,
        });
        this.setProfile();
    },
    bindPhoneInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.phone']: e.detail.value,
        });
        this.setProfile();
    },
    bindIntroInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.intro']: e.detail.value,
        });
        this.setProfile();
    },
    bindTradeInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.trade']: e.detail.value,
        });
        this.setProfile();
    },
    bindAgeInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.age']: e.detail.value,
        });
        this.setProfile();
    },
    bindPositionInput(e) {
        if (e.detail.value === '') return;
        this.setData({
            ['me.position']: e.detail.value,
        });
        this.setProfile();
    },
    setProfile() {
        var that = this;
        const data = {
            phone: this.data.me.phone || '',
            intro: this.data.me.intro || '',
            trade: this.data.me.trade || '',
            age: this.data.me.age || '',
            position: this.data.me.position || '',
        };
        var val = Object.keys(data).reduce(function(a, k) { if(data[k]){ a.push(k + '=' + data[k])}; return a } , []).join('&')
        console.log(val)
        wx.request({
            url: `${app.globalData.domain}/smallapp/user/profile-set`,
            data: val,
            method: 'POST',
            header: {
                'access-token': wx.getStorageSync('token'),
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            success(res) {
                if (res.data.code === 1) {
                    wx.setStorageSync('me', that.data.me);
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
