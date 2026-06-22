---
title: "Number of Releases - the context metric"
description: "Why the number of releases is the common denominator for every QA metric. How to normalize, the link to Deployment Frequency (DORA), and why 3 bugs across 2 releases is a crisis while 3 across 15 is a win. Article 6 of 9."
date: 2026-06-23
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 6 of 9</p>

<p class="fb-lead">Picture two teams. Both report: "This quarter we had 3 bugs in production." One deserves a bonus for it, the other should stop shipping immediately and run a deep retrospective. Where is the difference? In the number of releases - the one metric neither of them put in the report.</p>

<div class="fb-vs">
  <div class="fb-vs-panel vs-crisis">
    <div class="fb-vs-big">3</div>
    <div class="fb-vs-label">production bugs · 2 releases</div>
    <div class="fb-vs-detail">On average 1.5 bugs per release. Every second deployment hands the customer problems.</div>
    <span class="fb-vs-verdict">Crisis</span>
  </div>
  <div class="fb-vs-eq">vs</div>
  <div class="fb-vs-panel vs-success">
    <div class="fb-vs-big">3</div>
    <div class="fb-vs-label">production bugs · 15 releases</div>
    <div class="fb-vs-detail">Just 0.2 bugs per release. The vast majority of releases ship without the slightest issue.</div>
    <span class="fb-vs-verdict">Success</span>
  </div>
</div>

The same absolute number can describe two completely different realities. That is exactly why **Number of Releases is not a metric you simply present - it is the foundation through which you judge every other data point**.

It is the most overlooked of the five metrics in this series, because on the surface it seems trivial ("Just count how many releases we shipped"). Its role, however, is critical. Without it, indicators like DDR, Escaped Bugs or Issues per Release are merely dry numbers, stripped of any real scale.

## The metric that does not shine on its own - but lights up the rest

Picture the other four metrics in the series as satellites. Each one orbits a single reference point - the number of releases. Without that center, each one drifts without context.

<div class="fb-dark-box">
  <div class="fb-cd-center">
    <div class="fb-cd-clabel">Common denominator</div>
    <div class="fb-cd-metric">Number of Releases</div>
    <div class="fb-cd-sub">gives scale to each of the metrics below</div>
  </div>
  <div class="fb-cd-sats">
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Escaped Bugs</div>
      <div class="fb-cd-norm">escaped ÷ releases<br>= escaped per release</div>
      <div class="fb-cd-arrow">→ real customer impact</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Issues per Release</div>
      <div class="fb-cd-norm">issues ÷ releases<br>= maturity per release</div>
      <div class="fb-cd-arrow">→ comparability over time</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">DDR</div>
      <div class="fb-cd-norm">context: how many chances<br>to detect / escape</div>
      <div class="fb-cd-arrow">→ scale of the process</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Confidence Score</div>
      <div class="fb-cd-norm">trend across N releases<br>= prediction stability</div>
      <div class="fb-cd-arrow">→ repeatability</div>
    </div>
  </div>
</div>

<div class="fb-quote">An absolute number tells you how much happened. A normalized number tells you whether that is a lot. And "is that a lot" is the only question the business truly cares about.</div>

## How to normalize every metric in the series

Normalization is simply dividing the absolute number by the number of releases. But the effect is transformative - it turns a number that swings with your pace of work into a quality indicator independent of that pace.

<table class="fb-ht fb-ht-plain">
  <thead>
    <tr><th>Metric</th><th>Absolute</th><th>Normalized</th><th>What you gain</th></tr>
  </thead>
  <tbody>
    <tr><td>Escaped Bugs</td><td>12 / quarter</td><td>÷ releases</td><td>Comparability across quarters with a different cadence</td></tr>
    <tr><td>Issues found</td><td>96 / quarter</td><td>÷ releases</td><td>Code-maturity trend independent of deployment count</td></tr>
    <tr><td>QA time</td><td>320h / quarter</td><td>÷ releases</td><td>Cost of quality per release - an argument for budget</td></tr>
    <tr><td>Hotfixes</td><td>8 / quarter</td><td>÷ releases</td><td>Stability of the release process, not a raw failure count</td></tr>
  </tbody>
</table>

### A concrete example - the same team, two quarters

