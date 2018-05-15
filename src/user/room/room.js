// shop/room/room.js
const util = require('../../utils/util.js');
const app = require('../../app');

Page({
    data: {
        sendType: 'input',
        inputValue: '',
        shop_name: '',
        shop_photo: '',
        shop_id: '',
        message: {},
        toView: 'msgbottom',
        time: Date.parse(new Date()) / 1000,
        firstmsgid: 0,
        isTop: false,
        voice_time: 0,
        getNewMsg: true,
        last_msg_time: 0,
        shopinfo_url: '',
        packupBound: 30,
        newsdata: {}, // 缓存数据
        first_options: {},
        ismusic: false,
    },
    msgPackupSwitch(e) {
        const self = this;
        const { msgid } = e.currentTarget.dataset;
        const msgMix = {};
        msgMix[msgid] = {};
        if (this.data.message[msgid].unPackedUp) {
            msgMix[msgid].unPackedUp = false;
        } else {
            msgMix[msgid].unPackedUp = true;
        }
        self.setData({
            message: util.constDeepMixin(self.data.message, msgMix),
        });
    },
    onLoad(options) {
        // 页面初始化 options为页面跳转所带来的参数
        const _self = this;
        const urlId = options.id;
        wx.setNavigationBarTitle({ title: options.name });
        this.setData({
            first_options: options,
            shop_name: options.name,
            shop_photo: options.photo,
            shop_id: options.id,
            shopinfo_url: `/user/shopinfo/shopinfo?id=${options.id}`,
            user: wx.getStorageSync('user_me'),
        });
        const news = wx.getStorageSync('news');
        if (news) {
            if (news[urlId]) {
                console.log('读取缓存数据开始');
                this.setData({
                    message: news[urlId].message,
                    shop_name: news[urlId].shop_name,
                    shop_photo: news[urlId].shop_photo,
                    shop_id: news[urlId].shop_id,
                    shopinfo_url: news[urlId].shopinfo_url,
                    user: news[urlId].user,
                    newsdata: news,
                });
                console.log('读取缓存数据结束');
                this.setData({
                    toView: 'msgbottom',
                });
            } else {
                console.log('有缓存，没有这个聊天的缓存');
                this.setData({
                    newsdata: news,
                });
            }
        } else {
            console.log('没有缓存');
        }

        function msgRecord() {
            if (!app.globalData.tokenFirstReady) {
                app.login(msgRecord);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/msg-record`,
                data: { id: options.id },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(msgRecord);
                        return;
                    }
                    _self.setData({
                        time: res.data.time,
                    });
                    if (res.data.code === 1) {
                        _self.setData({
                            message: _self.messageFormat(res.data.ret.msg),
                            shop_name: options.name,
                            shop_photo: options.photo,
                            shop_id: options.id,
                            shopinfo_url: `/user/shopinfo/shopinfo?id=${options.id}`,
                            user: wx.getStorageSync('user_me'),
                            getNewMsg: true,
                        });
                        _self.setData({
                            toView: 'msgbottom',
                        });
                    }
                },
            });
        }
        msgRecord();
    },
    onReady() {
        // 页面渲染完成
        const _self = this;
        _self.animation = wx.createAnimation();
    },
    onShow() {
        // 页面显示
        this.setData({
            getNewMsg: true,
        });
        setTimeout(this.newMsg, 3000);
    },
    onHide() {
        // 页面隐藏
        this.setData({
            getNewMsg: false,
        });
    },
    onUnload() {
        // 页面关闭
        console.log('页面关闭le ....');
        const _self = this;
        /* eslint-disable camelcase */
        const { first_options } = _self.data;
        function msgRecord() {
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/msg-record`,
                data: { id: first_options.id },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    _self.setData({
                        time: res.data.time,
                    });
                    if (res.data.code === 1) {
                        // 设置缓存
                        const obj = _self.data.newsdata;
                        obj[first_options.id] = {
                            time: res.data.time,
                            message: _self.messageFormat(res.data.ret.msg),
                            shop_name: first_options.name,
                            shop_photo: first_options.photo,
                            shop_id: first_options.id,
                            shopinfo_url: `/user/shopinfo/shopinfo?id=${first_options.id}`,
                            user: wx.getStorageSync('user_me'),
                        };
                        // 管理缓存
                        let timestamp = Date.parse(new Date()) / 1000; // 获取当前时间戳
                        timestamp -= 172800; // 两天前时间戳
                        Object.keys(obj).forEach(x => {
                            const { time } = obj[x]; // 获取时间戳
                            if (time) {
                                if (timestamp > time) { // 两天前>缓存时间 删除
                                    console.log('删除2天前的缓存');
                                    delete obj[x];
                                }
                            }
                        });
                        wx.setStorageSync('news', obj);
                    }
                },
            });
        }
        msgRecord();


        this.setData({
            getNewMsg: false,
        });
    },
    send(e) {
        const _self = this;
        const content = e.detail.value;
        function sendReq() {
            if (!app.globalData.tokenFirstReady) {
                app.login(sendReq);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/send`,
                data: `id=${_self.data.shop_id}&content=${content}&type=1&from=1`,
                method: 'POST',
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(sendReq);
                        return;
                    }
                    const jsondata = res.data;
                    if (jsondata.code === 1) {
                        jsondata.ret.msg.from = 1;
                        _self.data.message[jsondata.ret.msg.id] = jsondata.ret.msg;
                        _self.setData({
                            message: _self.messageFormat(_self.data.message),
                            inputValue: '',
                        });
                        _self.setData({
                            toView: 'msgbottom',
                        });
                    }
                    _self.setData({
                        time: res.data.time,
                    });
                },
            });
        }
        if (e.detail.value != null && e.detail.value.trim() !== '') {
            sendReq();
        }
    },
    sendType() {
        const that = this;
        const type = that.data.sendType === 'input' ? 'voice' : 'input';
        that.setData({
            sendType: type,
        });
    },
    chooseImg() {
        let tempFilePaths = null;
        const _self = this;
        function sendFile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(sendFile);
                return;
            }
            wx.uploadFile({
                url: `${app.globalData.domain}/smallapp/im-user/send`,
                filePath: tempFilePaths[0],
                formData: {
                    id: _self.data.shop_id, type: 2, from: 1, content: 'img',
                },
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/json',
                },
                name: 'file',
                success(res) {
                    if (res.data.code === 10) {
                        app.login(sendFile);
                        return;
                    }
                    const jsondata = JSON.parse(res.data);
                    // console.log(jsondata);
                    if (jsondata.code === 1) {
                        jsondata.ret.msg.from = 1;
                        _self.data.message[jsondata.ret.msg.id] = jsondata.ret.msg;
                        _self.setData({
                            message: _self.messageFormat(_self.data.message),
                        });
                        _self.setData({
                            toView: 'msgbottom',
                        });
                    }
                    _self.setData({
                        time: res.data.time,
                    });
                },
            });
        }
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                // 返回选定照片的本地文件路径列表， tempFilePath可以作为img标签的src属性显示图片
                console.log(res);
                ({ tempFilePaths } = res);
                sendFile();
            },
        });
    },
    preViewImage(e) {
        // console.log(e);
        wx.previewImage({
            urls: [e.currentTarget.id], // 需要预览的图片http链接列表
        });
    },
    getvoice() {
        const _self = this;
        console.log('开始录音');
        _self.setData({
            voice_time: new Date(),
            ismusic: true,
        });
        // wx.showToast({
        //   title: '录音中...',
        //   icon: 'loading',
        //   image:'/image/voice_input.png',
        //   duration: 60000
        // });
        let tempFilePath = null;
        function sendFile() {
            if (!app.globalData.tokenFirstReady) {
                app.login(sendFile);
                return;
            }
            wx.uploadFile({
                url: `${app.globalData.domain}/smallapp/im-user/send`,
                filePath: tempFilePath,
                formData: {
                    id: _self.data.shop_id, type: 3, from: 1, remark: parseInt(_self.data.voice_time / 1000), content: 'voice',
                },
                header: {
                    'access-token': wx.getStorageSync('token'),
                    'Content-Type': 'application/json',
                },
                name: 'file',
                success(res) {
                    if (res.data.code === 10) {
                        app.login(sendFile);
                        return;
                    }
                    const jsondata = JSON.parse(res.data);
                    console.log(jsondata);
                    if (jsondata.code === 1) {
                        jsondata.ret.msg.from = 1;
                        _self.data.message[jsondata.ret.msg.id] = jsondata.ret.msg;
                        _self.setData({
                            message: _self.messageFormat(_self.data.message),
                        });
                        _self.setData({
                            toView: 'msgbottom',
                        });
                    }
                    _self.setData({
                        time: res.data.time,
                        voice_time: 0,
                    });
                },
            });
        }
        wx.startRecord({
            success(res) {
                console.log('录音成功');
                ({ tempFilePath } = res);
                sendFile();
            },
            complete(res) {
                console.log(`complete${res}`);
            },
            fail(res) {
                // 录音失败
                console.log(`fail${res}`);
            },
        });
    },
    stopvoice() {
        wx.stopRecord();
        console.log('stop');
        this.setData({
            voice_time: new Date() - this.data.voice_time,
            ismusic: false,
        });
        // wx.hideToast();
    },
    playVoice(event) {
        const { id } = event.currentTarget.dataset;
        const _self = this;
        _self.data.message[id].playing = 1;
        _self.setData({
            message: _self.data.message,
        });
        setTimeout(() => {
            _self.data.message[id].playing = 0;
            _self.setData({
                message: _self.data.message,
            });
        }, _self.data.message[id].remark * 1000);
        wx.downloadFile({
            url: event.currentTarget.dataset.content,
            success(res) {
                console.log(res.tempFilePath);
                wx.playVoice({
                    filePath: res.tempFilePath,
                    success() {
                        console.log('成功');
                    },
                    complete(e) {
                        console.log(e);
                    },
                });
            },
        });
    },
    messageFormat(message) {
        const sysdate = util.dateToArray(new Date(this.data.time * 1000));
        console.log(this.data.time);
        const week = ['日', '一', '二', '三', '四', '五', '六'];
        let pre_time = this.data.last_msg_time;
        let flag = 0;
        Object.keys(message).forEach(i => {
            if (flag === 0) {
                this.setData({ firstmsgid: message[i].id });
                flag = 1;
            }
            if (message[i].send_time - pre_time > 600) {
                const date = util.dateToArray(new Date(message[i].send_time * 1000));
                const ap = (date.h < 12 ? '上午' : date.h) > 12 ? '下午' : '中午';
                if (date.y > sysdate.y) {
                    message[i].send_time_f = `${date.y}年${date.m}月${date.d}日 ${ap}${util.formatNumber(date.h)}:${util.formatNumber(date.i)}`;
                } else if (sysdate.m - date.m === 0 && sysdate.d - date.d === 1) {
                    message[i].send_time_f = `昨天 ${ap}${util.formatNumber(date.h)}:${util.formatNumber(date.i)}`;
                } else if (sysdate.m - date.m === 0 && sysdate.d - date.d === 0) {
                    message[i].send_time_f = `${ap + util.formatNumber(date.h)}:${util.formatNumber(date.i)}`;
                } else if (this.data.time - message[i].send_time < 604800 && sysdate.w > date.w) {
                    message[i].send_time_f = `星期${week[date.w]} ${ap}${util.formatNumber(date.h)}:${util.formatNumber(date.i)}`;
                } else {
                    message[i].send_time_f = `${date.m}月${date.d}日 ${ap}${util.formatNumber(date.h)}:${util.formatNumber(date.i)}`;
                }
                pre_time = message[i].send_time;
            }
        });
        this.setData({
            last_msg_time: pre_time,
        });
        return message;
    },
    msgRecord() {
        const _self = this;
        const currentmsgid = _self.data.firstmsgid;
        const toView = `msg${currentmsgid}`;
        function getMsgRecord() {
            if (!app.globalData.tokenFirstReady) {
                app.login(getMsgRecord);
                return;
            }
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/msg-record`,
                data: { id: _self.data.shop_id, first_msg_id: currentmsgid },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(getMsgRecord);
                        return;
                    }
                    _self.setData({
                        time: res.data.time,
                    });
                    if (res.data.code === 1) {
                        if (res.data.ret.msg === '') {
                            _self.setData({
                                isTop: true,
                            });
                        } else {
                            const message = res.data.ret.msg;
                            _self.setData({
                                last_msg_time: 0,
                            });
                            Object.keys(_self.data.message).forEach(i => {
                                message[i] = _self.data.message[i];
                            });
                            _self.setData({
                                message: _self.messageFormat(message),
                            });
                            _self.setData({
                                toView: toView,
                            });
                        }
                    }
                    wx.hideToast();
                },
            });
        }
        if (_self.data.isTop === false) {
            wx.showToast({
                title: '加载中...',
                icon: 'loading',
                duration: 60000,
            });
            getMsgRecord();
        }
    },
    newMsg() {
        const _self = this;
        if (!app.globalData.tokenFirstReady) {
            app.login(_self.newMsg);
            return;
        }
        const uid = _self.data.shop_id;
        if (_self.data.getNewMsg) {
            wx.request({
                url: `${app.globalData.domain}/smallapp/im-user/msg`,
                data: { id: uid, t: new Date().getTime() },
                header: {
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code === 10) {
                        app.login(_self.newMsg);
                        return;
                    }
                    _self.setData({
                        time: res.data.time,
                    });
                    if (res.data.code === 1) {
                        if (res.data.ret.msg.length > 0) {
                            const message = _self.messageFormat(res.data.ret.msg);
                            Object.keys(message).forEach(i => {
                                message[i].from = 2;
                                _self.data.message[message[i].id] = message[i];
                            });
                            _self.setData({
                                message: _self.data.message,
                            });
                            _self.setData({
                                toView: 'msgbottom',
                            });
                        }
                    }
                },
            });
            setTimeout(_self.newMsg, 3000);
        }
    },
    onPullDownRefresh() {
        wx.stopPullDownRefresh();
    },
});
