/* eslint-disable */
var $jscomp={scope:{},owns:function(f,c){return Object.prototype.hasOwnProperty.call(f,c)}};$jscomp.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(f,c,a){if(a.get||a.set)throw new TypeError("ES3 does not support getters and setters.");f!=Array.prototype&&f!=Object.prototype&&(f[c]=a.value)};$jscomp.getGlobal=function(f){return"undefined"!=typeof window&&window===f?f:"undefined"!=typeof global&&null!=global?global:f};$jscomp.global=$jscomp.getGlobal(this);
$jscomp.polyfill=function(f,c,a,k){if(c){a=$jscomp.global;f=f.split(".");for(k=0;k<f.length-1;k++){var h=f[k];h in a||(a[h]={});a=a[h]}f=f[f.length-1];k=a[f];c=c(k);c!=k&&null!=c&&$jscomp.defineProperty(a,f,{configurable:!0,writable:!0,value:c})}};$jscomp.polyfill("Object.assign",function(f){return f?f:function(c,a){for(var k=1;k<arguments.length;k++){var h=arguments[k];if(h)for(var f in h)$jscomp.owns(h,f)&&(c[f]=h[f])}return c}},"es6-impl","es3");
$jscomp.findInternal=function(f,c,a){f instanceof String&&(f=String(f));for(var k=f.length,h=0;h<k;h++){var p=f[h];if(c.call(a,p,h,f))return{i:h,v:p}}return{i:-1,v:void 0}};$jscomp.polyfill("Array.prototype.findIndex",function(f){return f?f:function(c,a){return $jscomp.findInternal(this,c,a).i}},"es6-impl","es3");
(function(f,c){if("object"===typeof exports&&"object"===typeof module)module.exports=c();else if("function"===typeof define&&define.amd)define([],c);else{c=c();for(var a in c)("object"===typeof exports?exports:f)[a]=c[a]}})(this,function(){return function(f){function c(k){if(a[k])return a[k].exports;var h=a[k]={exports:{},id:k,loaded:!1};f[k].call(h.exports,h,h.exports,c);h.loaded=!0;return h.exports}var a={};c.m=f;c.c=a;c.p="";return c(0)}([function(f,c,a){var k=a(1),h=a(15);c=a(3).inherits;var p=
    a(3).each,n=a(3).extend,m=a(3).fnEmpty,e=a(3).urlConvert,b=a(3).toString,d=a(11),l=a(22),g=a(27),r=new d({}),d=a(31),u=a(10),q=a(25),v=a(17);a(8);var t={name:"wechat",version:"0"};a(14).set("xcx");var w,x=new d({ack:function(b,a,d){var e=b.valueType;"message"==e||"commandmsg"==e?(b=y(b.value).map(function(b){var a=b.msg_list,d=a[0];return{sender_id:b.sender_id,sender_source:b.sender_source,to_id:d.to_id,to_source:d.to_source,msg_ids:a.map(function(b){return b.msg_id})}}),g.ackMsgBatch(b,function(){a()},
    function(){d()})):(void 0,d())}}),y=function(b){if(!Array.isArray(b))return void 0,[];var a={};b.forEach(function(b){"string"==typeof b.content&&(b.content=JSON.parse(b.content));var d=b.sender_id+"@"+b.sender_source;a[d]?a[d].push(b):a[d]=[b]});var d=[];p(a,function(b,a){b=b.split("@");d.push({sender_id:b[0],sender_source:b[1],msg_list:a.sort(function(b,a){return b.msg_id-a.msg_id})})});return d};f.exports=c(k,{constructor:function(a){k.call(this,t);w=u.get();(function(d){d.init(a);x.addEventListener(q.logout,
    function(b){void 0;d.stop(b)});x.addEventListener(q.connectchange,function(b,a){d.triggerEvent(q.connectchange,b,a)});x.addEventListener(q.msgReceived,function(a){var m=[];a.forEach(function(b){if(b.sender_id!=b.to_id||b.sender_source!=b.to_source){var a=b.content;a&&(a.url=e(a.url+""));g.isNeedShow(b)&&("audio"===b.show_type&&(a.url=config_1["audio-converter"](a.url)),m.push(b))}});if(0!==m.length){var c={},h={};m.forEach(function(a){if(w.user_id==a.sender_id&&w.user_source==a.sender_source&&a.options&&
    a.options.sender_hide&&"1"===b(a.options.sender_hide))return!0;var e=a.sender_id+"@"+a.sender_source,l=a.to_id+"@"+a.to_source,m=e===w.user_id+"@"+w.user_source,e=m?l:e,l=c[e];if(!l||l.msg_id<a.msg_id)c[e]=a;g.setLastMsg(e.split("@")[0],e.split("@")[1],c[e]);if(!d._isAddUnreadNum(a))return!0;m||(a=h[e],h[e]=a?a+1:1)});g.saveUnreadNum(h);var k=[];p(c,function(a,b){var d=a.split("@");a=d[0];var d=d[1],e="string"===typeof b.content?JSON.parse(b.content):b.content;k.push({user:{user_id:a,user_source:d},
    msg:{content:e,send_time:b.send_time,msg_id:b.msg_id,msg_type:b.msg_type,client_only:b.options?b.options.client_only:"0",options:b.options}})});l.insert(k);a=y(m);d.triggerEvent(q.msgReceived,a);for(var r=0,n=a.length;r<n;r++){var f=a[r].sender_id,v=a[r].sender_source,t=d._filterReferMsg(f,v,a[r].msg_list);t&&g.setRefer(f,v,t)}}});g.addEventListener(q.unreadChanged,function(b){d.triggerEvent(q.unreadChanged,b)});g.addEventListener(q.referChanged,function(b){d.triggerEvent(q.referChanged,b)});l.addEventListener(q.sessionChanged,
    function(b){d.triggerEvent(q.sessionChanged,b)})})(this)},init:function(b){b.client_version="1.4.3.3";this._init(Object.assign({},{client_type:"weapp"},b));x.init(this.options.ws,this.options);w=u.get()},start:function(){var b=this;h(v.init.name,null,null,function(){b.triggerEvent(q.login);x.start();l.start();r.start();g.start()},function(a){b.triggerEvent(q.imTokenExpired,a)})},stop:function(b){void 0;x.stop();l.stop();r.stop();g.stop();this.triggerEvent(q.logout,b)},sendMsg:function(b){var a={msg:null,
    onSendMsgBegin:m,onSendMsgSuccess:m,onSendMsgFail:m};n(a,b);this._send(a)}})},function(f,c,a){var k=a(2);c=a(3);var h=c.urlConvert,p=c.inherits,n=c.extend,m=c.fnEmpty,e=c.toString,b=c.isEmpty,d=c.each,l=a(4),g=a(5),r=a(8),u=a(10),q=new (a(11))({}),v=a(22),t=a(27),w=a(30),x=function(b){for(var a=[],d=0;d<b.length;d++)-1<["text","image","audio","location"].indexOf(e(b[d].show_type))&&(b[d].refer&&b[d].refer.invitation||a.push(b[d]));return a},y=function(b,a,d){for(var l=null,g=0;g<d.length;g++)if(-1<
    ["text","image","audio","location"].indexOf(e(d[g].show_type))&&d[g].refer&&-1!==d[g].refer.indexOf("invitation")&&(l=d[g].refer,"string"===typeof l&&(l=JSON.parse(l)),l.invitation)){if(d[g].sender_id!==b||d[g].sender_source!==a)l.invitation.role=l.invitation.role&&"2"===e(l.invitation.role)?"1":l.invitation.role&&"1"===e(l.invitation.role)?"2":"",l.invitation.refer_time=d[g].send_time;break}return l},B=function(b,a){var d=this,e=function(){var b=[],a=0;return function(l,g){a++;if(1<a)return g(null);
    d.getMsgRecords(l,function(a){if(0===a.length)return g(null);var d=y(l.user_id,l.user_source,a);d&&g({refer:d,user_id:l.user_id,user_source:l.user_source});Array.prototype.push.apply(b,x(a));!d&&5>b.length?(l.msg_id=a[a.length-1].msg_id,e(l,g)):!d&&5<=b.length&&g(null)},function(){g(null)})}}();e(b,a)},C=function(b,a,d){var e=y(b,a,d);e?t.setRefer(b,a,e):this.getRefer(b,a)||B.call(this,{user_id:b,user_source:a,msg_id:d[d.length-1].msg_id,count:20,option:-1},function(b){b&&b.refer&&t.setRefer(b.user_id,
        b.user_source,b.refer)})},D=function(b){var a=[],d={},e=l.checkUid(b).ebuidKey,g=b[e];if("object"!==typeof g||isNaN(g.length))a.push(b[e]),d[b[e]]={},d[b[e]].key=e;else for(b=0;b<g.length;b++)if(l.checkUid(g[b]).isHaveEbuid){var e=l.checkUid(g[b]).ebuidKey,m=g[b][e];a.push(m);d[m]={};d[m].num=b;d[m].key=e}return{uids:a,originObj:d}},z=0,A={};f.exports=p(k,{constructor:function(b){k.call(this);this.lasttime=0;this.options={api:null,ws:null,user_id:null,source:null,im_token:null,client_version:"1.4.3.3",
    os_type:b.name,os_version:b.version,appid:"",sdk_version:4630,getNewToken:function(b){b("token")}}},_exchangeUid:function(b,a){if(!l.checkUid(b).isHaveEbuid)return a();var e=D(b),g=e.originObj;this.exchangeXid(e.uids,function(e){d(e,function(a,d){var e=l.checkUid(b).ebuidKey,m=g[a].key;"object"!==typeof b[e]||isNaN(b[e].length)?b[m]=d:b[e][g[a].num][m]=d});a()},function(){a()})},_filterReferMsg:function(b,a,d){return y(b,a,d)},_isAddUnreadNum:function(b){var a=!0;if("tip"===b.show_type+""||b.options&&
    "1"===b.options.talk_list_order_ig+"")a=!1;return a},_getNewToken:function(b){var a=(new Date).getTime(),d=a-this.lasttime;if(3E3<d)this.lasttime=a,this.options.getNewToken(function(a){b(a)});else{var e=this;setTimeout(function(){e._getNewToken(b)},d-3E3)}},_init:function(b){n(this.options,b);r.appid=this.options.appid;b={user_id:this.options.user_id,source:this.options.source,im_token:this.options.im_token,client_version:this.options.client_version,client_type:this.options.client_type,os_type:this.options.os_type,
    os_version:this.options.os_version,appid:this.options.appid,sdk_version:this.options.sdk_version,device_id:this.options.device_id};b.im_token||(b.im_token="whatever",b.device_id=this.options.user_id);var a=this;g.init(this.options.api,b,function(b){switch(b.error_code){case 40002:case 40012:case 40013:void 0;a.stop("ajax error code:"+b.error_code);if(5<++z)break;a._getNewToken(function(b){a.options.im_token=b;a.init(a.options);a.start()});break;default:z=0}});u.set(this.options.user_id,this.options.source)},
    _send:function(b){this._exchangeUid(b.msg,function(){var a=b.msg,d=u.get(),e={sender_id:d.user_id,sender_source:d.user_source,to_id:a.to_id,to_source:a.to_source,msg_type:a.msg_type,show_type:a.show_type,content:n(!0,{},a.content),options:a.options,show_in_app:a.show_in_app,refer:n(!0,{},a.refer)};b.onSendMsgBegin();t.send(e,function(a){v.insert({user:{user_id:e.to_id,user_source:e.to_source},msg:{content:e.content,send_time:a.send_time,msg_id:a.msg_id,msg_type:e.msg_type}});b.onSendMsgSuccess(a)},
        function(a){b.onSendMsgFail(a)})})},getMsgRecords:function(b,a,d){var l=this,g=u.get();l._exchangeUid(b,function(){t.getMsgRecords(b,function(d){if(0===d.length)return a(d);if("-1"===e(b.option)&&"10"===e(b.count))if(b.msg_id){var m=y(b.user_id,b.user_source,d);m&&t.setRefer(b.user_id,b.user_source,m)}else C.call(l,b.user_id,b.user_source,d);l.getContact([{user_id:b.user_id,user_source:b.user_source},{user_id:g.user_id,user_source:g.user_source}],function(b){d.forEach(function(a,d){a.sender_info=
        b[a.sender_id+"@"+a.sender_source];a.to_info=b[a.to_id+"@"+a.to_source];"image"===a.show_type&&a.content&&(a.content.url=h(a.content.url+""));"audio"===a.show_type&&(a.content.url=r["audio-converter"](a.content.url))});a(d)})},d)})},start:m,stop:m,addSession:function(b){var a=this,d=b.user;a._exchangeUid(d,function(){a.getContact(d.user_id,d.user_source,function(b){q.addUser(b);v.insert({user:{user_id:b.user_id,user_source:b.user_source},msg:null})})})},getContact:function(){var b=arguments;if(3===
        b.length){var a=b[1],d=b[2],e={user_id:b[0]};this._exchangeUid(e,function(){q.getUserinfo({target_user_id:e.user_id,target_user_source:a},function(b){d(b)},function(b){d(null)})})}else if(2===b.length){var l=b[0],d=b[1],e={user_ids:l};this._exchangeUid(e,function(){q.getUserinfos(e.user_ids,function(b){d(b)},function(){d({})})})}},sendMsg:m,read:function(b,a){var d={user_id:b};this._exchangeUid(d,function(){var b,e=0,l=setInterval(function(){e++;if(10<e)return clearInterval(l);(b=t.getLastMsg(d.user_id,
        a))&&b.msg_id&&(clearInterval(l),t.setUnreadToZero(d.user_id,a,b.msg_id))},100)})},getSessions:function(b,a,d){v.getSessions(function(b,d){a(b,d)})},getCaptcha:function(b,a,d){w.getCaptcha(b,a,d)},validateCaptcha:function(b,a,d){w.validateCaptcha(b,a,d)},getAllUnreadAmount:function(){return t.getAllUnreadAmount()},getAllSessions:function(){return v.getAllSessions()},ackMsgRead:function(b,a,d){var e={user_ids:b};this._exchangeUid(e,function(){t.ackRead(e.user_ids,a,d)})},getRefer:function(b,a){return t.getRefer(b,
        a)},setRefer:function(b,a,d){var e={user_id:b};this._exchangeUid(e,function(){return t.setRefer(e.user_id,a,d)})},exchangeXid:function(a,d,e){for(var g={},m=[],c=0;c<a.length;c++)if(l.checkUid(a[c]).isHaveEbuid)g[a[c]]=a[c];else{var h=A[a[c]];b(h)?(g[a[c]]=null,m.push(a[c])):g[a[c]]=h}if(0==m.length)return d(g);q.exchangeXid(m,function(a){b(a)||(n(!0,A,a),n(!0,g,a));return d(g)},function(){return e(g)})}})},function(f,c){c=function(){this._events={}};c.prototype={addEventListener:function(a,c){var h=
    this._events[a];if(null!=h){for(var k=!1,n=0;n<h.length;n++)if(h[n]==c){k=!0;break}0==k&&h.push(c)}else h=[],h.push(c);this._events[a]=h},listen:function(a,c){this.addEventListener(a,c)},removeEventListener:function(a,c){a=this._events[a];if(null!=a)for(var h=0;h<a.length;h++)if(a[h]==c){a.splice(h,1);break}},remove:function(a,c){this.removeEventListener(a,c)},triggerEvent:function(a){var c=this._events[a];if(null!=c)for(var h=0;h<c.length;h++){var f=c[h];null!=f&&f.apply(null,Array.prototype.slice.call(arguments,
    1))}}};f.exports=c},function(f,c){var a=function(){var a={};"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(e){a["[object "+e+"]"]=e.toLowerCase()});return a}(),k=function(m){return null==m?m+"":"object"===typeof m||"function"===typeof m?a[{}.toString.call(m)]||"object":typeof m},h=Array.isArray,p=function(){var a,e,b,d,l,g=arguments[0]||{},c=1,n=arguments.length,q=!1;"boolean"===typeof g&&(q=g,g=arguments[c]||{},c++);"object"!==typeof g&&"function"!==
k(g)&&(g={});c===n&&(g=this,c--);for(;c<n;c++)if(null!=(l=arguments[c]))for(d in l)a=g[d],b=l[d],g!==b&&(q&&b&&("object"===k(b)||(e=h(b)))?(e?(e=!1,a=a&&h(a)?a:[]):a=a&&"object"===k(a)?a:{},g[d]=p(q,a,b)):void 0!==b&&(g[d]=b));return g},n=null;f.exports={extend:p,each:function(a,e){var b,d=0;if(h(a))for(b=a.length;d<b&&!1!==e.call(a[d],d,a[d]);d++);else for(d in a)if(!1===e.call(a[d],d,a[d]))break;return a},param:function(a){var e=[],b=1<arguments.length&&0==arguments[1]?"false":"true",d;for(d in a){var l=
    a[d],l=null==l?"":l;e[e.length]="false"===b?d+"\x3d"+l:encodeURIComponent(d)+"\x3d"+encodeURIComponent(l)}return e.join("\x26").replace(/%20/g,"+")},inherits:function(a,e,b){var d;"function"===typeof e?(d=e,e=null):d=e&&e.hasOwnProperty("constructor")?e.constructor:function(){return a.apply(this,arguments)};p(d,a,b||{});d.__super__=a.prototype;d.prototype=Object.create(a.prototype);d.prototype._super=a;e&&p(!0,d.prototype,e);return d},urlConvert:function(a){if(!a)return a;var e=a;-1<a.indexOf("https:")?
    e=a.substr(6):-1<a.indexOf("http:")?e=a.substr(5):0===a.indexOf("//")&&(e=a);return e},fnEmpty:function(){},toString:function(a){return a?a.toString():""},onload:function(a){"complete"===document.readyState?a&&a():(n=setTimeout(function(){void 0;n=null;a&&a()},1E4),$(window).load(function(){void 0;n&&(clearTimeout(n),a&&a())}))},isEmpty:function(a){return"null"===a+""||"undefined"===a+""||""===a}}},function(f,c){var a=["user_ids","user_id","to_id","sender_id"];c=function(){};c.prototype.checkUid=
    function(c){c="string"===typeof c?c:JSON.stringify(c);var h={ebuidKey:"",isHaveEbuid:!1};if(-1===c.indexOf("EP:"))return h;for(var f=0;f<a.length;f++)if(-1!=c.indexOf(a[f])){h.ebuidKey=a[f];h.isHaveEbuid=!0;break}return h};f.exports=new c},function(f,c,a){c=a(6);f.exports=c},function(f,c,a){c=a(7);f.exports=new c},function(f,c,a){c=a(3).inherits;var k=a(3).fnEmpty;f.exports=c(k,{constructor:function(){this.apiUrl="";this.commonParams={};this.errorHandler=k},init:function(a,c,n){this.apiUrl=a;this.commonParams=
    c;this.errorHandler=n},getApiUrl:function(){return this.apiUrl},getCommonParams:function(){return this.commonParams},getErrorHandler:function(){return this.errorHandler}})},function(f,c,a){c=function(){};c=a(9);f.exports=c},function(f,c){f.exports={prefix_name:"webim",storage_version:11,appid:null,"audio-converter":function(a){var c;"string"===typeof a&&-1<a.indexOf("audioconvert.58.com")?0===a.indexOf("http://audioconvert.58.com")?c=a.replace("http","https"):0===a.indexOf("//audioconvert.58.com")?
    c="https:"+a:0===a.indexOf("audioconvert.58.com")?c="https://"+a:0===a.indexOf("https://audioconvert.58.com")&&(c=a):c="https://audioconvert.58.com/convert?amrurl\x3d"+encodeURIComponent(a);return c}}},function(f,c){var a="",k="";f.exports={set:function(c,f){a=c;k=f},get:function(){return{user_id:a,user_source:k}}}},function(f,c,a){c=a(12);f.exports=c},function(f,c,a){c=a(13);f.exports=c},function(f,c,a){var k=a(2),h=a(14);c=a(3);var p=c.fnEmpty,n=c.each,m=c.inherits,e=c.urlConvert,b=c.param,d=c.extend,
    l=a(15),g=a(17),r=a(5),u=a(19),q={};f.exports=m(k,{constructor:function(){k.call(this);this._users={}},_convert:function(a){a&&(a.avatar=e(a.avatar+""));return a},start:p,stop:p,addUser:function(a){this._users[a.user_id+"@"+a.user_source]=a},getUserinfo:function(a,b,d){var e=a.target_user_id+"@"+a.target_user_source,c=this._users[e],q=this;if(c)return b(c);l(g.get_userinfo.name,a,null,function(a){a=q._convert(a);q._users[e]=a;b(a)},d)},getUserinfos:function(a,b,d){var e={},c=this,q=[];a.forEach(function(a){var b=
    a.user_id;a=a.user_source;var d=b+"@"+a;c._users[d]?e[d]=c._users[d]:q.push(b+":"+a)});if(0===q.length)b(e);else{var h=Math.ceil(q.length/50),f=0;for(a=0;a<h;a++){var m=[],m=a===h-1?q.slice(50*a):q.slice(50*a,50*(a+1));l(g.get_userinfo_batch.name,null,{ids:m},function(a){n(a,function(a,b){var d=a.split(":");a=d[0];d=d[1];b=c._convert(b);e[a+"@"+d]=b;c._users[a+"@"+d]=b});f++;f===h&&b&&b(e)},d)}}},exchangeXid:function(a,e,c){var f=d(!0,{},r.getCommonParams());f.targets=a.join(",");var n=b(f,!1),f=
    u(u(n)+f.appid);if("xcx"==h.get())l(g.exchange_xid.name,{targets:a.join(",")},{key:f},function(a){e&&e(a.result)},function(a){c&&c(null)});else{var m=a.join("@");if(q[m])q[m].then(function(a){e&&e(a.result)},function(a){c&&c(null)});else{var k=$.Deferred();l(g.exchange_xid.name,{targets:a.join(",")},{key:f},function(a){e&&e(a.result);k.resolve(a)},function(a){delete q[m];k.reject(a);c&&c(null)});q[m]=k.promise()}}}})},function(f,c){var a="";f.exports={get:function(){return a},set:function(c){a=c}}},
    function(f,c,a){c=a(16);f.exports=c},function(f,c,a){var k=a(17),h=a(5),p=a(18),n=a(21),m=a(3).extend,e=a(3).param;f.exports=function(a,d,c,g,f){var b=k[a];if(!b)return f("not found config.[api:"+a+"]");a={};"string"==typeof b?a.url=b:a=b;a.method=a.method||"get";var l,b=h.getCommonParams();"get"===a.method?(l=m({},b,d),a.sign&&(l.content_sign=p(JSON.stringify(d)))):"post"===a.method&&(l=m({},b),a.sign&&(l.content_sign=p(JSON.stringify(c))));l=e(l);d=h.getApiUrl()+"/"+a.url+"?params\x3d"+n(l)+"\x26version\x3d"+
        n.getVersion();c=c?n(JSON.stringify(c)):"";wx.request({url:d,method:a.method,dataType:"json",data:c||{},success:function(a){a=a.data;switch(a.error_code){case 0:g&&g(a.data);break;default:h.getErrorHandler()(a),f&&f(a)}},fail:function(a){f&&f(a)}})}},function(f,c){c={init:{url:"user/init",method:"get"},get_userinfo:{url:"user/get_userinfo",method:"get"},get_userinfo_batch:{url:"user/get_user_info_batch",method:"post"},get_user_online_info:{url:"user/get_user_online_info",method:"get"},get_users_online_info:{url:"user/get_users_online_info",
        method:"get"},add_black_list:{url:"user/add_black_list",method:"get"},del_black_list:{url:"user/del_black_list",method:"get"},is_blacked:{url:"user/is_blacked",method:"get"},sendmsg:{url:"msg/sendmessage",method:"post",sign:!0},ack_msg_batch:{url:"msg/ack_msg_batch",method:"post"},ack_msg_read:{url:"msg/ack_msg_read",method:"post"},ack_msg_show:{url:"msg/ack_msg_show",method:"post"},get_session_list:{url:"msg/get_session_list",method:"get"},get_chat_records:{url:"msg/get_chat_records",method:"get"},
        get_unrecv_msgs:{url:"msg/get_unrecv_msgs",method:"get"},get_captcha:{url:"msg/get_captcha",method:"get"},validate_captcha:{url:"msg/validate_captcha",method:"get"},exchange_xid:{url:"common/js/exchange_xid",method:"post"}};for(var a in c)c.hasOwnProperty(a)&&(c[a].name=a);f.exports=c},function(f,c,a){function k(a,c){for(var e="",b=0,d=a.length;b<d;b++)e+=a.charCodeAt(b)^c.charCodeAt(b);return e}var h=a(19),p=a(20);f.exports=function(a){var c=p.encode(a+"61e2e9e0d3e683bdfb96b66f60a07f31",!1),e="",
        b="",d="",l="";a=[];for(var g=0,f=c.length;g<f;g++)g<f/4?e+=c.charAt(g):g>=f/4&&g<f/4*2?b+=c.charAt(g):g>=f/4*2&&g<f/4*3?d+=c.charAt(g):l+=c.charAt(g);a.push(e);a.push(b);a.push(d);a.push(l);c=[];for(e=1;e<a.length;e++)c.push(k(a[0],a[e]));a="";for(e=0;e<c.length;e++)a+=c[e];return h(a+"61e2e9e0d3e683bdfb96b66f60a07f31")}},function(f,c){function a(a,b,d,c,g,f){a=n(n(b,a),n(c,f));return n(a<<g|a>>>32-g,d)}function k(e,b,d,c,g,f,h){return a(b&d|~b&c,e,b,g,f,h)}function h(e,b,d,c,g,f,h){return a(b&c|
        d&~c,e,b,g,f,h)}function p(e,b,d,c,g,f,h){return a(d^(b|~c),e,b,g,f,h)}function n(a,b){var d=(a&65535)+(b&65535);return(a>>16)+(b>>16)+(d>>16)<<16|d&65535}var m=0;f.exports=function(e){var b;b="";for(var d=-1,c,g;++d<e.length;)c=e.charCodeAt(d),g=d+1<e.length?e.charCodeAt(d+1):0,55296<=c&&56319>=c&&56320<=g&&57343>=g&&(c=65536+((c&1023)<<10)+(g&1023),d++),127>=c?b+=String.fromCharCode(c):2047>=c?b+=String.fromCharCode(192|c>>>6&31,128|c&63):65535>=c?b+=String.fromCharCode(224|c>>>12&15,128|c>>>6&
        63,128|c&63):2097151>=c&&(b+=String.fromCharCode(240|c>>>18&7,128|c>>>12&63,128|c>>>6&63,128|c&63));e=Array(b.length>>2);for(d=0;d<e.length;d++)e[d]=0;for(d=0;d<8*b.length;d+=8)e[d>>5]|=(b.charCodeAt(d/8)&255)<<d%32;b=8*b.length;e[b>>5]|=128<<b%32;e[(b+64>>>9<<4)+14]=b;b=1732584193;d=-271733879;c=-1732584194;g=271733878;for(var f=0;f<e.length;f+=16){var u=b,q=d,v=c,t=g;b=k(b,d,c,g,e[f+0],7,-680876936);g=k(g,b,d,c,e[f+1],12,-389564586);c=k(c,g,b,d,e[f+2],17,606105819);d=k(d,c,g,b,e[f+3],22,-1044525330);
        b=k(b,d,c,g,e[f+4],7,-176418897);g=k(g,b,d,c,e[f+5],12,1200080426);c=k(c,g,b,d,e[f+6],17,-1473231341);d=k(d,c,g,b,e[f+7],22,-45705983);b=k(b,d,c,g,e[f+8],7,1770035416);g=k(g,b,d,c,e[f+9],12,-1958414417);c=k(c,g,b,d,e[f+10],17,-42063);d=k(d,c,g,b,e[f+11],22,-1990404162);b=k(b,d,c,g,e[f+12],7,1804603682);g=k(g,b,d,c,e[f+13],12,-40341101);c=k(c,g,b,d,e[f+14],17,-1502002290);d=k(d,c,g,b,e[f+15],22,1236535329);b=h(b,d,c,g,e[f+1],5,-165796510);g=h(g,b,d,c,e[f+6],9,-1069501632);c=h(c,g,b,d,e[f+11],14,643717713);
        d=h(d,c,g,b,e[f+0],20,-373897302);b=h(b,d,c,g,e[f+5],5,-701558691);g=h(g,b,d,c,e[f+10],9,38016083);c=h(c,g,b,d,e[f+15],14,-660478335);d=h(d,c,g,b,e[f+4],20,-405537848);b=h(b,d,c,g,e[f+9],5,568446438);g=h(g,b,d,c,e[f+14],9,-1019803690);c=h(c,g,b,d,e[f+3],14,-187363961);d=h(d,c,g,b,e[f+8],20,1163531501);b=h(b,d,c,g,e[f+13],5,-1444681467);g=h(g,b,d,c,e[f+2],9,-51403784);c=h(c,g,b,d,e[f+7],14,1735328473);d=h(d,c,g,b,e[f+12],20,-1926607734);b=a(d^c^g,b,d,e[f+5],4,-378558);g=a(b^d^c,g,b,e[f+8],11,-2022574463);
        c=a(g^b^d,c,g,e[f+11],16,1839030562);d=a(c^g^b,d,c,e[f+14],23,-35309556);b=a(d^c^g,b,d,e[f+1],4,-1530992060);g=a(b^d^c,g,b,e[f+4],11,1272893353);c=a(g^b^d,c,g,e[f+7],16,-155497632);d=a(c^g^b,d,c,e[f+10],23,-1094730640);b=a(d^c^g,b,d,e[f+13],4,681279174);g=a(b^d^c,g,b,e[f+0],11,-358537222);c=a(g^b^d,c,g,e[f+3],16,-722521979);d=a(c^g^b,d,c,e[f+6],23,76029189);b=a(d^c^g,b,d,e[f+9],4,-640364487);g=a(b^d^c,g,b,e[f+12],11,-421815835);c=a(g^b^d,c,g,e[f+15],16,530742520);d=a(c^g^b,d,c,e[f+2],23,-995338651);
        b=p(b,d,c,g,e[f+0],6,-198630844);g=p(g,b,d,c,e[f+7],10,1126891415);c=p(c,g,b,d,e[f+14],15,-1416354905);d=p(d,c,g,b,e[f+5],21,-57434055);b=p(b,d,c,g,e[f+12],6,1700485571);g=p(g,b,d,c,e[f+3],10,-1894986606);c=p(c,g,b,d,e[f+10],15,-1051523);d=p(d,c,g,b,e[f+1],21,-2054922799);b=p(b,d,c,g,e[f+8],6,1873313359);g=p(g,b,d,c,e[f+15],10,-30611744);c=p(c,g,b,d,e[f+6],15,-1560198380);d=p(d,c,g,b,e[f+13],21,1309151649);b=p(b,d,c,g,e[f+4],6,-145523070);g=p(g,b,d,c,e[f+11],10,-1120210379);c=p(c,g,b,d,e[f+2],15,
            718787259);d=p(d,c,g,b,e[f+9],21,-343485551);b=n(b,u);d=n(d,q);c=n(c,v);g=n(g,t)}e=[b,d,c,g];b="";for(d=0;d<32*e.length;d+=8)b+=String.fromCharCode(e[d>>5]>>>d%32&255);e=b;try{m}catch(w){m=0}b=m?"0123456789ABCDEF":"0123456789abcdef";d="";for(g=0;g<e.length;g++)c=e.charCodeAt(g),d+=b.charAt(c>>>4&15)+b.charAt(c&15);return d}},function(f,c){(function(){for(var a={},c=0;64>c;c++)a["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(c)]=c;return a})();var a=String.fromCharCode,k=
        function(c){if(2>c.length){var f=c.charCodeAt(0);return 128>f?c:2048>f?a(192|f>>>6)+a(128|f&63):a(224|f>>>12&15)+a(128|f>>>6&63)+a(128|f&63)}f=65536+1024*(c.charCodeAt(0)-55296)+(c.charCodeAt(1)-56320);return a(240|f>>>18&7)+a(128|f>>>12&63)+a(128|f>>>6&63)+a(128|f&63)},h=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,p=function(a){var c=[0,2,1][a.length%3];a=a.charCodeAt(0)<<16|(1<a.length?a.charCodeAt(1):0)<<8|(2<a.length?a.charCodeAt(2):0);return["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>
        18),"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>12&63),2<=c?"\x3d":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a>>>6&63),1<=c?"\x3d":"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(a&63)].join("")};f.exports={encode:function(a,c){return c?String(a).replace(h,k).replace(/[\s\S]{1,3}/g,p).replace(/[+\/]/g,function(a){return"+"==a?"-":"_"}).replace(/=/g,""):String(a).replace(h,k).replace(/[\s\S]{1,3}/g,p)}}},function(f,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,a){var k=a(20);c=function(a){if(null==a||0==a.length)return"";a=k.encode(a);var c=0,f=a.indexOf("\x3d");-1!==f&&(c=a.length-f,a=a.substring(0,f));a=(a+c).replace(/\+/g,"-").replace(/\//g,"_");f=Math.floor(a.length/2);c=a.substring(f);a=a.substring(0,f);return c+a};c.getVersion=function(){return"j1.0"};f.exports=c},function(f,c,a){c=a(23);f.exports=c},function(f,c,a){var k=a(24);c=a(3).inherits;f.exports=new (c(k,{constructor:function(){k.call(this)},insert:function(a,c){this._insert(a,c)},getSessions:function(a){var c=
        this;this._getSessions(this.sessions,function(f,h){c._insert(f,function(){a(f,h)})})}}))},function(f,c,a){var k=a(2);c=a(3);var h=c.fnEmpty,p=c.each,n=c.inherits,m=c.extend,e=c.toString,b=a(15),d=a(25),l=a(17),g=a(10),r=a(14),u={};f.exports=n(k,{constructor:function(){k.call(this);this.sessions=[]},_sortCompare:function(a,b){return a.sort_time>b.sort_time?-1:1},_getPosition:function(a,b){for(var c=0;c<a.length;c++){var d=a[c];if(d.user.user_id==b.user.user_id&&d.user.user_source==b.user.user_source)return c}return-1},
        _insert:function(a,b){a=Array.isArray(a)?a:[a];var c=this,f=[],g=[],q=[],h=[];p(a,function(a,b){if(b.msg&&b.msg.client_only&&"1"===e(b.msg.client_only))return!0;b.msg?b.sort_time=b.msg.send_time:null==b.sort_time&&(b.sort_time=(new Date).getTime());a=c._getPosition(c.sessions,b);if(-1===a)g.push(b),c.sessions.push(b),f.push(b);else{var d=c.sessions[a];d.sort_time<b.sort_time&&(g.push(b),d.sort_time=b.sort_time,d.msg=b.msg)}-1!==a&&b.msg&&b.msg.options&&"1"===b.msg.options.talk_list_order_ig+""&&q.push({session:b,
            pos:a})});if(0===g.length)return b&&b(h);p(g,function(a,b){b.msg&&b.msg.client_only&&"1"===e(b.msg.client_only)||h.push(b)});b&&b(h);var k=m(!0,[],this.sessions);q.forEach(function(a){k.splice(a.pos,1)});k=k.sort(this._sortCompare);q.forEach(function(a){k.splice(a.pos,0,a.session)});this.sessions=k;this.triggerEvent(d.sessionChanged,this.getAllSessions());0<f.length&&(this.triggerEvent(d.newSessionLoaded,d.MORE,f),void 0)},_getQueryParams:function(a){for(var b={last_other_id:null,last_other_source:null,
            last_msg_id:null,count:10,received_count:a.length},c,d=0;d<a.length;d++){var e=a[d];c&&c.msg&&c.msg.msg_id?e.msg&&e.msg.msg_id&&c.msg&&c.msg.msg_id&&c.msg.msg_id>e.msg.msg_id&&(c=e):c=e}c&&c.msg&&(b.last_other_id=c.user.user_id,b.last_other_source=c.user.user_source,b.last_msg_id=c.msg.msg_id);return b},_convert:function(a){a=a.msg_info;if(-1==="1 2 3 7 8 9 13 14 15 16".split(" ").indexOf(e(a.msg_type))||a.sender_id==a.to_id&&a.sender_source==a.to_source)return null;var b=g.get();return b.user_id==
        a.sender_id&&b.user_source==a.sender_source?{user:{user_id:a.to_id,user_source:a.to_source},msg:{msg_id:a.msg_id,content:JSON.parse(a.content),send_time:a.send_time,msg_type:a.msg_type}}:b.user_id==a.to_id&&b.user_source==a.to_source?{user:{user_id:a.sender_id,user_source:a.sender_source},msg:{msg_id:a.msg_id,content:JSON.parse(a.content),send_time:a.send_time,msg_type:a.msg_type}}:null},_fetchSessions:function(a,c){var d=this;if("xcx"==r.get())b(l.get_session_list.name,a,null,function(a){var b=[],
            e=1===+a.have_more;p(a.session_list,function(a,c){(a=d._convert(c))&&b.push(a)});c(b,e)},function(a){c([],!0)});else{var e=a.last_other_id+"@"+a.last_other_source+"@"+a.count+"@"+a.last_msg_id;if(u[e])u[e].then(function(a,b){c(a,b)},function(){c([],!0)});else{var f=$.Deferred();b(l.get_session_list.name,a,null,function(a){var b=[],e=1===+a.have_more;p(a.session_list,function(a,c){(a=d._convert(c))&&b.push(a)});c(b,e);f.resolve(b,e)},function(a){c([],!0);f.reject([],!0);delete u[e]});u[e]=f.promise()}}},
        _getSessions:function(a,b){a=this._getQueryParams(a);this._fetchSessions(a,b)},start:h,stop:h,getSessions:h,insert:h,getSession:function(a,b){for(var c=0;c<this.sessions.length;c++){var d=this.sessions[c]||{},e=d.user||{};if(e.user_id===a&&e.user_source===b)return d}return null},getAllSessions:function(){return m(!0,[],this.sessions)}})},function(f,c,a){c={login:null,logout:null,imTokenExpired:null,connectchange:null,msgReceived:null,contactOnlineStatusChanged:null,syncAppData:null,unreadChanged:null,
        referChanged:null,sessionChanged:null,newSessionLoaded:null,userChanged:null,falseNews:null,mainPageChanged:null,changed:null,FIRST:null,MORE:null};c=a(26)(c);f.exports=c},function(f,c){f.exports=function(a){var c={},f;if(!(a instanceof Object)||Array.isArray(a))throw Error("keyMirror(...): Argument must be an object.");for(f in a)a.hasOwnProperty(f)&&(c[f]=f);return c}},function(f,c,a){c=a(28);f.exports=c},function(f,c,a){var k=a(29);c=a(3).inherits;var h=a(10),p=a(25),n=a(3).toString,m={};f.exports=
        new (c(k,{constructor:function(){k.call(this)},send:function(a,b,c){this._send(a,b,c)},setUnreadToZero:function(a,b,c){this._setUnreadToZero(a,b,c)},saveUnreadNum:function(a){this._saveUnreadNum(a)},isNeedShow:function(a){var b=h.get(),c;if(a.options&&a.options.show_in_app&&0!==a.options.show_in_app.length){c=!1;var e=a.options.show_in_app,f=config.appid.split("-")[0];-1!==e.findIndex(function(a){return a+""===f+""})&&(c=!0)}else c=!0;a.sender_id+""===b.user_id+""&&a.sender_source+""===b.user_source+
        ""&&a.options&&a.options.sender_hide&&"1"===n(a.options.sender_hide)&&(c=!1);return c},setRefer:function(a,b,c){var d=a+"@"+b,e=m[d];if(!e||!e.invitation||e.invitation.id&&n(e.invitation.id)!==n(c.invitation.id)&&e.invitation.refer_time<c.invitation.refer_time)c=this._referToString(c),m[d]=c,this.triggerEvent(p.referChanged,{refer:c,user_id:a,user_source:b})},getRefer:function(a,b){a=a+"@"+b;m[a]=this._referToString(m[a]);return m[a]?m[a]:null}}))},function(f,c,a){var k=a(2);c=a(3).fnEmpty;var h=
        a(3).each,p=a(3).inherits,n=a(3).toString,m=a(14),e=a(15),b=a(17),d=a(10),l=a(25),g={},r={};f.exports=p(k,{constructor:function(){k.call(this);this._unread={}},_referToString:function(a){if(!a||!a.invitation)return null;var b=a.invitation;b.id=n(b.id);b.title=n(b.title);b.url=n(b.url);b.rootcateid=n(b.rootcateid);b.cateid=n(b.cateid);b.role=n(b.role);b.scene=n(b.scene);return a},_send:function(a,c,d){e(b.sendmsg.name,null,a,function(a){c(a)},d)},_setUnreadToZero:function(a,b,c){var e=d.get();this.ackShown({sender_id:a,
        sender_source:b,msg_ids:[c],to_id:e.user_id,to_source:e.user_source});a=[a,b].join("@");this._unread[a]&&(b={},b[a]=0,this._unread[a]=0,this.triggerEvent(l.unreadChanged,b))},_saveUnreadNum:function(a){var b=this,c={};h(a,function(a,d){var e=d;"xcx"!=m.get()&&(a=d.contact,e=d.num);d=(d=b._unread[a])?d+e:e;b._unread[a]=d;c[a]=d});b.triggerEvent(l.unreadChanged,c)},_getMsgRecordsRemote:function(a,c,d){if("xcx"==m.get())e(b.get_chat_records.name,a,null,function(a){a=a.msg_list;h(a,function(a,b){"string"===
    typeof b.content&&(b.content=JSON.parse(b.content))});c&&c(a)},function(){d&&d()});else{var f=a.chat_user_id+"@"+a.chat_user_source+"@"+a.count+"@"+a.last_min_msg_id;if(r[f])r[f].then(function(a){c(a)},d);else{var g=$.Deferred();e(b.get_chat_records.name,a,null,function(a){a=a.msg_list;h(a,function(a,b){"string"===typeof b.content&&(b.content=JSON.parse(b.content))});c&&c(a);g.resolve(a)},function(){d&&d();g.reject();delete r[f]});r[f]=g.promise()}}},_getMsgFromLocal:function(a,b,c){return!1},start:c,
        stop:c,send:c,setUnreadToZero:c,ackShown:function(a,c,d){e(b.ack_msg_show.name,null,a,c,d)},ackRead:function(a,c,d){e(b.ack_msg_read.name,a,c,d)},ackMsgBatch:function(a,c,d){e(b.ack_msg_batch.name,null,a,c,function(){e(b.ack_msg_batch.name,null,a,c,d)})},saveUnreadNum:c,getMsgRecords:function(a,b,c){var d=this,e=function(a,b,c){if(!d._getMsgFromLocal(a,b,c))if(-1===a.option)d._getMsgRecordsRemote({chat_user_id:a.user_id,chat_user_source:a.user_source,count:a.count,last_min_msg_id:a.msg_id?a.msg_id:
            0},function(a){b(a)},c);else return b([])},f=function(){var a=[];return function(b,c,g){e(b,function(e){var h=e.length,k;if(0===e.length)return 0<a.length&&d.setLastMsg(b.user_id,b.user_source,a[0]),c(a);if(-1!==["web","wap"].indexOf("xcx")){k=[];for(var m=0,l=e.length;m<l;m++){var n=e[m];d.isNeedShow(n)&&k.push(n)}}else k=e.filter(function(a){return d.isNeedShow(a)});Array.prototype.push.apply(a,k);a.length>=b.count||e.length<b.count?(d.setLastMsg(b.user_id,b.user_source,a[0]),c(a.slice(0,a.length>=
        b.count?b.count:a.length))):(b.msg_id=(1==b.option?e[0]:e[h-1]).msg_id,f(b,c,g))},function(a){g&&g(a)})}}();f(a,b,c)},getAllUnreadAmount:function(){return this._unread},isNeedShow:c,getLastMsg:function(a,b){return g[a+"@"+b]},setLastMsg:function(a,b,c){g[a+"@"+b]=c}})},function(f,c,a){var k=a(15),h=a(17);f.exports={getCaptcha:function(a,c,f){k(h.get_captcha.name,a,null,c,f)},validateCaptcha:function(a,c,f){k(h.validate_captcha.name,a,null,c,f)}}},function(f,c,a){c=a(32);f.exports=c},function(f,c,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         a){var k=a(33);c=a(3).inherits;var h=a(3).extend,p=a(25),n=a(34);f.exports=c(k,{constructor:function(a){k.call(this);this._url=null;this._commonParams={};this._websocket=this._heartStamp=this._options=null;(function(c){var b={ack:function(a){a()}};h(b,a);c._options=b})(this)},start:function(){this.connect()},stop:function(){},connect:function(){void 0;var a=this;a.triggerEvent(p.connectchange,!0);var c=h({},this._commonParams);this._websocket=n({url:this._url,method:"get",getparams:c,onError:function(b){setTimeout(function(){a.connect()},
        5E3)},onMessage:function(b){void 0;b.data.forEach(function(b){a.handleComet(b)})}});this._websocket.connect()},onDisconnect:function(a){void 0;this.triggerEvent(p.connectchange,!1,a)},onLogout:function(a){this.triggerEvent(p.logout,a)}})},function(f,c,a){var k=a(2);c=a(3).inherits;var h=a(3).fnEmpty,p=a(25);f.exports=c(k,{constructor:function(){k.call(this)},handleComet:function(a,c,e){var b=this;switch(a.valueType){case "message":b._options.ack(a,function(){for(var d=[],e=0,f=a.value.length;e<f;e++)d.push(a.value[e]);
        0<d.length&&b.triggerEvent(p.msgReceived,a.value);void 0;c&&c()},function(){void 0;b.onDisconnect("ack fail.token expired.");e&&e()});break;case "command":switch(a.value[0].name){case "FORCEOFF":void 0;b.onDisconnect("FORCEOFF");b.storeForceOff();break;case "SYNCUSERDATA":void 0;b.reconnect();break;case "TOKENEXPIRED":void 0;b.onDisconnect("TOKENEXPIRED");b.onLogout("TOKENEXPIRED");break;case "TOKENINVALID":void 0,b.onDisconnect("TOKENINVALID"),b.onLogout("TOKENINVALID")}break;case "commandmsg":b._options.ack(a,
        function(){for(var d=[],e=0,f=a.value.length;e<f;e++){var h=a.value[e],k;k="string"==typeof h.content?JSON.parse(h.content):h.content;if(-1!==["audio","video"].indexOf(k.data.call_type)){var m="call_"+k.data.call_type;d.push({msg_id:h.msg_id,msg_type:h.msg_type,send_time:h.send_time,sender_id:k.data.sender_id,sender_source:k.data.sender_source,show_type:m,to_id:h.to_id,to_source:h.to_source,content:{type:m}})}}0<d.length&&b.triggerEvent(p.msgReceived,d);void 0;c&&c()},function(){void 0;b.onDisconnect("ack fail.token expired.");
            e&&e()})}},reconnect:h,storeForceOff:h,init:function(a,c){this._url=a;this._commonParams=c}})},function(f,c,a){var k=a(21),h=a(3).param;f.exports=function(a){h(a.getparams);var c=a.postparams&&JSON.stringify(a.postparams),f=a.url+"?version\x3d"+k.getVersion();c&&(c=k(c));return{connect:function(){wx.onSocketOpen(function(b){void 0;c.send({data:k(JSON.stringify(a.getparams)),success:function(){},fail:function(){}});a.onOpen&&a.onOpen(b)});wx.onSocketError(function(b){a.onError&&a.onError(b)});wx.onSocketMessage(function(b){a.onMessage&&
    a.onMessage(JSON.parse(b.data))});wx.onSocketClose(function(b){a.onClose&&a.onClose(b)});var c=this;void 0;(function d(){wx.connectSocket({url:f,method:a.method,fail:function(a){setTimeout(function(){d()},5E3)}})})()},send:function(a){wx.sendSocketMessage(a)},close:function(){wx.closeSocket()}}}}])});
