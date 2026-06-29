---
title: "Release Confidence Score step by step"
description: "How to combine five QA metrics into a single decision indicator. Three calculation models - traffic light, weighted, with a disqualifier - an interactive calculator, and how the Confidence Score changes QA's position in the company. Article 7 of 9."
date: 2026-06-30
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 16
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 7 of 9</p>

<p class="fb-lead">Steering committee. Tension is rising, and a big release decision hangs in the air. The CTO looks at the QA Lead and asks the traditional question: can we safely ship the new version? This time there is no evasive „probably", no listing of dozens of open bugs. Instead, a concrete answer lands: „The Confidence Score is 91%, and the team recommends shipping."</p>

<div class="fb-steer">
  <div class="fb-steer-time">Steering Committee · v4.0 release decision</div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg">„It's a big release. Can we ship it on Friday, or do we push it?"</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who qa">QA</span><span class="fb-steer-msg win">„Confidence Score is 91%. Zero open blockers, regression at 96%, all critical paths green. We recommend GO."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg">„And that payment module we talked about?"</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who qa">QA</span><span class="fb-steer-msg">„That's the only reason we're not at 100%. One medium-priority bug, known, with a workaround. Hence 91%, not more."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg win">„Got it. We ship Friday."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who po">PO</span><span class="fb-steer-msg"><em>Decision made in 90 seconds. No table with 20 charts. No tug-of-war.</em></span></div>
</div>

This isn't an idealistic vision - it's the precise goal the whole series leads toward. Six earlier pieces described five different metrics. In this seventh one we combine them into a single, remarkably useful decision tool - the **Release Confidence Score**.

If you take only one thing from this series, let it be this metric - because it's what turns QA metrics into a real voice in business discussions.

## A metric that looks forward, not back

All the metrics covered in earlier articles are lagging indicators. DDR, escaped bugs, issues per release - they all measure what's already behind us. They're excellent for trend analysis and assessing past work, but they don't answer the key question asked before a release.

<div class="fb-ll-wrap">
  <div class="fb-ll-card fb-ll-lagging">
    <div class="fb-ll-icon">📉</div>
    <span class="fb-ll-tag">Lagging - trailing indicators</span>
    <div class="fb-ll-title">The series' five metrics</div>
    <div class="fb-ll-desc">They measure the past and assess work already done. Excellent for trend analysis and budgeting.</div>
    <div class="fb-ll-list">DDR · Escaped Bugs · Issues/Release · Escaped/Release · Number of Releases</div>
  </div>
  <div class="fb-ll-card fb-ll-leading">
    <div class="fb-ll-icon">🎯</div>
    <span class="fb-ll-tag">Leading - a forward indicator</span>
    <div class="fb-ll-title">Release Confidence Score</div>
    <div class="fb-ll-desc">It focuses on the present and verifies whether we're ready to ship at this very second. A strictly decision-oriented indicator.</div>
    <div class="fb-ll-list">Blockers · Regression · Critical paths - state at the moment of decision</div>
  </div>
</div>

Release Confidence Score is a **leading indicator**. Instead of asking about the past, it examines our immediate readiness. It's the only metric in the QA arsenal that genuinely shapes a decision before it is finally made.

<div class="fb-quote">The other metrics judge the match after the whistle. Confidence Score is the final huddle in the locker room - before you step onto the pitch.</div>

## What the Confidence Score is built from

Regardless of the calculation model you choose, the Confidence Score rests on three fundamental elements. Three questions you must be able to answer before every release.

<div class="fb-comp-grid">
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🚫</div>
    <div class="fb-comp-weight">40%</div>
    <div class="fb-comp-name">Open blockers</div>
    <div class="fb-comp-desc">Counts the critical bugs that make a release impossible. A binary condition - the presence of blockers halts the release.</div>
  </div>
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🔄</div>
    <div class="fb-comp-weight">35%</div>
    <div class="fb-comp-name">Regression results</div>
    <div class="fb-comp-desc">Looks at the percentage of passing tests. We don't have to chase a perfect 100%, but a result around 60% is an immediate alarm signal.</div>
  </div>
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🛣️</div>
    <div class="fb-comp-weight">25%</div>
    <div class="fb-comp-name">Critical paths</div>
    <div class="fb-comp-desc">Checks that key business features work - things like login or payments - that we cannot break under any circumstances.</div>
  </div>
</div>

The proposed 40/35/25 weights are only a starting point. Adapt them to your own product: if critical paths matter more than broad regression coverage, change the proportions. What matters is to set them once and communicate them transparently.

## Three calculation models - from simple to production-grade

There's no single universal way to compute this indicator. We can distinguish three models of increasing sophistication - start with the basic one and grow it as the team matures.

