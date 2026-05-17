---
title: "Open WebUI - front jak ChatGPT do twojego lokalnego LLM"
description: "Lokalna Ollama daje tylko CLI. LM Studio jest jednoosobowe. Open WebUI to brakujący kawałek: ChatGPT-like UI z RAG-iem, web search i tools - uruchamiasz w jednej komendzie Dockera."
date: 2026-05-08
tags: ["ai", "llm", "ollama", "open-webui", "rag", "lokalne-modele"]
lang: pl
readingTime: 10
author: GH
---

Trzeci wpis w serii o lokalnym LLM-ie na Mac mini M4 16 GB. W [pierwszym](/pl/blog/mac-mini-m4-lokalny-llm-lm-studio-ollama) postawiłem stację. W [drugim](/pl/blog/modele-llm-2026-na-mac-mini-m4) pobrałem właściwe modele. Dziś spinam to wszystko frontendem, który zamienia surowy CLI w narzędzie, którego ktoś inny niż ja jest w stanie używać bez tutoriala.

Problem jest banalny. Po zainstalowaniu Ollamy mam pięknie działający daemon na `localhost:11434`. Z poziomu terminala mogę z nim rozmawiać. Ale jak chcę pokazać żonie, że ten Mac mini, który stoi na biurku i mruga, faktycznie do czegoś służy - pokazanie jej `ollama run gemma4:e4b` jest mało przekonujące. LM Studio z poprzednich wpisów ma GUI, ale jest jednoosobowe i nie ma sensownej historii synchronizowanej między urządzeniami. Brakuje czegoś między CLI a aplikacją desktopową.

Tym czymś jest **Open WebUI**.

## Open WebUI w jednym zdaniu

To open-source'owy frontend napisany w Svelte, który podpinasz do dowolnego endpointu OpenAI-compatible. Wygląda i działa dokładnie jak ChatGPT - pasek boczny z historią rozmów, panel wyboru modelu, czat z markdownem i kolorowanym kodem, side-by-side porównanie odpowiedzi z różnych modeli, biblioteka promptów. Tylko że całość żyje na twoim sprzęcie i mówi do twoich modeli.

Projekt jest aktywnie rozwijany, ma kilkadziesiąt tysięcy gwiazdek na GitHubie i - co ważne - komercyjna licencja jest jasna (BSD-3 dla podstawy, plus model przygotowany pod self-hosting w firmach). Dla domowego setupu zero kosztów.

## Setup w jednej komendzie Dockera

Tutoriale online czasem komplikują. Najprostsza wersja, która działa na Mac mini M4 z zainstalowanym Docker Desktopem:

```bash
docker run -d \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

Po starcie wchodzisz na `http://localhost:3000`. Pierwsze konto, które utworzysz, jest adminem. Open WebUI samo wykrywa Ollamę na `localhost:11434` (przez `host.docker.internal`) i lista modeli pojawia się w UI.

Jeżeli wolisz natywnie bez Dockera:

```bash
pip install open-webui
open-webui serve
```

Działa, ale Docker daje czystszą izolację, persistent volume, automatyczny restart po reboocie Maca. Polecam Dockera.

Pierwsza rozmowa: wybierasz model z listy, wpisujesz pytanie, dostajesz odpowiedź. Dokładnie tak jak w ChatGPT, tylko że pod spodem leci Gemma 4 e4b albo gpt-oss-20b.

## Co dostajesz out of the box

Lista funkcji, które działają od razu po instalacji, bez żadnej konfiguracji:

**Historia rozmów.** Wszystko zapisane lokalnie w volumenie Dockera. Można tagować, archiwizować, foldery, search po tytułach. Tytuły rozmów Open WebUI generuje automatycznie po pierwszej wymianie.

**Multi-model w jednej rozmowie.** Wybierasz dwa modele naraz, zadajesz to samo pytanie, widzisz dwie odpowiedzi side-by-side. To jest funkcja, której bardzo brakuje w ChatGPT i Claude - porównanie modeli jest szczególnie cenne, gdy testujesz, który lokalny model najlepiej radzi sobie z konkretnym typem zadań.

**Markdown, code highlighting, mermaid.** Diagramy, tabelki, bloki kodu - wszystko renderowane jak w nowoczesnej dokumentacji. Można kopiować bloki kodu jednym kliknięciem.

**Biblioteka promptów.** Zapisujesz dobry prompt z parametrem (`{{tekst}}`, `{{kod}}`), później wywołujesz go po nazwie. Świetne dla powtarzalnych workflowów typu „przekształć ten ticket w pełen test plan".

**Multi-user.** Konta, role admin/user, share modeli i promptów między userami. Realnie nadaje się do zespołu QA na jednym hoście - kilka osób pracuje, każda ma własną historię.

## RAG bez kodowania

To jest ten moment, w którym Open WebUI przestaje być „ładnym frontem", a zaczyna być narzędziem.

