---
title: "Storytelling z metrykami - jak zamienić tabelę w argument"
description: "Te same dane potrafią uśpić salę albo wywołać decyzję. Szkielet odwróconej piramidy, techniki przekładu liczb na język biznesu, generator narracji i cztery gotowe szablony. Artykuł 8 z 9."
date: 2026-07-07
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 13
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 8 z 9</p>

<p class="fb-lead">Ten sam zespół, te same liczby, dwa spotkania w odstępie kwartału. Na pierwszym QA Lead pokazał tabelę i stracił uwagę sali po pół minucie. Na drugim opowiedział historię i wyszedł z budżetem na automatyzację. Dane były niemal identyczne.</p>

<div class="fb-meet-wrap">
  <div class="fb-meet fb-meet-flat">
    <span class="fb-meet-tag">Spotkanie 1: tabela</span>
    <div class="fb-meet-quote">„W Q2 wykonaliśmy 312 testów, pass rate 94%, coverage 82%, znaleźliśmy 47 bugów, z czego 7 escaped, DDR na poziomie 87%..."</div>
    <div class="fb-meet-react">Reakcja sali: „Ok, dzięki." Następny punkt agendy.</div>
    <div class="fb-meet-time">Czas uwagi: około 30 sekund</div>
  </div>
  <div class="fb-meet fb-meet-story">
    <span class="fb-meet-tag">Spotkanie 2: narracja</span>
    <div class="fb-meet-quote">„Zacznę od wniosku: jakość rośnie, mimo że przyspieszyliśmy. Dwa dowody i jedna prośba, całość zajmie trzy minuty."</div>
    <div class="fb-meet-react">Reakcja sali: pytania, dyskusja o przyczynach, decyzja budżetowa na koniec.</div>
    <div class="fb-meet-time">Czas uwagi: całe wystąpienie</div>
  </div>
</div>

W siedmiu poprzednich artykułach zbudowaliśmy warsztat pomiarowy: pięć metryk plus Confidence Score. Ten tekst dotyczy ostatniego ogniwa, czyli podania. Bez niego nawet najlepiej policzone wskaźniki lądują w szufladzie z napisem „raporty, których nikt nie czyta".

## Dlaczego tabela przegrywa z historią

Nie chodzi o to, że stakeholderzy nie umieją czytać danych. Chodzi o warunki, w jakich te dane do nich docierają. Spotkanie decyzyjne to środowisko z ograniczoną uwagą, konkurencją tematów i presją czasu. Surowa tabela wymaga od słuchacza samodzielnej interpretacji, a na to po prostu nie ma miejsca w kalendarzu wypełnionym po brzegi.

Badania nad pamięcią pokazują od dawna, że informacje osadzone w narracji zapamiętujemy wielokrotnie lepiej niż te same informacje podane jako lista faktów. Historia dostarcza strukturę: przyczynę, skutek i znaczenie. Liczba pozbawiona tej struktury zostaje w głowie słuchacza dokładnie do momentu, w którym pojawi się następny slajd.

<div class="fb-quote">Interpretacja zawsze się wydarzy. Pytanie brzmi tylko, czy dostarczysz ją Ty, czy słuchacz dopowie sobie własną. Ta druga rzadko bywa korzystna dla QA.</div>

## Odwrócona piramida: wniosek idzie pierwszy

Większość raportów QA budowana jest chronologicznie. Najpierw co robiliśmy, potem co znaleźliśmy, na końcu jakiś wniosek, o ile starczy czasu. Dziennikarze sto lat temu odkryli, że to działa dokładnie odwrotnie. Czytelnik gazety dostaje sedno w pierwszym zdaniu, a szczegóły dopiero potem, w kolejności malejącej ważności. Ta sama zasada przenosi się wprost na raportowanie metryk.

