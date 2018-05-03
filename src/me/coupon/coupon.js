import { get } from '../../utils/ajax';
import {parseTime} from "../../utils/date";

/**
 * @desc 要看到数据首先要更改接口，
 */

// me/coupon/coupon.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options = {}) {
        this.setData(options)
        this.getCouponList();
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
    getCouponList() {
        var _this = this;

        var data = this.data.reserveId ? {
            pageSize: 100,
            pageNum: 1,
            serviceId: this.data.reserveId
        } : {
            pageSize: 100,
            pageNum: 1,
            couponSearchType: this.data.couponStatus
        };
        var url = this.data.reserveId ? '/businessCoupon/serviceCouponList' : '/businessCoupon/consumerCouponList';
        get(
            url,
            data,
            (e, res) => {
                if (e) {
                    return;
                }
                var vm = _this.formatState(res);
                _this.setData({
                    coupons: res,
                    vm
                })
            }
        );
    },
    formatState(coupons) {
        if (coupons === undefined || coupons.length === 0) return coupons;
        var ret = coupons.map(coupon => {
            var condition = JSON.parse(coupon.couponCondition);
            var reg = /([0-9]{4})-([0-1]{0,1}[0-9]{1})-([0-3]{0,1}[0-9]{1}).+/;
            if (coupon.validType === 1) {
                return Object.assign(
                    coupon,
                    condition, {
                        validStartDate: coupon.validStarttime.replace(reg, '$1.$2.$3'),
                        validEndDate: coupon.validEndtime.replace(reg, '$1.$2.$3')
                    }
                )
            } else {
                return Object.assign(
                    coupon,
                    condition
                );
            }
        })
        return ret;
    },
    onTabItem(e) {
        var {
            status
        } = e.target.dataset
        this.setData({
            couponStatus: status,
            coupons: [],
            vm: []
        })
        this.getCouponList();
    },
    checkValidDate(coupon) {
        var {
            validType,
            validAfterDays,
            createTime,
            validEndtime,
            validStarttime
        } = coupon;
        var ret = false;
        var nowSecond = new Date().getTime();
        if (validType == '1') {
            var startTime = parseTime(validStarttime);
            var endTime = parseTime(validEndtime);
            ret = nowSecond > startTime && nowSecond < endTime;
        } else {
            var startTime = parseTime(createTime) + (parseInt(validAfterDays) * 24 * 60 * 60 * 1000);
            ret = nowSecond > startTime;
        }

        !ret && wx.showModal({
            showCancel: false,
            title: '',
            content: '该优惠卷不在使用期'
        })
        return ret;
    },
    onUseCoupon(e) {
        var {
            index
        } = e.currentTarget.dataset;
        var coupon = this.data.vm[index];
        var {
            serviceIds,
            applyType
        } = coupon;
        var couponValue = coupon.couponType == 1 ? coupon.reliefAmount : coupon.couponDiscard;
        if (!this.checkValidDate(coupon)) return;
        if (applyType === 1) {
            wx.showModal({
                showCancel: false,
                title: '',
                content: '该优惠券为全店通用券，快去选购产品吧',
            })
        } else {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
    }
})
