---
title: "3 anti-patterns that destroy QA credibility"
description: "The series finale. Overloaded dashboards, numbers without context and jargon at the table with business. Three sins of quality reporting, all practiced first-hand, and a way out of each. Article 9 of 9."
date: 2026-07-14
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 9 of 9 · Finale</p>

<p class="fb-lead">I could only write this article because I have personally made every mistake described in it. My first dashboard for the board had twenty-three charts and I was genuinely proud of it. The CEO gave it about nine seconds.</p>

Across eight articles we built a toolkit: five metrics, a decision indicator, a narrative. One last question remains - what can ruin all of it. The answer is short. Three habits that look innocent, and each of them quietly undermines trust in the quality team. I know them well, because for years I cultivated all three at once.

The good news is that none of them comes from bad intentions or lack of competence. They all grow out of an excess of good will. And that is exactly why they are so easy to fall into.

## Anti-pattern 1: the report that shows everything

<p class="fb-ap-alias">a.k.a. the dashboard with twenty-three charts</p>

The logic seems airtight. Since we collect this much data, let's show it. More charts means more work, more work means more credibility. That is what I thought while preparing that dashboard, and that is what most QA teams think at a certain stage of maturity.

The listener's attention, however, works like a budget, not like a well. Every additional chart spends part of that budget and shrinks what is left for the others. With six indicators the room still keeps up. With twelve it starts picking randomly what to look at. With twenty-three it quietly gives up and waits for the next agenda item. Nobody says it out loud, because it is polite to appreciate the effort.

<div class="fb-dash-cmp">
  <div class="fb-dash fb-dash-messy">
    <span class="fb-dash-tag">How it looked</span>
    <div class="fb-mini-grid">
      <div class="fb-mini-box">▁▃▅</div><div class="fb-mini-box">◔</div><div class="fb-mini-box">▂▆▂</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▅▃▇</div><div class="fb-mini-box">◑</div><div class="fb-mini-box">▁▁▆</div><div class="fb-mini-box">#</div>
      <div class="fb-mini-box">▃▂▄</div><div class="fb-mini-box">◕</div><div class="fb-mini-box">▇▅▃</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▆▄▂</div><div class="fb-mini-box">◒</div><div class="fb-mini-box">▄▇▅</div><div class="fb-mini-box">#</div>
      <div class="fb-mini-box">▂▅▇</div><div class="fb-mini-box">◐</div><div class="fb-mini-box">▅▂▁</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▇▂▄</div><div class="fb-mini-box">◓</div><div class="fb-mini-box">▃▆▄</div>
    </div>
    <div class="fb-dash-verdict">23 charts. CEO attention span: about 9 seconds. Questions: zero.</div>
  </div>
  <div class="fb-dash fb-dash-clean">
    <span class="fb-dash-tag">How it looks today</span>
    <div class="fb-clean-score">
      <div class="fb-cs-v">91%</div>
      <div class="fb-cs-l">Confidence Score · GO</div>
    </div>
    <div class="fb-clean-grid">
      <div class="fb-clean-box"><div class="fb-cb-v">94%</div><div class="fb-cb-l">DDR</div></div>
      <div class="fb-clean-box"><div class="fb-cb-v">0.4</div><div class="fb-cb-l">Escaped / release</div></div>
      <div class="fb-clean-box"><div class="fb-cb-v">12</div><div class="fb-cb-l">Releases</div></div>
    </div>
    <div class="fb-dash-verdict">One decision indicator, three supporting numbers. Everything else in the appendix, in case of questions. Questions come up at every meeting.</div>
  </div>
</div>

<div class="fb-signs">
  <div class="fb-signs-title">How to tell this is your problem</div>
  <ul>
    <li>After the presentation nobody asks a single question. Silence is often a polite form of confusion.</li>
    <li>Someone regularly asks "ok, but what does this mean for us", even though you showed everything.</li>
    <li>The dashboard is diligently updated every sprint, and the visit statistics show three views. All of them yours.</li>
  </ul>
</div>

Getting out of this habit hurts, because it requires throwing away things you worked hard on. The rule that worked for me: one slide, one decision indicator, at most four supporting numbers. Everything else lands in the appendix and waits for questions. The paradox is that since I started showing less, people ask about more.

