---
title: "Escaped Bugs i Problems - pełne spektrum tego, co ucieka na produkcję"
description: "Bugi w kodzie to tylko część historii. Pełna taksonomia escaped problems - kod, infrastruktura, konfiguracja, integracje, regresje - koszt każdego typu i jak to mierzyć. Artykuł 3 z 9."
date: 2026-06-02
tags: ["qa", "metryki", "leadership", "raportowanie"]
lang: pl
readingTime: 14
author: FB
---

<div class="fb-article">

<p class="fb-eyebrow">Seria: QA Leadership · Artykuł 3 z 9</p>

<p class="fb-lead">Był piątkowy wieczór. DDR zespołu wynosił 91%. Regresja przeszła pięknie. Confidence Score: 89% - GO. Release wyszedł. I czterdzieści minut później zaczęły spływać alerty.</p>

<div class="fb-incident">
  <div class="fb-inc-time">Piątek · 18:47 · Produkcja</div>
  <div class="fb-inc-line"><span class="fb-inc-t">18:47</span><span class="fb-inc-msg fb-inc-alert">ALERT: Timeout na połączeniach z zewnętrznym API płatności - 503 dla 34% requestów</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">18:51</span><span class="fb-inc-msg">DevOps: sprawdzam logi... to nie jest nasz kod. Coś z konfiguracją SSL w nowym środowisku.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:03</span><span class="fb-inc-msg">QA Lead: ale to nie był bug - w testach wszystko przechodziło.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:04</span><span class="fb-inc-msg fb-inc-alert">PM: klient właśnie napisał. Nie może procesować transakcji od 17 minut.</span></div>
  <div class="fb-inc-line"><span class="fb-inc-t">19:22</span><span class="fb-inc-msg fb-inc-note">Wycofanie zakończone. Czas przestoju: 35 minut. Certyfikat SSL na produkcji różnił się od staging.</span></div>
</div>

Następnego dnia na retrospektywie padło pytanie: *„Jak to możliwe - DDR 91%, a klient nie mógł płacić przez pół godziny?"*

Odpowiedź jest prosta i bolesna jednocześnie: **bo DDR mierzył tylko bugi w kodzie. A problem był w konfiguracji infrastruktury.** I to jest dokładnie ta luka, o której jest ten artykuł.

<blockquote class="fb-quote">Klient nie rozróżnia, czy serwis padł przez buga w kodzie, zły certyfikat SSL, czy błędny feature flag. Dla niego - i dla Twojego biznesu - to wszystko jest tym samym: produkcja nie działa.</blockquote>

## Escaped Problem - szersza definicja

W poprzednim artykule mówiliśmy o DDR - metryce skuteczności wykrywania defektów. DDR pyta: *ile bugów łapiemy zanim trafią na produkcję?* Ale ta definicja zakłada, że jedyne problemy to bugi w kodzie aplikacji.

Rzeczywistość jest inna. Escaped Problem to **każdy problem odkryty przez klienta lub monitoring po wdrożeniu** - niezależnie od źródła. Cztery kategorie, cztery zupełnie różne sposoby powstawania, cztery różne sposoby zapobiegania.

## Cztery typy - jeden wspólny skutek

Zanim zaczniesz mierzyć, musisz wiedzieć, co mierzysz. Oto pełna taksonomia escaped problems z typowym udziałem procentowym w organizacjach, z którymi pracowałem.

