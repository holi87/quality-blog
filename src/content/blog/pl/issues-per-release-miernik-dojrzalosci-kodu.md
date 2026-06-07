---
title: "Issues per Release - miernik dojrzałości kodu"
description: "Jak wdrożyć Issues per Release od zera, dlaczego to metryka procesu wytwórczego a nie tylko QA, i jak zmienia rozmowę z Engineering Managerem. Artykuł 4 z 9."
date: 2026-06-09
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 4 z 9</p>

<p class="fb-lead">Był poniedziałkowy standup. QA Lead miał pod oczami cienie - poprzedni tydzień zajął mu głównie wpisywanie ticketów. Pięćdziesiąt cztery issues w jednym releasie. Pięćdziesiąt cztery.</p>

<div class="fb-standup">
  <div class="fb-su-time">Poniedziałek · 09:15 · Sprint Planning</div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg">„Jak idzie testowanie? Zdążymy z releasem w piątek?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">„Mam 54 otwarte issues z tego sprintu. Pracuję 10 godzin dziennie. Nie wiem, czy zdążę."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg">„54? To dużo, co się stało?"</span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">„Nie wiem co się stało - wiem tylko, że ostatni release miał 18, a ten ma już 54 i jeszcze nie skończyłem."</span></div>
  <div class="fb-su-line"><span class="fb-su-who dev">Dev</span><span class="fb-su-msg"><em>„Ten release był duży, dużo nowych funkcji..."</em></span></div>
  <div class="fb-su-line"><span class="fb-su-who qa">QA</span><span class="fb-su-msg">„Poprzedni też był duży. 18 issues."</span></div>
  <div class="fb-su-line"><span class="fb-su-who em">EM</span><span class="fb-su-msg"><em>cisza</em></span></div>
</div>

Ta rozmowa skończyła się dobrze - bo QA Lead miał dane. Poprzedni release: 18. Bieżący: 54+. Bez tego porównania byłoby tylko: *„jest dużo bugów, pracujemy."*

**Issues per Release to metryka, która zamienia „jest dużo pracy" w konkretny sygnał.** I - co ważniejsze - wskazuje, gdzie leży problem. Nie zawsze w testowaniu.

## Czym jest Issues per Release

Issues per Release to liczba wszystkich problemów znalezionych przez QA w trakcie testowania jednego release'u - od momentu przyjęcia kodu do testów, do decyzji o wdrożeniu.

<div class="fb-formula-box fb-highlight">
  <div class="fb-f-label">Formuła</div>
  <div class="fb-formula">IPR = Liczba wszystkich issues znalezionych podczas testowania release'u</div>
  <div class="fb-formula-example">
    Release v2.3 → testy trwały 8 dni → znaleziono: 12 bugów + 4 uwagi UX + 3 problemy wydajnościowe + 2 niezgodności z wymaganiami = <strong>21 issues</strong><br>
    Release v2.4 → testy trwały 6 dni → znaleziono: 6 bugów + 1 uwaga UX + 1 problem wydajnościowy = <strong>8 issues</strong>
  </div>
  <div class="fb-formula-note">Kluczowe: liczymy <strong>wszystkie</strong> znalezione issues, nie tylko te o priorytecie Critical lub High. Każde odchylenie od oczekiwanego zachowania ma swoją wagę informacyjną.</div>
</div>

### Co liczy się jako „issue"

To jedno z najważniejszych pytań przy wdrażaniu tej metryki. Zbyt wąska definicja - i tracisz połowę sygnału. Zbyt szeroka - i liczba traci interpretację.

