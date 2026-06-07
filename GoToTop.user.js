// ==UserScript==
// @name         网页回到顶部
// @namespace    https://github.com/THR-hub/personal-GM-scripts
// @version      0.2.0
// @description  在网页右边增加回到顶部的按钮。
// @author       T_H_R
// @match        *://*/*
// @exclude      *://profiler.firefox.com/*
// @noframes
// @grant        GM_registerMenuCommand
// ==/UserScript==

'use strict';

// const white_list = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
// if (!white_list.includes(document.domain)) {
//   if (Object.keys(document.getElementById('root') ?? document.body).some(key => key.startsWith('__react')) ||
//     window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
//     Array.from(document.body.childNodes).some((node) => node.id === 'root')) return;
// }

/**
 * @param {string} css
 * @returns {HTMLStyleElement}
 */
const addStyle = (css) =>
  addElement(document.head, 'style', { type: 'text/css', textContent: css });

/**
 * Similar (but not the same) to GM_addElement
 * @param {HTMLElement} parent
 * @param {string} element
 * @param {object} prop
 * @returns {HTMLElement}
 */
const addElement = (parent, element, prop) =>
  parent.appendChild(Object.assign(document.createElement(element), prop));


addStyle(`@media(prefers-color-scheme:light){.GM_btn_c{background-color:#f7f7f7!important;color:black!important;}}
@media(prefers-color-scheme:dark){.GM_btn_c{background-color:#333!important;color:white!important;}}`);

addStyle(`#GM_btn_p{all:initial;font-size:12px!important;position:fixed;bottom:20%;right:max(0px, (1em - 100vw + 100%));z-index:1000}
.GM_btn_c{display:inline-block;block-size:auto!important;border:.1em solid grey;border-radius:.3em;padding:.3em;position:relative;
writing-mode:vertical-rl;letter-spacing:.3em;cursor:pointer;user-select:none;}
#GM_btn_2{right:-.1em}`); //边框重叠

GM_registerMenuCommand('本次隐藏', hideButton);

function hideButton() {
  document.getElementById('GM_btn_p').style.visibility='hidden';
}


const scroll_to = (height) => {
  // react等网页可能会将document.scrollingElement保持为html但overflow为hidden，真正的滚动条在某个div上
  const targets = Array.from(document.querySelectorAll('html,main,div'))
    .filter(el => el.clientHeight < el.scrollHeight)
    .filter(el => {
      let overflow = getComputedStyle(el).overflowY;
      if (el !== document.documentElement)
        return ['auto', 'scroll'].includes(overflow);
      else // html的overflow为visible时有滚动条
        return ['auto', 'scroll', 'visible'].includes(overflow);
    });
  const target = (targets.length === 0) ? document.scrollingElement : targets.reduce((max, el) => max.clientWidth > el.clientWidth ? max : el); // 选择最宽的容器
  target.scrollTo({ top: { top: 0, bottom: target.scrollHeight }[height], behavior: 'smooth' });
}

const btn_p = addElement(document.body, 'div', { id: 'GM_btn_p', lang: 'zh-Hans-CN' });

addElement(btn_p, 'div', {
  className: 'GM_btn_c', textContent: '去往底部', role: 'button', id: 'GM_btn_2',
  onclick: () => scroll_to('bottom')
});

addElement(btn_p, 'div', {
  className: 'GM_btn_c', textContent: '回到顶部', role: 'button',
  onclick: () => scroll_to('top')
});