<div class="fb-tax-grid">
  <div class="fb-tax-card fb-tax-code">
    <div class="fb-tax-icon">🐛</div>
    <div class="fb-tax-name">Defekty kodu</div>
    <span class="fb-tax-share">~55% przypadków</span>
    <div class="fb-tax-desc">Klasyczny bug - nieprawidłowe zachowanie aplikacji wynikające z błędu w logice programistycznej. To właśnie mierzy DDR z artykułu 2.</div>
    <div class="fb-tax-examples">
      <span>Błędna kalkulacja ceny po rabacie</span>
      <span>NullPointerException przy edge case</span>
      <span>Nieprawidłowa walidacja formularza</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-infra">
    <div class="fb-tax-icon">⚙️</div>
    <div class="fb-tax-name">Problemy infrastruktury</div>
    <span class="fb-tax-share">~20% przypadków</span>
    <div class="fb-tax-desc">Środowisko produkcyjne zachowuje się inaczej niż testowe. Kod jest poprawny - ale nie działa w docelowym kontekście.</div>
    <div class="fb-tax-examples">
      <span>Certyfikat SSL różni się od staging</span>
      <span>Niewystarczające zasoby serwera pod obciążeniem</span>
      <span>Różnica wersji bibliotek między środowiskami</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-integ">
    <div class="fb-tax-icon">🔗</div>
    <div class="fb-tax-name">Awarie integracji</div>
    <span class="fb-tax-share">~15% przypadków</span>
    <div class="fb-tax-desc">Zewnętrzne API, systemy trzecich stron, wewnętrzne mikroserwisy - coś, co działało w testach, nie działa na produkcji ze względu na inny kontekst wywołania.</div>
    <div class="fb-tax-examples">
      <span>API płatności zwraca inny format na produkcji</span>
      <span>Timeout inny niż na staging</span>
      <span>Brakujące uprawnienia w integracji serwisowej</span>
    </div>
  </div>
  <div class="fb-tax-card fb-tax-regr">
    <div class="fb-tax-icon">↩️</div>
    <div class="fb-tax-name">Regresje po wdrożeniu</div>
    <span class="fb-tax-share">~10% przypadków</span>
    <div class="fb-tax-desc">Funkcja działała przed releasem - po wdrożeniu przestała. Przyczyna: nieoczekiwana interakcja z nowymi zmianami lub zmianami w konfiguracji.</div>
    <div class="fb-tax-examples">
      <span>Feature flag nadpisał ustawienia produkcyjne</span>
      <span>Cache nie został wyczyszczony po wdrożeniu</span>
      <span>Migracja bazy danych zmieniła zachowanie starych rekordów</span>
    </div>
  </div>
</div>

Suma nie daje 100% - bo kilka procent to sytuacje mieszane, trudne do jednoznacznej klasyfikacji. Proporcje będą różne w Twojej organizacji - ale sama taksonomia jest niemal uniwersalna.

## Kod vs infra vs integracja - kluczowe różnice

Każdy typ escaped problem ma inne źródło, inny sygnał ostrzegawczy i inną metodę zapobiegania. Tabela poniżej to Twoja mapa nawigacyjna.

<div class="fb-table-wrap">
<table class="fb-cmp-table">
  <thead>
    <tr>
      <th>Typ</th>
      <th>Kto odpowiada</th>
      <th>Gdzie szukać sygnałów</th>
      <th>Jak zapobiegać</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="fb-badge fb-badge-code">Kod</span></td>
      <td>Dev + QA</td>
      <td>Jira, testy automatyczne, code review</td>
      <td>Pokrycie testami, DDR, definicja ukończenia</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-infra">Infra</span></td>
      <td>DevOps + QA</td>
      <td>Monitoring, diff środowisk, przegląd IaC</td>
      <td>Spójność środowisk, testy infrastructure as code</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-int">Integracje</span></td>
      <td>Dev + QA + dostawca</td>
      <td>Logi API, testy kontraktowe, alerting</td>
      <td>Testy kontraktowe, mockowanie danymi zbliżonymi do produkcji</td>
    </tr>
    <tr>
      <td><span class="fb-badge fb-badge-reg">Regresje</span></td>
      <td>QA + DevOps</td>
      <td>Monitoring po wdrożeniu, smoke testy</td>
      <td>Smoke suite po wdrożeniu, canary deployments</td>
    </tr>
  </tbody>
</table>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Rozkład typów escaped problems - przykładowy rok</div>
      <div class="fb-chart-sub">Kod dominuje, ale infra i integracje to łącznie ~35% problemów, często pomijanych w raportach</div>
    </div>
    <span class="fb-chart-badge">Q1-Q4</span>
  </div>
  <div class="fb-chart-canvas" style="height: 230px">
    <canvas id="fb-c-types" role="img" aria-label="Wykres kołowy: defekty kodu 55%, infrastruktura i konfiguracja 20%, integracje 15%, regresje po wdrożeniu 10%."></canvas>
  </div>
