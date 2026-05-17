---
title: "Metryki QA, które biznes chce słyszeć"
description: "Kompletny przewodnik po transformacji raportowania QA - od liczenia bugów do mówienia językiem wyników i decyzji biznesowych. Pięć metryk, trzy filary, jeden model."
date: 2026-05-19
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 12
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 1 z 9</p>

<p class="fb-lead">Śledzisz defekty, pokrycie testami, wyniki wykonania - i masz poczucie, że poza własnym zespołem QA nikogo to nie obchodzi. Masz rację. I to nie jest Twoja wina.</p>

Przez lata obserwowałem ten sam schemat: pieczołowicie przygotowane dashboardy, szczegółowe tabele z bugami - i kompletna cisza po stronie biznesu. Sprint review zakończony *„ok, dzięki"*, decyzje podejmowane intuicyjnie, bez oparcia o dane QA.

Problem nie polega na braku danych. Mamy danych za dużo. Problem polega na tym, że **raportujemy aktywność zamiast wyników**. To nie jest problem techniczny - to jest problem komunikacji.

<blockquote class="fb-quote">Metryka aktywności mówi, jak ciężko pracowałeś. Metryka wynikowa mówi, jaki był efekt. Biznes płaci za wyniki - i o wynikach chce słyszeć.</blockquote>

Ten artykuł jest pierwszym w serii dziewięciu. Dowiesz się, jakie metryki zbierać, jak je interpretować i - co najważniejsze - jak opowiadać nimi historię, którą stakeholderzy rozumieją i na której mogą działać.

## Co biznes naprawdę słyszy

Wyobraź sobie sprint review. QA prezentuje liczby. Stakeholderzy kiwają głowami. Decyzja zapada na czuja. Poniżej zestawione są dokładnie te same informacje o tym samym sprincie - w dwóch różnych językach.

<div class="fb-compare">
  <div class="fb-dp fb-dp-before">
    <span class="fb-dp-tag">PRZED - Aktywność</span>
    <div class="fb-dp-row"><span class="n">Bugs found</span><span class="v">47</span></div>
    <div class="fb-dp-row"><span class="n">Tests executed</span><span class="v">312</span></div>
    <div class="fb-dp-row"><span class="n">Pass rate</span><span class="v">94%</span></div>
    <div class="fb-dp-row"><span class="n">Coverage</span><span class="v">82%</span></div>
    <div class="fb-dp-verdict">Nikt nie czyta. Decyzja na czuja.</div>
  </div>
  <div class="fb-dp fb-dp-after">
    <span class="fb-dp-tag">PO - Wyniki</span>
    <div class="fb-dp-row"><span class="n">Defect Detection Ratio</span><span class="v">94% <span class="tg">↑</span></span></div>
    <div class="fb-dp-row"><span class="n">Escaped / Release</span><span class="v">1.2 <span class="tg">↓</span></span></div>
    <div class="fb-dp-row"><span class="n">Issues / Release</span><span class="v">8 <span class="tg">↓ 40%</span></span></div>
    <div class="fb-dp-row"><span class="n">Releases this Q</span><span class="v">10</span></div>
    <div class="fb-dp-row"><span class="n">Confidence Score</span><span class="v">91%</span></div>
    <div class="fb-dp-verdict">Historia. Decyzje. GO.</div>
  </div>
</div>

Lewa strona mówi, jak bardzo QA jest zajęte. Prawa odpowiada na pytanie, które biznes faktycznie zadaje: **czy możemy releasować i jak zmienia się jakość?** Ta zmiana nie wymaga nowych narzędzi - wymaga nowego podejścia do pytania, które chcesz swoimi danymi odpowiedzieć.

## Czego biznes naprawdę chce - trzy filary

Stakeholderzy zadają trzy pytania - i to na nie powinny odpowiadać Twoje metryki QA. Nic więcej, nic mniej.

### Filar 1 - Pewność releasu

Jedno pytanie, jedna odpowiedź: **czy możemy wypuścić?** Release Confidence Score agreguje blokery, wyniki regresji i krytyczne ścieżki w jeden wskaźnik. Jeden numer - jedna decyzja na steering committee.

