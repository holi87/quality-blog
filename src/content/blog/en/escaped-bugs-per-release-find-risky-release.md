---
title: "Escaped Bugs per Release - find the risky release"
description: "How to detect an escaped-bug spike in a single release, run a 5-question investigation and put prevention in place. Escaped per Release vs the overall Escaped Rate. Article 5 of 9."
date: 2026-06-16
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 5 of 9</p>

<p class="fb-lead">Quarterly review. Beautiful numbers on the slide. Escaped Rate: 1.8%. A downward trend for three quarters. Everyone happy. Until someone asked: "So which release exactly was the problem in Q3?"</p>

<div class="fb-review">
  <div class="fb-rv-header">
    <span class="fb-rv-title">Quarterly Business Review · Q3</span>
    <span class="fb-rv-badge">Escaped Rate: 1.8% ↓</span>
  </div>
  <div class="fb-rv-metrics">
    <div class="fb-rv-metric"><div class="fb-rv-val good">1.8%</div><div class="fb-rv-label">Escaped Rate Q3</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val">8</div><div class="fb-rv-label">Releases in Q3</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val">11</div><div class="fb-rv-label">Total escaped</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val good">~1.4</div><div class="fb-rv-label">Average per release</div></div>
  </div>
  <div class="fb-su-line"><span class="fb-su-who em">PM</span><span class="fb-su-msg">"Good result. But I remember that payments-module incident in August - was that our release?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg"><em>opens the per-release table...</em></span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg alert">"v3.4 - 7 escaped bugs. The other 7 releases combined: 4."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">PM</span><span class="fb-su-msg">"So one release accounted for 64% of the quarter's problems. And the report didn't say a word about it."</span></div>
</div>

The overall Escaped Rate doesn't lie. It just hides. **One catastrophic release dissolves into the average of the other seven.** And that's exactly why you need Escaped Bugs per Release - the metric that looks at every release individually.

## Escaped Rate vs Escaped per Release - what each one sees

These are not two versions of the same metric. They are two completely different levels of vision. And you need both - but with full awareness of what each one tells you, and what it doesn't.

<div class="fb-cc-grid">
  <div class="fb-cc-panel cc-rate">
    <span class="fb-cc-tag">Overall Escaped Rate</span>
    <div class="fb-cc-formula">Rate = Total escaped ÷ (Escaped + Pre-release) × 100%</div>
    <div class="fb-cc-title">Says: how effective we are overall</div>
    <div class="fb-cc-desc">Quarterly trend, industry benchmark, an argument for the board. Good for high-level reporting and comparing quarters.</div>
    <div class="fb-cc-verdict">⚠️ Doesn't show which releases were risky. A single spike gets lost in the average.</div>
  </div>
  <div class="fb-cc-panel cc-per">
    <span class="fb-cc-tag">Escaped per Release</span>
    <div class="fb-cc-formula">EpR = Escaped bugs attributed to a specific release</div>
    <div class="fb-cc-title">Says: which release was risky</div>
    <div class="fb-cc-desc">Incident diagnosis, pattern hunting, a causes conversation with your EM. Good for identifying problems and preventive action.</div>
    <div class="fb-cc-verdict ok">✓ Every release gets its own score. A spike is visible immediately.</div>
  </div>
</div>

### The same quarter - two completely different diagnoses

The table below shows how aggregation hides the real picture. Overall Escaped Rate: 1.8% - looks good. But broken down per release, a completely different story emerges.

<table class="fb-ht">
  <thead>
    <tr><th>Release</th><th>Escaped bugs</th><th>EpR</th><th>Verdict</th></tr>
  </thead>
  <tbody>
    <tr><td>v3.1</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elite</td></tr>
    <tr><td>v3.2</td><td class="val-good">1</td><td class="val-good">0.2</td><td class="val-good">Elite</td></tr>
    <tr><td>v3.3</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elite</td></tr>
    <tr class="fb-spike-row"><td>v3.4 <span class="fb-spike-badge">SPIKE</span></td><td class="val-bad">7</td><td class="val-bad">2.8</td><td class="val-bad">Alarm</td></tr>
    <tr><td>v3.5</td><td class="val-good">1</td><td class="val-good">0.3</td><td class="val-good">Good</td></tr>
    <tr><td>v3.6</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elite</td></tr>
    <tr><td>v3.7</td><td class="val-good">1</td><td class="val-good">0.2</td><td class="val-good">Elite</td></tr>
    <tr><td>v3.8</td><td class="val-good">1</td><td class="val-good">0.3</td><td class="val-good">Good</td></tr>
    <tr><td><strong>Q3 total</strong></td><td><strong>11</strong></td><td><strong>1.4 avg</strong></td><td class="val-warn">Hidden catastrophe</td></tr>
  </tbody>
</table>

The overall Rate for the whole quarter: **1.8% - "looks good"**. And one release accounted for 64% of the problems.

## How much is too much - the thresholds

