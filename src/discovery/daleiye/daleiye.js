import { get } from '../../utils/ajax';
import globalDataService from '../../globalDataService';
import { track } from '../../utils/track';

const app = require('../../app');

const host = 'https://xiaochengxu.58.com';
/* eslint no-underscore-dangle: 0 */
const _url = `${host}/shenghuo.shtml`;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        scrollTopNumber: 0,
        city: 'bj',
        cityId: 1,
        tabName: '推荐服务',
        onSelect: 0,
        banner: 0,
        height: 0,
        /* 类别 */
        listTit: [{
            title: '推荐服务',
            type: 'hyjk',
            isSelect: true,
        }, {
            title: '家政服务',
            type: 'shenghuo',
            isSelect: false,
        }, {
            title: '商务服务',
            type: 'shangwu',
            isSelect: false,
        }, {
            title: '招商加盟',
            type: 'zhaoshang',
            isSelect: false,
        }, {
            title: '汽车服务',
            type: 'qichefw',
            isSelect: false,
        }, {
            title: '教育培训',
            type: 'jiaoyu',
            isSelect: false,
        }, {
            title: '装修建材',
            type: 'zhuangxiujc',
            isSelect: false,
        }, {
            title: '婚庆摄影',
            type: 'hunjiehunqing',
            isSelect: false,
        }, {
            title: '旅游酒店',
            type: 'lvyouxiuxian',
            isSelect: false,
        }, {
            title: '休闲娱乐',
            type: 'xiuxianyl',
            isSelect: false,
        }, {
            title: '餐饮美食',
            type: 'canyin',
            isSelect: false,
        }, {
            title: '丽人美容',
            type: 'liren',
            isSelect: false,
        }],
        hotTagData: {},
        HotCateData: {},
        mainData: [],
        cateData: [],
        tagCookie: 'spm=u-2cb763vej97pnc4f21.shenghuozhushou; utm_source=link;',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad() {
        track('show', {
            pagetype: 'index', // 页面类型，没有置空【必填】
        });
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    height: res.windowHeight,
                });
            },
        });
        await this.getCity();
        this.freshTui('hyjk');
    },
    // 获取cookie
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
        globalDataService.set('listCookie', this.data.tagCookie + wx.getStorageSync('cookieuid') + wx.getStorageSync('id58') + arr2.join(';'));
        // app.globalData.listCookie =
        //     this.data.tagCookie +
        //     wx.getStorageSync('cookieuid') +
        //     wx.getStorageSync('id58') +
        //     arr2.join(';');
    },
    /**
     * 获取城市
     */
    getCity() {
        return new Promise((resolve) => {
            // 获得城市信息
            const url = 'https://bossapi.58.com/smallapp/common/city';
            get(url, {}, (e, res) => {
                if (e) {
                    console.log(e);
                    return false;
                }
                if (res.code === 0) {
                    this.setData({
                        city: res.data.city,
                        cityId: res.data.cityId,
                    });
                    resolve();
                } else {
                    console.error('API REQUEST ERROR. Something went wrong when request "/smallapp/common/city", and the response is:\n', res);
                }
                return true;
            });
        });
    },
    /**
     * 更新视图
     */
    freshTui(str) {
        const that = this;
        get(_url, { type: str }, (e, res, resData) => {
            if (e) {
                console.log(e);
                return false;
            }
            const data = res;
            console.log(data);
            console.log(resData);
            data.mainData.forEach((element) => {
                element.listData.splice(3, element.listData.length - 2);
            });
            this.setData({
                hotTagData: data.hotTagData,
                HotCateData: [],
                mainData: data.mainData,
                cateData: [],
            });
            // 加cookie
            console.log('---->', app);
            if (!app.globalData.listCookie) {
                const setcookie = resData.header['Set-Cookie'] || resData.header['set-cookie'];
                that.updataCookie(setcookie);
            }
            return true;
        });
    },
    fresh(str) {
        get(_url, { type: str }, (e, res) => {
            if (e) {
                console.log(e);
                return false;
            }
            const data = res;
            // let bannerTopData = [];
            // if (data.bannerTopData) {
            //     bannerTopData = data.bannerTopData.listData;
            // }
            this.setData({
                HotCateData: data.HotCateData,
                hotTagData: [],
                mainData: [],
                cateData: data.cateData,
            });
            return true;
        });
    },
    /**
     * 选择类别
     */
    changeCateFun(event) {
        const selectIndex = event.target.dataset.index;
        const { listTit } = this.data;
        const listname = event.target.dataset.locallistname;
        listTit[selectIndex].isSelect = true;
        listTit[this.data.onSelect].isSelect = false;
        track('click', {
            pagetype: 'index', // 页面类型，没有置空【必填】
            clickTag: `lefttab_${selectIndex + 1}_${listname}`,
        });
        this.setData({
            onSelect: selectIndex,
            listTit: listTit,
            scrollTopNumber: 0,
            tabName: listTit[selectIndex].title,
        });
        if (event.target.dataset.locallistname === 'hyjk') {
            this.setData({
                banner: 0,
            });
            this.freshTui(event.target.dataset.locallistname);
        } else {
            this.setData({
                banner: 1,
            });
            this.fresh(event.target.dataset.locallistname);
        }
    },
    /**
     * 跳转
     */
    navigatorFun(e) {
        const {
<<<<<<< HEAD
=======
            fullpath,
>>>>>>> huangxin
            listname: listName,
            cateid,
            title,
        } = e.currentTarget.dataset;
<<<<<<< HEAD
=======
        track('click', {
            cateid: fullpath,
            pagetype: 'index',
        });
>>>>>>> huangxin
        const { cityId } = this.data;
        wx.navigateTo({
            url: `../liebiaoye/liebiaoye?listName=${listName}&city=${this.data.city}&cityId=${
                cityId}&title=${title}&cateid=${cateid}`,
        });
    },
    viewAll() {
        // const { tabName } = this.data;
        // const title = `全部${tabName}`;
        // const listName = '';
        // const cityId = '';
        // TODO: 跳转页面 需要获取全部栏目数据的列表
    },
    onShareAppMessage() {},
});
