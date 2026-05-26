---
title: "Defect Detection Ratio - jak mierzyć skuteczność zanim cokolwiek trafi na produkcję"
description: "Głęboki przewodnik po Defect Detection Ratio - formuła podstawowa i ważona, progi interpretacji, dane historyczne, sezonowość, trzy pułapki i gotowe zdania na spotkanie z zarządem."
date: 2026-05-26
tags: ["qa", "metryki", "leadership", "ddr"]
lang: pl
readingTime: 15
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 2 z 9</p>

<p class="fb-lead">Wchodzisz na 1:1 z Engineering Managerem. Pada jedno pytanie: <em>„Ile z tych bugów łapiecie zanim trafią do klienta?"</em> - i rozmowa zaczyna się sypać. Nie dlatego, że źle testujecie. Dlatego, że nie macie jednej liczby.</p>

<div class="fb-dialogue">
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">„Słuchaj - jak skuteczni jesteście właściwie w tym testowaniu? Ile z tych bugów łapiecie, zanim trafią do klienta?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">„No... znaleźliśmy 47 bugów w tym sprincie."</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">„Tak, ale ile uciekło?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">„Ee... dwadzieścia dwa."</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-em">EM</span><span class="fb-d-text">„To znaczy, że połowa was omija?"</span></div>
  <div class="fb-d-line"><span class="fb-d-who fb-d-qa">QA</span><span class="fb-d-text">„No... nie do końca, bo tamte były mniejsze..."</span></div>
</div>

I wtedy rozmowa zaczyna się sypać. Nie dlatego, że źle testujecie. Dlatego, że nie macie liczby, która odpowiada na to pytanie wprost. Jednej. Konkretnej. Gotowej.

Ta liczba istnieje. Nazywa się **Defect Detection Ratio** - i jest tematem tego artykułu.

## Czym jest DDR - i czym nie jest

Defect Detection Ratio to odsetek defektów wykrytych przez QA *przed* trafieniem na produkcję w stosunku do wszystkich defektów znalezionych łącznie - zarówno przed, jak i po releasie. Innymi słowy: spośród wszystkich problemów, które ostatecznie wyszły na jaw - ile złapaliście sami, zanim zobaczył je klient?

To jest metryka **skuteczności procesu testowania**. Nie aktywności. Odpowiedź na pytanie: *jak dobrze działamy jako filtr przed produkcją?*

<blockquote class="fb-quote">DDR pyta o coś fundamentalnie innego niż pass rate czy coverage: czy Twój proces testowania faktycznie wyłapuje to, co ważne?</blockquote>

**DDR to nie to samo co pass rate.** Możesz mieć pass rate 99% i DDR 50% - jeśli testy nie pokrywają obszarów, w których siedzą bugi.

**DDR to nie to samo co coverage.** Możesz przelecieć przez 90% kodu i nie sprawdzić ani jednego krytycznego scenariusza biznesowego. Dotknięcie to nie to samo co weryfikacja.

## Od prostej do zaawansowanej formuły

### Wersja podstawowa

<div class="fb-formula-box">
  <div class="fb-f-label">Formuła podstawowa</div>
  <div class="fb-formula">DDR = Bugi przed releasem ÷ (Bugi przed + Bugi po)</div>
  <div class="fb-formula-example">DDR = 40 ÷ (40 + 10) = 40 ÷ 50 = <strong>80%</strong></div>
  <div class="fb-formula-note">Osiem na dziesięć problemów złapanych przed klientem. Jeden na pięć uciekł. To jest Wasz punkt startowy.</div>
</div>

### Wersja z wagami krytyczności

Podstawowa formuła traktuje każdego buga jednakowo. Ale bug blokujący płatności waży więcej niż literówka w tooltipie. Warto rozszerzyć formułę o wagi.

<div class="fb-formula-box fb-weighted">
  <div class="fb-f-label">Formuła ważona</div>
  <div class="fb-formula">DDR(ważony) = Σ(waga × bugi_pre) ÷ Σ(waga × bugi_pre + waga × bugi_post)</div>
  <div class="fb-formula-note">Zaczynajcie od wersji podstawowej. Ważoną wprowadzajcie gdy macie stabilny rytm pomiaru i dane historyczne.</div>
</div>

<div class="fb-table-wrap">
<table class="fb-w-table">
  <thead>
    <tr><th>Priorytet</th><th>Przed</th><th>Po</th><th>Waga</th><th>Ważone przed</th><th>Ważone po</th></tr>
  </thead>
  <tbody>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#dc2626"></span>Critical</span></td><td>2</td><td>3</td><td>×4</td><td>8</td><td>12</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#f59e0b"></span>High</span></td><td>8</td><td>5</td><td>×2</td><td>16</td><td>10</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#3b82f6"></span>Medium</span></td><td>20</td><td>2</td><td>×1</td><td>20</td><td>2</td></tr>
    <tr><td><span class="fb-pri"><span class="fb-pri-dot" style="background:#9ca3af"></span>Low</span></td><td>10</td><td>0</td><td>×0.5</td><td>5</td><td>0</td></tr>
    <tr><td><strong>Suma</strong></td><td><strong>40</strong></td><td><strong>10</strong></td><td>-</td><td><strong>49</strong></td><td><strong>24</strong></td></tr>
  </tbody>
</table>
</div>

<div class="fb-w-result">DDR(ważony) = 49 ÷ (49 + 24) = 49 ÷ 73 = <strong>67%</strong></div>

<div class="fb-alert-box">
<strong>Uwaga na wynik.</strong> Podstawowy DDR wynosił 80% - i wyglądał dobrze. Ważony wynosi 67% - i ujawnia, że większość bugów krytycznych uciekała na produkcję. To jest zupełnie inna historia. I właśnie tę historię warto opowiedzieć.
</div>