Watch how normalization completely flips the conclusion. Without it, Q4 looks worse than Q3. With it - you see a clear improvement.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped bugs - absolute vs normalized</div>
      <div class="fb-chart-sub">Absolute numbers rise (more releases). Per release - they fall. Which conclusion is true?</div>
    </div>
    <span class="fb-chart-badge">Q3 vs Q4</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#B03333"></span>Escaped total (count)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>Escaped per release</span>
  </div>
  <div class="fb-chart-canvas" style="height:240px;"><canvas id="fb-c-norm"></canvas></div>
</div>

**Reading the absolute numbers:** "The number of production bugs rose from 7 to 12 - our quality is dropping." **Reading them after normalization:** "Bugs per release fell from 1.4 to 0.8. We doubled our delivery pace and the quality of our software clearly improved." The second conclusion is the true one. The first is a business trap.

## Number of Releases vs Deployment Frequency

The number of releases is a very close cousin of the industry's most famous delivery-pace metric - **Deployment Frequency** from the DORA research. It is the first of the four key DevOps metrics and a direct indicator of how often your organization actually delivers value to users.

Keep in mind that the latest DORA report moved away from the classic four-tier split in favor of seven archetypes, but the data in the classic layout still makes an excellent reference point. Only about 16% of teams can deploy changes "on demand", while 24% do so less than once a month. The maturity gap is enormous.

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-label">Top tier</div>
    <div class="fb-tc-range">On demand</div>
    <div class="fb-tc-desc">Multiple times a day, small code batches · ~16% of teams</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-label">High</div>
    <div class="fb-tc-range">Daily - weekly</div>
    <div class="fb-tc-desc">At least once a week, often more</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-label">Medium</div>
    <div class="fb-tc-range">Weekly - monthly</div>
    <div class="fb-tc-desc">Sprint cycles, end of sprint every 1-2 weeks</div>
  </div>
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-label">Low</div>
    <div class="fb-tc-range">Less than monthly</div>
    <div class="fb-tc-desc">Large batches, high risk on every deployment · ~24% of teams</div>
  </div>
</div>

Why does this matter for QA? Because **delivery pace and quality are not opposites** - that is one of the most important findings from years of DORA research. The fastest teams are also the most stable. More frequent, smaller releases mean a smaller blast radius for every change, easier diagnosis and faster rollback. The number of releases is not just the denominator for your metrics - it is a signal of how mature the whole process is.

<div class="fb-quote">A rising number of releases alongside a falling escaped-per-release is the strongest evidence QA can present: we ship faster and more safely at the same time. That is precisely what DORA calls an elite-performance trait.</div>

## Deployment ≠ Release - and why it changes the counting

Before you start collecting data, you have to be clear: are you counting deployments or releases? They are not the same thing, and it trips up even experienced teams - especially those working with feature flags.

<div class="fb-cc-grid">
  <div class="fb-cc-panel cc-rate">
    <span class="fb-cc-tag">Deployment</span>
    <div class="fb-cc-title">🚀 Deployment</div>
    <div class="fb-cc-desc">A technical act. Code lands on the production environment, but it can stay hidden from the user - e.g. behind a disabled flag.</div>
    <div class="fb-cc-verdict">Example: a new feature's code is deployed, but the flag is off</div>
  </div>
  <div class="fb-cc-panel cc-per">
    <span class="fb-cc-tag">Release</span>
    <div class="fb-cc-title">🎁 Release</div>
    <div class="fb-cc-desc">The business moment of making a new feature available to users. It can happen weeks after the deployment - e.g. by simply turning the flag on for 100% of the user base.</div>
    <div class="fb-cc-verdict ok">Example: turning the flag on for 100% of users</div>
  </div>
</div>

For this series' QA metrics, **we count what reaches the user**, that is releases in the business sense. An escaped bug is a problem the customer felt - so the denominator has to be the number of moments at which anything could have reached the customer. If your team separates deployment from release with feature flags, decide clearly: is an escaped bug counted from the moment the code is deployed, or from the moment the flag is turned on? Consistency in this definition is critical - just as with escaped bugs in article 3.

## Normalization calculator

Enter the absolute numbers and the number of releases - the calculator will show the normalized values with a verdict for each metric.

