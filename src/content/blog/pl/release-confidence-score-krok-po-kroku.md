---
title: "Release Confidence Score krok po kroku"
description: "Jak połączyć pięć metryk QA w jeden wskaźnik decyzyjny. Trzy modele obliczania - traffic light, ważony, z dyskwalifikatorem - interaktywny kalkulator i jak Confidence Score zmienia pozycję QA w firmie. Artykuł 7 z 9."
date: 2026-06-30
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 16
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 7 z 9</p>

<p class="fb-lead">Steering committee. Napięcie rośnie, a w powietrzu wisi decyzja o dużym wdrożeniu. CTO spogląda na QA Leada i zadaje tradycyjne pytanie o to, czy możemy bezpiecznie wypuścić nową wersję. Tym razem nie ma wymijającego „chyba tak", ani wyliczania dziesiątek otwartych błędów. Zamiast tego pada konkretna informacja: „Confidence Score wynosi 91%, a zespół rekomenduje start."</p>

<div class="fb-steer">
  <div class="fb-steer-time">Steering Committee · decyzja o releasie v4.0</div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg">„To duży release. Możemy go wypuścić w piątek, czy przesuwamy?"</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who qa">QA</span><span class="fb-steer-msg win">„Confidence Score wynosi 91%. Zero otwartych blokerów, regresja 96%, wszystkie krytyczne ścieżki zielone. Rekomendujemy GO."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg">„A ten moduł płatności, o którym była mowa?"</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who qa">QA</span><span class="fb-steer-msg">„To jedyny powód, dla którego nie jesteśmy na 100%. Jeden bug średniego priorytetu, znany, z obejściem. Stąd 91%, a nie więcej."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who cto">CTO</span><span class="fb-steer-msg win">„Jasne. Wchodzimy w piątek."</span></div>
  <div class="fb-steer-line"><span class="fb-steer-who po">PO</span><span class="fb-steer-msg"><em>Decyzja podjęta w 90 sekund. Bez tabeli z 20 wykresami. Bez przepychanek.</em></span></div>
</div>

To nie jest idealistyczna wizja, lecz precyzyjny cel, do którego prowadzi cała nasza seria. Sześć wcześniejszych tekstów opisywało pięć różnych metryk. W tym siódmym łączymy je w jedno, niezwykle użyteczne narzędzie decyzyjne - **Release Confidence Score**.

Jeśli miałbyś wynieść z tego cyklu tylko jedną rzecz, niech to będzie właśnie ten wskaźnik, ponieważ dzięki niemu metryki QA stają się realnym głosem w biznesowych dyskusjach.

## Metryka, która patrzy w przód, nie w tył

Wszystkie metryki omawiane w poprzednich artykułach mają charakter opóźniony (lagging). DDR, escaped bugs, issues per release - wszystkie mierzą to, co już za nami. Świetnie sprawdzają się do analizy trendów i oceny przeszłych działań, ale nie odpowiadają na kluczowe pytanie stawiane przed wdrożeniem.

<div class="fb-ll-wrap">
  <div class="fb-ll-card fb-ll-lagging">
    <div class="fb-ll-icon">📉</div>
    <span class="fb-ll-tag">Lagging - wskaźniki opóźnione</span>
    <div class="fb-ll-title">Pięć metryk serii</div>
    <div class="fb-ll-desc">Mierzą przeszłość i oceniają dotychczasowe działania. Doskonałe do analizy trendów oraz budżetowania.</div>
    <div class="fb-ll-list">DDR · Escaped Bugs · Issues/Release · Escaped/Release · Number of Releases</div>
  </div>
  <div class="fb-ll-card fb-ll-leading">
    <div class="fb-ll-icon">🎯</div>
    <span class="fb-ll-tag">Leading - wskaźnik wyprzedzający</span>
    <div class="fb-ll-title">Release Confidence Score</div>
    <div class="fb-ll-desc">Skupia się na teraźniejszości i weryfikuje, czy jesteśmy gotowi na wdrożenie w danej sekundzie. To wskaźnik ściśle decyzyjny.</div>
    <div class="fb-ll-list">Blokery · Regresja · Krytyczne ścieżki - stan na moment decyzji</div>
  </div>