<div class="fb-conf-row">
  <div class="fb-cc fb-cc-r">
    <div class="fb-cc-sprint">Sprint 12</div>
    <div class="fb-cc-score">62%</div>
    <span class="fb-cc-badge">Wstrzymano</span>
  </div>
  <div class="fb-cc fb-cc-a">
    <div class="fb-cc-sprint">Sprint 13</div>
    <div class="fb-cc-score">78%</div>
    <span class="fb-cc-badge">Warunkowo</span>
  </div>
  <div class="fb-cc fb-cc-g">
    <div class="fb-cc-sprint">Sprint 14</div>
    <div class="fb-cc-score">94%</div>
    <span class="fb-cc-badge">GO</span>
  </div>
</div>

### Filar 2 - Koszt defektów

Jeden escaped bug to nie *„+1 do licznika"*. To konkretna liczba godzin i złotówek. Kiedy zaczniesz to przeliczać - masz argument finansowy, który rozumie każdy CFO i każdy Engineering Manager.

<div class="fb-cost-grid">
  <div class="fb-cost-card">
    <div class="fb-cost-role">DevOps</div>
    <div class="fb-cost-val">4.5h</div>
    <div class="fb-cost-unit">hotfix + rollback</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">Developer</div>
    <div class="fb-cost-val">2h</div>
    <div class="fb-cost-unit">analiza + fix</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">PM</div>
    <div class="fb-cost-val">1h</div>
    <div class="fb-cost-unit">koordynacja</div>
  </div>
  <div class="fb-cost-card">
    <div class="fb-cost-role">SLA breach</div>
    <div class="fb-cost-val fb-cost-val-sm">+kara</div>
    <div class="fb-cost-unit">zaufanie klienta</div>
  </div>
  <div class="fb-cost-card fb-cost-total">
    <div class="fb-cost-role">Razem</div>
    <div class="fb-cost-val">8h+</div>
    <div class="fb-cost-unit">na 1 defekt</div>
  </div>
</div>

### Filar 3 - Trendy jakości

Jeden sprint to nic. Cztery kwartały to historia - i bezpośredni dowód, że inwestycja w QA przynosi efekty. Trend escaped defect rate to jeden z najsilniejszych argumentów w rozmowie z zarządem, bo mówi o zwrocie z inwestycji.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped Defect Rate - trend roczny</div>
      <div class="fb-chart-sub">Procent defektów odkrytych po deploymencie na produkcję</div>
    </div>
    <span class="fb-chart-badge">↓ 66% YoY</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#B03333"></span>Escaped Defect Rate (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-escaped" role="img" aria-label="Wykres liniowy: spadek escaped defect rate z 3.2% w Q1 2025 do 1.1% w Q4 2025."></canvas>
  </div>
</div>

## Pięć metryk, które razem opowiadają historię

Każda z poniższych metryk odpowiada na jedno konkretne pytanie biznesowe. Ich połączenie tworzy narrację, którą stakeholderzy rozumieją i na której mogą działać. Osobno informują - razem opowiadają historię.

<div class="fb-table-wrap">
<table class="fb-m-table">
  <thead>
    <tr>
      <th>#</th>
      <th>Metryka</th>
      <th>Na jakie pytanie odpowiada?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="fb-t-num">01</td>
      <td><div class="fb-t-name">Defect Detection Ratio</div><div class="fb-t-desc">DDR = bugi pre-release ÷ (pre + post)</div></td>
      <td class="fb-t-q">Ile defektów łapiemy zanim trafią na produkcję?</td>
    </tr>
    <tr>
      <td class="fb-t-num">02</td>
      <td><div class="fb-t-name">Escaped Bugs &amp; Problems</div><div class="fb-t-desc">Kod, infra, konfiguracja, integracje, regresje po deploymencie</div></td>
      <td class="fb-t-q">Co i w jakiej formie ucieka na produkcję?</td>
    </tr>
    <tr>
      <td class="fb-t-num">03</td>
      <td><div class="fb-t-name">Issues per Release</div><div class="fb-t-desc">Wszystkie problemy znalezione w jednym releasie</div></td>
      <td class="fb-t-q">Jak dojrzały jest kod trafiający do testów?</td>
    </tr>
    <tr>
      <td class="fb-t-num">04</td>
      <td><div class="fb-t-name">Escaped Bugs per Release</div><div class="fb-t-desc">Escaped per konkretny release - nie ogólny rate</div></td>
      <td class="fb-t-q">Które releasey były ryzykowne i dlaczego?</td>
    </tr>
    <tr>
      <td class="fb-t-num">05</td>
      <td><div class="fb-t-name">Number of Releases</div><div class="fb-t-desc">Metryka kontekstowa - normalizuje wszystkie powyższe</div></td>
      <td class="fb-t-q">Czy porównujemy jabłka z jabłkami?</td>
    </tr>
  </tbody>
