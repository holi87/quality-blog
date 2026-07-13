---
title: "3 antywzorce, które niszczą wiarygodność QA"
description: "Finał serii. Przeładowane dashboardy, liczby bez kontekstu i żargon w rozmowie z biznesem. Trzy grzechy raportowania jakości, wszystkie przećwiczone osobiście, oraz sposób na każdy z nich. Artykuł 9 z 9."
date: 2026-07-14
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 9 z 9 · Finał</p>

<p class="fb-lead">Ten artykuł mogłem napisać tylko dlatego, że sam popełniłem każdy z opisanych tu błędów. Mój pierwszy dashboard dla zarządu miał dwadzieścia trzy wykresy i byłem z niego naprawdę dumny. Prezes poświęcił mu jakieś dziewięć sekund.</p>

Przez osiem artykułów budowaliśmy warsztat: pięć metryk, wskaźnik decyzyjny, narrację. Zostało ostatnie pytanie, czyli co potrafi to wszystko zepsuć. Odpowiedź jest krótka. Trzy nawyki, które wyglądają niewinnie, a każdy z nich po cichu podkopuje zaufanie do zespołu jakości. Znam je dobrze, bo latami hodowałem wszystkie trzy naraz.

Dobra wiadomość jest taka, że żaden z nich nie wynika ze złej woli ani z braku kompetencji. Wszystkie biorą się z nadmiaru dobrych chęci. I właśnie dlatego tak łatwo w nie wpaść.

## Antywzorzec 1: raport, który pokazuje wszystko

<p class="fb-ap-alias">czyli dashboard z dwudziestoma trzema wykresami</p>

Logika wydaje się żelazna. Skoro zbieramy tyle danych, pokażmy je. Więcej wykresów znaczy więcej pracy, więcej pracy znaczy więcej wiarygodności. Tak myślałem, przygotowując tamten dashboard (tablicę wskaźników), i tak myśli większość zespołów QA na pewnym etapie dojrzewania.

Uwaga słuchacza działa jednak jak budżet, nie jak studnia. Każdy kolejny wykres wydaje część tego budżetu i pomniejsza to, co zostaje dla pozostałych. Przy sześciu wskaźnikach sala jeszcze nadąża. Przy dwunastu zaczyna wybierać losowo, na co patrzeć. Przy dwudziestu trzech poddaje się po cichu i czeka na kolejny punkt agendy. Nikt tego nie powie głośno, bo wypada docenić włożoną pracę.

<div class="fb-dash-cmp">
  <div class="fb-dash fb-dash-messy">
    <span class="fb-dash-tag">Tak to wyglądało</span>
    <div class="fb-mini-grid">
      <div class="fb-mini-box">▁▃▅</div><div class="fb-mini-box">◔</div><div class="fb-mini-box">▂▆▂</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▅▃▇</div><div class="fb-mini-box">◑</div><div class="fb-mini-box">▁▁▆</div><div class="fb-mini-box">#</div>
      <div class="fb-mini-box">▃▂▄</div><div class="fb-mini-box">◕</div><div class="fb-mini-box">▇▅▃</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▆▄▂</div><div class="fb-mini-box">◒</div><div class="fb-mini-box">▄▇▅</div><div class="fb-mini-box">#</div>
      <div class="fb-mini-box">▂▅▇</div><div class="fb-mini-box">◐</div><div class="fb-mini-box">▅▂▁</div><div class="fb-mini-box">%</div>
      <div class="fb-mini-box">▇▂▄</div><div class="fb-mini-box">◓</div><div class="fb-mini-box">▃▆▄</div>
    </div>
    <div class="fb-dash-verdict">23 wykresy. Czas uwagi prezesa: około 9 sekund. Pytań: zero.</div>
  </div>
  <div class="fb-dash fb-dash-clean">
    <span class="fb-dash-tag">Tak to wygląda dziś</span>
    <div class="fb-clean-score">
      <div class="fb-cs-v">91%</div>
      <div class="fb-cs-l">Confidence Score · GO</div>
    </div>
    <div class="fb-clean-grid">
      <div class="fb-clean-box"><div class="fb-cb-v">94%</div><div class="fb-cb-l">DDR</div></div>
      <div class="fb-clean-box"><div class="fb-cb-v">0,4</div><div class="fb-cb-l">Escaped / wyd.</div></div>
      <div class="fb-clean-box"><div class="fb-cb-v">12</div><div class="fb-cb-l">Wydania</div></div>
    </div>
    <div class="fb-dash-verdict">Jeden wskaźnik decyzyjny, trzy liczby wspierające. Reszta w załączniku, na wypadek pytań. Pytania padają na każdym spotkaniu.</div>
  </div>
