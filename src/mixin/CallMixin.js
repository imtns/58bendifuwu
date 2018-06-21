import wepy from 'wepy';
import app from '../app';
import { get } from '../utils/http';
import util from '../utils/util';

let timerId = null;
export default class CallMixin extends wepy.mixin {
    data = {
        call: {
            tick: 0,
            hidden: true,
            teleNumber: 0,
        },
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
        let data = {
            sign: (typeof e === 'object' && e.currentTarget.dataset.sign) || this.sign,
            infoId: (typeof e === 'object' && e.currentTarget.dataset.infoid) || this.infoid,
            source: 0,
            type: 0,
        };
        if (this.openid) {
            data = Object.assign(data, {
                openid: this.openid,
            });
        } else if (typeof e === 'object' && e.currentTarget.dataset.type === 'adinfo') {
            // const header = { cookie: app.globalData.listCookie };
            // const dataHeader = {};
            // try {
            //     const result = await get(e.currentTarget.dataset.url, { dataHeader, header });
            //     console.log(result);
            // } catch (err) {
            //     console.log(err);
            // }
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
                    console.log('扣费链接');
                    console.log(response);
                },
                fail() {
                    return false;
                },
            });
        }

        const header = app.globalData.testHeader;
        const url = `${app.globalData.domain}/smallapp/common/link`;
        try {
            const result = await get(url, { data, header });
            const res = result.data;
            if (res.code === 0) {
                this.call = util.constDeepMixin(this.call, {
                    teleNumber: parseInt(res.data[0]) + 1 ? res.data : '服务忙',
                    tick: 180,
                    hidden: false,
                });
                this.bgShow = false;
                this.$apply();
                this.callTimer();
            } else {
                console.error('400电话异常\n', res);
            }
        } catch (err) {
            console.log(err);
        }
    }
    hideCallLayer() {
        this.call = util.constDeepMixin(this.call, {
            tick: 0,
            hidden: true,
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
                    hidden: true,
                });
                this.bgShow = true;
                this.$apply();
            }
        }, 1000);
    }
}
