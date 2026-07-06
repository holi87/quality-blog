---
title: "Storytelling with metrics - how to turn a table into an argument"
description: "The same data can put a room to sleep or trigger a decision. The inverted-pyramid skeleton, techniques for translating numbers into business language, a narrative generator and four ready-made templates. Article 8 of 9."
date: 2026-07-07
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 13
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 8 of 9</p>

<p class="fb-lead">Same team, same numbers, two meetings a quarter apart. At the first one the QA Lead showed a table and lost the room after half a minute. At the second one he told a story and walked out with a budget for automation. The data was almost identical.</p>

<div class="fb-meet-wrap">
  <div class="fb-meet fb-meet-flat">
    <span class="fb-meet-tag">Meeting 1: the table</span>
    <div class="fb-meet-quote">"In Q2 we executed 312 tests, pass rate 94%, coverage 82%, we found 47 bugs, 7 of which escaped, DDR at 87%..."</div>
    <div class="fb-meet-react">The room's reaction: "Ok, thanks." Next agenda item.</div>
    <div class="fb-meet-time">Attention span: about 30 seconds</div>
  </div>
  <div class="fb-meet fb-meet-story">
    <span class="fb-meet-tag">Meeting 2: the narrative</span>
    <div class="fb-meet-quote">"I'll start with the conclusion: quality is improving even though we sped up. Two pieces of evidence and one request - the whole thing takes three minutes."</div>
    <div class="fb-meet-react">The room's reaction: questions, a discussion about root causes, a budget decision at the end.</div>
    <div class="fb-meet-time">Attention span: the entire talk</div>
  </div>
</div>

Across the seven previous articles we built a measurement toolkit: five metrics plus the Confidence Score. This text is about the final link in the chain - the delivery. Without it, even the best-calculated indicators end up in the drawer labelled "reports nobody reads".

## Why the table loses to the story

It is not that stakeholders cannot read data. It is about the conditions under which that data reaches them. A decision meeting is an environment of limited attention, competing topics and time pressure. A raw table demands that the listener do the interpretation themselves - and there is simply no room for that in a calendar packed to the brim.

Memory research has shown for a long time that we remember information embedded in a narrative many times better than the same information delivered as a list of facts. A story provides structure: cause, effect and meaning. A number stripped of that structure stays in the listener's head exactly until the next slide appears.

<div class="fb-quote">Interpretation will always happen. The only question is whether you deliver it, or the listener fills in their own. The latter is rarely favourable to QA.</div>

## The inverted pyramid: the conclusion goes first

Most QA reports are built chronologically. First what we did, then what we found, and finally some conclusion, time permitting. Journalists discovered a hundred years ago that it works exactly the other way around. A newspaper reader gets the essence in the first sentence, and the details only afterwards, in order of decreasing importance. The same principle transfers directly to reporting metrics.

<div class="fb-pyr">
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m1">🎯</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">Opening, the first 15 seconds</div>
      <div class="fb-pyr-title">Conclusion</div>
      <div class="fb-pyr-text">One sentence that sums everything up. The listener immediately knows what this conversation is for and how to listen to the rest. No teasers like "in a moment I'll show data from which it will follow that...".</div>
      <div class="fb-pyr-ex">"Quality is improving, even though we are shipping faster than ever."</div>
    </div>
  </div>
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m2">📊</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">The middle of the talk</div>
      <div class="fb-pyr-title">Evidence</div>
      <div class="fb-pyr-text">Two, at most four numbers, always as a trend. A single point in time proves nothing. A quarter-over-quarter comparison shows direction, and direction is what the business actually buys.</div>
      <div class="fb-pyr-ex">"Releases went up from 6 to 10. Production bugs dropped from 7 to 3. Per release, we now carry less than a third of what we had six months ago."</div>
    </div>
  </div>
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m3">🧭</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">Closing</div>
      <div class="fb-pyr-title">Recommendation</div>
      <div class="fb-pyr-text">A decision or a request, concrete and actionable. The listener came to a decision meeting, so give them a decision to make. A report without a recommendation is an invitation to reply "ok, thanks".</div>
      <div class="fb-pyr-ex">"I propose we keep the current process and invest the reclaimed time into regression automation. I need the sign-off today to make it before Q4."</div>
    </div>
  </div>
