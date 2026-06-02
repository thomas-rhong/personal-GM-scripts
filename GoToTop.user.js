// ==UserScript==
// @name         网页回到顶部
// @namespace    https://github.com/THR-hub/personal-GM-scripts
// @version      0.2.0
// @description  在网页右边增加回到顶部的按钮。
// @author       T_H_R
// @match        *://*/*
// @exclude      *://web.telegram.org/*
// @noframes
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

'use strict';

// const white_list = ['www.zhihu.com', 'zhuanlan.zhihu.com'];
// if (!white_list.includes(document.domain)) {
//   if (Object.keys(document.getElementById('root') ?? document.body).some(key => key.startsWith('__react')) ||
//     window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ||
//     Array.from(document.body.childNodes).some((node) => node.id === 'root')) return;
// }

GM_addStyle(`@media(prefers-color-scheme:light){.GM_btn_c{background-color:#f7f7f7 !important;color:black !important;}}
@media(prefers-color-scheme:dark){.GM_btn_c{background-color:#333 !important;color:white !important;}}`);

GM_addStyle(`#GM_btn_p{all:initial;font-size:12px !important;position:fixed;bottom:20%;right:max(0px, (1em - 100vw + 100%));z-index:1000}
.GM_btn_c{display:inline-block;block-size:auto !important;border:.1em solid grey;border-radius:.3em;padding:.3em;position:relative;
writing-mode:vertical-rl;letter-spacing:.3em;cursor:pointer;user-select:none;}
#GM_btn_2{right:-.1em}`); //边框重叠

GM_registerMenuCommand('本次隐藏', hideButton);

function hideButton() {
  document.getElementById('GM_btn_p').style.visibility='hidden';
}


const scroll_to = (height) => {
  const targets = Array.from(document.querySelectorAll('html,main,div'))
    .filter(el => el.clientHeight < el.scrollHeight)
    .filter(el => {
      let overflow = getComputedStyle(el).overflowY;
      if (el !== document.documentElement)
        return ['auto', 'scroll'].includes(overflow);
      else
        return ['auto', 'scroll', 'visible'].includes(overflow);
    });
  const target = (targets.length === 0) ? document.scrollingElement : targets.reduce((max, el) => max.clientWidth > el.clientWidth ? max : el);
  target.scrollTo({ top: { top: 0, bottom: target.scrollHeight }[height], behavior: 'smooth' });
}


const btn_p=document.createElement('div');
btn_p.id='GM_btn_p';
btn_p.lang='zh-Hans-CN';


const btn_1=document.createElement('div');
btn_1.className='GM_btn_c';
btn_1.innerHTML='回到顶部';
btn_1.role='button';
btn_1.onclick=()=>scroll_to('top');

const btn_2=document.createElement('div');
btn_2.id='GM_btn_2';
btn_2.className='GM_btn_c';
btn_2.innerHTML='去往底部';
btn_2.role='button';
btn_2.onclick=()=>scroll_to('bottom');

btn_p.appendChild(btn_2);
btn_p.appendChild(btn_1);
document.body.appendChild(btn_p);