<div class="fb-model m1">
  <div class="fb-model-header">
    <div class="fb-model-badge">1</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Traffic Light</div>
      <div class="fb-model-level">Level: starting · simplest</div>
    </div>
  </div>
  <div class="fb-model-desc">Three conditions, each based on binary logic. No computing complicated percentages - a clean set of traffic lights. Ideal at the very start, when you want to quickly build a shared language with the business.</div>
  <div class="fb-tl-conditions">
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> Zero open blockers</div>
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> Regression passed ≥ 90%</div>
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> All critical paths green</div>
  </div>
  <div class="fb-tl-verdicts">
    <div class="fb-tl-v fb-tl-v-go">3/3 = GO</div>
    <div class="fb-tl-v fb-tl-v-cond">2/3 = CONDITIONAL</div>
    <div class="fb-tl-v fb-tl-v-hold">≤1/3 = HOLD</div>
  </div>
  <div class="fb-model-example" style="margin-top:14px;"><strong>Plus:</strong> simple, understandable to anyone in seconds. <strong>Minus:</strong> it produces no percentage value, which makes it harder to track subtle fluctuations and trends between sprints.</div>
</div>

<div class="fb-model m2">
  <div class="fb-model-header">
    <div class="fb-model-badge">2</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Weighted average</div>
      <div class="fb-model-level">Level: intermediate · precise</div>
    </div>
  </div>
  <div class="fb-model-desc">A more precise approach that computes a single percentage result based on weights assigned to each component. It lets you comfortably track long-term trends over time and is the most popular choice in mature teams.</div>
  <div class="fb-model-formula">Confidence Score = (blockers × 0.40) + (regression × 0.35) + (paths × 0.25)</div>
  <div class="fb-model-example">
    <strong>Example:</strong> 0 blockers (= 100), regression 85%, 3 of 4 critical paths OK (= 75%)<br>
    = (100 × 0.40) + (85 × 0.35) + (75 × 0.25)<br>
    = 40 + 29.75 + 18.75 = <strong>88.5%</strong>
  </div>
</div>

<div class="fb-model m3">
  <div class="fb-model-header">
    <div class="fb-model-badge">3</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Weighted with a disqualifier</div>
      <div class="fb-model-level">Level: production · safest</div>
    </div>
  </div>
  <div class="fb-model-desc">A variant based on the second model, extended with a hard safety rule: if even a single open blocker is present, the final result is automatically capped at a maximum of 50% - regardless of the state of the other components.</div>
  <div class="fb-model-formula">IF blockers > 0 → Confidence Score = min(weighted_score, 50%)<br>OTHERWISE → Confidence Score = weighted_score</div>
  <div class="fb-alert">
    <p><strong>Why does this matter?</strong> Using a calculation model without a disqualifying mechanism leads to dangerous situations where serious bugs get lost in a high average of other indicators. One payment blocker must disqualify a release, even when everything else looks perfect - and model 3 enforces that mathematically.</p>
  </div>
</div>

<div class="fb-quote">My recommendation: start with model 2 plus the disqualifier from model 3. Adjust the weights to your context. But above all - set the formula once, write it down, and stick to it. Stakeholders need to know that 94% means the same thing in sprint 10 as in sprint 30.</div>

## Confidence Score calculator

Switch between the three models, set the components, and watch how the result and recommendation change. This is exactly the calculator you can recreate in a spreadsheet for your team.

<div class="fb-calc">
  <div class="fb-calc-title">Calculate your Release Confidence Score</div>
  <div class="fb-calc-sub">Choose a model and set the release parameters</div>

  <div class="fb-calc-tabs">
    <button class="fb-calc-tab active" data-model="1">1 · Traffic Light</button>
    <button class="fb-calc-tab" data-model="2">2 · Weighted</button>
    <button class="fb-calc-tab" data-model="3">3 · With disqualifier</button>
  </div>

  <div class="fb-calc-fields">
    <div class="fb-calc-field">
      <label>Open blockers (critical bugs)</label>
      <div class="fb-calc-stepper">
        <button class="fb-calc-step-btn" data-step="-1" aria-label="Fewer blockers">−</button>
        <span class="fb-calc-step-val" id="fb-c-blockers">0</span>
        <button class="fb-calc-step-btn" data-step="1" aria-label="More blockers">+</button>
        <span class="fb-calc-step-hint" id="fb-c-blockers-hint">no blockers</span>
      </div>
    </div>
    <div class="fb-calc-field">
      <label>Regression result</label>
      <div class="fb-calc-field-row">
        <input type="range" id="fb-c-regression" min="0" max="100" value="96">
        <span class="fb-calc-field-val" id="fb-c-regression-val">96%</span>
      </div>
    </div>
    <div class="fb-calc-field">
      <label>Critical paths working</label>
      <div class="fb-calc-field-row">
        <input type="range" id="fb-c-paths" min="0" max="100" value="100" step="25">
        <span class="fb-calc-field-val" id="fb-c-paths-val">4/4</span>
      </div>
    </div>
  </div>

  <div class="fb-calc-result">
    <div class="fb-calc-score score-go" id="fb-c-score">GO</div>
    <span class="fb-calc-verdict cv-go" id="fb-c-verdict">All conditions met</span>
    <div class="fb-calc-breakdown" id="fb-c-breakdown" style="display:none;"></div>
  </div>
