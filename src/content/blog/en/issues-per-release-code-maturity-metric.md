---
title: "Issues per Release - a code-maturity gauge"
description: "How to roll out Issues per Release from scratch, why it's a metric of the development process and not just QA, and how it reshapes the conversation with the Engineering Manager. Article 4 of 9."
date: 2026-06-09
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 4 of 9</p>

<p class="fb-lead">It was a Monday standup. The QA Lead had shadows under their eyes - the previous week had gone mostly to logging tickets. Fifty-four issues in a single release. Fifty-four.</p>

<div class="fb-standup">
  <div class="fb-su-time">Monday · 09:15 · Sprint Planning</div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg">"How's testing going? Will we make the Friday release?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">"I have 54 open issues from this sprint. I'm working 10 hours a day. I don't know if I'll make it."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg">"54? That's a lot, what happened?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">"I don't know what happened - I only know the last release had 18, and this one already has 54 and I'm not done yet."</span></div>
  <div class="fb-su-line"><span class="fb-su-who dev">Dev</span><span class="fb-su-msg"><em>"This release was big, lots of new features..."</em></span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">"The previous one was big too. 18 issues."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg"><em>silence</em></span></div>
</div>

That conversation ended well - because the QA Lead had data. Previous release: 18. Current: 54+. Without that comparison it would have been just: *"there are a lot of bugs, we're working."*

**Issues per Release is the metric that turns "there's a lot of work" into a concrete signal.** And - more importantly - it points to where the problem lies. Not always in testing.

## What Issues per Release is

Issues per Release is the number of all problems QA finds while testing a single release - from the moment code is accepted for testing to the deployment decision.

<div class="fb-formula-box fb-highlight">
  <div class="fb-f-label">Formula</div>
  <div class="fb-formula">IPR = the count of all issues found while testing a release</div>
  <div class="fb-formula-example">
    Release v2.3 → testing took 8 days → found: 12 bugs + 4 UX notes + 3 performance issues + 2 requirement mismatches = <strong>21 issues</strong><br>
    Release v2.4 → testing took 6 days → found: 6 bugs + 1 UX note + 1 performance issue = <strong>8 issues</strong>
  </div>
  <div class="fb-formula-note">Key point: we count <strong>all</strong> issues found, not only Critical or High priority ones. Every deviation from expected behavior carries informational weight.</div>
</div>

### What counts as an "issue"

This is one of the most important questions when rolling out this metric. Too narrow a definition - and you lose half the signal. Too broad - and the number loses its interpretation.

<div class="fb-issue-grid">
  <div class="fb-issue-card bug">
    <div class="fb-issue-icon">🐛</div>
    <div class="fb-issue-name">Functional defect</div>
    <div class="fb-issue-desc">The application behaves differently than it should according to the spec or common sense.</div>
    <span class="fb-issue-tip">always count</span>
  </div>
  <div class="fb-issue-card ux">
    <div class="fb-issue-icon">🎨</div>
    <div class="fb-issue-name">UX / UI problem</div>
    <div class="fb-issue-desc">Elements work technically, but are unreadable, unintuitive, or inconsistent with the rest of the product.</div>
    <span class="fb-issue-tip">count with a label</span>
  </div>
  <div class="fb-issue-card perf">
    <div class="fb-issue-icon">⚡</div>
    <div class="fb-issue-name">Performance problem</div>
    <div class="fb-issue-desc">Response time, resource usage, behavior under load - beyond accepted thresholds.</div>
    <span class="fb-issue-tip">count with a label</span>
  </div>
  <div class="fb-issue-card req">
    <div class="fb-issue-icon">📋</div>
    <div class="fb-issue-name">Requirement mismatch</div>
    <div class="fb-issue-desc">Something other than the spec was implemented - deliberately or through a misunderstanding.</div>
    <span class="fb-issue-tip">always count</span>
  </div>
  <div class="fb-issue-card env">
    <div class="fb-issue-icon">🌍</div>
    <div class="fb-issue-name">Environment problem</div>
    <div class="fb-issue-desc">The application behaves differently across browsers, devices, or test environments.</div>
    <span class="fb-issue-tip">count with a label</span>
  </div>
</div>

**Recommendation:** count every type, but tag each one. That way you get a global IPR number plus the ability to drill down - e.g. *"20 issues, of which 14 functional defects, 4 UX, and 2 environment."*