</div>

## Jak zbierać i kategoryzować - praktyczny przewodnik

Większość zespołów zbiera tylko bugi z Jiry. To jak mierzenie temperatury w jednym pokoju i twierdzenie, że znasz klimat całego budynku. Oto co dodać i jak to połączyć.

### Źródła danych

<div class="fb-collect-grid">
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🗂️</div>
    <div class="fb-collect-name">Jira / tracker</div>
    <div class="fb-collect-desc">Defekty kodu zgłaszane przez QA i devów. Pole „środowisko" lub tag „production" pozwala odfiltrować escaped.</div>
    <span class="fb-collect-tag fb-collect-must">obowiązkowe</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">📡</div>
    <div class="fb-collect-name">Monitoring alertów</div>
    <div class="fb-collect-desc">PagerDuty, Datadog, Grafana. Incydenty produkcyjne z timestampem - źródło infra i integracji.</div>
    <span class="fb-collect-tag fb-collect-must">obowiązkowe</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🎧</div>
    <div class="fb-collect-name">Zgłoszenia supportu</div>
    <div class="fb-collect-desc">Freshdesk, Zendesk. Problemy zgłoszone przez klientów, które nigdy nie trafią do Jiry jako bug.</div>
    <span class="fb-collect-tag fb-collect-good">ważne</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">🔖</div>
    <div class="fb-collect-name">Logi po wdrożeniu</div>
    <div class="fb-collect-desc">Pierwsze 30 minut po wdrożeniu to okno regresji. Splunk, ELK, CloudWatch - logi z tego okna.</div>
    <span class="fb-collect-tag fb-collect-good">ważne</span>
  </div>
  <div class="fb-collect-card">
    <div class="fb-collect-icon">💬</div>
    <div class="fb-collect-name">Slack / Teams</div>
    <div class="fb-collect-desc">Kanał #incidents lub #prod-issues. Tu często lądują problemy zanim ktoś je zaloguje oficjalnie.</div>
    <span class="fb-collect-tag fb-collect-bonus">uzupełnienie</span>
  </div>
</div>

### Proces kategoryzacji - krok po kroku

<div class="fb-steps">
  <div class="fb-step">
    <div class="fb-step-num">1</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Zbierz wszystkie zdarzenia produkcyjne z tygodnia / sprintu</div>
      <div class="fb-step-text">Jeden log - niezależnie od źródła. Data, krótki opis, czas przestoju lub wpływ na użytkowników. Na tym etapie nie kategoryzujesz - tylko zbierasz.</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">2</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Przypisz typ do każdego zdarzenia</div>
      <div class="fb-step-text">Kod / infra / integracja / regresja. Jedno zdarzenie - jeden typ. Jeśli nie jesteś pewny - wybierz najbardziej prawdopodobny i zaznacz jako „do weryfikacji".</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">3</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Przypisz do release'u</div>
      <div class="fb-step-text">Które wdrożenie sprowadziło problem? Czasem to oczywiste - incydent 30 minut po wdrożeniu. Czasem trzeba spojrzeć na historię zmian. Bez tego kroku stracisz możliwość łączenia escaped problems z konkretnymi releasami (metryka z artykułu 5).</div>
    </div>
  </div>
  <div class="fb-step">
    <div class="fb-step-num">4</div>
    <div class="fb-step-body">
      <div class="fb-step-title">Oblicz koszt i zaloguj czas rozwiązania</div>
      <div class="fb-step-text">Czas wykrycia, czas naprawy, kto był zaangażowany. Nawet przybliżenie (DevOps ~3h, Dev ~1h) wystarczy - szczegóły kosztu omawiamy w następnej sekcji.</div>
    </div>
  </div>
</div>

### Lista kontrolna wdrożenia

Sprawdź, które źródła danych masz już podłączone w swoim zespole.