</table>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">DDR vs Escaped Bugs - trend kwartalny</div>
      <div class="fb-chart-sub">Klasyczny zdrowy trend QA: DDR rośnie, escaped spada - jednocześnie</div>
    </div>
    <span class="fb-chart-badge">Q1–Q4 2025</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>DDR (%)</span>
    <span class="fb-lg"><span class="fb-ld fb-ld-dash"></span>Escaped Bugs (szt.)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-ddr" role="img" aria-label="Wykres: DDR rośnie od 78% do 94%, Escaped Bugs spada od 13 do 4."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Issues per Release - dojrzałość kodu</div>
      <div class="fb-chart-sub">Spadek z 24 do 8 to 66% poprawa. Nie tylko QA - cały proces wytwórczy dojrzewa.</div>
    </div>
    <span class="fb-chart-badge">v2.1 → v2.5</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Issues znalezione w releasie</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-issues" role="img" aria-label="Wykres słupkowy: Issues per release v2.1=24, v2.2=19, v2.3=14, v2.4=11, v2.5=8."></canvas>
  </div>
</div>

Trzy releasey z rzędu poniżej 10 issues to moment, w którym możesz powiedzieć Engineering Managerowi: *„patrz, co zrobiliśmy razem przez ostatnie pół roku."* To jest rozmowa, którą data umożliwia - ale której bez danych nie ma.

<div class="fb-map">
  <span class="fb-map-eyebrow">Model mapowania</span>
  <h2 class="fb-map-h">QA → Business KPIs</h2>
  <p class="fb-map-sub">Każda metryka QA ma swój odpowiednik w języku biznesu. Zadanie QA Leada to zbudować ten most - i każdą liczbę zakotwiczyć w pytaniu, które zadaje stakeholder na steering committee.</p>
  <div class="fb-map-grid">
    <div class="fb-m-card">
      <div class="fb-m-metric">Confidence Score</div>
      <div class="fb-m-kpi">Release Predictability</div>
      <div class="fb-m-q">Czy możemy releasować bezpiecznie?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">DDR + Escaped Rate</div>
      <div class="fb-m-kpi">Cost of Poor Quality</div>
      <div class="fb-m-q">Ile kosztują nas błędy?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">Issues/Release + Releases</div>
      <div class="fb-m-kpi">Delivery Sustainability</div>
      <div class="fb-m-q">Czy przyspieszamy bezpiecznie?</div>
    </div>
    <div class="fb-m-card">
      <div class="fb-m-metric">Escaped/Release trend</div>
      <div class="fb-m-kpi">Risk per Deployment</div>
      <div class="fb-m-q">Który release był ryzykowny?</div>
    </div>
  </div>
</div>

## Trzy antywzorce raportowania

Nawet dobre dane można zaprezentować źle. Oto błędy, które najczęściej niszczą wiarygodność QA w oczach biznesu - i których wystarczy być świadomym, żeby ich unikać.

<div class="fb-anti-grid">
  <div class="fb-anti-card">
    <div class="fb-anti-num">01</div>
    <div class="fb-anti-title">Za dużo metryk</div>
    <div class="fb-anti-desc">Dashboard z 20 wykresami jest przytłaczający. Kiedy wszystko jest ważne - nic nie jest ważne. Zacznij od 3 metryk, dodawaj stopniowo.</div>
  </div>
  <div class="fb-anti-card">
    <div class="fb-anti-num">02</div>
    <div class="fb-anti-title">Brak kontekstu</div>
    <div class="fb-anti-desc">Samo „82%" bez trendu i celu nie mówi nic. Zawsze: liczba + kierunek + cel. Trend mówi skąd idziesz, cel - dokąd zmierzasz.</div>
  </div>
  <div class="fb-anti-card">
    <div class="fb-anti-num">03</div>
    <div class="fb-anti-title">Żargon techniczny</div>
    <div class="fb-anti-desc">Mów językiem odbiorcy, nie narzędzia. Zero „flaky tests w CI/CD pipeline" na slajdzie dla Product Ownera. Prosto i jasno.</div>
  </div>
</div>

