# wepy简单例子

<https://tencent.github.io/wepy/document.html>

## Features
- base es6
- eslint airbnb-base
- babel
- scss
- autoprefixer
- file to base64

## Clone

```bash
$ git clone git@gitlab.58corp.com:lbg-fe/wepy-demo.git <yourAppName>
$ cd <yourAppName>
$ npm install
```

## Start

```bash
$ npm start
```

## Build
```bash
$ npm run build
```

## 目录结构
```
├── bgimages               背景图片文件夹（此文件夹内的图片会自动转成base64）
├── dist                   微信开发者工具指定的目录（该目录由WePY的build指令自动编译生成，请不要直接修改该目录下的文件）
├── node_modules           
├── src                    代码编写的目录（该目录为使用WePY后的开发目录）
|   ├── assets             静态资源文件夹
|   ├── components         WePY组件目录（组件不属于完整页面，仅供完整页面或其他组件引用）
|   |   ├── com_a.wpy      可复用的WePY组件a
|   |   └── com_b.wpy      可复用的WePY组件b
|   ├── pages              WePY页面目录（属于完整页面）
|   |   ├── index.wpy      index页面（经build后，会在dist目录下的pages目录生成index.js、index.json、index.wxml和index.wxss文件）
|   |   └── other.wpy      other页面（经build后，会在dist目录下的pages目录生成other.js、other.json、other.wxml和other.wxss文件）
|   └── app.wpy            小程序配置项（全局数据、样式、声明钩子等；经build后，会在dist目录下生成app.js、app.json和app.wxss文件）
└── package.json           项目的package配置
```

## wepy-cli bug
1.找到wepy-cli 全局安装路径下的util.js修改

    windows
    > C:\Users\{name}\AppData\Roaming\npm\node_modules\wepy-cli\lib\
    mac
    > /usr/local/lib/node_modules/wepy-cli/lib/

2.第597行添加
```js
    msg = msg.replace(/`/g, '\\`');
```

## 重要提醒(请多阅读tencent文档)
1. 使用微信开发者工具-->添加项目，项目目录请选择dist目录。

2. 微信开发者工具-->项目-->关闭ES6转ES5。 重要：漏掉此项会运行报错。

3. 微信开发者工具-->项目-->关闭上传代码时样式自动补全。 重要：某些情况下漏掉此项也会运行报错。

4. 微信开发者工具-->项目-->关闭代码压缩上传。 重要：开启后，会导致真机computed, props.sync 等等属性失效。（注：压缩功能可使用WePY提供的build指令代替，详见后文相关介绍以及Demo项目根目录中的wepy.config.js和package.json文件。）

5. 本地项目根目录运行wepy build --watch，开启实时编译。（注：如果同时在微信开发者工具-->设置-->编辑器中勾选了文件保存时自动编译小程序，将可以实时预览，非常方便。）


## 其它注意点
1. 在Page页面实例中，可以通过this.$parent来访问App实例。
2. 在异步函数中更新数据的时，必须手动调用$apply方法，才会触发脏数据检查流程的运行。
3. methods属性只能声明页面wxml标签的bind、catch事件，不能声明自定义方法。
4. 父组件可以通过使用.sync，子组件可以通过props的twoWay: true 来达到父组件往字组件传值。
5. 父组件使用.sync修饰符，同时子组件props中添加的twoWay: true时，可以实现数据的双向绑定。
6. $broadcast、$emit、$invoke三个方法用于组件之间的通信和交互，用于监听组件之间的通信与交互事件的事件处理函数需要写在组件和页面的events对象中
7. class包括 app、page、component、mixin
8. 基础方法都有封装，例如request、login、getUserInfo等