</div>

Release Confidence Score to **wskaźnik wyprzedzający**. Zamiast pytać o przeszłość, bada naszą bezpośrednią gotowość. To jedyna metryka w arsenale QA, która realnie kształtuje decyzję, jeszcze zanim ostatecznie ona zapadnie.

<div class="fb-quote">Pozostałe metryki oceniają mecz po gwizdku. Confidence Score to ostatnia odprawa w szatni - zanim wyjdziesz na boisko.</div>

## Z czego zbudowany jest Confidence Score

Niezależnie od wybranego modelu obliczeniowego, Confidence Score opiera się na trzech fundamentalnych elementach. To trzy pytania, na które musisz znać odpowiedź przed każdym releasem.

<div class="fb-comp-grid">
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🚫</div>
    <div class="fb-comp-weight">40%</div>
    <div class="fb-comp-name">Otwarte blokery</div>
    <div class="fb-comp-desc">Określa liczbę krytycznych błędów, które uniemożliwiają wdrożenie. To warunek zero-jedynkowy - obecność blokerów wstrzymuje wydanie.</div>
  </div>
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🔄</div>
    <div class="fb-comp-weight">35%</div>
    <div class="fb-comp-name">Wyniki regresji</div>
    <div class="fb-comp-desc">Analizuje procent udanych testów. Nie musimy gonić za perfekcyjnymi 100%, ale wynik na poziomie 60% jest natychmiastowym sygnałem alarmowym.</div>
  </div>
  <div class="fb-comp-card">
    <div class="fb-comp-icon">🛣️</div>
    <div class="fb-comp-weight">25%</div>
    <div class="fb-comp-name">Krytyczne ścieżki</div>
    <div class="fb-comp-desc">Sprawdza poprawne działanie kluczowych funkcjonalności biznesowych, takich jak proces logowania czy obsługa płatności, których pod żadnym pozorem nie możemy zepsuć.</div>
  </div>
</div>

Zaproponowane wagi 40/35/25 to jedynie punkt wyjścia. Dostosuj je do specyfiki własnego produktu: jeśli kluczowe ścieżki są ważniejsze niż szeroki zakres regresji, zmień proporcje. Istotne jest, aby ustalić je raz i komunikować w transparentny sposób.

## Trzy modele obliczania - od prostego do produkcyjnego

Nie ma jednego uniwersalnego sposobu wyliczania tego wskaźnika. Możemy wyróżnić trzy modele o rosnącym stopniu zaawansowania - zacznij od podstawowego i rozwijaj go wraz z dojrzałością zespołu.

<div class="fb-model m1">
  <div class="fb-model-header">
    <div class="fb-model-badge">1</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Traffic Light</div>
      <div class="fb-model-level">Poziom: start · najprostszy</div>
    </div>
  </div>
  <div class="fb-model-desc">Trzy warunki, każdy oparty na logice zero-jedynkowej. Bez wyliczania skomplikowanych procentów - czysty układ świateł. Idealny na sam początek, gdy chcesz szybko zbudować wspólny język z biznesem.</div>
  <div class="fb-tl-conditions">
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> Zero otwartych blokerów</div>
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> Regresja przeszła ≥ 90%</div>
    <div class="fb-tl-cond"><span class="fb-tl-check">✓</span> Wszystkie krytyczne ścieżki zielone</div>
  </div>
  <div class="fb-tl-verdicts">
    <div class="fb-tl-v fb-tl-v-go">3/3 = GO</div>
    <div class="fb-tl-v fb-tl-v-cond">2/3 = WARUNKOWO</div>
    <div class="fb-tl-v fb-tl-v-hold">≤1/3 = WSTRZYMANO</div>
  </div>
  <div class="fb-model-example" style="margin-top:14px;"><strong>Plus:</strong> prosty, zrozumiały dla każdego w kilka sekund. <strong>Minus:</strong> nie generuje wartości procentowej, przez co trudniej śledzić subtelne wahania i trendy między sprintami.</div>
