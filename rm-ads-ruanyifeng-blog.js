// ==UserScript==
// @name         Remove Ads
// @namespace    http://js.zombie110year.top/
// @version      0.1
// @description  去掉阮一峰博客中的广告
// @license      GPL v3
// @author       zombie110year@outlook.com
// @match        *://www.ruanyifeng.com/blog/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';
    var ads = [];
    // 获取三个广告元素
    ads.push(document.getElementsByClassName("entry-sponsor")[0]);
    ads.push(document.querySelector("#alpha-inner > div:nth-child(2)"));
    ads.push(document.getElementById("cre"));

    for (var i of ads) {
        // 留着不删除
        i.setAttribute("style", "display: none !important;");
    }
})();
