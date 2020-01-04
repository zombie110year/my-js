// ==UserScript==
// @name         小木虫论坛-格式重设
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://muchong.com/*
// @grant        none
// ==/UserScript==
//@ts-check

(function() {
  "use strict";
  removeAds();
  /**
   * 去除页面上的广告
   */
  function removeAds() {
    let ads = getAds();
    ads.forEach((el: HTMLElement) => {
      el.parentElement.removeChild(el);
    });
  }
  function getAds(): Array<HTMLElement> {
    let ads = new Array()
      .concat(
        ...document.querySelectorAll("body > div.bg > div.wrapper.header_table")
      )
      .concat(document.querySelector("body > div.bg > footer > div.wrapper"));
    return ads;
  }
})();