</div>

## How five metrics feed one indicator

The Confidence Score is a mechanism fully embedded in the ecosystem of the metrics described earlier. The whole series starts working as a coherent system, in which lagging data feeds a leading indicator.

<div class="fb-funnel">
  <div class="fb-funnel-title">Five metrics → Confidence Score → Decision</div>
  <div class="fb-funnel-inputs">
    <div class="fb-fi-card">
      <div class="fb-fi-num">01</div>
      <div class="fb-fi-name">DDR</div>
      <div class="fb-fi-role">Lets us precisely calibrate our confidence threshold for regression tests</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">02</div>
      <div class="fb-fi-name">Escaped Bugs</div>
      <div class="fb-fi-role">Help us accurately define what truly counts as a critical path</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">03</div>
      <div class="fb-fi-name">Issues / Release</div>
      <div class="fb-fi-role">Provides signals about the potential number of blocking bugs</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">04</div>
      <div class="fb-fi-name">Escaped / Release</div>
      <div class="fb-fi-role">Outlines the historical backdrop and overall risk for similar releases</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">05</div>
      <div class="fb-fi-name">Number of Releases</div>
      <div class="fb-fi-role">Helps us understand release frequency and the size of the changes shipped</div>
    </div>
  </div>
  <div class="fb-funnel-arrow">↓</div>
  <div class="fb-funnel-out">
    <div class="fb-fo-label">Leading indicator</div>
    <div class="fb-fo-metric">Release Confidence Score</div>
    <div class="fb-fo-sub">In a nutshell: five raw data points go in, and a concise recommendation comes out: GO / CONDITIONAL / HOLD</div>
  </div>
</div>

This is the heart of the whole series. Individual metrics are dry facts. The Confidence Score is the story that forges those facts into a decision. **Five numbers go in at the top, one recommendation comes out at the bottom** - in a language leadership grasps instantly.

## How the Confidence Score changes QA's position in the company

<div class="fb-strat">
  <p class="fb-strat-intro">This isn't just another number in a spreadsheet. The Confidence Score acts as a lever that transforms QA's role inside the company, moving us from the very end of the process straight to the decision table.</p>
  <div class="fb-transform">
    <div class="fb-tr-state fb-tr-before">
      <div class="fb-tr-role">Before</div>
      <div class="fb-tr-title">Gatekeeper</div>
      <div class="fb-tr-desc">QA is mainly associated with saying „no" at the tail end of the process. The team is often seen as an obstacle or bottleneck, and key decisions are frequently made without its real involvement.</div>
    </div>
    <div class="fb-tr-arrow">→</div>
    <div class="fb-tr-state fb-tr-after">
      <div class="fb-tr-role">After</div>
      <div class="fb-tr-title">Decision partner</div>
      <div class="fb-tr-desc">QA delivers a clear indicator that the business relies on. The Confidence Score becomes a fixed element of steering committee meetings, and QA co-creates decisions as an equal partner.</div>
    </div>
  </div>
  <div class="fb-strat-quote">When the CTO starts asking about the Confidence Score on their own - before every release, without you reminding them - that's the moment you know QA has stopped being a cost and become part of the decision-making process.</div>
</div>

This shift doesn't happen after one good report. It's the result of consistency - when the indicator proves accurate once, twice, and ten times. When a score of 62% really does foreshadow a hard release, and 94% means a fully smooth process. That's when the number earns trust, which automatically translates into the standing of the team that delivers it.

## How to launch the Confidence Score in four steps

Launching this mechanism is surprisingly fast and can be wrapped up within one or two sprints.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Choose a model and define the components</div>
      <div class="fb-step-text">Start with model 2 plus the disqualifier. Write down unambiguous, firm definitions: what exactly counts as a „blocker"? What regression level is the required minimum? Which paths are critical (usually 3-6 key processes)? Consistency in these rules builds trust in the indicator.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Collect component data from existing tools</div>
      <div class="fb-step-text">Pull data from the systems you already use daily. You'll get blockers from Jira (the right filter by priority and status), regression data from automation reports or TestRail, and critical-path status from a smoke suite or E2E checklists. You already have this data - you just need to bring it together.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Backfill the score for the last 3-5 releases</div>
      <div class="fb-step-text">Compute the indicator retroactively for a few recent releases before you officially present it to the company. Check whether the results match reality: did the problematic releases have a low score, and the smooth ones a high one? This upfront validation is your strongest argument.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Introduce it at the sprint review - one slide, one number</div>
      <div class="fb-step-text">Start with a simple message: one slide showing the Confidence Score, its three components, and a clear recommendation. Instead of burying your audience under dozens of charts, say: „The Confidence Score is X%. We recommend GO because...". You'll find that after a few sprints the business starts asking for the number itself.</div>
    </div>
  </div>
