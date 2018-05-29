let timestamp = null;
let n = 0;

export const openDebug = () => {
    console.log(timestamp);
    const now = +new Date();
    if (!timestamp || now - timestamp > 2e3) {
        timestamp = +new Date(),
        n = 0;
        return;
    }

    n++;
    if (n > 5) {
        wx.showModal({
            title: '提示',
            content: '您要进入调试模式吗？',
            success({ confirm }) {
                wx.setEnableDebug({ enableDebug: !!confirm })
            }
        });
    }
}