</div>

<div class="fb-model m2">
  <div class="fb-model-header">
    <div class="fb-model-badge">2</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Ważona średnia</div>
      <div class="fb-model-level">Poziom: średni · precyzyjny</div>
    </div>
  </div>
  <div class="fb-model-desc">Bardziej precyzyjne podejście, które wylicza jeden procentowy wynik na podstawie przypisanych wag poszczególnym składnikom. Pozwala na wygodne śledzenie długofalowych trendów w czasie i jest najpopularniejszym wyborem w dojrzałych zespołach.</div>
  <div class="fb-model-formula">Confidence Score = (blokery × 0.40) + (regresja × 0.35) + (ścieżki × 0.25)</div>
  <div class="fb-model-example">
    <strong>Przykład:</strong> 0 blokerów (= 100), regresja 85%, 3 z 4 krytycznych ścieżek OK (= 75%)<br>
    = (100 × 0.40) + (85 × 0.35) + (75 × 0.25)<br>
    = 40 + 29,75 + 18,75 = <strong>88,5%</strong>
  </div>
</div>

<div class="fb-model m3">
  <div class="fb-model-header">
    <div class="fb-model-badge">3</div>
    <div class="fb-model-titles">
      <div class="fb-model-name">Ważona z dyskwalifikatorem</div>
      <div class="fb-model-level">Poziom: produkcyjny · najbezpieczniejszy</div>
    </div>
  </div>
  <div class="fb-model-desc">Wariant bazujący na modelu drugim, ale rozbudowany o twardą zasadę bezpieczeństwa: przy obecności choćby jednego otwartego blokera, końcowy wynik jest automatycznie obcinany do maksymalnie 50% - niezależnie od stanu pozostałych składowych.</div>
  <div class="fb-model-formula">JEŚLI blokery > 0 → Confidence Score = min(wynik_ważony, 50%)<br>W PRZECIWNYM RAZIE → Confidence Score = wynik_ważony</div>
  <div class="fb-alert">
    <p><strong>Dlaczego to ważne?</strong> Stosowanie modelu obliczeniowego bez mechanizmu dyskwalifikującego prowadzi do niebezpiecznych sytuacji, w których poważne błędy gubią się w wysokiej średniej z innych wskaźników. Jeden bloker płatności musi dyskwalifikować release, nawet gdy reszta wygląda idealnie - i model 3 wymusza to matematycznie.</p>
  </div>
</div>

<div class="fb-quote">Moja rekomendacja: zacznij od modelu 2 z dyskwalifikatorem z modelu 3. Wagi dostosuj do kontekstu. Ale przede wszystkim - ustal wzór raz, zapisz go i trzymaj się go. Stakeholderzy muszą wiedzieć, że 94% znaczy to samo w sprincie 10 co w sprincie 30.</div>

## Kalkulator Confidence Score

Przełączaj się między trzema modelami, ustawiaj składniki i obserwuj, jak zmienia się wynik i rekomendacja. To dokładnie ten kalkulator, który możesz odtworzyć w arkuszu dla swojego zespołu.

