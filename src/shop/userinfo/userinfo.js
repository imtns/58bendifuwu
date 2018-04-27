const util = require('../../utils/util.js');
const app = require('../../app');
Page({
    data: {
        user: '',
    },
    onLoad(options) {
        // 页面初始化 options为页面跳转所带来的参数
        const _self = this;
        options.role && wx.setStorageSync('role', options.role);

        const url_id = options.id;
        const storage_data = wx.getStorageSync('userlistData');
        if (storage_data) {
            if (storage_data[url_id]) {
                console.log('读取缓存数据');
                _self.setData({
                    user: storage_data[url_id],
                });
            }
        }

        getUserInfo();
        function getUserInfo() {
            if (!app.globalData.tokenFirstReady) {
                app.login(getUserInfo);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/shop/user-info`,
                data: { id: options.id },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code == 10) {
                        app.login(getUserInfo);
                        return;
                    }
                    _self.setData({
                        user: res.data.ret.user,
                    });

                    // 设置缓存
                    const kid = res.data.ret.user.id;
                    const userlistData = {};
                    const resUser = res.data.ret.user;
                    resUser.time = res.data.time;
                    userlistData[kid] = resUser;
                    // 深层复制
                    const userlistDatas = util.constDeepMixin(
                        userlistData,
                        wx.getStorageSync('userlistData'),
                    );
                    // 管理缓存
                    let timestamp = Date.parse(new Date()) / 1000; // 获取当前时间戳
                    timestamp -= 259200; // 三天前时间戳
                    let x;
                    for (x in userlistDatas) {
                        const time = userlistDatas[x].time; // 获取时间戳
                        if (time) {
                            if (timestamp > time) {
                                // 三天前>缓存时间 删除
                                console.log('删除三天前的缓存');
                                delete userlistDatas[x];
                            }
                        }
                    }
                    // 设置最新的缓存
                    wx.setStorageSync('userlistData', userlistDatas);
                },
            });
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
    bindTopInput(e) {
        //   console.log(e.detail.value);
        const _self = this;
        if (_self.data.user == '') {
            return;
        }
        _self.data.user.top = e.detail.value ? 1 : 2;
        this.setData({
            user: _self.data.user,
        });
        userSet();
        function userSet() {
            if (!app.globalData.tokenFirstReady) {
                app.login(userSet);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-shop/user-set`,
                data: `id=${_self.data.user.id}&top=${_self.data.user.top}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code == 10) {
                        app.login(userSet);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code == 1) {
                    }
                },
            });
        }
    },
    bindRemarkInput(e) {
        //   console.log(e.detail.value);
        const _self = this;
        if (_self.data.user == '') {
            return;
        }
        _self.data.user.remark = e.detail.value;
        this.setData({
            user: _self.data.user,
        });
        userSet();
        function userSet() {
            if (!app.globalData.tokenFirstReady) {
                app.login(userSet);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-shop/user-set`,
                data: `id=${_self.data.user.id}&remark=${_self.data.user.remark}`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code == 10) {
                        app.login(userSet);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code == 1) {
                    }
                },
            });
        }
    },

    sendMsg() {
        console.log(this.data);
        const _self = this;
        wx.navigateTo({
            url: `/${wx.getStorageSync('role')}/room/room?id=${_self.data.user.id}&name=${
                _self.data.user.name
            }&photo=${_self.data.user.photo}`,
        });
    },
});
