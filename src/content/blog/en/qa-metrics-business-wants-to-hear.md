---
title: "QA metrics the business actually wants to hear"
description: "A complete guide to transforming QA reporting - from counting bugs to speaking the language of outcomes and business decisions. Five metrics, three pillars, one model."
date: 2026-05-19
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 12
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 1 of 9</p>

<p class="fb-lead">You track defects, test coverage, execution results - and you have the feeling that outside your own QA team nobody cares. You're right. And it's not your fault.</p>

For years I've watched the same pattern: meticulously prepared dashboards, detailed bug tables - and complete silence from the business side. Sprint review wrapped up with *"ok, thanks"*, decisions made by gut feel, with no anchor in QA data.

The problem isn't a lack of data. We have too much data. The problem is that **we report activity instead of outcomes**. This isn't a technical problem - it's a communication problem.

<blockquote class="fb-quote">An activity metric tells you how hard you worked. An outcome metric tells you what the result was. The business pays for results - and that is what it wants to hear about.</blockquote>

This article is the first of nine in a series. You'll learn which metrics to collect, how to interpret them, and - most importantly - how to use them to tell a story that stakeholders understand and can act on.

## What the business actually hears

Picture a sprint review. QA presents numbers. Stakeholders nod. The decision is made by feel. Below are exactly the same facts about exactly the same sprint - in two different languages.

<div class="fb-compare">
  <div class="fb-dp fb-dp-before">
    <span class="fb-dp-tag">BEFORE - Activity</span>
    <div class="fb-dp-row"><span class="n">Bugs found</span><span class="v">47</span></div>
    <div class="fb-dp-row"><span class="n">Tests executed</span><span class="v">312</span></div>
    <div class="fb-dp-row"><span class="n">Pass rate</span><span class="v">94%</span></div>
    <div class="fb-dp-row"><span class="n">Coverage</span><span class="v">82%</span></div>
    <div class="fb-dp-verdict">Nobody reads it. Gut-feel decision.</div>
  </div>
  <div class="fb-dp fb-dp-after">
    <span class="fb-dp-tag">AFTER - Outcomes</span>
    <div class="fb-dp-row"><span class="n">Defect Detection Ratio</span><span class="v">94% <span class="tg">↑</span></span></div>
    <div class="fb-dp-row"><span class="n">Escaped / Release</span><span class="v">1.2 <span class="tg">↓</span></span></div>
    <div class="fb-dp-row"><span class="n">Issues / Release</span><span class="v">8 <span class="tg">↓ 40%</span></span></div>
    <div class="fb-dp-row"><span class="n">Releases this Q</span><span class="v">10</span></div>
    <div class="fb-dp-row"><span class="n">Confidence Score</span><span class="v">91%</span></div>
    <div class="fb-dp-verdict">Story. Decisions. GO.</div>
  </div>
</div>

The left side describes how busy QA is. The right side answers the question the business actually asks: **can we release, and how is quality trending?** This shift doesn't require new tools - it requires a new approach to the question you want your data to answer.

## What the business really wants - three pillars

Stakeholders ask three questions - and those are the questions your QA metrics should answer. Nothing more, nothing less.

### Pillar 1 - Release confidence

One question, one answer: **can we ship?** A Release Confidence Score aggregates blockers, regression results and critical paths into a single indicator. One number - one decision in the steering committee.

<div class="fb-conf-row">
  <div class="fb-cc fb-cc-r">
    <div class="fb-cc-sprint">Sprint 12</div>
    <div class="fb-cc-score">62%</div>
    <span class="fb-cc-badge">Hold</span>
  </div>
  <div class="fb-cc fb-cc-a">
    <div class="fb-cc-sprint">Sprint 13</div>
    <div class="fb-cc-score">78%</div>
    <span class="fb-cc-badge">Conditional</span>
  </div>
  <div class="fb-cc fb-cc-g">
    <div class="fb-cc-sprint">Sprint 14</div>
    <div class="fb-cc-score">94%</div>
    <span class="fb-cc-badge">GO</span>
  </div>