EpR is a close cousin of the industry's most recognizable stability metric - **Change Failure Rate** from the DORA research. CFR asks: what percentage of deployments cause problems in production? EpR asks: how many problems exactly did each deployment bring? In DORA terminology, a release with at least one escaped bug is a "failed change".

It's worth knowing the current context: the DORA 2025 report moved away from the classic Elite/High/Medium/Low levels toward seven team archetypes, and the bar for top performance was raised - the best teams keep CFR in the 0-2% range, which only about 17% of organizations achieve. The term "elite" is still widely used across the industry as shorthand - and that's how I use it below - but be aware that formally DORA speaks a different language today.

Thresholds for Escaped Bugs per Release, calibrated to those standards:

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-range">&lt;0.5</div>
    <div class="fb-tc-label">Elite</div>
    <div class="fb-tc-desc">High-performing teams. The vast majority of releases ship with zero escaped bugs. Sporadic single incidents.</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-range">0.5-1.5</div>
    <div class="fb-tc-label">Good</div>
    <div class="fb-tc-desc">A mature process. An occasional escaped bug, quickly detected and fixed. No recurring pattern.</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-range">1.5-3.0</div>
    <div class="fb-tc-label">Needs attention</div>
    <div class="fb-tc-desc">Visible process problems. Customers regularly feel the impact. Root-cause analysis needed.</div>
  </div>
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-range">&gt;3.0</div>
    <div class="fb-tc-label">Alarm signal</div>
    <div class="fb-tc-desc">Every such release is an incident that requires a post-mortem. Immediate process intervention.</div>
  </div>
</div>

<blockquote class="fb-quote">For teams in an enterprise environment with regular releases every 1-2 weeks - the target is below 0.5 escaped bugs per release. Above 1.5 is a signal that something is systemically broken.</blockquote>

## The spike you see right away