<div class="fb-det-wrap">
  <div class="fb-det-title">QA metrics normalizer</div>
  <div class="fb-det-sub">See how the number of releases changes the interpretation of your data</div>
  <div class="fb-norm-inputs">
    <div class="fb-det-field"><label>Releases in the period</label><input type="number" id="fb-n-releases" value="10" min="1"></div>
    <div class="fb-det-field"><label>Escaped bugs (total)</label><input type="number" id="fb-n-escaped" value="6" min="0"></div>
    <div class="fb-det-field"><label>Issues found (total)</label><input type="number" id="fb-n-issues" value="80" min="0"></div>
    <div class="fb-det-field"><label>QA time in hours (total)</label><input type="number" id="fb-n-qatime" value="240" min="0"></div>
  </div>
  <div class="fb-no-out">
    <div class="fb-no-card">
      <div class="fb-no-label">Escaped / release</div>
      <div class="fb-no-val" id="fb-no-escaped">0.60</div>
      <div class="fb-no-verdict nv-good" id="fb-nv-escaped">Good</div>
    </div>
    <div class="fb-no-card">
      <div class="fb-no-label">Issues / release</div>
      <div class="fb-no-val" id="fb-no-issues">8.0</div>
      <div class="fb-no-verdict nv-warn" id="fb-nv-issues">Needs work</div>
    </div>
    <div class="fb-no-card">
      <div class="fb-no-label">QA time / release</div>
      <div class="fb-no-val" id="fb-no-qatime">24h</div>
      <div class="fb-no-verdict nv-good">Cost of quality</div>
    </div>
  </div>
</div>

## How to start counting - and do it right

It is the easiest metric in the whole series to collect - but it has a few definitional traps worth settling from the start.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Decide what counts as a "release"</div>
      <div class="fb-step-text">Deployment or availability to the user? A hotfix - does it count as a separate release? A rollback and re-deploy - one release or two? Write the definition down and stick to it. For quality metrics I recommend counting what reaches the user.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Pull the data from what you already have</div>
      <div class="fb-step-text">Git tags, CI/CD history (Jenkins, GitHub Actions, GitLab), the changelog, the version list in Jira. The number of releases is one of the most readily available data points in the whole series - usually counting the production tags is enough.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Add the number of releases as context to EVERY report</div>
      <div class="fb-step-text">This is the heart of it. Never report escaped bugs, issues or DDR without the number of releases beside them. One sentence - "across 10 releases this quarter" - changes the interpretation of every other number.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Normalize all the other metrics - and show both views</div>
      <div class="fb-step-text">Show both the absolute number and the normalized one. The absolute one speaks to the scale of work, the normalized one to quality. Together they give the full picture - and protect you from wrong conclusions in either direction.</div>
    </div>
  </div>
</div>

## Three pitfalls when using the number of releases

<div class="fb-pit-grid">
  <div class="fb-pit">
    <div class="fb-pit-n">01</div>
    <div class="fb-pit-title">The number of releases as a goal in itself</div>
    <div class="fb-pit-text">More releases is not the goal - it is the means. If a team starts artificially splitting one release into five to "improve" the normalized metrics, that is gaming the system. The number of releases should reflect the real rhythm of delivering value, not be optimized for prettier charts.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">02</div>
    <div class="fb-pit-title">Comparing teams with different delivery models</div>
    <div class="fb-pit-text">A team deploying on demand and a team releasing once a sprint are two different worlds. Normalized metrics help, but they do not erase contextual differences - regulation, product type, architecture. Use normalization to compare a single team over time, not to rank teams against one another.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">03</div>
    <div class="fb-pit-title">Ignoring release size</div>
    <div class="fb-pit-text">10 small releases are not the same as 10 big ones. The number alone does not account for size. For more precise normalization, consider weighting by story points or the number of changes - especially when releases differ wildly in scale. The number of releases is a good default denominator, but not a perfect one for every case.</div>
  </div>
</div>

## The number of releases in a conversation with the business

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">"This quarter we shipped 12 releases - 4 more than the previous one. Despite such a big jump in pace, the bug-per-release rate dropped from 1.0 to 0.5. We are shipping faster and more safely."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 with EM</span>
    <span class="fb-biz-text">"The absolute number of production bugs went up because we doubled the number of releases. But if we look at the per-release rate, our quality improved significantly. We are achieving exactly what the DORA research calls elite performance: pace and stability rising at the same time."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Leadership</span>
    <span class="fb-biz-text">"We increased deployment frequency from 3 to 12 releases per quarter, moving up a tier on the DORA benchmarks. More importantly, the defect rate per release fell by half. We deliver business value faster while drastically lowering risk."</span>
  </div>
</div>

