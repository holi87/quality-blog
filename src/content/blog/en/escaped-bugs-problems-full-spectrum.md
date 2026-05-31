---
title: "Escaped Bugs and Problems - the full spectrum of what reaches production"
description: "Bugs in the code are only part of the story. The full taxonomy of escaped problems - code, infrastructure, configuration, integrations, regressions - the cost of each type and how to measure it. Article 3 of 9."
date: 2026-06-02
tags: ["qa", "metrics", "leadership", "reporting"]
lang: en
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Series: QA Leadership · Article 3 of 9</p>

<p class="fb-lead">It was a Friday evening. The team's DDR was 91%. Regression passed beautifully. Confidence Score: 89% - GO. The release shipped. And forty minutes later the alerts started rolling in.</p>

<div class="fb-incident">
  <div class="fb-inc-time">Friday · 18:47 · Production</div>
  <div class="fb-inc-line"><span class="fb-inc-t">18:47</span><span class="fb-inc-msg fb-inc-alert">ALERT: Timeouts on connections to the external payments API - 503 for 34% of requests</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">18:51</span><span class="fb-inc-msg">DevOps: checking the logs... this isn't our code. Something with the SSL config in the new environment.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:03</span><span class="fb-inc-msg">QA Lead: but it wasn't a bug - everything passed in the tests.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:04</span><span class="fb-inc-msg fb-inc-alert">PM: the client just wrote in. They haven't been able to process transactions for 17 minutes.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:22</span><span class="fb-inc-msg fb-inc-note">Rollback complete. Downtime: 35 minutes. The production SSL certificate differed from staging.</span></div>
</div>

The next day at the retrospective, one question came up: *"How is this possible - DDR 91%, and the client couldn't pay for half an hour?"*

The answer is both simple and painful: **because DDR measured only bugs in the code. And the problem was in the infrastructure configuration.** And that is exactly the gap this article is about.

<blockquote class="fb-quote">The client doesn't distinguish whether the service went down because of a code bug, a bad SSL certificate, or a wrong feature flag. To them - and to your business - it's all the same thing: production is down.</blockquote>

## Escaped Problem - a broader definition

In the previous article we talked about DDR - the metric for defect detection effectiveness. DDR asks: *how many bugs do we catch before they reach production?* But that definition assumes the only problems are bugs in the application code.

Reality is different. An Escaped Problem is **any problem discovered by a customer or by monitoring after deployment** - regardless of its source. Four categories, four entirely different ways of arising, four different ways of preventing them.

## Four types - one shared consequence

Before you start measuring, you need to know what you're measuring. Here is the full taxonomy of escaped problems with the typical percentage share in the organizations I've worked with.

<div class="fb-tax-grid">
  <div class="fb-tax-card fb-tax-code">
    <div class="fb-tax-icon">🐛</div>
    <div class="fb-tax-name">Code defects</div>
    <span class="fb-tax-share">~55% of cases</span>
    <div class="fb-tax-desc">The classic bug - incorrect application behavior caused by an error in the programming logic. This is exactly what DDR from article 2 measures.</div>
    <div class="fb-tax-examples">
      <span>Wrong price calculation after a discount</span>
      <span>NullPointerException on an edge case</span>
      <span>Incorrect form validation</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-infra">
    <div class="fb-tax-icon">⚙️</div>
    <div class="fb-tax-name">Infrastructure problems</div>
    <span class="fb-tax-share">~20% of cases</span>
    <div class="fb-tax-desc">The production environment behaves differently from the test one. The code is correct - but it doesn't work in the target context.</div>
    <div class="fb-tax-examples">
      <span>SSL certificate differs from staging</span>
      <span>Insufficient server resources under load</span>
      <span>Library version mismatch between environments</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-integ">
    <div class="fb-tax-icon">🔗</div>
    <div class="fb-tax-name">Integration failures</div>
    <span class="fb-tax-share">~15% of cases</span>
    <div class="fb-tax-desc">External APIs, third-party systems, internal microservices - something that worked in tests fails in production because of a different call context.</div>
    <div class="fb-tax-examples">
      <span>Payments API returns a different format in prod</span>
      <span>A timeout different from staging</span>
      <span>Missing permissions in a service integration</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-regr">
    <div class="fb-tax-icon">↩️</div>
    <div class="fb-tax-name">Post-deployment regressions</div>
    <span class="fb-tax-share">~10% of cases</span>
    <div class="fb-tax-desc">A feature worked before the release - after deployment it stopped. The cause: an unexpected interaction with new changes or configuration changes.</div>
    <div class="fb-tax-examples">
      <span>A feature flag overrode production settings</span>
      <span>Cache wasn't cleared after deployment</span>
      <span>A database migration changed the behavior of old records</span>
    </div>
  </div>