<div class="fb-checklist">
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Jira - pole „środowisko" lub tag „production" skonfigurowany</div><div class="fb-cl-desc">Pozwala filtrować bugi znalezione na produkcji z dokładnością do release'u.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Alerty z monitoringu trafiają do jednego miejsca (Slack / PagerDuty)</div><div class="fb-cl-desc">Każdy alert produkcyjny powinien zostawiać ślad możliwy do późniejszej analizy.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Zgłoszenia supportu linkowane z Jirą lub logowane osobno</div><div class="fb-cl-desc">Bez tego tracisz problemy, które klient zgłasza bezpośrednio - często najpoważniejsze.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Historia wdrożeń z dokładnymi datami i godzinami</div><div class="fb-cl-desc">Niezbędna do przypisania incydentów do konkretnych releasów.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Smoke testy uruchamiane automatycznie po każdym wdrożeniu</div><div class="fb-cl-desc">Wyłapują regresje w pierwszych minutach - zanim dotrą do klienta.</div></div></div>
  <div class="fb-cl-item"><div class="fb-cl-check"></div><div><div class="fb-cl-title">Tygodniowy przegląd incydentów z klasyfikacją typów</div><div class="fb-cl-desc">15-minutowy rytuał, który przekształca surowe dane w kategoryzowaną historię.</div></div></div>
</div>

<div class="fb-cost-section">
  <span class="fb-cost-eyebrow">Koszt</span>
  <h2 class="fb-cost-h">Ile kosztuje każdy typ escaped problem?</h2>
  <p class="fb-cost-intro">Każdy typ escaped problem ma inny profil kosztowy - inny czas wykrycia, inny czas naprawy, innych ludzi angażuje. Poniżej szacunki oparte na medianie z typowych organizacji enterprise. Twoje liczby będą inne - ale proporcje są zaskakująco spójne.</p>
  <div class="fb-cost-types">
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-code">Kod</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Defekt kodu aplikacji</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">Dev: 2-3h analiza + fix</span>
          <span class="fb-ct-item">QA: 1h weryfikacja</span>
          <span class="fb-ct-item">DevOps: 1h hotfix deploy</span>
          <span class="fb-ct-item">PM: 0.5h koordynacja</span>
        </div>
        <div class="fb-ct-note">Najczęstszy typ. Dobrze zdefiniowany proces naprawy. Niższy koszt eskalacji.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">5-6h</div>
        <div class="fb-ct-unit">na incydent</div>
        <div class="fb-ct-risk fb-ct-med">ryzyko: średnie</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-infra">Infra</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Problem infrastruktury / konfiguracji</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">DevOps: 3-5h diagnoza + fix</span>
          <span class="fb-ct-item">Dev: 1h wsparcie</span>
          <span class="fb-ct-item">QA: 1h weryfikacja środowisk</span>
          <span class="fb-ct-item">PM: 1h + komunikacja z klientem</span>
          <span class="fb-ct-item">Często: wycofanie całego release'u</span>
        </div>
        <div class="fb-ct-note">Trudniejszy do zdiagnozowania. Często wymaga wycofania - nie tylko poprawki.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">8-12h</div>
        <div class="fb-ct-unit">na incydent</div>
        <div class="fb-ct-risk fb-ct-high">ryzyko: wysokie</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-int">Integracja</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Awaria integracji zewnętrznej</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">Dev: 2-4h diagnoza + obejście</span>
          <span class="fb-ct-item">DevOps: 2h konfiguracja</span>
          <span class="fb-ct-item">PM: 2-3h komunikacja z dostawcą</span>
          <span class="fb-ct-item">Często: naruszenie SLA u zewnętrznego dostawcy</span>
        </div>
        <div class="fb-ct-note">Część problemu po stronie dostawcy. Czas rozwiązania zależy od zewnętrznego SLA.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">8-16h</div>
        <div class="fb-ct-unit">na incydent</div>
        <div class="fb-ct-risk fb-ct-crit">ryzyko: krytyczne</div>
      </div>
    </div>
    <div class="fb-cost-type">
      <span class="fb-ct-badge fb-ct-reg">Regresja</span>
      <div class="fb-ct-body">
        <div class="fb-ct-title">Regresja po wdrożeniu</div>
        <div class="fb-ct-breakdown">
          <span class="fb-ct-item">QA: 2h identyfikacja zakresu</span>
          <span class="fb-ct-item">Dev: 2-3h analiza interakcji</span>
          <span class="fb-ct-item">DevOps: 2h wycofanie lub hotfix</span>
          <span class="fb-ct-item">Często: wpływ na wiele funkcji jednocześnie</span>
        </div>
        <div class="fb-ct-note">Podstępna - bo „poprzednia wersja działała". Wymaga głębszej analizy przyczyn.</div>
      </div>
      <div class="fb-ct-total">
        <div class="fb-ct-hrs">7-10h</div>
        <div class="fb-ct-unit">na incydent</div>
        <div class="fb-ct-risk fb-ct-high">ryzyko: wysokie</div>
      </div>
    </div>
  </div>
  <div class="fb-cost-summary">
    <div class="fb-cs-cell"><div class="fb-cs-label">Średni koszt wszystkich typów</div><div class="fb-cs-val">~8h</div><div class="fb-cs-sub">na jeden escaped problem</div></div>
    <div class="fb-cs-cell"><div class="fb-cs-label">Najdroższy typ</div><div class="fb-cs-val fb-cs-red">Integracja</div><div class="fb-cs-sub">8-16h + zewnętrzne SLA</div></div>
    <div class="fb-cs-cell"><div class="fb-cs-label">Najczęstszy typ</div><div class="fb-cs-val fb-cs-blue">Kod</div><div class="fb-cs-sub">~55% wszystkich przypadków</div></div>
  </div>
