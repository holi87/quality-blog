---
title: "Granica zaufania - jak realnie przeskoczyć z 8 na 9 w skali Holaka"
description: "Najtrudniejszy skok w skali Holaka nie jest techniczny. Sprawdzalność i odwracalność jako framework, checklist gotowości i dwa case'y - jeden który przeszedł, jeden który spadł do 2."
date: 2026-05-22
tags: ["ai", "agenty", "adopcja", "skala-holaka", "governance"]
lang: pl
readingTime: 9
author: GH
---

Sekcja „Między fazą 8 a 9: granica zaufania" w [Skali Holaka](/pl/blog/skala-holaka/) opisuje to w czterech akapitach. Cztery akapity to mało, bo to jest **najtrudniejszy skok w całej skali** - i ten, na którym wpada się najczęściej.

Do poziomu 8 włącznie człowiek prowadzi, agent wykonuje. Od poziomu 9 to człowiek definiuje cel, a agent sam decyduje o krokach. Skok wygląda technicznie - *„dodać agentic mode"* - a w rzeczywistości jest organizacyjny i psychologiczny.

Ten artykuł to framework, którego sam używam w pracy z zespołami przy przejściu 8→9.

## Dlaczego to nie jest problem techniczny

Narzędzia istnieją. Claude Code z agentic mode, Cursor agent, Codex, Aider - wszystkie potrafią dostać cel i samodzielnie iterować. MCP daje dostęp do systemów. Sandbox jest tani.

Mimo to większość zespołów na 8 nie przechodzi na 9. Czemu?

- **Człowiek lubi sterować.** Każdy krok agenta budzi pokusę „zatrzymaj, podpowiem". 
- **Brak owner'a dla błędów.** Kto odpowiada, jeśli agent zmienił prod konfigurację? Nikt nie chce być tą osobą.
- **Lęk przed nieuzasadnioną akcją.** „A jeśli zrobi coś co kosztuje?"
- **Compliance nie wie, co odpowiedzieć.** Bo nikt nie spytał konkretnie.

Wszystkie cztery sprowadzają się do jednego: brak frameworka, który mówi *„te akcje mogą iść autonomicznie, te wymagają zatwierdzenia, te są zakazane"*.

## Framework: sprawdzalność + odwracalność

Dwa wymiary, na których musisz wygrać żeby przekroczyć 8.

### Sprawdzalność

Czy łatwo zweryfikujesz, co agent zrobił?

**Mechanizmy:**

- **Audit log** wszystkich akcji agenta - kto, kiedy, co, dlaczego. PostgreSQL albo dedicated log service. *Nie* plik tekstowy.
- **Dry-run mode** - agent najpierw mówi „chcę zrobić X, Y, Z", a dopiero po zatwierdzeniu wykonuje. Stosuj na początku, później dla wybranych klas akcji.
- **Diff przed apply** - przed zmianą stanu agent pokazuje diff. Standard w narzędziach typu Terraform plan/apply.
- **Replay** - możliwość uruchomienia tej samej akcji z tym samym stanem wejściowym. Wymaga deterministycznych snapshotów.
- **Evidence trail** - co agent przeczytał przed decyzją. Pomaga ocenić jakość decyzji, nie tylko fakt jej podjęcia.

Bez sprawdzalności nie wiesz, czy agent jest dobry - wiesz tylko, że nic się nie wywaliło.

### Odwracalność

Jak szybko cofniesz, jeśli agent zrobił źle?

**Mechanizmy:**

- **Git revert** - wszystkie zmiany w kodzie i konfiguracji w wersjonowanym repo, nigdy direct edit produkcji.
- **Snapshot przed akcją** - dla zmian danych: backup punktowy, ID snapshotu w audit logu.
- **Sandbox** - pierwsza akcja zawsze w środowisku testowym, jeśli się powiedzie - promocja do prod.
- **RBAC** - agent ma uprawnienia tylko do zasobów, które jest gotów obsługiwać. Nie root, nie admin, nie *.
- **Kill switch** - jedno przyciśnięcie zatrzymuje agenta i blokuje dalsze akcje. Znajduje się gdzie? Każdy w zespole musi wiedzieć.
- **Blast radius** - przed produkcją: ile rekordów / plików / minut może agent zepsuć w najgorszym scenariuszu? Jeśli odpowiedź to „nie wiem" - nie pchasz na 9.

Bez odwracalności pojedynczy błąd kosztuje więcej niż roczna oszczędność. Wracasz do 2.

## Checklist gotowości - 10 pytań

Zanim zezwolisz agentowi na autonomię w obszarze X, odpowiedz na każde:

1. **Mam pełen log akcji agenta w obszarze X?** (tak / nie / częściowo)
2. **Mogę odtworzyć stan sprzed zmiany w <5 minut?**
3. **Wiem, jakie akcje są w scope'ie agenta - wszystkie pozostałe są zabronione?**
4. **Mam alert (Slack/PagerDuty), jeśli agent zrobi akcję poza scope?**
5. **Wiem, kto jest owner'em błędu w obszarze X - imię, nazwisko, nie „zespół"?**
6. **Przeprowadziłem 5 testów w piaskownicy z realnymi danymi i porównałem wynik z manualnym?**
7. **Mam kill switch i ktoś z zespołu już go raz użył w teście?**
8. **Wiem jaki jest maksymalny koszt jednej akcji agenta (w pieniądzu, czasie, danych)?**
9. **Mam metrykę „akcji wymagających ręcznej poprawki" i monitoruję ją tygodniowo?**
10. **Compliance / security review tego rozwiązania jest udokumentowane i podpisane?**

Mniej niż 8 odpowiedzi „tak" → jeszcze nie 9. Pchanie dalej zamiast tego = anti-pattern „skok 4→9".

## Case A: zespół, który przeszedł

Średniej wielkości fintech. Stack: GitHub, AWS, własne mikrousługi. Cel: agent obsługuje cały cykl tworzenia release notes z zatwierdzeniem przez senior engineera.

Co zbudowali w 6 tygodni:

- Audit log w PostgreSQL - każdy commit, który agent czyta, każda decyzja
- Dry-run: agent mówi *„zamierzam wygenerować draft RN dla wersji X.Y.Z, zawiera Q tematów, oto przykład"* - senior potwierdza
- Owner per komponent: agent wie, kogo otaguje w PR z draft RN
- Sandbox: pierwsze 50 release notes wygenerowanych w sandboxie obok manualnych, porównanie ręczne
- Kill switch: zmienna `AGENT_DISABLED=true` w envie, agent sprawdza co 30s

Po 3 miesiącach: 95% release notes generowanych autonomicznie, 3% wymaga drobnych korekt, 2% odrzucone i regenerowane. Zaufanie zbudowane.

## Case B: zespół, który spadł do 2

Inna firma, podobny rozmiar. Cel: agent obsługuje całą obsługę zgłoszeń klientów w pierwszej linii. Wdrożenie w 2 tygodnie, „bo każda godzina to oszczędność".

Czego nie mieli:

- Audit log: agent loguje do CloudWatch, nikt tego nie przegląda
- Brak dry-run: agent od razu odpowiada klientowi
- Brak sandboxa: pierwszy dzień produkcja
- Brak owner'a: „support team"
- Brak kill switcha: trzeba wyłączyć całą integrację

Trzeciego dnia agent obiecał klientowi zwrot kosztów wyższy niż dozwolony w polityce firmy. Klient zrobił screenshot, wrzucił na LinkedIn. Zespół wyłączył agenta na pół roku, ludzie wrócili do ręcznego workflow z anti-patternem *„AI nie działa"*. Skok 4→9 → realna pozycja 2.

## Anti-pattern: „mamy MCP, więc jesteśmy na 9"

Najczęstsze złudzenie. Posiadanie [MCP](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/) i konektorów to **poziom 8**. Jeśli każda akcja agenta wymaga ręcznego zatwierdzenia przez człowieka, to jesteś na 7 udającym 8 - nie 9.

Sygnał, że jesteś realnie na 9:

- Agent rozpoczyna i kończy zadania bez Twojej obecności
- Pierwsza interakcja z Tobą = wynik, nie pytanie
- Człowiek widzi efekt, agent widzi proces
- 80%+ zadań przechodzi bez korekty

## Co robić jutro

Jeśli jesteś na 8 i celujesz w 9 w tym kwartale:

1. **Wybierz jeden obszar** - najwęższy, najmniej ryzykowny, z jasnym sukcesem
2. **Zbuduj audit log + dry-run** - to pierwsze 60% pracy
3. **Wyznacz owner'a** - imię, nazwisko, kanał kontaktu
4. **Zrób 20 prób w sandboxie** - porównaj z manualnym
5. **Włącz w prod z kill switchem** - pierwsza akcja może być cofnięta jednym kliknięciem
6. **Monitoruj tydzień** - metryka „akcji wymagających poprawki"
7. **Skaluj obszar #2** - dopiero gdy #1 jest stabilny

Przejście 8→9 to nie jeden weekend. To 6–12 tygodni z dyscypliną. Ale po pierwszym udanym przejściu kolejne idą szybciej, bo framework już istnieje.

Wcześniej szkic - w [Skali Holaka](/pl/blog/skala-holaka/). Tutaj framework. W [Ocena outputu agenta](/pl/blog/ocena-outputu-agenta/) - jak weryfikować efekt, kiedy już jesteś na 9.