## Kalkulator DDR

Wpisz swoje dane i sprawdź wynik. Włącz tryb ważony, by uwzględnić krytyczność bugów.

<div class="fb-calc-wrap">
  <div class="fb-calc-title">Oblicz swój DDR</div>
  <div class="fb-calc-sub">Wersja podstawowa lub ważona - Twój wybór</div>
  <div class="fb-calc-grid">
    <div class="fb-calc-field">
      <label>Bugi znalezione przed releasem</label>
      <input type="number" id="ddr-pre" value="40" min="0" />
    </div>
    <div class="fb-calc-field">
      <label>Bugi znalezione po releasie (escaped)</label>
      <input type="number" id="ddr-post" value="10" min="0" />
    </div>
  </div>
  <div class="fb-calc-toggle-row">
    <label class="fb-calc-toggle"><input type="checkbox" id="ddr-weighted" /><span class="fb-calc-slider"></span></label>
    <span class="fb-calc-toggle-label">Tryb ważony (uwzględnij priorytety bugów)</span>
  </div>
  <div class="fb-calc-weights" id="ddr-weights">
    <div class="fb-weights-grid">
      <div>
        <span class="fb-wf-label" style="color:#f87171">Critical ×4</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wc-pre" value="2" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wc-post" value="3" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#fcd34d">High ×2</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wh-pre" value="8" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wh-post" value="5" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#93c5fd">Medium ×1</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wm-pre" value="20" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wm-post" value="2" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
      <div>
        <span class="fb-wf-label" style="color:#9ca3af">Low ×0.5</span>
        <div class="fb-wf-row"><input type="number" id="ddr-wl-pre" value="10" min="0" /><span class="fb-wf-mult">pre</span></div>
        <div class="fb-wf-row"><input type="number" id="ddr-wl-post" value="0" min="0" /><span class="fb-wf-mult">post</span></div>
      </div>
    </div>
  </div>
  <div class="fb-calc-result" id="ddr-result">
    <div class="fb-cr-score" id="ddr-score">80%</div>
    <div class="fb-cr-info">
      <div class="fb-cr-label">Defect Detection Ratio</div>
      <div class="fb-cr-verdict" id="ddr-verdict">Solidny proces - co kryje się w tym co ucieka?</div>
      <div class="fb-cr-formula" id="ddr-formula">40 ÷ (40 + 10) = 80.0%</div>
    </div>
  </div>
</div>

## Jak czytać wynik - progi i kontekst

DDR nie jest absolutną prawdą. Jest wskaźnikiem - i jak każdy wskaźnik, wymaga interpretacji. Ale pewne progi branżowe warto znać jako punkt odniesienia.

<div class="fb-gauge-wrap">
  <div class="fb-gauge-track"></div>
  <div class="fb-gauge-markers">
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">0%</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">70%</span><span class="fb-gauge-label">próg alarmowy</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">85%</span><span class="fb-gauge-label">próg dobry</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">95%</span><span class="fb-gauge-label">próg doskonały</span></div>
    <div class="fb-gauge-mark"><span class="fb-gauge-pct">100%</span></div>
  </div>
</div>

<div class="fb-gauge-zones">
  <div class="fb-gz fb-gz-danger">
    <div class="fb-gz-title">Poniżej 70%</div>
    <div class="fb-gz-desc">Sygnał alarmowy. Więcej niż 3 na 10 bugów wychodzi na produkcji. Zbadaj przyczyny.</div>
  </div>
  <div class="fb-gz fb-gz-avg">
    <div class="fb-gz-title">70-85%</div>
    <div class="fb-gz-desc">Poziom przeciętny. Dobry punkt startowy. Jest z czego rosnąć.</div>
  </div>
  <div class="fb-gz fb-gz-good">
    <div class="fb-gz-title">85-95%</div>
    <div class="fb-gz-desc">Solidny proces. Pytanie: co kryje się w tych kilku procentach, które uciekają?</div>
  </div>
  <div class="fb-gz fb-gz-great">
    <div class="fb-gz-title">Powyżej 95%</div>
    <div class="fb-gz-desc">Doskonały wynik - ale sprawdź, czy dane są kompletne. Wysoki DDR może być artefaktem niepełnych danych.</div>
  </div>
</div>

**Kontekst branżowy ma znaczenie.** W systemach finansowych i medycznych 90%+ to minimum, nie aspiracja. W szybko iterującym startupie 80% przy wysokiej częstotliwości releasów może być świadomym, akceptowalnym kompromisem.

## Dlaczego nie możesz zacząć od dziś - dane historyczne

Jeden z najczęstszych błędów przy wdrażaniu DDR: zespół zaczyna mierzyć od bieżącego sprintu i po miesiącu ma jeden punkt danych. Jeden. Z którego nie da się wyciągnąć żadnego wniosku.

<blockquote class="fb-quote">DDR bez historii jest jak mapa bez skali. Wiesz, że jesteś gdzieś - ale nie wiesz, w jakim kierunku idziesz i jak szybko.</blockquote>

Zanim zaczniesz mierzyć "od teraz", zrób coś znacznie cenniejszego: **odtwórz dane wstecz.** Większość organizacji ma wszystkie niezbędne dane - tylko nikt ich jeszcze nie połączył w ten konkretny sposób.

### Skąd wziąć dane historyczne

