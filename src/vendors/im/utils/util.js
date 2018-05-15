module.exports = {
    convertUrl(url) {
        if (url.indexOf('http') === 0) {
            return url;
        } else if (url.indexOf('//') === 0) {
            return `https:${url}`;
        }
        return true;
    },
};