</div>

## Three pitfalls with the Confidence Score

<div class="fb-pit-grid">
  <div class="fb-pit">
    <div class="fb-pit-n">01</div>
    <div class="fb-pit-title">Tweaking the formula when you don't like the result</div>
    <div class="fb-pit-text">Adjusting weights and definitions „on the fly", just to get an optimistic result for a problematic release, utterly destroys the tool's credibility. The formula should be fixed. Changes can be made deliberately once a quarter, but never ad hoc for a specific release.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">02</div>
    <div class="fb-pit-title">Confidence Score without a disqualifier for blockers</div>
    <div class="fb-pit-text">Dropping the disqualifying mechanism distorts the picture. A beautiful regression state can push the average up to 88% even with an open payment blocker, giving a false sense of safety. A critical bug must firmly lower the release's score.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">03</div>
    <div class="fb-pit-title">Treating the score as an oracle instead of decision support</div>
    <div class="fb-pit-text">The Confidence Score is not an automaton or an infallible oracle. The tool is only meant to support experts, and the final decision should always include human review. The number is a strong anchor, but it doesn't replace the QA Lead's professional judgment.</div>
  </div>
</div>

## Confidence Score in conversation with the business

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„This release's Confidence Score is 94%. Zero blockers, regression at 97%, all critical paths green. We recommend GO."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Steering - hold</span>
    <span class="fb-biz-text">„We're at 62%. We have two open blockers in the payment module and regression at 71%. We recommend holding the release until the blockers are fixed - we estimate two working days."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Leadership</span>
    <span class="fb-biz-text">„We introduced the Release Confidence Score as a single decision indicator. Over the last quarter its accuracy held up in 100% of cases - every release scoring above 90% went through smoothly, and both held releases had real problems. It's a tool that lowers the risk of every release decision."</span>
  </div>
</div>

## Why this is the most important metric in the series

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">The Confidence Score gives you</div>
    <ul class="fb-sum-list">
      <li>One clear value answering the question: „can we ship safely?"</li>
      <li>A leading indicator that shapes decisions before they're finalized</li>
      <li>A transparent, shared language with the business in decision meetings</li>
      <li>A synthesis of the series' five key metrics in one clear point</li>
      <li>An effective lever to transform QA's role from reviewer to partner</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">The Confidence Score requires</div>
    <ul class="fb-sum-list">
      <li>Iron discipline in applying the formula - no ad hoc tweaks</li>
      <li>Using the disqualifying mechanism when blockers are present (model 3)</li>
      <li>Upfront validation of historical data before showing it to the business</li>
      <li>Leaving room for human judgment - the indicator supports, it doesn't replace the leader</li>
    </ul>
  </div>
</div>

<div class="fb-quote">Five metrics tell you what happened. The Confidence Score tells you what to do now. That's the difference between QA that reports and QA that decides.</div>

## In the next article

You now have the metrics and you understand the structure of the Confidence Score. The eighth article answers the key question that decides whether all these changes succeed: **how do you communicate the numbers you've gathered so the business actually listens?** We'll look at storytelling with data - how to turn dry tables into an engaging business narrative. Even the most precise indicator loses its value if you don't present it in a way that directly drives the right decision.

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/en/blog/qa-metrics-business-wants-to-hear/">The complete guide</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/en/blog/defect-detection-ratio-measure-qa-effectiveness/">Defect Detection Ratio</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-problems-full-spectrum/">Escaped Bugs &amp; Problems</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/en/blog/issues-per-release-code-maturity-metric/">Issues per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Rollout from scratch, the link to the development process, the EM conversation</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/en/blog/escaped-bugs-per-release-find-risky-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Pinpointing problems, not just watching trends</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">06</span><div><div class="fb-s-title"><a href="/en/blog/number-of-releases-context-metric/">Number of Releases</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Why 3 bugs with 2 releases is a disaster, and with 15 - a success</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">07</span><div><div class="fb-s-title">Release Confidence Score <span class="fb-s-now">you are here</span></div><div class="fb-s-sub">Three calculation models, rollout, concrete examples from practice</div></div></li>
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
  --fb-blue: #1D4ED8;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-quote { background: var(--fb-surface); border-left: 3px solid var(--fb-gold); padding: 22px 26px; margin: 32px 0; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; }