The Escaped per Release chart immediately reveals what the aggregate statistic hides. One glance - and you know which release needs an investigation.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped Bugs per Release - per-release view</div>
      <div class="fb-chart-sub">v3.4 visible instantly. The overall average: 1.4 - it would look innocent.</div>
    </div>
    <span class="fb-chart-badge red">Spike: v3.4 = 2.8</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>Escaped per Release</span>
    <span class="fb-lg"><span class="fb-ld" style="background:rgba(200,148,58,.4);border:1px dashed #C8943A"></span>Elite threshold (&lt;0.5)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:rgba(176,51,51,.2);border:1px dashed #B03333"></span>Alarm threshold (3.0)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-epr" role="img" aria-label="Bar chart: Escaped per Release across 8 releases. All below 0.3 except v3.4, which jumps to 2.8 and is highlighted in red."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped per Release vs overall Escaped Rate - the same story</div>
      <div class="fb-chart-sub">Rate aggregates and smooths. EpR reveals anomalies. You need both perspectives.</div>
    </div>
    <span class="fb-chart-badge">two perspectives</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Escaped per Release (count)</span>
    <span class="fb-lg"><span style="width:16px;height:0;border-top:2.5px dashed #0A6B6F;display:inline-block;"></span>Overall Escaped Rate (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-compare" role="img" aria-label="Combo chart: EpR bars per release plus a line of the running overall Escaped Rate. The Rate line smooths the v3.4 spike away, while the EpR bar shows it clearly."></canvas>
  </div>
</div>

<div class="fb-dark-box">
  <span class="fb-db-eyebrow">Investigation framework</span>
  <h2 class="fb-db-h">5 questions you ask after every spike</h2>
  <p class="fb-db-intro">A spike by itself is not a problem - it's a signal. The real problem starts when the spike gets logged as an "anomaly" and nobody looks for the cause. Here are five questions that always lead to an answer.</p>
  <p class="fb-db-intro"><strong>Three rules before you start, taken straight from SRE culture.</strong> First - the investigation is <strong>blameless</strong>. We ask "how did the system allow this bug?", never "who is at fault?". A team afraid of blame stops telling the truth - and without truth there is no diagnosis. Second - we look for <strong>contributing factors, not a single root cause</strong>. Complex systems fail through several interacting conditions at once; "one cause" is almost always a simplification that loses the rest of the picture. Third - we run the investigation <strong>within 48 hours</strong> of detecting the spike, while the context is still fresh in the team's heads.</p>
  <div class="fb-q-grid">
    <div class="fb-q-card">
      <div class="fb-q-num">1</div>
      <div>
        <div class="fb-q-question">What was different about this release compared to the previous ones?</div>
        <div class="fb-q-why">A spike is rarely accidental. Something changed - in the code, the process, the team or the environment. The first question is always: what was different?</div>
        <div class="fb-q-signals"><span class="fb-q-signal">New module or technology</span><span class="fb-q-signal">Team composition change</span><span class="fb-q-signal">Schedule change</span><span class="fb-q-signal">External integration</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">2</div>
      <div>
        <div class="fb-q-question">What type of bugs dominated - functional, configuration, integration?</div>
        <div class="fb-q-why">The type breakdown (from article 3) points to where to look for the cause. A dominance of configuration bugs suggests an environment problem, not code quality.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Code → dev process</span><span class="fb-q-signal">Configuration → DevOps</span><span class="fb-q-signal">Integration → architecture</span><span class="fb-q-signal">Regression → tests</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">3</div>
      <div>
        <div class="fb-q-question">Did QA have enough time and access to the environment?</div>
        <div class="fb-q-why">A spike under deadline pressure is not a coincidence. If the testing window shrank by 40% - and 40% more bugs reached production - that's a simple correlation worth showing your PM.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Testing time vs the previous release</span><span class="fb-q-signal">Test environment stability</span><span class="fb-q-signal">Staging availability</span><span class="fb-q-signal">Code delivery delays</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">4</div>
      <div>
        <div class="fb-q-question">Were the bugs in areas covered by automated tests?</div>
        <div class="fb-q-why">If the escaped bugs lived in modules with 90% automated coverage - the problem is the quality of the tests, not their number. If they were in uncovered areas - that's a signal to fill the gap.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Coverage map vs bug location</span><span class="fb-q-signal">Last test update for that module</span><span class="fb-q-signal">Flaky tests in that area</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">5</div>
      <div>
        <div class="fb-q-question">Have you seen a similar spike before - and what helped then?</div>
        <div class="fb-q-why">Your EpR history is your biggest asset. If the spike in v2.8 had the same profile as the spike in v3.4 - and a code review checkpoint solved it back then - you have a ready-made corrective action.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Previous spikes in your EpR history</span><span class="fb-q-signal">What was done after the last spike</span><span class="fb-q-signal">Whether the corrective action was kept up</span></div>
      </div>
    </div>
  </div>
</div>

## Interactive spike detector

Enter the Escaped per Release values from your last 6 releases. The detector automatically flags spikes and tells you which release needs an investigation.

<div class="fb-det-wrap">
  <div class="fb-det-title">EpR spike detector</div>
  <div class="fb-det-sub">Enter the number of escaped bugs per release - the spike threshold uses the IQR method (Tukey): Q3 + 1.5 × IQR</div>
  <div class="fb-det-inputs" id="fb-det-inputs">
    <div class="fb-det-field"><label for="fb-det-v1">v1</label><input id="fb-det-v1" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v2">v2</label><input id="fb-det-v2" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v3">v3</label><input id="fb-det-v3" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v4">v4</label><input id="fb-det-v4" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v5">v5</label><input id="fb-det-v5" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v6">v6</label><input id="fb-det-v6" type="number" min="0" step="0.1" placeholder="0.0"></div>
  </div>
  <div class="fb-det-result">
    <div class="fb-det-item"><div class="fb-det-label">EpR median</div><div class="fb-det-val" id="fb-det-median">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">EpR average</div><div class="fb-det-val" id="fb-det-avg">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">Spike threshold</div><div class="fb-det-val" id="fb-det-thresh">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">Spikes</div><div class="fb-det-val" id="fb-det-spikes">-</div></div>
    <div class="fb-det-status" id="fb-det-status">Enter your data</div>
  </div>
</div>

## From diagnosis to prevention - how to use spikes

A spike identified and investigated is half the battle. The other half is turning the findings into actions that make sure history doesn't repeat itself.

### How to roll it out from scratch

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Collect historical EpR - at least the last 6 releases</div>
      <div class="fb-step-text">Attribute every escaped bug (from Jira, monitoring, support) to the specific release that introduced it - not to the date it was detected. That's the key difference. A bug found in week 3 after the release still belongs to that release.</div>
      <div class="fb-step-text">Even approximate data going 2-3 months back gives you a first trend and identifies historical spikes.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Set the spike threshold with the IQR method - the statistical standard</div>
      <div class="fb-step-text">The industry standard for outlier detection is Tukey's method based on the interquartile range: <strong>threshold = Q3 + 1.5 × IQR</strong>, where Q3 is the 75th percentile and IQR is the difference between the 75th and 25th percentiles of your EpR data. The method is robust against the spikes themselves - unlike mean-based thresholds, which a single spike can heavily inflate.</div>
      <div class="fb-step-text">With few releases (fewer than 8-10 data points) treat the result as indicative - and update the threshold quarterly, because as the team matures, the distribution tightens and the threshold becomes more demanding.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Introduce a blameless post-mortem for every spike - 30 minutes, within 48h</div>
      <div class="fb-step-text">It doesn't have to be a multi-hour meeting. A 30-minute retrospective with the 5 questions from the framework above - run within 48 hours of detection, while the context is fresh. The overriding rule: <strong>blameless</strong> - we analyze the system and the process, not people. If you need a deeper causal technique, the classic Five Whys (keep asking "why" until you reach a systemic cause) works great in this format.</div>
      <div class="fb-step-text">The post-mortem output is a list of contributing factors plus action items - each with an owner and a deadline. The document goes into the team archive: when the next spike appears, you start by checking whether the cause profile is already known.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Flag "high-risk" releases ahead of time</div>
      <div class="fb-step-text">After a few months of data you'll start seeing patterns: new technologies → higher risk. Onboarding a developer → higher risk. Deadline pressure → higher risk. Use those patterns for a pre-mortem before the release - don't wait for a spike to react.</div>
    </div>
  </div>
</div>

### Four preventive actions - when to use each

<div class="fb-prev-grid">
  <div class="fb-prev-card">
    <div class="fb-prev-icon">🔍</div>
    <div class="fb-prev-title">Pre-mortem before a risky release</div>
    <div class="fb-prev-desc">Ask "what could go wrong?" before the deployment, not after. Especially for releases with new integrations or architecture changes.</div>
    <div class="fb-prev-when">When: before every "big" release</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">📋</div>
    <div class="fb-prev-title">Release risk checklist</div>
    <div class="fb-prev-desc">A simple list of questions to fill in before each release: new developer? new integration? shortened testing window? Every "yes" raises the risk category.</div>
    <div class="fb-prev-when">When: every release, 5 minutes</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">🐤</div>
    <div class="fb-prev-title">Canary deployment for high risk</div>
    <div class="fb-prev-desc">Release to 5-10% of traffic before the full rollout. EpR for that window is an early signal - you can roll back before the problem reaches all customers.</div>
    <div class="fb-prev-when">When: EpR historically &gt; 1.5 for similar releases</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">⏱️</div>
    <div class="fb-prev-title">Post-deploy monitoring window</div>
    <div class="fb-prev-desc">The first 2 hours after deployment - active monitoring with lower alert thresholds. A large share of EpR spikes is detected exactly in this window.</div>
    <div class="fb-prev-when">When: always, automatically</div>
  </div>
</div>

## EpR in the business conversation

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">"This release ended with 0 escaped bugs - elite-level EpR. The previous v3.4 was a spike with an EpR of 2.8. We ran a post-mortem and introduced a code review checkpoint. The result is already visible in this release."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 with EM</span>
    <span class="fb-biz-text">"The overall Escaped Rate looks good - 1.8%. But per release you can see that one release accounted for 64% of the quarter's problems. I have a hypothesis about the cause and a proposal for a corrective action."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Board</span>
    <span class="fb-biz-text">"We introduced per-release EpR monitoring. In Q4 we identified two spikes, ran a post-mortem for both and implemented corrective actions. Average EpR dropped from 1.4 to 0.4 - elite level. All Q4 releases below the 0.5 threshold."</span>
  </div>
</div>

## What EpR gives you that the overall Rate doesn't

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">✓ EpR gives you</div>
    <ul class="fb-sum-list">
      <li>Identification of the specific risky release - not an averaged statistic</li>
      <li>A starting point for a causal investigation (5 questions)</li>
      <li>Historical patterns for predicting risky releases</li>
      <li>A measurable effect of corrective actions per release</li>
      <li>An argument in the PM conversation about testing time and conditions</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">✗ EpR does not replace</div>
    <ul class="fb-sum-list">
      <li>The overall Escaped Rate - for the quarterly trend and industry benchmarks</li>
      <li>DDR - for evaluating the effectiveness of the testing process</li>
      <li>Issues per Release - for the maturity of the code entering testing</li>
      <li>Number of Releases - without release-count context, EpR loses its scale</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">A spike is not a problem - it's a signal. The problem starts when the spike gets logged as an "anomaly" and nobody looks for the cause. EpR gives you the tool to change that.</blockquote>

## In the next article

Article six covers **Number of Releases** - the metric most teams ignore completely. And without it, every other metric in this series loses its scale and comparability.

You'll learn why 3 escaped bugs across 2 releases is a crisis, while 3 escaped bugs across 15 releases is a success - and how to use this metric as the common denominator for the whole series.

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">The complete guide</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/en/blog/defect-detection-ratio-measure-qa-effectiveness/">Defect Detection Ratio</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-problems-full-spectrum/">Escaped Bugs &amp; Problems</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/en/blog/issues-per-release-code-maturity-metric/">Issues per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Rollout from scratch, the link to the development process, the EM conversation</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">05</span><div><div class="fb-s-title">Escaped Bugs per Release <span class="fb-s-now">you are here</span></div><div class="fb-s-sub">Spike detection, the investigation framework, preventive actions</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">06</span><div><div class="fb-s-title">Number of Releases - the context metric</div><div class="fb-s-sub">Why 3 bugs with 2 releases is a disaster, and with 15 - a success</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">07</span><div><div class="fb-s-title">Release Confidence Score step by step</div><div class="fb-s-sub">Three calculation models, rollout, concrete examples from practice</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">08</span><div><div class="fb-s-title">Storytelling with metrics - building a narrative</div><div class="fb-s-sub">How to turn a table of numbers into a business argument</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">09</span><div><div class="fb-s-title">3 anti-patterns that destroy QA credibility</div><div class="fb-s-sub">Too many metrics, no context, jargon - and how to avoid each</div></div></li>
  </ul>
</div>

</div>

<style is:inline>
.fb-article {
  --fb-navy: #0E1F3D;
  --fb-navy-deep: #071628;
  --fb-gold: #C8943A;
  --fb-gold-pale: #F6EDDA;
  --fb-teal: #0A6B6F;
  --fb-teal-pale: #D4EDEE;
  --fb-surface: #F8F6F2;
  --fb-border: #E8E4DC;
  --fb-muted: #5C5C5C;
  --fb-faint: #767676;
  --fb-red: #B03333;
  --fb-green: #2A7A3E;
  --fb-amber: #B45309;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-quote { background: var(--fb-surface); border-left: 3px solid var(--fb-gold); padding: 22px 26px; margin: 32px 0; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; }

/* REVIEW SCENE */
.fb-review { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 26px 28px; margin: 28px 0; }
.fb-rv-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.fb-rv-title { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); }
.fb-rv-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #F0FDF4; color: var(--fb-green); }
.fb-rv-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px; }
.fb-rv-metric { background: #fff; border: 1px solid var(--fb-border); border-radius: 8px; padding: 12px 14px; text-align: center; }
.fb-rv-val { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: var(--fb-navy); line-height: 1; }
.fb-rv-val.good { color: var(--fb-green); }
.fb-rv-label { font-size: 10px; color: var(--fb-faint); margin-top: 3px; }
.fb-su-line { display: flex; gap: 14px; margin-bottom: 12px; align-items: flex-start; }
.fb-su-line:last-child { margin-bottom: 0; }
.fb-su-who { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 48px; padding-top: 3px; flex-shrink: 0; color: var(--fb-faint); }
.fb-su-who.em { color: var(--fb-navy); }
.fb-su-who.qa { color: var(--fb-teal); }
.fb-su-msg { font-size: 14px; line-height: 1.6; color: #111; }
.fb-su-msg em { font-style: italic; color: var(--fb-muted); }
.fb-su-msg.alert { color: var(--fb-red); font-weight: 600; }

/* COMPARE */
.fb-cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
@media (max-width: 560px) { .fb-cc-grid { grid-template-columns: 1fr; } }
.fb-cc-panel { border-radius: 12px; padding: 22px; border: 2px solid; }
.fb-cc-panel.cc-rate { border-color: var(--fb-border); background: var(--fb-surface); }
.fb-cc-panel.cc-per { border-color: var(--fb-navy); background: #EFF6FF; }
.fb-cc-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 14px; }
.cc-rate .fb-cc-tag { background: #E5E1D8; color: #4a4a4a; }
.cc-per .fb-cc-tag { background: var(--fb-navy); color: #fff; }
.fb-cc-formula { font-family: 'Courier New', monospace; font-size: 12px; color: var(--fb-navy); background: #fff; border: 1px solid var(--fb-border); border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; line-height: 1.6; }
.cc-per .fb-cc-formula { background: var(--fb-navy); color: #93C5FD; border-color: var(--fb-navy); }
.fb-cc-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-cc-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-cc-verdict { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; background: #E5E1D8; color: #4a4a4a; }
.fb-cc-verdict.ok { background: rgba(14,31,61,0.08); color: var(--fb-navy); font-weight: 500; }

/* HIDDEN SPIKE TABLE */
.fb-ht { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
.fb-ht th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-ht th:first-child { text-align: left; }
.fb-ht td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; }
.fb-ht td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-ht tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-ht .val-good { color: var(--fb-green); font-weight: 700; }
.fb-ht .val-warn { color: var(--fb-amber); font-weight: 700; }
.fb-ht .val-bad { color: var(--fb-red); font-weight: 700; }
.fb-spike-row td { background: #FEF2F2 !important; }
.fb-spike-badge { display: inline-block; background: var(--fb-red); color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; margin-left: 6px; vertical-align: middle; }

/* THRESHOLDS */
.fb-thresh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-thresh-card { border-radius: 12px; padding: 16px; text-align: center; border: 1.5px solid; }
.fb-thresh-card.tc-danger { background: #FEF2F2; border-color: #FECACA; }
.fb-thresh-card.tc-warn { background: #FFFBEB; border-color: #FDE68A; }
.fb-thresh-card.tc-good { background: var(--fb-teal-pale); border-color: #99E6EA; }
.fb-thresh-card.tc-great { background: #F0FDF4; border-color: #BBF7D0; }
.fb-tc-range { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; line-height: 1; margin-bottom: 6px; }
.fb-thresh-card.tc-danger .fb-tc-range { color: #DC2626; }
.fb-thresh-card.tc-warn .fb-tc-range { color: var(--fb-amber); }
.fb-thresh-card.tc-good .fb-tc-range { color: var(--fb-teal); }
.fb-thresh-card.tc-great .fb-tc-range { color: var(--fb-green); }
.fb-tc-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
.fb-thresh-card.tc-danger .fb-tc-label { color: #DC2626; }
.fb-thresh-card.tc-warn .fb-tc-label { color: var(--fb-amber); }
.fb-thresh-card.tc-good .fb-tc-label { color: var(--fb-teal); }
.fb-thresh-card.tc-great .fb-tc-label { color: var(--fb-green); }
.fb-tc-desc { font-size: 11px; color: #444; line-height: 1.4; }

/* CHARTS */
.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-badge.red { background: #FEF2F2; color: var(--fb-red); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-chart-canvas { position: relative; width: 100%; }

/* DARK BOX (INVESTIGATION) */
.fb-dark-box { background: var(--fb-navy); border-radius: 16px; padding: 36px 34px; margin: 36px 0; }
.fb-db-eyebrow { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 10px; }
.fb-db-h { font-family: Georgia, serif; color: #fff !important; margin: 0 0 10px; font-size: 1.5rem; font-weight: 500; line-height: 1.2; }
.fb-db-intro { color: rgba(255,255,255,0.78) !important; font-size: 15px; margin-bottom: 20px; }
.fb-db-intro strong { color: #E6F1FB; }
.fb-q-grid { display: grid; gap: 12px; }
.fb-q-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; }
.fb-q-num { font-family: Georgia, serif; font-size: 1.6rem; font-weight: 500; color: var(--fb-gold); line-height: 1; flex-shrink: 0; min-width: 28px; }
.fb-q-question { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fb-q-why { font-size: 12px; color: rgba(255,255,255,0.65); line-height: 1.55; margin-bottom: 8px; }
.fb-q-signals { display: flex; flex-wrap: wrap; gap: 6px; }
.fb-q-signal { font-size: 11px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); padding: 3px 9px; border-radius: 6px; }

/* DETECTOR */
.fb-det-wrap { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 28px 0; }
.fb-det-title { font-family: Georgia, serif; font-size: 18px; font-weight: 500; margin-bottom: 6px; color: #111; }
.fb-det-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 22px; }
.fb-det-inputs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; }
@media (max-width: 500px) { .fb-det-inputs { grid-template-columns: repeat(3, 1fr); } }
.fb-det-field label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); display: block; margin-bottom: 5px; text-align: center; }
.fb-det-field input { width: 100%; border: 1px solid var(--fb-border); border-radius: 8px; padding: 9px 6px; font-size: 14px; font-weight: 700; font-family: Georgia, serif; color: #111; background: #fff; outline: none; text-align: center; transition: border-color 0.2s; }
.fb-det-field input:focus { border-color: var(--fb-gold); }
.fb-det-field input.spike { border-color: var(--fb-red); background: #FEF2F2; }
.fb-det-result { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 18px 20px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; }
.fb-det-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 3px; }
.fb-det-val { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 500; color: var(--fb-navy); }
.fb-det-status { font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 8px; background: var(--fb-surface); color: var(--fb-muted); }
.fb-det-status.clean { background: #F0FDF4; color: var(--fb-green); }
.fb-det-status.warn { background: #FFFBEB; color: var(--fb-amber); }
.fb-det-status.spike { background: #FEF2F2; color: var(--fb-red); }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 18px; margin-bottom: 20px; }
.fb-step:last-child { margin-bottom: 0; }
.fb-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-body { flex: 1; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }
.fb-step-text + .fb-step-text { margin-top: 8px; }

/* PREVENTION */
.fb-prev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 22px 0; }
.fb-prev-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; }
.fb-prev-icon { font-size: 22px; margin-bottom: 10px; }
.fb-prev-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-prev-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-prev-when { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7a4f0a; margin-top: 10px; }

/* BIZ QUOTES */
.fb-biz-quotes { display: grid; gap: 14px; margin: 22px 0; }
.fb-biz-q { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px 22px; display: flex; gap: 16px; flex-wrap: wrap; }
.fb-biz-context { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); min-width: 80px; flex-shrink: 0; padding-top: 2px; }
.fb-biz-text { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #111; line-height: 1.6; flex: 1; min-width: 200px; }

/* SUMMARY TWO */
.fb-sum-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 22px 0; }
@media (max-width: 520px) { .fb-sum-two { grid-template-columns: 1fr; } }
.fb-sum-card { border-radius: 12px; padding: 20px; }
.fb-sum-card.sum-yes { background: #F0FDF4; border: 1px solid #BBF7D0; }
.fb-sum-card.sum-no { background: #FEF2F2; border: 1px solid #FECACA; }
.fb-sum-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
.fb-sum-card.sum-yes .fb-sum-title { color: var(--fb-green); }
.fb-sum-card.sum-no .fb-sum-title { color: var(--fb-red); }
.fb-sum-list { list-style: none; padding: 0; margin: 0; }
.fb-sum-list li { font-size: 13px; color: #444; padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); line-height: 1.5; display: flex; gap: 8px; align-items: flex-start; }
.fb-sum-list li:last-child { border-bottom: none; }
.fb-sum-list li::before { content: ''; flex-shrink: 0; margin-top: 7px; width: 6px; height: 6px; border-radius: 50%; }
.fb-sum-card.sum-yes .fb-sum-list li::before { background: var(--fb-green); }
.fb-sum-card.sum-no .fb-sum-list li::before { background: var(--fb-red); }

/* SERIES */
.fb-series { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 28px; margin: 28px 0; }
.fb-series-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-s-list { list-style: none; padding: 0; margin: 0; }
.fb-s-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--fb-border); }
.fb-s-item:last-child { border-bottom: none; }
.fb-s-num { font-family: Georgia, serif; font-size: 16px; font-weight: 500; color: var(--fb-navy); min-width: 22px; flex-shrink: 0; padding-top: 1px; }
.fb-s-current .fb-s-num { color: var(--fb-gold); }
.fb-s-done .fb-s-num { color: var(--fb-teal); }
.fb-s-title { font-size: 14px; font-weight: 600; color: #111; }
.fb-s-current .fb-s-title { color: var(--fb-gold); }
.fb-s-done .fb-s-title { color: var(--fb-muted); }
.fb-s-title a { color: inherit; text-decoration: none; border-bottom: 1px dashed var(--fb-border); transition: color 0.15s; }
.fb-s-title a:hover { color: var(--fb-gold); border-bottom-color: var(--fb-gold); }
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: var(--fb-gold); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }
.fb-s-badge-done { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-teal-pale); color: var(--fb-teal); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

/* DARK MODE - load-bearing contrast fixes (source design is light-only) */
:root[data-theme="dark"] .fb-article .fb-review,
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-det-wrap,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-quote { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-su-msg,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-det-title,
:root[data-theme="dark"] .fb-article .fb-cc-title,
:root[data-theme="dark"] .fb-article .fb-prev-title,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-su-msg em,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-det-sub,
:root[data-theme="dark"] .fb-article .fb-det-label,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-cc-desc,
:root[data-theme="dark"] .fb-article .fb-prev-desc,
:root[data-theme="dark"] .fb-article .fb-rv-label,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-su-msg.alert { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-su-who { color: #b5b5b5; }
:root[data-theme="dark"] .fb-article .fb-su-who.em { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-su-who.qa { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-rv-metric { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-rv-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-rv-val.good { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-rv-badge { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-rate { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-per { background: rgba(147,197,253,0.08); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .cc-rate .fb-cc-tag { background: rgba(255,255,255,0.12); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-formula { background: rgba(255,255,255,0.06); color: #93C5FD; border-color: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-cc-verdict { background: rgba(255,255,255,0.08); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict.ok { background: rgba(147,197,253,0.12); color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-ht th { background: rgba(255,255,255,0.06); color: #c9c9c9; border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-ht td { border-color: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-ht td:first-child { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-ht tr:last-child td { background: rgba(255,255,255,0.06); }
:root[data-theme="dark"] .fb-article .fb-spike-row td { background: rgba(176,51,51,0.18) !important; }
:root[data-theme="dark"] .fb-article .fb-ht .val-good { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-ht .val-warn { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-ht .val-bad { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn { background: rgba(180,83,9,0.15); border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good { background: rgba(10,107,111,0.2); border-color: rgba(95,200,204,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-label { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-label { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-label { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-label { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-tc-desc { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-chart-badge.red { background: rgba(176,51,51,0.25); color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-det-field input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-det-field input.spike { background: rgba(176,51,51,0.25); border-color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-det-result { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-det-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-det-status { background: rgba(255,255,255,0.08); color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-det-status.clean { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-det-status.warn { background: rgba(180,83,9,0.25); color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-det-status.spike { background: rgba(176,51,51,0.25); color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-prev-card { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-prev-when { color: #E0B86B; }
:root[data-theme="dark"] .fb-article .fb-sum-card.sum-yes { background: rgba(42,122,62,0.12); border-color: rgba(110,231,183,0.3); }
:root[data-theme="dark"] .fb-article .fb-sum-card.sum-no { background: rgba(176,51,51,0.12); border-color: rgba(252,165,165,0.3); }
:root[data-theme="dark"] .fb-article .fb-sum-card.sum-yes .fb-sum-title { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-sum-card.sum-no .fb-sum-title { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-sum-list li { color: #c9c9c9; border-color: rgba(255,255,255,0.08); }
:root[data-theme="dark"] .fb-article .fb-s-done .fb-s-title { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-current .fb-s-title { color: var(--fb-gold); }
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
  var releases = ['v3.1', 'v3.2', 'v3.3', 'v3.4', 'v3.5', 'v3.6', 'v3.7', 'v3.8'];
  var eprData = [0.0, 0.2, 0.0, 2.8, 0.3, 0.0, 0.2, 0.3];
  function initCharts() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(128,128,128,0.15)';
    var bgColors = eprData.map(function (v) { return v >= 2 ? '#B03333' : v >= 0.5 ? '#D97706' : '#2A7A3E'; });
    mount(document.getElementById('fb-c-epr'), {
      type: 'bar',
      data: {
        labels: releases,
        datasets: [
          { label: 'Escaped per Release', data: eprData, backgroundColor: bgColors, borderRadius: 6, borderSkipped: false, order: 1 },
          { label: 'Elite threshold (0.5)', data: Array(8).fill(0.5), type: 'line', borderColor: 'rgba(200,148,58,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, order: 0 },
          { label: 'Alarm threshold (3.0)', data: Array(8).fill(3.0), type: 'line', borderColor: 'rgba(176,51,51,0.4)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, order: 0 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) {
            if (c.datasetIndex !== 0) return null;
            var v = c.raw;
            var lvl = v >= 3 ? 'ALARM' : v >= 1.5 ? 'Needs attention' : v >= 0.5 ? 'Good' : 'Elite';
            return [' EpR: ' + v, ' Verdict: ' + lvl];
          } } }
        },
        scales: {
          y: { min: 0, max: 3.5, ticks: { stepSize: 0.5 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'Escaped bugs', font: { size: 10 } } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
    var rateData = [0.5, 0.8, 1.2, 3.1, 2.4, 1.8, 1.6, 1.5];
    mount(document.getElementById('fb-c-compare'), {
      type: 'bar',
      data: {
        labels: releases,
        datasets: [
          { label: 'Escaped per Release', data: eprData, backgroundColor: 'rgba(14,31,61,0.75)', borderRadius: 5, borderSkipped: false, yAxisID: 'y', order: 2 },
          { label: 'Overall Escaped Rate (%)', data: rateData, type: 'line', borderColor: '#0A6B6F', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [6, 4], pointBackgroundColor: '#0A6B6F', pointStyle: 'circle', pointRadius: 4, fill: false, tension: 0.4, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 3.5, ticks: { stepSize: 0.5 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'EpR (count)', font: { size: 10 }, color: '#5C7AAE' } },
          y1: { position: 'right', min: 0, max: 4, ticks: { callback: function (v) { return v + '%'; } }, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Rate (%)', font: { size: 10 }, color: '#0A6B6F' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
  function initDetector() {
    var inputs = document.querySelectorAll('#fb-det-inputs input');
    if (!inputs.length) return;
    function percentile(sorted, p) {
      var idx = (sorted.length - 1) * p;
      var lo = Math.floor(idx), hi = Math.ceil(idx);
      if (lo === hi) return sorted[lo];
      return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    }
    function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
    function update() {
      var vals = [];
      inputs.forEach(function (inp) {
        vals.push(inp.value === '' ? null : parseFloat(inp.value));
      });
      var filled = vals.filter(function (v) { return v !== null && !isNaN(v); });
      var stEl = document.getElementById('fb-det-status');
      if (filled.length < 4) {
        ['fb-det-median', 'fb-det-avg', 'fb-det-thresh', 'fb-det-spikes'].forEach(function (id) { setText(id, '-'); });
        if (stEl) { stEl.textContent = 'Enter at least 4 values (the IQR method needs quartiles)'; stEl.className = 'fb-det-status'; }
        inputs.forEach(function (inp) { inp.classList.remove('spike'); });
        return;
      }
      var sorted = filled.slice().sort(function (a, b) { return a - b; });
      var q1 = percentile(sorted, 0.25);
      var q3 = percentile(sorted, 0.75);
      var iqr = q3 - q1;
      var med = percentile(sorted, 0.5);
      var thresh = iqr > 0 ? q3 + 1.5 * iqr : Math.max(med * 2, 0.5);
      var avg = filled.reduce(function (a, b) { return a + b; }, 0) / filled.length;
      var spikes = [];
      inputs.forEach(function (inp, i) {
        inp.classList.remove('spike');
        if (vals[i] !== null && !isNaN(vals[i]) && vals[i] > thresh) {
          inp.classList.add('spike');
          spikes.push('v' + (i + 1));
        }
      });
      setText('fb-det-median', med.toFixed(2));
      setText('fb-det-avg', avg.toFixed(2));
      setText('fb-det-thresh', thresh.toFixed(2));
      if (spikes.length === 0) {
        setText('fb-det-spikes', 'None');
        if (stEl) { stEl.textContent = '✓ No spikes - stable process'; stEl.className = 'fb-det-status clean'; }
      } else if (spikes.length === 1) {
        setText('fb-det-spikes', spikes.join(', '));
        if (stEl) { stEl.textContent = '⚠ Spike: ' + spikes.join(', ') + ' - needs an investigation (blameless, within 48h)'; stEl.className = 'fb-det-status warn'; }
      } else {
        setText('fb-det-spikes', spikes.join(', '));
        if (stEl) { stEl.textContent = '🚨 Multiple spikes: ' + spikes.join(', ') + ' - a systemic problem'; stEl.className = 'fb-det-status spike'; }
      }
    }
    inputs.forEach(function (inp) { inp.addEventListener('input', update); });
    update();
  }
  function boot() { ensureChart(initCharts); initDetector(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
