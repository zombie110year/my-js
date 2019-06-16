// ==UserScript==
// @name         简化 CSDN
// @namespace    http://js.zombie110year.top/
// @version      0.1
// @description  只保留文章和评论
// @license      GPL v3
// @author       zombie110year@outlook.com
// @match        *://blog.csdn.net/*/article/details/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    'use strict';
    let items = [];
    items.push(document.querySelector("#csdn-toolbar"));
    items.push(document.querySelector("#mainBox > aside"));
    items.push(document.querySelector("#mainBox > main > div.recommend-box"));
    items.push(document.querySelector("body > div.csdn-side-toolbar"));
    items.push(document.querySelector("#mainBox > div"));
    items.push(document.querySelector("body > div.tool-box"));

    for(let _item of items) {
        _item.parentElement.removeChild(_item);
    }

    // 重设 样式
    let _main = document.querySelector("#mainBox > main");
    _main.style = "float: left !important; width: auto !important;";

    // 自动展开文档
    let btn = document.querySelector("#btn-readmore");
    btn.click();
})();