<div class="fb-pyr">
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m1">🎯</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">Otwarcie, pierwsze 15 sekund</div>
      <div class="fb-pyr-title">Wniosek</div>
      <div class="fb-pyr-text">Jedno zdanie, które podsumowuje wszystko. Słuchacz od razu wie, po co jest ta rozmowa i jak ma słuchać reszty. Bez zapowiedzi w stylu „za chwilę pokażę dane, z których wyniknie...".</div>
      <div class="fb-pyr-ex">„Jakość rośnie, mimo że dostarczamy szybciej niż kiedykolwiek."</div>
    </div>
  </div>
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m2">📊</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">Środek wystąpienia</div>
      <div class="fb-pyr-title">Dowód</div>
      <div class="fb-pyr-text">Dwie, góra cztery liczby, zawsze w formie trendu. Pojedynczy punkt w czasie niczego nie dowodzi. Zestawienie kwartałów pokazuje kierunek, a kierunek jest tym, co biznes naprawdę kupuje.</div>
      <div class="fb-pyr-ex">„Wydań przybyło z 6 do 10. Błędy produkcyjne spadły z 7 do 3. Na jedno wydanie przypada dziś mniej niż jedna trzecia tego, co pół roku temu."</div>
    </div>
  </div>
  <div class="fb-pyr-step">
    <div class="fb-pyr-marker fb-pyr-m3">🧭</div>
    <div class="fb-pyr-body">
      <div class="fb-pyr-when">Zamknięcie</div>
      <div class="fb-pyr-title">Rekomendacja</div>
      <div class="fb-pyr-text">Decyzja albo prośba, konkretna i wykonalna. Słuchacz przyszedł na spotkanie decyzyjne, więc daj mu decyzję do podjęcia. Raport bez rekomendacji to zaproszenie do odpowiedzi „ok, dzięki".</div>
      <div class="fb-pyr-ex">„Proponuję utrzymać obecny proces i przeznaczyć odzyskany czas na automatyzację regresji. Potrzebuję na to zgody dziś, żeby zdążyć przed Q4."</div>
    </div>
  </div>
</div>

Zwróć uwagę na proporcje. Wniosek i rekomendacja zajmują razem może pół minuty. Cała reszta czasu należy do dowodu, ale dowód wchodzi dopiero wtedy, gdy słuchacz już wie, czego dowodzi.

## Cztery techniki przekładu na język biznesu

Sam szkielet nie wystarczy, jeśli w środku zostaną surowe wskaźniki. Poniżej techniki, które zamieniają liczbę QA w coś, co stakeholder czuje.

<div class="fb-tech-grid">
  <div class="fb-tech-card">
    <div class="fb-tech-icon">💰</div>
    <div class="fb-tech-name">Przelicz na pieniądze albo czas</div>
    <div class="fb-tech-desc">Escaped bug kosztuje około 8 godzin pracy zespołu (policzyliśmy to w artykule 3). Pomnóż przez stawkę i przez liczbę incydentów w kwartale. Wynik w złotówkach rozumie każdy, od developera po CFO.</div>
    <div class="fb-tech-ex">„Cztery uniknięte escaped bugi w tym kwartale to równowartość tygodnia pracy seniora."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">⚓</div>
    <div class="fb-tech-name">Daj kotwicę porównawczą</div>
    <div class="fb-tech-desc">Procent wisi w próżni, dopóki nie dostanie punktu odniesienia. Porównaniem może być poprzedni kwartał, benchmark branżowy albo cokolwiek, co słuchacz zna z własnego doświadczenia.</div>
    <div class="fb-tech-ex">„Nasze 0,4 błędu na wydanie plasuje nas w okolicach poziomu, który raporty DORA opisują jako najwyższą klasę."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">➗</div>
    <div class="fb-tech-name">Normalizuj, zanim ktoś zrobi to źle</div>
    <div class="fb-tech-desc">Liczby bezwzględne rosną razem z tempem pracy i ktoś na sali na pewno wyciągnie z nich pochopny wniosek. Uprzedź to. Pokaż wartość na wydanie, zgodnie z zasadami z artykułu 6.</div>
    <div class="fb-tech-ex">„Błędów przybyło, bo podwoiliśmy liczbę wydań. Na jedno wydanie przypada ich o połowę mniej."</div>
  </div>
  <div class="fb-tech-card">
    <div class="fb-tech-icon">🧑</div>
    <div class="fb-tech-name">Pokaż konkret zamiast abstrakcji</div>
    <div class="fb-tech-desc">Zamiast kategorii pokaż jeden reprezentatywny przypadek. Jedna historia klienta, który nie mógł zapłacić przez 35 minut, robi więcej niż cały wykres incydentów.</div>
    <div class="fb-tech-ex">„To jest ten typ awarii, który w sierpniu zatrzymał płatności u naszego największego klienta."</div>
  </div>