## Anti-pattern 2: the number that walks alone

<p class="fb-ap-alias">a.k.a. 94% with no answer to "is that good?"</p>

A scene from real life. Sprint review, "DDR: 87%" on the slide, twelve people in the room. Someone from the business raises a hand and asks whether that is a good result. Exactly. Eighty-seven percent of what, relative to what? Without a reference point that number is noise that sounds like information.

A listener deprived of context will do one of two things. Either they will fill in their own interpretation, usually a wrong one, or they will stop listening. Both options work against you. The worst part is that the sender usually does not see the problem, because they carry the context in their head. They know it was 74% a quarter ago. They just forgot that they are the only one who knows.

Instead of explaining further, simply test it on yourself. Three real numbers, three quick decisions.

<div class="fb-quiz">
  <div class="fb-q-title">Good or bad? Judge without context</div>
  <div class="fb-q-sub">Click an answer next to each number. One rule: answer immediately, just like a listener in a meeting.</div>
  <div class="fb-q-card">
    <div class="fb-q-number">Regression pass rate: 94%</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Good</button>
      <button class="fb-q-btn" type="button">Bad</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">The question was a trick. The honest answer is: I don't know.</div>
      <div class="fb-q-context">Context: the three previous releases had 99%, 98% and 97%. This is the fourth drop in a row. The value alone looks solid, the direction says otherwise.</div>
      <span class="fb-q-verdict fb-qv-bad">With context: a warning signal</span>
    </div>
  </div>
  <div class="fb-q-card">
    <div class="fb-q-number">12 production bugs in a quarter</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Good</button>
      <button class="fb-q-btn" type="button">Bad</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">Tricky again. Twelve, but across how many releases?</div>
      <div class="fb-q-context">Context: the team shipped 40 releases in that time. That works out to 0.3 bugs per release, a result near the top tier. The same twelve with 4 releases would be an alarm.</div>
      <span class="fb-q-verdict fb-qv-good">With context: a very good result</span>
    </div>
  </div>
  <div class="fb-q-card">
    <div class="fb-q-number">DDR: 76%</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Good</button>
      <button class="fb-q-btn" type="button">Bad</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">One last time: without context every answer is a guess.</div>
      <div class="fb-q-context">Context: a year ago this team was at 58%, half a year ago at 67%. Well over a dozen points of systematic growth. The value is below the textbook ideal, the direction is exemplary.</div>
      <span class="fb-q-verdict fb-qv-good">With context: heading the right way</span>
    </div>
  </div>
</div>

The cure is cheap. Every number goes to the meeting with one of three companions: a trend (how it was before), a reference point (a benchmark, a target, another measure) or a denominator (per release, per sprint, as in article six). One extra sentence on the slide. That is the price of the difference between information and noise.

## Anti-pattern 3: the curse of knowledge

<p class="fb-ap-alias">a.k.a. flaky tests, race conditions and the Product Owner's face</p>

Once, during a status meeting with the business, I said a sentence I remember to this day: "Regression is falling apart because we have flaky tests due to a race condition on CI, and coverage dropped after the refactor". The Product Owner nodded. After the meeting he came up and asked whether that meant there would be a delay. Nothing else from what I said had landed.

Psychology calls this the curse of knowledge. Once we know something, we lose the ability to imagine what it is like not to know it. The shorthand of our world seems obvious, so we use it with people from outside that world too. The listener nods out of politeness, and inside makes a decision to ask someone else next time. That is how the advisor's position quietly dies.

Below are five sentences that were actually said in meetings. Click each one to see the version that gets through.