<div class="fb-issue-grid">
  <div class="fb-issue-card bug">
    <div class="fb-issue-icon">🐛</div>
    <div class="fb-issue-name">Defekt funkcjonalny</div>
    <div class="fb-issue-desc">Aplikacja zachowuje się inaczej niż powinna według specyfikacji lub zdrowego rozsądku.</div>
    <span class="fb-issue-tip">zawsze liczyć</span>
  </div>
  <div class="fb-issue-card ux">
    <div class="fb-issue-icon">🎨</div>
    <div class="fb-issue-name">Problem UX / UI</div>
    <div class="fb-issue-desc">Elementy działają technicznie, ale są nieczytelne, nieintuicyjne lub niespójne z resztą produktu.</div>
    <span class="fb-issue-tip">liczyć z etykietą</span>
  </div>
  <div class="fb-issue-card perf">
    <div class="fb-issue-icon">⚡</div>
    <div class="fb-issue-name">Problem wydajnościowy</div>
    <div class="fb-issue-desc">Czas odpowiedzi, zużycie zasobów, zachowanie pod obciążeniem - poza akceptowanymi progami.</div>
    <span class="fb-issue-tip">liczyć z etykietą</span>
  </div>
  <div class="fb-issue-card req">
    <div class="fb-issue-icon">📋</div>
    <div class="fb-issue-name">Niezgodność z wymaganiami</div>
    <div class="fb-issue-desc">Zaimplementowano coś innego niż było w specyfikacji - celowo lub przez nieporozumienie.</div>
    <span class="fb-issue-tip">zawsze liczyć</span>
  </div>
  <div class="fb-issue-card env">
    <div class="fb-issue-icon">🌍</div>
    <div class="fb-issue-name">Problem środowiskowy</div>
    <div class="fb-issue-desc">Aplikacja działa inaczej na różnych przeglądarkach, urządzeniach lub środowiskach testowych.</div>
    <span class="fb-issue-tip">liczyć z etykietą</span>
  </div>
</div>

**Rekomendacja:** licz wszystkie typy, ale taguj każdy z nich. Dzięki temu masz globalną liczbę IPR i możliwość drążenia w szczegóły - np. *„20 issues, z czego 14 defektów funkcjonalnych, 4 UX i 2 środowiskowe."*

<div class="fb-dark-box">
  <span class="fb-db-eyebrow">Kluczowa perspektywa</span>
  <h2 class="fb-db-h">Issues per Release to NIE jest metryka QA</h2>
  <p class="fb-db-intro">To jest metryka jakości całego procesu wytwórczego. QA tylko ją mierzy - ale za wynik odpowiada cały zespół. I to jest właśnie to, co sprawia, że ta metryka jest tak cenna w rozmowie z Engineering Managerem.</p>
  <div class="fb-ow-grid">
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~50%</div>
      <div class="fb-ow-who">Programiści</div>
      <div class="fb-ow-why">Jakość kodu, testy jednostkowe, code review, samodzielne testy przed przekazaniem</div>
      <div class="fb-ow-arrow">→ Definition of Done</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~20%</div>
      <div class="fb-ow-who">Product / Design</div>
      <div class="fb-ow-why">Kompletność wymagań, spójność specyfikacji, dostępność projektanta do pytań</div>
      <div class="fb-ow-arrow">→ Jakość backlogu</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~20%</div>
      <div class="fb-ow-who">Proces zespołu</div>
      <div class="fb-ow-why">Przegląd wymagań przed sprintem, Three Amigos, refinement, acceptance criteria</div>
      <div class="fb-ow-arrow">→ Dojrzałość procesu</div>
    </div>
    <div class="fb-ow-card">
      <div class="fb-ow-pct">~10%</div>
      <div class="fb-ow-who">QA</div>
      <div class="fb-ow-why">Jakość przypadków testowych, pokrycie scenariuszy, środowisko testowe</div>
      <div class="fb-ow-arrow">→ Skuteczność testowania</div>
    </div>
  </div>
  <div class="fb-db-quote">Gdy IPR rośnie - pierwsza rozmowa nie powinna brzmieć „QA musi testować lepiej". Powinna brzmieć: „co zmieniło się w procesie wytwórczym od ostatniego release'u?"</div>
</div>

## Trend, który mówi więcej niż jakikolwiek status update

