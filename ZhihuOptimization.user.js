// ==UserScript==
// @name         知乎优化（未完成）
// @namespace    https://github.com/THR-hub/personal-GM-scripts
// @version      2025-08-19
// @description  目前已有功能：修改标题去掉消息数，去除高亮搜索，恢复旧版[惊喜]表情。
// @author       T_H_R
// @match        *://*.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @run-at       document-end
// @grant        none
// ==/UserScript==

'use strict';

function addStyle(style) {
    const temp = document.createElement('style'); temp.innerText = style; document.head.appendChild(temp);
};

(function () {
    clearTitles();
    clearHighlightLink();
    oldStyleSurpriseSticker();
    // see https://www.zhihu.com/question/554983886/answer/2687877961
    addStyle(`@-moz-document url-prefix(){body{overflow-anchor:none}}`);
})();

// 参考 https://greasyfork.org/scripts/419081
function clearTitles() { // 去除标题消息提示

    const observer = new MutationObserver(() => {
        document.title = document.title.match(/.+(消息|私信)\) ?(.*)/)[2]; // 报错是正常的，否则页面会卡住
    });
    observer.observe(document.head.querySelector('title'), { childList: true });

}

function clearHighlightLink() { // 去除相关搜索

    function replace(selector, callback) {
        //let all = Array.from(document.getElementsByClassName(selector));
        let all = document.querySelectorAll(selector);
        all.forEach(callback);
    };

    const observer = new MutationObserver(() => {
        observer.disconnect();
        //console.log('DOM Changed');

        replace('.RichContent-EntityWord', (e) => // 高亮有三种情况：下划线、下划线+段首、非下划线，下划线在段首时firstChild是空白文本
            e.parentElement.outerHTML = e.firstChild.nodeValue || e.firstElementChild.outerHTML);

        observer.observe(document.body, { childList: true, subtree: true, attributes: false });
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: false });

}

function oldStyleSurpriseSticker() { // 替换[惊喜]表情为旧版

    const redef = () => {
        [['惊喜', 'https://pic1.zhimg.com/v2-3846906ea3ded1fabbf1a98c891527fb.png'],
        ['哇', 'https://pic1.zhimg.com/v2-70c38b608df613d862ee0140dcb26465.png']].forEach((arr) => {
            window.zh_emoticon.find(obj => obj.title === '默认').stickers.find(obj => obj.title === arr[0]).static_image_url = arr[1];
        });
    }

    function wait_for_var(obj, variable) {

        return new Promise(resolve => {
            let real_val;
            Object.defineProperty(obj, variable, {
                get() { return real_val; },
                set(val) { real_val = val; resolve(); }
            });
        });

    };

    if (typeof window.zh_emoticon !== 'undefined') redef();
    else wait_for_var(window, 'zh_emoticon').then(redef);

}