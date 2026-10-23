/* ==========================================================================
   ui/app.js — 首页：板块入口卡（计数自动汇总）+ 每日一题导流
   ========================================================================== */

(function (H) {
  "use strict";

  var el = H.dom.el;

  /* 各板块当前条数 */
  function boardCount(id) {
    switch (id) {
      case "notes": return (H.notes || []).length;
      case "craft": return (H.craft || []).length;
      case "quiz": return (H.quiz || []).length;
      case "journey": return (H.journey ? H.journey.records.length : 0);
      case "glossary": return H.terms ? Object.keys(H.terms).length : 0;
      default: return 0;
    }
  }

  function countLabel(id, n) {
    switch (id) {
      case "notes": return n + " 篇 · 要点卡 / 长文";
      case "craft": return n + " 次转化";
      case "quiz": return n + " 题 · 每日一题滚动";
      case "journey": return n + " 条面试记录";
      case "glossary": return n + " 个术语";
      default: return String(n);
    }
  }

  /* 每日一题：按日期在题库里滚动（同一天稳定不变） */
  function dailyIndex(len) {
    var day = Math.floor(Date.now() / 86400000);
    return day % len;
  }

  H.ui = H.ui || {};

  H.ui.app = {
    init: function init() {
      var mount = document.getElementById("homeEntries");
      if (!mount || !H.site) return;

      H.site.boards.forEach(function (board) {
        var n = boardCount(board.id);
        mount.appendChild(el("a", { class: "entry reveal", href: board.href }, [
          el("span", { class: "entry-no", attrs: { "aria-hidden": "true" }, text: board.num }),
          el("p", { class: "entry-kicker", text: board.kicker }),
          el("h3", { class: "entry-title", text: board.title }),
          el("p", { class: "entry-desc", text: board.desc }),
          el("p", { class: "entry-meta", text: countLabel(board.id, n) }),
          el("span", { class: "entry-arrow", text: board.id === "notes" ? "进入板块 ↓" : "打开 →" })
        ]));
      });

      /* 每日一题导语（题库为空时不渲染） */
      var daily = document.getElementById("homeDaily");
      if (daily && H.quiz && H.quiz.length) {
        var item = H.quiz[dailyIndex(H.quiz.length)];
        daily.appendChild(el("a", { class: "daily reveal", href: "quiz.html#daily" }, [
          el("span", { class: "daily-kicker", text: "DAILY · 今日一题" }),
          el("span", { class: "daily-q", text: item.q })
        ]));
      }

      /* 滚动淡入 */
      var targets = document.querySelectorAll(".reveal");
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
        targets.forEach(function (node) { io.observe(node); });
      } else {
        targets.forEach(function (node) { node.classList.add("is-visible"); });
      }
    }
  };
})(window.Handbook = window.Handbook || {});