<div class="fb-jargon-list">
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">click</span>
    <div class="fb-j-tech">"We have flaky tests in the regression suite."</div>
    <div class="fb-j-human">"Some tests pass one run and fail the next, even though the code has not changed. Until we sort this out, the results cannot be fully trusted. We are working on it, deadline: end of sprint."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">click</span>
    <div class="fb-j-tech">"Coverage dropped to 78% after the refactor."</div>
    <div class="fb-j-human">"Our automated checks today cover 78 out of 100 paths in the application. After the recent code rebuild, 22 paths were temporarily left unprotected. We are filling the gaps, starting where payments are involved."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">click</span>
    <div class="fb-j-tech">"Blocker due to a race condition on CI."</div>
    <div class="fb-j-human">"Two processes in the build system are racing for the same resource and the result depends on chance. Until it is fixed we cannot test reliably, which is why we put the release on hold."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">click</span>
    <div class="fb-j-tech">"The staging env was down for half a sprint."</div>
    <div class="fb-j-human">"The environment where we verify changes before production was not working for a week. Testing stood still for that time. Hence the delay, and hence the request to prioritize the stability of that environment."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">click</span>
    <div class="fb-j-tech">"We ran the smoke tests after the deploy, all green."</div>
    <div class="fb-j-human">"Right after the rollout we checked the most important functions. Login, payments and the main purchase flow are working correctly."</div>
  </div>
</div>

Notice what the hidden versions of each pair have in common. None of them explains the mechanism. All of them explain the consequence and say what happens next. The business does not care how a race condition works. It cares whether the release ships on Friday and whether the customer will feel anything. Answer that question, and leave the technical details for conversations with engineers, where they belong.

<div class="fb-quote">A simple test before every meeting: would my grandmother or the CEO understand this, whichever commands more respect. If not, the sentence goes back for a rewrite.</div>

## Self-diagnosis: check yourself before the room does it for you

Six questions, two per anti-pattern. Tick the ones that sound familiar. No cheating, nobody is watching.

<div class="fb-check">
  <div class="fb-c-title">How many anti-patterns are you cultivating?</div>
  <div class="fb-c-sub">Click every sentence that matches your reports</div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">My main report or dashboard has more than eight indicators.</span><span class="fb-c-cat">Anti-pattern 1</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">It happens that after my presentation nobody asks a single question.</span><span class="fb-c-cat">Anti-pattern 1</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">I show numbers without a comparison to the previous period or a benchmark.</span><span class="fb-c-cat">Anti-pattern 2</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">I have heard someone from the business ask "so is that good or bad?".</span><span class="fb-c-cat">Anti-pattern 2</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">I use words like flaky, coverage or regression around people outside IT without explaining them.</span><span class="fb-c-cat">Anti-pattern 3</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">I have watched someone nod while their eyes said something else.</span><span class="fb-c-cat">Anti-pattern 3</span></div>
  </div>
  <div class="fb-c-result">
    <div class="fb-c-score" id="fb-check-score">0 / 6</div>
    <div class="fb-c-verdict" id="fb-check-verdict">Tick the sentences above and I will tell you how it is.</div>
  </div>
</div>

## Four weeks to your first report that works

The whole series is behind us, so here is a minimum plan to finish with. Tested in practice, no revolution, doable alongside normal work.

<div class="fb-road">
  <div class="fb-road-step">
    <div class="fb-road-week">W1</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Calculate DDR and production bugs retroactively</div>
      <div class="fb-road-text">The data for the last quarter is sitting in Jira and in monitoring. Two filters, an hour of work, the first trend is ready. Details in articles two and three.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">W2</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Add issues per release and the number of releases</div>
      <div class="fb-road-text">Agree on definitions, start tagging, compute the history for the last few releases. From now on every number in the report has a denominator. Articles four and six.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">W3</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Build the Confidence Score</div>
      <div class="fb-road-text">A weighted model with a disqualifier, validated on three past releases. Check whether the number matches what you remember. Article seven walks you through it.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">W4</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Deliver your first report in the new style</div>
      <div class="fb-road-text">One slide. Conclusion, evidence, recommendation, as in article eight. Zero jargon, every number with context. Then watch what changes in the questions from the room.</div>
    </div>
  </div>
</div>

## Nine articles later

We started with a diagnosis: QA reports activity, the business wants to hear about outcomes. Between those two points we fit five metrics, one decision indicator, a narrative workshop and today's three warnings. That is the complete set. Not because more indicators could not be added, but because this set is enough, and everything beyond it starts working against you. You already know why - I wrote about it a few screens above.