/* STEERING STORY */
.fb-steer { background: var(--fb-navy); border-radius: 12px; padding: 28px 30px; margin: 28px 0; }
.fb-steer-time { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-steer-line { display: flex; gap: 12px; margin-bottom: 11px; align-items: flex-start; }
.fb-steer-line:last-child { margin-bottom: 0; }
.fb-steer-who { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 46px; padding-top: 3px; flex-shrink: 0; }
.fb-steer-who.cto { color: var(--fb-gold); }
.fb-steer-who.qa { color: #6EE7B7; }
.fb-steer-who.po { color: #93C5FD; }
.fb-steer-msg { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.85); }
.fb-steer-msg em { font-style: italic; color: rgba(255,255,255,0.55); }
.fb-steer-msg.win { color: #6EE7B7; font-weight: 500; }

/* LEADING / LAGGING */
.fb-ll-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 24px 0; }
@media (max-width: 560px) { .fb-ll-wrap { grid-template-columns: 1fr; } }
.fb-ll-card { border-radius: 12px; padding: 22px; border: 1.5px solid; }
.fb-ll-lagging { background: var(--fb-surface); border-color: var(--fb-border); }
.fb-ll-leading { background: #EFF6FF; border-color: #BFDBFE; }
.fb-ll-icon { font-size: 22px; margin-bottom: 10px; }
.fb-ll-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 10px; }
.fb-ll-lagging .fb-ll-tag { background: #E5E1D8; color: #4a4a4a; }
.fb-ll-leading .fb-ll-tag { background: #DBEAFE; color: var(--fb-blue); }
.fb-ll-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-ll-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-ll-list { font-size: 11px; color: var(--fb-faint); margin-top: 10px; line-height: 1.6; }

/* COMPONENTS */
.fb-comp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
@media (max-width: 560px) { .fb-comp-grid { grid-template-columns: 1fr; } }
.fb-comp-card { border-radius: 12px; padding: 20px; border: 1.5px solid var(--fb-border); background: var(--fb-surface); text-align: center; }
.fb-comp-icon { font-size: 24px; margin-bottom: 10px; }
.fb-comp-weight { font-family: Georgia, serif; font-size: 2rem; font-weight: 500; color: var(--fb-navy); line-height: 1; margin-bottom: 6px; }
.fb-comp-name { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 5px; }
.fb-comp-desc { font-size: 11px; color: var(--fb-muted); line-height: 1.5; }

/* MODELS */
.fb-model { border: 1.5px solid var(--fb-border); border-radius: 16px; padding: 26px; margin: 20px 0; }
.fb-model.m1 { border-color: #BBF7D0; }
.fb-model.m2 { border-color: #FDE68A; }
.fb-model.m3 { border-color: #BFDBFE; }
.fb-model-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.fb-model-badge { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 500; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; }
.fb-model.m1 .fb-model-badge { background: var(--fb-green); }
.fb-model.m2 .fb-model-badge { background: var(--fb-amber); }
.fb-model.m3 .fb-model-badge { background: var(--fb-blue); }
.fb-model-titles { flex: 1; }
.fb-model-name { font-family: Georgia, serif; font-size: 18px; font-weight: 500; color: #111; line-height: 1.2; }
.fb-model-level { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); margin-top: 2px; }
.fb-model-desc { font-size: 14px; color: var(--fb-muted); line-height: 1.6; margin-bottom: 16px; }
.fb-model-formula { background: var(--fb-navy); border-radius: 10px; padding: 16px 18px; font-family: 'Courier New', monospace; font-size: 12px; color: #93C5FD; line-height: 1.7; margin-bottom: 14px; overflow-x: auto; }
.fb-model-example { background: var(--fb-surface); border-radius: 8px; padding: 14px 16px; font-size: 13px; color: var(--fb-muted); line-height: 1.6; }
.fb-model-example strong { color: #111; }
.fb-tl-conditions { display: grid; gap: 8px; margin: 14px 0; }
.fb-tl-cond { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--fb-surface); border-radius: 8px; font-size: 13px; color: #111; }
.fb-tl-check { width: 20px; height: 20px; border-radius: 50%; background: var(--fb-green); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.fb-tl-verdicts { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
.fb-tl-v { flex: 1; min-width: 90px; text-align: center; padding: 12px; border-radius: 8px; font-size: 11px; font-weight: 700; }
.fb-tl-v-go { background: #F0FDF4; color: var(--fb-green); border: 1px solid #BBF7D0; }
.fb-tl-v-cond { background: #FFFBEB; color: var(--fb-amber); border: 1px solid #FDE68A; }
.fb-tl-v-hold { background: #FEF2F2; color: var(--fb-red); border: 1px solid #FECACA; }
.fb-alert { background: #EFF6FF; border: 1.5px solid #BFDBFE; border-radius: 12px; padding: 18px 20px; margin: 14px 0; }
.fb-alert p { color: var(--fb-blue); font-size: 13px; margin: 0; line-height: 1.6; }
.fb-alert strong { color: #1E3A8A; }

/* CALCULATOR */
.fb-calc { background: var(--fb-navy); border-radius: 18px; padding: 34px; margin: 28px 0; box-shadow: 0 12px 48px rgba(14,31,61,0.18); }
.fb-calc-title { font-family: Georgia, serif; font-size: 22px; font-weight: 500; color: #fff; margin-bottom: 6px; }
.fb-calc-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 26px; }
.fb-calc-tabs { display: flex; gap: 8px; margin-bottom: 26px; background: rgba(255,255,255,0.05); padding: 5px; border-radius: 12px; }
.fb-calc-tab { flex: 1; padding: 10px 8px; border-radius: 8px; border: none; background: transparent; color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; text-align: center; }
.fb-calc-tab.active { background: var(--fb-gold); color: var(--fb-navy); }
.fb-calc-tab:hover:not(.active) { color: rgba(255,255,255,0.9); }
.fb-calc-fields { display: grid; gap: 20px; margin-bottom: 26px; }
.fb-calc-field label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.6); display: block; margin-bottom: 10px; }
.fb-calc-field-row { display: flex; align-items: center; gap: 14px; }
.fb-calc-field input[type=range] { flex: 1; height: 6px; border-radius: 5px; background: rgba(255,255,255,0.15); outline: none; -webkit-appearance: none; appearance: none; }
.fb-calc-field input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--fb-gold); cursor: pointer; border: 3px solid var(--fb-navy); box-shadow: 0 0 0 1px var(--fb-gold); }
.fb-calc-field input[type=range]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--fb-gold); cursor: pointer; border: 3px solid var(--fb-navy); }
.fb-calc-field-val { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 500; color: #fff; min-width: 70px; text-align: right; }
.fb-calc-stepper { display: flex; align-items: center; gap: 10px; }
.fb-calc-step-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; font-size: 18px; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.fb-calc-step-btn:hover { background: rgba(255,255,255,0.16); }
.fb-calc-step-val { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #fff; min-width: 44px; text-align: center; }
.fb-calc-step-hint { font-size: 12px; color: rgba(255,255,255,0.5); margin-left: 8px; }
.fb-calc-result { background: rgba(255,255,255,0.06); border-radius: 14px; padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,0.1); }
.fb-calc-score { font-family: Georgia, serif; font-size: 4rem; font-weight: 500; line-height: 1; margin-bottom: 8px; transition: color 0.3s; }
.fb-calc-verdict { display: inline-block; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 8px 20px; border-radius: 24px; transition: all 0.3s; }
.cv-go { background: var(--fb-green); color: #fff; }
.cv-cond { background: var(--fb-amber); color: #fff; }
.cv-hold { background: var(--fb-red); color: #fff; }
.score-go { color: #6EE7B7; }
.score-cond { color: #FCD34D; }
.score-hold { color: #FCA5A5; }
.fb-calc-breakdown { margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); display: grid; gap: 10px; text-align: left; }
.fb-cb-row { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
.fb-cb-label { color: rgba(255,255,255,0.6); }
.fb-cb-value { font-family: 'Courier New', monospace; color: #93C5FD; font-weight: 700; }
.fb-cb-disq { background: rgba(176,51,51,0.2); border: 1px solid rgba(176,51,51,0.4); border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #FCA5A5; margin-top: 6px; }

/* FUNNEL */
.fb-funnel { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 30px; margin: 28px 0; }
.fb-funnel-title { font-family: Georgia, serif; font-size: 17px; font-weight: 500; text-align: center; margin-bottom: 24px; color: #111; }
.fb-funnel-inputs { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; margin-bottom: 8px; }
@media (max-width: 600px) { .fb-funnel-inputs { grid-template-columns: 1fr 1fr; } }
.fb-fi-card { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 14px 10px; text-align: center; }
.fb-fi-num { font-size: 10px; font-weight: 700; color: var(--fb-gold); margin-bottom: 4px; }
.fb-fi-name { font-size: 11px; font-weight: 600; color: #111; line-height: 1.3; margin-bottom: 6px; min-height: 28px; display: flex; align-items: center; justify-content: center; }
.fb-fi-role { font-size: 10px; color: var(--fb-faint); line-height: 1.35; }
.fb-funnel-arrow { text-align: center; font-size: 20px; color: var(--fb-gold); margin: 8px 0; }
.fb-funnel-out { background: var(--fb-navy); border-radius: 12px; padding: 22px; text-align: center; }
.fb-fo-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 6px; }
.fb-fo-metric { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #fff; }
.fb-fo-sub { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 4px; line-height: 1.5; }

/* STRATEGIC */
.fb-strat { background: var(--fb-navy); border-radius: 16px; padding: 34px; margin: 28px 0; }
.fb-strat-intro { color: rgba(255,255,255,0.6); margin-bottom: 24px; font-size: 15px; line-height: 1.7; }
.fb-transform { display: grid; grid-template-columns: 1fr auto 1fr; gap: 18px; align-items: center; }
@media (max-width: 560px) { .fb-transform { grid-template-columns: 1fr; } }
.fb-tr-state { border-radius: 12px; padding: 22px; text-align: center; }
.fb-tr-before { background: rgba(176,51,51,0.15); border: 1px solid rgba(252,165,165,0.35); }
.fb-tr-after { background: rgba(42,122,62,0.15); border: 1px solid rgba(110,231,183,0.35); }
.fb-tr-role { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 10px; }
.fb-tr-before .fb-tr-role { color: #FCA5A5; }
.fb-tr-after .fb-tr-role { color: #6EE7B7; }
.fb-tr-title { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 500; color: #fff; margin-bottom: 10px; }
.fb-tr-desc { font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.5; }
.fb-tr-arrow { font-size: 1.5rem; color: var(--fb-gold); text-align: center; }
@media (max-width: 560px) { .fb-tr-arrow { transform: rotate(90deg); } }
.fb-strat-quote { background: rgba(255,255,255,0.06); border-left: 3px solid var(--fb-gold); padding: 20px 24px; margin-top: 24px; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.02rem; line-height: 1.6; color: #E6F1FB; }

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
:root[data-theme="dark"] .fb-article .fb-quote,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-comp-card,
:root[data-theme="dark"] .fb-article .fb-funnel,
:root[data-theme="dark"] .fb-article .fb-ll-lagging { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-ll-leading { background: rgba(147,197,253,0.08); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .fb-ll-title,
:root[data-theme="dark"] .fb-article .fb-comp-name,
:root[data-theme="dark"] .fb-article .fb-comp-weight,
:root[data-theme="dark"] .fb-article .fb-model-name,
:root[data-theme="dark"] .fb-article .fb-model-example strong,
:root[data-theme="dark"] .fb-article .fb-tl-cond,
:root[data-theme="dark"] .fb-article .fb-funnel-title,
:root[data-theme="dark"] .fb-article .fb-fi-name,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-ll-desc,
:root[data-theme="dark"] .fb-article .fb-ll-list,
:root[data-theme="dark"] .fb-article .fb-comp-desc,
:root[data-theme="dark"] .fb-article .fb-model-desc,
:root[data-theme="dark"] .fb-article .fb-model-example,
:root[data-theme="dark"] .fb-article .fb-model-level,
:root[data-theme="dark"] .fb-article .fb-fi-role,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-comp-card,
:root[data-theme="dark"] .fb-article .fb-fi-card { border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-fi-card { background: rgba(255,255,255,0.05); }
:root[data-theme="dark"] .fb-article .fb-model { border-color: rgba(255,255,255,0.14); }
:root[data-theme="dark"] .fb-article .fb-model.m1 { border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-model.m2 { border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-model.m3 { border-color: rgba(147,197,253,0.4); }
:root[data-theme="dark"] .fb-article .fb-tl-cond { background: rgba(255,255,255,0.06); }
:root[data-theme="dark"] .fb-article .fb-model-example { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-tl-v-go { background: rgba(42,122,62,0.2); color: #6EE7B7; border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-tl-v-cond { background: rgba(180,83,9,0.2); color: #FCD34D; border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-tl-v-hold { background: rgba(176,51,51,0.2); color: #FCA5A5; border-color: rgba(252,165,165,0.4); }
:root[data-theme="dark"] .fb-article .fb-ll-lagging .fb-ll-tag { background: rgba(255,255,255,0.12); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-ll-leading .fb-ll-tag { background: rgba(147,197,253,0.2); color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-alert { background: rgba(147,197,253,0.1); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .fb-alert p { color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-alert strong { color: #DBEAFE; }
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
  var root = document.querySelector('.fb-article');
  if (!root) return;
  var calc = root.querySelector('.fb-calc');
  if (!calc) return;

  var tabs = calc.querySelectorAll('.fb-calc-tab');
  var stepBtns = calc.querySelectorAll('.fb-calc-step-btn');
  var blockersEl = calc.querySelector('#fb-c-blockers');
  var blockersHintEl = calc.querySelector('#fb-c-blockers-hint');
  var regressionEl = calc.querySelector('#fb-c-regression');
  var regressionValEl = calc.querySelector('#fb-c-regression-val');
  var pathsEl = calc.querySelector('#fb-c-paths');
  var pathsValEl = calc.querySelector('#fb-c-paths-val');
  var scoreEl = calc.querySelector('#fb-c-score');
  var verdictEl = calc.querySelector('#fb-c-verdict');
  var breakdownEl = calc.querySelector('#fb-c-breakdown');
  if (!regressionEl || !pathsEl || !scoreEl) return;

  var currentModel = 1;
  var blockers = 0;

  function fmt(n, d) { return n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  function blockersHint(n) {
    if (n === 0) return 'no blockers';
    if (n === 1) return '1 blocker';
    return n + ' blockers';
  }

  function calc2() {
    var regression = parseFloat(regressionEl.value);
    var pathsRaw = parseFloat(pathsEl.value);
    regressionValEl.textContent = regression + '%';
    var pathsCount = Math.round(pathsRaw / 25);
    pathsValEl.textContent = pathsCount + '/4';

    var blockerScore = blockers === 0 ? 100 : 0;

    if (currentModel === 1) {
      breakdownEl.style.display = 'none';
      var c1 = blockers === 0;
      var c2 = regression >= 90;
      var c3 = pathsRaw >= 100;
      var conditions = (c1 ? 1 : 0) + (c2 ? 1 : 0) + (c3 ? 1 : 0);
      var verdict, cls, badgeCls, badgeText;
      if (conditions === 3) {
        verdict = 'GO'; cls = 'score-go'; badgeCls = 'cv-go'; badgeText = 'All 3 conditions met';
      } else if (conditions === 2) {
        verdict = 'CONDITIONAL'; cls = 'score-cond'; badgeCls = 'cv-cond'; badgeText = '2 of 3 conditions met';
      } else {
        verdict = 'HOLD'; cls = 'score-hold'; badgeCls = 'cv-hold'; badgeText = conditions + ' of 3 conditions - release blocked';
      }
      scoreEl.textContent = verdict;
      scoreEl.style.fontSize = verdict === 'CONDITIONAL' ? '2.2rem' : '4rem';
      scoreEl.className = 'fb-calc-score ' + cls;
      verdictEl.textContent = badgeText;
      verdictEl.className = 'fb-calc-verdict ' + badgeCls;
      return;
    }

    var weighted = blockerScore * 0.40 + regression * 0.35 + pathsRaw * 0.25;
    var score = weighted;
    var disqualified = false;
    if (currentModel === 3 && blockers > 0) {
      score = Math.min(weighted, 50);
      disqualified = true;
    }

    scoreEl.textContent = Math.round(score) + '%';
    scoreEl.style.fontSize = '4rem';

    var cls2, badgeCls2, badgeText2;
    if (score >= 90) {
      cls2 = 'score-go'; badgeCls2 = 'cv-go'; badgeText2 = 'Recommendation: GO';
    } else if (score >= 75) {
      cls2 = 'score-cond'; badgeCls2 = 'cv-cond'; badgeText2 = 'Recommendation: CONDITIONAL';
    } else {
      cls2 = 'score-hold'; badgeCls2 = 'cv-hold'; badgeText2 = 'Recommendation: HOLD';
    }
    scoreEl.className = 'fb-calc-score ' + cls2;
    verdictEl.textContent = badgeText2;
    verdictEl.className = 'fb-calc-verdict ' + badgeCls2;

    breakdownEl.style.display = 'grid';
    var html = '';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Blockers (40%)</span><span class="fb-cb-value">' + blockerScore + ' × 0.40 = ' + fmt(blockerScore * 0.40, 1) + '</span></div>';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Regression (35%)</span><span class="fb-cb-value">' + regression + ' × 0.35 = ' + fmt(regression * 0.35, 1) + '</span></div>';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Critical paths (25%)</span><span class="fb-cb-value">' + pathsRaw + ' × 0.25 = ' + fmt(pathsRaw * 0.25, 1) + '</span></div>';
    html += '<div class="fb-cb-row" style="border-top:1px solid rgba(255,255,255,.1);padding-top:8px;margin-top:2px;"><span class="fb-cb-label" style="font-weight:700;color:rgba(255,255,255,.75)">Weighted score</span><span class="fb-cb-value" style="color:#fff">' + fmt(weighted, 1) + '%</span></div>';
    if (disqualified) {
      var nDisq = blockers === 1 ? '1 open blocker' : (blockers + ' open blockers');
      html += '<div class="fb-cb-disq">⚠ Disqualifier active: ' + nDisq + ' → score capped at max 50%</div>';
    }
    breakdownEl.innerHTML = html;
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      currentModel = parseInt(t.dataset.model, 10);
      tabs.forEach(function (x) { x.classList.toggle('active', parseInt(x.dataset.model, 10) === currentModel); });
      calc2();
    });
  });
  stepBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      blockers = Math.max(0, blockers + parseInt(b.dataset.step, 10));
      blockersEl.textContent = blockers;
      blockersHintEl.textContent = blockersHint(blockers);
      calc2();
    });
  });
  regressionEl.addEventListener('input', calc2);
  pathsEl.addEventListener('input', calc2);
  calc2();
})();
</script>
