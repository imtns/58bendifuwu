
import { get } from './http';
import { GET_UNIONID } from './url';

const im = require('../utils/IMInit.js');
const { makeid } = require('../utils/random.js');

const globalData = {
    os: null,
    accesstoken: null,
    ppu: null,
    uid: null,
    imtoken: null,
    tokenFirstReady: false,
    domain: 'https://bossapi.58.com',
    mainAppId: 'wx86c7b0019914401c',
    userInfo: null,
    isQB: wx.getSystemInfoSync().isQB || false, // 是否为QQ浏览器
    city: 'bj',
    netType: '',
    hyname: '',
    token: '',
    userType: 0,
    unionid: '',
    testHeader: {
        version: '7',
        channel: '5',
        id58: '',
        ip: '10.252.22.236',
    },
    tagCookie: '',
    listCookie: '',
};
const globalDataService = {
    set(prop, value) {
        let obj = globalData;
        const keys = Array.isArray(prop) ? prop : prop.split('.');
        let index = 0;
        for (index = 0; index < keys.length - 1; index++) {
            const key = keys[index];
            if (!Object.prototype.hasOwnProperty.call(obj, key)) obj[key] = {};
            obj = obj[key];
        }
        obj[keys[index]] = value;
    },
    get() {

    },
};
const fuwu = {
    globalData,
    optionsmb: {}, // gochat的参数
    global: '',
    flag: 0,
    login(callback) {
        const self = fuwu;
        if (callback) {
            console.log('pushing callback');
            self.loginMethodStatue.callbackStack.push(callback);
            if (self.loginMethodStatue.busy) {
                return;
            }
            self.loginMethodStatue.busy = true;
        }

        function bugSetStorage() {
            try {
                wx.setStorageSync('bugSetStorage', '1');
            } catch (e) {
                console.log('bug来了');
                bugSetStorage();
            }
        }
        function getSmallAppToken(wxcode) {
            // 小程序登录，传值code换回openId,sessionKey,unionId
            console.log('request to get token.');
            wx.request({
                url: `${self.globalData.domain}/smallapp/wx-user/login`,
                data: {
                    code: wxcode, // 小程序login返回的code
                    ticket: '05bd21691cfc1c9d', // 小程序标识符 用于小程序的区分
                },
                method: 'GET',
                success(res) {
                    // 登录成功
                    if (res.data.code === 0) {
                        console.log('get token successfully');
                        console.log(`res.data.data token${res.data.data}`);
                        const token = res.data.data;
                        wx.setStorageSync('token', token);
                        self.globalData.token = token;
                        // self.setUserInfo(); //上传用户信息
                        console.log('get token successfully');
                        /* eslint-disable camelcase */
                        const { is_new_user } = res.data.data;
                        bugSetStorage();
                        try {
                            wx.setStorageSync('token', token);
                            if (!wx.getStorageSync('role')) {
                                wx.setStorageSync('role', 'user');
                            }
                        } catch (e) {
                            console.log('bug来了');
                            bugSetStorage();
                        }
                        if (self.globalData.testHeader.id58 === '') {
                            self.globalData.testHeader.id58 = token;
                        }
                        self.getUnionID();
                        if (is_new_user === 1) {
                            // self.setUserInfo();
                        }
                    } else if (res.data.code === -5) {
                        im.callPassport();
                        console.log(res.data.code);
                    }
                },
                complete(r) {
                    console.log(r);
                },
            });
        }
        console.log(makeid());
        // const that = this;
        if (fuwu.globalData.isQB) {
            // wx.qbLogin({
            //     appkey: '58TONGCHENG', // 该appkey是QB分配给小程序开发者的，用于映射QB小程序在微信下的appid
            //     type: '1', // 1: 微信换取的是openid，
            //     // 2：微信换取的是unionid，不填该字段默认换取的是openid
            //     // 3: 微信获取的是:openid+unionid
            //     success(res) {
            //         console.log('------------------------------QB--------------------------------');
            //         console.log(that.objToString(res));
            //     },
            //     fail(e) {
            //         console.log('------------------------------QBError--------------------------------');
            //         console.log(that.objToString(e));
            //     },
            // });


            const randomStr = makeid();
            wx.setStorageSync('token', randomStr);
            if (!wx.getStorageSync('id58')) {
                wx.setStorageSync('id58', randomStr);
                this.globalData.testHeader.id58 = randomStr;
            } else {
                this.globalData.testHeader.id58 = wx.getStorageSync('id58');
            }
        } else {
            wx.login({
                // 小程序登录，获取code
                success(res) {
                    console.log('成功调取wx.login');
                    if (res.code) {
                        getSmallAppToken(res.code);
                    } else {
                        console.log(`获取用户登录态失败！${res.errMsg}`);
                    }
                },
                fail() {
                    console.error('Failed to call wx.login()');
                    wx.navigateTo({
                        url: '/errorpage/errorpage?errMsg=Failed_to_call_wx.login()',
                    });
                },
            });
        }
    },
    async getUnionID() {
        try {
            const data = {
                openid: wx.getStorageSync('token'),
            };
            const res = await get(GET_UNIONID, { data });
            console.log(res);
            fuwu.globalData.unionid = res.data.data;
        } catch (err) {
            console.log(err);
        }
    },
    objToString(obj) {
        let str = '';
        Object.keys(obj).forEach(p => {
            str += `${p}::${obj[p]}\n`;
        });
        return str;
    },
    loginMethodStatue: {
    // 如果token失效，可能同时有很多网络请求失败从而来调用 wx.login()
        callbackStack: [],
        busy: false,
        flush() {
            console.log('flushing');
            let cb;
            while (this.callbackStack.length !== undefined && this.callbackStack.length > 0) {
                cb = this.callbackStack.shift();
                cb();
            }
            this.busy = false;
        },
    },
    setUserInfo() {
        const self = fuwu;
        function requestSetUserInfo(wxres) {
            wx.request({
                method: 'POST',
                url: `${self.globalData.domain}/smallapp/wx-user/set-user-info`,
                data: {
                    encrypted_data: wxres.encryptedData,
                    iv: wxres.iv,
                    ticket: '05bd21691cfc1c9d', // 小程序标识符 用于小程序的区分
                },
                header: {
                    'content-type': 'application/json',
                    'access-token': wx.getStorageSync('token'),
                },
                success(res) {
                    if (res.data.code === 0) {
                        self.loginMethodStatue.flush();
                        if (res.data.data === 1) {
                            // 商家   需要弹
                            fuwu.globalData.userType = 1;
                        }
                    } else if (res.data.code === -5) {
                        im.callPassport();
                    } else {
                        console.error(
                            'API REQUEST ERROR. Something went wrong when request "/wechat/huangye/default/login", and the response is:\n',
                            res,
                        );
                    }
                },
            });
        }
        wx.getUserInfo({
            success(wxres) {
                requestSetUserInfo(wxres);
            },
        });
    },

    getUserInfo(cb) {
        const self = fuwu;
        if (this.globalData.userInfo) {
            typeof cb === 'function' && cb(this.globalData.userInfo);
        } else {
            // 调用登录接口
            wx.login({
                success() {
                    wx.getUserInfo({
                        success(res) {
                            self.globalData.userInfo = res.userInfo;
                            self.setUserInfo();
                            typeof cb === 'function' && cb(self.globalData.userInfo);
                        },
                    });
                },
            });
        }
    },
};
module.exports = {
    fuwu,
    globalDataService,
};
