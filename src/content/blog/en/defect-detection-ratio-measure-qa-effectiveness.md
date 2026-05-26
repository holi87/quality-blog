---
title: "Defect Detection Ratio - how to measure effectiveness before anything reaches production"
description: "A deep guide to Defect Detection Ratio - basic and weighted formula, interpretation thresholds, historical data, seasonality, three traps and ready-to-use lines for the boardroom."
date: 2026-05-26
tags: ["qa", "metrics", "leadership", "ddr"]
lang: en
readingTime: 15
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 2 of 9</p>

<p class="fb-lead">You walk into a 1:1 with your Engineering Manager. One question lands: <em>"How many of those bugs do you catch before they reach the customer?"</em> - and the conversation starts to fall apart. Not because you test badly. Because you don't have one single number.</p>

<div class="fb-dialogue">
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">"Listen - how effective are you actually at this testing? How many of those bugs do you catch before they reach the customer?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">"Well... we found 47 bugs this sprint."</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">"Yes, but how many escaped?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">"Uh... twenty two."</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">"So half of them bypass you?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">"Well... not exactly, because those were smaller..."</span></div>
</div>

And the conversation falls apart. Not because you test badly. Because you don't have a number that answers that question directly. One. Concrete. Ready.

That number exists. It's called **Defect Detection Ratio** - and it's the topic of this article.

## What DDR is - and what it isn't

Defect Detection Ratio is the share of defects caught by QA *before* reaching production, against all defects found in total - both before and after release. In other words: out of all the problems that ultimately surfaced - how many did you catch yourselves, before the customer saw them?

This is a metric of **testing process effectiveness**. Not activity. It answers the question: *how well do we work as a filter before production?*

<blockquote class="fb-quote">DDR asks something fundamentally different from pass rate or coverage: does your testing process actually catch what matters?</blockquote>

**DDR is not the same as pass rate.** You can have a 99% pass rate and a 50% DDR - if your tests don't cover the areas where the bugs live.

**DDR is not the same as coverage.** You can hit 90% of the code and not check a single critical business scenario. Touching is not the same as verifying.

## From simple to advanced formula

### Basic version

<div class="fb-formula-box">
  <div class="fb-f-label">Basic formula</div>
  <div class="fb-formula">DDR = Pre-release bugs ÷ (Pre-release + Post-release)</div>
  <div class="fb-formula-example">DDR = 40 ÷ (40 + 10) = 40 ÷ 50 = <strong>80%</strong></div>
  <div class="fb-formula-note">Eight out of ten problems caught before the customer. One out of five escaped. That's your starting point.</div>
</div>

### Weighted version

The basic formula treats every bug equally. But a payments-blocking bug weighs more than a typo in a tooltip. It's worth extending the formula with weights.

<div class="fb-formula-box fb-weighted">
  <div class="fb-f-label">Weighted formula</div>
  <div class="fb-formula">DDR(weighted) = Σ(weight × bugs_pre) ÷ Σ(weight × bugs_pre + weight × bugs_post)</div>
  <div class="fb-formula-note">Start with the basic version. Introduce weights once you have a stable measurement rhythm and historical data.</div>
</div>

<div class="fb-table-wrap">
<table class="fb-w-table">
  <thead>
    <tr><th>Priority</th><th>Pre</th><th>Post</th><th>Weight</th><th>Weighted pre</th><th>Weighted post</th></tr>
  </thead>
  <tbody>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#dc2626"></span>Critical</span></td><td>2</td><td>3</td><td>×4</td><td>8</td><td>12</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#f59e0b"></span>High</span></td><td>8</td><td>5</td><td>×2</td><td>16</td><td>10</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#3b82f6"></span>Medium</span></td><td>20</td><td>2</td><td>×1</td><td>20</td><td>2</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#9ca3af"></span>Low</span></td><td>10</td><td>0</td><td>×0.5</td><td>5</td><td>0</td></tr>
    <tr><td><strong>Sum</strong></td><td><strong>40</strong></td><td><strong>10</strong></td><td>-</td><td><strong>49</strong></td><td><strong>24</strong></td></tr>
  </tbody>
</table>
</div>

<div class="fb-w-result">DDR(weighted) = 49 ÷ (49 + 24) = 49 ÷ 73 = <strong>67%</strong></div>

<div class="fb-alert-box">
<strong>Look at the result.</strong> The basic DDR was 80% - and it looked good. The weighted one is 67% - and it reveals that most critical bugs were escaping to production. That's a completely different story. And that's the story worth telling.
</div>

## DDR calculator

Enter your numbers and check the result. Toggle weighted mode to factor in bug criticality.

