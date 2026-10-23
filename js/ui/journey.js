/* ==========================================================================
   ui/journey.js — 面经（板块 04）
   四节：行程（时间线）/ 公司（状态卡）/ 准备（可勾选清单，localStorage 持久化）/ 记录（面试还原）
   数据源：js/data/journey.js
   ========================================================================== */

(function (H) {
  "use strict";

  var el = H.dom.el;
  var STORE_KEY = "plab-prep-done";

  function loadDone() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch (e) { return {}; }
  }

  function saveDone(map) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(map)); } catch (e) { /* 隐私模式等场景静默降级 */ }
  }

  function emptyNode(hint) {
    return el("p", { class: "journey-empty", html: hint });
  }

  H.ui = H.ui || {};

  H.ui.journey = {
    init: function init() {
      var mount = document.getElementById("journeyApp");
      if (!mount || !H.journey) return;
      var j = H.journey;

      /* —— 行程 —— */
      var schedule = document.getElementById("jSchedule");
      if (schedule) {
        schedule.innerHTML = "";
        if (!j.schedule.length) {
          schedule.appendChild(emptyNode("还没有行程：往 <code>journey.schedule</code> 加一条，如 <code>{ date: \"11-02\", time: \"14:00\", what: \"一面·视频\", company: \"XX\" }</code>。"));
        } else {
          j.schedule.forEach(function (s) {
            schedule.appendChild(el("li", { class: "tl-item" }, [
              el("span", { class: "tl-date", text: (s.date || "") + (s.time ? " " + s.time : "") }),
              el("span", { class: "tl-what", text: s.what }),
              el("span", { class: "tl-company", text: s.company || "" }),
              s.note ? el("span", { class: "tl-note", text: s.note }) : null
            ]));
          });
        }
      }

      /* —— 公司 —— */
      var companies = document.getElementById("jCompanies");
      if (companies) {
        companies.innerHTML = "";
        if (!j.companies.length) {
          companies.appendChild(emptyNode("还没有登记公司：往 <code>journey.companies</code> 加一条，status 取 preparing / interviewing / offer / rejected / paused。"));
        } else {
          j.companies.forEach(function (c) {
            companies.appendChild(el("div", { class: "co-card" }, [
              el("div", { class: "co-head" }, [
                el("strong", { class: "co-name", text: c.name }),
                el("span", { class: "co-status s-" + (c.status || "preparing"), text: c.statusLabel || c.status || "" })
              ]),
              el("p", { class: "co-role", text: [c.role, c.channel].filter(Boolean).join(" · ") }),
              c.note ? el("p", { class: "co-note", text: c.note }) : null
            ]));
          });
        }
      }

      /* —— 准备（勾选持久化） —— */
      var prep = document.getElementById("jPrep");
      if (prep) {
        prep.innerHTML = "";
        if (!j.prep.length) {
          prep.appendChild(emptyNode("准备清单还是空的：往 <code>journey.prep</code> 加事项，页面上勾选会自动记住。"));
        } else {
          var done = loadDone();
          j.prep.forEach(function (p, i) {
            var id = "p" + i;
            var checked = !!done[id];
            var li = el("li", { class: "prep-item" }, [
              el("input", { attrs: { type: "checkbox", id: id } }),
              el("label", { attrs: { for: id }, text: p.text })
            ]);
            var box = li.querySelector("input");
            box.checked = checked;
            if (checked) li.classList.add("is-done");
            box.addEventListener("change", function () {
              done = loadDone();
              done[id] = box.checked;
              saveDone(done);
              li.classList.toggle("is-done", box.checked);
            });
            prep.appendChild(li);
          });
        }
      }

      /* —— 面试记录 —— */
      var records = document.getElementById("jRecords");
      if (records) {
        records.innerHTML = "";
        if (!j.records.length) {
          records.appendChild(emptyNode("还没有面试记录：面完当天往 <code>journey.records</code> 加一条，尽量还原问答。"));
        } else {
          j.records.forEach(function (r) {
            records.appendChild(el("article", { class: "rec-card" }, [
              el("div", { class: "rec-head" }, [
                el("strong", { class: "rec-title", text: r.company + " · " + r.round }),
                el("span", { class: "rec-meta", text: [r.date, r.mode].filter(Boolean).join(" · ") })
              ]),
              (r.qa || []).length ? el("ul", { class: "rec-qa" }, r.qa.map(function (pair) {
                return el("li", {}, [
                  el("p", { class: "rec-q", text: "Q：" + pair.q }),
                  pair.a ? el("p", { class: "rec-a", text: "A：" + pair.a }) : null
                ]);
              })) : null,
              r.note ? el("p", { class: "rec-note", text: "复盘：" + r.note }) : null
            ]));
          });
        }
      }
    }
  };
})(window.Handbook = window.Handbook || {});