<div class="fb-calc">
  <div class="fb-calc-title">Oblicz swój Release Confidence Score</div>
  <div class="fb-calc-sub">Wybierz model i ustaw parametry releasu</div>

  <div class="fb-calc-tabs">
    <button class="fb-calc-tab active" data-model="1">1 · Traffic Light</button>
    <button class="fb-calc-tab" data-model="2">2 · Ważony</button>
    <button class="fb-calc-tab" data-model="3">3 · Z dyskwalifikatorem</button>
  </div>

  <div class="fb-calc-fields">
    <div class="fb-calc-field">
      <label>Otwarte blokery (krytyczne bugi)</label>
      <div class="fb-calc-stepper">
        <button class="fb-calc-step-btn" data-step="-1" aria-label="Mniej blokerów">−</button>
        <span class="fb-calc-step-val" id="fb-c-blockers">0</span>
        <button class="fb-calc-step-btn" data-step="1" aria-label="Więcej blokerów">+</button>
        <span class="fb-calc-step-hint" id="fb-c-blockers-hint">brak blokerów</span>
      </div>
    </div>
    <div class="fb-calc-field">
      <label>Wynik regresji</label>
      <div class="fb-calc-field-row">
        <input type="range" id="fb-c-regression" min="0" max="100" value="96">
        <span class="fb-calc-field-val" id="fb-c-regression-val">96%</span>
      </div>
    </div>
    <div class="fb-calc-field">
      <label>Krytyczne ścieżki działające</label>
      <div class="fb-calc-field-row">
        <input type="range" id="fb-c-paths" min="0" max="100" value="100" step="25">
        <span class="fb-calc-field-val" id="fb-c-paths-val">4/4</span>
      </div>
    </div>
  </div>

  <div class="fb-calc-result">
    <div class="fb-calc-score score-go" id="fb-c-score">GO</div>
    <span class="fb-calc-verdict cv-go" id="fb-c-verdict">Wszystkie warunki spełnione</span>
    <div class="fb-calc-breakdown" id="fb-c-breakdown" style="display:none;"></div>
  </div>
</div>

## Jak pięć metryk zasila jeden wskaźnik

Confidence Score to mechanizm w pełni osadzony w ekosystemie opisywanych wcześniej metryk. Cała seria zaczyna działać jako spójny system, w którym dane opóźnione zasilają wskaźnik wyprzedzający.

<div class="fb-funnel">
  <div class="fb-funnel-title">Pięć metryk → Confidence Score → Decyzja</div>
  <div class="fb-funnel-inputs">
    <div class="fb-fi-card">
      <div class="fb-fi-num">01</div>
      <div class="fb-fi-name">DDR</div>
      <div class="fb-fi-role">Pozwala precyzyjnie kalibrować nasz próg zaufania do testów regresji</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">02</div>
      <div class="fb-fi-name">Escaped Bugs</div>
      <div class="fb-fi-role">Ułatwiają trafną definicję tego, co faktycznie jest dla nas ścieżką krytyczną</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">03</div>
      <div class="fb-fi-name">Issues / Release</div>
      <div class="fb-fi-role">Dostarcza sygnałów na temat potencjalnej liczby błędów blokujących</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">04</div>
      <div class="fb-fi-name">Escaped / Release</div>
      <div class="fb-fi-role">Nakreśla tło historyczne i ogólne ryzyko dla podobnych wdrożeń</div>
    </div>
    <div class="fb-fi-card">
      <div class="fb-fi-num">05</div>
      <div class="fb-fi-name">Number of Releases</div>
      <div class="fb-fi-role">Pomaga zrozumieć częstotliwość wydań oraz rozmiar wdrażanych zmian</div>
    </div>
  </div>
  <div class="fb-funnel-arrow">↓</div>
  <div class="fb-funnel-out">
    <div class="fb-fo-label">Wskaźnik wyprzedzający</div>
    <div class="fb-fo-metric">Release Confidence Score</div>
    <div class="fb-fo-sub">W telegraficznym skrócie: na wejściu analizujemy pięć surowych danych, a na wyjściu otrzymujemy zwięzłą rekomendację: GO / WARUNKOWO / WSTRZYMANO</div>
  </div>
</div>

W tym tkwi sedno całego cyklu. Pojedyncze metryki to suche fakty. Confidence Score to opowieść, która przekuwa te fakty w decyzję. **Pięć liczb wpada na górze, jedna rekomendacja wychodzi na dole** - w języku, który zarząd przyswaja błyskawicznie.

## Jak Confidence Score zmienia pozycję QA w firmie

