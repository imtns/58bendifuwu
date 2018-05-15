function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : `0${n}`;
}

function formatTime(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
}

function dateToArray(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const week = date.getDay();
    return {
        y: year,
        m: month,
        d: day,
        h: hour,
        i: minute,
        s: second,
        w: week,
    };
}

function isPrimitiveValue(val) {
    if (typeof val === 'number' || typeof val === 'string' || typeof val === 'boolean') {
        return true;
    }
    return false;
}

function isArray(val) {
    return Array.isArray(val);
}

function isObject(val) {
    return Object.prototype.toString.call(val) === '[object Object]';
}
// 深度混合，obj1被修改和返回
function deepMixin(obj1, obj2) {
    Object.keys(obj2).forEach((key) => {
        if (isPrimitiveValue(obj2[key]) || isArray(obj2[key])) {
            obj1[key] = obj2[key];
        } else if (isObject(obj2[key]) && obj1[key] === undefined) {
            obj1[key] = obj2[key];
        } else if (isObject(obj2[key])) {
            deepMixin(obj1[key], obj2[key]);
        }
    });
    return obj1;
}
// 深度混合，返回混合后对象，obj1、obj2都不会被修改
function constDeepMixin(obj1, obj2) {
    const ret = {};
    deepMixin(ret, obj1);
    deepMixin(ret, obj2);
    return ret;
}

function getId58() {
    const timestamp = new Date().getTime();
    const x = 'qwertyuiopasdfghjklzxcvbnm';
    let tmp = '';
    for (let i = 0; i < 19; i++) {
        tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
    }
    const id58 = timestamp + tmp;
    return id58;
}

function callShangjiatong() {
    try {
        wx.navigateToMiniProgram({
            appId: 'wx49b3af93cbcd737b',
            path: 'vendors/im/pages/sessions/sessions',
            extraData: {},
            envVersion: 'trial', // trial release
            success() {
                // 打开成功
                console.log('打开成功！');
            },
            complete(resp) {
                console.log(`${resp.errMsg}`);
            },
        });
    } catch (e) {
        wx.showToast({
            title: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
            icon: '',
            duration: 5000,
        });
    }
}
module.exports = {
    formatTime: formatTime,
    dateToArray: dateToArray,
    formatNumber: formatNumber,
    constDeepMixin: constDeepMixin,
    getId58: getId58,
    callShangjiatong: callShangjiatong,
};