<div class="fb-calc-wrap">
  <div class="fb-calc-title">Calculate your DDR</div>
  <div class="fb-calc-sub">Basic or weighted - your choice</div>
  <div class="fb-calc-grid">
    <div class="fb-calc-field">
      <label>Bugs found pre-release</label>
      <input type="number" id="ddr-pre" value="40" min="0" />
    </div>
    <div class="fb-calc-field">
      <label>Bugs found post-release (escaped)</label>
      <input type="number" id="ddr-post" value="10" min="0" />
    </div>
  </div>
  <div class="fb-calc-toggle-row">
    <label class="fb-calc-toggle"><input type="checkbox" id="ddr-weighted" /><span class="fb-calc-slider"></span></label>
    <span class="fb-calc-toggle-label">Weighted mode (factor in bug priorities)</span>
  </div>
  <div class="fb-calc-weights" id="ddr-weights">
    <div class="fb-weights-grid">
      <div>
        <span class="fb-wf-label" style="color:#f87171">Critical ×4</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wc-pre" value="2" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wc-post" value="3" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#fcd34d">High ×2</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wh-pre" value="8" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wh-post" value="5" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#93c5fd">Medium ×1</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wm-pre" value="20" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wm-post" value="2" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#9ca3af">Low ×0.5</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wl-pre" value="10" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wl-post" value="0" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
    </div>
  </div>
  <div class="fb-calc-result" id="ddr-result">
    <div class="fb-cr-score" id="ddr-score">80%</div>
    <div class="fb-cr-info">
      <div class="fb-cr-label">Defect Detection Ratio</div>
      <div class="fb-cr-verdict" id="ddr-verdict">Solid process - what's hiding in the few that escape?</div>
      <div class="fb-cr-formula" id="ddr-formula">40 ÷ (40 + 10) = 80.0%</div>
    </div>
  </div>
</div>

## How to read the score - thresholds and context

DDR is not absolute truth. It's an indicator - and like every indicator, it requires interpretation. But certain industry thresholds are worth knowing as a reference point.

<div class="fb-gauge-wrap">
  <div class="fb-gauge-track"></div>
  <div class="fb-gauge-markers">
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">0%</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">70%</span><span class="fb-gauge-label">alarm threshold</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">85%</span><span class="fb-gauge-label">good threshold</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">95%</span><span class="fb-gauge-label">excellent threshold</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">100%</span></div>
  </div>
</div>

<div class="fb-gauge-zones">
  <div class="fb-gz fb-gz-danger">
    <div class="fb-gz-title">Below 70%</div>
    <div class="fb-gz-desc">Alarm signal. More than 3 in 10 bugs reach production. Investigate causes.</div>
  </div>
  <div class="fb-gz fb-gz-avg">
    <div class="fb-gz-title">70-85%</div>
    <div class="fb-gz-desc">Average level. A good starting point. There's room to grow.</div>
  </div>
  <div class="fb-gz fb-gz-good">
    <div class="fb-gz-title">85-95%</div>
    <div class="fb-gz-desc">Solid process. The question: what's hiding in those few percent that escape?</div>
  </div>
  <div class="fb-gz fb-gz-great">
    <div class="fb-gz-title">Above 95%</div>
    <div class="fb-gz-desc">Excellent score - but check if the data is complete. High DDR can be an artifact of incomplete data.</div>
  </div>
</div>

**Industry context matters.** In financial and medical systems 90%+ is a minimum, not an aspiration. In a fast-iterating startup, 80% at high release frequency may be a conscious, acceptable tradeoff.

## Why you can't start today - historical data

One of the most common mistakes when rolling out DDR: the team starts measuring from the current sprint and after a month has one data point. One. From which no conclusion can be drawn.

<blockquote class="fb-quote">DDR without history is like a map without a scale. You know you're somewhere - but you don't know which direction you're heading and how fast.</blockquote>

Before you start measuring "from now", do something much more valuable: **reconstruct data backwards.** Most organizations have all the data they need - nobody has just connected it in this specific way yet.

### Where to find historical data

<div class="fb-src-grid">
  <div class="fb-src-card">
    <div class="fb-src-name">Jira / tracker</div>
    <div class="fb-src-desc">Bug history with date and environment. Export to CSV + JQL by date and type.</div>
    <span class="fb-src-tag fb-src-primary">Main source</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Support tickets</div>
    <div class="fb-src-desc">Freshdesk, Zendesk, ServiceNow. Here live the problems that never made it to Jira.</div>
    <span class="fb-src-tag fb-src-secondary">Supplement</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Monitoring / alerts</div>
    <div class="fb-src-desc">PagerDuty, Datadog, Grafana. Incidents with exact timestamps.</div>
    <span class="fb-src-tag fb-src-secondary">Supplement</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Deployment history</div>
    <div class="fb-src-desc">Git tags, CI/CD pipeline, changelog. When each release shipped.</div>
    <span class="fb-src-tag fb-src-primary">Context</span>
  </div>
</div>

```jql
project = MYAPP AND issuetype = Bug AND created >= "2025-01-01"
ORDER BY created ASC
```

### Seasonality and patterns

With 12 months of data, you start seeing patterns your intuition won't catch.