<div class="fb-strat">
  <p class="fb-strat-intro">To nie jest tylko kolejna liczba w arkuszu. Confidence Score pełni funkcję dźwigni, która transformuje rolę QA wewnątrz firmy, przesuwając nas z samego końca procesu bezpośrednio do stołu decyzyjnego.</p>
  <div class="fb-transform">
    <div class="fb-tr-state fb-tr-before">
      <div class="fb-tr-role">Przed</div>
      <div class="fb-tr-title">Bramkarz</div>
      <div class="fb-tr-desc">QA kojarzy się głównie z mówieniem „nie" na szarym końcu procesu. Zespół bywa postrzegany jako przeszkoda lub wąskie gardło, a kluczowe ustalenia zapadają często bez jego realnego udziału.</div>
    </div>
    <div class="fb-tr-arrow">→</div>
    <div class="fb-tr-state fb-tr-after">
      <div class="fb-tr-role">Po</div>
      <div class="fb-tr-title">Partner decyzyjny</div>
      <div class="fb-tr-desc">QA dostarcza przejrzysty wskaźnik, na którym biznes opiera swoje działania. Confidence Score staje się stałym elementem obrad steering committee, a QA współtworzy decyzje na partnerskich warunkach.</div>
    </div>
  </div>
  <div class="fb-strat-quote">Gdy CTO zaczyna pytać o Confidence Score z własnej inicjatywy - przed każdym releasem, bez Twojego przypominania - to jest moment, w którym wiesz, że QA przestało być kosztem, a stało się częścią procesu decyzyjnego.</div>
</div>

Taka zmiana nie zachodzi po jednym dobrym raporcie. To efekt konsekwencji, gdy wskaźnik okazuje się trafny raz, drugi i dziesiąty. Kiedy wynik 62% rzeczywiście zwiastuje trudne wdrożenie, a 94% oznacza w pełni gładki proces. Wtedy liczba zyskuje zaufanie, które automatycznie przekłada się na pozycję zespołu, który ją dostarcza.

## Jak uruchomić Confidence Score w cztery kroki

Uruchomienie tego mechanizmu jest zaskakująco szybkie i można je zamknąć w trakcie jednego lub dwóch sprintów.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Wybierz model i ustal definicje składników</div>
      <div class="fb-step-text">Zacznij od modelu 2 z dyskwalifikatorem. Zapisz jednoznaczne i sztywne definicje: co dokładnie uznajemy za „bloker"? Jaki poziom regresji jest niezbędnym minimum? Które ścieżki są krytyczne (zazwyczaj 3-6 kluczowych procesów)? Spójność tych zasad buduje zaufanie do wskaźnika.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Zbierz dane składników z istniejących narzędzi</div>
      <div class="fb-step-text">Pozyskaj dane z systemów, których używasz na co dzień. Blokery wyciągniesz z Jiry (odpowiedni filtr po priorytecie i statusie), dane o regresji z raportów automatyzacji lub TestRaila, a stan ścieżek krytycznych ze smoke suite lub checklist E2E. Te dane już masz - trzeba je tylko zestawić.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Policz wstecz dla ostatnich 3-5 releasów</div>
      <div class="fb-step-text">Przelicz wskaźnik wstecz dla kilku ostatnich wdrożeń, zanim oficjalnie zaprezentujesz go firmie. Sprawdź, czy wyniki pokrywają się z rzeczywistością: czy problematyczne wydania miały niski score, a te bezproblemowe wysoki? Taka wstępna walidacja to Twój najlepszy argument.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Wprowadź na sprint review - jeden slajd, jedna liczba</div>
      <div class="fb-step-text">Zacznij od prostego przekazu: jeden slajd prezentujący Confidence Score, jego trzy składowe i jasną rekomendację. Zamiast zasypywać odbiorców dziesiątkami wykresów, powiedz: „Confidence Score wynosi X%. Rekomendujemy GO, ponieważ...". Zobaczysz, że po kilku sprintach biznes sam zacznie pytać o tę wartość.</div>
    </div>
  </div>
</div>

## Trzy pułapki przy Confidence Score