</div>

Note the proportions. The conclusion and the recommendation together take maybe half a minute. All the remaining time belongs to the evidence - but the evidence only lands once the listener already knows what it is proving.

## Four techniques for translating into business language

The skeleton alone is not enough if raw indicators remain inside it. Below are techniques that turn a QA number into something a stakeholder can feel.

<div class="fb-tech-grid">
  <div class="fb-tech-card">
    <div class="fb-tech-icon">💰</div>
    <div class="fb-tech-name">Convert to money or time</div>
    <div class="fb-tech-desc">An escaped bug costs about 8 hours of team work (we calculated this in article 3). Multiply by the rate and by the number of incidents per quarter. Everyone understands a result in currency, from a developer to the CFO.</div>
    <div class="fb-tech-ex">"Four escaped bugs avoided this quarter equal a full week of a senior's work."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">⚓</div>
    <div class="fb-tech-name">Give a comparison anchor</div>
    <div class="fb-tech-desc">A percentage hangs in a vacuum until it gets a reference point. The comparison can be the previous quarter, an industry benchmark, or anything the listener knows from their own experience.</div>
    <div class="fb-tech-ex">"Our 0.4 bugs per release puts us around the level that DORA reports describe as elite."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">➗</div>
    <div class="fb-tech-name">Normalize before someone does it wrong</div>
    <div class="fb-tech-desc">Absolute numbers grow together with the pace of work, and someone in the room will surely draw a hasty conclusion from them. Preempt it. Show the per-release value, following the rules from article 6.</div>
    <div class="fb-tech-ex">"Bugs went up because we doubled the number of releases. Per release, there are half as many."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">🧑</div>
    <div class="fb-tech-name">Show a concrete case instead of an abstraction</div>
    <div class="fb-tech-desc">Instead of a category, show one representative case. A single story of a customer who could not pay for 35 minutes does more than an entire incident chart.</div>
    <div class="fb-tech-ex">"This is the type of failure that stopped payments at our biggest customer in August."</div>
  </div>
</div>

## Five sentences worth rewriting

Each pair below carries exactly the same information. The difference lies in what the listener will do with it.

<div class="fb-trans-list">
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Before</div>
      <div class="fb-trans-text">We found 47 bugs this sprint.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">After</div>
      <div class="fb-trans-text">We stopped 47 problems before they reached customers. Three made it to production and all of them are already fixed.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Before</div>
      <div class="fb-trans-text">Coverage is at 82%.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">After</div>
      <div class="fb-trans-text">All payment and login paths are under automated guard. The gaps are in the reporting module, and that is where the next sprint is headed.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Before</div>
      <div class="fb-trans-text">Escaped per release dropped from 1.4 to 0.4.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">After</div>
      <div class="fb-trans-text">A year ago the average release carried almost one and a half production bugs. Today, statistically, less than half of one. The customer feels that difference with every deployment.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Before</div>
      <div class="fb-trans-text">We need more people for testing.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">After</div>
      <div class="fb-trans-text">Every 5 points of DDR is about 30 senior hours reclaimed per quarter. I propose an investment that, according to our data, will raise DDR by 4 points within two sprints.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Before</div>
      <div class="fb-trans-text">Confidence Score is 62%, there are 2 blockers, regression at 71%.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">After</div>
      <div class="fb-trans-text">We recommend holding until Wednesday. Two blockers in payments need two days of work; once they are closed, we come back with a full GO.</div>
    </div>
  </div>
</div>

## Narrative generator