<div class="fb-season-grid">
  <div class="fb-season-card">
    <div class="fb-season-title">Release seasonality</div>
    <div class="fb-season-desc">Release peaks before Q4, Black Friday, year-end. Knowing the rhythm - you plan testing capacity ahead, not putting out fires.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">Turnover and onboarding</div>
    <div class="fb-season-desc">A new QA catches fewer issues than a senior for the first two months. Without data you don't know if a DDR drop is a process problem or an onboarding effect.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">Feature type</div>
    <div class="fb-season-desc">New integrations, big refactors, new modules - DDR drops with specific change types. You can predict and direct testing effort.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">First-release pattern</div>
    <div class="fb-season-desc">The first deployment of the month statistically has more escaped bugs. Accumulated changes + production drift from the test state.</div>
  </div>
</div>

### Minimum viable approach - how to collect the data practically

<div class="fb-steps">
  <div class="fb-step"><div class="fb-step-num">1</div><div class="fb-step-body"><div class="fb-step-title">Export bugs from Jira to CSV</div><div class="fb-step-text">You need: ID, created date, environment (test/staging/prod), priority. JQL above + export.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">2</div><div class="fb-step-body"><div class="fb-step-title">Build a release table</div><div class="fb-step-text">Date + version number. If you don't have it collected - git tags or CI/CD history will give it to you.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">3</div><div class="fb-step-body"><div class="fb-step-title">Assign each bug to a release</div><div class="fb-step-text">Bug created between release A and B → pre-release for B. Bug after B and before C, reported through monitoring → escaped from B.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">4</div><div class="fb-step-body"><div class="fb-step-title">Calculate DDR per release and draw the chart</div><div class="fb-step-text">4-6 releases in one table. You have history, trend, and first patterns. This exercise takes 2-4 hours. Worth every minute.</div></div></div>
</div>

## Case study - from 74% to 94% in four quarters

A seven-person team (5 devs, QA, automation engineer), SaaS platform for enterprise customers. At the start of the year DDR 74% - three in ten bugs reach production.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">DDR - trend across four quarters</div>
      <div class="fb-chart-sub">Each quarter: one concrete process change</div>
    </div>
    <span class="fb-chart-badge">+20 pp. in a year</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>DDR (%)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#C8943A;border-radius:50%"></span>Process change</span>
  </div>
  <div class="fb-chart-canvas" style="height:220px"><canvas id="ddr-c-case" role="img" aria-label="Chart of DDR from 74% in Q1 to 94% in Q4."></canvas></div>
</div>

<div class="fb-timeline">
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#64748b">Q1</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Starting point</div>
      <div class="fb-tl-title">Diagnosis - before changing anything, they measured <span class="fb-tl-badge" style="background:#f1f5f9;color:#64748b">74%</span></div>
      <div class="fb-tl-text">An analysis of 6 months of history surfaced 3 clusters of escapees: payments API integration, reporting module edge cases, post-deployment configuration errors. Unit tests - beautiful. But none touched those areas.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#2563eb">Q2</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">First intervention</div>
      <div class="fb-tl-title">Contract tests + E2E expansion <span class="fb-tl-badge" style="background:#dbeafe;color:#1d4ed8">84%</span></div>
      <div class="fb-tl-text">Contract tests rolled out for the payments API, E2E expanded with reporting module scenarios. A 10pp jump in one quarter - just from knowing where they weren't testing.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#0A6B6F">Q3</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Process change</div>
      <div class="fb-tl-title">New definition of "done" <span class="fb-tl-badge" style="background:#D4EDEE;color:#0A6B6F">90%</span></div>
      <div class="fb-tl-text">No feature enters QA without a minimal set of integration tests written by the developer. QA stopped being the gatekeeper at the end - it became a partner throughout the sprint.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#2A7A3E">Q4</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Full picture</div>
      <div class="fb-tl-title">Monitoring incidents counted in the denominator <span class="fb-tl-badge" style="background:#F0FDF4;color:#2A7A3E">94%</span></div>
      <div class="fb-tl-text">A seemingly small change - support and monitoring incidents added to "post-release bugs". The number went up, but DDR held - because pre-release was growing in parallel. Now they had a <strong>full, credible picture</strong>.</div>
    </div>
  </div>
</div>

<blockquote class="fb-quote">"Every 5 percentage points of DDR is on average 4 fewer escaped bugs per quarter, at 8 hours each - that's 32 senior hours. Per quarter." - Budget approved.</blockquote>

## When DDR lies - three traps

Every metric has weaknesses. DDR has three specific ones - and it's worth knowing them before you start trusting it blindly.

