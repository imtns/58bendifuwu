module.exports.sleep = (time = 300) => new Promise((resolve) => {
    setTimeout(() => { resolve(); }, time);
});