Jeden release to nic. Sześć releasów z wyraźnym kierunkiem - to historia. I to właśnie historia przekonuje Engineering Managera do działania.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Issues per Release - trend przez 6 releasów</div>
      <div class="fb-chart-sub">Rozkład według typów ujawnia, gdzie leży problem i co wymaga interwencji</div>
    </div>
    <span class="fb-chart-badge">v2.1 → v2.6</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#3B82F6"></span>Defekty funkcjonalne</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#F59E0B"></span>UX / UI</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#8B5CF6"></span>Wydajność</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#EF4444"></span>Niezgodności z wymaganiami</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-ipr-stack" role="img" aria-label="Wykres słupkowy skumulowany: łączna liczba issues spada z 24 w v2.1 do 4 w v2.6, a defekty funkcjonalne maleją najszybciej (z 16 do 3)."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">IPR vs DDR - korelacja procesowa</div>
      <div class="fb-chart-sub">Gdy IPR spada, DDR rośnie. Lepszy kod wchodzący do testów = mniej problemów = więcej złapanych przed produkcją</div>
    </div>
    <span class="fb-chart-badge">wzajemna zależność</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#0E1F3D"></span>Issues per Release (szt.)</span>
    <span class="fb-lg"><span style="width:16px;height:0;border-top:2.5px dashed #2A7A3E;display:inline-block;"></span>DDR (%)</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-corr" role="img" aria-label="Wykres liniowy: Issues per Release spada z 24 do 4 przez 6 releasów, a DDR rośnie z 78% do 95%. Zależność odwrotna."></canvas>
  </div>
</div>

## Jak czytać wynik

Nie ma jednego „dobrego" IPR - zależy od rozmiaru release'u, złożoności systemu i dojrzałości zespołu. Ale trendy są wymowne zawsze. Poniżej progi orientacyjne dla typowego release'u średniej złożoności.

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-range">20+</div>
    <div class="fb-tc-label">Sygnał alarmowy</div>
    <div class="fb-tc-desc">Warto zbadać przyczyny przed kontynuowaniem sprintu. Co zmieniło się w procesie?</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-range">12-20</div>
    <div class="fb-tc-label">Do poprawy</div>
    <div class="fb-tc-desc">Wymaga uwagi. Sprawdź, które kategorie dominują i zaproponuj jedno działanie naprawcze.</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-range">6-12</div>
    <div class="fb-tc-label">Solidny poziom</div>
    <div class="fb-tc-desc">Dobra praca. Monitoruj trend - czy systematycznie maleje, czy oscyluje?</div>
  </div>
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-range">&lt;6</div>
    <div class="fb-tc-label">Dojrzały proces</div>
    <div class="fb-tc-desc">Świetny wynik. Sprawdź, czy testy wystarczająco głęboko pokrywają krytyczne ścieżki.</div>
  </div>
</div>

**Ważne zastrzeżenie:** niski IPR przy niskiej liczbie testów nie jest sukcesem - może oznaczać, że QA testuje zbyt płytko. Zawsze zestawiaj IPR z zakresem testów i DDR.

## Jak zacząć mierzyć - cztery kroki

Dobra wiadomość: nie potrzebujesz nowych narzędzi. Dane są już w Twoim trackerze - trzeba je tylko odpowiednio zebrać i znakować.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Ustal definicję „issue" i zapisz ją w jednym miejscu</div>
      <div class="fb-step-text">Zanim cokolwiek zaczniesz liczyć - ustal z zespołem: co wchodzi do licznika? Defekty funkcjonalne na pewno. Uwagi UX? Problemy wydajnościowe? Niezgodności z wymaganiami?</div>
      <div class="fb-step-text">Zapisz to w Confluence, wiki lub jako komentarz do filtra w Jirze. Spójność definicji jest ważniejsza niż jej doskonałość.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Skonfiguruj pole „Fix version" lub tag release'u w Jirze</div>
      <div class="fb-step-text">Każdy issue stworzony podczas testowania powinien mieć przypisany release, którego dotyczy. W Jirze to pole „Fix Version/s" lub własna etykieta <code>release-v2.x</code>.</div>
      <div class="fb-step-code">project = MYAPP AND issuetype in (Bug, Task, Improvement)<br>AND "Fix Version" = "v2.3"<br>AND created &gt;= startOfSprint()<br>ORDER BY created ASC</div>
      <div class="fb-step-text">Ten filtr da Ci wszystkie issues znalezione podczas testowania konkretnego release'u.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Dodaj etykiety typów - od pierwszego dnia</div>
      <div class="fb-step-text">Samo „ile" wystarczy na start. Ale „ile i jakiego rodzaju" daje Ci znacznie silniejszy argument w rozmowie z EM i PM. Wprowadź prosty system etykiet: <code>type:functional</code>, <code>type:ux</code>, <code>type:perf</code>, <code>type:requirement</code>.</div>
      <div class="fb-step-text">Tagowanie zajmuje 30 sekund na issue. Zwraca się wielokrotnie przy każdej retrospektywie i rozmowie z biznesem.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Odtwórz historię wstecz - minimum 4 ostatnie releasey</div>
      <div class="fb-step-text">Podobnie jak przy DDR - jeden punkt danych to za mało. Retroaktywne policzenie IPR za ostatnie 4-6 releasów zajmie 1-2 godziny i da Ci od razu trend.</div>
      <div class="fb-step-text">Jeśli nie masz etykiet typów za poprzednie releasey - to trudniej, ale nadal warto zrobić globalne liczby. Trend IPR bez rozkładu typów wciąż jest bardzo wymowny.</div>
    </div>
  </div>
