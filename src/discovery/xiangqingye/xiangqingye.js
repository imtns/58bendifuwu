import util from '../../utils/util';
import { get } from '../../utils/ajax';
import { track } from '../../utils/track';

const im = require('../../utils/IMInit.js');
const app = require('../../app');

let timerId = null;
let urlMap = null; // 首次加载是否展示地图
let urlTel = null; // 首次加载是否展示电话弹窗
const host = 'https://xiaochengxu.58.com';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        detailShow: true, // 控制服务描述展示
        imgShow: true, // 控制图片展示
        bgShow: true, // 控制背景展示
        apCurrent: 0, // 控制轮播的索引
        imgWidth: 0, // 轮播外层宽度
        infoTitle: '', // 标题
        infocontent: '', // 服务描述
        objectType: '', // 服务类型
        postDate: '', // 发布日期
        renzheng: {}, // 认证相关
        liulan: '666', // 浏览量
        commparamMap: '', // 地图数据
        otherEntity: {}, // 其他认证
        commercializationMap: {}, // 相册
        serviceRange: [], // 服务区域
        infoId: '',
        userId: '',
        city: '',
        call: {
            tick: 0,
            hidden: true,
        },
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        track('show', {
            area: options.city,
            pagetype: `xingqingye_${options.cate2ListName}`, // 页面类型，没有置空【必填】
        });
        const that = this;
        urlMap = false;
        urlTel = false;
        if (options.map) {
            urlMap = true;
        }
        if (options.tel) {
            urlTel = true;
        }
        this.setData({
            infoId: options.infoid,
            userId: '',
            city: options.city,
            listName: options.cate2ListName,
            sign: options.sign,
            openid: options.openid ? options.openid : '',
        });
        const url = `${host}/${options.city}/${options.cate2ListName}/${options.infoid}x.shtml`;
        get(url, {}, (e, response) => {
            if (e) {
                console.log(e);
                return false;
            }
            if (response.commercializationMap && response.commercializationMap.picSmallList.length > 0) {
                this.setData({
                    imgWidth: (response.commercializationMap.picSmallList.length * 168) + 15,
                });
            }
            this.setData({
                infoTitle: response.infoTitle,
                infocontent: response.infocontent,
                goblianxiren: response.goblianxiren,
                objectType: response.objectType,
                postDate: response.postDate,
                liulan: response.liulan || '',
                commparamMap: response.commparamMap || '',
                wltEntity: response.wltEntity || '',
                otherEntity: response.otherEntity || '',
                commercializationMap: response.commercializationMap || '',
                serviceRange: response.serviceRange || '',
                extendMap: response.wltEntity ? response.wltEntity.extendMap : '',
                qiyeEntity: response.qiyeEntity,
                shoplogo: response.extendMap ? response.extendMap.shoplogo : 'https://img.58cdn.com.cn/olympia/img/shenghuo/final/default-shopimg.png',
                renzheng: response.renzheng,
                userId: response.uid,
            });
            if (urlMap) {
                that.onmapFun();
            }
            if (urlTel) {
                that.call_tick(1);
            }
            return true;
        });
    },
    /**
     * 展示图片
     */
    showImg(e) {
        this.setData({
            imgShow: false,
            bgShow: false,
            apCurrent: e.currentTarget.dataset.index,
        });
    },
    /**
     * 隐藏
     */
    hiddenFun() {
        this.setData({
            imgShow: true,
            bgShow: true,
            detailShow: true,
            apCurrent: 0,
        });
    },
    /**
     * 微聊
     */
    goChat() {
        console.log('点击接入微聊');
        const options = {
            user_id: this.data.userId,
            user_source: 2,
            refer: {
                invitation: {
                    id: this.data.infoId, // 帖子id
                    rootcateid: this.data.listName, // 一级分类id(表现类别)
                    cateid: '', // 最细类别id(表现类别)
                    scene: '', // 聊天触发的场景(listing"为列表详情页，其余由业务侧自己定义)
                    role: 1, // 角色标识,"1"为发帖者(业务线统一都传"1")
                    refer_time: new Date().getTime(),
                },
            },
            router_type: 'navigateTo',
        };
        im.gotoChat(options);
    },
    IMsuccess() {},
    IMerror(err) {
        console.log(err.msg);
    },
    /**
     * 控制服务描述展示
     */
    detailShow() {
        if (this.data.detailShow) {
            this.setData({
                detailShow: false,
            });
        } else {
            this.setData({
                detailShow: true,
            });
        }
    },
    /**
     * 地图跳转
     */
    onmapFun() {
        const that = this;
        const x = Math.floor(that.data.commparamMap.latitude * 100000) / 100000;
        const y = Math.floor(that.data.commparamMap.longitude * 100000) / 100000;
        wx.openLocation({
            latitude: x,
            longitude: y,
            address: that.data.commparamMap['商家地址'],
            name: this.data.qiyeEntity.enterpriseName,
        });
    },
    /* 打电话 s */
    call_tick(e) {
        const self = this;
        let data;
        const { position } = e.currentTarget.dataset;
        track('click', {
            clickTag: `xiangqingye_call_${position}`,
        });
        if (e === 1) {
            data = {
                sign: self.data.sign,
                infoId: self.data.infoId,
                source: 0,
                type: 0,
                openid: self.data.openid,
            };
        } else {
            data = {
                sign: self.data.sign,
                infoId: self.data.infoId,
                source: 0,
                type: 0,
            };
        }
        wx.request({
            url: `${app.globalData.domain}/smallapp/common/link`,
            data: data,
            header: app.globalData.testHeader,
            success(res) {
                if (res.data.code === 0) {
                    self.setData({
                        call: util.constDeepMixin(self.data.call, {
                            teleNumber: parseInt(res.data.data[0]) + 1 ? res.data.data : '服务忙',
                            tick: 180,
                            hidden: false,
                        }),
                        bgShow: false,
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
                        tick: --self.data.call.tick,
                    }),
                });
            } else {
                clearInterval(timerId);
                self.setData({
                    call: util.constDeepMixin(self.data.call, {
                        tick: 0,
                        hidden: true,
                    }),
                    bgShow: true,
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
            bgShow: true,
        });
    },
    call() {
        const self = this;
        wx.makePhoneCall({
            phoneNumber: self.data.call.teleNumber,
        });
    },
    /* 打电话 e */
    // 分享
    onShareAppMessage() {},
});
