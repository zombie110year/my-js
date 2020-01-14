// ==UserScript==
// @name         EH LastView
// @namespace    http://js.zombie110year.top/
// @version      0.1.0
// @description  record last time when you exit e*hentai, and mark out newer gallary.
// @license      MIT
// @author       zombie110year@outlook.com
// @match        http*://exhentai.org/*
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

const KEY = "eh_lastview";
const KEY_TEMP = "eh_lastview_temp";
const MARKOUT_CLASS = "EH-LastView-newer";
let LastViewTemp =
  localStorage.getItem(KEY_TEMP) !== null
    ? new Date(localStorage.getItem(KEY_TEMP))
    : new Date();
const LastView =
  localStorage.getItem(KEY) !== null
    ? new Date(localStorage.getItem(KEY))
    : LastViewTemp;
const ViewInterval = 6e5; // 10 分钟(600000 ms)
// ================
function saveLastExitDate() {
  // UTC 时间
  let now_utc = new Date().toUTCString();
  localStorage.setItem(KEY, now_utc);
  console.info(`EH LastView: saved date: ${now_utc}`);
}
function findoutGallaryElements(): Array<Element> {
  const selector = ".itg > tbody > tr";
  const collection = [...document.querySelectorAll(selector)];
  // 第一项是表头，删去
  const result = collection.slice(1);
  console.info(`EH LastView: collected ${result.length} items`);
  return result;
}
async function markoutNewerElement(el: Element, lastview: Date) {
  const date_selector = "td.gl2c > div:nth-child(3) > div[id]";
  const el_time_string = el.querySelector(date_selector).innerHTML;
  const el_date = new Date(el_time_string);
  if (el_date > lastview) {
    el.classList.add(MARKOUT_CLASS);
    console.debug(`EH LastView: marked`);
  } else {
    console.debug(`EH LastView: older item, not marked`);
  }
  console.debug(el);
}
// 每个页面运行一次
async function main() {
  console.info(`EH LastView: start ${location}`);
  const items = findoutGallaryElements();
  items.forEach(el => markoutNewerElement(el, LastView));
  console.info(`EH LastView: end ${location}`);
}
// 每个页面运行一次
async function init() {
  /**
   * 在关闭页面（非刷新或跳转）时刷新时间
   * 参考 https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event
   * 参考 https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event
   *
   * 关闭时事件触发：beforeunload -> unload;
   * 刷新时事件触发：beforeunload -> unload -> load;
   *
   * 选择方案：
   *
   * 0. 区分需求时间、实得时间
   * 1. 在 unload 时保存实得时间（不覆盖需求时间）
   * 2. 在 load 时检测当前时间，
   *    1. 如果当前时间与实得时间相差小于一个数值，认为是刷新，保留上一个需求时间
   *    2. 如果当前时间与实得时间相差较大，认为是关闭后重新进入，覆盖上一个需求时间
   * 3. 如果一直停留在当前页面不关闭，则认为没有浏览，不更新需求时间（用不断刷新实得时间来实现）
   */
  window.addEventListener("unload", (ev: Event) => {
    const exit_time = new Date().toUTCString();
    localStorage.setItem(KEY_TEMP, exit_time);
  });
  window.addEventListener("load", (ev: Event) => {
    const now = new Date().getTime();
    const last = LastViewTemp.getTime();
    if (now - last < ViewInterval) {
      console.debug("this is refresh");
    } else {
      saveLastExitDate();
    }
  });

  console.info(`EH LastView: refresh LastView Date`);
  // TamperMonkey
  // @ts-ignore
  GM_addStyle(`
    .EH-LastView-newer > td.gl2c > div > div[id]::before {
      content: "new";
      margin-right: 0.5em;
      color: lightgreen;
      font-size: 75%;
    }
  `);
  console.info("add style");
}

(() => {
  init();
  main();
})();

// 刷新最后访问时间
setInterval(() => {
  LastViewTemp = new Date();
  localStorage.setItem(KEY_TEMP, LastViewTemp.toUTCString());
}, ViewInterval);
