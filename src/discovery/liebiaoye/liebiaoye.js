import { get } from '../../utils/ajax';
import { track } from '../../utils/track';

const util = require('../../utils/util.js');
const app = require('../../app');

let timerId = null;
const host = 'https://xiaochengxu.58.com';
let isScrolled = false;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        city: 'bj', // 城市
        listName: 'banjia', // 类目
        listArr: [], // 列表页数据
        cateid: 0,
        page: 1, // 分页
        call: {
            // 400
            teleNumber: 400000000,
            tick: 0,
            hidden: true,
        },
        tagCookie: 'spm=u-2cb763vej97pnc4f21.shenghuozhushou; utm_source=link;',
        title: '列表页',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(o) {
        const {
            city,
            listName,
            tagCookie,
            cateid,
            title = '列表页',
        } = o;
        console.log(o);
        wx.setNavigationBarTitle({
            title: title,
        });
        if (tagCookie) {
            this.setData({
                city: city,
                listName: listName,
                tagCookie: tagCookie,
                cateid,
                title: title,
            });
        } else {
            this.setData({
                city: city,
                listName: listName,
                cateid,
                title: title,
            });
        }
        if (!city) {
            /* eslint no-underscore-dangle: 0 */
            const _url = 'https://bossapi.58.com/smallapp/common/city';
            get(_url, {}, (e, res) => {
                if (e) {
                    console.log(e);
                    return false;
                }
                if (res.code === 0) {
                    this.setData({
                        city: res.data.city,
                    });
                } else {
                    console.error('bossapi.city');
                }
                return true;
            });
        }
        this.getListData();
    },
    updataCookie(strCookie) {
        console.log(strCookie);
        const str = strCookie;
        let arr = [];
        const arr2 = [];
        const str1 = str.split(';');
        str1.forEach(i => {
            const temArr = i.split(',');
            arr = arr.concat(temArr);
        });
        console.log(arr);
        if (!wx.getStorageSync('id58')) {
            arr.forEach(i => {
                if (i.includes('id58')) {
                    wx.setStorageSync('id58', `${i};`);
                }
                if (i.includes('cookieuid')) {
                    wx.setStorageSync('cookieuid', `${i};`);
                }
                if (i.includes('sessionid')) {
                    arr2.push(i);
                }
            });
        } else {
            arr.forEach(i => {
                if (i.includes('sessionid')) {
                    arr2.push(i);
                }
            });
        }
        console.log(arr2);
        app.globalData.listCookie = this.data.tagCookie + wx.getStorageSync('cookieuid') + wx.getStorageSync('id58') + arr2.join(';');
    },
    /**
     * 获取列表页数据
     */
    getListData() {
        const that = this;
        let header = {};
        wx.showLoading({
            title: '加载中',
            mask: true,
        });
        if (app.globalData.listCookie) {
            header = {
                'content-type': 'application/json',
                cookie: app.globalData.listCookie,
            };
            console.log(header);
        } else {
            header = {
                'content-type': 'application/json',
                cookie: that.data.tagCookie,
            };
        }
        wx.request({
            url: `${host}/${this.data.city}/${this.data.listName}/pn${this.data.page}`,
            data: {
                openId: wx.getStorageSync('token'),
            },
            method: 'GET',
            dataType: 'json',
            header: header,
            success(response) {
                console.log(response);
                const listNewArr = that.data.listArr.concat(response.data.infos);
                that.setData({
                    listArr: listNewArr,
                });
                if (!app.globalData.listCookie) {
                    const setcookie = response.header['Set-Cookie'] || response.header['set-cookie'];
                    that.updataCookie(setcookie);
                }
            },
            fail() {
                return false;
            },
            complete() {
                wx.hideLoading && wx.hideLoading();
            },
        });
    },
    scroll() {
        if (!isScrolled) {
            track('click', {
                cateid: this.data.cateid,
                clickTag: `scroll_${this.data.listName}`,
                pagetype: 'liebiaoye', // 页面类型，没有置空【必填】
            });
            isScrolled = true;
        }
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    reachBottom() {
        const page = this.data.page + 1;
        this.setData({
            page: page,
        });
        this.getListData();
    },
    // 点击帖子
    clickUrlFn(e) {
        if (e.currentTarget.dataset.type === 'adinfo') {
            const header = {
                'content-type': 'application/json',
                cookie: app.globalData.listCookie,
            };
            wx.request({
                url: e.currentTarget.dataset.url,
                data: {},
                method: 'GET',
                dataType: 'json',
                header: header,
                success(response) {
                    console.log(1234567890);
                    console.log(response);
                },
                fail() {
                    return false;
                },
            });
        }
    },
    /* 打电话 s */
    call_tick(e) {
        const self = this;
        wx.request({
            url: `${app.globalData.domain}/smallapp/common/link`,
            data: {
                sign: e.currentTarget.dataset.sign,
                infoId: e.currentTarget.dataset.infoid,
                source: 0,
                type: 0,
            },
            header: app.globalData.testHeader,
            success(res) {
                if (res.data.code === 0) {
                    self.setData({
                        call: util.constDeepMixin(self.data.call, {
                            teleNumber: parseInt(res.data.data[0]) + 1 ? res.data.data : '服务忙',
                            tick: 180,
                            hidden: false,
                        }),
                    });
                    self.callTimer();
                } else {
                    console.error('400电话异常\n', res);
                }
            },
        });
    },
    callTimer() {
        const self = this;
        clearInterval(timerId);
        timerId = setInterval(() => {
            if (self.data.call.tick > 1) {
                self.setData({
                    call: util.constDeepMixin(self.data.call, {
                        tick: self.data.call.tick -= 1,
                    }),
                });
            } else {
                clearInterval(timerId);
                self.setData({
                    call: util.constDeepMixin(self.data.call, {
                        tick: 0,
                        hidden: true,
                    }),
                });
            }
        }, 1000);
    },
    cancel_call() {
        const self = this;
        clearInterval(timerId);
        self.setData({
            call: util.constDeepMixin(self.data.call, {
                tick: 0,
                hidden: true,
            }),
        });
    },
    call() {
        const self = this;
        wx.makePhoneCall({
            phoneNumber: self.data.call.teleNumber,
        });
    },
    /* 打电话 e */
    onShareAppMessage() {
        return {
            title: '58同城生活助手',
            desc: '列表页',
            path: `discovery/liebiaoye/liebiaoye?city=${this.data.city}&listName=${
                this.data.listName
            }&title=${this.data.title}`,
        };
    },
});
