const http = (method, ...props) => {
    let [url, data, callback] = props;
    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    const sendData = Object.assign({}, data);

    wx.showLoading && wx.showLoading({ title: '加载中', mask: true });
    return wx.request({
        url: url,
        data: sendData,
        method: method,
        dataType: 'json',
        header: {
            "content-type": method === "GET" ? "application/json" : "application/x-www-form-urlencoded"
        },
        success(response) {
            callback && callback(null, response.data, response);
            // const { code, msg, data } = response.data;
            // if (code == 0) {
            //     callback && callback(null, response.data);
            // } else if (code == 1) {
            //     callback && callback(null, response.data);
            // } else {
            //     callback && callback(msg);
            // }
        },
        fail(e) {
            callback && callback(e);
        },
        complete() {
            wx.hideLoading && wx.hideLoading();
        }
    });
};


module.exports.get = (...props) => {
    return http('GET', ...props);
};

module.exports.post = (...props) => {
    return http('POST', ...props);
};
