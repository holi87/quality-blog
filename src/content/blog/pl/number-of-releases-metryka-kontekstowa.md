---
title: "Number of Releases - metryka kontekstowa"
description: "Dlaczego liczba releasów to wspólny mianownik dla wszystkich metryk QA. Jak normalizować, związek z Deployment Frequency (DORA) i czemu 3 bugi przy 2 releasach to dramat, a przy 15 - sukces. Artykuł 6 z 9."
date: 2026-06-23
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 6 z 9</p>

<p class="fb-lead">Wyobraź sobie dwa zespoły. Oba raportują: „W tym kwartale mieliśmy 3 błędy na produkcji". Jeden zasługuje za to na premię, drugi powinien natychmiast zatrzymać dostarczanie i zrobić głęboką retrospektywę. Gdzie tkwi różnica? W liczbie wydań - jedynej metryce, której żaden z nich nie uwzględnił w raporcie.</p>

<div class="fb-vs">
  <div class="fb-vs-panel vs-crisis">
    <div class="fb-vs-big">3</div>
    <div class="fb-vs-label">błędy produkcyjne · 2 wydania</div>
    <div class="fb-vs-detail">Średnio 1,5 błędu na wydanie. Co drugie wdrożenie przynosi klientowi problemy.</div>
    <span class="fb-vs-verdict">Kryzys</span>
  </div>
  <div class="fb-vs-eq">vs</div>
  <div class="fb-vs-panel vs-success">
    <div class="fb-vs-big">3</div>
    <div class="fb-vs-label">błędy produkcyjne · 15 wydań</div>
    <div class="fb-vs-detail">Zaledwie 0,2 błędu na wydanie. Zdecydowana większość releasów przebiega bez najmniejszych problemów.</div>
    <span class="fb-vs-verdict">Sukces</span>
  </div>
</div>

Ta sama liczba bezwzględna potrafi opisywać dwie zupełnie różne rzeczywistości. Właśnie dlatego **Number of Releases to nie jest wskaźnik, który po prostu się prezentuje - to fundament, przez pryzmat którego ocenia się wszystkie inne dane**.

