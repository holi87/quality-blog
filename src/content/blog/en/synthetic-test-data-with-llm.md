---
title: "Synthetic Test Data with LLMs: How to Generate Realistic Data Without Leaking Production"
description: "A data contract, a deterministic validator, targeted edge cases, and the three traps of synthesis - how to generate test data with an LLM without copying production and without GDPR risk."
date: 2026-08-13
tags: ["ai", "qa", "llm", "test-data", "gdpr"]
lang: en
readingTime: 9
author: GH
---

Copying production data into test environments is a ticking GDPR bomb: real names, addresses, and national ID numbers land in databases with weaker safeguards, accessible to half the company and its subcontractors. An LLM offers a real alternative - data statistically similar to production and entirely made up. But "ask the model for a thousand customers" is a recipe for data that looks good and is useless for anything. In this post I show how to do it properly: from a data contract, through consistency validation, to edge cases on demand - and the three traps almost everyone falls into.

## Why a production copy is a ticking bomb

The legal argument is well known: personal data in a test environment is still personal data, with all the obligations - a processing basis, access restrictions, retention, breach notifications. Test environments almost by definition have a wider circle of access and weaker monitoring, so a leak from there is more likely, and explaining it to the regulator is harder.

But there is also an engineering argument that gets discussed less often: a production copy is bad test data. It contains millions of average records and not a single extreme one - the one you happen to need. Anonymization done properly destroys distributions and relationships; done sloppily - it does not anonymize. I have seen both variants: a dataset so heavily masked that report tests stopped making sense, and a dataset "anonymized" by swapping first names, in which the phone numbers and addresses stayed original. Data synthesis is therefore not just a dodge around GDPR. It is an opportunity to finally design test data instead of inheriting it.

## Contract first, generation second

The first principle: the model does not invent the data structure, it fills in a structure it is given. The starting point is a contract - a JSON schema, table definitions, or a type specification - with explicit rules: field formats, value ranges, required fields, allowed dictionaries. On top of that come business rules no schema can express: the contract end date after the start date, the sum of order line items equal to the order total, an underage customer has no credit agreement.

The generating prompt gets three things: the contract, the business rules, and distribution parameters ("80 percent individual customers, 20 percent business; age 18 to 95 with a median of 42"). The output must be in a machine format - JSON or CSV - never in prose. For large volumes, an indirect variant works better: the model does not generate a million records (that is expensive and slow), it generates a Python generator script conforming to the contract, and the script produces the data locally. The LLM designs the variety, the code provides the scale.

How is the model supposed to know what realistic distributions look like if we do not show it production? From two legitimate sources. The first is aggregated statistics: the age distribution, the proportions of customer types, a histogram of order values - numbers computed by a query on production run by someone with access, with not a single personal record in the result. The second is the team's domain knowledge: "business customers order less often, but five times bigger", "registrations peak in January". Both sources fit in the prompt, and neither carries personal data outside the production systems.

## Consistency validation, or distrust as a process

I treat generated data like any other unverified material: it does not enter an environment without passing a validator. The validator is plain code, not a second model - checking deterministic rules is a job for a deterministic tool. Four layers of control:

- **Schema conformance:** types, formats, required fields. The cheapest layer, catches the most.
- **Relationships:** every order points to an existing customer, every line item to an existing product. Models generating tables separately notoriously break foreign keys.
- **Checksums and derived rules:** a national ID with a correct check digit, a tax ID with a correct weighted sum, the gross amount equal to net plus VAT, the sum of line items equal to the order value.
- **Distributions:** whether the requested proportions roughly hold - if I asked for 20 percent companies and got 3 percent, the generation goes back for a redo.

A practical note on identification numbers: models can generate a national ID that looks correct but has a wrong check digit - or, worse, a correct one, meaning it potentially belongs to a living person. That is why identifiers are computed by validator code, not the model: the date and sex from the record, a random series, the check digit from the algorithm. The model supplies the person, the code supplies the number.

## Edge cases on demand - where the LLM truly shines

The model's advantage over classic random data libraries is not in volume, but in targeted variety. A library needs its edge cases programmed; a model only needs them described. My standing order set for a NoteApp-style application:

- surnames with the full Polish alphabet: Żółć-Gręboszewska, Łękawski, Ćwiąkała - they break systems with faulty character encoding handling;
- multi-part and very long surnames (50+ characters) - they break column length limits and interface layout;
- boundary dates: February 29 of a leap year, people born before 1900, dates straddling time zones;
- national IDs of people born after 1999 (a different century encoding in the month field) and test series;
- unusual addresses: a town with no street, house number 1/3/5, single-letter names;
- empty values wherever the schema allows them, and minimal ones wherever it does not.

Each such case is a potential bug report that would otherwise have arrived from production. The cost of generating it - one sentence in the prompt. These cases exist in a production copy too, but diluted by millions of average records; in a synthetic dataset you plant them deliberately and know exactly which test is supposed to hit them.

## Data as a versioned artifact, not a one-off dump

The most common organizational mistake: synthesis as a one-time action. Someone generates a batch of data, drops it into the environment, three months later the schema changes, the data stops fitting, and the team goes back to copying production, "because at least it works". For synthesis to survive, the data must become an engineering artifact with a full lifecycle.

In practice this means three things. The data contract and the generating prompts live in the repository next to the code - a schema change in a database migration pulls a contract change into the same code review. Datasets have versions and purposes: a small base set (a few hundred records) for automated tests, recreated on every run for full repeatability, and a large volume set for performance tests, regenerated by script on demand. And finally - the validator runs in CI: every change to the contract or the prompt triggers a sample generation and a full validation, so a drift between schema and data surfaces in minutes, not months.

It is also worth establishing an owner right away. Test data without an owner rots the same way tests without an owner do. What works for me is a model in which the contract is looked after by the same person who looks after the tests of a given area - because they are the first to see that the edge cases have stopped being enough.

## The three traps of synthesis

First: **monotony**. A model asked for a thousand records without distribution parameters will generate a thousand variations of the same average customer - John Smith, around 35, from the capital, one order for 150. The data will pass validation and find no bugs, because it contains no tension. Defense: explicit distributions in prompts and diversity validation (the number of unique values per column).

Second: **patterns the model avoids**. Models have learned habits: they round amounts, prefer popular names, avoid dates from before their knowledge, steer clear of culturally awkward values. As a result, the synthetic population has holes exactly where production fills them. You catch this trap by comparing synthetic distributions against production ones - at the level of statistics, not records, so without carrying personal data anywhere.

Third: **accidental similarity to real people**. A generated "Tomasz Wiśniewski, 7 Polna Street, Radom" almost certainly exists somewhere. As long as it is a coincidence at the level of individual fields, the risk is academic - but you must never show the model real records as templates to imitate, because then the similarity stops being accidental and turns into pseudonymization on the cheap. Only statistics and schemas go to the model, never raw production records.

> Synthetic data is not a risk-free copy of production. It is a separate engineering product with its own contract, its own validation, and its own failure modes - and only treated that way does it become both safer and better than the copy.

## Summary

The LLM test data synthesis workflow has four elements: a data contract with business rules as input, generation in a machine format (for scale - the model writes the generator, not the records), a deterministic four-layer validator (schema, relationships, checksums, distributions), and targeted edge cases on demand - from national characters to boundary dates. Three traps to actively guard against: monotony without specified distributions, systematic holes in the places the model avoids, and the rule that raw production records never go into the prompt. A good first step: take one table from your system, write down its contract with the business rules, and ask the model for fifty records with ten targeted edge cases - then run your test suite against them and count how many new bugs pop out.
