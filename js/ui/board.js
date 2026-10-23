/* ==========================================================================
   ui/board.js — 通用板块列表（上课笔记 / 笔记→面试题 共用）
   数据驱动：notes / craft 两个注册表，卡片可展开（要点卡直读要点），
   长文条目带外链；注册表为空时渲染引导空态。
   ========================================================================== */

(function (H) {
  "use strict";

  var el = H.dom.el;
  var fmt = function (text) {
    return (H.ui.fmt || H.dom.escapeHTML)(text);
  };

  function emptyState(hint) {
    return el("div", { class: "board-empty" }, [
      el("p", { class: "board-empty-title", text: "还没有内容" }),
      el("p", { class: "board-empty-desc", html: hint })
    ]);
  }

  H.ui = H.ui || {};

  H.ui.board = {
    /* mount: 列表容器；items: 注册表数组；kind: "notes" | "craft" */
    init: function init(mount, items, kind) {
      if (!mount) return;
      var self = this;
      mount.innerHTML = "";

      if (!items || !items.length) {
        mount.appendChild(emptyState(
          kind === "notes"
            ? "把第一篇笔记发给我（或按 <code>js/data/notes.js</code> 里的示例格式加入数组），要点卡 / 长文都支持。"
            : "第一条转化记录：从一篇笔记里提炼考点，组织成能开口讲的答案，然后登记进 <code>js/data/craft.js</code>。"
        ));
        return;
      }

      items.forEach(function (item, i) {
        mount.appendChild(self.renderCard(item, i + 1, kind));
      });

      /* 手风琴（事件委托） */
      mount.addEventListener("click", function (event) {
        var head = event.target.closest(".qa-head");
        if (!head || !mount.contains(head)) return;
        var card = head.closest(".qa-item");
        if (!card) return;
        var open = !card.classList.contains("is-open");
        card.classList.toggle("is-open", open);
        head.setAttribute("aria-expanded", String(open));
      });
    },

    renderCard: function renderCard(item, no, kind) {
      var isNote = kind === "notes";
      var hasBody = !isNote || item.type === "card";

      var headMeta = isNote
        ? [item.date, item.type === "long" ? "长文" : "要点卡"].filter(Boolean)
        : [item.date];

      var children = [
        el("h4", {}, [
          el("button", {
            class: "qa-head",
            attrs: { type: "button", "aria-expanded": "false" }
          }, [
            el("span", { class: "qa-no", text: String(no).length < 2 ? "0" + no : String(no) }),
            el("span", { class: "qa-q", text: isNote ? item.title : item.to }),
            hasBody ? el("span", {
              class: "qa-toggle",
              attrs: { "aria-hidden": "true" },
              html: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M4 11h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>'
            }) : el("span", { class: "qa-arrow", text: "→" })
          ])
        ])
      ];

      var bodyBits = [];
      if (!isNote && item.from) {
        bodyBits.push(el("p", { class: "qa-from", html: "来源：<strong>" + H.dom.escapeHTML(item.from) + "</strong>" }));
      }
      if (item.desc) {
        bodyBits.push(el("p", { class: "qa-desc", html: fmt(item.desc) }));
      }
      if (item.points && item.points.length) {
        bodyBits.push(el("ul", { class: "qa-points" }, item.points.map(function (p) {
          return el("li", { html: fmt(p) });
        })));
      }

      if (hasBody) {
        children.push(el("div", { class: "qa-body" }, [
          el("div", { class: "qa-body-in" }, [
            el("div", { class: "qa-body-pad" }, [
              el("p", { class: "qa-meta-line", text: headMeta.join(" · ") }),
              bodyBits
            ])
          ])
        ]));
      } else {
        /* 长文条目：整卡是链接 */
        var head2 = children[0].querySelector(".qa-head");
        head2.addEventListener("click", function () {
          if (item.url) location.href = item.url;
        });
      }

      return el("article", { class: "qa-item" }, children);
    }
  };
})(window.Handbook = window.Handbook || {});
