/* ==========================================================================
   main.js — 站级启动器：按页面挂载点分发
   首页 index.html        → app.init（入口卡 + 每日一题）
   笔记 notes.html        → board.init(notes)
   转化 craft.html        → board.init(craft)
   面试题 quiz.html       → quiz.init + drawer（要点里的 [[术语]]）
   面经 journey.html      → journey.init
   词典 glossary.html     → glossary.init + drawer
   ========================================================================== */

(function (H) {
  "use strict";

  function boot() {
    if (!H.dom) {
      if (window.console) console.error("[plab] 基础库未加载，请检查脚本引用顺序");
      return;
    }

    if (document.getElementById("homeEntries") && H.ui.app) H.ui.app.init();

    var notesMount = document.getElementById("boardNotes");
    if (notesMount && H.ui.board) H.ui.board.init(notesMount, H.notes || [], "notes");

    var craftMount = document.getElementById("boardCraft");
    if (craftMount && H.ui.board) H.ui.board.init(craftMount, H.craft || [], "craft");

    if (document.getElementById("quizList")) {
      if (H.ui.quiz) H.ui.quiz.init();
      if (H.ui.drawer) H.ui.drawer.init();
    }

    if (document.getElementById("journeyApp") && H.ui.journey) H.ui.journey.init();

    if (document.getElementById("glossaryList")) {
      if (H.ui.glossary) H.ui.glossary.init();
      if (H.ui.drawer) H.ui.drawer.init();
    }

    document.documentElement.classList.add("js-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window.Handbook = window.Handbook || {});