<div class="fb-trap-grid">
  <div class="fb-trap-card" data-num="01">
    <div class="fb-trap-title">Incomplete "post-release" definition</div>
    <div class="fb-trap-text">If the counter only includes Jira tickets marked by QA - you underestimate escaped defects. What about support incidents? Monitoring alerts? Splunk errors? <strong>Incomplete denominator = inflated DDR = false excellence.</strong></div>
  </div>
  <div class="fb-trap-card" data-num="02">
    <div class="fb-trap-title">Code bugs ≠ all problems</div>
    <div class="fb-trap-text">Bad production config. A broken integration. A wrong feature flag. None of them is a "code bug" - but each one hit customers. If DDR measures only code defects - you're not measuring the whole risk. (More in article 3: Escaped Bugs &amp; Problems.)</div>
  </div>
  <div class="fb-trap-card" data-num="03">
    <div class="fb-trap-title">High DDR, but only on trivial bugs</div>
    <div class="fb-trap-text">You can have DDR 95% and regularly ship critical bugs - if your tests are great at catching typos but weak on critical business paths. That's why you should always pair DDR with priority distribution. If your 95% is mostly Medium and Low - go back to the weighted formula.</div>
  </div>
</div>

## DDR in business hands - the most dangerous trap

You won't find this trap in the ISTQB syllabus. And it's the most dangerous, because it touches not the measurement method but how it's interpreted by people who don't know the context.

Picture this: you show your Product Owner DDR 94%. They're happy. They say: *"great, we're safe, we're shipping."* But they don't know that in the same quarter the number of releases went from 3 to 10.

<div class="fb-table-wrap">
<table class="fb-danger-table">
  <thead><tr><th>Quarter</th><th>DDR</th><th>Releases</th><th>Escaped / Release</th><th>Escaped total</th></tr></thead>
  <tbody>
    <tr><td>Q1</td><td class="fb-ddr-good">88%</td><td>3</td><td>2.4</td><td class="fb-escaped-warn">7</td></tr>
    <tr><td>Q2</td><td class="fb-ddr-good">90%</td><td>5</td><td>2.1</td><td class="fb-escaped-bad">10</td></tr>
    <tr><td>Q3</td><td class="fb-ddr-good">92%</td><td>8</td><td>1.8</td><td class="fb-escaped-bad">14</td></tr>
    <tr><td>Q4</td><td class="fb-ddr-good">94%</td><td>10</td><td>1.2</td><td class="fb-escaped-warn">12</td></tr>
  </tbody>
</table>
</div>

DDR rises across all four quarters. Looks great. But the absolute count of escaped bugs grew through Q1-Q3. For three quarters the customer experienced **more** problems in production - despite rising DDR.

<div class="fb-warning-pill">⚠️ High DDR without context gives a false sense of safety</div>

**DDR never works alone.** It only fully makes sense alongside Escaped per Release (article 5) and Number of Releases (article 6). When presenting DDR to stakeholders - always show it with at least one context metric.

## How to roll out DDR in four steps

Enough theory. Here's what to do in the coming week.

<div class="fb-steps">
  <div class="fb-step"><div class="fb-step-num">1</div><div class="fb-step-body"><div class="fb-step-title">Define it and write it down</div><div class="fb-step-text">Answer three questions in writing: what counts as "pre-release bug" (all test environments? only staging?), what counts as "post-release bug" (only Jira? also monitoring and support?), what's the time window for "post-release" bugs (week? sprint? quarter?). Without this, DDR of two teams isn't comparable - even in the same organization.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">2</div><div class="fb-step-body"><div class="fb-step-title">Pick a data source</div><div class="fb-step-text"><strong>Ideally:</strong> Jira + monitoring (Datadog/PagerDuty) + support tickets. <strong>To start:</strong> Jira + a manual incident log in Google Sheets. Sounds primitive - it works. What matters is to start.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">3</div><div class="fb-step-body"><div class="fb-step-title">Set a measurement cadence</div><div class="fb-step-text"><strong>Per sprint</strong> - good start, fast feedback, lots of noise. <strong>Per release</strong> - more natural, better for trends and business reporting. Recommendation: per sprint internally, per release for stakeholders.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">4</div><div class="fb-step-body"><div class="fb-step-title">First presentation - start with the story</div><div class="fb-step-text">Don't start with Q1's DDR. Do a retroactive calculation for the last 3 quarters. A trend is a much stronger argument than a single point. *"Looking back at the last three quarters, our defect detection ratio looked like this: [chart]. The trend is rising - and I now want to settle how to keep improving it."*</div></div></div>
</div>

## DDR in conversation with the business

Three contexts. Three levels of detail. One indicator at the base of every conversation.

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">"This sprint's Defect Detection Ratio is 88% - that means 9 in 10 found issues were caught before reaching customers. One escaped and is already being addressed."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 with EM</span>
    <span class="fb-biz-text">"DDR trend over the last year is rising from 74% to 94%. Every percentage point is, in real terms, a few hours less on hotfixes. I want to propose a concrete change that should push it up another 3-4 points."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Board</span>
    <span class="fb-biz-text">"Over the past four quarters we improved pre-production defect detection effectiveness from 74% to 94%. That translated into a 60%+ drop in escaped bugs - I estimate this as 200+ saved senior hours per year."</span>
  </div>