<div class="fb-pit-grid">
  <div class="fb-pit">
    <div class="fb-pit-n">01</div>
    <div class="fb-pit-title">Modyfikowanie wzoru, gdy wynik się nie podoba</div>
    <div class="fb-pit-text">Modyfikowanie wag i definicji „w locie", tylko po to, by uzyskać optymistyczny wynik dla problematycznego wydania, doszczętnie niszczy całą wiarygodność tego narzędzia. Wzór powinien być stały. Zmiany można wprowadzać w przemyślany sposób raz na kwartał, ale nigdy ad hoc pod konkretne wdrożenie.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">02</div>
    <div class="fb-pit-title">Confidence Score bez dyskwalifikatora dla blokerów</div>
    <div class="fb-pit-text">Rezygnacja z mechanizmu dyskwalifikującego prowadzi do zafałszowania obrazu. Piękny stan regresji potrafi podbić średnią do poziomu 88% nawet przy otwartym blokerze płatności, co daje złudne poczucie bezpieczeństwa. Krytyczny błąd musi twardo obniżać ocenę wdrożenia.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">03</div>
    <div class="fb-pit-title">Traktowanie score jako wyroczni zamiast wsparcia decyzji</div>
    <div class="fb-pit-text">Confidence Score to nie automat ani nieomylna wyrocznia. Narzędzie to ma jedynie wspierać ekspertów, a ostateczna decyzja zawsze powinna uwzględniać ludzką weryfikację. Liczba stanowi mocny punkt oparcia, ale nie zastępuje profesjonalnego osądu QA Leada.</div>
  </div>
</div>

## Confidence Score w rozmowie z biznesem

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„Confidence Score tego releasu to 94%. Zero blokerów, regresja 97%, wszystkie krytyczne ścieżki zielone. Rekomendujemy GO."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Steering - wstrzymanie</span>
    <span class="fb-biz-text">„Jesteśmy na 62%. Mamy dwa otwarte blokery w module płatności i regresję na poziomie 71%. Rekomendujemy wstrzymanie releasu do czasu naprawy blokerów - szacujemy dwa dni robocze."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„Wprowadziliśmy Release Confidence Score jako jednolity wskaźnik decyzyjny. Przez ostatni kwartał jego trafność potwierdziła się w 100% przypadków - każdy release ze score powyżej 90% przeszedł gładko, a oba wstrzymane miały realne problemy. To narzędzie, które obniża ryzyko każdej decyzji o wdrożeniu."</span>
  </div>
</div>

## Dlaczego to najważniejsza metryka serii

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">Confidence Score daje Ci</div>
    <ul class="fb-sum-list">
      <li>Jedną jasną wartość odpowiadającą na pytanie: „czy możemy bezpiecznie wdrażać?"</li>
      <li>Wskaźnik wyprzedzający, który kształtuje ustalenia, zanim zapadną końcowe decyzje</li>
      <li>Transparentny, wspólny język z biznesem na spotkaniach decyzyjnych</li>
      <li>Syntezę pięciu kluczowych metryk serii w jednym, przejrzystym punkcie</li>
      <li>Skuteczną dźwignię do transformacji roli QA z recenzenta na partnera</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">Confidence Score wymaga</div>
    <ul class="fb-sum-list">
      <li>Żelaznej dyscypliny w stosowaniu wzoru - bez modyfikacji ad hoc</li>
      <li>Zastosowania mechanizmu dyskwalifikującego przy obecności blokerów (model 3)</li>
      <li>Wstępnej weryfikacji danych historycznych przed pokazaniem ich biznesowi</li>
      <li>Pozostawienia przestrzeni na ludzki osąd - wskaźnik wspiera, ale nie zastępuje lidera</li>
    </ul>
  </div>
</div>

<div class="fb-quote">Pięć metryk opowiada, co się wydarzyło. Confidence Score mówi, co zrobić teraz. To jest różnica między QA, które raportuje, a QA, które decyduje.</div>

## W następnym artykule