## Why this "trivial" metric is the foundation

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">Number of Releases gives you</div>
    <ul class="fb-sum-list">
      <li>A common denominator for all the other metrics in the series</li>
      <li>Protection against wrong conclusions drawn from absolute numbers</li>
      <li>Comparability across quarters with a different cadence</li>
      <li>A bridge to Deployment Frequency - the language of DORA and the boardroom</li>
      <li>Proof that pace and quality can rise at the same time</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">Number of Releases is not</div>
    <ul class="fb-sum-list">
      <li>A goal in itself - more does not always mean better</li>
      <li>A measure of release size (the count alone ignores scale)</li>
      <li>A tool for ranking different teams</li>
      <li>Sufficient on its own - it only shines together with the other metrics</li>
    </ul>
  </div>
</div>

<div class="fb-quote">Number of Releases is a metric you do not present - it is the metric through which you present all the others. The quietest hero of the entire series.</div>

## In the next article

Five metrics behind us. Article seven ties them all into a single decision indicator - the **Release Confidence Score**. Three calculation models, from a simple traffic light to a weighted model, a step-by-step rollout and examples from practice. This is the moment the whole series starts working as a system - a single number that answers the business's most important question: can we release?

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">The complete guide</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/en/blog/defect-detection-ratio-measure-qa-effectiveness/">Defect Detection Ratio</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-problems-full-spectrum/">Escaped Bugs &amp; Problems</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/en/blog/issues-per-release-code-maturity-metric/">Issues per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Rollout from scratch, the link to the development process, the EM conversation</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-per-release-find-risky-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Pinpointing problems, not just watching trends</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">06</span><div><div class="fb-s-title">Number of Releases <span class="fb-s-now">you are here</span></div><div class="fb-s-sub">The context metric, normalization, the link to Deployment Frequency</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">07</span><div><div class="fb-s-title">Release Confidence Score step by step</div><div class="fb-s-sub">Three calculation models, rollout, examples from practice</div></div></li>
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

/* HT TABLE */
.fb-ht { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
.fb-ht th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-ht th:first-child { text-align: left; }
.fb-ht td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; }
.fb-ht td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-ht tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-ht.fb-ht-plain th:last-child, .fb-ht.fb-ht-plain td:last-child { text-align: left; }
.fb-ht.fb-ht-plain tr:last-child td { font-weight: 400; background: transparent; }
.fb-ht.fb-ht-plain td:first-child { font-weight: 600; }

/* CHARTS */
.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-chart-canvas { position: relative; width: 100%; }

