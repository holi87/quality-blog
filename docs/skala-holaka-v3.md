# Skala Holaka - wersja 3 (baza robocza)

Notatka robocza do rozbudowy modelu dojrzałości adopcji AI. **Nie publikować.** Plik żyje poza `src/content/blog/`, więc Astro go nie tknie.

Cel: wersja 3 do końca 2026. Materiał zbieramy z Konradem „Gumisiem" Gomulskim - dane z wdrożeń + eksperymenty.

---

## Status v2 (skala-holaka.md, opublikowana 2026-04-21)

Wersja 2 zamknęła:

- 11 poziomów 0–10 w czterech fazach (Start, Świadome użycie, Kontekst i wiedza, Autonomia)
- trójkąt Bariera/Sukces/Pułapka per poziom
- wymiar indywidualny vs organizacyjny + typowe rozjazdy
- sekcję „Między fazą 8 a 9: granica zaufania"
- 5 anti-patternów (utknięcie na 1, 3, fałszywe 8, skok 4→9, 10 bez 9)
- diagnozy fazowe (Start, Świadome użycie, Kontekst i wiedza, Autonomia)
- sekcję „Gdzie ten model zawodzi" (4 punkty, oś czasu narzędzi skorygowana na 2025 vs Q2 2026)

Po fixach z 2026-05-12:

- intro: „w połowie kwietnia 2026" zamiast „kilka dni temu"
- outro: zapowiedź v3 jeszcze w tym roku, wzmianka o Gumisiu
- usunięto zapowiedź postu „Jak zdiagnozować poziom dojrzałości zespołu w 30 minut" (przenosimy do v3 jako rozdział)
- podpis neutralny (Quality Cat, doświadczenie z Sii Polska + Santander CIB)
- cross-linki do istniejących postów: AGENTS.md, skille (raport bugów do Jiry, własny subagent), MCP (pierwszy MCP, context7), subagenci Claude Code

---

## Co dodać w v3 - zakres

### 1. Protokół diagnozy zespołu w 30 minut

Obiecane, czeka od v2. Forma: gotowy skrypt rozmowy + scoring.

Pomysły do rozwinięcia:

- 8–10 pytań kalibrujących per wymiar (jednostka, organizacja)
- progi punktowe → poziom
- czerwone flagi w odpowiedziach („mamy MCP" bez „kto autoryzuje akcje?")
- różnica między samooceną a obserwacją w pracy - jak konfrontować
- template raportu po sesji (jeden A4)
- materiały Gumisia: realne sesje diagnostyczne - anonimizować

Czy oddzielić jako osobny post i tylko zalinkować z v3? Decyzja przy pisaniu.

### 2. Granica zaufania (8→9) jako pełny rozdział

W v2 to pół-sekcja. W v3:

- sprawdzalność: konkretne mechanizmy (audyt logów, dry-run, replay, snapshot, diff przed apply)
- odwracalność: rollback, git revert, sandbox, RBAC, blast radius
- progresywne zwiększanie autonomii - etapy (auto-approve dla X, human-in-the-loop dla Y)
- psychologia: dlaczego ludzie utykają na 8 (lubią sterować, lęk przed odpowiedzialnością)
- case study: zespół który przeszedł 8→9 (real, z anonimizacją)
- case study: zespół który skoczył 4→9 i wrócił do 2

### 3. Anti-patterny - rozszerzenie

Brakuje w v2:

- **Anti-pattern fazy 5–7** (Kontekst i wiedza): dokumentacja-cmentarz (CLAUDE.md spisany raz, nigdy nieaktualizowany), skill-bloat (mnożenie skilli bez audytu użycia), MCP-everything (podpięcie wszystkiego bo „mamy")
- **Anti-pattern fazy 2** („precyzja wystarczy"): obrona przed frameworkami
- **Anti-pattern wymiaru organizacyjnego**: średnia zamiast mediany, mierzenie tylko liderów, „mamy szkolenie więc jesteśmy na 5"
- **Anti-pattern czasu**: regresja po awarii (1 incydent → cofnięcie do poziomu 2 na pół roku)

Format zostawić bullet-listy albo rozbić każdy na mini-podsekcję z testem i wyjściem.

### 4. Diagnoza fazy Autonomia (9–10)

W v2 jest „sygnał powyżej 10". Brakuje pełnej diagnozy fazy Autonomia. Dorobić w formacie jak inne fazy.

dodac level 11 - Agentic OS - nie tylko orkiestrator ale pelny system operujacy na agentach i codziennosci, nie tylko np claude cowork, cos wiecej niz hermes czy openclaw (ktore moga byc level 10) - do rozbudowy
### 5. Sekcja ROI / wymiar biznesowy

Co dostajesz na poziomie X vs koszt dotarcia tam. Dla decydenta:

- przybliżony zwrot per poziom (oszczędność czasu, jakość, predykcja, ryzyko)
- koszt dotarcia (czas, narzędzia, governance, change management)
- krzywa zwrotu - pierwsze poziomy (1→4) tanie i wysoki ROI, środek (5→8) drogi i niewidoczny, autonomia (9–10) wysoki ale z odsetkiem porażek
- kiedy *nie* warto iść wyżej - case kiedy zatrzymanie na 4 albo 7 jest racjonalne

Tu Gumiś ma materiał z firm wdrożeniowych. Wyciągnąć liczby (orientacyjne, anonimowo).

### 6. Przykładowy stack 2026 per poziom

Jeden boks na końcu - „referencyjny stack na maj 2026":

- poziom 1–4: ChatGPT/Claude.ai, custom instructions
- poziom 5–6: AGENTS.md, CLAUDE.md, Cursor rules, Claude Code
- poziom 7: skille Claude Code, Plugin Marketplace
- poziom 8: MCP servery (context7, vault-rag, playwright, github, slack), connectors w Claude
- poziom 9: Claude Code agentowy mode, Codex, Cursor agent
- poziom 10: orkiestracja przez subagentów Claude Code, multi-agent frameworks

Zastrzec że stack starzeje się szybciej niż skala.

### 7. Tagi i SEO

Dla v3 (i v2 retroaktywnie jeśli ma sens):

- dodać tagi: `mcp`, `agenty`, `claude-code`, `governance`
- diagram fazowy (Mermaid albo SVG) na początku artykułu
- alt-textowanie diagramu

### 8. Glosariusz

Krótki słownik na końcu:

- MCP, RAG, agent vs subagent, orchestrator, skill, framework promptowania, CRISP, CoT, ReAct, custom instructions, sprawdzalność, odwracalność, blast radius

Linkować do [słownika pojęć AI dla testerów](/pl/blog/slownik-pojec-ai-dla-testerow/) jako rozszerzenie.

---

## Otwarte pytania

- Czy v3 ma być jednym dłuższym artykułem czy serią 3–4 postów + indeks?
- Czy zachować numerację 0–10 czy zmienić na nazwy (po nowej kalibracji może się okazać że poziom 2 i 3 zlewają się w praktyce)?
- Czy dodać poziom „11" / „post-orkiestracja" - projektowanie systemów multi-agent bez własnego zaangażowania w pojedynczy task?
- Format diagnozy: PDF/Notion template do pobrania czy interaktywny formularz na blogu?
- Czy publikować case studies anonimowo czy z nazwami zespołów (za zgodą)?
- podmieniamy stara wersje jako zaktualizowana v3 z nowa data publikacji?
- dodajemy filipa ?
---

## Linki wewnętrzne (kandydaci dodatkowi)

Posty istniejące na blogu, które warto dolinkować w v3 tam gdzie pasują:

- [10 workflowów AI dla test architecta](/pl/blog/10-workflowow-ai-dla-test-architecta/) - przy fazie 9
- [Advisor Claude Code](/pl/blog/advisor-claude-code-druga-opinia/) - sprawdzalność / 8→9
- [Caveman plugin a tokeny](/pl/blog/caveman-plugin-tokeny-ai/) - przy poziomie 6 (zaawansowane instrukcje / kompresja)
- [Claude CLI vs desktop vs web](/pl/blog/claude-codex-cli-vs-desktop-vs-web/) - przy doborze narzędzi
- [Ocena outputu agenta](/pl/blog/ocena-outputu-agenta/) - sprawdzalność, 8→9, „Gdzie ten model zawodzi"
- [Prompt master skill](/pl/blog/prompt-master-skill-claude-code/) - przy poziomie 7
- [Prompty AI](/pl/blog/prompty-ai/) - przy poziomie 2–3
- [Słownik pojęć AI dla testerów](/pl/blog/slownik-pojec-ai-dla-testerow/) - w glosariuszu

EN odpowiedniki - zmapować przy pisaniu (`/en/blog/...`).

---

## Dane do zebrania (Gumiś)

Lista do uzupełnienia w czasie pracy:

- [ ] liczba diagnoz przeprowadzonych do dziś (z datą)
- [ ] rozkład poziomów w próbie (jednostki vs organizacje)
- [ ] najczęstsze anti-patterny w obserwacji
- [ ] typowy czas przejścia między fazami
- [ ] ROI orientacyjne per poziom (1–4, 5–8, 9–10)
- [ ] case'y 8→9 i 4→9 (anonimizowane)
- [ ] cytaty z wywiadów (z pozwoleniem)

---

## Changelog notatki

- 2026-05-12 - utworzenie pliku, zarys v3 po fixach v2