</div>

## Pięć zdań, które warto przepisać

Każda para poniżej zawiera dokładnie tę samą informację. Różnica leży w tym, co słuchacz z nią zrobi.

<div class="fb-trans-list">
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Przed</div>
      <div class="fb-trans-text">Znaleźliśmy 47 bugów w tym sprincie.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">Po</div>
      <div class="fb-trans-text">Zatrzymaliśmy 47 problemów, zanim dotarły do klientów. Na produkcję przedostały się trzy i wszystkie są już naprawione.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Przed</div>
      <div class="fb-trans-text">Coverage wynosi 82%.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">Po</div>
      <div class="fb-trans-text">Wszystkie ścieżki płatności i logowania są pod automatyczną strażą. Luki zostały w module raportowym i tam kierujemy najbliższy sprint.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Przed</div>
      <div class="fb-trans-text">Escaped per release spadł z 1,4 do 0,4.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">Po</div>
      <div class="fb-trans-text">Rok temu przeciętne wydanie niosło ze sobą prawie półtora błędu produkcyjnego. Dziś statystycznie mniej niż pół. Klient odczuwa tę różnicę przy każdym wdrożeniu.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Przed</div>
      <div class="fb-trans-text">Potrzebujemy więcej ludzi do testów.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">Po</div>
      <div class="fb-trans-text">Każde 5 punktów DDR to około 30 godzin seniorów odzyskanych kwartalnie. Proponuję inwestycję, która według naszych danych podniesie DDR o 4 punkty w dwa sprinty.</div>
    </div>
  </div>
  <div class="fb-trans-card">
    <div class="fb-trans-before">
      <div class="fb-trans-tag">Przed</div>
      <div class="fb-trans-text">Confidence Score wynosi 62%, są 2 blokery, regresja 71%.</div>
    </div>
    <div class="fb-trans-after">
      <div class="fb-trans-tag">Po</div>
      <div class="fb-trans-text">Rekomendujemy wstrzymanie do środy. Dwa blokery w płatnościach wymagają dwóch dni pracy, po ich zamknięciu wracamy z pełnym GO.</div>
    </div>
  </div>
</div>

## Generator narracji

Wpisz swoje liczby, a generator złoży z nich gotową wypowiedź według odwróconej piramidy. Tekst możesz skopiować i dopasować do własnego stylu.

<div class="fb-nb">
  <div class="fb-nb-title">Zbuduj narrację ze swoich danych</div>
  <div class="fb-nb-sub">Porównanie dwóch okresów, na przykład poprzedniego i bieżącego kwartału</div>
  <div class="fb-nb-inputs">
    <div class="fb-nb-field">
      <label for="fb-nb-relprev">Wydania poprzednio</label>
      <input type="number" id="fb-nb-relprev" value="6" min="1">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-relnow">Wydania teraz</label>
      <input type="number" id="fb-nb-relnow" value="10" min="1">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-escprev">Błędy produkcyjne poprzednio</label>
      <input type="number" id="fb-nb-escprev" value="7" min="0">
    </div>
    <div class="fb-nb-field">
      <label for="fb-nb-escnow">Błędy produkcyjne teraz</label>
      <input type="number" id="fb-nb-escnow" value="3" min="0">
    </div>
  </div>
  <div class="fb-nb-output">
    <div class="fb-nb-out-label">Wygenerowana narracja</div>
    <div class="fb-nb-narrative" id="fb-nb-out" aria-live="polite"></div>
    <button class="fb-nb-copy" id="fb-nb-copy" type="button">Kopiuj tekst</button>
  </div>
</div>

## Cztery sposoby na zepsucie dobrej historii