W panelu „Knowledge" tworzysz kolekcję. Wrzucasz PDF-y, MD-y, docx, txt. Open WebUI w tle:

1. Chunkuje pliki (konfigurowalne - domyślnie ~1000 tokenów per chunk z overlapem).
2. Generuje embeddingi przez wybrany model (najlepiej `bge-m3` lub `nomic-embed-text` puszczany przez Ollamę - to zostaje lokalnie).
3. Zapisuje wektory w lokalnej bazie (ChromaDB pod spodem).

Teraz w czacie wybierasz model + dołączasz kolekcję. Model widzi cytaty z dokumentów i odpowiada z odnośnikami. **Zero kodowania.** Setup całego prostego RAG-a po dokumentacji własnego projektu - 10 minut.

Praktyczne use case'y, które realnie mam w użyciu:

- **Knowledge base'y projektów klientów.** Wrzucam dokumentację techniczną, podpinam pod model, pytam o specyficzne komponenty.
- **Notatki ze szkoleń.** PDF-y z konferencji, slidy, własne zapiski. „Kto na ostatniej konferencji mówił o test pyramid?" - model znajduje i cytuje.
- **Personal knowledge management.** Markdown-y z mojego Obsidiana wciągnięte do kolekcji. Pytanie po polsku, odpowiedź z odnośnikami do konkretnych notatek.

Drobny pitfall: pierwsze chunkowanie dużej kolekcji (kilkaset PDF-ów) na M4 16 GB potrafi zająć godzinę i zjeść mocno RAM, bo embedder pracuje równolegle z czatem. Polecam embeddować off-line, bez aktywnej rozmowy w innej karcie.

## Web search jako tool

Lokalny model nie zna aktualnych wydarzeń. Open WebUI dodaje **integrację z silnikami wyszukiwania**: DuckDuckGo, SearXNG (samohostowane), Brave, Google CSE, Tavily. Włączasz w panelu admina, wybierasz silnik, opcjonalnie wpisujesz API key (DuckDuckGo nie wymaga).

W trakcie rozmowy włączasz przełącznik „Web Search" i model przy każdym pytaniu może podejść do wyszukiwarki, wybrać kilka wyników, ściągnąć treść stron i wrzucić do kontekstu. Cytaty pojawiają się jako odnośniki w odpowiedzi.

To rozwiązuje fundamentalny problem lokalnych LLM-ów: brak świadomości aktualnego stanu świata. Daje też dostęp do dokumentacji bibliotek, której model nie ma w training data - choć tu często wygodniejszy jest dedykowany MCP typu [Context7](/pl/blog/context7-mcp-aktualna-dokumentacja-llm).

## Tools - function calling przez UI

Najmocniejsza, ale i najbardziej niedoceniana funkcja Open WebUI. W panelu admina możesz zdefiniować **Pythonowy tool**, który model może wywoływać. Wygląda to tak:

```python
class Tools:
    def get_jenkins_build_status(self, job_name: str) -> dict:
        """
        Returns the status of the latest Jenkins build for given job.
        :param job_name: Name of the Jenkins job
        :return: dict with status, duration, build number
        """
        import requests
        r = requests.get(f"http://jenkins.local/job/{job_name}/lastBuild/api/json")
        return r.json()
```

Wklejasz w UI. Model dostaje opis tego toola w system promptcie i wie, kiedy go wywołać. Pytanie „jaki jest status ostatniego builda joba `nightly-tests`" → model woła Pythona, dostaje JSON, formuluje odpowiedź.

Dla testera QA to oznacza możliwość **stworzenia własnego agenta diagnostycznego** w 30 minut. Tools, które realnie sobie napisałem:

- `get_test_run_status(run_id)` - pobiera wynik z naszego TestRail.
- `read_log_lines(file_path, n=100)` - czyta ostatnie linie loga z lokalnej maszyny.
- `query_grafana(panel, time_range)` - pyta o metrykę z dashboardu.
- `create_jira_ticket(project, summary, description)` - zakłada bug w Jirze.

Nie jest to skomplikowane. Każdy tool to ~30 linii Pythona. Ale zsumowane razem dają lokalny chat, w którym mogę pytać „dlaczego nightly-tests pomarańczowe wczoraj o 22?" - i model sam zbiera dane.

## Open WebUI vs konkurencja

Krótkie ABC alternatyw, na wypadek gdybyś rozważał inne opcje:

**[AnythingLLM](https://anythingllm.com/)** - bardziej „enterprise-y", ma wbudowane workspaces, multi-tenant, wbudowany agent-builder. Ciężar instalacji większy, więcej konfiguracji. Wybierałbym dla zespołu 10+ osób.

**[LibreChat](https://www.librechat.ai/)** - multi-provider (OpenAI, Anthropic, Google, Azure, lokalne), świetne dla osób, które chcą jedno UI dla cloudu i lokala. Open WebUI jest w tym węższy - koncentruje się na lokalnym/Ollamie.

**[LobeChat](https://lobechat.com/)** - najładniejszy interfejs, ekosystem wtyczek, ale mniej funkcji RAG-owych i tool-callingowych. Bardziej do „chatu z AI" niż do „lokalnej platformy AI".

**Open WebUI** - najszybciej działa na lokalnym stacku Ollamy. Dokumentacja prosta, community duża, pluginy pojawiają się szybko. Mój default.

## Pitfalls i gotchy

Kilka rzeczy, na które się nadziałem.

**SSL.** Domyślny setup Dockera nie ma HTTPS. Jak wystawisz `:3000` na zewnątrz (np. żeby z telefonu w domu się logować przez Tailscale lub publicznie) - **musisz** dodać reverse proxy (Caddy, Traefik, nginx) z certyfikatem. **Nigdy nie wystawiaj samego portu 3000 publicznie.** Pierwszy bot zeskanuje, znajdzie panel logowania, spróbuje brute-force.

**Embedder + LLM równolegle.** Na 16 GB RAM-u, jak puścisz chat z gpt-oss-20b (~10 GB) i równocześnie embeddujesz dużą kolekcję RAG-a (`bge-m3`, ~1 GB), system zacznie swapować. Embeddowanie offline.

**Migracje wersji.** Open WebUI ma częste releasy. Zwykle backward-compatible, ale od czasu do czasu volume Dockera trzeba zmigrować skryptem. Zawsze sprawdzaj release notes przed `docker pull`.

**Konteksty per-model.** Każdy model ma własny domyślny kontekst, który nie zawsze jest tym największym, jaki obsługuje. Dla Gemma 4 e4b (128k) Open WebUI domyślnie ustawia 4k. Trzeba wejść w model settings i podnieść - inaczej tracisz większość zdolności modelu w długich rozmowach.

**Auth.** Domyślnie Open WebUI ma własny system loginu. Da się podpiąć OAuth (Google, GitHub) lub LDAP. Dla setupu domowego - single user wystarczy. Dla zespołu - OAuth mocno upraszcza onboarding.

## Praktyczna integracja z resztą stacka

Jak to wygląda u mnie, w skrócie:

```
┌─────────────────┐
│  Open WebUI     │ ← UI dla siebie i rodziny
│  :3000          │
└────────┬────────┘
         │ OpenAI-compatible REST
         ↓
┌─────────────────┐
│  Ollama         │ ← runtime modeli
│  :11434         │
└────────┬────────┘
         │
   ┌─────┴──────┬───────────┐
   ↓            ↓           ↓
gpt-oss-20b  Gemma 4 e4b  bge-m3
```

Open WebUI gada z Ollamą. Ollama trzyma modele i embeddery. Wszystko lokalnie, na Mac mini M4 16 GB, w Dockerze albo bezpośrednio.

Z drugiej strony, do tego samego endpointu Ollamy podłączone są inne aplikacje - Claude Code skille (na większym Macu), Continue w VS Code, custom skrypty Pythonowe. Każda ma własny case use, ale wszystkie korzystają z tych samych modeli załadowanych raz w pamięć.

## Wnioski - dlaczego warto

Trzy zdania:

Po pierwsze, **Open WebUI zamienia Ollamę z narzędzia dla devów w narzędzie dla domu lub zespołu**. Bez niego lokalny LLM jest osobistym fetishem; z nim jest realną alternatywą dla ChatGPT w wielu codziennych zadaniach.

Po drugie, **RAG i tools bez kodowania to game changer**. Możliwość wrzucenia własnej dokumentacji i pytania o nią po polsku, bez pisania linii Pythona, jest tym, co przekonuje nietechniczne osoby z zespołu, że to rzeczywiście działa.

Po trzecie - i to najważniejsze - **lokalny stack przestaje być ćwiczeniem akademickim**. Mac mini M4 16 GB + Ollama + Open WebUI + dobrze dobrane modele to jest funkcjonujący osobisty asystent AI, który nie wysyła nic do chmury i nie generuje rachunku per token. Nie zastąpi Claude'a w pracy zawodowej, ale do dużej części codziennego użycia jest **wystarczający** - i to słowo robi tu całą różnicę.

Jeżeli zaczynasz z lokalnym LLM-em - moja rekomendowana ścieżka:

1. Pobierz Ollamę.
2. `ollama pull gemma4:e4b`.
3. Postaw Open WebUI w jednej komendzie Dockera.
4. Po tygodniu używania dodaj gpt-oss-20b i pierwszą kolekcję RAG-a.
5. Po miesiącu, jak złapiesz przepływ, dodaj pierwszy custom tool.

To jest mała inwestycja czasu (kilka godzin łącznie) za narzędzie, które zostaje na miesiące. I - co ważne - **nie wymaga ciągłej obsługi**. Postawione i działa.