<div class="fb-dark-box">
  <span class="fb-db-eyebrow">The key perspective</span>
  <h2 class="fb-db-h">Issues per Release is NOT a QA metric</h2>
  <p class="fb-db-intro">It's a quality metric for the entire development process. QA only measures it - but the whole team owns the result. And that is exactly what makes this metric so valuable in a conversation with the Engineering Manager.</p>
  <div class="fb-ow-grid">
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~50%</div>
      <div class="fb-ow-who">Developers</div>
      <div class="fb-ow-why">Code quality, unit tests, code review, self-testing before handoff</div>
      <div class="fb-ow-arrow">→ Definition of Done</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~20%</div>
      <div class="fb-ow-who">Product / Design</div>
      <div class="fb-ow-why">Requirement completeness, spec consistency, designer availability for questions</div>
      <div class="fb-ow-arrow">→ Backlog quality</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~20%</div>
      <div class="fb-ow-who">Team process</div>
      <div class="fb-ow-why">Requirement review before the sprint, Three Amigos, refinement, acceptance criteria</div>
      <div class="fb-ow-arrow">→ Process maturity</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~10%</div>
      <div class="fb-ow-who">QA</div>
      <div class="fb-ow-why">Test case quality, scenario coverage, the test environment</div>
      <div class="fb-ow-arrow">→ Testing effectiveness</div>
    </div>
  </div>
  <div class="fb-db-quote">When IPR rises - the first conversation shouldn't be "QA needs to test better." It should be: "what changed in the development process since the last release?"</div>
</div>

## A trend that says more than any status update