</div>

<div class="fb-signs">
  <div class="fb-signs-title">Po czym poznasz, że to Twój problem</div>
  <ul>
    <li>Po prezentacji nikt nie zadaje żadnego pytania. Cisza bywa uprzejmą formą zagubienia.</li>
    <li>Ktoś regularnie pyta „dobra, ale co z tego wynika", mimo że wszystko przecież pokazałeś.</li>
    <li>Dashboard jest sumiennie aktualizowany co sprint, a statystyki odwiedzin pokazują trzy wejścia. Wszystkie Twoje.</li>
  </ul>
</div>

Wyjście z tego nawyku boli, bo wymaga wyrzucenia rzeczy, nad którymi się napracowałeś. Zasada, która u mnie zadziałała: jeden slajd, jeden wskaźnik decyzyjny, maksymalnie cztery liczby wspierające. Cała reszta ląduje w załączniku i czeka na pytania. Paradoks polega na tym, że odkąd pokazuję mniej, ludzie pytają o więcej.

## Antywzorzec 2: liczba, która chodzi sama

<p class="fb-ap-alias">czyli 94% bez odpowiedzi na pytanie „to dobrze?"</p>

Scena z życia. Sprint review, na slajdzie „DDR: 87%", w sali dwanaście osób. Ktoś z biznesu podnosi rękę i pyta, czy to dobry wynik. No właśnie. Osiemdziesiąt siedem procent czego względem czego? Bez punktu odniesienia ta liczba jest szumem, który brzmi jak informacja.

Słuchacz pozbawiony kontekstu zrobi jedną z dwóch rzeczy. Albo dopowie sobie własną interpretację, zwykle błędną, albo przestanie słuchać. Obie opcje pracują przeciwko Tobie. Najgorsze jest to, że nadawca zwykle nie widzi problemu, bo sam kontekst ma w głowie. Wie, że kwartał temu było 74%. Tylko zapomniał, że wie to wyłącznie on.

Zamiast tłumaczyć dalej, po prostu sprawdź to na sobie. Trzy prawdziwe liczby, trzy szybkie decyzje.

<div class="fb-quiz">
  <div class="fb-q-title">Dobra czy zła? Oceń bez kontekstu</div>
  <div class="fb-q-sub">Kliknij odpowiedź przy każdej liczbie. Zasada jest jedna: odpowiadasz od razu, tak jak słuchacz na spotkaniu.</div>
  <div class="fb-q-card">
    <div class="fb-q-number">Pass rate regresji: 94%</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Dobra</button>
      <button class="fb-q-btn" type="button">Zła</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">Pytanie było podchwytliwe. Uczciwa odpowiedź brzmi: nie wiem.</div>
      <div class="fb-q-context">Kontekst: trzy poprzednie wydania miały 99%, 98% i 97%. To czwarty spadek z rzędu. Sama wartość wygląda solidnie, kierunek mówi co innego.</div>
      <span class="fb-q-verdict fb-qv-bad">Z kontekstem: sygnał ostrzegawczy</span>
    </div>
  </div>
  <div class="fb-q-card">
    <div class="fb-q-number">12 błędów produkcyjnych w kwartale</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Dobra</button>
      <button class="fb-q-btn" type="button">Zła</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">Znowu podchwytliwe. Dwanaście, ale na ile wydań?</div>
      <div class="fb-q-context">Kontekst: zespół wypuścił w tym czasie 40 wydań. Wychodzi 0,3 błędu na wydanie, wynik z okolic najwyższej półki. Ta sama dwunastka przy 4 wydaniach byłaby alarmem.</div>
      <span class="fb-q-verdict fb-qv-good">Z kontekstem: bardzo dobry wynik</span>
    </div>
  </div>
  <div class="fb-q-card">
    <div class="fb-q-number">DDR: 76%</div>
    <div class="fb-q-btns">
      <button class="fb-q-btn" type="button">Dobra</button>
      <button class="fb-q-btn" type="button">Zła</button>
    </div>
    <div class="fb-q-reveal">
      <div class="fb-q-trick">Ostatni raz: bez kontekstu każda odpowiedź to zgadywanie.</div>
      <div class="fb-q-context">Kontekst: rok temu ten zespół miał 58%, pół roku temu 67%. Kilkanaście punktów systematycznego wzrostu. Wartość poniżej podręcznikowego ideału, kierunek wzorowy.</div>
      <span class="fb-q-verdict fb-qv-good">Z kontekstem: droga we właściwą stronę</span>
    </div>
  </div>