/* DARK BOX + CONTEXT DIAGRAM */
.fb-dark-box { background: var(--fb-navy); border-radius: 16px; padding: 32px 30px; margin: 32px 0; }
.fb-cd-center { text-align: center; margin-bottom: 22px; }
.fb-cd-clabel { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 8px; }
.fb-cd-metric { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #fff; }
.fb-cd-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }
.fb-cd-sats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 500px) { .fb-cd-sats { grid-template-columns: 1fr; } }
.fb-cd-sat { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 18px; }
.fb-cd-name { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 5px; }
.fb-cd-norm { font-family: 'Courier New', monospace; font-size: 11px; color: #93C5FD; line-height: 1.5; }
.fb-cd-arrow { font-size: 11px; color: var(--fb-gold); margin-top: 6px; }

/* VERSUS */
.fb-vs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; margin: 26px 0; }
@media (max-width: 560px) { .fb-vs { grid-template-columns: 1fr; } }
.fb-vs-panel { border-radius: 12px; padding: 22px; text-align: center; border: 2px solid; }
.fb-vs-panel.vs-crisis { background: #FEF2F2; border-color: #FECACA; }
.fb-vs-panel.vs-success { background: #F0FDF4; border-color: #BBF7D0; }
.fb-vs-big { font-family: Georgia, serif; font-size: 2.6rem; font-weight: 500; line-height: 1; margin-bottom: 4px; }
.vs-crisis .fb-vs-big { color: var(--fb-red); }
.vs-success .fb-vs-big { color: var(--fb-green); }
.fb-vs-label { font-size: 11px; color: var(--fb-muted); margin-bottom: 12px; }
.fb-vs-detail { font-size: 13px; color: #111; line-height: 1.5; }
.fb-vs-verdict { margin-top: 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; display: inline-block; }
.vs-crisis .fb-vs-verdict { background: var(--fb-red); color: #fff; }
.vs-success .fb-vs-verdict { background: var(--fb-green); color: #fff; }
.fb-vs-eq { font-family: Georgia, serif; font-size: 1.4rem; color: var(--fb-faint); text-align: center; }
@media (max-width: 560px) { .fb-vs-eq { transform: rotate(90deg); } }

/* DORA TIERS (thresh cards) */
.fb-thresh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-thresh-card { border-radius: 12px; padding: 16px; text-align: center; border: 1.5px solid; }
.fb-thresh-card.tc-danger { background: #FEF2F2; border-color: #FECACA; }
.fb-thresh-card.tc-warn { background: #FFFBEB; border-color: #FDE68A; }
.fb-thresh-card.tc-good { background: var(--fb-teal-pale); border-color: #99E6EA; }
.fb-thresh-card.tc-great { background: #F0FDF4; border-color: #BBF7D0; }
.fb-tc-range { font-family: Georgia, serif; font-size: 1.2rem; font-weight: 500; line-height: 1.2; margin-bottom: 6px; }
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

/* DEPLOY VS RELEASE (compare panels) */
.fb-cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
@media (max-width: 560px) { .fb-cc-grid { grid-template-columns: 1fr; } }
.fb-cc-panel { border-radius: 12px; padding: 22px; border: 2px solid; }
.fb-cc-panel.cc-rate { border-color: var(--fb-border); background: var(--fb-surface); }
.fb-cc-panel.cc-per { border-color: var(--fb-navy); background: #EFF6FF; }
.fb-cc-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 14px; }
.cc-rate .fb-cc-tag { background: #E5E1D8; color: #4a4a4a; }
.cc-per .fb-cc-tag { background: var(--fb-navy); color: #fff; }
.fb-cc-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-cc-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-cc-verdict { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; background: #E5E1D8; color: #4a4a4a; font-style: italic; }
.fb-cc-verdict.ok { background: rgba(14,31,61,0.08); color: var(--fb-navy); }

/* NORMALIZER */
.fb-det-wrap { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 28px 0; }
.fb-det-title { font-family: Georgia, serif; font-size: 18px; font-weight: 500; margin-bottom: 6px; color: #111; }
.fb-det-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 22px; }
.fb-norm-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
@media (max-width: 480px) { .fb-norm-inputs { grid-template-columns: 1fr; } }
.fb-det-field label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); display: block; margin-bottom: 6px; }
.fb-det-field input { width: 100%; border: 1px solid var(--fb-border); border-radius: 8px; padding: 11px 14px; font-size: 16px; font-weight: 700; font-family: Georgia, serif; color: #111; background: #fff; outline: none; transition: border-color 0.2s; }
.fb-det-field input:focus { border-color: var(--fb-gold); }
.fb-no-out { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 480px) { .fb-no-out { grid-template-columns: 1fr; } }
.fb-no-card { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 18px 14px; text-align: center; }
.fb-no-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 6px; }
.fb-no-val { font-family: Georgia, serif; font-size: 1.7rem; font-weight: 500; color: var(--fb-navy); line-height: 1; }
.fb-no-verdict { font-size: 11px; font-weight: 700; margin-top: 8px; padding: 4px 10px; border-radius: 20px; display: inline-block; }
.fb-no-verdict.nv-elite { background: #F0FDF4; color: var(--fb-green); }
.fb-no-verdict.nv-good { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-no-verdict.nv-warn { background: #FFFBEB; color: var(--fb-amber); }
.fb-no-verdict.nv-bad { background: #FEF2F2; color: var(--fb-red); }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 18px; margin-bottom: 20px; }
.fb-step:last-child { margin-bottom: 0; }
.fb-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-body { flex: 1; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }

/* PITFALLS */
.fb-pit-grid { display: grid; gap: 12px; margin: 22px 0; }
.fb-pit { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
.fb-pit-n { position: absolute; right: 14px; top: 8px; font-family: Georgia, serif; font-size: 3.2rem; font-weight: 300; color: var(--fb-border); line-height: 1; pointer-events: none; }
.fb-pit-title { font-size: 14px; font-weight: 700; color: var(--fb-red); margin-bottom: 8px; position: relative; z-index: 1; }
.fb-pit-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; position: relative; z-index: 1; }

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
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-det-wrap,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-quote { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-det-title,
:root[data-theme="dark"] .fb-article .fb-cc-title,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-det-sub,
:root[data-theme="dark"] .fb-article .fb-det-field label,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-cc-desc,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-ht th { background: rgba(255,255,255,0.06); color: #c9c9c9; border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-ht td { border-color: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-ht td:first-child { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-ht.fb-ht-plain tr:last-child td { background: transparent; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn { background: rgba(180,83,9,0.15); border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good { background: rgba(10,107,111,0.2); border-color: rgba(95,200,204,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-label { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-label { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-label { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-label { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-tc-desc { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-rate { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-per { background: rgba(147,197,253,0.08); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .cc-rate .fb-cc-tag { background: rgba(255,255,255,0.12); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict { background: rgba(255,255,255,0.08); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict.ok { background: rgba(147,197,253,0.12); color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-vs-panel.vs-crisis { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.35); }
:root[data-theme="dark"] .fb-article .fb-vs-panel.vs-success { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.35); }
:root[data-theme="dark"] .fb-article .vs-crisis .fb-vs-big { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .vs-success .fb-vs-big { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-vs-detail { color: #e5e5e5; }
:root[data-theme="dark"] .fb-article .fb-vs-label { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-det-field input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-no-card { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-no-label { color: #b5b5b5; }
:root[data-theme="dark"] .fb-article .fb-no-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-elite { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-good { background: rgba(10,107,111,0.25); color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-warn { background: rgba(180,83,9,0.25); color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-bad { background: rgba(176,51,51,0.25); color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-pit { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-pit-n { color: rgba(255,255,255,0.08); }
:root[data-theme="dark"] .fb-article .fb-pit-title { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-pit-text { color: #c9c9c9; }
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
  function mount(el, cfg) { if (!el) return; var prev = Chart.getChart(el); if (prev) prev.destroy(); new Chart(el, cfg); }
  function initChart() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#888';
    var grid = 'rgba(128,128,128,0.15)';
    mount(document.getElementById('fb-c-norm'), {
      type: 'bar',
      data: {
        labels: ['Q3 (5 releases)', 'Q4 (15 releases)'],
        datasets: [
          { label: 'Escaped total', data: [7, 12], backgroundColor: 'rgba(176,51,51,0.78)', borderRadius: 6, borderSkipped: false, yAxisID: 'y', order: 2 },
          { label: 'Escaped per release', data: [1.4, 0.8], type: 'line', borderColor: '#2A7A3E', backgroundColor: 'rgba(42,122,62,0.1)', borderWidth: 3, pointBackgroundColor: '#2A7A3E', pointRadius: 7, pointHoverRadius: 9, fill: false, tension: 0, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        locale: 'en-US',
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) {
            if (c.dataset.label === 'Escaped per release') return '  Per release: ' + c.raw;
            return '  Total: ' + c.raw + ' bugs';
          } } }
        },
        scales: {
          y: { min: 0, max: 16, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'Escaped total', font: { size: 10 }, color: '#B03333' } },
          y1: { position: 'right', min: 0, max: 2, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Per release', font: { size: 10 }, color: '#2A7A3E' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
  function initNormalizer() {
    var ids = ['fb-n-releases', 'fb-n-escaped', 'fb-n-issues', 'fb-n-qatime'];
    var inputs = ids.map(function (i) { return document.getElementById(i); });
    if (inputs.some(function (x) { return !x; })) return;
    function setText(id, t) { var e = document.getElementById(id); if (e) e.textContent = t; }
    function setVerdict(id, t, cls) { var e = document.getElementById(id); if (e) { e.textContent = t; e.className = 'fb-no-verdict ' + cls; } }
    function escV(v) { if (v < 0.5) return ['Elite', 'nv-elite']; if (v < 1.5) return ['Good', 'nv-good']; if (v <= 3) return ['Watch', 'nv-warn']; return ['Alert', 'nv-bad']; }
    function issV(v) { if (v < 3) return ['Mature', 'nv-elite']; if (v < 6) return ['Solid', 'nv-good']; if (v <= 12) return ['Needs work', 'nv-warn']; return ['Alert', 'nv-bad']; }
    function fmt(n, d) { return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
    function update() {
      var rel = parseFloat(inputs[0].value) || 1;
      var esc = parseFloat(inputs[1].value) || 0;
      var iss = parseFloat(inputs[2].value) || 0;
      var qa = parseFloat(inputs[3].value) || 0;
      var ep = esc / rel, ip = iss / rel, qp = qa / rel;
      setText('fb-no-escaped', fmt(ep, 2));
      setText('fb-no-issues', fmt(ip, 1));
      setText('fb-no-qatime', Math.round(qp) + 'h');
      var e = escV(ep); setVerdict('fb-nv-escaped', e[0], e[1]);
      var i = issV(ip); setVerdict('fb-nv-issues', i[0], i[1]);
    }
    inputs.forEach(function (inp) { inp.addEventListener('input', update); });
    update();
  }
  function boot() { ensureChart(initChart); initNormalizer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
