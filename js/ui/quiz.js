/* ==========================================================================
   ui/quiz.js — 面试题库（板块 03）
   顶部「每日一题」按日期在题库滚动（#daily 锚点直达）；
   下方题库：搜索 + 分类筛选（侧栏，计数不随选中清零）+ 手风琴展开。
   深链 #q-3 展开题库全局序号第 3 题。
   ========================================================================== */

(function (H) {
  "use strict";

  var el = H.dom.el;
  var fmt = function (text) {
    return (H.ui.fmt || H.dom.escapeHTML)(text);
  };

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function dailyIndex(len) {
    return Math.floor(Date.now() / 86400000) % len;
  }

  H.ui = H.ui || {};

  H.ui.quiz = {
    init: function init() {
      this.daily = document.getElementById("quizDaily");
      this.rail = document.getElementById("quizRail");
      this.list = document.getElementById("quizList");
      this.count = document.getElementById("quizCount");
      this.search = document.querySelector(".quiz-search");
      if (!this.list) return;

      this.state = { query: "", cat: "全部" };
      this.renderDaily();
      this.renderRail();
      this.bindTools();
      this.applyFilter();

      var m = /^#q-(\d+)$/.exec(location.hash);
      if (m) this.openQuestion(parseInt(m[1], 10), true);
    },

    /* —— 每日一题：当天滚动轮换，锚点 #daily —— */
    renderDaily: function renderDaily() {
      if (!this.daily || !H.quiz || !H.quiz.length) {
        if (this.daily) this.daily.style.display = "none";
        return;
      }
      var item = H.quiz[dailyIndex(H.quiz.length)];
      var self = this;

      this.daily.appendChild(el("div", { class: "daily-card" }, [
        el("div", { class: "daily-head" }, [
          el("span", { class: "daily-kicker", text: "DAILY · 每日一题" }),
          el("span", { class: "daily-date", text: new Date().toLocaleDateString("zh-CN", { month: "long", day: "numeric" }) })
        ]),
        el("h3", { class: "daily-q", text: item.q }),
        el("p", { class: "daily-focus", html: "<strong>考察点</strong> · " + fmt(item.focus) }),
        el("button", {
          class: "daily-toggle",
          attrs: { type: "button", "aria-expanded": "false" },
          text: "展开参考回答"
        }),
        el("div", { class: "qa-body" }, [
          el("div", { class: "qa-body-in" }, [
            el("div", { class: "qa-body-pad" }, [
              el("ul", { class: "qa-points" }, (item.points || []).map(function (p) {
                return el("li", { html: fmt(p) });
              }))
            ])
          ])
        ])
      ]));

      this.daily.querySelector(".daily-toggle").addEventListener("click", function (event) {
        var btn = event.currentTarget;
        var open = !this.daily.classList.contains("is-open");
        this.daily.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", String(open));
        btn.textContent = open ? "收起参考回答" : "展开参考回答";
      }.bind(this));
      void self;
    },

    renderRail: function renderRail() {
      if (!this.rail) return;
      var self = this;
      var cats = ["全部"].concat(H.quizCats || []);
      cats.forEach(function (cat) {
        self.rail.appendChild(el("button", {
          class: "rail-item" + (cat === "全部" ? " is-active" : ""),
          attrs: { type: "button", "data-cat": cat, "aria-pressed": cat === "全部" ? "true" : "false" }
        }, [
          el("span", { class: "rail-name", text: cat }),
          el("span", { class: "rail-count", attrs: { "data-cat-count": cat }, text: "" })
        ]));
      });
    },

    bindTools: function bindTools() {
      var self = this;

      if (this.search) {
        this.search.addEventListener("input", function () {
          self.state.query = self.search.value.trim().toLowerCase();
          self.applyFilter();
        });
      }

      document.addEventListener("keydown", function (event) {
        if (event.key !== "/" || event.ctrlKey || event.metaKey || event.altKey) return;
        var active = document.activeElement;
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return;
        if (!self.search) return;
        event.preventDefault();
        self.search.focus();
      });

      if (this.rail) {
        this.rail.addEventListener("click", function (event) {
          var item = event.target.closest(".rail-item");
          if (!item) return;
          self.state.cat = item.dataset.cat;
          self.rail.querySelectorAll(".rail-item").forEach(function (n) {
            var on = n === item;
            n.classList.toggle("is-active", on);
            n.setAttribute("aria-pressed", String(on));
          });
          self.applyFilter();
        });
      }

      this.list.addEventListener("click", function (event) {
        var head = event.target.closest(".qa-head");
        if (!head || !self.list.contains(head)) return;
        var item = head.closest(".qa-item");
        if (!item) return;
        var open = !item.classList.contains("is-open");
        item.classList.toggle("is-open", open);
        head.setAttribute("aria-expanded", String(open));
      });
    },

    openQuestion: function openQuestion(n, scroll) {
      var target = this.list.querySelector('[data-qno="' + n + '"]');
      if (!target) return;
      target.classList.add("is-open");
      target.querySelector(".qa-head").setAttribute("aria-expanded", "true");
      if (scroll) {
        if (target.scrollIntoIfNeeded) target.scrollIntoIfNeeded(false);
        else target.scrollIntoView({ block: "center" });
      }
    },

    applyFilter: function applyFilter() {
      var self = this;
      var list = this.list;
      var query = this.state.query;
      var cat = this.state.cat;
      list.innerHTML = "";

      var entries = (H.quiz || []).map(function (item, i) {
        return { no: i + 1, item: item };
      });

      var byQuery = entries.filter(function (entry) {
        if (!query) return true;
        var haystack = (entry.item.q + " " + (entry.item.cat || "") + " " + entry.item.focus + " " + entry.item.points.join(" ")).toLowerCase();
        return haystack.indexOf(query) !== -1;
      });

      var matched = byQuery.filter(function (entry) {
        return cat === "全部" || entry.item.cat === cat;
      });

      matched.forEach(function (entry) {
        var item = entry.item;
        var noText = item.label || "Q" + pad(entry.no);
        list.appendChild(el("article", {
          class: "qa-item",
          attrs: { "data-qno": entry.no }
        }, [
          el("h4", {}, [
            el("button", {
              class: "qa-head",
              attrs: { type: "button", "aria-expanded": "false" }
            }, [
              el("span", { class: "qa-no", text: noText }),
              item.cat ? el("span", { class: "qa-chip", text: item.cat }) : null,
              el("span", { class: "qa-q", text: item.q }),
              el("span", {
                class: "qa-toggle",
                attrs: { "aria-hidden": "true" },
                html: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M11 4v14M4 11h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>'
              })
            ])
          ]),
          el("div", { class: "qa-body" }, [
            el("div", { class: "qa-body-in" }, [
              el("div", { class: "qa-body-pad" }, [
                el("p", { class: "qa-focus", html: "<strong>考察点</strong> · " + fmt(item.focus) }),
                el("ul", { class: "qa-points" }, item.points.map(function (p) {
                  return el("li", { html: fmt(p) });
                }))
              ])
            ])
          ])
        ]));
      });

      if (!matched.length) {
        var hint = (H.quiz || []).length
          ? "没有匹配的题目，换个关键词试试。"
          : "题库还是空的：把题目按 <code>js/data/quiz.js</code> 里的示例格式加入数组，每日一题会自动开始滚动。";
        list.appendChild(el("p", { class: "qa-empty", html: hint }));
      }

      if (this.count) {
        this.count.textContent = (H.quiz || []).length
          ? (matched.length === entries.length ? "共 " + entries.length + " 题" : "匹配 " + matched.length + " / " + entries.length + " 题")
          : "共 0 题";
      }

      if (this.rail) {
        this.rail.querySelectorAll("[data-cat-count]").forEach(function (node) {
          var railCat = node.getAttribute("data-cat-count");
          var n = railCat === "全部"
            ? byQuery.length
            : byQuery.filter(function (entry) { return entry.item.cat === railCat; }).length;
          node.textContent = String(n);
          node.closest(".rail-item").classList.toggle("is-zero", n === 0);
        });
      }
      void self;
    }
  };
})(window.Handbook = window.Handbook || {});