To najczęściej pomijana metryka z pięciu omawianych w tej serii, bo z pozoru wydaje się banalna („Po prostu policz, ile zrobiliśmy wydań"). Jej rola jest jednak kluczowa. Bez niej wskaźniki takie jak DDR, Escaped Bugs czy Issues per Release są tylko suchymi liczbami, pozbawionymi realnej skali.

## Metryka, która nie świeci sama - ale oświetla resztę

Wyobraź sobie pozostałe cztery metryki serii jako satelity. Każda z nich krąży wokół jednego punktu odniesienia - liczby releasów. Bez tego centrum każda z nich dryfuje bez kontekstu.

<div class="fb-dark-box">
  <div class="fb-cd-center">
    <div class="fb-cd-clabel">Wspólny mianownik</div>
    <div class="fb-cd-metric">Number of Releases</div>
    <div class="fb-cd-sub">nadaje skalę każdej z poniższych</div>
  </div>
  <div class="fb-cd-sats">
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Escaped Bugs</div>
      <div class="fb-cd-norm">escaped ÷ releasy<br>= escaped per release</div>
      <div class="fb-cd-arrow">→ realny wpływ na klienta</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Issues per Release</div>
      <div class="fb-cd-norm">issues ÷ releasy<br>= dojrzałość per release</div>
      <div class="fb-cd-arrow">→ porównywalność w czasie</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">DDR</div>
      <div class="fb-cd-norm">kontekst: ile okazji<br>do wykrycia / ucieczki</div>
      <div class="fb-cd-arrow">→ skala procesu</div>
    </div>
    <div class="fb-cd-sat">
      <div class="fb-cd-name">Confidence Score</div>
      <div class="fb-cd-norm">trend przez N releasów<br>= stabilność predykcji</div>
      <div class="fb-cd-arrow">→ powtarzalność</div>
    </div>
  </div>
</div>

<div class="fb-quote">Liczba bezwzględna mówi, ile się wydarzyło. Liczba znormalizowana mówi, czy to dużo. A „czy to dużo" to jedyne pytanie, które naprawdę interesuje biznes.</div>

## Jak normalizować każdą metrykę serii

Normalizacja to po prostu podzielenie liczby bezwzględnej przez liczbę releasów. Ale efekt jest transformacyjny - z liczby, która zmienia się wraz z tempem pracy, robi się wskaźnik jakości niezależny od tego tempa.

<table class="fb-ht fb-ht-plain">
  <thead>
    <tr><th>Metryka</th><th>Bezwzględna</th><th>Znormalizowana</th><th>Co zyskujesz</th></tr>
  </thead>
  <tbody>
    <tr><td>Escaped Bugs</td><td>12 / kwartał</td><td>÷ releasy</td><td>Porównywalność między kwartałami o różnym tempie</td></tr>
    <tr><td>Issues found</td><td>96 / kwartał</td><td>÷ releasy</td><td>Trend dojrzałości kodu niezależny od liczby wdrożeń</td></tr>
    <tr><td>Czas QA</td><td>320h / kwartał</td><td>÷ releasy</td><td>Koszt jakości na jeden release - argument dla budżetu</td></tr>
    <tr><td>Hotfixy</td><td>8 / kwartał</td><td>÷ releasy</td><td>Stabilność procesu releasowego, nie surowa liczba awarii</td></tr>
  </tbody>
</table>

### Konkretny przykład - ten sam zespół, dwa kwartały

Popatrz, jak normalizacja całkowicie odwraca wniosek. Bez niej Q4 wygląda gorzej niż Q3. Z nią - widać wyraźną poprawę.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped bugs - bezwzględnie vs znormalizowane</div>
      <div class="fb-chart-sub">Liczby bezwzględne rosną (więcej releasów). Per release - spadają. Który wniosek jest prawdziwy?</div>
    </div>
    <span class="fb-chart-badge">Q3 vs Q4</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#B03333"></span>Escaped łącznie (szt.)</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#2A7A3E"></span>Escaped per release</span>
  </div>
  <div class="fb-chart-canvas" style="height:240px;"><canvas id="fb-c-norm"></canvas></div>
</div>

**Interpretacja liczb bezwzględnych:** „Liczba błędów produkcyjnych wzrosła z 7 do 12 - nasza jakość spada". **Interpretacja po normalizacji:** „Liczba błędów na wydanie spadła z 1,4 do 0,8. Podwoiliśmy tempo dostarczania, a jakość naszego oprogramowania wyraźnie wzrosła". Drugi wniosek jest prawdziwy. Pierwszy to biznesowa pułapka.

## Number of Releases a Deployment Frequency

Liczba wydań to bardzo bliski krewny najsłynniejszej branżowej metryki tempa dostarczania - **Deployment Frequency** z badań DORA. To pierwsza z czterech kluczowych metryk DevOps i bezpośredni wskaźnik tego, jak często Twoja organizacja realnie dostarcza wartość użytkownikom.

Warto pamiętać, że najnowszy raport DORA odszedł od klasycznego podziału na cztery poziomy na rzecz siedmiu archetypów, ale dane w klasycznym układzie wciąż pozostają świetnym punktem odniesienia. Tylko około 16% zespołów potrafi wdrażać zmiany „na żądanie" (on demand), podczas gdy 24% robi to rzadziej niż raz w miesiącu. Przepaść w dojrzałości jest ogromna.

<div class="fb-thresh-grid">
  <div class="fb-thresh-card tc-great">
    <div class="fb-tc-label">Najwyższy poziom</div>
    <div class="fb-tc-range">On demand</div>
    <div class="fb-tc-desc">Wielokrotnie dziennie, małe partie kodu · ~16% zespołów</div>
  </div>
  <div class="fb-thresh-card tc-good">
    <div class="fb-tc-label">Wysoki</div>
    <div class="fb-tc-range">Dziennie - tygodniowo</div>
    <div class="fb-tc-desc">Co najmniej raz w tygodniu, często częściej</div>
  </div>
  <div class="fb-thresh-card tc-warn">
    <div class="fb-tc-label">Średni</div>
    <div class="fb-tc-range">Tygodniowo - miesięcznie</div>
    <div class="fb-tc-desc">Cykle sprintowe, koniec sprintu co 1-2 tyg.</div>
  </div>
  <div class="fb-thresh-card tc-danger">
    <div class="fb-tc-label">Niski</div>
    <div class="fb-tc-range">Rzadziej niż miesięcznie</div>
    <div class="fb-tc-desc">Duże partie zmian, wysokie ryzyko każdego wdrożenia · ~24% zespołów</div>
  </div>
</div>

Dlaczego to ważne dla QA? Bo **tempo dostarczania i jakość nie są przeciwstawne** - to jeden z najważniejszych wniosków z wieloletnich badań DORA. Najszybsze zespoły są też najbardziej stabilne. Częstsze, mniejsze releasy oznaczają mniejszy promień rażenia każdej zmiany, łatwiejszą diagnozę i szybsze wycofanie (rollback). Liczba releasów to nie tylko mianownik dla Twoich metryk - to sygnał dojrzałości całego procesu.

<div class="fb-quote">Wzrost liczby releasów przy spadającym escaped per release to najsilniejszy dowód, jaki QA może przedstawić: dostarczamy szybciej i bezpieczniej jednocześnie. To dokładnie to, co DORA nazywa cechą najwyższej wydajności.</div>

## Deployment ≠ Release - i dlaczego to zmienia liczenie

Zanim zaczniesz zbierać dane, musisz jasno określić: czy liczysz wdrożenia (deploymenty), czy wydania (releasy)? To nie to samo, co bywa mylące nawet dla doświadczonych zespołów - zwłaszcza tych, które pracują z mechanizmem feature flags.

<div class="fb-cc-grid">
  <div class="fb-cc-panel cc-rate">
    <span class="fb-cc-tag">Deployment</span>
    <div class="fb-cc-title">🚀 Wdrożenie</div>
    <div class="fb-cc-desc">Techniczna czynność. Kod ląduje na środowisku produkcyjnym, ale może być ukryty przed użytkownikiem - np. za wyłączoną flagą.</div>
    <div class="fb-cc-verdict">Przykład: kod nowej funkcji wdrożony, ale flaga wyłączona</div>
  </div>
  <div class="fb-cc-panel cc-per">
    <span class="fb-cc-tag">Release</span>
    <div class="fb-cc-title">🎁 Wydanie</div>
    <div class="fb-cc-desc">Biznesowy moment udostępnienia nowej funkcji użytkownikom. Może nastąpić tygodnie po deploymencie - np. przez samo włączenie flagi dla 100% bazy użytkowników.</div>
    <div class="fb-cc-verdict ok">Przykład: włączenie flagi dla 100% użytkowników</div>
  </div>
</div>

Dla metryk QA tej serii **liczymy to, co dociera do użytkownika**, czyli releasy w sensie biznesowym. Escaped bug to problem, który odczuł klient - więc mianownikiem musi być liczba momentów, w których cokolwiek mogło do klienta trafić. Jeśli Twój zespół oddziela deployment od release przez feature flags, ustal jasno: czy escaped bug liczony jest od momentu wdrożenia kodu, czy od włączenia flagi? Spójność tej definicji jest kluczowa - podobnie jak przy escaped bugs w artykule 3.

## Kalkulator normalizacji

Wpisz liczby bezwzględne i liczbę releasów - kalkulator pokaże znormalizowane wartości z oceną dla każdej metryki.

<div class="fb-det-wrap">
  <div class="fb-det-title">Normalizator metryk QA</div>
  <div class="fb-det-sub">Zobacz, jak liczba releasów zmienia interpretację Twoich danych</div>
  <div class="fb-norm-inputs">
    <div class="fb-det-field"><label>Liczba releasów w okresie</label><input type="number" id="fb-n-releases" value="10" min="1"></div>
    <div class="fb-det-field"><label>Escaped bugs (łącznie)</label><input type="number" id="fb-n-escaped" value="6" min="0"></div>
    <div class="fb-det-field"><label>Issues found (łącznie)</label><input type="number" id="fb-n-issues" value="80" min="0"></div>
    <div class="fb-det-field"><label>Czas QA w godzinach (łącznie)</label><input type="number" id="fb-n-qatime" value="240" min="0"></div>
  </div>
  <div class="fb-no-out">
    <div class="fb-no-card">
      <div class="fb-no-label">Escaped / release</div>
      <div class="fb-no-val" id="fb-no-escaped">0,60</div>
      <div class="fb-no-verdict nv-good" id="fb-nv-escaped">Dobry</div>
    </div>
    <div class="fb-no-card">
      <div class="fb-no-label">Issues / release</div>
      <div class="fb-no-val" id="fb-no-issues">8,0</div>
      <div class="fb-no-verdict nv-warn" id="fb-nv-issues">Do poprawy</div>
    </div>
    <div class="fb-no-card">
      <div class="fb-no-label">Czas QA / release</div>
      <div class="fb-no-val" id="fb-no-qatime">24h</div>
      <div class="fb-no-verdict nv-good">Koszt jakości</div>
    </div>
  </div>
</div>

## Jak zacząć liczyć - i robić to dobrze

To najprostsza w zbieraniu metryka z całej serii - ale ma kilka pułapek definicyjnych, które warto rozstrzygnąć od początku.

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Ustal, co liczysz jako „release"</div>
      <div class="fb-step-text">Deployment czy udostępnienie użytkownikowi? Hotfix - czy liczy się jako osobny release? Wycofanie i ponowny deploy - jeden release czy dwa? Zapisz definicję i trzymaj się jej. Dla metryk jakości rekomenduję liczyć to, co dociera do użytkownika.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Wyciągnij dane z tego, co już masz</div>
      <div class="fb-step-text">Git tags, historia CI/CD (Jenkins, GitHub Actions, GitLab), changelog, lista wersji w Jirze. Liczba releasów to jedna z najłatwiej dostępnych danych w całej serii - zwykle wystarczy policzyć tagi produkcyjne.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Dodaj liczbę releasów jako kontekst do KAŻDEGO raportu</div>
      <div class="fb-step-text">To jest sedno. Nigdy nie raportuj escaped bugs, issues czy DDR bez liczby releasów obok. Jedno zdanie - „przy 10 releasach w tym kwartale" - zmienia interpretację każdej innej liczby.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Normalizuj wszystkie pozostałe metryki - i pokazuj oba widoki</div>
      <div class="fb-step-text">Pokazuj zarówno liczbę bezwzględną, jak i znormalizowaną. Bezwzględna mówi o skali pracy, znormalizowana o jakości. Razem dają pełny obraz - i chronią przed błędnymi wnioskami w obie strony.</div>
    </div>
  </div>
</div>

## Trzy pułapki przy używaniu liczby releasów

<div class="fb-pit-grid">
  <div class="fb-pit">
    <div class="fb-pit-n">01</div>
    <div class="fb-pit-title">Liczba releasów jako cel sama w sobie</div>
    <div class="fb-pit-text">Więcej releasów nie jest celem - jest środkiem. Jeśli zespół zacznie sztucznie dzielić jeden release na pięć, żeby „poprawić" znormalizowane metryki, to oszukiwanie systemu. Liczba releasów ma odzwierciedlać realny rytm dostarczania wartości, nie być optymalizowana pod ładniejsze wykresy.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">02</div>
    <div class="fb-pit-title">Porównywanie zespołów o różnym modelu dostarczania</div>
    <div class="fb-pit-text">Zespół deployujący on demand i zespół releasujący raz na sprint to dwa różne światy. Znormalizowane metryki pomagają, ale nie wymazują różnic kontekstowych - regulacje, typ produktu, architektura. Używaj normalizacji do porównań w czasie dla jednego zespołu, nie do rankingowania zespołów między sobą.</div>
  </div>
  <div class="fb-pit">
    <div class="fb-pit-n">03</div>
    <div class="fb-pit-title">Ignorowanie wielkości releasów</div>
    <div class="fb-pit-text">10 małych releasów to nie to samo co 10 dużych. Sama liczba nie uwzględnia rozmiaru. Dla precyzyjniejszej normalizacji rozważ wagę przez story points lub liczbę zmian - szczególnie gdy releasy mocno różnią się skalą. Liczba releasów to dobry mianownik domyślny, ale nie idealny dla wszystkich przypadków.</div>
  </div>
</div>

## Liczba releasów w rozmowie z biznesem

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint Review</span>
    <span class="fb-biz-text">„W tym kwartale zrealizowaliśmy 12 wydań - o 4 więcej niż w poprzednim. Pomimo tak dużego wzrostu tempa, wskaźnik błędów na wydanie spadł z 1,0 do 0,5. Dostarczamy szybciej i bezpieczniej."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 z EM</span>
    <span class="fb-biz-text">„Bezwzględna liczba błędów na produkcji wzrosła, bo podwoiliśmy liczbę wydań. Jednak gdy spojrzymy na wskaźnik per release, nasza jakość znacząco się poprawiła. Osiągamy dokładnie to, co badania DORA określają mianem najwyższej wydajności: tempo i stabilność rosną jednocześnie."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„Zwiększyliśmy częstotliwość wdrożeń z 3 do 12 wydań na kwartał, awansując do wyższej ligi według benchmarków DORA. Co ważniejsze, usterkowość wydań spadła o połowę. Szybciej dostarczamy wartość biznesową, drastycznie obniżając ryzyko."</span>
  </div>
</div>

## Dlaczego ta „banalna" metryka jest fundamentem

<div class="fb-sum-two">
  <div class="fb-sum-card sum-yes">
    <div class="fb-sum-title">Number of Releases daje Ci</div>
    <ul class="fb-sum-list">
      <li>Wspólny mianownik dla wszystkich pozostałych metryk serii</li>
      <li>Ochronę przed błędnymi wnioskami z liczb bezwzględnych</li>
      <li>Porównywalność między kwartałami o różnym tempie</li>
      <li>Most do Deployment Frequency - języka DORA i zarządu</li>
      <li>Dowód, że tempo i jakość mogą rosnąć jednocześnie</li>
    </ul>
  </div>
  <div class="fb-sum-card sum-no">
    <div class="fb-sum-title">Number of Releases nie jest</div>
    <ul class="fb-sum-list">
      <li>Celem samym w sobie - więcej nie zawsze znaczy lepiej</li>
      <li>Miarą wielkości releasów (sama liczba ignoruje skalę)</li>
      <li>Narzędziem do rankingowania różnych zespołów</li>
      <li>Wystarczająca samodzielnie - świeci tylko z innymi metrykami</li>
    </ul>
  </div>
</div>

<div class="fb-quote">Number of Releases to metryka, której się nie prezentuje - to metryka, przez którą prezentuje się wszystkie inne. Najcichszy bohater całej serii.</div>

## W następnym artykule

Pięć metryk za nami. Artykuł siódmy łączy je wszystkie w jeden wskaźnik decyzyjny - **Release Confidence Score**. Trzy modele obliczania, od prostego traffic light po model ważony, krok po kroku wdrożenie i przykłady z praktyki. To moment, w którym cała seria zaczyna działać jako system - pojedyncza liczba, która odpowiada na najważniejsze pytanie biznesu: czy możemy releasować?

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Kompletny przewodnik</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/pl/blog/defect-detection-ratio-jak-mierzyc-skutecznosc/">Defect Detection Ratio</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-problems-pelne-spektrum/">Escaped Bugs i Problems</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/pl/blog/issues-per-release-miernik-dojrzalosci-kodu/">Issues per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wdrożenie od zera, związek z procesem wytwórczym, rozmowa z EM</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-per-release-znajdz-ryzykowny-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wskazywanie problemów, nie tylko obserwowanie trendów</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">06</span><div><div class="fb-s-title">Number of Releases <span class="fb-s-now">czytasz teraz</span></div><div class="fb-s-sub">Metryka kontekstowa, normalizacja, związek z Deployment Frequency</div></div></li>
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

/* HT TABLE */
.fb-ht { width: 100%; border-collapse: collapse; font-size: 13px; margin: 20px 0; }
.fb-ht th { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fb-muted); padding: 10px 14px; text-align: center; background: var(--fb-surface); border-bottom: 2px solid var(--fb-border); }
.fb-ht th:first-child { text-align: left; }
.fb-ht td { padding: 11px 14px; border-bottom: 1px solid var(--fb-border); text-align: center; font-size: 13px; }
.fb-ht td:first-child { text-align: left; font-weight: 600; color: #111; }
.fb-ht tr:last-child td { border-bottom: none; font-weight: 700; background: var(--fb-surface); }
.fb-ht.fb-ht-plain th:last-child, .fb-ht.fb-ht-plain td:last-child { text-align: left; }
.fb-ht.fb-ht-plain tr:last-child td { font-weight: 400; background: transparent; }
.fb-ht.fb-ht-plain td:first-child { font-weight: 600; }

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

/* DARK BOX + CONTEXT DIAGRAM */
.fb-dark-box { background: var(--fb-navy); border-radius: 16px; padding: 32px 30px; margin: 32px 0; }
.fb-cd-center { text-align: center; margin-bottom: 22px; }
.fb-cd-clabel { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fb-gold); margin-bottom: 8px; }
.fb-cd-metric { font-family: Georgia, serif; font-size: 1.5rem; font-weight: 500; color: #fff; }
.fb-cd-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }
.fb-cd-sats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
@media (max-width: 500px) { .fb-cd-sats { grid-template-columns: 1fr; } }
.fb-cd-sat { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 18px; }
.fb-cd-name { font-size: 12px; font-weight: 700; color: #fff; margin-bottom: 5px; }
.fb-cd-norm { font-family: 'Courier New', monospace; font-size: 11px; color: #93C5FD; line-height: 1.5; }
.fb-cd-arrow { font-size: 11px; color: var(--fb-gold); margin-top: 6px; }

/* VERSUS */
.fb-vs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; margin: 26px 0; }
@media (max-width: 560px) { .fb-vs { grid-template-columns: 1fr; } }
.fb-vs-panel { border-radius: 12px; padding: 22px; text-align: center; border: 2px solid; }
.fb-vs-panel.vs-crisis { background: #FEF2F2; border-color: #FECACA; }
.fb-vs-panel.vs-success { background: #F0FDF4; border-color: #BBF7D0; }
.fb-vs-big { font-family: Georgia, serif; font-size: 2.6rem; font-weight: 500; line-height: 1; margin-bottom: 4px; }
.vs-crisis .fb-vs-big { color: var(--fb-red); }
.vs-success .fb-vs-big { color: var(--fb-green); }
.fb-vs-label { font-size: 11px; color: var(--fb-muted); margin-bottom: 12px; }
.fb-vs-detail { font-size: 13px; color: #111; line-height: 1.5; }
.fb-vs-verdict { margin-top: 12px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 5px 12px; border-radius: 20px; display: inline-block; }
.vs-crisis .fb-vs-verdict { background: var(--fb-red); color: #fff; }
.vs-success .fb-vs-verdict { background: var(--fb-green); color: #fff; }
.fb-vs-eq { font-family: Georgia, serif; font-size: 1.4rem; color: var(--fb-faint); text-align: center; }
@media (max-width: 560px) { .fb-vs-eq { transform: rotate(90deg); } }

/* DORA TIERS (thresh cards) */
.fb-thresh-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 22px 0; }
.fb-thresh-card { border-radius: 12px; padding: 16px; text-align: center; border: 1.5px solid; }
.fb-thresh-card.tc-danger { background: #FEF2F2; border-color: #FECACA; }
.fb-thresh-card.tc-warn { background: #FFFBEB; border-color: #FDE68A; }
.fb-thresh-card.tc-good { background: var(--fb-teal-pale); border-color: #99E6EA; }
.fb-thresh-card.tc-great { background: #F0FDF4; border-color: #BBF7D0; }
.fb-tc-range { font-family: Georgia, serif; font-size: 1.2rem; font-weight: 500; line-height: 1.2; margin-bottom: 6px; }
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

/* DEPLOY VS RELEASE (compare panels) */
.fb-cc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 24px 0; }
@media (max-width: 560px) { .fb-cc-grid { grid-template-columns: 1fr; } }
.fb-cc-panel { border-radius: 12px; padding: 22px; border: 2px solid; }
.fb-cc-panel.cc-rate { border-color: var(--fb-border); background: var(--fb-surface); }
.fb-cc-panel.cc-per { border-color: var(--fb-navy); background: #EFF6FF; }
.fb-cc-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; display: inline-block; margin-bottom: 14px; }
.cc-rate .fb-cc-tag { background: #E5E1D8; color: #4a4a4a; }
.cc-per .fb-cc-tag { background: var(--fb-navy); color: #fff; }
.fb-cc-title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 6px; }
.fb-cc-desc { font-size: 13px; color: var(--fb-muted); line-height: 1.55; }
.fb-cc-verdict { margin-top: 12px; padding: 10px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5; background: #E5E1D8; color: #4a4a4a; font-style: italic; }
.fb-cc-verdict.ok { background: rgba(14,31,61,0.08); color: var(--fb-navy); }

/* NORMALIZER */
.fb-det-wrap { background: var(--fb-surface); border: 1px solid var(--fb-border); border-radius: 12px; padding: 28px; margin: 28px 0; }
.fb-det-title { font-family: Georgia, serif; font-size: 18px; font-weight: 500; margin-bottom: 6px; color: #111; }
.fb-det-sub { font-size: 13px; color: var(--fb-faint); margin-bottom: 22px; }
.fb-norm-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
@media (max-width: 480px) { .fb-norm-inputs { grid-template-columns: 1fr; } }
.fb-det-field label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); display: block; margin-bottom: 6px; }
.fb-det-field input { width: 100%; border: 1px solid var(--fb-border); border-radius: 8px; padding: 11px 14px; font-size: 16px; font-weight: 700; font-family: Georgia, serif; color: #111; background: #fff; outline: none; transition: border-color 0.2s; }
.fb-det-field input:focus { border-color: var(--fb-gold); }
.fb-no-out { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 480px) { .fb-no-out { grid-template-columns: 1fr; } }
.fb-no-card { background: #fff; border: 1px solid var(--fb-border); border-radius: 10px; padding: 18px 14px; text-align: center; }
.fb-no-label { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fb-faint); margin-bottom: 6px; }
.fb-no-val { font-family: Georgia, serif; font-size: 1.7rem; font-weight: 500; color: var(--fb-navy); line-height: 1; }
.fb-no-verdict { font-size: 11px; font-weight: 700; margin-top: 8px; padding: 4px 10px; border-radius: 20px; display: inline-block; }
.fb-no-verdict.nv-elite { background: #F0FDF4; color: var(--fb-green); }
.fb-no-verdict.nv-good { background: var(--fb-teal-pale); color: var(--fb-teal); }
.fb-no-verdict.nv-warn { background: #FFFBEB; color: var(--fb-amber); }
.fb-no-verdict.nv-bad { background: #FEF2F2; color: var(--fb-red); }

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
:root[data-theme="dark"] .fb-article .fb-chart-card,
:root[data-theme="dark"] .fb-article .fb-det-wrap,
:root[data-theme="dark"] .fb-article .fb-biz-q,
:root[data-theme="dark"] .fb-article .fb-series,
:root[data-theme="dark"] .fb-article .fb-quote { background: rgba(255,255,255,0.04); }
:root[data-theme="dark"] .fb-article .fb-chart-title,
:root[data-theme="dark"] .fb-article .fb-step-title,
:root[data-theme="dark"] .fb-article .fb-biz-text,
:root[data-theme="dark"] .fb-article .fb-det-title,
:root[data-theme="dark"] .fb-article .fb-cc-title,
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-det-sub,
:root[data-theme="dark"] .fb-article .fb-det-field label,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-cc-desc,
:root[data-theme="dark"] .fb-article .fb-s-sub { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-ht th { background: rgba(255,255,255,0.06); color: #c9c9c9; border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-ht td { border-color: rgba(255,255,255,0.1); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-ht td:first-child { color: #fff; }
:root[data-theme="dark"] .fb-article .fb-ht.fb-ht-plain tr:last-child td { background: transparent; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn { background: rgba(180,83,9,0.15); border-color: rgba(253,230,138,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good { background: rgba(10,107,111,0.2); border-color: rgba(95,200,204,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.4); }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-danger .fb-tc-label { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-warn .fb-tc-label { color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-good .fb-tc-label { color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-range, :root[data-theme="dark"] .fb-article .fb-thresh-card.tc-great .fb-tc-label { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-tc-desc { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-rate { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.15); }
:root[data-theme="dark"] .fb-article .fb-cc-panel.cc-per { background: rgba(147,197,253,0.08); border-color: #93C5FD; }
:root[data-theme="dark"] .fb-article .cc-rate .fb-cc-tag { background: rgba(255,255,255,0.12); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict { background: rgba(255,255,255,0.08); color: #d5d5d5; }
:root[data-theme="dark"] .fb-article .fb-cc-verdict.ok { background: rgba(147,197,253,0.12); color: #BFDBFE; }
:root[data-theme="dark"] .fb-article .fb-vs-panel.vs-crisis { background: rgba(176,51,51,0.15); border-color: rgba(252,165,165,0.35); }
:root[data-theme="dark"] .fb-article .fb-vs-panel.vs-success { background: rgba(42,122,62,0.15); border-color: rgba(110,231,183,0.35); }
:root[data-theme="dark"] .fb-article .vs-crisis .fb-vs-big { color: #FCA5A5; }
:root[data-theme="dark"] .fb-article .vs-success .fb-vs-big { color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-vs-detail { color: #e5e5e5; }
:root[data-theme="dark"] .fb-article .fb-vs-label { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-det-field input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.2); }
:root[data-theme="dark"] .fb-article .fb-no-card { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
:root[data-theme="dark"] .fb-article .fb-no-label { color: #b5b5b5; }
:root[data-theme="dark"] .fb-article .fb-no-val { color: #9DB4D6; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-elite { background: rgba(42,122,62,0.25); color: #6EE7B7; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-good { background: rgba(10,107,111,0.25); color: #5FC8CC; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-warn { background: rgba(180,83,9,0.25); color: #FCD34D; }
:root[data-theme="dark"] .fb-article .fb-no-verdict.nv-bad { background: rgba(176,51,51,0.25); color: #FCA5A5; }
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
  function mount(el, cfg) { if (!el) return; var prev = Chart.getChart(el); if (prev) prev.destroy(); new Chart(el, cfg); }
  function initChart() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#888';
    var grid = 'rgba(128,128,128,0.15)';
    mount(document.getElementById('fb-c-norm'), {
      type: 'bar',
      data: {
        labels: ['Q3 (5 releasów)', 'Q4 (15 releasów)'],
        datasets: [
          { label: 'Escaped łącznie', data: [7, 12], backgroundColor: 'rgba(176,51,51,0.78)', borderRadius: 6, borderSkipped: false, yAxisID: 'y', order: 2 },
          { label: 'Escaped per release', data: [1.4, 0.8], type: 'line', borderColor: '#2A7A3E', backgroundColor: 'rgba(42,122,62,0.1)', borderWidth: 3, pointBackgroundColor: '#2A7A3E', pointRadius: 7, pointHoverRadius: 9, fill: false, tension: 0, yAxisID: 'y1', order: 1 }
        ]
      },
      options: {
        locale: 'pl-PL',
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) {
            if (c.dataset.label === 'Escaped per release') return '  Per release: ' + c.raw;
            return '  Łącznie: ' + c.raw + ' bugów';
          } } }
        },
        scales: {
          y: { min: 0, max: 16, grid: { color: grid }, border: { display: false }, title: { display: true, text: 'Escaped łącznie', font: { size: 10 }, color: '#B03333' } },
          y1: { position: 'right', min: 0, max: 2, grid: { drawOnChartArea: false }, border: { display: false }, title: { display: true, text: 'Per release', font: { size: 10 }, color: '#2A7A3E' } },
          x: { grid: { display: false }, border: { display: false } }
        }
      }
    });
  }
  function initNormalizer() {
    var ids = ['fb-n-releases', 'fb-n-escaped', 'fb-n-issues', 'fb-n-qatime'];
    var inputs = ids.map(function (i) { return document.getElementById(i); });
    if (inputs.some(function (x) { return !x; })) return;
    function setText(id, t) { var e = document.getElementById(id); if (e) e.textContent = t; }
    function setVerdict(id, t, cls) { var e = document.getElementById(id); if (e) { e.textContent = t; e.className = 'fb-no-verdict ' + cls; } }
    function escV(v) { if (v < 0.5) return ['Elite', 'nv-elite']; if (v < 1.5) return ['Dobry', 'nv-good']; if (v <= 3) return ['Uwaga', 'nv-warn']; return ['Alarm', 'nv-bad']; }
    function issV(v) { if (v < 3) return ['Dojrzały', 'nv-elite']; if (v < 6) return ['Solidny', 'nv-good']; if (v <= 12) return ['Do poprawy', 'nv-warn']; return ['Alarm', 'nv-bad']; }
    function fmt(n, d) { return n.toLocaleString('pl-PL', { minimumFractionDigits: d, maximumFractionDigits: d }); }
    function update() {
      var rel = parseFloat(inputs[0].value) || 1;
      var esc = parseFloat(inputs[1].value) || 0;
      var iss = parseFloat(inputs[2].value) || 0;
      var qa = parseFloat(inputs[3].value) || 0;
      var ep = esc / rel, ip = iss / rel, qp = qa / rel;
      setText('fb-no-escaped', fmt(ep, 2));
      setText('fb-no-issues', fmt(ip, 1));
      setText('fb-no-qatime', Math.round(qp) + 'h');
      var e = escV(ep); setVerdict('fb-nv-escaped', e[0], e[1]);
      var i = issV(ip); setVerdict('fb-nv-issues', i[0], i[1]);
    }
    inputs.forEach(function (inp) { inp.addEventListener('input', update); });
    update();
  }
  function boot() { ensureChart(initChart); initNormalizer(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
</script>
