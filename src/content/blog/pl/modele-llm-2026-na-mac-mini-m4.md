---
title: "Lokalne modele LLM w 2026 - co realnie odpalisz na Mac mini M4 16 GB"
description: "Przegląd aktualnych modeli, które warto pobrać na 16 GB unified memory: gpt-oss-20b, Gemma 4 e4b, Qwen3-Coder, Phi-4. Co działa, co nie działa, i dlaczego."
date: 2026-05-07
tags: ["ai", "llm", "ollama", "modele", "kodowanie", "lokalne-modele"]
lang: pl
readingTime: 11
author: GH
---

W [poprzednim wpisie](/pl/blog/mac-mini-m4-lokalny-llm-lm-studio-ollama) opisałem stację: Mac mini M4 16 GB, LM Studio i Ollama jako runtime. Kontener bez treści. Dziś treść - czyli **konkretne modele, które warto pobrać w 2026 roku**, a które wczoraj jeszcze były top picks i już są zwykłym balastem na dysku.

Ekosystem modeli lokalnych w pierwszym kwartale 2026 zmienił się radykalnie. Sześć miesięcy temu pisałem o Qwen2.5-Coder, Gemma 3 i Llama 3.2 jak o nowości. Dziś każdy z tych modeli ma następcę, a OpenAI - pierwszy raz od GPT-2 - wypuściło open-weight model zaprojektowany pod 16 GB pamięci. Jeżeli planujesz pobrać coś na nowo postawionego Maca, **nie kopiuj tutoriali sprzed pół roku**. Lista się zmieniła.

Ten wpis to mój własny przegląd po miesiącu testów. Nie jest to ranking syntetyczny. To raczej notatka „gdybym miał zacząć dzisiaj, oto co bym pobrał i w jakiej kolejności".

## Co się zmieniło od jesieni 2025

Trzy duże ruchy:

**OpenAI weszło w open-weight.** Model `gpt-oss-20b` (i większy `gpt-oss-120b`) wydany w sierpniu 2025 to pierwszy publiczny model OpenAI od GPT-2. Inżynierowie świadomie kwantyzowali wagi MoE do MXFP4 (4.25 bita na parametr), żeby model mieścił się w 16 GB pamięci. To nie jest coś, co dostawca kupił od konkurencji - to celowy produkt pod „uruchom na laptopie".

**Qwen wjechał z architekturą hybrydową.** `Qwen3-Coder-Next` (luty 2026) i flagowy `Qwen3.6-27B` (kwiecień 2026) zmieniły benchmarki kodowania. Qwen3.6-27B osiąga **77.2% na SWE-bench Verified**, czyli prawie tyle, co Claude Opus 4.6 (80.8%). To dense model, więc na 16 GB go nie odpalisz, ale jego mniejsi krewni - tak.

**Gemma 4 z multimodalem na edge.** Gemma 4 e4b ma 4.5 mld effective parameters (8B z embeddingami), 128k kontekstu, **przyjmuje tekst, obraz i audio**, a waży po q4 około 5 GB. Następca Gemma 3 4B - i prawdziwy daily driver dla zadań „ogarnij to, co widzisz".

Mniej istotne, ale warte odnotowania:

- Kimi K2.5 i K2.6 to flagowe open-source modele kodowania w 2026, ale **wymagają 240+ GB pamięci**. Dla 16 GB Mac mini - poza zasięgiem. Wspominam, bo część tutoriali w Internecie pisze o nich entuzjastycznie i można się dać nabrać.
- DeepSeek V4 Pro (1.6T MoE) i V4 Flash (284B) - to samo. Ekstremalne klasy, nie dla naszego sufitu.
- Llama 4 Scout i Maverick (oba 17B w MoE z różną liczbą expertów) działają, ale są na samym progu 16 GB. Jak masz mniej zajętą maszynę - pójdzie. Jak masz Slack i pięć kart w Safari - będzie swap.

## Twardy sufit 16 GB - co się mieści, co nie

