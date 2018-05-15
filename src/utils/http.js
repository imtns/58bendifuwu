import wepy from 'wepy';

const host = 'https://short.58.com/bendifuwu/';
const http = (method, ...props) => new Promise((resolve, reject) => {
    let [data] = props;
    const { url } = props;
    if (typeof data === 'function') {
        resolve(data);
        data = {};
    }
    const sendData = Object.assign({}, data, { creditial: 'same-origin' });
    wx.showLoading && wx.showLoading({ title: '加载中', mask: true });
    wepy.request({
        url: host + url + (~url.indexOf('?') ? '' : '?'),
        data: sendData,
        method: method,
        dataType: 'json',
        header: {
            'content-type': method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        },
        success(response) {
            const { status, message, data } = response.data;
            if (status === 1) {
                resolve(data);
            } else {
                resolve(message);
            }
        },
        fail(e) {
            reject(e);
        },
        complete() {
            wx.hideLoading && wx.hideLoading();
        },
    });
});
module.exports.get = (...props) => http('GET', ...props);
module.exports.post = (...props) => http('POST', ...props);