## Co dalej - 9 artykułów, jeden temat

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title">Kompletny przewodnik <span class="fb-s-now">czytasz teraz</span></div>
        <div class="fb-s-sub">Diagnoza problemu, trzy filary, pięć metryk, model mapowania QA → KPI</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title">Defect Detection Ratio - głęboki przewodnik</div>
        <div class="fb-s-sub">Formuła, interpretacja, pułapki, przykłady liczbowe z życia</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title">Escaped Bugs &amp; Problems - pełne spektrum</div>
        <div class="fb-s-sub">Dlaczego liczyć więcej niż tylko bugi w kodzie aplikacji</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">04</span>
      <div>
        <div class="fb-s-title">Issues per Release - miernik dojrzałości kodu</div>
        <div class="fb-s-sub">Jak ta metryka zmienia rozmowę z Engineering Managerem</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">05</span>
      <div>
        <div class="fb-s-title">Escaped Bugs per Release - znajdź ryzykowny release</div>
        <div class="fb-s-sub">Pinpointowanie problemów, nie tylko obserwowanie trendów</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">06</span>
      <div>
        <div class="fb-s-title">Number of Releases - metryka kontekstowa</div>
        <div class="fb-s-sub">Dlaczego 3 bugi przy 2 releasach to dramat, a przy 15 to sukces</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">07</span>
      <div>
        <div class="fb-s-title">Release Confidence Score krok po kroku</div>
        <div class="fb-s-sub">Trzy modele obliczania, wdrożenie, konkretne przykłady z praktyki</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">08</span>
      <div>
        <div class="fb-s-title">Storytelling z metrykami - jak budować narrację</div>
        <div class="fb-s-sub">Jak zamienić tabelę liczb w argument biznesowy</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">09</span>
      <div>
        <div class="fb-s-title">3 antywzorce, które niszczą wiarygodność QA</div>
        <div class="fb-s-sub">Za dużo metryk, brak kontekstu, żargon - i jak unikać każdego z nich</div>
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