Powtarzam zasadę z poprzedniego wpisu, bo to fundament: po systemie i otwartych aplikacjach zostaje ci ~10–12 GB. W tym budżecie musi się zmieścić **model + kontekst + ewentualnie embedder**, jeśli używasz RAG-a.

Czego nie odpalisz na 16 GB (oszczędza czas pobierania):

- Qwen3.6-27B dense (~17 GB w q4)
- Qwen3.6-35B-A3B MoE (~22 GB w q4) - mimo że active params to tylko 3B, wagi totalne muszą być w pamięci.
- Llama 4 Maverick (17B z 128 expertami w MoE - borderline)
- Cokolwiek 30B+ dense
- Kimi K2.5/K2.6, DeepSeek V4 (Flash i Pro)

Co się mieści komfortowo:

- Gemma 4 e2b i e4b
- Llama 3.2 1B / 3B
- Qwen2.5-Coder 7B
- Phi-4 14B (q4) - graniczne, ale działa
- gpt-oss-20b (z natywnym MXFP4)
- Embedderzy: nomic-embed-text, mxbai-embed-large, bge-m3

Teraz po kolei, co i do czego.

## Daily driver chat - Gemma 4 e4b

Mój domyślny model do „pomyśl ze mną" jest dziś Gemma 4 e4b. Powody:

- **Multimodal natywnie.** Wrzucam screenshot błędu z Playwrighta, model widzi i komentuje. Wcześniej wymagało to osobnego modelu vision (np. LLaVA), który dokładał kolejne 4–5 GB do RAM-u.
- **128k kontekstu** - wystarczy, żeby wepchnąć kilka plików projektu i zadać pytanie cross-file.
- **Audio na wejściu** - to nowość, której nie przetestowałem jeszcze produkcyjnie, ale zapowiada się ciekawie do transkrypcji notatek głosowych.
- **~5 GB w q4** - zostaje sporo miejsca na kontekst i embeddingi.
- **Szybkość ~50–60 t/s na M4** - czuje się jak normalny chat.

Co mu zarzucam: w długich rozmowach gubi nici. Po 30 wymianach zaczyna zapominać o instrukcjach z system prompta. Dla zadań „odpowiedz na pytanie, podsumuj, zaproponuj" - bez zarzutu. Dla wieloetapowego planowania - przełączam się na coś większego.

Alternatywa: **Llama 3.2 3B** dla bardzo lekkich zadań typu router/klasyfikator (~80 t/s, 2 GB RAM). **Gemma 4 e2b** jeśli e4b ci nie wchodzi z innych powodów.

## Kodowanie - sweet spot dla 16 GB

Tu kalkulacje są trudniejsze, bo flagowe modele kodowania są ogromne. Realnie masz trzy klasy.

**Klasa lekka - Qwen2.5-Coder 7B q4** (~5 GB)

Sprawdzony, stabilny, szeroko wspierany. Fill-in-middle (FIM) - czyli model rozumie „wstaw kod między te dwie linie", co czyni go użytecznym w autocomplete IDE. Na M4 daje 30–40 t/s. Realnie potrafi:

- napisać poprawny test pytest/Playwright z opisu funkcji,
- zaproponować refactor pojedynczej funkcji,
- zasugerować implementację endpointu na podstawie kontraktu OpenAPI.

Czego nie zrobi: nie poradzi sobie z dużym, cross-file refaktoringiem, halucynuje API mniej popularnych bibliotek. Do tego nadal trzeba lepszych modeli (Claude/GPT-4) lub większych lokalnych.

Mój default do autocomplete'u w Continue/Codeium-style integracji.

**Klasa średnia - gpt-oss-20b w MXFP4**

To jest model, który mnie najbardziej zaskoczył. Specyfikacja:

