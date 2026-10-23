/* ==========================================================================
   data/site.js — 站点元信息与板块注册表
   ========================================================================== */

(function (H) {
  "use strict";

  H.site = {
    brand: "PLab",
    brandSub: "学习 × 面试备战",
    /* 顶栏导航与首页入口卡都由这份注册表驱动 */
    boards: [
      {
        id: "notes",
        num: "01",
        kicker: "NOTES",
        title: "上课笔记",
        nav: "笔记",
        href: "notes.html",
        desc: "课程与学习的内容沉淀：默认要点卡，重要主题展开成长文。",
        dataFile: "js/data/notes.js"
      },
      {
        id: "craft",
        num: "02",
        kicker: "CRAFT",
        title: "笔记 → 面试题",
        nav: "转化",
        href: "craft.html",
        desc: "把笔记变成能开口讲的面试答案：提炼考点、组织框架、口语化演练。",
        dataFile: "js/data/craft.js"
      },
      {
        id: "quiz",
        num: "03",
        kicker: "QUIZ",
        title: "面试题库",
        nav: "面试题",
        href: "quiz.html",
        desc: "自己的面试问答库，按天滚动每日一题，考前集中刷。",
        dataFile: "js/data/quiz.js"
      },
      {
        id: "journey",
        num: "04",
        kicker: "JOURNEY",
        title: "面经",
        nav: "面经",
        href: "journey.html",
        desc: "行程、公司、准备与面试记录——一次投递一条线，全程留痕。",
        dataFile: "js/data/journey.js"
      },
      {
        id: "glossary",
        num: "05",
        kicker: "GLOSSARY",
        title: "词典",
        nav: "词典",
        href: "glossary.html",
        desc: "站级术语词典：划线词点击开右侧抽屉，三段式详解。",
        dataFile: "js/data/terms.js"
      }
    ]
  };
})(window.Handbook = window.Handbook || {});