</div>

The sum doesn't add up to 100% - because a few percent are mixed situations, hard to classify cleanly. The proportions will differ in your organization - but the taxonomy itself is almost universal.

## Code vs infra vs integration - the key differences

Each type of escaped problem has a different source, a different warning signal and a different prevention method. The table below is your navigation map.

<div class="fb-table-wrap">
<table class="fb-cmp-table">
  <thead>
    <tr>
      <th>Type</th>
      <th>Who owns it</th>
      <th>Where to look for signals</th>
      <th>How to prevent it</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="fb-badge fb-badge-code">Code</span></td>
      <td>Dev + QA</td>
      <td>Jira, automated tests, code review</td>
      <td>Test coverage, DDR, definition of done</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-infra">Infra</span></td>
      <td>DevOps + QA</td>
      <td>Monitoring, environment diffs, IaC review</td>
      <td>Environment parity, infrastructure-as-code tests</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-int">Integrations</span></td>
      <td>Dev + QA + vendor</td>
      <td>API logs, contract tests, alerting</td>
      <td>Contract tests, mocking with prod-like data</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-reg">Regressions</span></td>
      <td>QA + DevOps</td>
      <td>Post-deployment monitoring, smoke tests</td>
      <td>Post-deploy smoke suite, canary deployments</td>
    </tr>
  </tbody>
</table>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Distribution of escaped problem types - a sample year</div>
      <div class="fb-chart-sub">Code dominates, but infra and integrations are ~35% of problems combined, often left out of reports</div>
    </div>
    <span class="fb-chart-badge">Q1-Q4</span>
  </div>
  <div class="fb-chart-canvas" style="height: 230px">
    <canvas id="fb-c-types" role="img" aria-label="Doughnut chart: code defects 55%, infrastructure and configuration 20%, integrations 15%, post-deployment regressions 10%."></canvas>
  </div>
</div>

## How to collect and categorize - a practical guide

Most teams collect only bugs from Jira. That's like measuring the temperature in one room and claiming you know the climate of the whole building. Here's what to add and how to connect it.

### Data sources

<div class="fb-collect-grid">
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🗂️</div>
    <div class="fb-collect-name">Jira / tracker</div>
    <div class="fb-collect-desc">Code defects reported by QA and devs. An "environment" field or a "production" tag lets you filter out escaped ones.</div>
    <span class="fb-collect-tag fb-collect-must">mandatory</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">📡</div>
    <div class="fb-collect-name">Alert monitoring</div>
    <div class="fb-collect-desc">PagerDuty, Datadog, Grafana. Production incidents with a timestamp - the source for infra and integrations.</div>
    <span class="fb-collect-tag fb-collect-must">mandatory</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🎧</div>
    <div class="fb-collect-name">Support tickets</div>
    <div class="fb-collect-desc">Freshdesk, Zendesk. Problems reported by customers that never reach Jira as a bug.</div>
    <span class="fb-collect-tag fb-collect-good">important</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🔖</div>
    <div class="fb-collect-name">Post-deploy logs</div>
    <div class="fb-collect-desc">The first 30 minutes after deployment is the regression window. Splunk, ELK, CloudWatch - logs from that window.</div>
    <span class="fb-collect-tag fb-collect-good">important</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">💬</div>
    <div class="fb-collect-name">Slack / Teams</div>
    <div class="fb-collect-desc">The #incidents or #prod-issues channel. This is often where problems land before anyone logs them officially.</div>
    <span class="fb-collect-tag fb-collect-bonus">supplementary</span>
  </div>