Enter your numbers and the generator will assemble a ready-made statement following the inverted pyramid. You can copy the text and adapt it to your own style.

<div class="fb-nb">
  <div class="fb-nb-title">Build a narrative from your data</div>
  <div class="fb-nb-sub">A comparison of two periods, for example the previous and the current quarter</div>
  <div class="fb-nb-inputs">
    <div class="fb-nb-field">
      <label for="fb-nb-relprev">Releases before</label>
      <input type="number" id="fb-nb-relprev" value="6" min="1">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-relnow">Releases now</label>
      <input type="number" id="fb-nb-relnow" value="10" min="1">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-escprev">Production bugs before</label>
      <input type="number" id="fb-nb-escprev" value="7" min="0">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-escnow">Production bugs now</label>
      <input type="number" id="fb-nb-escnow" value="3" min="0">
    </div>
  </div>
  <div class="fb-nb-output">
    <div class="fb-nb-out-label">Generated narrative</div>
    <div class="fb-nb-narrative" id="fb-nb-out" aria-live="polite"></div>
    <button class="fb-nb-copy" id="fb-nb-copy" type="button">Copy text</button>
  </div>
</div>

## Four ways to ruin a good story

<div class="fb-mist-grid">
  <div class="fb-mist" data-n="01">
    <div class="fb-mist-title">Dumping everything at once</div>
    <div class="fb-mist-text">Twenty indicators on one slide means none of them gets remembered. Pick the data that serves the conclusion; keep the rest in an appendix in case of questions.</div>
  </div>
  <div class="fb-mist" data-n="02">
    <div class="fb-mist-title">Telling it in order</div>
    <div class="fb-mist-text">A report in the style of "first we tested module A, then B, then we found..." eats time and pushes the point away. Chronology is for chronicles, not for decisions.</div>
  </div>
  <div class="fb-mist" data-n="03">
    <div class="fb-mist-title">The buried conclusion</div>
    <div class="fb-mist-text">If the most important sentence lands on slide twelve, part of the room will never hear it. The essence goes first, even when it feels like "we need to build context first".</div>
  </div>
  <div class="fb-mist" data-n="04">
    <div class="fb-mist-title">A story without an ask</div>
    <div class="fb-mist-text">A great narrative ending in silence wastes its own potential. The listener should leave the meeting knowing what you expect from them: approval, budget, a decision, or at least no objection.</div>
  </div>
</div>

## Four templates for four occasions

You fill in the highlighted placeholders with your own data. The structure stays the same: conclusion, evidence, recommendation.

<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Weekly status</span>
    <span class="fb-tmpl-aud">Sprint Review</span>
  </div>
  <div class="fb-tmpl-body">"In short: the release is ready to go. Confidence Score <span class="fb-ph">[X]%</span>, zero blockers, regression <span class="fb-ph">[Y]%</span>. The only risk is <span class="fb-ph">[a known issue with a workaround]</span>, which we will monitor after deployment. Recommendation: GO on Friday."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Quarterly summary</span>
    <span class="fb-tmpl-aud">Steering / EM</span>
  </div>
  <div class="fb-tmpl-body">"The most important news of the quarter: <span class="fb-ph">[conclusion, e.g. quality is improving despite a faster pace]</span>. We had <span class="fb-ph">[N]</span> releases, <span class="fb-ph">[Δ]</span> more than before, and production bugs per release dropped from <span class="fb-ph">[A]</span> to <span class="fb-ph">[B]</span>. I am asking for <span class="fb-ph">[a specific decision or resource]</span>, which will let us keep this trajectory."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Investment request</span>
    <span class="fb-tmpl-aud">Board</span>
  </div>
  <div class="fb-tmpl-body">"Each production bug costs us on average <span class="fb-ph">[8]</span> hours of team work, which is about <span class="fb-ph">[amount]</span> per year at the current scale. The proposed investment in <span class="fb-ph">[automation / tooling]</span> cuts this cost category by <span class="fb-ph">[Z]%</span> according to data from the last two quarters. Payback comes within <span class="fb-ph">[period]</span>."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Crisis communication</span>
    <span class="fb-tmpl-aud">After an incident</span>
  </div>
  <div class="fb-tmpl-body">"The incident from <span class="fb-ph">[date]</span> is contained; downtime was <span class="fb-ph">[T]</span>. The causes lay in <span class="fb-ph">[area, without naming people]</span>. We are implementing two preventive actions: <span class="fb-ph">[action 1]</span> and <span class="fb-ph">[action 2]</span>, both due by <span class="fb-ph">[date]</span>. The full analysis report is attached."</div>
