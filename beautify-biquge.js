// ==UserScript==
// @name         biquge advanced
// @namespace    http://js.zombie110year.top/
// @version      0.1.0
// @description  美化笔趣阁阅读页面
// @author       zombie110year@outlook.com
// @match        *://www.bbiquge.com/book_*/*.html
// @grant        none
// @run-at       document-end
// ==/UserScript==

(() => {
    {
        'use strict';
        let main = getMainElement(
            document.querySelector("#box_con > div.bookname"), // title
            parseContent(document.querySelector("#content")), // main
            document.querySelector("#box_con > div.bottem") // btns
        );
        customCSS();
        document.body.append(main);
    }

    function getMainElement(title, main, btns) {

        let container = document.createElement("main");
        container.append(title);
        container.append(main);
        container.append(btns);
        return container;
    }

    function parseContent(content) {
        let div = document.createElement("div");
        div.id = "content";
        let lines = parseText(content.innerText);
        for (let line of lines) {
            let p = document.createElement("p");
            p.innerText = line;
            div.append(p);
        }
        return div;
    }

    function parseText(text) {
        let _lines = [];
        for (let line of text.replace(/ /ig, "").replace(/\n\n/ig, "\n").split("\n")) {
            if (!/www.bbiquge.com/.test(line)) {
                _lines.push(line);
            }
        }
        return _lines;
    }

    function customCSS() {
        let _css =
            `
body {
    background-color: #f5f7f9 !important;
}
body > main > div.bookname > div {
    font-family: sans-serif !important;
}
body > main > div.bottem {
    font-family: sans-serif !important;
    padding-bottom: 40px;
    padding-top: 20px;
}
main {
    margin: 4px auto 40px auto;
    width: 1000px;
    background-color: #fff;
    border-radius: 0px 10px 10px 0px;
    box-shadow: 4px 8px 16px 3px #666666;
}
a {
    color: #666666;
}
a:hover {
    color: #fc6427;
}
#content p:first-line {
    text-indent: 2em;
}
#content:first-letter {
    font-size: 200%;
    font-weight: bold;
}
#content p {
    margin-top: 2em;
    text-align: justify;
}`
        let css = document.createElement("style");
        css.innerText = _css;
        document.body = document.createElement("body");
        document.body.append(css);
    }
})();
