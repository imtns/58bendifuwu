/*  eslint-disable */
const util = require('../../utils/util.js');
const im = require('../../utils/IMInit.js');
const app = require('../../app');

Page({
    data: {
        shop: '',
        serviceIntroduceContentPackup: true,
        call: {
            tick: 0,
            hidden: true,
        },
    },
    onLoad(options) {
        // 页面初始化 options为页面跳转所带来的参数
        const _self = this;
        const url_id = options.id;
        const storage_data = wx.getStorageSync('shoplistData');
        if (storage_data) {
            if (storage_data[url_id]) {
                console.log('读取缓存数据');
                _self.setData({
                    shop: storage_data[url_id],
                });
            }
        }
        function getShopInfo() {
            if (!app.globalData.tokenFirstReady) {
                app.login(getShopInfo);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/shop-info`,
                data: { id: options.id },
                header: {
                    'access-token': wx.getStorageSync('token'),
                    id58: app.globalData.testHeader.id58,
                    version: '7',
                    channel: '5',
                    ip: '10.252.22.236',
                    'content-type': 'application/json',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(getShopInfo);
                        return;
                    }
                    if (res.data.code === 1) {
                        _self.setData({
                            shop: res.data.ret.shop,
                            call: util.constDeepMixin(_self.data.call, {
                                tick: 180,
                            }),
                        });
                        _self.callTimer();
                        // 设置缓存
                        const kid = res.data.ret.shop.id;
                        const shoplistData = {};
                        const resShop = res.data.ret.shop;
                        resShop.time = res.data.time;
                        shoplistData[kid] = resShop;
                        // 深层复制
                        const shoplistDatas = util.constDeepMixin(shoplistData, wx.getStorageSync('shoplistData'));
                        // 管理缓存
                        let timestamp = Date.parse(new Date()) / 1000; // 获取当前时间戳
                        timestamp -= 259200; // 三天前时间戳
                        Object.keys(shoplistDatas).forEach(x => {
                            const { time } = shoplistDatas[x]; // 获取时间戳
                            if (time) {
                                if (timestamp > time) { // 三天前>缓存时间 删除
                                    console.log('删除三天前的缓存');
                                    delete shoplistDatas[x];
                                }
                            }
                        });
                        // 设置最新的缓存
                        wx.setStorageSync('shoplistData', shoplistDatas);
                    }
                },
            });
        }
        getShopInfo();
    },
    serviceIntroducePackupSwitch() {
        if (this.data.serviceIntroduceContentPackup) {
            this.setData({ serviceIntroduceContentPackup: false });
        } else {
            this.setData({ serviceIntroduceContentPackup: true });
        }
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
    bindAcceptInput(e) {
        //   console.log(e.detail.value);
        const _self = this;
        _self.data.shop.accept = e.detail.value ? 1 : 2;
        this.setData({
            shop: _self.data.shop,
        });

        function setShopProfile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(setShopProfile);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/user/shop-set`,
                data: `id=${_self.data.shop.id}&accept=${_self.data.shop.accept}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(setShopProfile);
                    }
                },
            });
        }
        setShopProfile();
    },
    callTimer() {
        const self = this;
        const timerId = setInterval(() => {
            if (self.data.call.tick > 1) {
                self.setData({
                    call: util.constDeepMixin(self.data.call, {
                        tick: --self.data.call.tick,
                    }),
                });
            } else {
                clearInterval(timerId);
                self.setData({
                    call: util.constDeepMixin(self.data.call, {
                        tick: 0,
                    }),
                });
            }
        }, 1000);
    },
    call_tick() {
        const self = this;
        console.log();
        self.setData({
            call: util.constDeepMixin(self.data.call, {
                hidden: self.data.call.tick <= 0,
            }),
        });
    },
    call() {
        const self = this;
        wx.makePhoneCall({
            phoneNumber: self.data.shop.phone,
        });
    },
    cancel_call() {
        const self = this;
        self.setData({
            call: util.constDeepMixin(self.data.call, {
                hidden: true,
            }),
        });
    },
    complainMsg() {
        wx.navigateTo({
            url: '/user/room/room?id=5&name=投诉反馈小秘书&photo=http://img.58cdn.com.cn/client_upload_pic/logo/lbg_logo.png',
        });
    },
    sendMsg() {
        const _self = this.data.shop;
        const options = {
            user_id: _self.id, // 聊天对方 id
            user_source: '2', // 聊天对方来源
            refer: {
                invitation: {
                    id: _self.info_id, // 帖子id
                    rootcateid: '', // 一级分类id(表现类别)
                    cateid: '', // 最细类别id(表现类别)
                    scene: 'listing', // 聊天触发的场景(listing"为列表详情页，其余由业务侧自己定义)
                    role: 1, // 角色标识,"1"为发帖者(业务线统一都传"1")
                    refer_time: (new Date()).getTime(),
                },
            },
            router_type: 'navigateTo', // 打开聊天页面方式 ：navigateTo（默认），redirectTo,navigateBack,switchTab,reLaunchtoken
        };
        im.gotoChat(options);
        // wx.navigateTo({
        //   url: '/'+wx.getStorageSync('role')+'/room/room?id='+_self.data.shop.id
        //   +"&name="+_self.data.shop.name
        //   +"&photo="+_self.data.shop.logo
        // });
    },
});