</div>

### The categorization process - step by step

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Collect every production event from the week / sprint</div>
      <div class="fb-step-text">One log - regardless of source. Date, short description, downtime or user impact. At this stage you don't categorize - you only collect.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Assign a type to each event</div>
      <div class="fb-step-text">Code / infra / integration / regression. One event - one type. If you're not sure - pick the most likely one and mark it "to verify".</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Map it to a release</div>
      <div class="fb-step-text">Which deployment brought the problem in? Sometimes it's obvious - an incident 30 minutes after deployment. Sometimes you have to look at the change history. Without this step you lose the ability to tie escaped problems to specific releases (the metric from article 5).</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Compute the cost and log the resolution time</div>
      <div class="fb-step-text">Time to detect, time to fix, who was involved. Even an approximation (DevOps ~3h, Dev ~1h) is enough - the cost details we cover in the next section.</div>
    </div>
  </div>
</div>

### Implementation checklist

Check which data sources you already have connected in your team.

<div class="fb-checklist">
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Jira - "environment" field or "production" tag configured</div><div class="fb-cl-desc">Lets you filter bugs found in production down to the release.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Monitoring alerts land in one place (Slack / PagerDuty)</div><div class="fb-cl-desc">Every production alert should leave a trace you can analyze later.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Support tickets linked to Jira or logged separately</div><div class="fb-cl-desc">Without this you lose problems the customer reports directly - often the most serious ones.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Deployment history with exact dates and times</div><div class="fb-cl-desc">Essential for attributing incidents to specific releases.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Smoke tests run automatically after every deployment</div><div class="fb-cl-desc">They catch regressions in the first minutes - before they reach the customer.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">A weekly incident review with type classification</div><div class="fb-cl-desc">A 15-minute ritual that turns raw data into a categorized history.</div></div></div>
</div>

<div class="fb-cost-section">
  <span class="fb-cost-eyebrow">Cost</span>
  <h2 class="fb-cost-h">How much does each escaped problem type cost?</h2>
  <p class="fb-cost-intro">Each type of escaped problem has a different cost profile - a different detection time, a different fix time, different people involved. Below are estimates based on the median from typical enterprise organizations. Your numbers will differ - but the proportions are surprisingly consistent.</p>
  <div class="fb-cost-types">
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-code">Code</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Application code defect</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">Dev: 2-3h analysis + fix</span>
          <span class="fb-ct-item">QA: 1h verification</span>
          <span class="fb-ct-item">DevOps: 1h hotfix deploy</span>
          <span class="fb-ct-item">PM: 0.5h coordination</span>
        </div>
        <div class="fb-ct-note">The most common type. A well-defined fix process. Lower escalation cost.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">5-6h</div>
        <div class="fb-ct-unit">per incident</div>
        <div class="fb-ct-risk fb-ct-med">risk: medium</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-infra">Infra</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Infrastructure / configuration problem</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">DevOps: 3-5h diagnosis + fix</span>
          <span class="fb-ct-item">Dev: 1h support</span>
          <span class="fb-ct-item">QA: 1h environment verification</span>
          <span class="fb-ct-item">PM: 1h + client communication</span>
          <span class="fb-ct-item">Often: a rollback of the whole release</span>
        </div>
        <div class="fb-ct-note">Harder to diagnose. Often requires a rollback - not just a fix.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">8-12h</div>
        <div class="fb-ct-unit">per incident</div>
        <div class="fb-ct-risk fb-ct-high">risk: high</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-int">Integration</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">External integration failure</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">Dev: 2-4h diagnosis + workaround</span>
          <span class="fb-ct-item">DevOps: 2h configuration</span>
          <span class="fb-ct-item">PM: 2-3h vendor communication</span>
          <span class="fb-ct-item">Often: SLA breach with an external vendor</span>
        </div>
        <div class="fb-ct-note">Part of the problem sits with the vendor. Resolution time depends on an external SLA.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">8-16h</div>
        <div class="fb-ct-unit">per incident</div>
        <div class="fb-ct-risk fb-ct-crit">risk: critical</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-reg">Regression</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Post-deployment regression</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">QA: 2h scope identification</span>
          <span class="fb-ct-item">Dev: 2-3h interaction analysis</span>
          <span class="fb-ct-item">DevOps: 2h rollback or hotfix</span>
          <span class="fb-ct-item">Often: impact on several features at once</span>
        </div>
        <div class="fb-ct-note">Insidious - because "the previous version worked". Requires deeper root-cause analysis.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">7-10h</div>
        <div class="fb-ct-unit">per incident</div>
        <div class="fb-ct-risk fb-ct-high">risk: high</div>
      </div>
    </div>
  </div>
  <div class="fb-cost-summary">
    <div class="fb-cs-cell"><div class="fb-cs-label">Average cost across all types</div><div class="fb-cs-val">~8h</div><div class="fb-cs-sub">per single escaped problem</div></div>
    <div class="fb-cs-cell"><div class="fb-cs-label">Most expensive type</div><div class="fb-cs-val fb-cs-red">Integration</div><div class="fb-cs-sub">8-16h + external SLA</div></div>
    <div class="fb-cs-cell"><div class="fb-cs-label">Most common type</div><div class="fb-cs-val fb-cs-blue">Code</div><div class="fb-cs-sub">~55% of all cases</div></div>
  </div>