One release means nothing. Six releases with a clear direction - that's a story. And it's the story that convinces the Engineering Manager to act.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Issues per Release - the trend across 6 releases</div>
      <div class="fb-chart-sub">The breakdown by type reveals where the problem lies and what needs intervention</div>
    </div>
    <span class="fb-chart-badge">v2.1 → v2.6</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#3B82F6"></span>Functional defects</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#F59E0B"></span>UX / UI</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#8B5CF6"></span>Performance</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#EF4444"></span>Requirement mismatches</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-ipr-stack" role="img" aria-label="Stacked bar chart: total issues drop from 24 in v2.1 to 4 in v2.6, with functional defects falling fastest (from 16 to 3)."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">IPR vs DDR - the process correlation</div>
      <div class="fb-chart-sub">As IPR falls, DDR rises. Cleaner code entering testing = fewer problems = more caught before production</div>
    </div>
    <span class="fb-chart-badge">mutual dependency</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Issues per Release (count)</span>
    <span class="fb-lg"><span style="width:16px;height:0;border-top:2.5px dashed #2A7A3E;display:inline-block;"></span>DDR (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-corr" role="img" aria-label="Line chart: Issues per Release falls from 24 to 4 across 6 releases, while DDR rises from 78% to 95%. An inverse relationship."></canvas>
  </div>
</div>

## How to read the result

There's no single "good" IPR - it depends on release size, system complexity, and team maturity. But trends are always telling. Below are reference thresholds for a typical release of medium complexity.

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-range">20+</div>
    <div class="fb-tc-label">Alarm signal</div>
    <div class="fb-tc-desc">Worth investigating the causes before continuing the sprint. What changed in the process?</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-range">12-20</div>
    <div class="fb-tc-label">Needs work</div>
    <div class="fb-tc-desc">Requires attention. Check which categories dominate and propose one corrective action.</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-range">6-12</div>
    <div class="fb-tc-label">Solid level</div>
    <div class="fb-tc-desc">Good work. Monitor the trend - is it steadily falling, or oscillating?</div>
  </div>
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-range">&lt;6</div>
    <div class="fb-tc-label">Mature process</div>
    <div class="fb-tc-desc">Excellent result. Check that tests cover the critical paths deeply enough.</div>
  </div>
</div>

**Important caveat:** a low IPR with a low number of tests is not a success - it may mean QA is testing too shallowly. Always pair IPR with test scope and DDR.

## How to start measuring - four steps

Good news: you don't need new tools. The data is already in your tracker - you just need to gather and label it properly.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Define "issue" and write it down in one place</div>
      <div class="fb-step-text">Before you count anything - agree with the team: what goes into the counter? Functional defects, for sure. UX notes? Performance issues? Requirement mismatches?</div>
      <div class="fb-step-text">Write it in Confluence, a wiki, or as a comment on the Jira filter. Consistency of the definition matters more than its perfection.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Set up the "Fix version" field or a release tag in Jira</div>
      <div class="fb-step-text">Every issue created during testing should be assigned to the release it concerns. In Jira that's the "Fix Version/s" field or a custom <code>release-v2.x</code> label.</div>
      <div class="fb-step-code">project = MYAPP AND issuetype in (Bug, Task, Improvement)<br>AND "Fix Version" = "v2.3"<br>AND created &gt;= startOfSprint()<br>ORDER BY created ASC</div>
      <div class="fb-step-text">This filter gives you every issue found while testing a specific release.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Add type labels - from day one</div>
      <div class="fb-step-text">Just "how many" is enough to start. But "how many and of what kind" gives you a far stronger argument in conversations with the EM and PM. Introduce a simple labeling system: <code>type:functional</code>, <code>type:ux</code>, <code>type:perf</code>, <code>type:requirement</code>.</div>
      <div class="fb-step-text">Tagging takes 30 seconds per issue. It pays back many times over at every retrospective and business conversation.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Reconstruct the history - at least the last 4 releases</div>
      <div class="fb-step-text">As with DDR - one data point is too few. Counting IPR retroactively for the last 4-6 releases takes 1-2 hours and gives you a trend right away.</div>
      <div class="fb-step-text">If you don't have type labels for previous releases - that's harder, but the global numbers are still worth it. An IPR trend without the type breakdown is still very telling.</div>
    </div>
  </div>
</div>

### Interactive IPR tracker

Enter the data from your recent releases and you'll immediately see the trend and a rating for each one.

<div class="fb-tracker-wrap">
  <div class="fb-tracker-title">Issues per Release tracker</div>
  <div class="fb-tracker-sub">Enter the issue count for each release - the tracker generates a rating and a trend summary</div>

  <div class="fb-tracker-rows">
    <div class="fb-tracker-row header">
      <span>Release</span><span>Issues (enter)</span><span>IPR</span><span>Rating</span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.1</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="e.g. 24" aria-label="Issues for v2.1">
      <span class="fb-tr-result" id="fb-r1">-</span>
      <span class="fb-tr-badge" id="fb-b1"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.2</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="e.g. 19" aria-label="Issues for v2.2">
      <span class="fb-tr-result" id="fb-r2">-</span>
      <span class="fb-tr-badge" id="fb-b2"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.3</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="e.g. 14" aria-label="Issues for v2.3">
      <span class="fb-tr-result" id="fb-r3">-</span>
      <span class="fb-tr-badge" id="fb-b3"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.4</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="e.g. 11" aria-label="Issues for v2.4">
      <span class="fb-tr-result" id="fb-r4">-</span>
      <span class="fb-tr-badge" id="fb-b4"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.5</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="e.g. 8" aria-label="Issues for v2.5">
      <span class="fb-tr-result" id="fb-r5">-</span>
      <span class="fb-tr-badge" id="fb-b5"></span>
    </div>
  </div>

  <div class="fb-tracker-footer">
    <div class="fb-tf-item"><div class="fb-tf-label">Average IPR</div><div class="fb-tf-val" id="fb-tf-avg">-</div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Trend</div><div class="fb-tf-val"><span class="fb-tf-trend" id="fb-tf-trend">-</span></div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Best release</div><div class="fb-tf-val" id="fb-tf-best">-</div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Total change</div><div class="fb-tf-val" id="fb-tf-change">-</div></div>
  </div>
</div>

## How this metric shifts the dynamic

Without data, the conversation about the quality of code entering testing is hard. QA sounds like complaining, the dev sounds defensive. With IPR in the background - it's a conversation about numbers, not emotions.

<div class="fb-em-conv">
  <div class="fb-em-before">
    <div class="fb-em-tag">✗ Without data - the conversation ends where it started</div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">"We keep getting code full of bugs. We can't work like this."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">"Every release is different, this one was especially big..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">Dev</span><span class="fb-em-text">"We were working under pressure, the deadline was tight..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">"But this isn't the first time..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">"Alright, let's see how the next one goes."</span></div>
  </div>
  <div class="fb-em-after">
    <div class="fb-em-tag">✓ With data - the conversation leads to a concrete action</div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">"I have data from the last 6 releases. IPR was: 8, 11, 9, 21, 28, 32. Something changed after v2.3 - and the trend has been clearly rising ever since."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">"v2.3... that was the sprint when we changed the team composition and dropped code review for faster delivery."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">"Exactly. 80% of the IPR increase is functional defects. I propose one action: reinstating mandatory code review with a checklist for testing."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">"That makes sense. When can we roll it out?"</span></div>
  </div>
</div>

The difference isn't that the QA Lead is more persuasive. It's that **they come with a fact, not a feeling**. An IPR trend of 8 to 32 across 6 releases is undeniable. The opinion "we're getting worse and worse code" - is debatable.

## Three pitfalls when using IPR

<div class="fb-pitfall-grid">
  <div class="fb-pitfall" data-n="01">
    <div class="fb-pitfall-title">You compare releases of different sizes</div>
    <div class="fb-pitfall-text">A release with 3 features and a release with 12 features aren't comparable without normalization. The fix: also track IPR per story point or per feature - or at least mark "large/small/medium" for each release in the historical data.</div>
  </div>
  <div class="fb-pitfall" data-n="02">
    <div class="fb-pitfall-title">Low IPR because QA tests too shallowly</div>
    <div class="fb-pitfall-text">An IPR of 4 may mean excellent code - or tests that don't go deep enough. Always pair IPR with DDR: if IPR falls and DDR also falls - something's wrong with test coverage. If IPR falls and DDR rises - you have real progress.</div>
  </div>
  <div class="fb-pitfall" data-n="03">
    <div class="fb-pitfall-title">You use IPR to judge devs, not the process</div>
    <div class="fb-pitfall-text">This is the most dangerous pitfall - and the fastest route to developers no longer reporting problems themselves, starting to hide them, and treating QA as the enemy. IPR measures process maturity, not people's competence. Communicate that clearly and consistently every time you present this metric.</div>
  </div>
</div>

## IPR in a business conversation

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">"Issues per Release came in at 8 - 40% lower than the previous sprint. Code is entering testing cleaner and cleaner. That's a good signal for the entire development process."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 with EM</span>
    <span class="fb-biz-text">"I have the IPR trend from the last 6 releases - a clear spike after v2.3. It coincided with dropping code review. I'm proposing a concrete action and I want to check whether IPR returns to its previous level within two releases."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Board</span>
    <span class="fb-biz-text">"Over the last four quarters Issues per Release dropped from 24 to 8 - that's 66%. Each issue is on average 1.5 hours of QA work. That's 24 hours saved per release - time we now put into exploratory testing and automation."</span>
  </div>
</div>

## What this metric, missing from the QA handbook, gives you

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">✓ IPR gives you</div>
    <ul class="fb-sum-list">
      <li>An objective gauge of the quality of code entering testing</li>
      <li>An early signal - before escapes reach production</li>
      <li>An argument for the EM conversation based on facts, not opinion</li>
      <li>An indicator of the maturity of the entire development process</li>
      <li>A correlation with DDR - a fuller picture of process health</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">✗ IPR doesn't tell you</div>
    <ul class="fb-sum-list">
      <li>Whether bugs are escaping to production (that's Escaped per Release)</li>
      <li>How effective the testing is (that's DDR)</li>
      <li>Whether you can release (that's Confidence Score)</li>
      <li>Who specifically makes mistakes - and it shouldn't</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">QA is not a repair factory. Issues per Release is the metric that proves it - and moves the quality conversation to where it belongs: the level of the entire development process.</blockquote>

## In the next article

Article five covers **Escaped Bugs per Release** - a metric that doesn't ask how many bugs you have in total, but *which specific releases were risky*. And how that view lets you diagnose causes, not just observe effects.

Spoiler: a spike in a single release is always a signal to investigate. And we have a method for how to run that investigation.

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">The complete guide</a> <span class="fb-s-badge-done">read</span></div>
        <div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title"><a href="/en/blog/defect-detection-ratio-measure-qa-effectiveness/">Defect Detection Ratio</a> <span class="fb-s-badge-done">read</span></div>
        <div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title"><a href="/en/blog/escaped-bugs-problems-full-spectrum/">Escaped Bugs &amp; Problems</a> <span class="fb-s-badge-done">read</span></div>
        <div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">04</span>
      <div>
        <div class="fb-s-title">Issues per Release <span class="fb-s-now">you are here</span></div>
        <div class="fb-s-sub">Rollout from scratch, the link to the development process, the EM conversation</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">05</span>
      <div>
        <div class="fb-s-title"><a href="/en/blog/escaped-bugs-per-release-find-risky-release/">Escaped Bugs per Release - find the risky release</a> <span class="fb-s-badge-done">read</span></div>
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
  --fb-purple: #6D28D9;
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

/* STANDUP */
.fb-standup { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 26px 28px; margin: 28px 0; }
.fb-su-time { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-su-line { display: flex; gap: 14px; margin-bottom: 12px; align-items: flex-start; }
.fb-su-line:last-child { margin-bottom: 0; }
.fb-su-who { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 48px; padding-top: 3px; flex-shrink: 0; color: var(--fb-faint); }
.fb-su-who.em { color: var(--fb-navy); }
.fb-su-who.qa { color: var(--fb-teal); }
.fb-su-who.dev { color: var(--fb-purple); }
.fb-su-msg { font-size: 14px; line-height: 1.6; color: #111; }
.fb-su-msg em { font-style: italic; color: var(--fb-muted); }

/* FORMULA */
.fb-formula-box { background: var(--fb-surface); border: 1.5px solid var(--fb-border); border-radius: 12px; padding: 24px 28px; margin: 22px 0; }
.fb-formula-box.fb-highlight { border-color: var(--fb-gold); background: var(--fb-gold-pale); }
.fb-f-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #7a4f0a; margin-bottom: 12px; }
.fb-formula { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: #7a4f0a; line-height: 1.5; }
.fb-formula-example { background: #fff; border: 1px solid var(--fb-border); border-radius: 8px; padding: 14px 16px; margin-top: 14px; font-family: 'Courier New', monospace; font-size: 13px; color: var(--fb-navy); line-height: 1.7; }
.fb-formula-note { font-size: 12px; color: var(--fb-muted); margin-top: 12px; line-height: 1.55; }

/* ISSUE TYPES */
.fb-issue-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 12px; margin: 22px 0; }
.fb-issue-card { border-radius: 12px; padding: 18px 16px; border: 1.5px solid; }
.fb-issue-card.bug { background: #EFF6FF; border-color: #BFDBFE; }
.fb-issue-card.ux { background: #FFFBEB; border-color: #FDE68A; }
.fb-issue-card.perf { background: #EDE9FE; border-color: #C4B5FD; }
.fb-issue-card.req { background: #FEF2F2; border-color: #FECACA; }
.fb-issue-card.env { background: #F0FDF4; border-color: #BBF7D0; }
.fb-issue-icon { font-size: 20px; margin-bottom: 8px; }
.fb-issue-name { font-size: 12px; font-weight: 700; margin-bottom: 4px; }
.fb-issue-card.bug .fb-issue-name { color: #1D4ED8; }
.fb-issue-card.ux .fb-issue-name { color: #B45309; }
.fb-issue-card.perf .fb-issue-name { color: var(--fb-purple); }
.fb-issue-card.req .fb-issue-name { color: var(--fb-red); }
.fb-issue-card.env .fb-issue-name { color: var(--fb-green); }
.fb-issue-desc { font-size: 12px; color: #444; line-height: 1.5; }
.fb-issue-tip { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; margin-top: 8px; display: inline-block; }
.fb-issue-card.bug .fb-issue-tip { background: #DBEAFE; color: #1D4ED8; }
.fb-issue-card.ux .fb-issue-tip { background: #FEF3C7; color: #B45309; }
.fb-issue-card.perf .fb-issue-tip { background: #EDE9FE; color: var(--fb-purple); }
.fb-issue-card.req .fb-issue-tip { background: #FEE2E2; color: var(--fb-red); }
.fb-issue-card.env .fb-issue-tip { background: #DCFCE7; color: var(--fb-green); }

/* DARK BOX (NOT ONLY QA) */
.fb-dark-box { background: var(--fb-navy); border-radius: 16px; padding: 36px 34px; margin: 36px 0; }
.fb-db-eyebrow { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 10px; }
.fb-db-h { font-family: Georgia, serif; color: #fff !important; margin: 0 0 10px; font-size: 1.5rem; font-weight: 500; line-height: 1.2; }
.fb-db-intro { color: rgba(255,255,255,0.78) !important; font-size: 15px; margin-bottom: 24px; }
.fb-ow-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.fb-ow-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 18px; text-align: center; }
.fb-ow-pct { font-family: Georgia, serif; font-size: 2rem; font-weight: 500; line-height: 1; margin-bottom: 6px; }
.fb-ow-card:nth-child(1) .fb-ow-pct { color: #93C5FD; }
.fb-ow-card:nth-child(2) .fb-ow-pct { color: #FCA5A5; }
.fb-ow-card:nth-child(3) .fb-ow-pct { color: #C4B5FD; }
.fb-ow-card:nth-child(4) .fb-ow-pct { color: #6EE7B7; }
.fb-ow-who { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 4px; }
.fb-ow-why { font-size: 11px; color: rgba(255,255,255,0.62); line-height: 1.45; }
.fb-ow-arrow { font-size: 11px; color: var(--fb-gold); margin-top: 8px; font-weight: 600; }
.fb-db-quote { background: rgba(255,255,255,0.06); border-left: 3px solid var(--fb-gold); border-radius: 0 12px 12px 0; padding: 20px 24px; margin-top: 24px; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; color: #E6F1FB; }

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

/* THRESHOLDS */
.fb-thresh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-thresh-card { border-radius: 12px; padding: 16px; text-align: center; border: 1.5px solid; }
.fb-thresh-card.tc-danger { background: #FEF2F2; border-color: #FECACA; }
.fb-thresh-card.tc-warn { background: #FFFBEB; border-color: #FDE68A; }
.fb-thresh-card.tc-good { background: var(--fb-teal-pale); border-color: #99E6EA; }
.fb-thresh-card.tc-great { background: #F0FDF4; border-color: #BBF7D0; }
.fb-tc-range { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; line-height: 1; margin-bottom: 6px; }
.fb-thresh-card.tc-danger .fb-tc-range { color: #DC2626; }
.fb-thresh-card.tc-warn .fb-tc-range { color: #B45309; }
.fb-thresh-card.tc-good .fb-tc-range { color: var(--fb-teal); }
.fb-thresh-card.tc-great .fb-tc-range { color: var(--fb-green); }
.fb-tc-label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px; }
.fb-thresh-card.tc-danger .fb-tc-label { color: #DC2626; }
.fb-thresh-card.tc-warn .fb-tc-label { color: #B45309; }
.fb-thresh-card.tc-good .fb-tc-label { color: var(--fb-teal); }
.fb-thresh-card.tc-great .fb-tc-label { color: var(--fb-green); }
.fb-tc-desc { font-size: 11px; color: #444; line-height: 1.4; }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 18px; margin-bottom: 20px; }
.fb-step:last-child { margin-bottom: 0; }
.fb-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-body { flex: 1; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }
.fb-step-text + .fb-step-text { margin-top: 8px; }
.fb-step-code { background: var(--fb-navy); color: #93C5FD; font-family: 'Courier New', monospace; font-size: 12px; padding: 12px 16px; border-radius: 8px; margin: 10px 0; line-height: 1.7; overflow-x: auto; }

/* TRACKER */
.fb-tracker-wrap { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 28px 0; }
.fb-tracker-title { font-family: Georgia, serif; font-size: 18px; font-weight: 500; margin-bottom: 6px; color: #111; }
.fb-tracker-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 22px; }
.fb-tracker-rows { display: grid; gap: 10px; margin-bottom: 20px; }
.fb-tracker-row { display: grid; grid-template-columns: 100px 1fr 80px 80px; gap: 10px; align-items: center; }
.fb-tracker-row.header { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); }
@media (max-width: 500px) { .fb-tracker-row { grid-template-columns: 70px 1fr 54px 64px; } }
.fb-tr-label { font-size: 13px; font-weight: 600; color: #111; }
.fb-tr-input { width: 100%; border: 1px solid var(--fb-border); border-radius: 8px; padding: 9px 12px; font-size: 14px; font-weight: 700; font-family: Georgia, serif; color: #111; background: #fff; outline: none; text-align: center; transition: border-color 0.2s; }
.fb-tr-input:focus { border-color: var(--fb-gold); }
.fb-tr-result { font-family: Georgia, serif; font-size: 15px; font-weight: 500; color: var(--fb-navy); text-align: center; }
.fb-tr-badge { font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 20px; text-align: center; }
.fb-tr-badge.badge-danger { background: #FEF2F2; color: var(--fb-red); }
.fb-tr-badge.badge-warn { background: #FFFBEB; color: #B45309; }
.fb-tr-badge.badge-good { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-tr-badge.badge-great { background: #F0FDF4; color: var(--fb-green); }
.fb-tracker-footer { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.fb-tf-item { text-align: center; }
.fb-tf-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 3px; }
.fb-tf-val { font-family: Georgia, serif; font-size: 1.4rem; font-weight: 500; color: var(--fb-navy); }
.fb-tf-trend.down-good { color: var(--fb-green); }
.fb-tf-trend.flat { color: var(--fb-faint); }
.fb-tf-trend.up-bad { color: var(--fb-red); }

/* EM CONVERSATION */
.fb-em-conv { border: 1px solid var(--fb-border); border-radius: 12px; overflow: hidden; margin: 24px 0; }
.fb-em-before, .fb-em-after { padding: 22px 24px; }
.fb-em-before { background: #FEF2F2; border-bottom: 1px solid var(--fb-border); }
.fb-em-after { background: #F0FDF4; }
.fb-em-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 12px; }
.fb-em-before .fb-em-tag { color: var(--fb-red); }
.fb-em-after .fb-em-tag { color: var(--fb-green); }
.fb-em-line { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
.fb-em-line:last-child { margin-bottom: 0; }
.fb-em-who { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 34px; padding-top: 2px; flex-shrink: 0; }
.fb-em-before .fb-em-who { color: #8a3030; }
.fb-em-after .fb-em-who { color: #1f5c2e; }
.fb-em-text { font-size: 13px; line-height: 1.6; color: #111; }

/* PITFALLS */
.fb-pitfall-grid { display: grid; gap: 12px; margin: 22px 0; }
.fb-pitfall { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
.fb-pitfall::before { content: attr(data-n); position: absolute; right: 14px; top: 8px; font-family: Georgia, serif; font-size: 3.5rem; font-weight: 300; color: var(--fb-border); line-height: 1; }
.fb-pitfall-title { font-size: 14px; font-weight: 700; color: var(--fb-red); margin-bottom: 8px; position: relative; z-index: 1; }
.fb-pitfall-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; position: relative; z-index: 1; }

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

/* DARK MODE - load-bearing contrast fixes (source is light-only) */
:root[data-theme="dark"] .fb-article .fb-standup,
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-tracker-wrap,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-su-msg,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-tracker-title,
:root[data-theme="dark"] .fb-article .fb-tr-label,
:root[data-theme="dark"] .fb-article .fb-tr-result,
:root[data-theme="dark"] .fb-article .fb-tf-val,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-su-msg em,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-tracker-sub,
:root[data-theme="dark"] .fb-article .fb-tf-label,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-pitfall-text,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-su-who { color: #b5b5b5; }
:root[data-theme="dark"] .fb-article .fb-su-who.em { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-su-who.qa { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-su-who.dev { color: #C4B5FD; }
:root[data-theme="dark"] .fb-article .fb-tr-input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-tracker-footer { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-pitfall { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-pitfall-title { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-pitfall::before { color: rgba(255,255,255,0.08); }
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
  function initCharts() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    mount(document.getElementById('fb-c-ipr-stack'), {
      type: 'bar',
      data: {
        labels: ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.5', 'v2.6'],
        datasets: [
          { label: 'Functional defects', data: [16, 13, 9, 7, 5, 3], backgroundColor: '#3B82F6', stack: 's' },
          { label: 'UX / UI', data: [4, 3, 5, 2, 2, 1], backgroundColor: '#F59E0B', stack: 's' },
          { label: 'Performance', data: [2, 2, 3, 1, 1, 0], backgroundColor: '#8B5CF6', stack: 's' },
          { label: 'Requirement mismatches', data: [2, 1, 4, 1, 0, 0], backgroundColor: '#EF4444', borderRadius: { topLeft: 4, topRight: 4 }, stack: 's' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { footer: function (items) { return 'Total: ' + items.reduce(function (s, i) { return s + i.raw; }, 0) + ' issues'; } } } },
        scales: {
          x: { stacked: true, grid: { display: false }, border: { display: false } },
          y: { stacked: true, grid: { color: grid }, border: { display: false }, ticks: { stepSize: 5 } }
        }
      }
    });
    mount(document.getElementById('fb-c-corr'), {
      type: 'line',
      data: {
        labels: ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.5', 'v2.6'],
        datasets: [
          { label: 'Issues per Release', data: [24, 19, 21, 11, 8, 4], borderColor: '#0E1F3D', backgroundColor: 'rgba(14,31,61,.08)', borderWidth: 2.5, pointBackgroundColor: '#0E1F3D', pointRadius: 5, fill: true, tension: 0.35, yAxisID: 'y' },
          { label: 'DDR (%)', data: [78, 82, 80, 88, 91, 95], borderColor: '#2A7A3E', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [6, 4], pointBackgroundColor: '#2A7A3E', pointStyle: 'triangle', pointRadius: 6, fill: false, tension: 0.35, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 30, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'Issues', font: { size: 10 }, color: '#0E1F3D' } },
          y1: { position: 'right', min: 60, max: 100, ticks: { callback: function (v) { return v + '%'; } }, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'DDR', font: { size: 10 }, color: '#2A7A3E' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
  function initTracker() {
    var labels = ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.5'];
    var inputs = document.querySelectorAll('.fb-tracker-row:not(.header) .fb-tr-input');
    if (!inputs.length) return;
    function getBadge(n) {
      if (n === null || isNaN(n)) return { text: '', cls: '' };
      if (n >= 20) return { text: '⚠ Alarm', cls: 'badge-danger' };
      if (n >= 12) return { text: 'Needs work', cls: 'badge-warn' };
      if (n >= 6) return { text: 'Solid', cls: 'badge-good' };
      return { text: 'Great', cls: 'badge-great' };
    }
    function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
    function update() {
      var vals = [];
      inputs.forEach(function (inp, i) {
        var v = inp.value === '' ? null : parseInt(inp.value, 10);
        vals.push(v);
        var rEl = document.getElementById('fb-r' + (i + 1));
        var bEl = document.getElementById('fb-b' + (i + 1));
        if (v === null || isNaN(v)) {
          if (rEl) rEl.textContent = '-';
          if (bEl) { bEl.textContent = ''; bEl.className = 'fb-tr-badge'; }
        } else {
          if (rEl) rEl.textContent = v;
          var b = getBadge(v);
          if (bEl) { bEl.textContent = b.text; bEl.className = 'fb-tr-badge ' + b.cls; }
        }
      });
      var filled = vals.filter(function (v) { return v !== null && !isNaN(v); });
      if (filled.length === 0) {
        ['fb-tf-avg', 'fb-tf-best', 'fb-tf-change'].forEach(function (id) { setText(id, '-'); });
        var tEl0 = document.getElementById('fb-tf-trend');
        if (tEl0) { tEl0.textContent = '-'; tEl0.className = 'fb-tf-trend'; }
        return;
      }
      var avg = (filled.reduce(function (a, b) { return a + b; }, 0) / filled.length).toFixed(1);
      setText('fb-tf-avg', avg);
      var best = Math.min.apply(null, filled);
      var bestIdx = vals.indexOf(best);
      setText('fb-tf-best', bestIdx >= 0 ? labels[bestIdx] : '-');
      var tEl = document.getElementById('fb-tf-trend');
      if (filled.length >= 2 && tEl) {
        var first = filled[0], last = filled[filled.length - 1];
        var diff = last - first;
        if (diff < -2) { tEl.textContent = '↓ Decreasing'; tEl.className = 'fb-tf-trend down-good'; setText('fb-tf-change', diff + ' issues'); }
        else if (diff > 2) { tEl.textContent = '↑ Increasing'; tEl.className = 'fb-tf-trend up-bad'; setText('fb-tf-change', '+' + diff + ' issues'); }
        else { tEl.textContent = '→ Stable'; tEl.className = 'fb-tf-trend flat'; setText('fb-tf-change', diff + ' issues'); }
      } else if (tEl) {
        tEl.textContent = '-'; tEl.className = 'fb-tf-trend';
        setText('fb-tf-change', '-');
      }
    }
    inputs.forEach(function (inp) { inp.addEventListener('input', update); });
    update();
  }
  function boot() { ensureChart(initCharts); initTracker(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