<div class="fb-src-grid">
  <div class="fb-src-card">
    <div class="fb-src-name">Jira / tracker</div>
    <div class="fb-src-desc">Historia bugów z datą i środowiskiem. Export do CSV + JQL po dacie i typie.</div>
    <span class="fb-src-tag fb-src-primary">Główne źródło</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Support tickety</div>
    <div class="fb-src-desc">Freshdesk, Zendesk, ServiceNow. Tu siedzą problemy, które nigdy nie trafiły do Jiry.</div>
    <span class="fb-src-tag fb-src-secondary">Uzupełnienie</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Monitoring / alerty</div>
    <div class="fb-src-desc">PagerDuty, Datadog, Grafana. Incydenty z dokładnym timestampem.</div>
    <span class="fb-src-tag fb-src-secondary">Uzupełnienie</span>
  </div>
  <div class="fb-src-card">
    <div class="fb-src-name">Historia deploymentów</div>
    <div class="fb-src-desc">Git tags, CI/CD pipeline, changelog. Kiedy lądował każdy release.</div>
    <span class="fb-src-tag fb-src-primary">Kontekst</span>
  </div>
</div>

```jql
project = MYAPP AND issuetype = Bug AND created >= "2025-01-01"
ORDER BY created ASC
```

### Sezonowość i prawidłowości

Gdy masz 12 miesięcy danych, zaczynasz widzieć prawidłowości, których intuicja nie wychwyci.

<div class="fb-season-grid">
  <div class="fb-season-card">
    <div class="fb-season-title">Sezonowość releasów</div>
    <div class="fb-season-desc">Piki release'owe przed Q4, Black Friday, zamknięciem roku. Znając rytm - planujesz pojemność testową z wyprzedzeniem, nie gasząc pożarów.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">Rotacja i onboarding</div>
    <div class="fb-season-desc">Nowy QA przez pierwsze dwa miesiące łapie mniej niż senior. Bez danych nie wiesz, czy spadek DDR to problem procesowy czy efekt onboardingu.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">Typ feature'u</div>
    <div class="fb-season-desc">Nowe integracje, duże refaktoringi, nowe moduły - DDR spada przy konkretnych typach zmian. Możesz to przewidywać i kierować wysiłek testowy.</div>
  </div>
  <div class="fb-season-card">
    <div class="fb-season-title">Wzorzec pierwszego release'u</div>
    <div class="fb-season-desc">Pierwszy deployment miesiąca ma statystycznie więcej escaped bugów. Skumulowane zmiany + środowisko produkcyjne "odeszło" od stanu testowego.</div>
  </div>
</div>

### Minimum viable approach - jak zebrać dane praktycznie

<div class="fb-steps">
  <div class="fb-step"><div class="fb-step-num">1</div><div class="fb-step-body"><div class="fb-step-title">Export bugów z Jiry do CSV</div><div class="fb-step-text">Potrzebujesz: ID, data created, środowisko (test/staging/prod), priorytet. JQL powyżej + export.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">2</div><div class="fb-step-body"><div class="fb-step-title">Stwórz tabelę release'ów</div><div class="fb-step-text">Data + numer wersji. Jeśli nie masz jej zebranej - git tags lub historia CI/CD to dadzą.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">3</div><div class="fb-step-body"><div class="fb-step-title">Przypisz każdy bug do release'u</div><div class="fb-step-text">Bug stworzony między release'em A a B → pre-release dla B. Bug po B a przed C, raportowany przez monitoring → escaped z B.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">4</div><div class="fb-step-body"><div class="fb-step-title">Oblicz DDR per release i narysuj wykres</div><div class="fb-step-text">4-6 releasów w jednej tabeli. Masz historię, trend i pierwsze wzorce. To ćwiczenie zajmuje 2-4 godziny. Warte każdej minuty.</div></div></div>
</div>

## Case study - od 74% do 94% w cztery kwartały

Siedmioosobowy zespół (5 devów, QA, automatyk), platforma SaaS dla klientów korporacyjnych. Na początku roku DDR 74% - trzy na dziesięć bugów ląduje na produkcji.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">DDR - trend przez cztery kwartały</div>
      <div class="fb-chart-sub">Każdy kwartał: jedna konkretna zmiana procesowa</div>
    </div>
    <span class="fb-chart-badge">+20 pp. w rok</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>DDR (%)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#C8943A;border-radius:50%"></span>Zmiana procesowa</span>
  </div>
  <div class="fb-chart-canvas" style="height:220px"><canvas id="ddr-c-case" role="img" aria-label="Wykres DDR z 74% w Q1 do 94% w Q4."></canvas></div>
</div>

<div class="fb-timeline">
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#64748b">Q1</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Punkt startowy</div>
      <div class="fb-tl-title">Diagnoza - zanim cokolwiek zmienili, zmierzyli <span class="fb-tl-badge" style="background:#f1f5f9;color:#64748b">74%</span></div>
      <div class="fb-tl-text">Analiza 6 miesięcy historii pokazała 3 klastry uciekinierów: integracja z API płatności, edge case'y modułu raportowego, błędy konfiguracyjne po deploymencie. Testy jednostkowe - piękne. Ale żaden nie dotykał tych obszarów.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#2563eb">Q2</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Pierwsza interwencja</div>
      <div class="fb-tl-title">Testy kontraktowe + rozbudowa E2E <span class="fb-tl-badge" style="background:#dbeafe;color:#1d4ed8">84%</span></div>
      <div class="fb-tl-text">Wdrożono testy kontraktowe dla API płatności i rozbudowano E2E o scenariusze z modułu raportowego. Skok o 10 pp. w jeden kwartał - tylko dzięki wiedzy, gdzie nie testują.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#0A6B6F">Q3</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Zmiana procesu</div>
      <div class="fb-tl-title">Nowa definicja "done" <span class="fb-tl-badge" style="background:#D4EDEE;color:#0A6B6F">90%</span></div>
      <div class="fb-tl-text">Żaden feature nie wchodzi do QA bez minimalnego zestawu testów integracyjnych napisanych przez developera. QA przestało być bramkarzem na końcu - stało się partnerem przez cały sprint.</div>
    </div>
  </div>
  <div class="fb-tl-item">
    <div class="fb-tl-dot" style="background:#2A7A3E">Q4</div>
    <div class="fb-tl-body">
      <div class="fb-tl-q">Pełny obraz</div>
      <div class="fb-tl-title">Incydenty z monitoringu wliczone do mianownika <span class="fb-tl-badge" style="background:#F0FDF4;color:#2A7A3E">94%</span></div>
      <div class="fb-tl-text">Pozornie mała zmiana - do "bugów po releasie" dodano incydenty z supportu i monitoringu. Liczba wzrosła, ale DDR utrzymał się - bo równolegle rósł pre-release. Teraz mieli <strong>pełny, wiarygodny obraz</strong>.</div>
    </div>
  </div>