</div>

## Data that says more than a single counter

Instead of one number "escaped bugs = 12" - two charts that give a completely different level of insight into what's really going on.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped problems by type - quarterly trend</div>
      <div class="fb-chart-sub">Code shrinks faster - because it's better tested. Infra and integrations hold steady - they need different actions.</div>
    </div>
    <span class="fb-chart-badge">Q1-Q4 2025</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#3B82F6"></span>Code</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#F97316"></span>Infra</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#8B5CF6"></span>Integrations</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#EF4444"></span>Regressions</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-trend" role="img" aria-label="Stacked bar chart: total escaped problems drop from 19 in Q1 to 8 in Q4, with code shrinking fastest (from 10 to 3)."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Cost by type - Q4 2025</div>
      <div class="fb-chart-sub">Integrations are only 15% of cases - but they consume disproportionately more time and budget</div>
    </div>
    <span class="fb-chart-badge">work hours</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-cost" role="img" aria-label="Horizontal bar chart: total cost in hours - code defects 28h (5 incidents), infra 20h (2 incidents), integrations 12h (1 incident), regressions 8h (1 incident)."></canvas>
  </div>
</div>

## How to present this to the business

The number of escaped problems alone stops being enough once you have the type distribution and the cost of each. Here's how to turn that data into a narrative.

<blockquote class="fb-quote">Instead of: *"we had 8 escaped bugs."* Say: *"we had 8 escaped problems - 5 code defects, 2 configuration problems and 1 integration failure. Total cost: about 68 hours. Infra and integrations need a separate strategy."*</blockquote>

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint review</span>
    <span class="fb-biz-text">"This sprint we had 3 escaped problems: 2 code defects and 1 environment configuration problem. Cost: about 22 hours. The configuration problem was the most expensive - and we have a plan to not repeat it."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 with EM</span>
    <span class="fb-biz-text">"Looking at the trend - code defects are dropping. But infra and integration problems hold at a steady level. That needs a different intervention than more testing - we need better environment parity and contract tests."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Board</span>
    <span class="fb-biz-text">"In Q4 we had 8 escaped problems at a total cost of about 68 work hours. For comparison - in Q1 there were 18 at about 160 hours. The biggest saving came from contract tests rolled out in Q2."</span>
  </div>
</div>

## What the full taxonomy changes

<div class="fb-summary-box">
  <p class="fb-summary-lead">Once you start categorizing escaped problems instead of just counting them - the conversation changes fundamentally. You stop saying <em>how many</em> and start saying <em>what and why</em>.</p>
  <div class="fb-summary-grid">
    <div class="fb-sg-item"><div class="fb-sg-num">4</div><div class="fb-sg-label">types of escaped problems to track</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">5×</div><div class="fb-sg-label">cost difference: code vs integration</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">35%</div><div class="fb-sg-label">problems missed when you measure only bugs in the code</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">15min</div><div class="fb-sg-label">a weekly review is enough for full categorization</div></div>
  </div>