</div>

### Pillar 2 - Cost of defects

One escaped bug isn't *"+1 to the counter"*. It's a concrete number of hours and currency. Once you start converting it - you have a financial argument that every CFO and every Engineering Manager understands.

<div class="fb-cost-grid">
  <div class="fb-cost-card">
    <div class="fb-cost-role">DevOps</div>
    <div class="fb-cost-val">4.5h</div>
    <div class="fb-cost-unit">hotfix + rollback</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">Developer</div>
    <div class="fb-cost-val">2h</div>
    <div class="fb-cost-unit">analysis + fix</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">PM</div>
    <div class="fb-cost-val">1h</div>
    <div class="fb-cost-unit">coordination</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">SLA breach</div>
    <div class="fb-cost-val fb-cost-val-sm">+penalty</div>
    <div class="fb-cost-unit">customer trust</div>
  </div>
  <div class="fb-cost-card fb-cost-total">
    <div class="fb-cost-role">Total</div>
    <div class="fb-cost-val">8h+</div>
    <div class="fb-cost-unit">per 1 defect</div>
  </div>
</div>

### Pillar 3 - Quality trends

A single sprint is nothing. Four quarters are a story - and direct evidence that investment in QA pays off. The escaped defect rate trend is one of the strongest arguments in a conversation with the board because it talks about return on investment.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped Defect Rate - yearly trend</div>
      <div class="fb-chart-sub">Percentage of defects discovered after deployment to production</div>
    </div>
    <span class="fb-chart-badge">↓ 66% YoY</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#B03333"></span>Escaped Defect Rate (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-escaped" role="img" aria-label="Line chart: escaped defect rate drops from 3.2% in Q1 2025 to 1.1% in Q4 2025."></canvas>
  </div>
</div>

## Five metrics that together tell a story

Each of the metrics below answers one specific business question. Combined, they form a narrative stakeholders understand and can act on. Individually they inform - together they tell a story.

<div class="fb-table-wrap">
<table class="fb-m-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Metric</th>
      <th>What question does it answer?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="fb-t-num">01</td>
      <td><div class="fb-t-name">Defect Detection Ratio</div><div class="fb-t-desc">DDR = pre-release bugs ÷ (pre + post)</div></td>
      <td class="fb-t-q">How many defects do we catch before they hit production?</td>
    </tr>
    <tr>
      <td class="fb-t-num">02</td>
      <td><div class="fb-t-name">Escaped Bugs &amp; Problems</div><div class="fb-t-desc">Code, infra, configuration, integrations, regressions post-deploy</div></td>
      <td class="fb-t-q">What slips into production and in what form?</td>
    </tr>
    <tr>
      <td class="fb-t-num">03</td>
      <td><div class="fb-t-name">Issues per Release</div><div class="fb-t-desc">All problems found in a single release</div></td>
      <td class="fb-t-q">How mature is the code that reaches testing?</td>
    </tr>
    <tr>
      <td class="fb-t-num">04</td>
      <td><div class="fb-t-name">Escaped Bugs per Release</div><div class="fb-t-desc">Escaped per specific release - not the overall rate</div></td>
      <td class="fb-t-q">Which releases were risky and why?</td>
    </tr>
    <tr>
      <td class="fb-t-num">05</td>
      <td><div class="fb-t-name">Number of Releases</div><div class="fb-t-desc">Context metric - normalises everything above</div></td>
      <td class="fb-t-q">Are we comparing apples to apples?</td>
    </tr>
  </tbody>