</div>

### Interaktywny tracker IPR

Wpisz dane ze swoich ostatnich releasów i od razu zobaczysz trend oraz ocenę każdego z nich.

<div class="fb-tracker-wrap">
  <div class="fb-tracker-title">Tracker Issues per Release</div>
  <div class="fb-tracker-sub">Wpisz liczbę issues dla każdego release'u - tracker wygeneruje ocenę i podsumowanie trendu</div>

  <div class="fb-tracker-rows">
    <div class="fb-tracker-row header">
      <span>Release</span><span>Issues (wpisz)</span><span>IPR</span><span>Ocena</span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.1</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="np. 24" aria-label="Issues dla v2.1">
      <span class="fb-tr-result" id="fb-r1">-</span>
      <span class="fb-tr-badge" id="fb-b1"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.2</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="np. 19" aria-label="Issues dla v2.2">
      <span class="fb-tr-result" id="fb-r2">-</span>
      <span class="fb-tr-badge" id="fb-b2"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.3</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="np. 14" aria-label="Issues dla v2.3">
      <span class="fb-tr-result" id="fb-r3">-</span>
      <span class="fb-tr-badge" id="fb-b3"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.4</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="np. 11" aria-label="Issues dla v2.4">
      <span class="fb-tr-result" id="fb-r4">-</span>
      <span class="fb-tr-badge" id="fb-b4"></span>
    </div>
    <div class="fb-tracker-row">
      <span class="fb-tr-label">v2.5</span>
      <input class="fb-tr-input" type="number" min="0" inputmode="numeric" placeholder="np. 8" aria-label="Issues dla v2.5">
      <span class="fb-tr-result" id="fb-r5">-</span>
      <span class="fb-tr-badge" id="fb-b5"></span>
    </div>
  </div>

  <div class="fb-tracker-footer">
    <div class="fb-tf-item"><div class="fb-tf-label">Średnia IPR</div><div class="fb-tf-val" id="fb-tf-avg">-</div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Trend</div><div class="fb-tf-val"><span class="fb-tf-trend" id="fb-tf-trend">-</span></div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Najlepszy release</div><div class="fb-tf-val" id="fb-tf-best">-</div></div>
    <div class="fb-tf-item"><div class="fb-tf-label">Zmiana łącznie</div><div class="fb-tf-val" id="fb-tf-change">-</div></div>
  </div>
</div>

## Jak ta metryka zmienia dynamikę

Bez danych rozmowa o jakości kodu wchodzącego do testów jest trudna. QA brzmi jak narzekanie, dev brzmi jak obrona. Z IPR w tle - to jest rozmowa o liczbach, nie o emocjach.

