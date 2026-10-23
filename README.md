# PLab

个人学习 × 面试备战站：上课笔记、笔记转面试题、面试题库（每日一题）、面经（行程 / 公司 / 准备 / 记录）与站级词典。

## 线上地址

**https://samlaying.github.io/plab/**

## 隐私：为什么搜索引擎搜不到

- 所有页面带 `<meta name="robots" content="noindex, nofollow, noarchive, noimageindex, nosnippet">`
- `robots.txt` 全站 `Disallow: /`
- 没有站点地图、没有外链、仓库名中性且无描述

> 免费版 GitHub Pages 要求公开仓库，代码本身可被看到；以上措施保证的是**搜索引擎不收录**，只有知道网址的人能访问。

## 结构（零框架纯静态，全部数据驱动）

```
plab/
├── index.html          # 首页：Hero + 每日一题导流 + 五张板块入口卡
├── notes.html          # 板块 01 上课笔记（要点卡 / 长文混合）
├── craft.html          # 板块 02 笔记→面试题（转化记录）
├── quiz.html           # 板块 03 面试题库（每日一题 + 分类侧栏 + 手风琴）
├── journey.html        # 板块 04 面经（行程 / 公司 / 准备勾选 / 面试记录）
├── glossary.html       # 板块 05 词典（词条网格 + 三段式抽屉）
├── css/
│   ├── tokens.css      #   设计令牌
│   ├── site.css        #   共享（顶栏 / 页脚 / 抽屉 / 侧栏 / 内联术语）
│   └── pages.css       #   页面专属
└── js/
    ├── lib/dom.js      #   DOM 工具
    ├── data/site.js    # ★ 板块注册表（导航与首页入口由它驱动）
    ├── data/notes.js   # ★ 笔记注册表
    ├── data/craft.js   # ★ 转化记录
    ├── data/quiz.js    # ★ 题库（每日一题按日期自动滚动）
    ├── data/journey.js # ★ 面经四组数据
    ├── data/terms.js   # ★ 术语表（[[术语]] 划线词开抽屉）
    └── ui/ + main.js   #   渲染与分发
```

## 怎么加内容

全部只改 `js/data/` 下的文件（每个文件头部都有示例和字段说明）：

| 想加什么 | 改哪里 | 备注 |
|---|---|---|
| 一篇笔记 | `data/notes.js` | `type:"card"` 要点卡直读；`type:"long"` 配 `url` 链到长文页 |
| 一次笔记→题目转化 | `data/craft.js` | 记来源笔记和转化出的题 |
| 一道面试题 | `data/quiz.js` | 每日一题自动按日期轮换，无需指定 |
| 行程 / 公司 / 准备 / 记录 | `data/journey.js` | 准备勾选状态存 localStorage |
| 一个术语 | `data/terms.js` | 正文里 `[[术语]]` 即划线可点 |

发布：`git add -A && git commit -m "..." && git push`，Pages 约 1 分钟自动重建。

**改 CSS/JS 内容记得把对应引用的 `?v=N` 版本号 +1**，否则 CDN 会继续发旧缓存。

## 本地预览

```
cd plab && python3 -c '
import http.server, socketserver
class S(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store"); super().end_headers()
with socketserver.ThreadingTCPServer(("127.0.0.1", 8138), S) as h: h.serve_forever()'
# 打开 http://127.0.0.1:8138/
```