<div class="fb-mist-grid">
  <div class="fb-mist" data-n="01">
    <div class="fb-mist-title">Zrzut wszystkiego naraz</div>
    <div class="fb-mist-text">Dwadzieścia wskaźników na jednym slajdzie oznacza, że żaden nie zostanie zapamiętany. Wybierz dane, które służą wnioskowi, resztę trzymaj w załączniku na wypadek pytań.</div>
  </div>
  <div class="fb-mist" data-n="02">
    <div class="fb-mist-title">Opowiadanie po kolei</div>
    <div class="fb-mist-text">Relacja w stylu „najpierw testowaliśmy moduł A, potem B, potem znaleźliśmy..." zjada czas i odsuwa sedno. Chronologia jest dla kroniki, nie dla decyzji.</div>
  </div>
  <div class="fb-mist" data-n="03">
    <div class="fb-mist-title">Zakopany wniosek</div>
    <div class="fb-mist-text">Jeśli najważniejsze zdanie pada na slajdzie dwunastym, część sali już go nie usłyszy. Sedno idzie pierwsze, nawet jeśli wydaje się, że „trzeba najpierw zbudować kontekst".</div>
  </div>
  <div class="fb-mist" data-n="04">
    <div class="fb-mist-title">Historia bez prośby</div>
    <div class="fb-mist-text">Świetna narracja zakończona ciszą marnuje własny potencjał. Słuchacz powinien wyjść ze spotkania wiedząc, czego od niego oczekujesz: zgody, budżetu, decyzji albo choćby braku sprzeciwu.</div>
  </div>
</div>

## Cztery szablony na cztery okazje

Miejsca oznaczone kolorem wypełniasz swoimi danymi. Struktura pozostaje ta sama: wniosek, dowód, rekomendacja.

<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Cotygodniowy status</span>
    <span class="fb-tmpl-aud">Sprint Review</span>
  </div>
  <div class="fb-tmpl-body">„Krótko: release gotowy do wyjścia. Confidence Score <span class="fb-ph">[X]%</span>, zero blokerów, regresja <span class="fb-ph">[Y]%</span>. Jedyne ryzyko to <span class="fb-ph">[znany problem z obejściem]</span>, monitorujemy po wdrożeniu. Rekomendacja: GO w piątek."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Kwartalne podsumowanie</span>
    <span class="fb-tmpl-aud">Steering / EM</span>
  </div>
  <div class="fb-tmpl-body">„Najważniejsza informacja kwartału: <span class="fb-ph">[wniosek, np. jakość rośnie mimo szybszego tempa]</span>. Wydań mieliśmy <span class="fb-ph">[N]</span>, o <span class="fb-ph">[Δ]</span> więcej niż poprzednio, a błędy produkcyjne na wydanie spadły z <span class="fb-ph">[A]</span> do <span class="fb-ph">[B]</span>. Proszę o <span class="fb-ph">[konkretna decyzja lub zasób]</span>, co pozwoli utrzymać ten kierunek."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Prośba o inwestycję</span>
    <span class="fb-tmpl-aud">Zarząd</span>
  </div>
  <div class="fb-tmpl-body">„Każdy błąd produkcyjny kosztuje nas średnio <span class="fb-ph">[8]</span> godzin pracy zespołu, czyli około <span class="fb-ph">[kwota]</span> rocznie przy obecnej skali. Proponowana inwestycja w <span class="fb-ph">[automatyzację / narzędzie]</span> ogranicza tę kategorię kosztów o <span class="fb-ph">[Z]%</span> według danych z ostatnich dwóch kwartałów. Zwrot następuje w <span class="fb-ph">[okres]</span>."</div>
</div>
<div class="fb-tmpl">
  <div class="fb-tmpl-head">
    <span class="fb-tmpl-name">Komunikat kryzysowy</span>
    <span class="fb-tmpl-aud">Po incydencie</span>
  </div>
  <div class="fb-tmpl-body">„Incydent z <span class="fb-ph">[data]</span> jest opanowany, czas przestoju wyniósł <span class="fb-ph">[T]</span>. Przyczyny leżały w <span class="fb-ph">[obszar, bez wskazywania osób]</span>. Wdrażamy dwa działania zapobiegawcze: <span class="fb-ph">[działanie 1]</span> oraz <span class="fb-ph">[działanie 2]</span>, oba z terminem do <span class="fb-ph">[data]</span>. Pełny raport z analizy w załączniku."</div>