</div>

## What DDR tells you - and what it doesn't

<div class="fb-summary-two-col">
  <div class="fb-sum-card fb-sum-yes">
    <div class="fb-sum-title">✓ DDR tells you</div>
    <ul class="fb-sum-list">
      <li>How effective your testing process is as a whole</li>
      <li>Whether you're improving over time (quarterly trend)</li>
      <li>Where the line is between what you catch and what escapes</li>
      <li>How to justify investment in automation or extra capacity</li>
    </ul>
  </div>
  <div class="fb-sum-card fb-sum-no">
    <div class="fb-sum-title">✗ DDR doesn't tell you</div>
    <ul class="fb-sum-list">
      <li>Whether the customer feels the improvement (without release count context)</li>
      <li>Where in the system bugs are escaping</li>
      <li>Whether the code reaching tests is good quality (that's Issues per Release)</li>
      <li>How fast and efficient your process is (that's a different metric)</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">Use DDR as one of the five letters of the alphabet. Together they form a word. Alone - they're just letters.</blockquote>

## In the next article

The third article in the series covers **Escaped Bugs &amp; Problems** - and it starts with a question most QA teams ask too rarely: are we really measuring *everything* that escapes to production?

Spoiler: almost never. And what we leave out is often more important than what we count.

## Series links

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business actually wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">QA metrics the business actually wants to hear - the complete guide</a></div>
        <div class="fb-s-sub">Diagnosis, three pillars, five metrics, QA → KPI mapping model</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title">Defect Detection Ratio - deep guide <span class="fb-s-now">reading now</span></div>
        <div class="fb-s-sub">Formula, thresholds, historical data, seasonality, traps, ready lines</div>
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
  --fb-red: #B03333;
  --fb-red-pale: #FEF2F2;
  --fb-green: #2A7A3E;
  --fb-green-pale: #F0FDF4;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-quote { background: var(--fb-surface); border-left: 3px solid var(--fb-gold); padding: 22px 26px; margin: 32px 0; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; }

.fb-dialogue { background: var(--fb-navy); border-radius: 12px; padding: 28px 30px; margin: 28px 0; }
.fb-d-line { display: flex; gap: 12px; margin-bottom: 14px; align-items: flex-start; }
.fb-d-line:last-child { margin-bottom: 0; }
.fb-d-who { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; min-width: 34px; padding-top: 3px; flex-shrink: 0; }
.fb-d-em { color: var(--fb-gold); }
.fb-d-qa { color: rgba(255,255,255,0.4); }
.fb-d-text { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.82); font-style: italic; }

.fb-formula-box { background: var(--fb-surface); border: 1.5px solid var(--fb-border); border-radius: 12px; padding: 24px 28px; margin: 22px 0; }
.fb-formula-box.fb-weighted { border-color: var(--fb-gold); background: var(--fb-gold-pale); }
.fb-f-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 12px; }
.fb-formula-box.fb-weighted .fb-f-label { color: var(--fb-gold); }
.fb-formula { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: var(--fb-navy); line-height: 1.5; }
.fb-formula-example { background: #fff; border: 1px solid var(--fb-border); border-radius: 8px; padding: 14px 16px; margin-top: 14px; font-family: 'Courier New', monospace; font-size: 14px; color: var(--fb-navy); }
.fb-formula-note { font-size: 12px; color: var(--fb-muted); margin-top: 12px; line-height: 1.55; }

.fb-table-wrap { margin: 24px 0; overflow-x: auto; }
.fb-w-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.fb-w-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: left; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-w-table td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); font-size: 13px; vertical-align: middle; }
.fb-w-table tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-pri { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; }
.fb-pri-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.fb-w-result { background: var(--fb-navy); color: #fff; padding: 14px 18px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 14px; margin: 10px 0 18px; }
.fb-alert-box { background: var(--fb-red-pale); border: 1.5px solid #FECACA; border-radius: 12px; padding: 20px 22px; margin: 20px 0; color: #7F1D1D; font-size: 14px; line-height: 1.6; }
.fb-alert-box strong { color: #991B1B; }

.fb-gauge-wrap { margin: 24px 0 8px; }
.fb-gauge-track { position: relative; height: 14px; border-radius: 8px; background: linear-gradient(90deg, #DC2626 0%, #F59E0B 35%, #3B82F6 65%, #16A34A 100%); }
.fb-gauge-markers { display: flex; justify-content: space-between; margin-top: 8px; }
.fb-gauge-mark { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.fb-gauge-pct { font-size: 11px; font-weight: 700; color: #111; }
.fb-gauge-label { font-size: 10px; color: var(--fb-faint); text-align: center; line-height: 1.3; max-width: 70px; }
:root[data-theme="dark"] .fb-article .fb-gauge-pct { color: #fff; }

.fb-calc-wrap { background: var(--fb-navy); border-radius: 16px; padding: 28px; margin: 24px 0; }
.fb-calc-title { font-family: Georgia, serif; font-size: 20px; font-weight: 500; color: #fff; margin-bottom: 4px; }
.fb-calc-sub { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 22px; }
.fb-calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
@media (max-width: 480px) { .fb-calc-grid { grid-template-columns: 1fr; } }
.fb-calc-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); display: block; margin-bottom: 8px; }
.fb-calc-field input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 12px 14px; font-size: 18px; font-weight: 700; color: #fff; font-family: Georgia, serif; outline: none; }
.fb-calc-field input:focus { border-color: var(--fb-gold); background: rgba(255,255,255,0.12); }
.fb-calc-toggle-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.fb-calc-toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
.fb-calc-toggle input { opacity: 0; width: 0; height: 0; }
.fb-calc-slider { position: absolute; inset: 0; border-radius: 24px; background: rgba(255,255,255,0.15); cursor: pointer; transition: background 0.2s; }
.fb-calc-slider::before { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.fb-calc-toggle input:checked + .fb-calc-slider { background: var(--fb-gold); }
.fb-calc-toggle input:checked + .fb-calc-slider::before { transform: translateX(18px); }
.fb-calc-toggle-label { font-size: 12px; color: rgba(255,255,255,0.6); }
.fb-calc-weights { display: none; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; margin-bottom: 18px; }
.fb-calc-weights.fb-active { display: block; }
.fb-weights-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
@media (max-width: 520px) { .fb-weights-grid { grid-template-columns: 1fr 1fr; } }
.fb-wf-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 5px; }
.fb-wf-row { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.fb-wf-row input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 7px 9px; font-size: 13px; font-weight: 700; color: #fff; text-align: center; outline: none; }
.fb-wf-mult { font-size: 11px; color: rgba(255,255,255,0.4); }
.fb-calc-result { background: rgba(255,255,255,0.06); border-radius: 12px; padding: 22px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.fb-cr-score { font-family: Georgia, serif; font-size: 3.2rem; font-weight: 500; line-height: 1; flex-shrink: 0; color: #6EE7B7; }
.fb-cr-info { flex: 1; min-width: 180px; }
.fb-cr-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 5px; }
.fb-cr-verdict { font-size: 14px; font-weight: 600; color: #A7F3D0; line-height: 1.4; }
.fb-cr-formula { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px; font-family: 'Courier New', monospace; }
.fb-calc-result.fb-cr-danger .fb-cr-score { color: #F87171; }
.fb-calc-result.fb-cr-danger .fb-cr-verdict { color: #FCA5A5; }
.fb-calc-result.fb-cr-avg .fb-cr-score { color: #FCD34D; }
.fb-calc-result.fb-cr-avg .fb-cr-verdict { color: #FDE68A; }
.fb-calc-result.fb-cr-good .fb-cr-score { color: #6EE7B7; }
.fb-calc-result.fb-cr-good .fb-cr-verdict { color: #6EE7B7; }
.fb-calc-result.fb-cr-great .fb-cr-score { color: #86EFAC; }
.fb-calc-result.fb-cr-great .fb-cr-verdict { color: #A7F3D0; }

.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-chart-canvas { position: relative; width: 100%; }
:root[data-theme="dark"] .fb-article .fb-chart-card { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-chart-title { color: #fff; }

.fb-gauge-zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-gz { border-radius: 10px; padding: 16px; font-size: 12px; }
.fb-gz-title { font-weight: 700; margin-bottom: 4px; font-size: 13px; }
.fb-gz-desc { color: var(--fb-muted); font-size: 12px; line-height: 1.5; }
.fb-gz-danger { background: var(--fb-red-pale); border: 1px solid #FECACA; }
.fb-gz-danger .fb-gz-title { color: #DC2626; }
.fb-gz-avg { background: #FFFBEB; border: 1px solid #FDE68A; }
.fb-gz-avg .fb-gz-title { color: #D97706; }
.fb-gz-good { background: var(--fb-teal-pale); border: 1px solid #99E6EA; }
.fb-gz-good .fb-gz-title { color: var(--fb-teal); }
.fb-gz-great { background: var(--fb-green-pale); border: 1px solid #BBF7D0; }
.fb-gz-great .fb-gz-title { color: var(--fb-green); }

.fb-src-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-src-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px 16px; }
.fb-src-name { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 4px; }
.fb-src-desc { font-size: 11px; color: var(--fb-muted); line-height: 1.5; }
.fb-src-tag { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; margin-top: 8px; }
.fb-src-primary { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-src-secondary { background: var(--fb-gold-pale); color: #7A4F0A; }

.fb-season-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 22px 0; }
.fb-season-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px; }
.fb-season-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-season-desc { font-size: 12px; color: var(--fb-muted); line-height: 1.55; }

.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 16px; margin-bottom: 18px; }
.fb-step-num { width: 34px; height: 34px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; margin-bottom: 6px; }

.fb-timeline { margin: 24px 0; }
.fb-tl-item { display: flex; gap: 18px; position: relative; }
.fb-tl-item::before { content: ''; position: absolute; left: 19px; top: 44px; bottom: -1px; width: 2px; background: var(--fb-border); }
.fb-tl-item:last-child::before { display: none; }
.fb-tl-dot { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 13px; font-weight: 500; color: #fff; z-index: 1; }
.fb-tl-body { padding-bottom: 24px; flex: 1; }
.fb-tl-q { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 5px; }
.fb-tl-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-tl-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; }
.fb-tl-badge { display: inline-block; font-family: Georgia, serif; font-size: 14px; font-weight: 500; padding: 3px 11px; border-radius: 6px; margin-left: 8px; vertical-align: middle; }

.fb-trap-grid { display: grid; gap: 14px; margin: 22px 0; }
.fb-trap-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; position: relative; overflow: hidden; }
.fb-trap-card::before { content: attr(data-num); position: absolute; right: 16px; top: 10px; font-family: Georgia, serif; font-size: 3rem; font-weight: 300; color: var(--fb-border); line-height: 1; }
.fb-trap-title { font-size: 14px; font-weight: 700; color: var(--fb-red); margin-bottom: 8px; position: relative; z-index: 1; }
.fb-trap-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; position: relative; z-index: 1; }

.fb-danger-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 10px; overflow: hidden; }
.fb-danger-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-danger-table th:first-child { text-align: left; }
.fb-danger-table td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; color: var(--fb-muted); }
.fb-danger-table td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-danger-table tr:last-child td { border-bottom: none; }
.fb-escaped-bad { color: #DC2626; font-weight: 700; }
.fb-escaped-warn { color: #D97706; font-weight: 700; }
.fb-ddr-good { color: var(--fb-green); font-weight: 700; }
.fb-warning-pill { display: inline-flex; align-items: center; gap: 8px; background: #DC2626; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; margin: 16px 0; }

.fb-biz-quotes { display: grid; gap: 14px; margin: 22px 0; }
.fb-biz-q { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px 22px; display: flex; gap: 16px; flex-wrap: wrap; }
.fb-biz-context { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); min-width: 80px; flex-shrink: 0; padding-top: 2px; }
.fb-biz-text { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #111; line-height: 1.6; flex: 1; min-width: 200px; }

.fb-summary-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 22px 0; }
@media (max-width: 520px) { .fb-summary-two-col { grid-template-columns: 1fr; } }
.fb-sum-card { border-radius: 12px; padding: 22px; }
.fb-sum-yes { background: var(--fb-green-pale); border: 1px solid #BBF7D0; }
.fb-sum-no { background: var(--fb-red-pale); border: 1px solid #FECACA; }
.fb-sum-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
.fb-sum-yes .fb-sum-title { color: var(--fb-green); }
.fb-sum-no .fb-sum-title { color: var(--fb-red); }
.fb-sum-list { list-style: none; padding: 0; margin: 0; }
.fb-sum-list li { font-size: 13px; color: var(--fb-muted); padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); line-height: 1.5; }
.fb-sum-list li:last-child { border-bottom: none; }

.fb-series { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 28px; margin: 28px 0; }
.fb-series-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-s-list { list-style: none; padding: 0; margin: 0; }
.fb-s-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--fb-border); }
.fb-s-item:last-child { border-bottom: none; }
.fb-s-num { font-family: Georgia, serif; font-size: 16px; font-weight: 500; color: var(--fb-navy); min-width: 22px; flex-shrink: 0; padding-top: 1px; }
.fb-s-current .fb-s-num { color: var(--fb-gold); }
.fb-s-title { font-size: 14px; font-weight: 600; color: #111; }
.fb-s-current .fb-s-title { color: var(--fb-gold); }
.fb-s-title a { color: inherit; text-decoration: none; border-bottom: 1px dashed var(--fb-border); }
.fb-s-title a:hover { color: var(--fb-gold); }
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: var(--fb-gold); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

:root[data-theme="dark"] .fb-article .fb-formula-box:not(.fb-weighted),
:root[data-theme="dark"] .fb-article .fb-src-card,
:root[data-theme="dark"] .fb-article .fb-season-card,
:root[data-theme="dark"] .fb-article .fb-trap-card,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-table-wrap { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-w-table th,
:root[data-theme="dark"] .fb-article .fb-w-table tr:last-child td,
:root[data-theme="dark"] .fb-article .fb-danger-table th { background: rgba(255,255,255,0.04); color: #ccc; }
:root[data-theme="dark"] .fb-article .fb-src-name,
:root[data-theme="dark"] .fb-article .fb-season-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-tl-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-formula-note,
:root[data-theme="dark"] .fb-article .fb-src-desc,
:root[data-theme="dark"] .fb-article .fb-season-desc,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-tl-text,
:root[data-theme="dark"] .fb-article .fb-tl-q,
:root[data-theme="dark"] .fb-article .fb-trap-text,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-s-sub,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-w-table td { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-formula-box:not(.fb-weighted) .fb-formula,
:root[data-theme="dark"] .fb-article .fb-s-num { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-danger-table td { color: #4a4a4a; }
:root[data-theme="dark"] .fb-article .fb-danger-table td:first-child { color: #111; }
</style>

<script is:inline data-astro-rerun>
(function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
  function ensureChart(cb) {
    if (typeof Chart !== 'undefined') { cb(); return; }
    var existing = document.querySelector('script[data-fb-chartjs]');
    if (existing) { existing.addEventListener('load', cb); return; }
    var s = document.createElement('script');
    s.src = CDN; s.async = true; s.setAttribute('data-fb-chartjs', '1');
    s.onload = cb;
    document.head.appendChild(s);
  }
  function mount(el, cfg) {
    if (!el) return;
    var prev = Chart.getChart(el);
    if (prev) prev.destroy();
    new Chart(el, cfg);
  }
  function getVerdict(pct) {
    if (pct >= 95) return { text: 'Excellent score - check data completeness', cls: 'fb-cr-great' };
    if (pct >= 85) return { text: "Solid process - what's hiding in the few that escape?", cls: 'fb-cr-good' };
    if (pct >= 70) return { text: "Average level - there's room to grow", cls: 'fb-cr-avg' };
    return { text: 'Alarm signal - investigate causes immediately', cls: 'fb-cr-danger' };
  }
  function initCalc() {
    var pre = document.getElementById('ddr-pre');
    var post = document.getElementById('ddr-post');
    var wMode = document.getElementById('ddr-weighted');
    var wPanel = document.getElementById('ddr-weights');
    var sc = document.getElementById('ddr-score');
    var ver = document.getElementById('ddr-verdict');
    var frm = document.getElementById('ddr-formula');
    var res = document.getElementById('ddr-result');
    if (!pre || !post || !sc) return;
    function val(id) { var e = document.getElementById(id); return e ? (parseFloat(e.value) || 0) : 0; }
    function calc() {
      var score, formula;
      if (wMode.checked) {
        var cp = val('ddr-wc-pre'), cq = val('ddr-wc-post');
        var hp = val('ddr-wh-pre'), hq = val('ddr-wh-post');
        var mp = val('ddr-wm-pre'), mq = val('ddr-wm-post');
        var lp = val('ddr-wl-pre'), lq = val('ddr-wl-post');
        var wp = cp*4 + hp*2 + mp*1 + lp*0.5;
        var wq = cq*4 + hq*2 + mq*1 + lq*0.5;
        score = (wp + wq === 0) ? 0 : (wp / (wp + wq)) * 100;
        formula = wp.toFixed(1) + ' ÷ (' + wp.toFixed(1) + ' + ' + wq.toFixed(1) + ') = ' + score.toFixed(1) + '% [weighted]';
      } else {
        var p = parseFloat(pre.value) || 0, q = parseFloat(post.value) || 0;
        score = (p + q === 0) ? 0 : (p / (p + q)) * 100;
        formula = p + ' ÷ (' + p + ' + ' + q + ') = ' + score.toFixed(1) + '%';
      }
      var v = getVerdict(score);
      sc.textContent = score.toFixed(1) + '%';
      ver.textContent = v.text;
      frm.textContent = formula;
      res.className = 'fb-calc-result ' + v.cls;
    }
    wMode.addEventListener('change', function () { wPanel.classList.toggle('fb-active', wMode.checked); calc(); });
    [pre, post].concat(Array.from(document.querySelectorAll('.fb-calc-weights input'))).forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
  function initChart() {
    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    mount(document.getElementById('ddr-c-case'), {
      type: 'line',
      data: {
        labels: ['Q1 - Start', 'Q2 - Contract tests', 'Q3 - Def. of Done', 'Q4 - Full monitoring'],
        datasets: [{
          data: [74, 84, 90, 94],
          borderColor: '#2A7A3E',
          backgroundColor: 'rgba(42,122,62,0.1)',
          borderWidth: 3,
          pointBackgroundColor: ['#64748B', '#2563EB', '#0A6B6F', '#2A7A3E'],
          pointRadius: 8, pointHoverRadius: 10,
          fill: true, tension: 0.35
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return '  DDR: ' + c.raw + '%'; },
              afterLabel: function (c) {
                var notes = ['6-month history diagnosis', 'Contract tests + E2E', 'New definition of done', 'Incidents in denominator'];
                return '  → ' + notes[c.dataIndex];
              }
            }
          }
        },
        scales: {
          y: { min: 60, max: 100, ticks: { callback: function (v) { return v + '%'; }, stepSize: 10 }, grid: { color: grid }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }
  function boot() { initCalc(); ensureChart(initChart); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