</div>

## Dane, które mówią więcej niż jeden licznik

Zamiast jednej liczby „escaped bugs = 12" - dwa wykresy, które dają zupełnie inny poziom wglądu w to, co się naprawdę dzieje.

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Escaped problems według typów - trend kwartalny</div>
      <div class="fb-chart-sub">Kod maleje szybciej - bo jest lepiej testowany. Infra i integracje utrzymują się - wymagają innych działań.</div>
    </div>
    <span class="fb-chart-badge">Q1-Q4 2025</span>
  </div>
  <div class="fb-chart-legend">
    <span class="fb-lg"><span class="fb-ld" style="background:#3B82F6"></span>Kod</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#F97316"></span>Infra</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#8B5CF6"></span>Integracje</span>
    <span class="fb-lg"><span class="fb-ld" style="background:#EF4444"></span>Regresje</span>
  </div>
  <div class="fb-chart-canvas" style="height: 240px">
    <canvas id="fb-c-trend" role="img" aria-label="Wykres słupkowy skumulowany: łączna liczba escaped problems spada z 19 w Q1 do 8 w Q4, a kod maleje najszybciej (z 10 do 3)."></canvas>
  </div>
</div>

<div class="fb-chart-card">
  <div class="fb-chart-head">
    <div>
      <div class="fb-chart-title">Koszt według typów - Q4 2025</div>
      <div class="fb-chart-sub">Integracje to tylko 15% przypadków - ale pochłaniają nieproporcjonalnie więcej czasu i budżetu</div>
    </div>
    <span class="fb-chart-badge">godziny robocze</span>
  </div>
  <div class="fb-chart-canvas" style="height: 220px">
    <canvas id="fb-c-cost" role="img" aria-label="Wykres słupkowy poziomy: łączny koszt w godzinach - defekty kodu 28h (5 incydentów), infra 20h (2 incydenty), integracje 12h (1 incydent), regresje 8h (1 incydent)."></canvas>
  </div>
</div>

## Jak to prezentować biznesowi

Sama liczba escaped problems przestaje wystarczać, gdy masz rozkład typów i koszt każdego z nich. Oto jak zamienić te dane w narrację.

<blockquote class="fb-quote">Zamiast: *„mieliśmy 8 escaped bugów."* Powiedz: *„mieliśmy 8 escaped problems - 5 defektów kodu, 2 problemy konfiguracyjne i 1 awaria integracji. Łączny koszt: ok. 68 godzin. Infra i integracje wymagają osobnej strategii."*</blockquote>

