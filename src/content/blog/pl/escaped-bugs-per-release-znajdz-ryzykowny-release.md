---
title: "Escaped Bugs per Release - znajdź ryzykowny release"
description: "Jak wykryć skok escaped bugów w pojedynczym releasie, przeprowadzić śledztwo w 5 pytaniach i wdrożyć działania prewencyjne. Escaped per Release vs ogólny Escaped Rate. Artykuł 5 z 9."
date: 2026-06-16
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 5 z 9</p>

<p class="fb-lead">Przegląd kwartalny. Na slajdzie - piękne liczby. Escaped Rate: 1,8%. Trend malejący przez trzy kwartały. Wszyscy zadowoleni. Aż ktoś zapytał: „A który konkretnie release był problemem w Q3?"</p>

<div class="fb-review">
  <div class="fb-rv-header">
    <span class="fb-rv-title">Przegląd kwartalny · Q3</span>
    <span class="fb-rv-badge">Escaped Rate: 1.8% ↓</span>
  </div>
  <div class="fb-rv-metrics">
    <div class="fb-rv-metric"><div class="fb-rv-val good">1.8%</div><div class="fb-rv-label">Escaped Rate Q3</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val">8</div><div class="fb-rv-label">Releasów w Q3</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val">11</div><div class="fb-rv-label">Łączne escaped</div></div>
    <div class="fb-rv-metric"><div class="fb-rv-val good">~1.4</div><div class="fb-rv-label">Średnio per release</div></div>
  </div>
  <div class="fb-su-line"><span class="fb-su-who em">PM</span><span class="fb-su-msg">„Dobry wynik. Ale pamiętam, że w sierpniu był ten incydent z modułem płatności - to był nasz release?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg"><em>otwiera tabelę per release...</em></span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg alert">„v3.4 - 7 escaped bugów. Pozostałe 7 releasów łącznie: 4."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">PM</span><span class="fb-su-msg">„Czyli jeden release odpowiadał za 64% wszystkich problemów kwartału. I w raporcie nie było o tym ani słowa."</span></div>
</div>

Ogólny Escaped Rate nie kłamie. Po prostu ukrywa. **Jeden katastrofalny release rozmywa się w średniej z pozostałych siedmiu.** I właśnie dlatego potrzebujesz Escaped Bugs per Release - metryki, która patrzy na każdy release osobno.

## Escaped Rate vs Escaped per Release - co każdy z nich widzi

To nie są dwie wersje tej samej metryki. To dwa zupełnie różne poziomy widzenia. I potrzebujesz obu - ale z pełną świadomością, co każdy z nich mówi, a czego nie.

<div class="fb-cc-grid">
  <div class="fb-cc-panel cc-rate">
    <span class="fb-cc-tag">Ogólny Escaped Rate</span>
    <div class="fb-cc-formula">Rate = Escaped łącznie ÷ (Escaped + Pre-release) × 100%</div>
    <div class="fb-cc-title">Mówi: jak skuteczni jesteśmy ogółem</div>
    <div class="fb-cc-desc">Trend kwartalny, punkt odniesienia branżowy, argument dla zarządu. Dobry do raportowania na wysokim poziomie i porównywania kwartałów.</div>
    <div class="fb-cc-verdict">⚠️ Nie pokazuje, które releasey były ryzykowne. Jeden skok gubi się w średniej.</div>
  </div>
  <div class="fb-cc-panel cc-per">
    <span class="fb-cc-tag">Escaped per Release</span>
    <div class="fb-cc-formula">EpR = Escaped bugs przypisane do konkretnego release'u</div>
    <div class="fb-cc-title">Mówi: który release był ryzykowny</div>
    <div class="fb-cc-desc">Diagnoza incydentów, szukanie wzorców, rozmowa z EM o przyczynach. Dobry do identyfikacji problemów i działań prewencyjnych.</div>
    <div class="fb-cc-verdict ok">✓ Każdy release dostaje własną ocenę. Skok jest widoczny natychmiast.</div>
  </div>
</div>

### Ten sam kwartał - dwie zupełnie różne diagnozy

Poniższa tabela pokazuje, jak agregacja ukrywa realny obraz. Ogólny Escaped Rate: 1,8% - wygląda dobrze. Ale po rozbiciu na releasey pojawia się zupełnie inna historia.

<table class="fb-ht">
  <thead>
    <tr><th>Release</th><th>Escaped bugs</th><th>EpR</th><th>Ocena</th></tr>
  </thead>
  <tbody>
    <tr><td>v3.1</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elitarny</td></tr>
    <tr><td>v3.2</td><td class="val-good">1</td><td class="val-good">0.2</td><td class="val-good">Elitarny</td></tr>
    <tr><td>v3.3</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elitarny</td></tr>
    <tr class="fb-spike-row"><td>v3.4 <span class="fb-spike-badge">SKOK</span></td><td class="val-bad">7</td><td class="val-bad">2.8</td><td class="val-bad">Alarm</td></tr>
    <tr><td>v3.5</td><td class="val-good">1</td><td class="val-good">0.3</td><td class="val-good">Dobry</td></tr>
    <tr><td>v3.6</td><td class="val-good">0</td><td class="val-good">0.0</td><td class="val-good">Elitarny</td></tr>
    <tr><td>v3.7</td><td class="val-good">1</td><td class="val-good">0.2</td><td class="val-good">Elitarny</td></tr>
    <tr><td>v3.8</td><td class="val-good">1</td><td class="val-good">0.3</td><td class="val-good">Dobry</td></tr>
    <tr><td><strong>Q3 łącznie</strong></td><td><strong>11</strong></td><td><strong>1.4 śr.</strong></td><td class="val-warn">Ukryta katastrofa</td></tr>
  </tbody>
