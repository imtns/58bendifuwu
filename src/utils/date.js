function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : `0${n}`;
}

function formatTime(onlyDate) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    if (onlyDate) {
        return [year, month, day].map(formatNumber).join('.');
    }
    return `${[year, month, day].map(formatNumber).join('-')} ${[
        hour,
        minute,
        second,
    ]
        .map(formatNumber)
        .join(':')}`;
}

function formatTimeExtra(time, withYear) {
    const date = new Date(time.replace(/-/g, '/'));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (withYear) {
        return `${[year, month, day].map(formatNumber).join('.')} ${[
            hour,
            minute,
        ]
            .map(formatNumber)
            .join(':')}`;
    }
    return `${[month, day].map(formatNumber).join('.')} ${[hour, minute]
        .map(formatNumber)
        .join(':')}`;
}

function parseTime(dateString) {
    const reg = new RegExp(/([0-9]{4})-([0-1]{0,1}[0-9]{1})-([0-3]{0,1}[0-9]{1})\s?([0-6]{0,1}[0-9]{1})?:?([0-6]{0,1}[0-9]{1})?:?([0-6]{0,1}[0-9]{1})?/,);
    const [
        year,
        date = 1,
        hours = 0,
        minutes = 0,
        seconds = 0,
    ] = dateString.toString().match(reg);
    let { month = 1 } = dateString.toString().match(reg);
    const newDate = new Date();
    newDate.setFullYear(year - 0);
    newDate.setMonth(--month);
    newDate.setDate(date - 0);
    newDate.setHours(hours - 0);
    newDate.setMinutes(minutes - 0);
    newDate.setSeconds(seconds - 0);
    return newDate.getTime();
}

function appendZero(num) {
    return parseInt(num) < 10 ? `0${num}` : num;
}

function toDateString(date) {
    let temp;
    if (date === undefined) return false;
    if (date instanceof Date) {
        temp = date;
    } else if (typeof date === 'string') {
        temp = new Date();
        temp.setTime(parseTime(date));
    } else if (date instanceof Number) {
        temp = new Date();
        temp.setTime(date);
    } else {
        return date;
    }
    const year = temp.getFullYear();
    const month = temp.getMonth() + 1;
    date = temp.getDate();
    return `${year}-${appendZero(month)}-${appendZero(date)}`;
}

function addDay(dateString, num) {
    const time = parseTime(dateString);
    const addSecond = num * 24 * 60 * 60 * 1000;
    const ret = new Date();
    ret.setTime(time + addSecond);
    return ret;
}

function addHour(dateString, num) {
    let time;
    if (typeof dateString === 'number') {
        num = dateString;
        time = Date.now();
    } else {
        time = parseTime(dateString);
    }
    const addSecond = num * 60 * 60 * 1000;
    const ret = new Date();
    ret.setTime(time + addSecond);
    return ret;
}
module.exports = {
    addHour,
    addDay,
    parseTime,
    formatTime,
    appendZero,
    toDateString,
    formatTimeExtra,
};
