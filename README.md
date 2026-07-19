# Bangumi 超合金快捷搜索 🔍

在**任意网页**选中文本后，鼠标旁弹出浮窗，一键跳转到 [Bangumi（bgm.tv）](https://bgm.tv) 搜索番剧、游戏、书籍等条目。

> 🧪 本项目为 **纯 Vibe Coding** 产物，零人类手工编码，但会持续维护和改进。

---

## 🎨 预览

选中文本后，浮窗出现在鼠标旁边：

![预览截图](preview.png)

---

## ✨ 功能

| 功能 | 说明 |
|---|---|
| **划词搜索** | 在任意网页选中文本，鼠标旁弹出 Bangumi 搜索浮窗 |
| **一键跳转** | 点击浮窗 → 新标签页打开 Bangumi 条目搜索结果 |
| **键盘快捷键** | `Ctrl + Shift + B` 直接搜索当前选中文本 |
| **智能定位** | 浮窗跟随鼠标位置，边缘自动修正不溢出屏幕 |
| **动画反馈** | 平滑淡入/弹出动画，hover 微动效 |
| **自动隐藏** | 点击空白处 / 按 `Esc` 自动关闭 |
| **全站兼容** | `@match *://*/*` 覆盖所有网站 |

---

## 📦 安装

通过 **Bangumi 超合金组件** 页面一键安装，或从 GitHub 下载 `bangumi-quick-search.user.js` 手动拖入 Tampermonkey / Violentmonkey。

---

## 🎮 使用方式

### 方式一：划词弹窗（主要）

```
任意网页选中文本 → 鼠标旁弹出粉红色浮窗 → 点击搜索 → 新标签页打开结果
```

### 方式二：键盘快捷键

```
选中文本 → 按 Ctrl + Shift + B → 直接搜索
```

---

## ⚙ 搜索类型

当前仅支持 **条目搜索**：`https://bgm.tv/subject_search/` + 关键词

---

## 📄 文件说明

```
bgm-search/
├── README.md                        ← 你正在看的文档
├── bangumi-quick-search.user.js     ← 用户脚本本体
└── preview.png                     ← 预览截图
```

---

## 🔧 技术栈

- 纯原生 JavaScript，零依赖
- `@grant none` 直接在页面环境运行，无沙盒隔离
- `window.open` 打开搜索结果

---

## 📝 License

MIT — 随便改，随便用。