</div>

<blockquote class="fb-quote">The client doesn't report a problem labeled "type: infrastructure". To them - and to your business - one thing matters: does it work. Measure everything that can stop working.</blockquote>

## In the next article

Article four covers **Issues per Release** - a code-maturity metric that reshapes the conversation with the Engineering Manager. It doesn't ask how many bugs you found - it asks how clean the code you received for testing was.

Spoiler: this is the metric that often reveals the problem lies not with QA but with the development process - and it gives you the data to have that conversation from a position of facts, not opinions.

<div class="fb-series">
  <div class="fb-series-eyebrow">Series: QA metrics the business wants to hear</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title">The complete guide <span class="fb-s-badge-done">read</span></div>
        <div class="fb-s-sub">Diagnosis, three pillars, five metrics, the QA → KPI mapping model</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title">Defect Detection Ratio <span class="fb-s-badge-done">read</span></div>
        <div class="fb-s-sub">Formula, thresholds, historical data, seasonality, pitfalls</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title">Escaped Bugs &amp; Problems <span class="fb-s-now">you are here</span></div>
        <div class="fb-s-sub">Taxonomy, data collection, the cost of each type, how to report</div>
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
  --fb-navy-deep: #071628;
  --fb-gold: #C8943A;
  --fb-gold-pale: #F6EDDA;
  --fb-teal: #0A6B6F;
  --fb-teal-pale: #D4EDEE;
  --fb-surface: #F8F6F2;
  --fb-border: #E8E4DC;
  --fb-muted: #5C5C5C;
  --fb-faint: #999;
  --fb-red: #B03333;
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