/* PRZED / PO */
.fb-compare {
  display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 28px 0;
}
@media (max-width: 560px) { .fb-compare { grid-template-columns: 1fr; } }
.fb-dp { border-radius: 12px; padding: 22px; }
.fb-dp-before { background: var(--fb-surface); border: 1px solid var(--fb-border); }
.fb-dp-after  { background: var(--fb-navy); color: #fff; }
.fb-dp-tag {
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; padding: 4px 11px;
  border-radius: 20px; display: inline-block; margin-bottom: 18px;
}
.fb-dp-before .fb-dp-tag { background: #E5E1D8; color: var(--fb-muted); }
.fb-dp-after  .fb-dp-tag { background: rgba(200,148,58,0.18); color: var(--fb-gold); }
.fb-dp-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 9px 0; border-bottom: 1px solid rgba(0,0,0,0.07); font-size: 13px;
}
.fb-dp-after .fb-dp-row { border-color: rgba(255,255,255,0.08); }
.fb-dp-row:last-of-type { border-bottom: none; }
.fb-dp-before .fb-dp-row .n { color: var(--fb-muted); }
.fb-dp-after  .fb-dp-row .n { color: rgba(255,255,255,0.55); font-size: 12px; }
.fb-dp-before .fb-dp-row .v { font-weight: 700; color: #111; font-size: 14px; }
.fb-dp-after  .fb-dp-row .v { font-weight: 700; color: #fff; font-size: 14px; }
.fb-dp-after  .fb-dp-row .v .tg { color: #3DAA6A; font-size: 11px; font-weight: 400; margin-left: 4px; }
.fb-dp-verdict {
  margin-top: 16px; padding: 9px; border-radius: 6px;
  font-size: 11px; font-weight: 700; text-align: center; letter-spacing: 0.04em;
}
.fb-dp-before .fb-dp-verdict { background: #DEDAD3; color: var(--fb-muted); }
.fb-dp-after  .fb-dp-verdict { background: rgba(61,170,106,0.15); color: #3DAA6A; }

/* CONFIDENCE CARDS */
.fb-conf-row { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 24px 0; }
@media (max-width: 480px) { .fb-conf-row { grid-template-columns: 1fr; } }
.fb-cc { border-radius: 12px; padding: 22px 16px; text-align: center; border: 1.5px solid; }
.fb-cc-r { background: #FEF2F2; border-color: #FCA5A5; }
.fb-cc-a { background: #FFFBEB; border-color: #FCD34D; }
.fb-cc-g { background: #F0FDF4; border-color: #86EFAC; }
.fb-cc-sprint { font-size: 11px; color: var(--fb-faint); margin-bottom: 6px; letter-spacing: 0.04em; }
.fb-cc-score {
  font-family: Georgia, serif; font-size: 2.5rem; font-weight: 500; line-height: 1; margin-bottom: 12px;
}
.fb-cc-r .fb-cc-score { color: #DC2626; }
.fb-cc-a .fb-cc-score { color: #D97706; }
.fb-cc-g .fb-cc-score { color: #16A34A; }
.fb-cc-badge {
  font-size: 9px; font-weight: 800; letter-spacing: 0.14em;
  text-transform: uppercase; padding: 5px 13px; border-radius: 20px; display: inline-block; color: #fff;
}
.fb-cc-r .fb-cc-badge { background: #DC2626; }
.fb-cc-a .fb-cc-badge { background: #D97706; }
.fb-cc-g .fb-cc-badge { background: #16A34A; }

/* COST GRID */
.fb-cost-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 10px; margin: 24px 0;
}
.fb-cost-card {
  background: var(--fb-surface); border: 1px solid var(--fb-border);
  border-radius: 10px; padding: 18px 14px; text-align: center;
}
.fb-cost-total { background: var(--fb-navy); border-color: var(--fb-navy); }
.fb-cost-role { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 5px; }
.fb-cost-total .fb-cost-role { color: rgba(255,255,255,0.4); }
.fb-cost-val { font-family: Georgia, serif; font-size: 1.8rem; font-weight: 500; color: #111; line-height: 1; }
.fb-cost-val-sm { font-size: 1.1rem; padding-top: 5px; }
.fb-cost-total .fb-cost-val { color: #fff; }
.fb-cost-unit { font-size: 11px; color: var(--fb-faint); margin-top: 4px; }
.fb-cost-total .fb-cost-unit { color: rgba(255,255,255,0.4); }

/* CHARTS */
.fb-chart-card {
  background: var(--fb-surface); border: 1px solid var(--fb-border);
  border-radius: 12px; padding: 22px; margin: 28px 0;
}
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge {
  font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap;
  background: var(--fb-teal-pale); color: var(--fb-teal);
}
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-ld-dash { width: 16px; height: 0; border-top: 2px dashed #B03333; border-radius: 0; }
.fb-chart-canvas { position: relative; width: 100%; }

/* METRICS TABLE */
.fb-table-wrap { margin: 24px 0; overflow-x: auto; }
.fb-m-table { width: 100%; border-collapse: collapse; font-size: 13px; table-layout: fixed; }
.fb-m-table thead th {
  font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--fb-muted); padding: 11px 16px; text-align: left;
  border-bottom: 2px solid var(--fb-border); background: var(--fb-surface);
}
.fb-m-table thead th:first-child { width: 48px; }
.fb-m-table td { padding: 15px 16px; border-bottom: 1px solid var(--fb-border); vertical-align: top; }
.fb-m-table tr:last-child td { border-bottom: none; }
.fb-t-num { font-family: Georgia, serif; font-size: 17px; font-weight: 500; color: var(--fb-navy); }
.fb-t-name { font-weight: 700; color: #111; margin-bottom: 3px; font-size: 13px; }
.fb-t-desc { font-size: 11px; color: var(--fb-faint); }
.fb-t-q { font-size: 12px; color: var(--fb-teal); font-style: italic; }

/* MAPPING dark */
.fb-map {
  background: var(--fb-navy); color: #fff;
  padding: 48px 32px; margin: 40px 0;
  border-radius: 16px;
}
.fb-map-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); }
.fb-map-h { font-family: Georgia, serif; color: #fff !important; margin: 8px 0 10px; font-size: 1.7rem; font-weight: 500; }
.fb-map-sub { color: rgba(255,255,255,0.6); font-size: 15px; margin-bottom: 24px; }
.fb-map-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 14px; }
@media (max-width: 500px) { .fb-map-grid { grid-template-columns: 1fr; } }
.fb-m-card {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 20px;
}
.fb-m-metric { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 7px; }
.fb-m-kpi { font-family: Georgia, serif; font-size: 17px; color: #fff; margin-bottom: 5px; }
.fb-m-q { font-size: 12px; color: rgba(255,255,255,0.45); font-style: italic; }

/* ANTYWZORCE */
.fb-anti-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin: 24px 0; }
.fb-anti-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; background: #fff; }
.fb-anti-num { font-family: Georgia, serif; font-size: 2.5rem; font-weight: 300; color: var(--fb-border); line-height: 1; margin-bottom: 12px; }
.fb-anti-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 8px; }
.fb-anti-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.6; }

/* SERIES */
.fb-series { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 16px; padding: 28px; margin: 28px 0; }
.fb-series-eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 16px; }
.fb-s-list { list-style: none; padding: 0; margin: 0; }
.fb-s-item { display: flex; align-items: flex-start; gap: 16px; padding: 12px 0; border-bottom: 1px solid var(--fb-border); }
.fb-s-item:last-child { border-bottom: none; }
.fb-s-num { font-family: Georgia, serif; font-size: 16px; font-weight: 500; color: var(--fb-navy); min-width: 22px; flex-shrink: 0; padding-top: 1px; }
.fb-s-current .fb-s-num { color: var(--fb-gold); }
.fb-s-title { font-size: 14px; font-weight: 600; color: #111; }
.fb-s-current .fb-s-title { color: var(--fb-gold); }
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now {
  display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
  background: var(--fb-gold-pale); color: var(--fb-gold);
  padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle;
}

/* Dark mode delikatne dopasowanie */
:root[data-theme="dark"] .fb-article .fb-dp-before,
:root[data-theme="dark"] .fb-article .fb-cost-card:not(.fb-cost-total),
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-anti-card,
:root[data-theme="dark"] .fb-article .fb-table-wrap { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-m-table thead th { background: rgba(255,255,255,0.04); color: #ccc; }
:root[data-theme="dark"] .fb-article .fb-t-name,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-anti-title,
:root[data-theme="dark"] .fb-article .fb-s-title,
:root[data-theme="dark"] .fb-article .fb-cost-card:not(.fb-cost-total) .fb-cost-val,
:root[data-theme="dark"] .fb-article .fb-dp-before .fb-dp-row .v { color: #fff; }
</style>

<script is:inline src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script is:inline>
(function () {
  function init() {
    if (typeof Chart === 'undefined') { setTimeout(init, 80); return; }
    if (window.__fbChartsRendered) return;
    window.__fbChartsRendered = true;
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    var esc = document.getElementById('fb-c-escaped');
    if (esc) new Chart(esc, {
      type: 'line',
      data: {
        labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
        datasets: [{
          data: [3.2, 2.4, 1.6, 1.1],
          borderColor: '#B03333',
          backgroundColor: 'rgba(176,51,51,0.09)',
          borderWidth: 2.5,
          pointBackgroundColor: '#B03333',
          pointRadius: 5, pointHoverRadius: 7,
          fill: true, tension: 0.4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '  ' + c.raw + '%'; } } } },
        scales: {
          y: { min: 0, max: 4, ticks: { callback: function (v) { return v + '%'; }, stepSize: 1 }, grid: { color: grid }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
    var ddr = document.getElementById('fb-c-ddr');
    if (ddr) new Chart(ddr, {
      type: 'line',
      data: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
          { label: 'DDR', data: [78, 84, 90, 94], borderColor: '#2A7A3E', backgroundColor: 'rgba(42,122,62,0.08)', borderWidth: 2.5, pointBackgroundColor: '#2A7A3E', pointRadius: 5, fill: true, tension: 0.4, yAxisID: 'y' },
          { label: 'Escaped Bugs', data: [13, 11, 7, 4], borderColor: '#B03333', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [6, 4], pointBackgroundColor: '#B03333', pointStyle: 'triangle', pointRadius: 6, fill: false, tension: 0.4, yAxisID: 'y1' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 60, max: 100, ticks: { callback: function (v) { return v + '%'; }, stepSize: 10 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'DDR', font: { size: 10 }, color: '#2A7A3E' } },
          y1: { position: 'right', min: 0, max: 18, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Escaped', font: { size: 10 }, color: '#B03333' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
    var iss = document.getElementById('fb-c-issues');
    if (iss) new Chart(iss, {
      type: 'bar',
      data: {
        labels: ['v2.1', 'v2.2', 'v2.3', 'v2.4', 'v2.5'],
        datasets: [{ data: [24, 19, 14, 11, 8], backgroundColor: ['#0B1E3A', '#163254', '#1F4A80', '#3B77BF', '#0A6B6F'], borderRadius: 6, borderSkipped: false }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return '  ' + c.raw + ' issues'; } } } },
        scales: { y: { min: 0, max: 28, ticks: { stepSize: 8 }, grid: { color: grid }, border: { display: false } }, x: { grid: { display: false }, border: { display: false } } }
      }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
</script>
