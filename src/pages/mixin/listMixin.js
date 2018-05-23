import wepy from 'wepy';
import app from '../../app';
import { get } from '../../utils/http';
import { track } from '../../utils/track';
import { toast } from '../../utils/util';

const globalDataService = require('../../utils/globalDataService');

const host = 'https://xiaochengxu.58.com';
let isScrolled = false;
let noMoreData = false;
let tagCookie = 'spm=u-2cb763vej97pnc4f21.shenghuozhushou; utm_source=link;';
export default class ListMixin extends wepy.mixin {
    data = {
        city: '', // 城市
        listName: '', // 类目
        listArr: [], // 列表页数据
        cateid: 0,
        fullpath: 0,
        cityId: 1,
        page: 1, // 分页
        call: {
            // 400
            teleNumber: 400000000,
            tick: 0,
            hidden: true,
        },
    };
    onUnload() {
        isScrolled = false;
        noMoreData = false;
    }
    methods = {
        // 扣费链接
        async chargingLink(e) {
            if (e.currentTarget.dataset.type === 'adinfo') {
                const header = { cookie: app.globalData.listCookie || tagCookie };
                const data = {};
                try {
                    const result = await get(e.currentTarget.dataset.url, { data, header });
                    console.log(result);
                } catch (err) {
                    console.log(err);
                }
            }
        },
        reachBottom() {
            const page = this.page + 1;
            this.page = page;
            this.getListData();
        },
        scroll() {
            if (!isScrolled) {
                track('click', {
                    cateid: this.fullpath,
                    clickTag: `scroll_${this.listName}`,
                    pagetype: 'list', // 页面类型，没有置空【必填】
                });
                isScrolled = true;
            }
        },
    }
    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(o) {
        const {
            city,
            title = '列表页',
            fullpath = 0,
        } = o;
        if (o.tagCookie) {
            tagCookie = decodeURIComponent(o.tagCookie || '');
        }
        globalDataService.set('tagCookie', tagCookie);
        wx.setNavigationBarTitle({
            title,
        });
        Object.assign(this, o);
        if (!city) {
            const res = await this.getCity();
            if (res.data.code === 0) {
                this.city = res.data.data.city;
                globalDataService.set('cityId', res.data.data.cityId);
                this.$apply();
                this.getListData();
            } else {
                console.error('bossapi.city');
            }
        } else {
            this.getListData();
        }
        setTimeout(() => {
            track('show', {
                cateid: fullpath,
                pagetype: 'list', // 页面类型，没有置空【必填】
            });
        }, 2000);
    }
    /**
     * 获取列表页数据
     */
    async getListData() {
        if (noMoreData || !this.listName) return;
        const header = {
            cookie: app.globalData.listCookie || tagCookie,
        };
        const data = { openId: wx.getStorageSync('token') };
        const url = `${host}/${this.city}/${this.listName}/pn${this.page}`;
        try {
            const result = await get(url, { data, header });
            const res = result.data;
            console.log(res);
            if (!res.infos) {
                noMoreData = true;
                if (this.page !== 1) { toast('没有更多数据啦~'); }
                return;
            }
            const listNewArr = this.listArr.concat(res.infos);
            this.listArr = listNewArr;
            this.$apply();
            if (!app.globalData.listCookie) {
                const setcookie = result.header['Set-Cookie'] || result.header['set-cookie'];
                this.updataCookie(setcookie);
            }
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * 页面上拉触底事件的处理函数
     */
}
