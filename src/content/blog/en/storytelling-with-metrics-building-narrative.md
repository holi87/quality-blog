---
title: "Storytelling with metrics - building a narrative"
description: "Storytelling with metrics - how to turn a table of numbers into a business argument the board listens to. Article 8 of 9."
date: 2026-07-07
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 8 of 9</p>

<p class="fb-lead">A table of numbers convinces no one. This article is about turning metrics into a narrative the business listens to - and acts on.</p>

<div class="fb-wip">
  <div class="fb-wip-label">Post in progress</div>
  <p>The full content of this article is coming soon. The full series agenda is below.</p>
</div>

## In this article

- How to turn a table of numbers into a narrative
- Structuring the argument for different audiences (EM, PM, board)
- The most common mistakes when presenting metrics

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">The complete guide</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/en/blog/defect-detection-ratio-measure-qa-effectiveness/">Defect Detection Ratio</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-problems-full-spectrum/">Escaped Bugs &amp; Problems</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/en/blog/issues-per-release-code-maturity-metric/">Issues per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Rollout from scratch, the link to the development process, the EM conversation</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-per-release-find-risky-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Pinpointing problems, not just watching trends</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">06</span><div><div class="fb-s-title"><a href="/en/blog/number-of-releases-context-metric/">Number of Releases</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Why 3 bugs with 2 releases is a disaster, and with 15 - a success</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">07</span><div><div class="fb-s-title"><a href="/en/blog/release-confidence-score-step-by-step/">Release Confidence Score</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Three calculation models, rollout, concrete examples from practice</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">08</span><div><div class="fb-s-title">Storytelling with metrics <span class="fb-s-now">you are here</span></div><div class="fb-s-sub">How to turn a table of numbers into a business argument</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">09</span><div><div class="fb-s-title">3 anti-patterns that destroy QA credibility</div><div class="fb-s-sub">Too many metrics, no context, jargon - and how to avoid each</div></div></li>
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
  --fb-faint: #767676;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-wip { background: var(--fb-gold-pale); border: 1px solid #E8D9B5; border-left: 3px solid var(--fb-gold); border-radius: 0 12px 12px 0; padding: 18px 22px; margin: 24px 0; }
.fb-wip-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #7a4f0a; margin-bottom: 6px; }
.fb-wip p { margin: 0; color: #5a4420; font-size: 14px; }
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
:root[data-theme="dark"] .fb-article .fb-series { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-done .fb-s-title { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-current .fb-s-title { color: var(--fb-gold); }
</style>