</div>

Lekarstwo jest tanie. Każda liczba wychodzi na spotkanie z jednym z trzech towarzyszy: trendem (jak było wcześniej), punktem odniesienia (benchmark, cel, inna miara) albo mianownikiem (na wydanie, na sprint, zgodnie z artykułem szóstym). Jedno dodatkowe zdanie na slajdzie. Tyle kosztuje różnica między informacją a szumem.

## Antywzorzec 3: klątwa wiedzy

<p class="fb-ap-alias">czyli flaky testy, race condition i twarz Product Ownera</p>

Kiedyś na statusie z biznesem powiedziałem zdanie, które do dziś pamiętam: „Regresja się sypie, bo mamy flaky testy przez race condition na CI, a coverage dropnął po refactorze". Product Owner pokiwał głową. Po spotkaniu podszedł i zapytał, czy to znaczy, że będzie opóźnienie. Nic więcej z mojej wypowiedzi nie dotarło.

Psychologia nazywa to klątwą wiedzy. Gdy coś wiemy, tracimy zdolność wyobrażenia sobie, jak to jest nie wiedzieć. Skróty naszego świata wydają się oczywiste, więc mówimy nimi także do ludzi spoza tego świata. Słuchacz z grzeczności kiwa głową, a w środku podejmuje decyzję, żeby następnym razem zapytać kogoś innego. Tak po cichu umiera pozycja doradcy.

Poniżej pięć zdań, które naprawdę padły na spotkaniach. Kliknij każde z nich, żeby zobaczyć wersję, która dociera.

<div class="fb-jargon-list">
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">kliknij</span>
    <div class="fb-j-tech">„Mamy flaky testy w regresji."</div>
    <div class="fb-j-human">„Część testów raz przechodzi, raz nie, chociaż kod się nie zmienił. Dopóki tego nie uporządkujemy, wynikom nie można w pełni ufać. Pracujemy nad tym, termin: koniec sprintu."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">kliknij</span>
    <div class="fb-j-tech">„Coverage dropnął do 78% po refactorze."</div>
    <div class="fb-j-human">„Automaty sprawdzają dziś 78 na 100 ścieżek w aplikacji. Po ostatniej przebudowie kodu 22 ścieżki zostały chwilowo bez ochrony. Uzupełniamy je w pierwszej kolejności tam, gdzie chodzi o płatności."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">kliknij</span>
    <div class="fb-j-tech">„Bloker przez race condition na CI."</div>
    <div class="fb-j-human">„Dwa procesy w systemie budowania ścigają się o ten sam zasób i wynik zależy od przypadku. Do czasu naprawy nie możemy wiarygodnie testować, dlatego wstrzymaliśmy wydanie."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">kliknij</span>
    <div class="fb-j-tech">„Env stagingowy leżał pół sprintu."</div>
    <div class="fb-j-human">„Środowisko, na którym sprawdzamy zmiany przed produkcją, nie działało przez tydzień. Przez ten czas testy stały. Stąd opóźnienie i stąd prośba o priorytet dla stabilności tego środowiska."</div>
  </div>
  <div class="fb-jargon" role="button" tabindex="0">
    <span class="fb-j-hint">kliknij</span>
    <div class="fb-j-tech">„Puściliśmy smoke'i po deployu, wszystko zielone."</div>
    <div class="fb-j-human">„Zaraz po wdrożeniu sprawdziliśmy najważniejsze funkcje. Logowanie, płatności i główny proces zakupowy działają prawidłowo."</div>
  </div>
</div>

