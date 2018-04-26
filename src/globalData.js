export default {
    tokenFirstReady: false, //launch 后首次token可用
    domain:'https://bossapi.58.com',
    userInfo:null,
    os: wx.getSystemInfoSync().platform,
    accesstoken: wx.getStorageSync('token'),
    city: 'bj',
    netType: '',
    hyname:'',
    token:'',
    userType:0,
    testHeader: {
      "version": "7",
      "channel": "5",
      "id58": "",
      "ip": "10.252.22.236",
      'content-type': 'application/json'
    },
    ppu: wx.getStorageSync('ppu'),
    uid: wx.getStorageSync('uid'),
    imtoken: wx.getStorageSync('im_token'),
    listCookie:''
}