</div>

<blockquote class="fb-quote">„Każde 5 punktów procentowych DDR to średnio 4 mniej escaped bugów na kwartał, przy koszcie 8 godzin każdy - to jest 32 godziny seniorów. Na jeden kwartał." - Budżet zatwierdzony.</blockquote>

## Kiedy DDR kłamie - trzy pułapki

Każda metryka ma słabe strony. DDR ma trzy konkretne - i warto je znać, zanim zaczniesz jej ufać ślepo.

<div class="fb-trap-grid">
  <div class="fb-trap-card" data-num="01">
    <div class="fb-trap-title">Niekompletna definicja "po releasie"</div>
    <div class="fb-trap-text">Jeśli do licznika wchodzą tylko tickety z Jiry oznaczone przez QA - niedoszacowujesz escaped defectów. Co z incydentami supportu? Alertami monitoringu? Błędami w Splunku? <strong>Niekompletny mianownik = zawyżony DDR = pozorna doskonałość.</strong></div>
  </div>
  <div class="fb-trap-card" data-num="02">
    <div class="fb-trap-title">Bugi w kodzie ≠ wszystkie problemy</div>
    <div class="fb-trap-text">Zła konfiguracja produkcyjna. Padła integracja. Błędny feature flag. Żaden z nich nie jest "bugiem w kodzie" - ale każdy dotknął klientów. Jeśli DDR mierzy tylko defekty kodu - nie mierzysz całości ryzyka. (Więcej w artykule 3: Escaped Bugs &amp; Problems.)</div>
  </div>
  <div class="fb-trap-card" data-num="03">
    <div class="fb-trap-title">Wysoki DDR, ale tylko trywialnych bugów</div>
    <div class="fb-trap-text">Możesz mieć DDR 95% i regularnie wypuszczać krytyczne bugi - jeśli testy są świetne w wychwytywaniu literówek, a słabe w krytycznych ścieżkach biznesowych. Dlatego zawsze zestawiaj DDR z rozkładem priorytetów. Jeśli Twoje 95% to głównie Medium i Low - wróć do formuły ważonej.</div>
  </div>
</div>

## DDR w rękach biznesu - najniebezpieczniejsza pułapka

Tej pułapki nie znajdziesz w podręczniku ISTQB. A jest najgroźniejsza, bo dotyka nie metody pomiarowej, lecz sposobu interpretacji przez osoby, które nie znają kontekstu.

Wyobraź sobie: pokazujesz Product Ownerowi DDR 94%. Jest zadowolony. Mówi: *„świetnie, jesteśmy bezpieczni, releasujemy."* Ale nie wie, że w tym samym kwartale liczba releasów wzrosła z 3 do 10.

<div class="fb-table-wrap">
<table class="fb-danger-table">
  <thead><tr><th>Kwartał</th><th>DDR</th><th>Releasów</th><th>Escaped / Release</th><th>Escaped łącznie</th></tr></thead>
  <tbody>
    <tr><td>Q1</td><td class="fb-ddr-good">88%</td><td>3</td><td>2.4</td><td class="fb-escaped-warn">7</td></tr>
    <tr><td>Q2</td><td class="fb-ddr-good">90%</td><td>5</td><td>2.1</td><td class="fb-escaped-bad">10</td></tr>
    <tr><td>Q3</td><td class="fb-ddr-good">92%</td><td>8</td><td>1.8</td><td class="fb-escaped-bad">14</td></tr>
    <tr><td>Q4</td><td class="fb-ddr-good">94%</td><td>10</td><td>1.2</td><td class="fb-escaped-warn">12</td></tr>
  </tbody>
</table>
</div>

DDR rośnie przez wszystkie cztery kwartały. Wygląda świetnie. Ale liczba escaped bugów w liczbach bezwzględnych rosła przez Q1-Q3. Klient przez trzy kwartały odczuwał **więcej** problemów na produkcji - mimo rosnącego DDR.

<div class="fb-warning-pill">⚠️ Wysoki DDR bez kontekstu daje fałszywe poczucie bezpieczeństwa</div>

**DDR nigdy nie działa samotnie.** Ma pełny sens tylko razem z Escaped per Release (artykuł 5) i Number of Releases (artykuł 6). Prezentując DDR stakeholderom - zawsze pokazuj go z co najmniej jedną metryką kontekstową.

## Jak wdrożyć DDR w czterech krokach

Dość teorii. Oto co zrobić w najbliższym tygodniu.