Zwróć uwagę, co łączy wersje ukryte pod każdym zdaniem. Żadna nie tłumaczy mechanizmu. Wszystkie tłumaczą skutek i mówią, co dalej. Biznesu nie interesuje, jak działa race condition (wyścig procesów). Interesuje go, czy wydanie wyjdzie w piątek i czy klient coś odczuje. Odpowiadaj na to pytanie, a technikalia zostaw na rozmowy z inżynierami, gdzie są na swoim miejscu.

<div class="fb-quote">Prosty test przed każdym spotkaniem: czy zrozumiałaby to moja babcia albo prezes, zależnie od tego, kto budzi większy respekt. Jeśli nie, zdanie wraca do przepisania.</div>

## Autodiagnoza: sprawdź się, zanim zrobi to za Ciebie sala

Sześć pytań, po dwa na każdy antywzorzec. Zaznacz te, które brzmią znajomo. Bez oszukiwania, nikt nie patrzy.

<div class="fb-check">
  <div class="fb-c-title">Ile antywzorców hodujesz?</div>
  <div class="fb-c-sub">Kliknij każde zdanie, które pasuje do Twoich raportów</div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Mój główny raport albo dashboard ma więcej niż osiem wskaźników.</span><span class="fb-c-cat">Antywzorzec 1</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Zdarza się, że po mojej prezentacji nikt nie zadaje ani jednego pytania.</span><span class="fb-c-cat">Antywzorzec 1</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Pokazuję liczby bez porównania z poprzednim okresem albo bez benchmarku.</span><span class="fb-c-cat">Antywzorzec 2</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Słyszałem od kogoś z biznesu pytanie „a to dobrze czy źle?".</span><span class="fb-c-cat">Antywzorzec 2</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Używam słów takich jak flaky, coverage czy regresja przy ludziach spoza IT bez tłumaczenia.</span><span class="fb-c-cat">Antywzorzec 3</span></div>
  </div>
  <div class="fb-c-item" role="button" tabindex="0">
    <div class="fb-c-box">✓</div>
    <div><span class="fb-c-text">Widziałem, jak ktoś kiwa głową, choć oczy mówiły co innego.</span><span class="fb-c-cat">Antywzorzec 3</span></div>
  </div>
  <div class="fb-c-result">
    <div class="fb-c-score" id="fb-check-score">0 / 6</div>
    <div class="fb-c-verdict" id="fb-check-verdict">Zaznacz zdania powyżej, a powiem Ci, jak jest.</div>
  </div>
</div>

## Cztery tygodnie do pierwszego raportu, który działa

Cała seria za nami, więc na koniec plan minimum. Sprawdzony w praktyce, bez rewolucji, do zrobienia obok normalnej pracy.

<div class="fb-road">
  <div class="fb-road-step">
    <div class="fb-road-week">T1</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Policz DDR i błędy produkcyjne wstecz</div>
      <div class="fb-road-text">Dane za ostatni kwartał siedzą w Jirze i w monitoringu. Dwa filtry, godzina pracy, pierwszy trend gotowy. Szczegóły w artykułach drugim i trzecim.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">T2</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Dołóż issues per release i liczbę wydań</div>
      <div class="fb-road-text">Ustal definicje, uruchom tagowanie, policz historię za kilka ostatnich wydań. Od teraz każda liczba w raporcie ma mianownik. Artykuły czwarty i szósty.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">T3</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Zbuduj Confidence Score</div>
      <div class="fb-road-text">Model ważony z dyskwalifikatorem, walidacja na trzech starych wydaniach. Sprawdź, czy liczba zgadza się z tym, co pamiętasz. Artykuł siódmy prowadzi za rękę.</div>
    </div>
  </div>
  <div class="fb-road-step">
    <div class="fb-road-week">T4</div>
    <div class="fb-road-body">
      <div class="fb-road-title">Wyjdź z pierwszym raportem w nowym stylu</div>
      <div class="fb-road-text">Jeden slajd. Wniosek, dowód, rekomendacja, zgodnie z artykułem ósmym. Zero żargonu, każda liczba z kontekstem. A potem obserwuj, co się zmieni w pytaniach z sali.</div>
    </div>
  </div>
</div>

## Dziewięć artykułów później

Zaczęliśmy od diagnozy: QA raportuje aktywność, biznes chce słyszeć o wynikach. Pomiędzy tymi dwoma punktami zmieściło się pięć metryk, jeden wskaźnik decyzyjny, warsztat narracyjny i dzisiejsze trzy przestrogi. To komplet. Nie dlatego, że nie dałoby się dodać kolejnych wskaźników, tylko dlatego, że ten zestaw wystarcza, a wszystko ponad niego zaczyna pracować przeciwko Tobie. Wiesz już dlaczego, pisałem o tym kilka ekranów wyżej.

