/* eslint-disable */
function formatRecentTime(timemillis, from) {
    if (timemillis % 1 != 0) { return timemillis; }
    timemillis = parseInt(timemillis);
    timemillis = (timemillis > 9999999999 ? timemillis : timemillis * 1000);
    let d = new Date(timemillis),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        date = d.getDate(),
        month = d.getMonth() + 1,
        day = d.getDay(),
        now = new Date(),
        week,
        todayMillis,
        todayWeek,
        weekMillis,
        yesterdayMillis,
        yearMillis,
        hourMinutes = `${hours < 10 ? `0${  hours}` : hours }:${ minutes < 10 ? `0${  minutes}` : minutes}`,
        formatString = '';
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    todayMillis = now.getTime();
    todayWeek = now.getDay();
    weekMillis = null;
    week = null;
    yesterdayMillis = todayMillis - 24 * 3600000;
    yearMillis = (new Date(`${now.getFullYear().toString() }/01/01 00:00:00`)).getTime();
    switch (day) {
    case 1:
        week = '星期一 ';
        break;
    case 2:
        week = '星期二 ';
        break;
    case 3:
        week = '星期三 ';
        break;
    case 4:
        week = '星期四 ';
        break;
    case 5:
        week = '星期五 ';
        break;
    case 6:
        week = '星期六 ';
        break;
    case 0:
        week = '星期日';
        break;
    }
    if (todayWeek !== 0) {
        weekMillis = todayMillis - (todayWeek - 1) * 24 * 3600000;
    } else {
        weekMillis = todayMillis - 6 * 24 * 3600000;
    }
    if (timemillis >= todayMillis) {
        formatString = hourMinutes;
    } else if (timemillis >= yesterdayMillis) {
        if (from === 'chat') {
            formatString = `昨天 ${hourMinutes}`;
        } else {
            formatString = '昨天';
        }
    } else if (timemillis >= weekMillis) {
        if (from === 'chat') {
            formatString = week + hourMinutes;
        } else {
            formatString = week;
        }
    } else if (timemillis >= yearMillis) {
        formatString = `${month < 10 ? `0${  month}` : month}-${date < 10 ? `0${  date}` : date}`;
    } else {
        formatString = `${new Date(timemillis).getFullYear().toString()}-${month < 10 ? `0${  month}` : month }-${date < 10 ? `0${  date}` : date}`;
    }
    return formatString;
}
module.exports = {
    formatRecentTime: formatRecentTime,
};