<div class="fb-steps">
  <div class="fb-step"><div class="fb-step-num">1</div><div class="fb-step-body"><div class="fb-step-title">Ustal definicję i zapisz ją</div><div class="fb-step-text">Odpowiedz pisemnie na trzy pytania: co liczy się jako "bug przed releasem" (wszystkie środowiska testowe? tylko staging?), co liczy się jako "bug po releasie" (tylko Jira? także monitoring i support?), jaka jest granica czasowa dla bugów "po releasie" (tydzień? sprint? kwartał?). Bez tego DDR dwóch różnych zespołów nie jest porównywalny - nawet w tej samej organizacji.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">2</div><div class="fb-step-body"><div class="fb-step-title">Wybierz źródło danych</div><div class="fb-step-text"><strong>Idealnie:</strong> Jira + monitoring (Datadog/PagerDuty) + support tickety. <strong>Na start:</strong> Jira + ręczny log incydentów w Google Sheets. Brzmi prymitywnie - działa. Ważne, żeby zacząć.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">3</div><div class="fb-step-body"><div class="fb-step-title">Ustal rytm pomiaru</div><div class="fb-step-text"><strong>Per sprint</strong> - dobry start, szybki feedback, dużo szumu. <strong>Per release</strong> - bardziej naturalne, lepsze do trendów i raportowania biznesowego. Rekomendacja: per sprint wewnętrznie, per release do stakeholderów.</div></div></div>
  <div class="fb-step"><div class="fb-step-num">4</div><div class="fb-step-body"><div class="fb-step-title">Pierwsza prezentacja - zacznij od historii</div><div class="fb-step-text">Nie zaczynaj od DDR Q1. Zrób retroaktywne obliczenie za ostatnie 3 kwartały. Trend jest znacznie silniejszym argumentem niż pojedynczy punkt. *„Patrząc wstecz na ostatnie trzy kwartały, nasz defect detection ratio wyglądał tak: [wykres]. Trend jest rosnący - i chcę teraz ustalić, jak go dalej poprawiać."*</div></div></div>
</div>

## DDR w rozmowie z biznesem

Trzy konteksty. Trzy poziomy szczegółowości. Jeden wskaźnik u podstawy każdej rozmowy.

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„Defect Detection Ratio tego sprintu wynosi 88% - to znaczy, że 9 na 10 znalezionych problemów złapaliśmy zanim trafił do klientów. Jeden uciekł i jest już zaadresowany."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 z EM</span>
    <span class="fb-biz-text">„Trend DDR przez ostatni rok rośnie z 74% do 94%. Każdy punkt procentowy to realnie kilka godzin mniej na hotfixy. Chcę zaproponować konkretną zmianę, która powinna podbić go o kolejne 3-4 punkty."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„W ciągu ostatnich czterech kwartałów poprawiliśmy skuteczność wykrywania defektów przed produkcją z 74% do 94%. Przełożyło się to na spadek escaped bugów o ponad 60% - szacuję to na zaoszczędzone 200+ godzin pracy seniorów w skali roku."</span>
  </div>
</div>

## Co DDR mówi - i czego nie mówi

<div class="fb-summary-two-col">
  <div class="fb-sum-card fb-sum-yes">
    <div class="fb-sum-title">✓ DDR mówi Ci</div>
    <ul class="fb-sum-list">
      <li>Jak skuteczny jest Twój proces testowania jako całość</li>
      <li>Czy poprawiasz się w czasie (trend kwartalny)</li>
      <li>Gdzie jest granica między tym, co łapiesz, a tym, co ucieka</li>
      <li>Jak uzasadnić inwestycję w automatyzację lub dodatkowe capacity</li>
    </ul>
  </div>
  <div class="fb-sum-card fb-sum-no">
    <div class="fb-sum-title">✗ DDR nie mówi Ci</div>
    <ul class="fb-sum-list">
      <li>Czy klient odczuwa poprawę (bez kontekstu liczby releasów)</li>
      <li>Gdzie konkretnie w systemie uciekają bugi</li>
      <li>Czy kod trafiający do testów jest dobrej jakości (to mierzy Issues per Release)</li>
      <li>Jak szybki i sprawny jest Twój proces (to inna metryka)</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">Używaj DDR jako jednej z pięciu liter alfabetu. Razem tworzą słowo. Osobno - to tylko literki.</blockquote>

## W następnym artykule

Artykuł trzeci tej serii dotyczy **Escaped Bugs &amp; Problems** - i zaczyna się od pytania, które większość QA zadaje zbyt rzadko: czy naprawdę mierzymy *wszystko*, co ucieka na produkcję?

Spoiler: prawie nigdy. I to, co pomijamy, jest często ważniejsze niż to, co liczymy.

## Linki w serii

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Metryki QA, które biznes chce słyszeć - kompletny przewodnik</a></div>
        <div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title">Defect Detection Ratio - głęboki przewodnik <span class="fb-s-now">czytasz teraz</span></div>
        <div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki, gotowe zdania</div>
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
  --fb-red: #B03333;
  --fb-red-pale: #FEF2F2;
  --fb-green: #2A7A3E;
  --fb-green-pale: #F0FDF4;
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

/* DIALOGUE */
.fb-dialogue { background: var(--fb-navy); border-radius: 12px; padding: 28px 30px; margin: 28px 0; }
.fb-d-line { display: flex; gap: 12px; margin-bottom: 14px; align-items: flex-start; }
.fb-d-line:last-child { margin-bottom: 0; }
.fb-d-who { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; min-width: 34px; padding-top: 3px; flex-shrink: 0; }
.fb-d-em { color: var(--fb-gold); }
.fb-d-qa { color: rgba(255,255,255,0.4); }
.fb-d-text { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.82); font-style: italic; }