</table>

Ogólny Rate dla całego kwartału: **1,8% - „wygląda dobrze"**. A jeden release odpowiadał za 64% problemów.

## Ile to jest za dużo - progi

EpR to bliski kuzyn najbardziej rozpoznawalnej metryki stabilności w branży - **Change Failure Rate** z badań DORA. CFR pyta: jaki procent wdrożeń powoduje problemy na produkcji? EpR pyta: ile konkretnie problemów przyniosło każde wdrożenie? Release z co najmniej jednym escaped bugiem to w nomenklaturze DORA „failed change".

Warto znać aktualny kontekst: raport DORA 2025 odszedł od klasycznych poziomów Elite/High/Medium/Low na rzecz siedmiu archetypów zespołów, a poprzeczka dla najwyższej wydajności została zaostrzona - najlepsze zespoły utrzymują CFR w przedziale 0-2%, co osiąga tylko ok. 17% organizacji. Określenie „elite" wciąż funkcjonuje w branży jako skrót myślowy - i tak go używam poniżej - ale miej świadomość, że formalnie DORA mówi dziś innym językiem.

Progi dla Escaped Bugs per Release, skalibrowane do tych standardów:

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-range">&lt;0.5</div>
    <div class="fb-tc-label">Elitarny</div>
    <div class="fb-tc-desc">Najwyższa wydajność. Zdecydowana większość releasów bez escaped bugs. Sporadyczne pojedyncze incydenty.</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-range">0.5-1.5</div>
    <div class="fb-tc-label">Dobry</div>
    <div class="fb-tc-desc">Dojrzały proces. Pojedynczy escaped bug od czasu do czasu, szybko wykryty i naprawiony. Brak wzorca powtarzalności.</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-range">1.5-3.0</div>
    <div class="fb-tc-label">Wymaga uwagi</div>
    <div class="fb-tc-desc">Widoczne problemy procesowe. Klient regularnie odczuwa skutki. Potrzebna analiza przyczyn.</div>
  </div>
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-range">&gt;3.0</div>
    <div class="fb-tc-label">Sygnał alarmowy</div>
    <div class="fb-tc-desc">Każdy taki release to incydent wymagający post-mortem. Natychmiastowa interwencja procesowa.</div>
  </div>
</div>

<blockquote class="fb-quote">Dla zespołów w środowisku korporacyjnym z regularnymi releasami co 1-2 tygodnie - cel to poniżej 0.5 escaped buga per release. Powyżej 1.5 to sygnał, że coś systemowo nie działa.</blockquote>

## Skok, który widać od razu

