/* ==========================================================================
   data/journey.js — 面经（板块 04）
   四组数据，分别渲染四个小节：

   schedule: 行程      { date, time, what, company, note }
   companies: 公司     { name, role, channel, status, statusLabel, link, note }
             status: preparing | interviewing | offer | rejected | paused
   prep: 准备          { text, done }（勾选状态存 localStorage，这里是默认清单）
   records: 面试记录   { date, company, round, mode, qa, note }
             qa: [{ q, a }]  记得住的问答还原
   ========================================================================== */

(function (H) {
  "use strict";

  H.journey = {
    schedule: [

      /* 示例：{ date: "2026-11-02", time: "14:00", what: "一面 · 视频", company: "XX 科技", note: "提前准备项目深挖稿" } */
    ],

    companies: [

      /* 示例：{ name: "XX 科技", role: "AI 产品经理", channel: "Boss", status: "interviewing", statusLabel: "约面中", link: "", note: "业务：电商导购" } */
    ],

    prep: [

      /* 示例：{ text: "项目深挖稿串讲一遍", done: false } */
    ],

    records: [

      /* 示例：
      {
        date: "2026-11-02", company: "XX 科技", round: "一面", mode: "视频",
        qa: [
          { q: "最有价值的项目？", a: "讲了承接体系重构，追问了归因。" }
        ],
        note: "复盘：归因部分要再补数据口径。"
      }
      */
    ]
  };
})(window.Handbook = window.Handbook || {});