</table>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">DDR vs Escaped Bugs - quarterly trend</div>
      <div class="fb-chart-sub">A classic healthy QA trend: DDR rises, escaped falls - at the same time</div>
    </div>
    <span class="fb-chart-badge">Q1–Q4 2025</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>DDR (%)</span>
    <span class="fb-lg"><span class="fb-ld fb-ld-dash"></span>Escaped Bugs (count)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-ddr" role="img" aria-label="Chart: DDR rises from 78% to 94%, Escaped Bugs falls from 13 to 4."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Issues per Release - code maturity</div>
      <div class="fb-chart-sub">A drop from 24 to 8 is a 66% improvement. Not just QA - the whole delivery process is maturing.</div>
    </div>
    <span class="fb-chart-badge">v2.1 → v2.5</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Issues found in a release</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-issues" role="img" aria-label="Bar chart: Issues per release v2.1=24, v2.2=19, v2.3=14, v2.4=11, v2.5=8."></canvas>
  </div>
</div>

Three releases in a row below 10 issues is the moment when you can tell the Engineering Manager: *"look what we did together over the last six months."* That's the conversation data enables - and the one you simply can't have without data.

<div class="fb-map">
  <span class="fb-map-eyebrow">Mapping model</span>
  <h2 class="fb-map-h">QA → Business KPIs</h2>
  <p class="fb-map-sub">Every QA metric has its counterpart in business language. The QA Lead's job is to build that bridge - and to anchor each number in the question a stakeholder asks in the steering committee.</p>
  <div class="fb-map-grid">
    <div class="fb-m-card">
      <div class="fb-m-metric">Confidence Score</div>
      <div class="fb-m-kpi">Release Predictability</div>
      <div class="fb-m-q">Can we release safely?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">DDR + Escaped Rate</div>
      <div class="fb-m-kpi">Cost of Poor Quality</div>
      <div class="fb-m-q">How much do bugs cost us?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">Issues/Release + Releases</div>
      <div class="fb-m-kpi">Delivery Sustainability</div>
      <div class="fb-m-q">Are we accelerating safely?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">Escaped/Release trend</div>
      <div class="fb-m-kpi">Risk per Deployment</div>
      <div class="fb-m-q">Which release was risky?</div>
    </div>
  </div>
</div>

## Three reporting anti-patterns

Even good data can be presented badly. Here are the mistakes that most often destroy QA credibility in the eyes of the business - and which you only need to be aware of to avoid.

<div class="fb-anti-grid">
  <div class="fb-anti-card">
    <div class="fb-anti-num">01</div>
    <div class="fb-anti-title">Too many metrics</div>
    <div class="fb-anti-desc">A dashboard with 20 charts is overwhelming. When everything is important - nothing is. Start with 3 metrics, add gradually.</div>
  </div>
  <div class="fb-anti-card">
    <div class="fb-anti-num">02</div>
    <div class="fb-anti-title">No context</div>
    <div class="fb-anti-desc">Just "82%" with no trend and no goal says nothing. Always: number + direction + target. Trend says where you're coming from, target - where you're heading.</div>
  </div>
  <div class="fb-anti-card">
    <div class="fb-anti-num">03</div>
    <div class="fb-anti-title">Technical jargon</div>
    <div class="fb-anti-desc">Speak the audience's language, not your tool's. No "flaky tests in the CI/CD pipeline" on a slide for the Product Owner. Plain and clear.</div>
  </div>
</div>

## What comes next - 9 articles, one topic

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title">The complete guide <span class="fb-s-now">you are here</span></div>
        <div class="fb-s-sub">Diagnosis of the problem, three pillars, five metrics, the QA → KPI mapping model</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title">Defect Detection Ratio - a deep guide</div>
        <div class="fb-s-sub">Formula, interpretation, pitfalls, real-life numerical examples</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title">Escaped Bugs &amp; Problems - full spectrum</div>
        <div class="fb-s-sub">Why count more than just bugs in the application code</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">04</span>
      <div>
        <div class="fb-s-title">Issues per Release - a code-maturity gauge</div>
        <div class="fb-s-sub">How this metric reshapes the conversation with the Engineering Manager</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">05</span>
      <div>
        <div class="fb-s-title">Escaped Bugs per Release - find the risky release</div>
        <div class="fb-s-sub">Pinpointing problems, not just watching trends</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">06</span>
      <div>
        <div class="fb-s-title">Number of Releases - the context metric</div>
        <div class="fb-s-sub">Why 3 bugs with 2 releases is a disaster, and with 15 - a success</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">07</span>
      <div>
        <div class="fb-s-title">Release Confidence Score step by step</div>
        <div class="fb-s-sub">Three calculation models, rollout, concrete examples from practice</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">08</span>
      <div>
        <div class="fb-s-title">Storytelling with metrics - building a narrative</div>
        <div class="fb-s-sub">How to turn a table of numbers into a business argument</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">09</span>
      <div>
        <div class="fb-s-title">3 anti-patterns that destroy QA credibility</div>
        <div class="fb-s-sub">Too many metrics, no context, jargon - and how to avoid each</div>
      </div>
    </li>
  </ul>