<div class="fb-em-conv">
  <div class="fb-em-before">
    <div class="fb-em-tag">✗ Bez danych - rozmowa skończy się w punkcie wyjścia</div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">„Znowu dostajemy kod pełen bugów. Nie możemy tak pracować."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">„Każdy release jest inny, ten był szczególnie duży..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">Dev</span><span class="fb-em-text">„Pracowaliśmy pod presją, deadline był napięty..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">„Ale to nie jest pierwszy raz..."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">„Dobra, zobaczymy jak pójdzie następny."</span></div>
  </div>
  <div class="fb-em-after">
    <div class="fb-em-tag">✓ Z danymi - rozmowa prowadzi do konkretnego działania</div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">„Mam dane z ostatnich 6 releasów. IPR wynosił: 8, 11, 9, 21, 28, 32. Coś zmieniło się po v2.3 - i od tamtej pory trend jest wyraźnie rosnący."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">„v2.3... to był ten sprint, kiedy zmieniliśmy skład zespołu i zrezygnowaliśmy z code review dla szybszego dostarczania."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">QA</span><span class="fb-em-text">„Dokładnie. 80% wzrostu IPR to defekty funkcjonalne. Proponuję jedno działanie: przywrócenie obowiązkowego code review z listą kontrolną dla testowania."</span></div>
    <div class="fb-em-line"><span class="fb-em-who">EM</span><span class="fb-em-text">„To ma sens. Kiedy możemy to wdrożyć?"</span></div>
  </div>
</div>

Różnica nie polega na tym, że QA Lead jest bardziej przekonujący. Polega na tym, że **przychodzi z faktem, a nie z odczuciem**. Trend IPR 8 do 32 przez 6 releasów jest niepodważalny. Opinia „dostajemy coraz gorszy kod" - jest podważalna.

## Trzy pułapki przy korzystaniu z IPR

<div class="fb-pitfall-grid">
  <div class="fb-pitfall" data-n="01">
    <div class="fb-pitfall-title">Porównujesz releasey różnej wielkości</div>
    <div class="fb-pitfall-text">Release z 3 funkcjami i release z 12 funkcjami nie są porównywalne bez normalizacji. Rozwiązanie: śledź też IPR na story point lub na funkcję - albo przynajmniej zaznaczaj „duży/mały/średni" przy każdym releasie w danych historycznych.</div>
  </div>
  <div class="fb-pitfall" data-n="02">
    <div class="fb-pitfall-title">Niski IPR, bo QA testuje zbyt płytko</div>
    <div class="fb-pitfall-text">IPR 4 może oznaczać doskonały kod - albo testy, które nie wchodzą wystarczająco głęboko. Zawsze zestawiaj IPR z DDR: jeśli IPR spada, a DDR też spada - coś jest nie tak z pokryciem testów. Jeśli IPR spada, a DDR rośnie - masz prawdziwy postęp.</div>
  </div>
  <div class="fb-pitfall" data-n="03">
    <div class="fb-pitfall-title">Używasz IPR do oceniania devów, nie procesu</div>
    <div class="fb-pitfall-text">To najgroźniejsza pułapka - i najkrótsza droga do tego, żeby programiści przestali zgłaszać problemy sami, zaczęli je ukrywać i traktowali QA jako wroga. IPR mierzy dojrzałość procesu, nie kompetencje ludzi. Komunikuj to wyraźnie i konsekwentnie przy każdej prezentacji tej metryki.</div>
  </div>
</div>

## IPR w rozmowie z biznesem

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„Issues per Release wyniosło 8 - o 40% mniej niż poprzedni sprint. Kod wchodzi do testów coraz czystszy. To dobry sygnał dla całego procesu wytwórczego."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 z EM</span>
    <span class="fb-biz-text">„Mam trend IPR z ostatnich 6 releasów - widoczny skok po v2.3. To zbiegło się z rezygnacją z code review. Proponuję konkretne działanie i chcę sprawdzić, czy IPR wróci do poprzedniego poziomu w ciągu dwóch releasów."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„W ciągu ostatnich czterech kwartałów Issues per Release spadło z 24 do 8 - czyli o 66%. Każdy issue to średnio 1,5 godziny pracy QA. To jest 24 godziny zaoszczędzone na jeden release - czas, który przeznaczamy teraz na testy eksploracyjne i automatyzację."</span>
  </div>
</div>