<div class="fb-biz-quotes">
  <div class="fb-biz-q">
    <span class="fb-biz-context">Sprint review</span>
    <span class="fb-biz-text">„W tym sprincie mieliśmy 3 escaped problems: 2 defekty kodu i 1 problem konfiguracyjny środowiska. Koszt: ok. 22 godziny. Problem konfiguracyjny był najdroższy - i mamy plan, żeby go nie powtórzyć."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">1:1 z EM</span>
    <span class="fb-biz-text">„Patrząc na trend - defekty kodu spadają. Ale problemy infra i integracji utrzymują się na stałym poziomie. To wymaga innej interwencji niż więcej testów - potrzebujemy lepszej spójności środowisk i testów kontraktowych."</span>
  </div>
  <div class="fb-biz-q">
    <span class="fb-biz-context">Zarząd</span>
    <span class="fb-biz-text">„W Q4 mieliśmy 8 escaped problems o łącznym koszcie ok. 68 godzin roboczych. Dla porównania - w Q1 było ich 18 za ok. 160 godzin. Największą oszczędność przyniosły testy kontraktowe wdrożone w Q2."</span>
  </div>
</div>

## Co zmienia pełna taksonomia

<div class="fb-summary-box">
  <p class="fb-summary-lead">Gdy zaczniesz kategoryzować escaped problems zamiast tylko je liczyć - rozmowa zmienia się fundamentalnie. Przestajesz mówić <em>ile</em>, a zaczynasz mówić <em>co i dlaczego</em>.</p>
  <div class="fb-summary-grid">
    <div class="fb-sg-item"><div class="fb-sg-num">4</div><div class="fb-sg-label">typy escaped problems do śledzenia</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">5×</div><div class="fb-sg-label">różnica kosztu: kod vs integracja</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">35%</div><div class="fb-sg-label">problemów pomijanych gdy mierzysz tylko bugi w kodzie</div></div>
    <div class="fb-sg-item"><div class="fb-sg-num">15min</div><div class="fb-sg-label">tygodniowy przegląd wystarczy do pełnej kategoryzacji</div></div>
  </div>
</div>

<blockquote class="fb-quote">Klient nie zgłasza problemu z etykietą „typ: infrastruktura". Dla niego - i dla Twojego biznesu - liczy się jedno: czy działa. Mierz wszystko, co może przestać działać.</blockquote>

## W następnym artykule

Artykuł czwarty dotyczy **Issues per Release** - metryki dojrzałości kodu, która zmienia rozmowę z Engineering Managerem. Nie pyta, ile bugów znalazłeś - pyta, jak czysty kod dostałeś do testowania.

