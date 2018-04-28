const im = require('../vendors/im/index.js');
const isInit = false;


function imInit(im_token, optionsmb) {
    console.log('初始化im开始');
    var uid = wx.getStorageSync('uid');
    var ppu = wx.getStorageSync('ppu');
    im.init({
        sdk: {
            user_id: uid,
            source: 2,
            appid: "100245-wb@waIngndiR4d",
            im_token: im_token,
            client_version: '1.0.0',
            client_type: 'weapp_sjt',
            ws: 'wss://imgets.58.com/websocket',
            api: 'https://im.58.com',
            getNewToken(cb) {
                getIMToken(function (token) {
                    cb && cb(token);
                });
            }
        },
        ui: {
            'im-absolute-path': '/vendors/im',
            'on-notlogin': function () {
                callPassport();
                console.log(`on-notlogin`);

            }
        }

    });
    //为true代表init im已经完成
    // console.log('刷新当前页面')
    var aaa = im.me() ? im.me().user_id : "无初始化";
    var token = wx.getStorageSync("token");
    isInit = true;
    //为true代表init im已经完成


}

function goToSession(options) {
    im.gotoSessions(options, IMsuccess, IMerror);
}

function gotoChat(options) {
    im.gotoChat(options, IMsuccess, IMerror);
}

function IMsuccess(data) {
    console.log(data);
}

function IMerror(err) {
    callPassport();
}

function callPassport() {
    try {
        wx.navigateToMiniProgram({
            appId: 'wx2a9c6eeb1c44a284',
            path: 'pages/index/index',
            extraData: {},
            envVersion: 'release', //trial release
            success(res) {
                // 打开成功
                console.log('打开成功！')

            },
            complete: function (resp) {
                console.log(resp.errMsg)
            }
        });
    } catch (e) {
        wx.showToast({
            title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            icon: '',
            duration: 5000
        });
    }

}

function callShangjiatong() {
    wx.navigateToMiniProgram({
        appId: 'wb@waIngndiR4d',
        path: '/vendors/im/pages/sessions/sessions',
        extraData: {},
        envVersion: 'release', //trial release
        success(res) {
            // 打开成功
            console.log('打开成功！')

        },
        complete: function (resp) {
            console.log(resp.errMsg)
        }
    });
}
//获取token  调用翔远接口
function getIMToken(cb, optionsmb) {
    console.log('调用getimtoken接口');
    console.log('access im token get');
    if (!wx.getStorageSync('ppu')) {
        callPassport();
    }
    var ppu = wx.getStorageSync('ppu');
    wx.request({
        url: 'https://bossapi.58.com/smallapp/imtoken/get',
        header: {
            'ppu': wx.getStorageSync('ppu'),
            'ticket': '3f1f53c877bbe8eb', //小程序标识符 用于小程序的区分
            'content-type': 'application/json',
            'client_type': 'B'
        },
        success: function (resp) {
            if (resp.data.code && resp.data.code == 1) {
                console.log('获取im——token成功', resp.data.ret);
                wx.setStorageSync("im_token", resp.data.ret);
                if (cb) {
                    cb(resp.data.ret, optionsmb);
                }
            } else {
                console.log('imtoekn msg', resp.data.msg);
            }
        },
        fail: function (err) {
            console.log('获取im——token失败');
            console.log('请求失败' + err);
        }
    })
}

function getIMTokenPromise(cb, optionsmb) {
    var p = new Promise(function (resolve, reject) {
        if (!wx.getStorageSync('ppu')) {
            callPassport();
        }
        wx.request({
            // TODO: 将域名写活
            url: 'https://bossapi.58.com/smallapp/imtoken/get',
            header: {
                'ppu': wx.getStorageSync('ppu'),
                'ticket': '3f1f53c877bbe8eb', //小程序标识符 用于小程序的区分
                'access-token': wx.getStorageSync('token'), //'f7bdf05af761a6179c348f0869ed5b6e',//
                'content-type': 'application/json',
                'client_type': 'B'
            },
            success: function (resp) {
                console.log('data=' + resp);
                if (resp.data.code && resp.data.code == 1) {
                    console.log('获取im——token成功', resp.data.ret);
                    wx.setStorageSync("im_token", resp.data.ret);
                    resolve(resp.data.ret);
                    if (cb) {
                        cb(resp.data.ret, optionsmb);
                    }
                } else {
                    console.log('imtoekn msg', resp.data.msg);
                    reject(resp.data.ret);
                }
            },
            fail: function (err) {
                console.log('获取im——token失败');
                console.log('请求失败' + err);
            }
        })
    });
    return p;
}

function bindppu(ppu, accesstoken) {
    console.log("access bid ppu" + ppu);
    wx.request({
        url: "https://bossapi.58.com/smallapp/bindppu",
        header: {
            'ppu': ppu,
            'ticket': '05bd21691cfc1c9d', //小程序标识符 用于小程序的区分
            'access-token': accesstoken, //'f7bdf05af761a6179c348f0869ed5b6e',//
            'content-type': 'application/json',
            'client_type': 'C'
        },
        success: function (resp) {
            console.log('data=' + resp);
            if (resp.data.code && resp.data.code == 1) {
                console.log("绑定ppu成功")
                console.log(resp.data.msg);
            } else {
                console.log("绑定ppu失败")
                console.log(resp.data.msg);
            }
        },
        fail: function (err) {
            console.log("绑定ppufail");
            console.log('请求失败' + err);
        }
    })
}
module.exports = {
    getIMToken,
    goToSession,
    gotoChat,
    imInit,
    callPassport,
    getIMTokenPromise,
    IMsuccess,
    IMerror,
    bindppu,
    callShangjiatong,
    isInit,
}