## Co daje metryka, której nie ma w QA podręczniku

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">✓ IPR daje Ci</div>
    <ul class="fb-sum-list">
      <li>Obiektywny miernik jakości kodu wchodzącego do testów</li>
      <li>Wczesny sygnał - zanim escapes trafią na produkcję</li>
      <li>Argument do rozmowy z EM oparty na faktach, nie opinii</li>
      <li>Wskaźnik dojrzałości całego procesu wytwórczego</li>
      <li>Korelację z DDR - pełniejszy obraz zdrowia procesu</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">✗ IPR nie mówi Ci</div>
    <ul class="fb-sum-list">
      <li>Czy bugi uciekają na produkcję (to Escaped per Release)</li>
      <li>Jak skuteczne jest testowanie (to DDR)</li>
      <li>Czy możesz releasować (to Confidence Score)</li>
      <li>Kto konkretnie popełnia błędy - i nie powinno</li>
    </ul>
  </div>
</div>

<blockquote class="fb-quote">QA nie jest fabryką napraw. Issues per Release to metryka, która to udowadnia - i przenosi rozmowę o jakości tam, gdzie powinna się odbywać: na poziom całego procesu wytwórczego.</blockquote>

## W następnym artykule

Artykuł piąty dotyczy **Escaped Bugs per Release** - metryki, która nie pyta, ile bugów masz łącznie, ale *które konkretnie releasey były ryzykowne*. I jak ten widok pozwala Ci diagnozować przyczyny, a nie tylko obserwować skutki.

Spoiler: skok w jednym releasie to zawsze sygnał do śledztwa. I mamy metodę, jak to śledztwo prowadzić.

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">01</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Kompletny przewodnik</a> <span class="fb-s-badge-done">przeczytany</span></div>
        <div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">02</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/defect-detection-ratio-jak-mierzyc-skutecznosc/">Defect Detection Ratio</a> <span class="fb-s-badge-done">przeczytany</span></div>
        <div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/escaped-bugs-problems-pelne-spektrum/">Escaped Bugs i Problems</a> <span class="fb-s-badge-done">przeczytany</span></div>
        <div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">04</span>
      <div>
        <div class="fb-s-title">Issues per Release <span class="fb-s-now">czytasz teraz</span></div>
        <div class="fb-s-sub">Wdrożenie od zera, związek z procesem wytwórczym, rozmowa z EM</div>
      </div>
    </li>
    <li class="fb-s-item">
      <span class="fb-s-num">05</span>
      <div>
        <div class="fb-s-title">Escaped Bugs per Release - znajdź ryzykowny release</div>
        <div class="fb-s-sub">Wskazywanie problemów, nie tylko obserwowanie trendów</div>
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
        <div class="fb-s-sub">Trzy modele obliczania, wdrożenie, przykłady z praktyki</div>
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
        <div class="fb-s-sub">Za dużo metryk, brak kontekstu, żargon - i jak unikać</div>
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
          { label: 'Defekty funkcjonalne', data: [16, 13, 9, 7, 5, 3], backgroundColor: '#3B82F6', stack: 's' },
          { label: 'UX / UI', data: [4, 3, 5, 2, 2, 1], backgroundColor: '#F59E0B', stack: 's' },
          { label: 'Wydajność', data: [2, 2, 3, 1, 1, 0], backgroundColor: '#8B5CF6', stack: 's' },
          { label: 'Niezgodności z wymaganiami', data: [2, 1, 4, 1, 0, 0], backgroundColor: '#EF4444', borderRadius: { topLeft: 4, topRight: 4 }, stack: 's' }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, callbacks: { footer: function (items) { return 'Łącznie: ' + items.reduce(function (s, i) { return s + i.raw; }, 0) + ' issues'; } } } },
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
      if (n >= 12) return { text: 'Do poprawy', cls: 'badge-warn' };
      if (n >= 6) return { text: 'Solidny', cls: 'badge-good' };
      return { text: 'Świetny', cls: 'badge-great' };
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
        if (diff < -2) { tEl.textContent = '↓ Malejący'; tEl.className = 'fb-tf-trend down-good'; setText('fb-tf-change', diff + ' issues'); }
        else if (diff > 2) { tEl.textContent = '↑ Rosnący'; tEl.className = 'fb-tf-trend up-bad'; setText('fb-tf-change', '+' + diff + ' issues'); }
        else { tEl.textContent = '→ Stabilny'; tEl.className = 'fb-tf-trend flat'; setText('fb-tf-change', diff + ' issues'); }
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
