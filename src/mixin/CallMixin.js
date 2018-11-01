import wepy from 'wepy';

import { get } from '../utils/http';
import util from '../utils/util';

const { fuwu } = require('../utils/globalDataService');

let timerId = null;
export default class CallMixin extends wepy.mixin {
    data = {
        bgShow: true,
    };
    methods = {
        callTick(e) {
            this.getCall(e);
        },
        /* eslint-disable camelcase */
        cancel_call() {
            clearInterval(timerId);
            this.hideCallLayer();
        },
        call() {
            wx.makePhoneCall({
                phoneNumber: this.call.teleNumber,
            });
            this.hideCallLayer();
        },
    }
    async getCall(e) {
        // let data = {
        //     sign: (typeof e === 'object' && e.currentTarget.dataset.sign) || this.sign,
        //     infoId: (typeof e === 'object' && e.currentTarget.dataset.infoid) || this.infoid,
        //     source: 0,
        //     type: 0,
        // };
        const postData = {
            sign: (typeof e === 'object' && e.currentTarget.dataset.sign) || this.data.sign,
            infoId: (typeof e === 'object' && e.currentTarget.dataset.infoid) || this.data.infoid,
            source: 1,
            infoType: 0,
            channel: 5,
            clientId: 2,
            platform: 1,
            activityId: 'weixinshenghuozhushou',
        };
        if (this.openid) {
            Object.assign(postData, {
                openid: this.openid,
            });
        } else if (typeof e === 'object' && e.currentTarget.dataset.type === 'adinfo') {
            const header = {
                'content-type': 'application/json',
                cookie: fuwu.globalData.listCookie,
            };
            wx.request({
                url: e.currentTarget.dataset.url,
                data: {},
                method: 'GET',
                dataType: 'json',
                header: header,
                success(response) {
                    console.log('扣费链接');
                    console.log(response);
                },
                fail() {
                    return false;
                },
            });
        }

        const header = fuwu.globalData.testHeader;
        const url = 'https://link.58.com/api/assign';
        try {
            const { data: callData } = await get(url, { data: postData, header });
            const { code, result: teleNumberStr } = callData;
            if (code === 0) {
                this.call = util.constDeepMixin(this.call, {
                    teleNumber: parseInt(teleNumberStr) + 1 ? teleNumberStr : '服务忙',
                    tick: 180,
                    show: true,
                });
                this.bgShow = false;
                this.callTimer();
                this.$apply();
            } else {
                console.error('400电话异常\n', callData);
            }
        } catch (err) {
            console.log(err);
        }
    }
    hideCallLayer() {
        this.call = util.constDeepMixin(this.call, {
            tick: 0,
            show: false,
        });
        this.bgShow = true;
    }
    callTimer() {
        clearInterval(timerId);
        timerId = setInterval(() => {
            if (this.call.tick > 1) {
                this.call = util.constDeepMixin(this.call, {
                    tick: --this.call.tick,
                });
                this.$apply();
            } else {
                clearInterval(timerId);
                this.call = util.constDeepMixin(this.call, {
                    tick: 0,
                    show: false,
                });
                this.bgShow = true;
                this.$apply();
            }
        }, 1000);
    }
}