Spoiler: to jest metryka, która często ujawnia, że problem leży nie po stronie QA, ale po stronie procesu wytwórczego - i daje Ci dane, żeby tę rozmowę prowadzić z pozycji faktów, nie opinii.

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
    <li class="fb-s-item fb-s-current">
      <span class="fb-s-num">03</span>
      <div>
        <div class="fb-s-title">Escaped Bugs i Problems <span class="fb-s-now">czytasz teraz</span></div>
        <div class="fb-s-sub">Taksonomia, zbieranie danych, koszt każdego typu, jak raportować</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">04</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/issues-per-release-miernik-dojrzalosci-kodu/">Issues per Release - miernik dojrzałości kodu</a> <span class="fb-s-badge-done">przeczytany</span></div>
        <div class="fb-s-sub">Jak ta metryka zmienia rozmowę z Engineering Managerem</div>
      </div>
    </li>
    <li class="fb-s-item fb-s-done">
      <span class="fb-s-num">05</span>
      <div>
        <div class="fb-s-title"><a href="/pl/blog/escaped-bugs-per-release-znajdz-ryzykowny-release/">Escaped Bugs per Release - znajdź ryzykowny release</a> <span class="fb-s-badge-done">przeczytany</span></div>
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
.fb-inc-t { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.52); min-width: 42px; padding-top: 3px; flex-shrink: 0; }
.fb-inc-msg { font-size: 14px; line-height: 1.6; color: rgba(255,255,255,0.82); }
.fb-inc-alert { color: #FCA5A5; }
.fb-inc-note { color: rgba(255,255,255,0.64); font-style: italic; }

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
.fb-tax-examples { font-size: 11px; color: #707070; }
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
.fb-cost-intro { color: rgba(255,255,255,0.72) !important; font-size: 15px; margin-bottom: 26px; }
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
.fb-ct-item { font-size: 11px; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.08); padding: 3px 9px; border-radius: 6px; }
.fb-ct-note { margin-top: 8px; font-size: 12px; color: rgba(255,255,255,0.56); }
.fb-ct-total { text-align: right; align-self: center; }
.fb-ct-hrs { font-family: Georgia, serif; font-size: 2rem; font-weight: 500; line-height: 1; color: #fff; }
.fb-ct-unit { font-size: 10px; color: rgba(255,255,255,0.55); margin-top: 3px; }
.fb-ct-risk { font-size: 11px; margin-top: 4px; font-weight: 600; }
.fb-ct-high { color: #FCA5A5; }
.fb-ct-med { color: #FCD34D; }
.fb-ct-crit { color: #F87171; }
.fb-cost-summary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px 24px; margin-top: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 20px; }
.fb-cs-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.58); margin-bottom: 4px; }
.fb-cs-val { font-family: Georgia, serif; font-size: 1.8rem; font-weight: 500; color: #fff; line-height: 1; }
.fb-cs-red { color: #FCA5A5; }
.fb-cs-blue { color: #93C5FD; }
.fb-cs-sub { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 4px; }

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
.fb-s-title a { color: inherit; text-decoration: none; border-bottom: 1px dashed var(--fb-border); transition: color 0.15s; }
.fb-s-title a:hover { color: var(--fb-gold); border-bottom-color: var(--fb-gold); }
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
:root[data-theme="dark"] .fb-article .fb-collect-desc,
:root[data-theme="dark"] .fb-article .fb-step-text,
:root[data-theme="dark"] .fb-article .fb-cl-desc,
:root[data-theme="dark"] .fb-article .fb-chart-sub,
:root[data-theme="dark"] .fb-article .fb-chart-legend,
:root[data-theme="dark"] .fb-article .fb-biz-context,
:root[data-theme="dark"] .fb-article .fb-s-sub,
:root[data-theme="dark"] .fb-article .fb-sg-label { color: #c9c9c9; }
:root[data-theme="dark"] .fb-article .fb-s-title { color: #fff; }
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
  function init() {
    Chart.defaults.font.family = "system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#999';
    var grid = 'rgba(0,0,0,0.06)';
    mount(document.getElementById('fb-c-types'), {
      type: 'doughnut',
      data: {
        labels: ['Defekty kodu (~55%)', 'Infra / konfiguracja (~20%)', 'Integracje (~15%)', 'Regresje po wdrożeniu (~10%)'],
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
          { label: 'Kod', data: [10, 8, 5, 3], backgroundColor: '#3B82F6', stack: 's' },
          { label: 'Infra', data: [4, 3, 4, 2], backgroundColor: '#F97316', stack: 's' },
          { label: 'Integracje', data: [3, 3, 2, 2], backgroundColor: '#8B5CF6', stack: 's' },
          { label: 'Regresje', data: [2, 2, 1, 1], backgroundColor: '#EF4444', borderRadius: { topLeft: 4, topRight: 4 }, stack: 's' }
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
        labels: [['Defekty kodu', '(5 incydentów)'], ['Infra', '(2 incydenty)'], ['Integracje', '(1 incydent)'], ['Regresje', '(1 incydent)']],
        datasets: [{
          label: 'Łączny koszt (h)',
          data: [28, 20, 12, 8],
          backgroundColor: ['#3B82F6', '#F97316', '#8B5CF6', '#EF4444'],
          borderRadius: 6, borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ' ' + c.raw + ' godzin roboczych'; } } } },
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
