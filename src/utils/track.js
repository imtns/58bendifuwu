/* eslint-disable camelcase */
import { sendClickLog, sendTrackLog } from '../utils/maidian';

module.exports.track = (type, params) => {
    const appid = 'wxc81edb242dec62d4';
    const uid = wx.getStorageSync('token') || '';

    /* global getCurrentPages:true */
    const pages = getCurrentPages(); // 获取加载的页面
    const prevPage = pages[pages.length - 2];
    const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
    const url = currentPage.route; // 当前页面url
    const prevUrl = (prevPage && prevPage.route) || '';
    const trackURL = {
        cate: params.cateid || '', // 表现类别全路径，没有置空【必填】
        area: params.area || '', // 表现地域全路径，没有置空【必填】
        pagetype: params.pagetype || '', // 页面类型，没有置空【必填】
        page: params.page || '', // 二级页面类型，没有置空
        pagePath: url, // 小程序路径【必填】
        refPagePath: prevUrl || '', // 上一级路径，没有置空【必填】
        scene: wx.getStorageSync('scene') || 1001, // 打开小程序的场景值，如1001【必填】
        spm: params.spm || '', // 投放渠道标识
        refAppId: params.refAppId || '', // 来源小程序或公众号或App的 appId，注意如果首次访问有值，后续访问继续传递该值，直到关闭小程序
    };
    if (type === 'click') {
        sendClickLog(appid, uid, JSON.stringify(trackURL), params.clickTag);
    } else {
        sendTrackLog(appid, uid, JSON.stringify(trackURL));
    }
};