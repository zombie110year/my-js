// ==UserScript==
// @name         Jump to Bilibili Cover
// @namespace    http://js.zombie110year.top/
// @version      0.1
// @description  在新标签页跳转到当前视频的封面地址
// @license      GPL v3
// @author       zombie110year@outlook.com
// @match        https://www.bilibili.com/video/av*
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(() => {
    'use strict';
    var meta_item = document.querySelector("head > meta[itemprop='image']");
    var img_url = meta_item.content;

    console.debug(img_url);
    var a = document.createElement("a");
    a.target = "_blank";
    a.href = img_url;
    a.click();
})();
