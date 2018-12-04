
const { fuwu } = require('../utils/globalDataService.js');
const im = require('../utils/IMInit.js');

const loginPlugin = requirePlugin('LoginSdk');

const jump = (url) => {
    wx.navigateTo({
        url,
    });
};
function redirect() {
    const { PPU } = loginPlugin.PPUrequestHeader('58.com', '/');
    wx.setStorageSync('ppu', PPU);
    wx.setStorageSync('uid', PPU.split('=')[1].split('&')[0]);
    if (wx.getStorageSync('im_token')) {
        im.imInit(wx.getStorageSync('im_token'), fuwu.optionsmb);
    } else {
        im.getIMToken(im.imInit, fuwu.optionsmb);
    }
    im.bindppu(wx.getStorageSync('ppu'), wx.getStorageSync('token'));
    setTimeout(() => {
        wx.setStorageSync('fromLogin', true);
        if (fuwu.globalData.jumpBack.indexOf('xiangqingye') > -1) {
            wx.navigateBack({
                delta: 1,
            });
        } else {
            wx.reLaunch({
                url: fuwu.globalData.jumpBack || '/discovery/daleiye/daleiye',
            });
        }
    }, 500);
}
const callback = (code) => {
    // code 0 代表调用登录接口
    // code 1 调用获取用户信息接口
    // code 2 获取微信绑定手机号
    if (code === 0) {
        const { PPU } = loginPlugin.PPUrequestHeader('58.com', '/');
        if (!PPU) {
            setTimeout(() => {
                redirect();
            }, 1000);
            return;
        }
        redirect();
    }
};

const pwdConfig = {
    default: 1,
    source: '58-tcshzs-weapp',
    sys: '58',
    btncolor: '#ff543a',
    logohide: 'false',
    logourl: undefined,
    data: {
        appid: 'wxd1d3a59c204109d4',
    },
    jump,
    callback,
};
Object.assign(pwdConfig, {
    jump,
    callback,
});
export default {
    /**
     * 跳转登录页面
     * @param {Object} cfg { username, mobile }
     */
    goLogin(cfg = {}) {
        // const PPU = 'UID=30624233&UN=imtns&TT=642e9646a27a33242db7beaa1c13ddef&PBODY=MqXLrbVlkDD8w_8IJ0nbQH2fzWAkfkoMp4y6Bx7Aw-IEVRc7HTdOwMJga06XRSv_jy3sGQF_yE9wPrA
        // h_XLZXvZSpedlSu3c7ATBSvLXwlCKjaVWUC2k9NtKDD8PSTJjnWSRpNRc-2taD65wBLtCI61U4S_UGndPXio0XxJ3bo4&VER=1';
        // wx.setStorageSync('ppu', PPU);
        // wx.setStorageSync('uid', PPU.split('=')[1].split('&')[0]);
        // if (wx.getStorageSync('im_token')) {
        //     im.imInit(wx.getStorageSync('im_token'), fuwu.optionsmb);
        // } else {
        //     im.getIMToken(im.imInit, fuwu.optionsmb);
        // }

        // im.bindppu(wx.getStorageSync('ppu'), wx.getStorageSync('token'));
        // setTimeout(() => {
        //     wx.setStorageSync('fromLogin', true);
        //     if (fuwu.globalData.jumpBack.indexOf('xiangqingye') > -1) {
        //         wx.redirectTo({
        //             url: `${fuwu.globalData.jumpBack}?${fuwu.globalData.pageParams}` || '/discovery/daleiye/daleiye',
        //         });
        //     } else {
        //         wx.reLaunch({
        //             url: fuwu.globalData.jumpBack || '/discovery/daleiye/daleiye',
        //         });
        //     }
        //     if (fuwu.optionsmb && fuwu.optionsmb.user_id) {
        //         setTimeout(() => {
        //             im.gotoChat(fuwu.optionsmb);
        //         }, 2000);
        //     }
        // }, 500);

        const {
            mobile: mobilevalue = '',
            username: usernamevalue = '',
        } = cfg;

        loginPlugin.goLogin({
            ...pwdConfig,
            mobilevalue,
            usernamevalue,
        });
    },
};