Masz już metryki i znasz strukturę Confidence Score. Ósmy artykuł odpowie na kluczowe pytanie, które decyduje o sukcesie wdrożenia tych zmian: **jak odpowiednio komunikować zebrane liczby, aby biznes uważnie ich słuchał?** Przyjrzymy się storytellingowi z danymi - czyli jak przekształcić suche tabele w angażującą biznesową narrację. Nawet najbardziej precyzyjny wskaźnik straci na wartości, jeśli nie przedstawisz go w sposób bezpośrednio skłaniający do podjęcia właściwej decyzji.

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Kompletny przewodnik</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/pl/blog/defect-detection-ratio-jak-mierzyc-skutecznosc/">Defect Detection Ratio</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-problems-pelne-spektrum/">Escaped Bugs i Problems</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/pl/blog/issues-per-release-miernik-dojrzalosci-kodu/">Issues per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wdrożenie od zera, związek z procesem wytwórczym, rozmowa z EM</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-per-release-znajdz-ryzykowny-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wskazywanie problemów, nie tylko obserwowanie trendów</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">06</span><div><div class="fb-s-title"><a href="/pl/blog/number-of-releases-metryka-kontekstowa/">Number of Releases</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Dlaczego 3 bugi przy 2 releasach to dramat, a przy 15 to sukces</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">07</span><div><div class="fb-s-title">Release Confidence Score <span class="fb-s-now">czytasz teraz</span></div><div class="fb-s-sub">Trzy modele obliczania, wdrożenie, przykłady z praktyki</div></div></li>
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

  function fmt(n, d) { return n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d }); }

  function blockersHint(n) {
    if (n === 0) return 'brak blokerów';
    if (n === 1) return '1 bloker';
    var d = n % 10, t = n % 100;
    if (d >= 2 && d <= 4 && !(t >= 12 && t <= 14)) return n + ' blokery';
    return n + ' blokerów';
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
        verdict = 'GO'; cls = 'score-go'; badgeCls = 'cv-go'; badgeText = 'Wszystkie 3 warunki spełnione';
      } else if (conditions === 2) {
        verdict = 'WARUNKOWO'; cls = 'score-cond'; badgeCls = 'cv-cond'; badgeText = '2 z 3 warunków spełnione';
      } else {
        verdict = 'WSTRZYMANO'; cls = 'score-hold'; badgeCls = 'cv-hold'; badgeText = conditions + ' z 3 warunków - release zablokowany';
      }
      scoreEl.textContent = verdict;
      scoreEl.style.fontSize = verdict === 'WARUNKOWO' ? '2.4rem' : (verdict === 'WSTRZYMANO' ? '2.2rem' : '4rem');
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
      cls2 = 'score-go'; badgeCls2 = 'cv-go'; badgeText2 = 'Rekomendacja: GO';
    } else if (score >= 75) {
      cls2 = 'score-cond'; badgeCls2 = 'cv-cond'; badgeText2 = 'Rekomendacja: WARUNKOWO';
    } else {
      cls2 = 'score-hold'; badgeCls2 = 'cv-hold'; badgeText2 = 'Rekomendacja: WSTRZYMANO';
    }
    scoreEl.className = 'fb-calc-score ' + cls2;
    verdictEl.textContent = badgeText2;
    verdictEl.className = 'fb-calc-verdict ' + badgeCls2;

    breakdownEl.style.display = 'grid';
    var html = '';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Blokery (40%)</span><span class="fb-cb-value">' + blockerScore + ' × 0,40 = ' + fmt(blockerScore * 0.40, 1) + '</span></div>';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Regresja (35%)</span><span class="fb-cb-value">' + regression + ' × 0,35 = ' + fmt(regression * 0.35, 1) + '</span></div>';
    html += '<div class="fb-cb-row"><span class="fb-cb-label">Krytyczne ścieżki (25%)</span><span class="fb-cb-value">' + pathsRaw + ' × 0,25 = ' + fmt(pathsRaw * 0.25, 1) + '</span></div>';
    html += '<div class="fb-cb-row" style="border-top:1px solid rgba(255,255,255,.1);padding-top:8px;margin-top:2px;"><span class="fb-cb-label" style="font-weight:700;color:rgba(255,255,255,.75)">Wynik ważony</span><span class="fb-cb-value" style="color:#fff">' + fmt(weighted, 1) + '%</span></div>';
    if (disqualified) {
      var nDisq = blockers === 1 ? '1 otwarty bloker' : (blockers + ' otwartych blokerów');
      html += '<div class="fb-cb-disq">⚠ Dyskwalifikator aktywny: ' + nDisq + ' → score ograniczony do max 50%</div>';
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