Jeśli z całej serii miałaby zostać jedna myśl, niech będzie ta: metryki nie służą do udowadniania, że QA pracuje. Służą do tego, żeby firma podejmowała lepsze decyzje. Różnica wydaje się subtelna, a zmienia wszystko, od doboru wskaźników po układ slajdu.

<div class="fb-finale">
  <div class="fb-f-eyebrow">Ostatnie słowo serii</div>
  <div class="fb-f-quote">Pojedyncza metryka to fakt. Zestaw metryk to opowieść. A dobrze opowiedziana historia jakości potrafi zmienić pozycję całego zespołu.</div>
  <div class="fb-f-text">Dziękuję, że doszliście ze mną do końca. Jeśli któryś z artykułów przydał się w praktyce, dajcie znać. Piszcie też, gdy coś nie zadziałało, takie wiadomości uczą mnie najwięcej. Do zobaczenia na konferencjach.</div>
</div>

<div class="fb-series">
  <div class="fb-series-eyebrow">Seria: Metryki QA, które biznes chce słyszeć</div>
  <ul class="fb-s-list">
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">01</span><div><div class="fb-s-title"><a href="/pl/blog/metryki-qa-ktore-biznes-chce-slyszec/">Kompletny przewodnik</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Diagnoza, trzy filary, pięć metryk, model mapowania QA → KPI</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">02</span><div><div class="fb-s-title"><a href="/pl/blog/defect-detection-ratio-jak-mierzyc-skutecznosc/">Defect Detection Ratio</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Formuła, progi, dane historyczne, sezonowość, pułapki</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">03</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-problems-pelne-spektrum/">Escaped Bugs i Problems</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">04</span><div><div class="fb-s-title"><a href="/pl/blog/issues-per-release-miernik-dojrzalosci-kodu/">Issues per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wdrożenie od zera, związek z procesem wytwórczym, rozmowa z EM</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">05</span><div><div class="fb-s-title"><a href="/pl/blog/escaped-bugs-per-release-znajdz-ryzykowny-release/">Escaped Bugs per Release</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Wskazywanie problemów, nie tylko obserwowanie trendów</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">06</span><div><div class="fb-s-title"><a href="/pl/blog/number-of-releases-metryka-kontekstowa/">Number of Releases</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Dlaczego 3 bugi przy 2 releasach to dramat, a przy 15 to sukces</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">07</span><div><div class="fb-s-title"><a href="/pl/blog/release-confidence-score-krok-po-kroku/">Release Confidence Score</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Trzy modele obliczania, wdrożenie, przykłady z praktyki</div></div></li>
    <li class="fb-s-item fb-s-done"><span class="fb-s-num">08</span><div><div class="fb-s-title"><a href="/pl/blog/storytelling-z-metrykami-budowanie-narracji/">Storytelling z metrykami</a> <span class="fb-s-badge-done">przeczytany</span></div><div class="fb-s-sub">Odwrócona piramida, techniki przekładu, generator narracji, szablony</div></div></li>
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">09</span><div><div class="fb-s-title">3 antywzorce, które niszczą wiarygodność QA <span class="fb-s-now">finał · czytasz teraz</span></div><div class="fb-s-sub">Za dużo metryk, brak kontekstu, żargon - autodiagnoza i plan na cztery tygodnie</div></div></li>
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
      msg = 'Czysto. Ten artykuł możesz spokojnie podesłać komuś, komu się przyda bardziej.';
    } else if (count <= 2) {
      msg = 'Drobne naloty. Wiesz już, gdzie szukać, a każdy z tych nawyków znika po kilku świadomych prezentacjach.';
    } else if (count <= 4) {
      msg = 'Czas na porządki. Dobra wiadomość: to nawyki, nie cechy charakteru. Plan na cztery tygodnie znajdziesz sekcję niżej.';
    } else {
      msg = 'Ta seria powstała dokładnie dla Ciebie. Wróć do artykułu pierwszego i idź po kolei, za kwartał ten wynik będzie wyglądał zupełnie inaczej.';
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