</div>

## In the next article

One last text of the series remains. It collects the three anti-patterns that most effectively destroy QA credibility: overloaded dashboards, numbers without context, and technical jargon in conversations with the business. Slightly tongue-in-cheek, because every one of us has committed at least one of these sins. The finale of the whole nine.

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
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">08</span><div><div class="fb-s-title">Storytelling with metrics <span class="fb-s-now">you are here</span></div><div class="fb-s-sub">Inverted pyramid, translation techniques, narrative generator, templates</div></div></li>
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
  --fb-green-pale: #F0FDF4;
}
.fb-article p { line-height: 1.78; }
.fb-eyebrow { display: inline-block; font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 18px; }
.fb-lead { font-family: Georgia, 'Times New Roman', serif; font-size: 1.25rem; line-height: 1.55; border-left: 3px solid var(--fb-gold); padding-left: 22px; margin: 24px 0 28px; }
.fb-quote { background: var(--fb-surface); border-left: 3px solid var(--fb-gold); padding: 22px 26px; margin: 32px 0; border-radius: 0 12px 12px 0; font-family: Georgia, serif; font-style: italic; font-size: 1.05rem; line-height: 1.6; }

/* TWO MEETINGS */
.fb-meet-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 26px 0; }
@media (max-width: 600px) { .fb-meet-wrap { grid-template-columns: 1fr; } }
.fb-meet { border-radius: 12px; padding: 22px; border: 1.5px solid; }
.fb-meet-flat { background: var(--fb-surface); border-color: var(--fb-border); }
.fb-meet-story { background: var(--fb-navy); border-color: var(--fb-navy); }
.fb-meet-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 4px 11px; border-radius: 20px; display: inline-block; margin-bottom: 14px; }
.fb-meet-flat .fb-meet-tag { background: #E5E1D8; color: #4a4a4a; }
.fb-meet-story .fb-meet-tag { background: rgba(200,148,58,0.22); color: #E8C989; }
.fb-meet-quote { font-size: 13px; line-height: 1.65; margin-bottom: 14px; }
.fb-meet-flat .fb-meet-quote { color: var(--fb-muted); font-family: 'Courier New', monospace; font-size: 12.5px; }
.fb-meet-story .fb-meet-quote { color: rgba(255,255,255,0.88); font-family: Georgia, serif; font-style: italic; font-size: 14px; }
.fb-meet-react { font-size: 12px; padding: 10px 14px; border-radius: 8px; line-height: 1.5; }
.fb-meet-flat .fb-meet-react { background: #E5E1D8; color: #4a4a4a; }
.fb-meet-story .fb-meet-react { background: rgba(110,231,183,0.14); color: #6EE7B7; }
.fb-meet-time { font-size: 11px; margin-top: 10px; }
.fb-meet-flat .fb-meet-time { color: var(--fb-faint); }
.fb-meet-story .fb-meet-time { color: rgba(255,255,255,0.6); }

/* PYRAMID */
.fb-pyr { margin: 26px 0; }
.fb-pyr-step { display: flex; gap: 18px; align-items: flex-start; padding: 20px 0; border-bottom: 1px solid var(--fb-border); }
.fb-pyr-step:last-child { border-bottom: none; }
.fb-pyr-marker { width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.fb-pyr-m1 { background: var(--fb-gold-pale); }
.fb-pyr-m2 { background: var(--fb-teal-pale); }
.fb-pyr-m3 { background: var(--fb-green-pale); border: 1px solid #BBF7D0; }
.fb-pyr-body { flex: 1; }
.fb-pyr-when { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 4px; }
.fb-pyr-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-pyr-text { font-size: 14px; color: var(--fb-muted); line-height: 1.65; }
.fb-pyr-ex { background: var(--fb-surface); border-radius: 8px; padding: 12px 15px; margin-top: 10px; font-family: Georgia, serif; font-size: 13.5px; font-style: italic; color: #111; line-height: 1.55; }

/* TECHNIQUES */
.fb-tech-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
@media (max-width: 560px) { .fb-tech-grid { grid-template-columns: 1fr; } }
.fb-tech-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; }
.fb-tech-icon { font-size: 22px; margin-bottom: 10px; }
.fb-tech-name { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-tech-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; margin-bottom: 10px; }
.fb-tech-ex { font-size: 12.5px; color: var(--fb-teal); font-style: italic; line-height: 1.5; }

/* BEFORE / AFTER */
.fb-trans-list { display: grid; gap: 14px; margin: 24px 0; }
.fb-trans-card { border: 1px solid var(--fb-border); border-radius: 12px; overflow: hidden; }
.fb-trans-before, .fb-trans-after { padding: 16px 20px; }
.fb-trans-before { background: var(--fb-surface); border-bottom: 1px dashed var(--fb-border); }
.fb-trans-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
.fb-trans-before .fb-trans-tag { color: var(--fb-muted); }
.fb-trans-after .fb-trans-tag { color: var(--fb-green); }
.fb-trans-text { font-size: 14px; line-height: 1.6; }
.fb-trans-before .fb-trans-text { color: var(--fb-muted); font-family: 'Courier New', monospace; font-size: 13px; }
.fb-trans-after .fb-trans-text { color: #111; font-family: Georgia, serif; font-style: italic; }

/* NARRATIVE BUILDER */
.fb-nb { background: var(--fb-navy); border-radius: 18px; padding: 34px; margin: 28px 0; box-shadow: 0 12px 44px rgba(14,31,61,0.16); }
.fb-nb-title { font-family: Georgia, serif; font-size: 21px; font-weight: 500; color: #fff; margin-bottom: 6px; }
.fb-nb-sub { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 26px; }
.fb-nb-inputs { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
@media (max-width: 520px) { .fb-nb-inputs { grid-template-columns: 1fr; } }
.fb-nb-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.65); display: block; margin-bottom: 8px; }
.fb-nb-field input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 11px 15px; font-size: 17px; font-weight: 700; color: #fff; font-family: Georgia, serif; outline: none; transition: border-color 0.2s; }
.fb-nb-field input:focus { border-color: var(--fb-gold); }
.fb-nb-output { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 24px; }
.fb-nb-out-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #E8C989; margin-bottom: 12px; }
.fb-nb-narrative { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: rgba(255,255,255,0.92); line-height: 1.75; }
.fb-nb-part { display: block; margin-bottom: 12px; }
.fb-nb-part:last-child { margin-bottom: 0; }
.fb-nb-part-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-style: normal; font-family: inherit; display: block; margin-bottom: 3px; }
.fb-nb-t1 { color: #FCD34D; }
.fb-nb-t2 { color: #93C5FD; }
.fb-nb-t3 { color: #6EE7B7; }
.fb-nb-copy { margin-top: 16px; background: var(--fb-gold); color: var(--fb-navy); border: none; border-radius: 8px; padding: 10px 20px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: opacity 0.2s; }
.fb-nb-copy:hover { opacity: 0.85; }

/* MISTAKES */
.fb-mist-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
@media (max-width: 560px) { .fb-mist-grid { grid-template-columns: 1fr; } }
.fb-mist { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; position: relative; overflow: hidden; }
.fb-mist::before { content: attr(data-n); position: absolute; right: 12px; top: 6px; font-family: Georgia, serif; font-size: 3rem; font-weight: 300; color: var(--fb-border); line-height: 1; pointer-events: none; }
.fb-mist-title { font-size: 14px; font-weight: 700; color: var(--fb-red); margin-bottom: 8px; position: relative; z-index: 1; }
.fb-mist-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; position: relative; z-index: 1; }

/* TEMPLATES */
.fb-tmpl { border: 1px solid var(--fb-border); border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
.fb-tmpl-head { background: var(--fb-surface); padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
.fb-tmpl-name { font-size: 13px; font-weight: 700; color: #111; }
.fb-tmpl-aud { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7a4f0a; background: var(--fb-gold-pale); padding: 3px 10px; border-radius: 12px; }
.fb-tmpl-body { padding: 18px 20px; font-family: Georgia, serif; font-size: 14px; font-style: italic; color: #111; line-height: 1.7; }
.fb-ph { color: var(--fb-teal); font-weight: 600; }

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
:root[data-theme="dark"] .fb-article .fb-meet-flat,
:root[data-theme="dark"] .fb-article .fb-pyr-ex,
:root[data-theme="dark"] .fb-article .fb-tmpl-head { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-meet-flat { border-color: rgba(255,255,255,0.14); }
:root[data-theme="dark"] .fb-article .fb-meet-flat .fb-meet-tag,
:root[data-theme="dark"] .fb-article .fb-meet-flat .fb-meet-react { background: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-meet-flat .fb-meet-quote { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-meet-flat .fb-meet-time { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-meet-story { border-color: rgba(255,255,255,0.16); }
:root[data-theme="dark"] .fb-article .fb-pyr-step { border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-pyr-m1 { background: rgba(200,148,58,0.18); }
:root[data-theme="dark"] .fb-article .fb-pyr-m2 { background: rgba(10,107,111,0.25); }
:root[data-theme="dark"] .fb-article .fb-pyr-m3 { background: rgba(42,122,62,0.2); border-color: rgba(110,231,183,0.3); }
:root[data-theme="dark"] .fb-article .fb-pyr-when { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-pyr-title,
:root[data-theme="dark"] .fb-article .fb-pyr-ex,
:root[data-theme="dark"] .fb-article .fb-tech-name,
:root[data-theme="dark"] .fb-article .fb-trans-after .fb-trans-text,
:root[data-theme="dark"] .fb-article .fb-tmpl-name,
:root[data-theme="dark"] .fb-article .fb-tmpl-body,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-pyr-text,
:root[data-theme="dark"] .fb-article .fb-tech-desc,
:root[data-theme="dark"] .fb-article .fb-trans-before .fb-trans-text,
:root[data-theme="dark"] .fb-article .fb-mist-text,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-tech-card,
:root[data-theme="dark"] .fb-article .fb-trans-card,
:root[data-theme="dark"] .fb-article .fb-mist,
:root[data-theme="dark"] .fb-article .fb-tmpl { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-tech-ex,
:root[data-theme="dark"] .fb-article .fb-ph { color: #5EEAD4; }
:root[data-theme="dark"] .fb-article .fb-trans-before { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
:root[data-theme="dark"] .fb-article .fb-trans-before .fb-trans-tag { color: #a8a8a8; }
:root[data-theme="dark"] .fb-article .fb-trans-after .fb-trans-tag { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-mist::before { color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-mist-title { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-tmpl-aud { background: rgba(200,148,58,0.2); color: #E8C989; }
:root[data-theme="dark"] .fb-article .fb-s-done .fb-s-title { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-current .fb-s-title { color: var(--fb-gold); }
:root[data-theme="dark"] .fb-article .fb-s-now { background: rgba(200,148,58,0.2); color: #E8C989; }
</style>

<script is:inline data-astro-rerun>
(function () {
  var root = document.querySelector('.fb-article');
  if (!root) return;
  var nb = root.querySelector('.fb-nb');
  if (!nb) return;

  var relPrevEl = nb.querySelector('#fb-nb-relprev');
  var relNowEl = nb.querySelector('#fb-nb-relnow');
  var escPrevEl = nb.querySelector('#fb-nb-escprev');
  var escNowEl = nb.querySelector('#fb-nb-escnow');
  var outEl = nb.querySelector('#fb-nb-out');
  var copyBtn = nb.querySelector('#fb-nb-copy');
  if (!relPrevEl || !relNowEl || !escPrevEl || !escNowEl || !outEl) return;

  var lastPlain = '';

  function fmt(n) {
    return n.toFixed(n % 1 === 0 ? 0 : 2);
  }

  function build() {
    var relPrev = Math.max(1, parseInt(relPrevEl.value, 10) || 1);
    var relNow = Math.max(1, parseInt(relNowEl.value, 10) || 1);
    var escPrev = Math.max(0, parseInt(escPrevEl.value, 10) || 0);
    var escNow = Math.max(0, parseInt(escNowEl.value, 10) || 0);

    var eprPrev = escPrev / relPrev;
    var eprNow = escNow / relNow;
    var relUp = relNow > relPrev;
    var relSame = relNow === relPrev;
    var qualityUp = eprNow < eprPrev;
    var qualitySame = Math.abs(eprNow - eprPrev) < 0.01;

    var conclusion, reco;
    if (qualityUp && relUp) {
      conclusion = 'We are shipping faster, and quality is improving.';
      reco = 'I propose we keep the current process and invest the reclaimed time into regression automation, which should deepen this trend further.';
    } else if (qualityUp && !relUp) {
      conclusion = 'Quality has clearly improved.';
      reco = 'I propose we carefully increase the release frequency. The data suggests the process can sustain a higher pace without losing stability.';
    } else if (!qualityUp && !qualitySame && relUp) {
      conclusion = 'We sped up, but it is coming at the cost of stability.';
      reco = 'I propose a short process review before we accelerate any further: analysing the recent incidents will show where to strengthen the tests.';
    } else if (!qualityUp && !qualitySame) {
      conclusion = 'The bugs-per-release rate has worsened and requires a response.';
      reco = 'I propose a post-mortem for the releases with the most incidents, plus one concrete corrective action due within this sprint.';
    } else {
      conclusion = 'We are maintaining a stable level of quality.';
      reco = 'I propose we continue the current process and revisit the topic at the next quarterly review.';
    }

    var relPart = relSame
      ? 'The number of releases stayed at ' + relNow + '.'
      : 'The number of releases ' + (relUp ? 'went up' : 'went down') + ' from ' + relPrev + ' to ' + relNow + '.';
    var escPart = 'Production bugs ' +
      (escNow === escPrev ? 'stayed at ' + escNow :
        (escNow < escPrev ? 'dropped from ' + escPrev + ' to ' + escNow : 'rose from ' + escPrev + ' to ' + escNow)) + ', ' +
      'which gives ' + fmt(eprNow) + ' per release versus ' + fmt(eprPrev) + ' previously.';
    var evidence = relPart + ' ' + escPart;

    outEl.innerHTML =
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t1">Conclusion</span>"' + conclusion + '"</span>' +
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t2">Evidence</span>"' + evidence + '"</span>' +
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t3">Recommendation</span>"' + reco + '"</span>';
    lastPlain = conclusion + '\n\n' + evidence + '\n\n' + reco;
  }

  [relPrevEl, relNowEl, escPrevEl, escNowEl].forEach(function (el) {
    el.addEventListener('input', build);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(lastPlain).then(function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(function () { copyBtn.textContent = old; }, 1500);
      });
    });
  }

  build();
})();
</script>
