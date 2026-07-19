// ==UserScript==
// @name         Bangumi 超合金快捷搜索
// @namespace    https://bgm.tv/
// @version      1.2.0
// @description  在任意网站选中文本后，鼠标旁弹出 Bangumi（bgm.tv）快捷搜索浮窗
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  const SEARCH_URL = 'https://bgm.tv/subject_search/';

  let popup = null;
  let selectedText = '';
  let mouseX = 0;
  let mouseY = 0;

  // ==================== 样式注入 ====================
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #bgm-quick-search-popup {
        position: fixed;
        z-index: 2147483647;
        display: none;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: linear-gradient(135deg, #f09199 0%, #e5737b 100%);
        border-radius: 22px;
        box-shadow: 0 4px 16px rgba(240,145,153,0.45), 0 2px 6px rgba(0,0,0,0.18);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
                     "Microsoft YaHei", sans-serif;
        font-size: 13px;
        color: #fff;
        cursor: pointer;
        user-select: none;
        white-space: nowrap;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.15s ease, transform 0.15s ease;
      }
      #bgm-quick-search-popup.show {
        opacity: 1;
        transform: translateY(0);
      }
      #bgm-quick-search-popup:hover {
        box-shadow: 0 6px 22px rgba(240,145,153,0.55), 0 2px 6px rgba(0,0,0,0.2);
        transform: translateY(-2px);
      }
      #bgm-quick-search-popup:active {
        transform: translateY(0) scale(0.96);
      }
      #bgm-quick-search-icon {
        width: 18px; height: 18px; flex-shrink: 0;
      }
      #bgm-quick-search-text {
        max-width: 180px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        opacity: 0.9;
      }
      #bgm-quick-search-label {
        font-weight: 600;
        letter-spacing: 0.3px;
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // ==================== 创建浮窗 ====================
  function createPopup() {
    if (popup) return;
    popup = document.createElement('div');
    popup.id = 'bgm-quick-search-popup';
    popup.innerHTML = `
      <svg id="bgm-quick-search-icon" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.2"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="2.5"/>
        <path d="M12 5c-5 0-9.3 3.2-10.8 7.5 1.5 4.3 5.8 7.5 10.8 7.5s9.3-3.2 10.8-7.5C21.3 8.2 17 5 12 5z"/>
        <line x1="2" y1="2" x2="7" y2="7"/>
      </svg>
      <span id="bgm-quick-search-label">在 Bangumi 搜索</span>
      <span id="bgm-quick-search-text"></span>
    `;
    popup.addEventListener('click', doSearch);
    document.body.appendChild(popup);
  }

  // ==================== 搜索 ====================
  function doSearch(e) {
    e.stopPropagation();
    e.preventDefault();
    if (!selectedText) return;
    var kw = selectedText.trim();
    if (!kw) return;
    window.open(SEARCH_URL + encodeURIComponent(kw), '_blank', 'noopener,noreferrer');
    hidePopup();
  }

  // ==================== 鼠标追踪 ====================
  function trackMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  // ==================== 定位（position:fixed，相对于视口） ====================
  function positionPopup() {
    if (!popup) return;

    // 临时显示以便测量尺寸
    popup.style.visibility = 'hidden';
    popup.style.display = 'flex';
    var pw = popup.offsetWidth;
    var ph = popup.offsetHeight;
    popup.style.visibility = '';

    // 弹窗默认出现在鼠标右下方
    var left = mouseX + 12;
    var top = mouseY + 16;

    // 右边溢出 → 放鼠标左边
    if (left + pw > window.innerWidth - 8) {
      left = mouseX - pw - 12;
    }
    // 下方溢出 → 放鼠标上方
    if (top + ph > window.innerHeight - 8) {
      top = mouseY - ph - 12;
    }
    // 兜底不溢出屏幕
    left = Math.max(8, Math.min(window.innerWidth - pw - 8, left));
    top = Math.max(8, Math.min(window.innerHeight - ph - 8, top));

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  // ==================== 显示 / 隐藏 ====================
  function showPopup(text) {
    if (!popup) createPopup();
    if (!text) { hidePopup(); return; }
    selectedText = text;

    var textEl = popup.querySelector('#bgm-quick-search-text');
    if (textEl) {
      textEl.textContent = text.length > 30 ? '"' + text.slice(0, 30) + '…"' : '"' + text + '"';
      textEl.title = text;
    }

    positionPopup();

    // 双 rAF 等 layout 稳定再播动画
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        popup.classList.add('show');
      });
    });
  }

  function hidePopup() {
    if (!popup) return;
    popup.classList.remove('show');
    selectedText = '';
    setTimeout(function () {
      if (!popup.classList.contains('show')) {
        popup.style.display = 'none';
      }
    }, 160);
  }

  // ==================== 事件处理 ====================
  function onMouseUp(e) {
    // 忽略弹窗自身点击
    if (e.target.closest('#bgm-quick-search-popup')) return;

    mouseX = e.clientX;
    mouseY = e.clientY;

    // 小延迟等 selection 稳定
    setTimeout(function () {
      var sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        hidePopup();
        return;
      }
      var text = sel.toString().trim();
      if (!text || text.length > 500) {
        hidePopup();
        return;
      }
      showPopup(text);
    }, 10);
  }

  function onClick(e) {
    if (!e.target.closest('#bgm-quick-search-popup')) {
      hidePopup();
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') hidePopup();
    if (e.key === 'B' && e.ctrlKey && e.shiftKey) {
      e.preventDefault();
      var text = window.getSelection().toString().trim();
      if (text && text.length <= 500) {
        window.open(SEARCH_URL + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
      }
    }
  }

  // ==================== 启动 ====================
  function init() {
    if (!document.body) {
      setTimeout(init, 50);
      return;
    }

    injectStyles();
    createPopup();

    document.addEventListener('mouseup', onMouseUp, { passive: true });
    document.addEventListener('mousemove', trackMouse, { passive: true });
    document.addEventListener('click', onClick, { passive: true });
    document.addEventListener('keydown', onKeyDown, { passive: false });

    console.log('[BGM搜索] ✅ 脚本就绪 — 选中文字松手即可看到弹窗');
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