/* INCIDENT */
.fb-incident { background: var(--fb-navy); border-radius: 12px; padding: 26px 28px; margin: 28px 0; }
.fb-inc-time { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 14px; }
.fb-inc-line { display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start; }
.fb-inc-line:last-child { margin-bottom: 0; }
.fb-inc-t { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.35); min-width: 42px; padding-top: 3px; flex-shrink: 0; }
.fb-inc-msg { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.82); }
.fb-inc-alert { color: #FCA5A5; }
.fb-inc-note { color: rgba(255,255,255,0.5); font-style: italic; }

/* TAXONOMY */
.fb-tax-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 24px 0; }
@media (max-width: 560px) { .fb-tax-grid { grid-template-columns: 1fr; } }
.fb-tax-card { border-radius: 12px; padding: 22px; border: 1.5px solid; }
.fb-tax-code { background: #EFF6FF; border-color: #BFDBFE; }
.fb-tax-infra { background: #FFF7ED; border-color: #FED7AA; }
.fb-tax-integ { background: #EDE9FE; border-color: #C4B5FD; }
.fb-tax-regr { background: #FEF2F2; border-color: #FECACA; }
.fb-tax-icon { font-size: 24px; margin-bottom: 10px; }
.fb-tax-name { font-size: 14px; font-weight: 700; margin-bottom: 6px; }
.fb-tax-code .fb-tax-name { color: #1D4ED8; }
.fb-tax-infra .fb-tax-name { color: #C2410C; }
.fb-tax-integ .fb-tax-name { color: var(--fb-purple); }
.fb-tax-regr .fb-tax-name { color: var(--fb-red); }
.fb-tax-share { font-size: 11px; font-weight: 700; padding: 2px 9px; border-radius: 20px; display: inline-block; margin-bottom: 8px; }
.fb-tax-code .fb-tax-share { background: #DBEAFE; color: #1D4ED8; }
.fb-tax-infra .fb-tax-share { background: #FFEDD5; color: #C2410C; }
.fb-tax-integ .fb-tax-share { background: #EDE9FE; color: var(--fb-purple); }
.fb-tax-regr .fb-tax-share { background: #FEE2E2; color: var(--fb-red); }
.fb-tax-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; margin-bottom: 10px; }
.fb-tax-examples { font-size: 11px; color: var(--fb-faint); }
.fb-tax-examples span { display: block; padding: 2px 0; }
.fb-tax-examples span::before { content: '→ '; }

/* COMPARE TABLE */
.fb-table-wrap { margin: 24px 0; overflow-x: auto; }
.fb-cmp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.fb-cmp-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 11px 14px; text-align: left; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-cmp-table td { padding: 12px 14px; border-bottom: 1px solid var(--fb-border); vertical-align: top; font-size: 13px; color: var(--fb-muted); }
.fb-cmp-table tr:last-child td { border-bottom: none; }
.fb-cmp-table td:first-child { font-weight: 600; color: #111; }
.fb-badge { display: inline-block; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 10px; }
.fb-badge-code { background: #DBEAFE; color: #1D4ED8; }
.fb-badge-infra { background: #FFEDD5; color: #C2410C; }
.fb-badge-int { background: #EDE9FE; color: var(--fb-purple); }
.fb-badge-reg { background: #FEE2E2; color: var(--fb-red); }

/* COLLECTION */
.fb-collect-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin: 22px 0; }
.fb-collect-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px 16px; }
.fb-collect-icon { font-size: 20px; margin-bottom: 10px; }
.fb-collect-name { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 5px; }
.fb-collect-desc { font-size: 11px; color: var(--fb-muted); line-height: 1.5; }
.fb-collect-tag { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; margin-top: 8px; }
.fb-collect-must { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-collect-good { background: var(--fb-gold-pale); color: #7a4f0a; }
.fb-collect-bonus { background: var(--fb-surface); color: var(--fb-faint); border: 1px solid var(--fb-border); }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 18px; margin-bottom: 20px; }
.fb-step:last-child { margin-bottom: 0; }
.fb-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-body { flex: 1; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }

/* CHECKLIST */
.fb-checklist { margin: 22px 0; }
.fb-cl-item { display: flex; gap: 14px; align-items: flex-start; padding: 13px 0; border-bottom: 1px solid var(--fb-border); }
.fb-cl-item:last-child { border-bottom: none; }
.fb-cl-check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid var(--fb-border); flex-shrink: 0; margin-top: 1px; }
.fb-cl-title { font-size: 14px; font-weight: 600; color: #111; margin-bottom: 3px; }
.fb-cl-desc { font-size: 12px; color: var(--fb-muted); line-height: 1.5; }

/* COST (dark box) */
.fb-cost-section { background: var(--fb-navy); border-radius: 16px; padding: 40px 36px; margin: 40px 0; }
.fb-cost-eyebrow { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 10px; }
.fb-cost-h { font-family: Georgia, serif; color: #fff !important; margin: 0 0 8px; font-size: 1.6rem; font-weight: 500; line-height: 1.2; }
.fb-cost-intro { color: rgba(255,255,255,0.55) !important; font-size: 15px; margin-bottom: 26px; }
.fb-cost-types { display: grid; gap: 14px; }
.fb-cost-type { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 22px; display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: start; }
@media (max-width: 540px) { .fb-cost-type { grid-template-columns: 1fr; } .fb-ct-total { text-align: left; } }
.fb-ct-badge { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; white-space: nowrap; align-self: center; }
.fb-ct-code { background: rgba(59,130,246,0.2); color: #93C5FD; }
.fb-ct-infra { background: rgba(251,146,60,0.2); color: #FDBA74; }
.fb-ct-int { background: rgba(167,139,250,0.2); color: #C4B5FD; }
.fb-ct-reg { background: rgba(248,113,113,0.2); color: #FCA5A5; }
.fb-ct-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fb-ct-breakdown { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.fb-ct-item { font-size: 11px; color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); padding: 3px 9px; border-radius: 6px; }
.fb-ct-note { margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.35); }
.fb-ct-total { text-align: right; align-self: center; }
.fb-ct-hrs { font-family: Georgia, serif; font-size: 2rem; font-weight: 500; line-height: 1; color: #fff; }
.fb-ct-unit { font-size: 10px; color: rgba(255,255,255,0.35); margin-top: 3px; }
.fb-ct-risk { font-size: 11px; margin-top: 4px; font-weight: 600; }
.fb-ct-high { color: #FCA5A5; }
.fb-ct-med { color: #FCD34D; }
.fb-ct-crit { color: #F87171; }
.fb-cost-summary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px 24px; margin-top: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
.fb-cs-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 4px; }
.fb-cs-val { font-family: Georgia, serif; font-size: 1.8rem; font-weight: 500; color: #fff; line-height: 1; }
.fb-cs-red { color: #FCA5A5; }
.fb-cs-blue { color: #93C5FD; }
.fb-cs-sub { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 4px; }

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

/* BIZ QUOTES */
.fb-biz-quotes { display: grid; gap: 14px; margin: 22px 0; }
.fb-biz-q { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px 22px; display: flex; gap: 16px; flex-wrap: wrap; }
.fb-biz-context { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); min-width: 80px; flex-shrink: 0; padding-top: 2px; }
.fb-biz-text { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #111; line-height: 1.6; flex: 1; min-width: 200px; }

/* SUMMARY */
.fb-summary-box { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 24px 0; }
.fb-summary-lead { color: var(--fb-muted); font-size: 15px; }
.fb-summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-top: 18px; }
.fb-sg-item { text-align: center; padding: 16px 10px; background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; }
.fb-sg-num { font-family: Georgia, serif; font-size: 1.8rem; font-weight: 500; color: var(--fb-navy); line-height: 1; margin-bottom: 5px; }
.fb-sg-label { font-size: 11px; color: var(--fb-faint); line-height: 1.4; }

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
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: var(--fb-gold); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }
.fb-s-badge-done { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-teal-pale); color: var(--fb-teal); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

/* Dark mode */
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-collect-card,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-summary-box,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-table-wrap { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-sg-item { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.08); }
:root[data-theme="dark"] .fb-article .fb-cmp-table th { background: rgba(255,255,255,0.04); color: #ccc; }
:root[data-theme="dark"] .fb-article .fb-cmp-table td { color: #bbb; }
:root[data-theme="dark"] .fb-article .fb-cmp-table td:first-child,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-collect-name,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-cl-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-summary-lead { color: #fff; }
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
  function init() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    mount(document.getElementById('fb-c-types'), {
      type: 'doughnut',
      data: {
        labels: ['Code defects (~55%)', 'Infra / configuration (~20%)', 'Integrations (~15%)', 'Post-deploy regressions (~10%)'],
        datasets: [{
          data: [55, 20, 15, 10],
          backgroundColor: ['#3B82F6', '#F97316', '#8B5CF6', '#EF4444'],
          borderWidth: 3, borderColor: '#F8F6F2', hoverOffset: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '62%',
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 12, padding: 14, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.raw + '%'; } } }
        }
      }
    });
    mount(document.getElementById('fb-c-trend'), {
      type: 'bar',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'Code', data: [10, 8, 5, 3], backgroundColor: '#3B82F6', stack: 's' },
          { label: 'Infra', data: [4, 3, 4, 2], backgroundColor: '#F97316', stack: 's' },
          { label: 'Integrations', data: [3, 3, 2, 2], backgroundColor: '#8B5CF6', stack: 's' },
          { label: 'Regressions', data: [2, 2, 1, 1], backgroundColor: '#EF4444', borderRadius: { topLeft: 4, topRight: 4 }, stack: 's' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
          x: { stacked: true, grid: { display: false }, border: { display: false } },
          y: { stacked: true, grid: { color: grid }, border: { display: false }, ticks: { stepSize: 5 } }
        }
      }
    });
    mount(document.getElementById('fb-c-cost'), {
      type: 'bar',
      data: {
        labels: [['Code defects', '(5 incidents)'], ['Infra', '(2 incidents)'], ['Integrations', '(1 incident)'], ['Regressions', '(1 incident)']],
        datasets: [{
          label: 'Total cost (h)',
          data: [28, 20, 12, 8],
          backgroundColor: ['#3B82F6', '#F97316', '#8B5CF6', '#EF4444'],
          borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + ' work hours'; } } } },
        scales: {
          x: { grid: { color: grid }, border: { display: false }, ticks: { callback: function (v) { return v + 'h'; } } },
          y: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11 } } }
        }
      }
    });
  }
  function boot() { ensureChart(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