If one thought were to remain from the whole series, let it be this: metrics are not there to prove that QA is working. They are there so the company makes better decisions. The difference seems subtle, and it changes everything, from the choice of indicators to the layout of the slide.

<div class="fb-finale">
  <div class="fb-f-eyebrow">The series' last word</div>
  <div class="fb-f-quote">A single metric is a fact. A set of metrics is a story. And a well-told story of quality can change the position of an entire team.</div>
  <div class="fb-f-text">Thank you for making it to the end with me. If any of these articles proved useful in practice, let me know. Write also when something did not work - those messages teach me the most. See you at the conferences.</div>
</div>

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
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">08</span><div><div class="fb-s-title"><a href="/en/blog/storytelling-with-metrics-building-narrative/">Storytelling with metrics</a> <span class="fb-s-badge-done">read</span></div><div class="fb-s-sub">Inverted pyramid, translation techniques, narrative generator, templates</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">09</span><div><div class="fb-s-title">3 anti-patterns that destroy QA credibility <span class="fb-s-now">finale · you are here</span></div><div class="fb-s-sub">Too many metrics, no context, jargon - self-diagnosis and a four-week plan</div></div></li>
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
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-quote { background: var(--fb-surface); border-left: 3px solid var(--fb-gold); padding: 22px 26px; margin: 32px 0; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; }
.fb-ap-alias { font-size: 13px; color: var(--fb-faint); font-style: italic; margin-top: -8px; margin-bottom: 20px; }