- 20B parametrów, MoE (~3.6B aktywnych)
- MXFP4 daje 4.25 bita na parametr (vs ~4.5 bita w klasycznym Q4_K_M)
- Reasoning effort levels: `low` / `medium` / `high` - można sterować jak głęboko model „myśli" przed odpowiedzią
- Function calling, web browsing, structured outputs natywnie
- Pełen dostęp do reasoning trace (czyli widzisz „myśli" modelu, nie tylko odpowiedź)

Na M4 16 GB daje **15–25 t/s**, czasami szybciej w trybie `low` reasoning. Ollama wspiera MXFP4 natywnie, bez dodatkowej konwersji. Jakość kodowania jest istotnie wyższa niż w Qwen2.5-Coder 7B - bliżej GPT-3.5/4-Mini niż lokalnej alternatywy 7B.

Czego mu zarzucam: pierwsza wersja `gpt-oss-20b` ma momenty, w których przesadnie cenzuruje (typowe dla OpenAI'a). Da się to obejść system promptem, ale nie zniknie zupełnie. Dla niektórych zadań research-owych może to być deal-breaker.

Mój nowy default do bardziej skomplikowanych zadań kodowych w trybie offline.

**Klasa ciężka - czy jest sens próbować?**

Qwen3-Coder-Next (80B total, 3B active w MoE) na papierze wygląda fenomenalnie: SWE-bench 58.7%, ze scaffoldingiem 70%+. Problem: 80B totalnych wag, nawet w q4, to ~40 GB. Na 16 GB pamięci nie wjedzie. Można teoretycznie offloadować na SSD, ale wtedy spadasz do 1–2 t/s i to przestaje być narzędzie.

Dla tej klasy modeli realnie potrzebujesz Mac Studio z 64+ GB. Jeżeli rozważasz upgrade i kodowanie jest twoim głównym use case'em - to jest argument.

## Reasoning i matematyka - Phi-4 14B

Microsoft dalej trzyma niszę „mocny reasoning w małym modelu". Phi-4 14B q4 (~9 GB) jest zaskakująco dobry w:

- Wyjaśnianiu regexów,
- Tłumaczeniu skomplikowanych SQL-i,
- Krokowych wyprowadzeniach matematycznych,
- Logice formalnej i prostym dowodach.

W codziennej pracy używam go do „wytłumacz mi, co robi ta funkcja krok po kroku". Jest wolniejszy (~12 t/s), ale dla zadania, które wymaga precyzji rozumowania, warto.

Alternatywa: **Qwen3 z trybem `/think`** - gdy model dostaje sygnał, że ma „pomyśleć", widać zauważalnie lepsze wyniki na zadaniach reasoning-owych. Trade-off to dłuższe odpowiedzi, więcej tokenów do wygenerowania.

## Embeddings - fundament RAG-a

Embeddings to nie LLM. To znacznie mniejsze modele (50M–500M parametrów), które zamieniają tekst na wektor liczbowy. Bez nich nie ma sensownego RAG-a, semantic search po dokumentach, ani porządnego clusteringa.

Trzy modele, które polecam w 2026:

- **`nomic-embed-text`** (137M, ~270 MB) - sweet spot. Szybki, 8k kontekst, dobra jakość angielskiego, słabszy polski.
- **`mxbai-embed-large`** (335M, ~670 MB) - wyższa jakość, wolniejszy. Dla mniejszych korpusów.
- **`bge-m3`** (560M, ~1 GB) - wielojęzyczny, w tym polski. Mój pick dla projektów PL.

Wszystkie trzy są w Ollama (`ollama pull nomic-embed-text`) i wszystkie trzy mają OpenAI-compatible endpoint, więc wpinają się w Open WebUI, AnythingLLM, LangChain bez kodowania.

## Kwantyzacje - q4 vs MXFP4 vs reszta

Krótkie ABC, bo nazewnictwo czasem myli:

- **q4_K_M** - sweet spot dla większości modeli. 4-bitowe wagi z mixed precision dla istotniejszych warstw. ~50% jakości q8 przy 25% rozmiaru.
- **q5_K_M / q6_K** - krok wyżej, dla wymagających. Modele 7B nadal mieszczą się w 16 GB w q5, więc warto rozważyć.
- **q8** - „prawie fp16". Niemal bez utraty jakości, ale rozmiar 2x. Realnie tylko dla małych modeli (1B–3B).
- **q2_K / q3_K** - desperacja. Mocno obniżona jakość. Tylko gdy nie ma innej opcji.
- **MXFP4** - nowość 2026 od OpenAI. 4.25 bita na parametr w „microscaling FP4". Lepsza jakość niż klasyczne 4-bit przy podobnym rozmiarze. Natywnie wspierane w Ollama dla gpt-oss.

Mój domyślny wybór: **q4_K_M dla wszystkiego ≥7B, q5_K_M dla 3B–4B, MXFP4 dla gpt-oss**. Schodzę niżej tylko jeśli nie ma innej opcji.

## Mój daily driver setup na 16 GB

Po miesiącu testów, lista, którą trzymam zainstalowaną:

```bash
ollama pull gemma4:e4b              # daily chat, multimodal
ollama pull gpt-oss:20b             # kodowanie, reasoning
ollama pull qwen2.5-coder:7b        # autocomplete IDE, FIM
ollama pull phi4:14b-q4_K_M         # reasoning, regex/SQL explain
ollama pull llama3.2:3b             # router/klasyfikator
ollama pull bge-m3                  # embeddings PL
```

Łączny rozmiar na dysku: ~30 GB. Pamięć - modele ładowane na żądanie, więc nigdy więcej niż jeden duży naraz. Ollama automatycznie wyładowuje model nieużywany przez 5 minut.

## Prosty benchmark do własnego porównania

Jeżeli chcesz zobaczyć różnicę między modelami na własnej maszynie, polecam mały, powtarzalny test:

1. **Prompt 1 (kodowanie)**: „Napisz test Playwright w TypeScript, który loguje się do aplikacji na `https://example.com/login`, wpisuje email i hasło z fixtury, klika submit, asercjuje URL po przekierowaniu."
2. **Prompt 2 (reasoning)**: „Wyjaśnij w trzech krokach, co robi ten regex: `^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$`."
3. **Prompt 3 (multimodal)**: dla Gemma 4 e4b - wrzuć screenshot błędu w konsoli, zapytaj „co to za błąd i co go najczęściej powoduje".

Mierzysz: czas odpowiedzi, peak RAM, jakość (kompiluje? działa? halucynuje?). Po dwóch–trzech rundach wiesz, który model do którego zadania pasuje **na twojej maszynie**, a nie na benchmark-cherry-picked grafikach z Twittera.

## Wnioski 2026

Trzy zdania:

Po pierwsze, **default na 16 GB Mac mini M4 zmienił się z „Qwen2.5-Coder + Gemma 3" na „gpt-oss-20b + Gemma 4 e4b"**. Jeżeli na dysku leży coś sprzed roku i nie było odświeżane - odśwież.

Po drugie, **lokalny LLM przestaje być zabawką**. gpt-oss-20b z reasoning effort levels naprawdę pomaga w realnych zadaniach. Halucynacji jest zauważalnie mniej niż w klasie 7B sprzed pół roku. To nie zastąpi Claude'a w agentowym kodowaniu, ale do dużej części codziennej pracy wystarczy.

Po trzecie - i najważniejsze - **16 GB to nadal sufit, nie „wystarczy zawsze"**. Modele klasy 27B+ dense, Kimi K2.5, DeepSeek V4 są poza naszym zasięgiem i to się nie zmieni. Jeżeli w pracy potrzebujesz tej klasy lokalnie - patrz na 64–128 GB Mac Studio. Jeżeli wystarczy ci „dobre 7B–20B" - Mac mini M4 16 GB jest sensowny.

W [następnym wpisie](/pl/blog/open-webui-frontend-do-lokalnego-llm) - Open WebUI jako frontend, który zamienia te modele w „lokalnego ChatGPT" dla całej rodziny lub zespołu, bez pisania jednej linii kodu.
