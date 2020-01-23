// ==UserScript==
// @name         GitHub RepoSize
// @namespace    http://js.zombie110year.top/
// @version      0.2.3
// @description  show repo's size
// @author       zombie110year@outlook.com
// @match        https://github.com/*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

const ICON_DATABASE: string = `<svg t="1566195284663" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1131" width="16" height="16"><path d="M894.030769 177.230769c0-74.830769-171.323077-135.876923-382.030769-135.876923S129.969231 102.4 129.969231 177.230769v47.261539c0 74.830769 171.323077 135.876923 382.030769 135.876923s382.030769-61.046154 382.030769-135.876923V177.230769zM129.969231 334.769231c0 59.076923 171.323077 106.338462 382.030769 106.338461S894.030769 393.846154 894.030769 334.769231v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876924S129.969231 506.092308 129.969231 431.261538V334.769231z m0 0c0 59.076923 171.323077 106.338462 382.030769 106.338461S894.030769 393.846154 894.030769 334.769231v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876924S129.969231 506.092308 129.969231 431.261538V334.769231z m0 206.769231c0 59.076923 171.323077 106.338462 382.030769 106.338461s382.030769-47.261538 382.030769-106.338461v96.492307c0 74.830769-171.323077 135.876923-382.030769 135.876923s-382.030769-59.076923-382.030769-133.907692v-98.461538z m0 208.738461c0 59.076923 171.323077 106.338462 382.030769 106.338462s382.030769-47.261538 382.030769-106.338462V846.769231c0 74.830769-171.323077 135.876923-382.030769 135.876923S129.969231 921.6 129.969231 846.769231v-96.492308z" p-id="1132" fill="#515151"></path></svg>`;
const SESSION_STORAGE_KEY: string = "api_fetched";
let SIZE_LI: HTMLLIElement;
const Knumber = 1024;
const Mnumber = Knumber * 1024;
const Gnumber = Mnumber * 1024;

interface HaveOptionalSize {
  size?: number;
}

async function GitHubRepoSizeMain() {
  let raw_data: string | null;
  while (true) {
    raw_data = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw_data === null) {
      await refreshApiFetched();
    } else {
      break;
    }
  }
  let data: HaveOptionalSize = JSON.parse(raw_data);
  if (data.size === undefined) {
    console.error("cannot fetch private repo's infomation");
  }
  await refreshDisplay();
}

async function refreshApiFetched() {
  await parseURL()
    .then(obj => {
      console.debug(`get /repos:/${obj.owner}/${obj.repo}`);
      return `https://api.github.com/repos/${obj.owner}/${obj.repo}`;
    })
    .then(url => fetch(url))
    .then(resp => resp.json())
    .then(data => {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    });
}

/**
 * main processing, **assume api info has been cached in sessionStorage**.
 *
 * 1. reposize
 */
async function refreshDisplay() {
  const status: HaveOptionalSize = JSON.parse(
    sessionStorage.getItem(SESSION_STORAGE_KEY)
  );
  showRepoSize(status.size);
}

/**
 * add repo's size infomation into summary list
 *
 * @param {number} size kilobytes
 */
async function showRepoSize(size: number) {
  let unit = "KB";
  let display_size = "-1";
  if (size < Knumber) {
    display_size = size.toFixed();
    unit = "KB";
  } else if (size < Mnumber) {
    display_size = (size / Knumber).toFixed(3);
    unit = "MB";
  } else {
    display_size = (size / Mnumber).toFixed(3);
    unit = "GB";
  }
  SIZE_LI.innerHTML = `<a href="${location.href}">${ICON_DATABASE}<span class="num text-emphasized">${display_size}</span>${unit}</a>`;
}

/**
 * get repo's owner and name to fetch GitHub's api
 */
async function parseURL(): Promise<{
  owner: string;
  repo: string;
}> {
  let pattern = RegExp("/([^/]+)/([^/]+)/?");
  let paths = pattern.exec(location.pathname);
  let obj = {
    owner: paths[1],
    repo: paths[2]
  };
  return obj;
}

// start
SIZE_LI = document.createElement("li");
SIZE_LI.setAttribute("id", "reposize");
let ul = document.querySelector(".numbers-summary");
SIZE_LI.innerHTML = `<a href="${location.href}">${ICON_DATABASE}<span class="num text-emphasized">...</span>KB</a>`;
ul.appendChild(SIZE_LI);
GitHubRepoSizeMain();