/* FORMULA */
.fb-formula-box { background: var(--fb-surface); border: 1.5px solid var(--fb-border); border-radius: 12px; padding: 24px 28px; margin: 22px 0; }
.fb-formula-box.fb-weighted { border-color: var(--fb-gold); background: var(--fb-gold-pale); }
.fb-f-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 12px; }
.fb-formula-box.fb-weighted .fb-f-label { color: var(--fb-gold); }
.fb-formula { font-family: 'Courier New', monospace; font-size: 15px; font-weight: 700; color: var(--fb-navy); line-height: 1.5; }
.fb-formula-example { background: #fff; border: 1px solid var(--fb-border); border-radius: 8px; padding: 14px 16px; margin-top: 14px; font-family: 'Courier New', monospace; font-size: 14px; color: var(--fb-navy); }
.fb-formula-note { font-size: 12px; color: var(--fb-muted); margin-top: 12px; line-height: 1.55; }

/* WEIGHTS TABLE */
.fb-table-wrap { margin: 24px 0; overflow-x: auto; }
.fb-w-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.fb-w-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: left; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-w-table td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); font-size: 13px; vertical-align: middle; }
.fb-w-table tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-pri { display: inline-flex; align-items: center; gap: 7px; font-weight: 600; }
.fb-pri-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.fb-w-result { background: var(--fb-navy); color: #fff; padding: 14px 18px; border-radius: 12px; font-family: 'Courier New', monospace; font-size: 14px; margin: 10px 0 18px; }
.fb-alert-box { background: var(--fb-red-pale); border: 1.5px solid #FECACA; border-radius: 12px; padding: 20px 22px; margin: 20px 0; color: #7F1D1D; font-size: 14px; line-height: 1.6; }
.fb-alert-box strong { color: #991B1B; }

/* GAUGE BAR */
.fb-gauge-wrap { margin: 24px 0 8px; }
.fb-gauge-track { position: relative; height: 14px; border-radius: 8px;
  background: linear-gradient(90deg, #DC2626 0%, #F59E0B 35%, #3B82F6 65%, #16A34A 100%); }
.fb-gauge-markers { display: flex; justify-content: space-between; margin-top: 8px; }
.fb-gauge-mark { display: flex; flex-direction: column; align-items: center; gap: 3px; }
.fb-gauge-pct { font-size: 11px; font-weight: 700; color: #111; }
.fb-gauge-label { font-size: 10px; color: var(--fb-faint); text-align: center; line-height: 1.3; max-width: 70px; }
:root[data-theme="dark"] .fb-article .fb-gauge-pct { color: #fff; }

/* CALCULATOR */
.fb-calc-wrap { background: var(--fb-navy); border-radius: 16px; padding: 28px; margin: 24px 0; }
.fb-calc-title { font-family: Georgia, serif; font-size: 20px; font-weight: 500; color: #fff; margin-bottom: 4px; }
.fb-calc-sub { font-size: 13px; color: rgba(255,255,255,0.45); margin-bottom: 22px; }
.fb-calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
@media (max-width: 480px) { .fb-calc-grid { grid-template-columns: 1fr; } }
.fb-calc-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); display: block; margin-bottom: 8px; }
.fb-calc-field input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 12px 14px; font-size: 18px; font-weight: 700; color: #fff; font-family: Georgia, serif; outline: none; }
.fb-calc-field input:focus { border-color: var(--fb-gold); background: rgba(255,255,255,0.12); }
.fb-calc-toggle-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
.fb-calc-toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; }
.fb-calc-toggle input { opacity: 0; width: 0; height: 0; }
.fb-calc-slider { position: absolute; inset: 0; border-radius: 24px; background: rgba(255,255,255,0.15); cursor: pointer; transition: background 0.2s; }
.fb-calc-slider::before { content: ''; position: absolute; left: 3px; top: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
.fb-calc-toggle input:checked + .fb-calc-slider { background: var(--fb-gold); }
.fb-calc-toggle input:checked + .fb-calc-slider::before { transform: translateX(18px); }
.fb-calc-toggle-label { font-size: 12px; color: rgba(255,255,255,0.6); }
.fb-calc-weights { display: none; background: rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; margin-bottom: 18px; }
.fb-calc-weights.fb-active { display: block; }
.fb-weights-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
@media (max-width: 520px) { .fb-weights-grid { grid-template-columns: 1fr 1fr; } }
.fb-wf-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: block; margin-bottom: 5px; }
.fb-wf-row { display: flex; align-items: center; gap: 6px; margin-top: 6px; }
.fb-wf-row input { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 7px 9px; font-size: 13px; font-weight: 700; color: #fff; text-align: center; outline: none; }
.fb-wf-mult { font-size: 11px; color: rgba(255,255,255,0.4); }
.fb-calc-result { background: rgba(255,255,255,0.06); border-radius: 12px; padding: 22px; display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.fb-cr-score { font-family: Georgia, serif; font-size: 3.2rem; font-weight: 500; line-height: 1; flex-shrink: 0; color: #6EE7B7; }
.fb-cr-info { flex: 1; min-width: 180px; }
.fb-cr-label { font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.45); margin-bottom: 5px; }
.fb-cr-verdict { font-size: 14px; font-weight: 600; color: #A7F3D0; line-height: 1.4; }
.fb-cr-formula { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 5px; font-family: 'Courier New', monospace; }
.fb-calc-result.fb-cr-danger .fb-cr-score { color: #F87171; }
.fb-calc-result.fb-cr-danger .fb-cr-verdict { color: #FCA5A5; }
.fb-calc-result.fb-cr-avg .fb-cr-score { color: #FCD34D; }
.fb-calc-result.fb-cr-avg .fb-cr-verdict { color: #FDE68A; }
.fb-calc-result.fb-cr-good .fb-cr-score { color: #6EE7B7; }
.fb-calc-result.fb-cr-good .fb-cr-verdict { color: #6EE7B7; }
.fb-calc-result.fb-cr-great .fb-cr-score { color: #86EFAC; }
.fb-calc-result.fb-cr-great .fb-cr-verdict { color: #A7F3D0; }

/* CHART CARD */
.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-chart-canvas { position: relative; width: 100%; }
:root[data-theme="dark"] .fb-article .fb-chart-card { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-chart-title { color: #fff; }

/* GAUGE ZONES */
.fb-gauge-zones { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-gz { border-radius: 10px; padding: 16px; font-size: 12px; }
.fb-gz-title { font-weight: 700; margin-bottom: 4px; font-size: 13px; }
.fb-gz-desc { color: var(--fb-muted); font-size: 12px; line-height: 1.5; }
.fb-gz-danger { background: var(--fb-red-pale); border: 1px solid #FECACA; }
.fb-gz-danger .fb-gz-title { color: #DC2626; }
.fb-gz-avg { background: #FFFBEB; border: 1px solid #FDE68A; }
.fb-gz-avg .fb-gz-title { color: #D97706; }
.fb-gz-good { background: var(--fb-teal-pale); border: 1px solid #99E6EA; }
.fb-gz-good .fb-gz-title { color: var(--fb-teal); }
.fb-gz-great { background: var(--fb-green-pale); border: 1px solid #BBF7D0; }
.fb-gz-great .fb-gz-title { color: var(--fb-green); }

/* SRC GRID */
.fb-src-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-src-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px 16px; }
.fb-src-name { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 4px; }
.fb-src-desc { font-size: 11px; color: var(--fb-muted); line-height: 1.5; }
.fb-src-tag { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; margin-top: 8px; }
.fb-src-primary { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-src-secondary { background: var(--fb-gold-pale); color: #7A4F0A; }

/* SEASONS */
.fb-season-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin: 22px 0; }
.fb-season-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 18px; }
.fb-season-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-season-desc { font-size: 12px; color: var(--fb-muted); line-height: 1.55; }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 16px; margin-bottom: 18px; }
.fb-step-num { width: 34px; height: 34px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; margin-bottom: 6px; }

/* TIMELINE */
.fb-timeline { margin: 24px 0; }
.fb-tl-item { display: flex; gap: 18px; position: relative; }
.fb-tl-item::before { content: ''; position: absolute; left: 19px; top: 44px; bottom: -1px; width: 2px; background: var(--fb-border); }
.fb-tl-item:last-child::before { display: none; }
.fb-tl-dot { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: Georgia, serif; font-size: 13px; font-weight: 500; color: #fff; z-index: 1; }
.fb-tl-body { padding-bottom: 24px; flex: 1; }
.fb-tl-q { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 5px; }
.fb-tl-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-tl-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; }
.fb-tl-badge { display: inline-block; font-family: Georgia, serif; font-size: 14px; font-weight: 500; padding: 3px 11px; border-radius: 6px; margin-left: 8px; vertical-align: middle; }

/* TRAPS */
.fb-trap-grid { display: grid; gap: 14px; margin: 22px 0; }
.fb-trap-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; position: relative; overflow: hidden; }
.fb-trap-card::before { content: attr(data-num); position: absolute; right: 16px; top: 10px; font-family: Georgia, serif; font-size: 3rem; font-weight: 300; color: var(--fb-border); line-height: 1; }
.fb-trap-title { font-size: 14px; font-weight: 700; color: var(--fb-red); margin-bottom: 8px; position: relative; z-index: 1; }
.fb-trap-text { font-size: 13px; color: var(--fb-muted); line-height: 1.6; position: relative; z-index: 1; }

/* DANGER TABLE */
.fb-danger-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; border-radius: 10px; overflow: hidden; }
.fb-danger-table th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-danger-table th:first-child { text-align: left; }
.fb-danger-table td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; color: var(--fb-muted); }
.fb-danger-table td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-danger-table tr:last-child td { border-bottom: none; }
.fb-escaped-bad { color: #DC2626; font-weight: 700; }
.fb-escaped-warn { color: #D97706; font-weight: 700; }
.fb-ddr-good { color: var(--fb-green); font-weight: 700; }
.fb-warning-pill { display: inline-flex; align-items: center; gap: 8px; background: #DC2626; color: #fff; padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 700; margin: 16px 0; }

/* BIZ QUOTES */
.fb-biz-quotes { display: grid; gap: 14px; margin: 22px 0; }
.fb-biz-q { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px 22px; display: flex; gap: 16px; flex-wrap: wrap; }
.fb-biz-context { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); min-width: 80px; flex-shrink: 0; padding-top: 2px; }
.fb-biz-text { font-family: Georgia, serif; font-size: 15px; font-style: italic; color: #111; line-height: 1.6; flex: 1; min-width: 200px; }

/* SUMMARY */
.fb-summary-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 22px 0; }
@media (max-width: 520px) { .fb-summary-two-col { grid-template-columns: 1fr; } }
.fb-sum-card { border-radius: 12px; padding: 22px; }
.fb-sum-yes { background: var(--fb-green-pale); border: 1px solid #BBF7D0; }
.fb-sum-no { background: var(--fb-red-pale); border: 1px solid #FECACA; }
.fb-sum-title { font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
.fb-sum-yes .fb-sum-title { color: var(--fb-green); }
.fb-sum-no .fb-sum-title { color: var(--fb-red); }
.fb-sum-list { list-style: none; padding: 0; margin: 0; }
.fb-sum-list li { font-size: 13px; color: var(--fb-muted); padding: 6px 0; border-bottom: 1px solid rgba(0,0,0,0.06); line-height: 1.5; }
.fb-sum-list li:last-child { border-bottom: none; }

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
.fb-s-title a { color: inherit; text-decoration: none; border-bottom: 1px dashed var(--fb-border); }
.fb-s-title a:hover { color: var(--fb-gold); }
.fb-s-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-s-now { display: inline-block; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; background: var(--fb-gold-pale); color: var(--fb-gold); padding: 2px 8px; border-radius: 10px; margin-left: 8px; vertical-align: middle; }

/* Dark mode */
:root[data-theme="dark"] .fb-article .fb-formula-box:not(.fb-weighted),
:root[data-theme="dark"] .fb-article .fb-src-card,
:root[data-theme="dark"] .fb-article .fb-season-card,
:root[data-theme="dark"] .fb-article .fb-trap-card,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-table-wrap { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-w-table th,
:root[data-theme="dark"] .fb-article .fb-w-table tr:last-child td,
:root[data-theme="dark"] .fb-article .fb-danger-table th { background: rgba(255,255,255,0.04); color: #ccc; }
:root[data-theme="dark"] .fb-article .fb-src-name,
:root[data-theme="dark"] .fb-article .fb-season-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-tl-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-formula-note,
:root[data-theme="dark"] .fb-article .fb-src-desc,
:root[data-theme="dark"] .fb-article .fb-season-desc,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-tl-text,
:root[data-theme="dark"] .fb-article .fb-tl-q,
:root[data-theme="dark"] .fb-article .fb-trap-text,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-s-sub,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-w-table td { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-formula-box:not(.fb-weighted) .fb-formula,
:root[data-theme="dark"] .fb-article .fb-s-num { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-danger-table td { color: #4a4a4a; }
:root[data-theme="dark"] .fb-article .fb-danger-table td:first-child { color: #111; }
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
  function getVerdict(pct) {
    if (pct >= 95) return { text: 'Doskonały wynik - sprawdź kompletność danych', cls: 'fb-cr-great' };
    if (pct >= 85) return { text: 'Solidny proces - co kryje się w tym co ucieka?', cls: 'fb-cr-good' };
    if (pct >= 70) return { text: 'Poziom przeciętny - jest z czego rosnąć', cls: 'fb-cr-avg' };
    return { text: 'Sygnał alarmowy - zbadaj przyczyny natychmiast', cls: 'fb-cr-danger' };
  }
  function initCalc() {
    var pre = document.getElementById('ddr-pre');
    var post = document.getElementById('ddr-post');
    var wMode = document.getElementById('ddr-weighted');
    var wPanel = document.getElementById('ddr-weights');
    var sc = document.getElementById('ddr-score');
    var ver = document.getElementById('ddr-verdict');
    var frm = document.getElementById('ddr-formula');
    var res = document.getElementById('ddr-result');
    if (!pre || !post || !sc) return;
    function val(id) { var e = document.getElementById(id); return e ? (parseFloat(e.value) || 0) : 0; }
    function calc() {
      var score, formula;
      if (wMode.checked) {
        var cp = val('ddr-wc-pre'), cq = val('ddr-wc-post');
        var hp = val('ddr-wh-pre'), hq = val('ddr-wh-post');
        var mp = val('ddr-wm-pre'), mq = val('ddr-wm-post');
        var lp = val('ddr-wl-pre'), lq = val('ddr-wl-post');
        var wp = cp*4 + hp*2 + mp*1 + lp*0.5;
        var wq = cq*4 + hq*2 + mq*1 + lq*0.5;
        score = (wp + wq === 0) ? 0 : (wp / (wp + wq)) * 100;
        formula = wp.toFixed(1) + ' ÷ (' + wp.toFixed(1) + ' + ' + wq.toFixed(1) + ') = ' + score.toFixed(1) + '% [ważony]';
      } else {
        var p = parseFloat(pre.value) || 0, q = parseFloat(post.value) || 0;
        score = (p + q === 0) ? 0 : (p / (p + q)) * 100;
        formula = p + ' ÷ (' + p + ' + ' + q + ') = ' + score.toFixed(1) + '%';
      }
      var v = getVerdict(score);
      sc.textContent = score.toFixed(1) + '%';
      ver.textContent = v.text;
      frm.textContent = formula;
      res.className = 'fb-calc-result ' + v.cls;
    }
    wMode.addEventListener('change', function () { wPanel.classList.toggle('fb-active', wMode.checked); calc(); });
    [pre, post].concat(Array.from(document.querySelectorAll('.fb-calc-weights input'))).forEach(function (el) { el.addEventListener('input', calc); });
    calc();
  }
  function initChart() {
    Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    mount(document.getElementById('ddr-c-case'), {
      type: 'line',
      data: {
        labels: ['Q1 - Start', 'Q2 - Testy kontraktowe', 'Q3 - Def. of Done', 'Q4 - Pełny monitoring'],
        datasets: [{
          data: [74, 84, 90, 94],
          borderColor: '#2A7A3E',
          backgroundColor: 'rgba(42,122,62,0.1)',
          borderWidth: 3,
          pointBackgroundColor: ['#64748B', '#2563EB', '#0A6B6F', '#2A7A3E'],
          pointRadius: 8, pointHoverRadius: 10,
          fill: true, tension: 0.35
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (c) { return '  DDR: ' + c.raw + '%'; },
              afterLabel: function (c) {
                var notes = ['Diagnoza historii 6 mies.', 'Testy kontraktowe + E2E', 'Nowa definicja done', 'Incydenty wliczone do mianownika'];
                return '  → ' + notes[c.dataIndex];
              }
            }
          }
        },
        scales: {
          y: { min: 60, max: 100, ticks: { callback: function (v) { return v + '%'; }, stepSize: 10 }, grid: { color: grid }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 10 } } }
        }
      }
    });
  }
  function boot() { initCalc(); ensureChart(initChart); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