</div>

</div>

<style is:inline>
.fb-article {
  --fb-navy: #0E1F3D;
  --fb-gold: #C8943A;
  --fb-gold-pale: #F6EDDA;
  --fb-teal: #0A6B6F;
  --fb-teal-pale: #D4EDEE;
  --fb-surface: #F8F6F2;
  --fb-border: #E8E4DC;
  --fb-muted: #5C5C5C;
  --fb-faint: #999;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow {
  display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px;
}
.fb-lead {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.25rem; line-height: 1.55;
  border-left: 3px solid var(--fb-gold);
  padding-left: 22px; margin: 24px 0 28px;
}
.fb-quote {
  background: var(--fb-surface); border-left: 3px solid var(--fb-gold);
  padding: 22px 26px; margin: 32px 0;
  border-radius: 0 12px 12px 0;
  font-family: Georgia, serif; font-style: italic;
  font-size: 1.05rem; line-height: 1.6;
}

.fb-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0; }
@media (max-width: 560px) { .fb-compare { grid-template-columns: 1fr; } }
.fb-dp { border-radius: 12px; padding: 22px; }
.fb-dp-before { background: var(--fb-surface); border: 1px solid var(--fb-border); }
.fb-dp-after  { background: var(--fb-navy); color: #fff; }
.fb-dp-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; padding: 4px 11px;
  border-radius: 20px; display: inline-block; margin-bottom: 18px;
}
.fb-dp-before .fb-dp-tag { background: #E5E1D8; color: var(--fb-muted); }
.fb-dp-after  .fb-dp-tag { background: rgba(200,148,58,0.18); color: var(--fb-gold); }
.fb-dp-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0; border-bottom: 1px solid rgba(0,0,0,0.07); font-size: 13px;
}
.fb-dp-after .fb-dp-row { border-color: rgba(255,255,255,0.08); }
.fb-dp-row:last-of-type { border-bottom: none; }
.fb-dp-before .fb-dp-row .n { color: var(--fb-muted); }
.fb-dp-after  .fb-dp-row .n { color: rgba(255,255,255,0.55); font-size: 12px; }
.fb-dp-before .fb-dp-row .v { font-weight: 700; color: #111; font-size: 14px; }
.fb-dp-after  .fb-dp-row .v { font-weight: 700; color: #fff; font-size: 14px; }
.fb-dp-after  .fb-dp-row .v .tg { color: #3DAA6A; font-size: 11px; font-weight: 400; margin-left: 4px; }
.fb-dp-verdict {
  margin-top: 16px; padding: 9px; border-radius: 6px;
  font-size: 11px; font-weight: 700; text-align: center; letter-spacing: 0.04em;
}
.fb-dp-before .fb-dp-verdict { background: #DEDAD3; color: var(--fb-muted); }
.fb-dp-after  .fb-dp-verdict { background: rgba(61,170,106,0.15); color: #3DAA6A; }

.fb-conf-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 24px 0; }
@media (max-width: 480px) { .fb-conf-row { grid-template-columns: 1fr; } }
.fb-cc { border-radius: 12px; padding: 22px 16px; text-align: center; border: 1.5px solid; }
.fb-cc-r { background: #FEF2F2; border-color: #FCA5A5; }
.fb-cc-a { background: #FFFBEB; border-color: #FCD34D; }
.fb-cc-g { background: #F0FDF4; border-color: #86EFAC; }
.fb-cc-sprint { font-size: 11px; color: var(--fb-faint); margin-bottom: 6px; letter-spacing: 0.04em; }
.fb-cc-score { font-family: Georgia, serif; font-size: 2.5rem; font-weight: 500; line-height: 1; margin-bottom: 12px; }
.fb-cc-r .fb-cc-score { color: #DC2626; }
.fb-cc-a .fb-cc-score { color: #D97706; }
.fb-cc-g .fb-cc-score { color: #16A34A; }
.fb-cc-badge { font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; padding: 5px 13px; border-radius: 20px; display: inline-block; color: #fff; }
.fb-cc-r .fb-cc-badge { background: #DC2626; }
.fb-cc-a .fb-cc-badge { background: #D97706; }
.fb-cc-g .fb-cc-badge { background: #16A34A; }

.fb-cost-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin: 24px 0; }
.fb-cost-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 10px; padding: 18px 14px; text-align: center; }
.fb-cost-total { background: var(--fb-navy); border-color: var(--fb-navy); }
.fb-cost-role { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 5px; }
.fb-cost-total .fb-cost-role { color: rgba(255,255,255,0.4); }
.fb-cost-val { font-family: Georgia, serif; font-size: 1.8rem; font-weight: 500; color: #111; line-height: 1; }
.fb-cost-val-sm { font-size: 1.1rem; padding-top: 5px; }
.fb-cost-total .fb-cost-val { color: #fff; }
.fb-cost-unit { font-size: 11px; color: var(--fb-faint); margin-top: 4px; }
.fb-cost-total .fb-cost-unit { color: rgba(255,255,255,0.4); }

.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-ld-dash { width: 16px; height: 0; border-top: 2px dashed #B03333; border-radius: 0; }
.fb-chart-canvas { position: relative; width: 100%; }

.fb-table-wrap { margin: 24px 0; overflow-x: auto; }
.fb-m-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
.fb-m-table thead th { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-muted); padding: 11px 16px; text-align: left; border-bottom: 2px solid var(--fb-border); background: var(--fb-surface); }
.fb-m-table thead th:first-child { width: 48px; }
.fb-m-table td { padding: 15px 16px; border-bottom: 1px solid var(--fb-border); vertical-align: top; }
.fb-m-table tr:last-child td { border-bottom: none; }
.fb-t-num { font-family: Georgia, serif; font-size: 17px; font-weight: 500; color: var(--fb-navy); }
.fb-t-name { font-weight: 700; color: #111; margin-bottom: 3px; font-size: 13px; }
.fb-t-desc { font-size: 11px; color: var(--fb-faint); }
.fb-t-q { font-size: 12px; color: var(--fb-teal); font-style: italic; }

.fb-map { background: var(--fb-navy); color: #fff; padding: 48px 32px; margin: 40px 0; border-radius: 16px; }
.fb-map-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); }
.fb-map-h { font-family: Georgia, serif; color: #fff !important; margin: 8px 0 10px; font-size: 1.7rem; font-weight: 500; }
.fb-map-sub { color: rgba(255,255,255,0.6); font-size: 15px; margin-bottom: 24px; }
.fb-map-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
@media (max-width: 500px) { .fb-map-grid { grid-template-columns: 1fr; } }
.fb-m-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
.fb-m-metric { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 7px; }
.fb-m-kpi { font-family: Georgia, serif; font-size: 17px; color: #fff; margin-bottom: 5px; }
.fb-m-q { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; }

.fb-anti-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 24px 0; }
.fb-anti-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; background: #fff; }
.fb-anti-num { font-family: Georgia, serif; font-size: 2.5rem; font-weight: 300; color: var(--fb-border); line-height: 1; margin-bottom: 12px; }
.fb-anti-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 8px; }
.fb-anti-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.6; }

.fb-series { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 28px; margin: 28px 0; }
.fb-series-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-s-list { list-style: none; padding: 0; margin: 0; }
.fb-s-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--fb-border); }
.fb-s-item:last-child { border-bottom: none; }
.fb-s-num { font-family: Georgia, serif; font-size: 16px; font-weight: 500; color: var(--fb-navy); min-width: 22px; flex-shrink: 0; padding-top: 1px; }
.fb-s-current .fb-s-num { color: var(--fb-gold); }
.fb-s-title { font-size: 14px; font-weight: 600; color: #111; }
.fb-s-current .fb-s-title { color: var(--fb-gold); }
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: var(--fb-gold); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

:root[data-theme="dark"] .fb-article .fb-dp-before,
:root[data-theme="dark"] .fb-article .fb-cost-card:not(.fb-cost-total),
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-anti-card,
:root[data-theme="dark"] .fb-article .fb-table-wrap { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-m-table thead th { background: rgba(255,255,255,0.04); color: #ccc; }
:root[data-theme="dark"] .fb-article .fb-t-name,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-anti-title,
:root[data-theme="dark"] .fb-article .fb-s-title,
:root[data-theme="dark"] .fb-article .fb-cost-card:not(.fb-cost-total) .fb-cost-val,
:root[data-theme="dark"] .fb-article .fb-dp-before .fb-dp-row .v { color: #fff; }
</style>

<script is:inline src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script is:inline>
(function () {
  function init() {
    if (typeof Chart === 'undefined') { setTimeout(init, 80); return; }
    if (window.__fbChartsRendered) return;
    window.__fbChartsRendered = true;
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    var esc = document.getElementById('fb-c-escaped');
    if (esc) new Chart(esc, {
      type: 'line',
      data: { labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'], datasets: [{ data: [3.2, 2.4, 1.6, 1.1], borderColor: '#B03333', backgroundColor: 'rgba(176,51,51,0.09)', borderWidth: 2.5, pointBackgroundColor: '#B03333', pointRadius: 5, pointHoverRadius: 7, fill: true, tension: 0.4 }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '  ' + c.raw + '%'; } } } },
        scales: { y: { min: 0, max: 4, ticks: { callback: function (v) { return v + '%'; }, stepSize: 1 }, grid: { color: grid }, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } } }
    });
    var ddr = document.getElementById('fb-c-ddr');
    if (ddr) new Chart(ddr, {
      type: 'line',
      data: { labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [
        { label: 'DDR', data: [78, 84, 90, 94], borderColor: '#2A7A3E', backgroundColor: 'rgba(42,122,62,0.08)', borderWidth: 2.5, pointBackgroundColor: '#2A7A3E', pointRadius: 5, fill: true, tension: 0.4, yAxisID: 'y' },
        { label: 'Escaped Bugs', data: [13, 11, 7, 4], borderColor: '#B03333', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [6, 4], pointBackgroundColor: '#B03333', pointStyle: 'triangle', pointRadius: 6, fill: false, tension: 0.4, yAxisID: 'y1' } ] },
      options: { responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: { y: { min: 60, max: 100, ticks: { callback: function (v) { return v + '%'; }, stepSize: 10 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'DDR', font: { size: 10 }, color: '#2A7A3E' } }, y1: { position: 'right', min: 0, max: 18, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Escaped', font: { size: 10 }, color: '#B03333' } }, x: { grid: { display: false }, border: { display: false } } } }
    });
    var iss = document.getElementById('fb-c-issues');
    if (iss) new Chart(iss, {
      type: 'bar',
      data: { labels: ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.5'], datasets: [{ data: [24, 19, 14, 11, 8], backgroundColor: ['#0B1E3A', '#163254', '#1F4A80', '#3B77BF', '#0A6B6F'], borderRadius: 6, borderSkipped: false }] },
      options: { responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '  ' + c.raw + ' issues'; } } } },
        scales: { y: { min: 0, max: 28, ticks: { stepSize: 8 }, grid: { color: grid }, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } } }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>