Wykres Escaped per Release natychmiast ujawnia to, co ogólna statystyka ukrywa. Jeden rzut oka - i wiesz, który release wymaga śledztwa.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped Bugs per Release - widok per release</div>
      <div class="fb-chart-sub">v3.4 widoczny natychmiast. Ogólna średnia: 1.4 - wyglądałaby niewinnie.</div>
    </div>
    <span class="fb-chart-badge red">Skok: v3.4 = 2.8</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>Escaped per Release</span>
    <span class="fb-lg"><span class="fb-ld" style="background:rgba(200,148,58,.4);border:1px dashed #C8943A"></span>Próg elitarny (&lt;0.5)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:rgba(176,51,51,.2);border:1px dashed #B03333"></span>Próg alarmu (3.0)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-epr" role="img" aria-label="Wykres słupkowy: Escaped per Release dla 8 releasów. Wszystkie poniżej 0.3 poza v3.4, który skacze do 2.8 i jest oznaczony na czerwono."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped per Release vs ogólny Escaped Rate - ta sama historia</div>
      <div class="fb-chart-sub">Rate agreguje i wygładza. EpR ujawnia anomalie. Potrzebujesz obu perspektyw.</div>
    </div>
    <span class="fb-chart-badge">dwie perspektywy</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Escaped per Release (szt.)</span>
    <span class="fb-lg"><span style="width:16px;height:0;border-top:2.5px dashed #0A6B6F;display:inline-block;"></span>Ogólny Escaped Rate (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-compare" role="img" aria-label="Wykres łączony: słupki EpR per release oraz linia narastającego ogólnego Escaped Rate. Linia Rate wygładza skok v3.4, słupek EpR pokazuje go wyraźnie."></canvas>
  </div>
</div>

<div class="fb-dark-box">
  <span class="fb-db-eyebrow">Framework śledztwa</span>
  <h2 class="fb-db-h">5 pytań, które zadajesz po każdym skoku</h2>
  <p class="fb-db-intro">Skok sam w sobie nie jest problemem - jest sygnałem. Prawdziwy problem zaczyna się wtedy, gdy skok zostaje odnotowany jako „anomalia" i nikt nie szuka przyczyny. Oto pięć pytań, które zawsze prowadzą do odpowiedzi.</p>
  <p class="fb-db-intro"><strong>Trzy zasady zanim zaczniesz, zaczerpnięte wprost z kultury SRE.</strong> Po pierwsze - śledztwo prowadzimy <strong>bez szukania winnych (blameless)</strong>. Pytamy „jak system pozwolił na ten błąd?", nigdy „kto zawinił?". Zespół, który boi się obwinienia, przestaje mówić prawdę - a bez prawdy nie ma diagnozy. Po drugie - szukamy <strong>czynników współtworzących, nie pojedynczej przyczyny źródłowej</strong>. Złożone systemy zawodzą przez kilka współdziałających warunków naraz; „jedna przyczyna" to prawie zawsze uproszczenie, które gubi resztę obrazu. Po trzecie - śledztwo przeprowadzamy <strong>w ciągu 48 godzin</strong> od wykrycia skoku, póki kontekst jest świeży w głowach zespołu.</p>
  <div class="fb-q-grid">
    <div class="fb-q-card">
      <div class="fb-q-num">1</div>
      <div>
        <div class="fb-q-question">Co było inne w tym releasie względem poprzednich?</div>
        <div class="fb-q-why">Skok rzadko jest przypadkowy. Coś się zmieniło - w kodzie, w procesie, w zespole lub w środowisku. Pierwsze pytanie to zawsze: co było inne?</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Nowy moduł lub technologia</span><span class="fb-q-signal">Zmiana składu zespołu</span><span class="fb-q-signal">Zmiana harmonogramu</span><span class="fb-q-signal">Zewnętrzna integracja</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">2</div>
      <div>
        <div class="fb-q-question">Jaki typ bugów dominował - funkcjonalne, konfiguracyjne, integracyjne?</div>
        <div class="fb-q-why">Rozkład typów (z artykułu 3) wskazuje, gdzie szukać przyczyny. Dominacja bugów konfiguracyjnych sugeruje problem środowiskowy, nie jakość kodu.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Kod → proces wytwórczy</span><span class="fb-q-signal">Konfiguracja → DevOps</span><span class="fb-q-signal">Integracja → architektura</span><span class="fb-q-signal">Regresja → testy</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">3</div>
      <div>
        <div class="fb-q-question">Czy QA miało wystarczający czas i dostęp do środowiska?</div>
        <div class="fb-q-why">Skok pod presją terminu to nie jest przypadek. Jeśli okno testowe skróciło się o 40% - i 40% więcej bugów wyszło na produkcję - to jest prosta korelacja, którą warto pokazać PM.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Czas testowania vs poprzedni release</span><span class="fb-q-signal">Stabilność środowiska testowego</span><span class="fb-q-signal">Dostępność środowiska staging</span><span class="fb-q-signal">Opóźnienia w dostarczeniu kodu</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">4</div>
      <div>
        <div class="fb-q-question">Czy bugi były w obszarach pokrytych testami automatycznymi?</div>
        <div class="fb-q-why">Jeśli escaped bugi były w modułach z 90% pokryciem automatycznym - problem leży w jakości testów, nie ich liczbie. Jeśli w obszarach bez pokrycia - to jest sygnał do uzupełnienia.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Mapa pokrycia vs lokalizacja bugów</span><span class="fb-q-signal">Ostatnia aktualizacja testów dla tego modułu</span><span class="fb-q-signal">Niestabilne testy w tym obszarze</span></div>
      </div>
    </div>
    <div class="fb-q-card">
      <div class="fb-q-num">5</div>
      <div>
        <div class="fb-q-question">Czy widziałeś już podobny skok - i co wtedy pomogło?</div>
        <div class="fb-q-why">Historia EpR to Twój największy zasób. Jeśli skok w v2.8 miał ten sam profil co skok w v3.4 - i wtedy rozwiązał go punkt kontrolny code review - to masz gotowe działanie naprawcze.</div>
        <div class="fb-q-signals"><span class="fb-q-signal">Poprzednie skoki w historii EpR</span><span class="fb-q-signal">Co zrobiono po poprzednim skoku</span><span class="fb-q-signal">Czy działanie naprawcze zostało utrzymane</span></div>
      </div>
    </div>
  </div>
</div>

## Interaktywny detektor skoków

Wpisz wartości Escaped per Release ze swoich ostatnich 6 releasów. Detektor automatycznie oznaczy skoki i podpowie, który release wymaga śledztwa.

<div class="fb-det-wrap">
  <div class="fb-det-title">Detektor skoków EpR</div>
  <div class="fb-det-sub">Wpisz liczbę escaped bugów per release - próg skoku wyznaczany metodą IQR (Tukey): Q3 + 1,5 × IQR</div>
  <div class="fb-det-inputs" id="fb-det-inputs">
    <div class="fb-det-field"><label for="fb-det-v1">v1</label><input id="fb-det-v1" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v2">v2</label><input id="fb-det-v2" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v3">v3</label><input id="fb-det-v3" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v4">v4</label><input id="fb-det-v4" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v5">v5</label><input id="fb-det-v5" type="number" min="0" step="0.1" placeholder="0.0"></div>
    <div class="fb-det-field"><label for="fb-det-v6">v6</label><input id="fb-det-v6" type="number" min="0" step="0.1" placeholder="0.0"></div>
  </div>
  <div class="fb-det-result">
    <div class="fb-det-item"><div class="fb-det-label">Mediana EpR</div><div class="fb-det-val" id="fb-det-median">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">Średnia EpR</div><div class="fb-det-val" id="fb-det-avg">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">Próg skoku</div><div class="fb-det-val" id="fb-det-thresh">-</div></div>
    <div class="fb-det-item"><div class="fb-det-label">Skoki</div><div class="fb-det-val" id="fb-det-spikes">-</div></div>
    <div class="fb-det-status" id="fb-det-status">Wpisz dane</div>
  </div>
</div>

## Od diagnozy do zapobiegania - jak używać skoków

Skok zidentyfikowany i zbadany to połowa sukcesu. Druga połowa to zamiana wniosków w działania, które sprawią, że historia się nie powtórzy.

### Jak wdrożyć od zera

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Zbierz historyczne EpR - minimum 6 ostatnich releasów</div>
      <div class="fb-step-text">Przypisz każdy escaped bug (z Jiry, monitoringu, wsparcia) do konkretnego release'u, który go wprowadził - nie do daty wykrycia. To kluczowa różnica. Bug wykryty w tygodniu 3 po releasie wciąż należy do tego release'u.</div>
      <div class="fb-step-text">Nawet przybliżone dane za 2-3 miesiące wstecz dają Ci pierwszy trend i identyfikują historyczne skoki.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Wyznacz próg skoku metodą IQR - standardem statystycznym</div>
      <div class="fb-step-text">Branżowy standard wykrywania wartości odstających to metoda Tukeya oparta na rozstępie międzykwartylowym: <strong>próg = Q3 + 1,5 × IQR</strong>, gdzie Q3 to 75. percentyl, a IQR to różnica między 75. a 25. percentylem Twoich danych EpR. Metoda jest odporna na wpływ samych skoków - w przeciwieństwie do progów opartych na średniej, którą pojedynczy skok potrafi mocno zawyżyć.</div>
      <div class="fb-step-text">Przy małej liczbie releasów (mniej niż 8-10 punktów danych) wynik traktuj orientacyjnie - i aktualizuj próg co kwartał, bo gdy zespół dojrzewa, rozkład się zacieśnia i próg staje się bardziej wymagający.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Wprowadź post-mortem bez szukania winnych dla każdego skoku - 30 minut, w ciągu 48h</div>
      <div class="fb-step-text">Nie musi być wielogodzinnym spotkaniem. 30-minutowa retrospektywa z 5 pytaniami z frameworku powyżej - przeprowadzona w ciągu 48 godzin od wykrycia, póki kontekst jest świeży. Zasada nadrzędna: <strong>blameless</strong> - analizujemy system i proces, nie ludzi. Jeśli potrzebujesz głębszej techniki dochodzenia do przyczyn, klasyczne Five Whys (pytaj „dlaczego", aż dojdziesz do przyczyny systemowej) działa świetnie w tym formacie.</div>
      <div class="fb-step-text">Wynik post-mortem to lista czynników współtworzących plus działania - każde z właścicielem i terminem. Dokument trafia do archiwum zespołu: gdy pojawi się następny skok, zaczynasz od sprawdzenia, czy profil przyczyn jest znany.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Oznaczaj releasey „wysokiego ryzyka" z wyprzedzeniem</div>
      <div class="fb-step-text">Po kilku miesiącach danych zaczniesz widzieć wzorce: nowe technologie → ryzyko wyższe. Wdrażanie nowego programisty → ryzyko wyższe. Presja terminu → ryzyko wyższe. Użyj tych wzorców do pre-mortem przed releasem - nie czekaj na skok, żeby zareagować.</div>
    </div>
  </div>
</div>

### Cztery działania prewencyjne - kiedy je stosować

<div class="fb-prev-grid">
  <div class="fb-prev-card">
    <div class="fb-prev-icon">🔍</div>
    <div class="fb-prev-title">Pre-mortem przed ryzykownym releasem</div>
    <div class="fb-prev-desc">Zadaj pytanie: „Co może pójść źle?" przed wdrożeniem, nie po. Szczególnie dla releasów z nowymi integracjami lub zmianami architektury.</div>
    <div class="fb-prev-when">Kiedy: przed każdym „dużym" releasem</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">📋</div>
    <div class="fb-prev-title">Lista kontrolna ryzyka release'u</div>
    <div class="fb-prev-desc">Prosta lista pytań do wypełnienia przed każdym releasem: nowy programista? nowa integracja? skrócone okno testowe? Każde „tak" podnosi kategorię ryzyka.</div>
    <div class="fb-prev-when">Kiedy: przy każdym releasie, 5 minut</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">🐤</div>
    <div class="fb-prev-title">Wdrożenie kanarkowe dla wysokiego ryzyka</div>
    <div class="fb-prev-desc">Releasuj na 5-10% ruchu przed pełnym wdrożeniem. EpR dla tego okna to wczesny sygnał - możesz wycofać, zanim problem dotknie wszystkich klientów.</div>
    <div class="fb-prev-when">Kiedy: EpR historycznie &gt; 1.5 dla podobnych releasów</div>
  </div>
  <div class="fb-prev-card">
    <div class="fb-prev-icon">⏱️</div>
    <div class="fb-prev-title">Okno monitoringu po wdrożeniu</div>
    <div class="fb-prev-desc">Pierwsze 2 godziny po wdrożeniu - aktywny monitoring z niższymi progami alertów. Duża część skoków EpR jest wykrywana właśnie w tym oknie.</div>
    <div class="fb-prev-when">Kiedy: zawsze, automatycznie</div>
  </div>
</div>

## EpR w rozmowie z biznesem

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„Ten release zakończył się 0 escaped bugów - EpR na poziomie elitarnym. Poprzedni v3.4 był skokiem z EpR 2.8. Przeprowadziliśmy post-mortem i wdrożyliśmy punkt kontrolny code review. Wynik widoczny już w tym releasie."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 z EM</span>
    <span class="fb-biz-text">„Ogólny Escaped Rate wygląda dobrze - 1.8%. Ale per release widać, że jeden release odpowiadał za 64% problemów kwartału. Mam hipotezę na temat przyczyny i propozycję działania naprawczego."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„Wprowadziliśmy monitoring EpR per release. W Q4 zidentyfikowaliśmy dwa skoki, przeprowadziliśmy post-mortem dla obu i wdrożyliśmy działania naprawcze. Średnia EpR spadła z 1.4 do 0.4 - poziom elitarny. Wszystkie releasey Q4 poniżej progu 0.5."</span>
  </div>
</div>

## Co daje EpR, czego nie ma w ogólnym Rate

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">✓ EpR daje Ci</div>
    <ul class="fb-sum-list">
      <li>Identyfikację konkretnego ryzykownego release'u - nie uśrednioną statystykę</li>
      <li>Punkt wyjścia do śledztwa przyczynowego (5 pytań)</li>
      <li>Wzorce historyczne do przewidywania ryzykownych releasów</li>
      <li>Mierzalny efekt działań naprawczych per release</li>
      <li>Argument w rozmowie z PM o czasie i warunkach testowania</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">✗ EpR nie zastępuje</div>
    <ul class="fb-sum-list">
      <li>Ogólnego Escaped Rate - do trendu kwartalnego i porównań branżowych</li>
      <li>DDR - do oceny skuteczności procesu testowania</li>
      <li>Issues per Release - do oceny dojrzałości kodu wchodzącego do testów</li>
      <li>Number of Releases - bez kontekstu liczby releasów EpR traci skalę</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">Skok to nie jest problem - to jest sygnał. Problem zaczyna się wtedy, gdy skok zostaje odnotowany jako „anomalia" i nikt nie szuka przyczyny. EpR daje Ci narzędzie, żeby to zmienić.</blockquote>

## W następnym artykule

Artykuł szósty dotyczy **Number of Releases** - metryki, którą większość zespołów całkowicie ignoruje. A bez niej wszystkie pozostałe metryki tej serii tracą skalę i porównywalność.

Dowiesz się, dlaczego 3 escaped bugi przy 2 releasach to kryzys, a 3 escaped bugi przy 15 releasach to sukces - i jak używać tej metryki jako wspólnego mianownika dla całej serii.

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Kompletny przewodnik</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/pl/blog/defect-detection-ratio-jak-mierzyc-skutecznosc/">Defect Detection Ratio</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-problems-pelne-spektrum/">Escaped Bugs i Problems</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/pl/blog/issues-per-release-miernik-dojrzalosci-kodu/">Issues per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wdrożenie od zera, związek z procesem wytwórczym, rozmowa z EM</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">05</span><div><div class="fb-s-title">Escaped Bugs per Release <span class="fb-s-now">czytasz teraz</span></div><div class="fb-s-sub">Wykrywanie skoków, framework śledztwa, działania prewencyjne</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">06</span><div><div class="fb-s-title">Number of Releases - metryka kontekstowa</div><div class="fb-s-sub">Dlaczego 3 bugi przy 2 releasach to dramat, a przy 15 to sukces</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">07</span><div><div class="fb-s-title">Release Confidence Score krok po kroku</div><div class="fb-s-sub">Trzy modele obliczania, wdrożenie, przykłady z praktyki</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">08</span><div><div class="fb-s-title">Storytelling z metrykami - jak budować narrację</div><div class="fb-s-sub">Jak zamienić tabelę liczb w argument biznesowy</div></div></li>
    <li class="fb-s-item"><span class="fb-s-num">09</span><div><div class="fb-s-title">3 antywzorce, które niszczą wiarygodność QA</div><div class="fb-s-sub">Za dużo metryk, brak kontekstu, żargon - i jak unikać</div></div></li>
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

/* REVIEW SCENE */
.fb-review { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 26px 28px; margin: 28px 0; }
.fb-rv-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; flex-wrap: wrap; gap: 10px; }
.fb-rv-title { font-size: 10px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--fb-gold); }
.fb-rv-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; background: #F0FDF4; color: var(--fb-green); }
.fb-rv-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; margin-bottom: 20px; }
.fb-rv-metric { background: #fff; border: 1px solid var(--fb-border); border-radius: 8px; padding: 12px 14px; text-align: center; }
.fb-rv-val { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: var(--fb-navy); line-height: 1; }
.fb-rv-val.good { color: var(--fb-green); }
.fb-rv-label { font-size: 10px; color: var(--fb-faint); margin-top: 3px; }
.fb-su-line { display: flex; gap: 14px; margin-bottom: 12px; align-items: flex-start; }
.fb-su-line:last-child { margin-bottom: 0; }
.fb-su-who { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; min-width: 48px; padding-top: 3px; flex-shrink: 0; color: var(--fb-faint); }
.fb-su-who.em { color: var(--fb-navy); }
.fb-su-who.qa { color: var(--fb-teal); }
.fb-su-msg { font-size: 14px; line-height: 1.6; color: #111; }
.fb-su-msg em { font-style: italic; color: var(--fb-muted); }
.fb-su-msg.alert { color: var(--fb-red); font-weight: 600; }

/* COMPARE */
.fb-cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
@media (max-width: 560px) { .fb-cc-grid { grid-template-columns: 1fr; } }
.fb-cc-panel { border-radius: 12px; padding: 22px; border: 2px solid; }
.fb-cc-panel.cc-rate { border-color: var(--fb-border); background: var(--fb-surface); }
.fb-cc-panel.cc-per { border-color: var(--fb-navy); background: #EFF6FF; }
.fb-cc-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 14px; }
.cc-rate .fb-cc-tag { background: #E5E1D8; color: #4a4a4a; }
.cc-per .fb-cc-tag { background: var(--fb-navy); color: #fff; }
.fb-cc-formula { font-family: 'Courier New', monospace; font-size: 12px; color: var(--fb-navy); background: #fff; border: 1px solid var(--fb-border); border-radius: 6px; padding: 10px 12px; margin-bottom: 12px; line-height: 1.6; }
.cc-per .fb-cc-formula { background: var(--fb-navy); color: #93C5FD; border-color: var(--fb-navy); }
.fb-cc-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-cc-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-cc-verdict { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; background: #E5E1D8; color: #4a4a4a; }
.fb-cc-verdict.ok { background: rgba(14,31,61,0.08); color: var(--fb-navy); font-weight: 500; }

/* HIDDEN SPIKE TABLE */
.fb-ht { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
.fb-ht th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-ht th:first-child { text-align: left; }
.fb-ht td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; }
.fb-ht td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-ht tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-ht .val-good { color: var(--fb-green); font-weight: 700; }
.fb-ht .val-warn { color: var(--fb-amber); font-weight: 700; }
.fb-ht .val-bad { color: var(--fb-red); font-weight: 700; }
.fb-spike-row td { background: #FEF2F2 !important; }
.fb-spike-badge { display: inline-block; background: var(--fb-red); color: #fff; font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; margin-left: 6px; vertical-align: middle; }

/* THRESHOLDS */
.fb-thresh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-thresh-card { border-radius: 12px; padding: 16px; text-align: center; border: 1.5px solid; }
.fb-thresh-card.tc-danger { background: #FEF2F2; border-color: #FECACA; }
.fb-thresh-card.tc-warn { background: #FFFBEB; border-color: #FDE68A; }
.fb-thresh-card.tc-good { background: var(--fb-teal-pale); border-color: #99E6EA; }
.fb-thresh-card.tc-great { background: #F0FDF4; border-color: #BBF7D0; }
.fb-tc-range { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; line-height: 1; margin-bottom: 6px; }
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

/* CHARTS */
.fb-chart-card { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 22px; margin: 28px 0; }
.fb-chart-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
.fb-chart-title { font-size: 13px; font-weight: 700; color: #111; }
.fb-chart-sub { font-size: 12px; color: var(--fb-faint); margin-top: 3px; }
.fb-chart-badge { font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; white-space: nowrap; background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-chart-badge.red { background: #FEF2F2; color: var(--fb-red); }
.fb-chart-legend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; font-size: 11px; color: var(--fb-muted); }
.fb-lg { display: inline-flex; align-items: center; gap: 6px; }
.fb-ld { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
.fb-chart-canvas { position: relative; width: 100%; }

/* DARK BOX (INVESTIGATION) */
.fb-dark-box { background: var(--fb-navy); border-radius: 16px; padding: 36px 34px; margin: 36px 0; }
.fb-db-eyebrow { display: block; font-size: 9px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 10px; }
.fb-db-h { font-family: Georgia, serif; color: #fff !important; margin: 0 0 10px; font-size: 1.5rem; font-weight: 500; line-height: 1.2; }
.fb-db-intro { color: rgba(255,255,255,0.78) !important; font-size: 15px; margin-bottom: 20px; }
.fb-db-intro strong { color: #E6F1FB; }
.fb-q-grid { display: grid; gap: 12px; }
.fb-q-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; gap: 16px; align-items: flex-start; }
.fb-q-num { font-family: Georgia, serif; font-size: 1.6rem; font-weight: 500; color: var(--fb-gold); line-height: 1; flex-shrink: 0; min-width: 28px; }
.fb-q-question { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 6px; }
.fb-q-why { font-size: 12px; color: rgba(255,255,255,0.65); line-height: 1.55; margin-bottom: 8px; }
.fb-q-signals { display: flex; flex-wrap: wrap; gap: 6px; }
.fb-q-signal { font-size: 11px; background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); padding: 3px 9px; border-radius: 6px; }

/* DETECTOR */
.fb-det-wrap { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 28px 0; }
.fb-det-title { font-family: Georgia, serif; font-size: 18px; font-weight: 500; margin-bottom: 6px; color: #111; }
.fb-det-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 22px; }
.fb-det-inputs { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; }
@media (max-width: 500px) { .fb-det-inputs { grid-template-columns: repeat(3, 1fr); } }
.fb-det-field label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); display: block; margin-bottom: 5px; text-align: center; }
.fb-det-field input { width: 100%; border: 1px solid var(--fb-border); border-radius: 8px; padding: 9px 6px; font-size: 14px; font-weight: 700; font-family: Georgia, serif; color: #111; background: #fff; outline: none; text-align: center; transition: border-color 0.2s; }
.fb-det-field input:focus { border-color: var(--fb-gold); }
.fb-det-field input.spike { border-color: var(--fb-red); background: #FEF2F2; }
.fb-det-result { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 18px 20px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: space-between; }
.fb-det-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 3px; }
.fb-det-val { font-family: Georgia, serif; font-size: 1.3rem; font-weight: 500; color: var(--fb-navy); }
.fb-det-status { font-size: 13px; font-weight: 700; padding: 8px 16px; border-radius: 8px; background: var(--fb-surface); color: var(--fb-muted); }
.fb-det-status.clean { background: #F0FDF4; color: var(--fb-green); }
.fb-det-status.warn { background: #FFFBEB; color: var(--fb-amber); }
.fb-det-status.spike { background: #FEF2F2; color: var(--fb-red); }

/* STEPS */
.fb-steps { margin: 22px 0; }
.fb-step { display: flex; gap: 18px; margin-bottom: 20px; }
.fb-step:last-child { margin-bottom: 0; }
.fb-step-num { width: 36px; height: 36px; border-radius: 50%; background: var(--fb-navy); color: #fff; font-family: Georgia, serif; font-size: 15px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.fb-step-body { flex: 1; }
.fb-step-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-step-text { font-size: 14px; color: var(--fb-muted); line-height: 1.6; }
.fb-step-text + .fb-step-text { margin-top: 8px; }

/* PREVENTION */
.fb-prev-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px; margin: 22px 0; }
.fb-prev-card { border: 1px solid var(--fb-border); border-radius: 12px; padding: 20px; }
.fb-prev-icon { font-size: 22px; margin-bottom: 10px; }
.fb-prev-title { font-size: 14px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-prev-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-prev-when { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #7a4f0a; margin-top: 10px; }

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
:root[data-theme="dark"] .fb-article .fb-review,
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-det-wrap,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-quote { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-su-msg,
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-det-title,
:root[data-theme="dark"] .fb-article .fb-cc-title,
:root[data-theme="dark"] .fb-article .fb-prev-title,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-su-msg em,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-det-sub,
:root[data-theme="dark"] .fb-article .fb-det-label,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-cc-desc,
:root[data-theme="dark"] .fb-article .fb-prev-desc,
:root[data-theme="dark"] .fb-article .fb-rv-label,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-su-msg.alert { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-su-who { color: #b5b5b5; }
:root[data-theme="dark"] .fb-article .fb-su-who.em { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-su-who.qa { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-rv-metric { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-rv-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-rv-val.good { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-rv-badge { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-rate { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-per { background: rgba(147,197,253,0.08); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .cc-rate .fb-cc-tag { background: rgba(255,255,255,0.12); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-formula { background: rgba(255,255,255,0.06); color: #93C5FD; border-color: rgba(255,255,255,0.12); }
:root[data-theme="dark"] .fb-article .fb-cc-verdict { background: rgba(255,255,255,0.08); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict.ok { background: rgba(147,197,253,0.12); color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-ht th { background: rgba(255,255,255,0.06); color: #c9c9c9; border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-ht td { border-color: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-ht td:first-child { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-ht tr:last-child td { background: rgba(255,255,255,0.06); }
:root[data-theme="dark"] .fb-article .fb-spike-row td { background: rgba(176,51,51,0.18) !important; }
:root[data-theme="dark"] .fb-article .fb-ht .val-good { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-ht .val-warn { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-ht .val-bad { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn { background: rgba(180,83,9,0.15); border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good { background: rgba(10,107,111,0.2); border-color: rgba(95,200,204,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-label { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-label { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-label { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-label { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-tc-desc { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-chart-badge.red { background: rgba(176,51,51,0.25); color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-det-field input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-det-field input.spike { background: rgba(176,51,51,0.25); border-color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-det-result { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-det-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-det-status { background: rgba(255,255,255,0.08); color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-det-status.clean { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-det-status.warn { background: rgba(180,83,9,0.25); color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-det-status.spike { background: rgba(176,51,51,0.25); color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-prev-card { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.03); }
:root[data-theme="dark"] .fb-article .fb-prev-when { color: #E0B86B; }
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
  function mount(el, cfg) {
    if (!el) return;
    var prev = Chart.getChart(el);
    if (prev) prev.destroy();
    new Chart(el, cfg);
  }
  var releases = ['v3.1', 'v3.2', 'v3.3', 'v3.4', 'v3.5', 'v3.6', 'v3.7', 'v3.8'];
  var eprData = [0.0, 0.2, 0.0, 2.8, 0.3, 0.0, 0.2, 0.3];
  function initCharts() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(128,128,128,0.15)';
    var bgColors = eprData.map(function (v) { return v >= 2 ? '#B03333' : v >= 0.5 ? '#D97706' : '#2A7A3E'; });
    mount(document.getElementById('fb-c-epr'), {
      type: 'bar',
      data: {
        labels: releases,
        datasets: [
          { label: 'Escaped per Release', data: eprData, backgroundColor: bgColors, borderRadius: 6, borderSkipped: false, order: 1 },
          { label: 'Próg elitarny (0.5)', data: Array(8).fill(0.5), type: 'line', borderColor: 'rgba(200,148,58,0.6)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, order: 0 },
          { label: 'Próg alarmu (3.0)', data: Array(8).fill(3.0), type: 'line', borderColor: 'rgba(176,51,51,0.4)', borderWidth: 1.5, borderDash: [4, 3], pointRadius: 0, fill: false, order: 0 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) {
            if (c.datasetIndex !== 0) return null;
            var v = c.raw;
            var lvl = v >= 3 ? 'ALARM' : v >= 1.5 ? 'Wymaga uwagi' : v >= 0.5 ? 'Dobry' : 'Elitarny';
            return [' EpR: ' + v, ' Ocena: ' + lvl];
          } } }
        },
        scales: {
          y: { min: 0, max: 3.5, ticks: { stepSize: 0.5 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'Escaped bugs', font: { size: 10 } } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
    var rateData = [0.5, 0.8, 1.2, 3.1, 2.4, 1.8, 1.6, 1.5];
    mount(document.getElementById('fb-c-compare'), {
      type: 'bar',
      data: {
        labels: releases,
        datasets: [
          { label: 'Escaped per Release', data: eprData, backgroundColor: 'rgba(14,31,61,0.75)', borderRadius: 5, borderSkipped: false, yAxisID: 'y', order: 2 },
          { label: 'Ogólny Escaped Rate (%)', data: rateData, type: 'line', borderColor: '#0A6B6F', backgroundColor: 'transparent', borderWidth: 2.5, borderDash: [6, 4], pointBackgroundColor: '#0A6B6F', pointStyle: 'circle', pointRadius: 4, fill: false, tension: 0.4, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 3.5, ticks: { stepSize: 0.5 }, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'EpR (szt.)', font: { size: 10 }, color: '#5C7AAE' } },
          y1: { position: 'right', min: 0, max: 4, ticks: { callback: function (v) { return v + '%'; } }, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Rate (%)', font: { size: 10 }, color: '#0A6B6F' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
  function initDetector() {
    var inputs = document.querySelectorAll('#fb-det-inputs input');
    if (!inputs.length) return;
    function percentile(sorted, p) {
      var idx = (sorted.length - 1) * p;
      var lo = Math.floor(idx), hi = Math.ceil(idx);
      if (lo === hi) return sorted[lo];
      return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    }
    function setText(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }
    function update() {
      var vals = [];
      inputs.forEach(function (inp) {
        vals.push(inp.value === '' ? null : parseFloat(inp.value));
      });
      var filled = vals.filter(function (v) { return v !== null && !isNaN(v); });
      var stEl = document.getElementById('fb-det-status');
      if (filled.length < 4) {
        ['fb-det-median', 'fb-det-avg', 'fb-det-thresh', 'fb-det-spikes'].forEach(function (id) { setText(id, '-'); });
        if (stEl) { stEl.textContent = 'Wpisz co najmniej 4 wartości (metoda IQR potrzebuje kwartyli)'; stEl.className = 'fb-det-status'; }
        inputs.forEach(function (inp) { inp.classList.remove('spike'); });
        return;
      }
      var sorted = filled.slice().sort(function (a, b) { return a - b; });
      var q1 = percentile(sorted, 0.25);
      var q3 = percentile(sorted, 0.75);
      var iqr = q3 - q1;
      var med = percentile(sorted, 0.5);
      var thresh = iqr > 0 ? q3 + 1.5 * iqr : Math.max(med * 2, 0.5);
      var avg = filled.reduce(function (a, b) { return a + b; }, 0) / filled.length;
      var spikes = [];
      inputs.forEach(function (inp, i) {
        inp.classList.remove('spike');
        if (vals[i] !== null && !isNaN(vals[i]) && vals[i] > thresh) {
          inp.classList.add('spike');
          spikes.push('v' + (i + 1));
        }
      });
      setText('fb-det-median', med.toFixed(2));
      setText('fb-det-avg', avg.toFixed(2));
      setText('fb-det-thresh', thresh.toFixed(2));
      if (spikes.length === 0) {
        setText('fb-det-spikes', 'Brak');
        if (stEl) { stEl.textContent = '✓ Brak skoków - stabilny proces'; stEl.className = 'fb-det-status clean'; }
      } else if (spikes.length === 1) {
        setText('fb-det-spikes', spikes.join(', '));
        if (stEl) { stEl.textContent = '⚠ Skok: ' + spikes.join(', ') + ' - wymaga śledztwa (blameless, w 48h)'; stEl.className = 'fb-det-status warn'; }
      } else {
        setText('fb-det-spikes', spikes.join(', '));
        if (stEl) { stEl.textContent = '🚨 Wielokrotne skoki: ' + spikes.join(', ') + ' - problem systemowy'; stEl.className = 'fb-det-status spike'; }
      }
    }
    inputs.forEach(function (inp) { inp.addEventListener('input', update); });
    update();
  }
  function boot() { ensureChart(initCharts); initDetector(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
