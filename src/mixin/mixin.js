import wepy from 'wepy';
import app from '../app';
import { get, post } from '../utils/http';

const globalDataService = require('../utils/globalDataService');

export default class Mixin extends wepy.mixin {
    data = {
        city: '',
    };
    methods = {
        goMiniProgram(e) {
            const { appid, userid } = e.currentTarget.dataset;
            wx.navigateToMiniProgram({
                appId: app.globalData.mainAppId,
                path: `/pages/index58/index58?appid=${appid}&userid=${userid}`,
                success(res) {
                    console.log(res);
                },
            });
        },
    }
    // 获取cookie
    updataCookie(strCookie) {
        if (app.globalData.isQB) return;
        console.log(strCookie);
        const str = strCookie;
        let arr = [];
        const arr2 = [];
        const str1 = str.split(';');
        str1.forEach(i => {
            const temArr = i.split(',');
            arr = arr.concat(temArr);
        });
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
        globalDataService.set('listCookie', wx.getStorageSync('tagCookie') + wx.getStorageSync('cookieuid') + wx.getStorageSync('id58') + arr2.join(';'));
        console.log(app.globalData.listCookie);
    }
    async getCity() {
        try {
            const getCityUrl = 'https://bossapi.58.com/smallapp/common/city';
            const res = await get(getCityUrl);
            this.city = res.data.data.city;
            return res;
        } catch (e) {
            return '';
        }
    }
    async getProfile() {
        const header = { 'access-token': wx.getStorageSync('token') };
        const res = await get(`${app.globalData.domain}/smallapp/user/profile`, {
            header,
        });
        if (res.data.code === 1) {
            this.me = res.data.ret.profile;
            this.hidden = true;
            this.$apply();
            wx.setStorageSync('me', res.data.ret.profile);
            console.log(`role=${this.role}`);
        }
    }
    async setUserInfo(wxres) {
        const header = { 'access-token': wx.getStorageSync('token') };
        const data = {
            encrypted_data: wxres.encryptedData,
            iv: wxres.iv,
            ticket: '05bd21691cfc1c9d', // 小程序标识符 用于小程序的区分
        };
        const res = await post(`${app.globalData.domain}/smallapp/wx-user/set-user-info`, {
            header,
            data,
        });
        console.log(res);
        await this.getProfile();
    }
}