/* DASHBOARD COMPARE */
.fb-dash-cmp { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 26px 0; }
@media (max-width: 600px) { .fb-dash-cmp { grid-template-columns: 1fr; } }
.fb-dash { border-radius: 12px; padding: 20px; border: 1.5px solid; }
.fb-dash-messy { background: var(--fb-surface); border-color: var(--fb-border); }
.fb-dash-clean { background: var(--fb-navy); border-color: var(--fb-navy); }
.fb-dash-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 14px; display: inline-block; padding: 4px 11px; border-radius: 20px; }
.fb-dash-messy .fb-dash-tag { background: #E5E1D8; color: #4a4a4a; }
.fb-dash-clean .fb-dash-tag { background: rgba(200,148,58,0.22); color: #E8C989; }
.fb-mini-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 12px; }
.fb-mini-box { aspect-ratio: 1.4; border-radius: 4px; background: #E5E1D8; display: flex; align-items: center; justify-content: center; font-size: 8px; color: var(--fb-faint); overflow: hidden; }
.fb-clean-score { border-radius: 8px; background: rgba(42,122,62,0.2); border: 1px solid rgba(110,231,183,0.3); padding: 12px; text-align: center; margin-bottom: 10px; }
.fb-cs-v { font-family: Georgia, serif; font-size: 1.7rem; color: #6EE7B7; line-height: 1; }
.fb-cs-l { font-size: 8px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 3px; }
.fb-clean-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
.fb-clean-box { border-radius: 6px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); padding: 10px 6px; text-align: center; }
.fb-cb-v { font-family: Georgia, serif; font-size: 1rem; color: #fff; }
.fb-cb-l { font-size: 7px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
.fb-dash-verdict { font-size: 11px; line-height: 1.5; }
.fb-dash-messy .fb-dash-verdict { color: var(--fb-faint); }
.fb-dash-clean .fb-dash-verdict { color: rgba(255,255,255,0.55); }

/* SIGNS */
.fb-signs { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px 24px; margin: 22px 0; }
.fb-signs-title { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 12px; }
.fb-signs ul { list-style: none; padding: 0; margin: 0; }
.fb-signs li { font-size: 14px; color: var(--fb-muted); padding: 7px 0; line-height: 1.55; display: flex; gap: 10px; align-items: flex-start; }
.fb-signs li::before { content: '›'; color: var(--fb-gold); font-weight: 700; flex-shrink: 0; }

/* QUIZ */
.fb-quiz { background: var(--fb-navy); border-radius: 18px; padding: 32px; margin: 28px 0; }
@media (max-width: 680px) { .fb-quiz { padding: 24px 20px; } }
.fb-q-title { font-family: Georgia, serif; font-size: 20px; font-weight: 500; color: #fff; margin-bottom: 6px; }
.fb-q-sub { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 24px; }
.fb-q-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 22px; margin-bottom: 14px; }
.fb-q-card:last-child { margin-bottom: 0; }
.fb-q-number { font-family: Georgia, serif; font-size: 1.7rem; font-weight: 500; color: #fff; margin-bottom: 14px; }
.fb-q-btns { display: flex; gap: 10px; }
.fb-q-btn { flex: 1; padding: 11px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.75); font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
.fb-q-btn:hover { background: rgba(255,255,255,0.14); }
.fb-q-card.open .fb-q-btn { opacity: 0.4; cursor: default; }
.fb-q-reveal { display: none; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); }
.fb-q-card.open .fb-q-reveal { display: block; }
.fb-q-trick { font-size: 12px; font-weight: 700; color: #FCD34D; margin-bottom: 8px; }
.fb-q-context { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.65; margin-bottom: 10px; }
.fb-q-verdict { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 5px 14px; border-radius: 16px; }
.fb-qv-bad { background: rgba(176,51,51,0.25); color: #FCA5A5; }
.fb-qv-good { background: rgba(42,122,62,0.25); color: #6EE7B7; }

/* JARGON TRANSLATOR */
.fb-jargon-list { display: grid; gap: 12px; margin: 24px 0; }
.fb-jargon { border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px 20px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; position: relative; }
.fb-jargon:hover { border-color: var(--fb-gold); box-shadow: 0 2px 12px rgba(200,148,58,0.1); }
.fb-j-hint { position: absolute; right: 16px; top: 14px; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); }
.fb-j-tech { font-family: 'Courier New', monospace; font-size: 14px; color: #111; line-height: 1.5; padding-right: 70px; }
.fb-j-human { display: none; margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--fb-border); font-family: Georgia, serif; font-size: 14px; font-style: italic; color: var(--fb-teal); line-height: 1.6; }
.fb-jargon.open .fb-j-human { display: block; }
.fb-jargon.open .fb-j-hint { color: var(--fb-teal); }

/* SELF CHECK */
.fb-check { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 30px; margin: 28px 0; }
.fb-c-title { font-family: Georgia, serif; font-size: 19px; font-weight: 500; margin-bottom: 6px; }
.fb-c-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 20px; }
.fb-c-item { display: flex; gap: 14px; align-items: flex-start; padding: 13px 0; border-bottom: 1px solid var(--fb-border); cursor: pointer; }
.fb-c-item:last-of-type { border-bottom: none; }
.fb-c-box { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--fb-border); flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: transparent; transition: all 0.15s; background: #fff; }
.fb-c-item.on .fb-c-box { background: var(--fb-gold); border-color: var(--fb-gold); color: #fff; }
.fb-c-text { font-size: 14px; color: var(--fb-muted); line-height: 1.55; }
.fb-c-cat { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); display: block; margin-top: 2px; }
.fb-c-result { margin-top: 20px; background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 20px; text-align: center; }
.fb-c-score { font-family: Georgia, serif; font-size: 2.2rem; font-weight: 500; color: var(--fb-navy); line-height: 1; margin-bottom: 8px; }
.fb-c-verdict { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }

/* ROADMAP */
.fb-road { display: grid; gap: 0; margin: 24px 0; position: relative; }
.fb-road::before { content: ''; position: absolute; left: 21px; top: 24px; bottom: 24px; width: 2px; background: var(--fb-border); }
.fb-road-step { display: flex; gap: 18px; padding: 14px 0; position: relative; }
.fb-road-week { width: 44px; height: 44px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; z-index: 1; border: 3px solid var(--fb-surface); }
.fb-road-body { flex: 1; padding-top: 4px; }
.fb-road-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 5px; }
.fb-road-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; }

/* FINALE */
.fb-finale { background: var(--fb-navy); border-radius: 16px; padding: 38px 34px; margin: 28px 0; text-align: center; position: relative; overflow: hidden; }
.fb-finale::before { content: ''; position: absolute; top: -60px; right: -60px; width: 280px; height: 280px; border-radius: 50%; background: radial-gradient(circle, rgba(200,148,58,0.16) 0%, transparent 65%); }
.fb-f-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 14px; position: relative; z-index: 1; }
.fb-f-quote { font-family: Georgia, serif; font-size: clamp(1.2rem, 3vw, 1.55rem); font-style: italic; color: #fff; line-height: 1.5; max-width: 560px; margin: 0 auto 18px; position: relative; z-index: 1; }
.fb-f-text { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; max-width: 520px; margin: 0 auto; position: relative; z-index: 1; }

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
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: #7a4f0a; padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }
.fb-s-badge-done { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-teal-pale); color: var(--fb-teal); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

/* DARK MODE - contrast fixes (source design is light-only) */
:root[data-theme="dark"] .fb-article .fb-quote,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-signs,
:root[data-theme="dark"] .fb-article .fb-check,
:root[data-theme="dark"] .fb-article .fb-dash-messy { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-signs,
:root[data-theme="dark"] .fb-article .fb-check,
:root[data-theme="dark"] .fb-article .fb-dash-messy { border-color: rgba(255,255,255,0.14); }
:root[data-theme="dark"] .fb-article .fb-ap-alias { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-dash-messy .fb-dash-tag { background: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-mini-box { background: rgba(255,255,255,0.08); color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-dash-messy .fb-dash-verdict { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-dash-clean { border-color: rgba(255,255,255,0.16); }
:root[data-theme="dark"] .fb-article .fb-signs li { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-jargon { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-j-tech { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-j-hint { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-j-human { color: #5EEAD4; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-jargon.open .fb-j-hint { color: #5EEAD4; }
:root[data-theme="dark"] .fb-article .fb-c-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-c-sub,
:root[data-theme="dark"] .fb-article .fb-c-cat { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-c-item { border-color: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-c-box { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.25); }
:root[data-theme="dark"] .fb-article .fb-c-item.on .fb-c-box { background: var(--fb-gold); border-color: var(--fb-gold); }
:root[data-theme="dark"] .fb-article .fb-c-text { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-c-result { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
:root[data-theme="dark"] .fb-article .fb-c-score { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-c-verdict { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-road::before { background: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-road-week { border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-road-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-road-text { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-done .fb-s-title { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-current .fb-s-title { color: var(--fb-gold); }
:root[data-theme="dark"] .fb-article .fb-s-now { background: rgba(200,148,58,0.2); color: #E8C989; }
</style>

<script is:inline data-astro-rerun>
(function () {
  var root = document.querySelector('.fb-article');
  if (!root) return;

  root.querySelectorAll('.fb-q-card').forEach(function (card) {
    card.querySelectorAll('.fb-q-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (card.classList.contains('open')) return;
        card.classList.add('open');
        card.querySelectorAll('.fb-q-btn').forEach(function (b) { b.disabled = true; });
      });
    });
  });

  root.querySelectorAll('.fb-jargon').forEach(function (el) {
    el.addEventListener('click', function () { el.classList.toggle('open'); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.classList.toggle('open'); }
    });
  });

  var scoreEl = root.querySelector('#fb-check-score');
  var verdictEl = root.querySelector('#fb-check-verdict');
  function updateCheck() {
    var count = root.querySelectorAll('.fb-c-item.on').length;
    if (scoreEl) scoreEl.textContent = count + ' / 6';
    if (!verdictEl) return;
    var msg;
    if (count === 0) {
      msg = 'All clear. Feel free to forward this article to someone who needs it more.';
    } else if (count <= 2) {
      msg = 'Minor traces. You already know where to look, and each of these habits disappears after a few deliberate presentations.';
    } else if (count <= 4) {
      msg = 'Time for a cleanup. The good news: these are habits, not character traits. The four-week plan is one section below.';
    } else {
      msg = 'This series was written exactly for you. Go back to article one and work through it in order - in a quarter this score will look completely different.';
    }
    verdictEl.textContent = msg;
  }
  root.querySelectorAll('.fb-c-item').forEach(function (item) {
    item.addEventListener('click', function () {
      item.classList.toggle('on');
      updateCheck();
    });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.classList.toggle('on'); updateCheck(); }
    });
  });
})();
</script>