</div>

## W następnym artykule

Został ostatni tekst serii. Zbiera on trzy antywzorce, które najskuteczniej niszczą wiarygodność QA: przeładowane dashboardy (tablice wskaźników), liczby bez kontekstu i żargon techniczny w rozmowie z biznesem. Trochę z przymrużeniem oka, bo każdy z nas popełnił przynajmniej jeden z tych grzechów. Finał całej dziewiątki.

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
    <li class="fb-s-item fb-s-current"><span class="fb-s-num">08</span><div><div class="fb-s-title">Storytelling z metrykami <span class="fb-s-now">czytasz teraz</span></div><div class="fb-s-sub">Odwrócona piramida, techniki przekładu, generator narracji, szablony</div></div></li>
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
    return n.toFixed(n % 1 === 0 ? 0 : 2).replace('.', ',');
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

    var wniosek, reko;
    if (qualityUp && relUp) {
      wniosek = 'Dostarczamy szybciej, a jakość rośnie.';
      reko = 'Proponuję utrzymać obecny proces i przeznaczyć odzyskany czas na automatyzację regresji, co powinno jeszcze pogłębić ten trend.';
    } else if (qualityUp && !relUp) {
      wniosek = 'Jakość wyraźnie się poprawiła.';
      reko = 'Proponuję ostrożnie zwiększyć częstotliwość wydań. Dane sugerują, że proces udźwignie wyższe tempo bez utraty stabilności.';
    } else if (!qualityUp && !qualitySame && relUp) {
      wniosek = 'Przyspieszyliśmy, ale odbywa się to kosztem stabilności.';
      reko = 'Proponuję krótki przegląd procesu przed kolejnym zwiększeniem tempa: analiza ostatnich incydentów wskaże, gdzie wzmocnić testy.';
    } else if (!qualityUp && !qualitySame) {
      wniosek = 'Wskaźnik błędów na wydanie się pogorszył i wymaga reakcji.';
      reko = 'Proponuję analizę po wydaniach z największą liczbą incydentów oraz jedno konkretne działanie naprawcze z terminem w tym sprincie.';
    } else {
      wniosek = 'Utrzymujemy stabilny poziom jakości.';
      reko = 'Proponuję kontynuować obecny proces i wrócić do tematu przy kolejnym przeglądzie kwartalnym.';
    }

    var relPart = relSame
      ? 'Liczba wydań pozostała na poziomie ' + relNow + '.'
      : 'Liczba wydań ' + (relUp ? 'wzrosła' : 'spadła') + ' z ' + relPrev + ' do ' + relNow + '.';
    var escPart = 'Błędy produkcyjne ' +
      (escNow === escPrev ? 'utrzymały się na poziomie ' + escNow :
        (escNow < escPrev ? 'spadły z ' + escPrev + ' do ' + escNow : 'wzrosły z ' + escPrev + ' do ' + escNow)) + ', ' +
      'co daje ' + fmt(eprNow) + ' na wydanie wobec ' + fmt(eprPrev) + ' poprzednio.';
    var dowod = relPart + ' ' + escPart;

    outEl.innerHTML =
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t1">Wniosek</span>„' + wniosek + '"</span>' +
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t2">Dowód</span>„' + dowod + '"</span>' +
      '<span class="fb-nb-part"><span class="fb-nb-part-tag fb-nb-t3">Rekomendacja</span>„' + reko + '"</span>';
    lastPlain = wniosek + '\n\n' + dowod + '\n\n' + reko;
  }

  [relPrevEl, relNowEl, escPrevEl, escNowEl].forEach(function (el) {
    el.addEventListener('input', build);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      if (!navigator.clipboard) return;
      navigator.clipboard.writeText(lastPlain).then(function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = 'Skopiowano';
        setTimeout(function () { copyBtn.textContent = old; }, 1500);
      });
    });
  }

  build();
})();
</script>
