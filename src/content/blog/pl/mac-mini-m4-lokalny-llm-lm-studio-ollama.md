---
title: "Mac mini M4 16 GB jako stacja lokalnego LLM — LM Studio kontra Ollama"
description: "Czy najtańszy Mac z linii M4 ma sens jako maszyna do lokalnych modeli językowych? Hardware reality check, porównanie LM Studio i Ollamy, granica zdrowego rozsądku."
date: 2026-05-06
tags: ["ai", "llm", "ollama", "lm-studio", "mac", "lokalne-modele"]
lang: pl
readingTime: 10
---

Pod koniec marca zamknąłem dyskusję ze sobą i kupiłem Mac mini M4 z 16 GB pamięci. Na biurku stoi obok większego Maca, który robi normalną robotę developerską, ten ma jeden cel: lokalne LLM-y. Eksperymenty, prywatne dane, oszczędność na rachunku za API, sprawdzenie, gdzie pęka tania, sklepowa konfiguracja. Po miesiącu mam już własne wnioski — i kilka rzeczy, których nie spodziewałem się przed zakupem.

Ten wpis nie jest recenzją sprzętu. To raczej notatka inżynierska o tym, **co da się sensownie zrobić na 16 GB unified memory na M4**, czego nie odpalisz mimo szumu marketingowego, i kiedy wybierać LM Studio, a kiedy Ollamę. Jeżeli rozważasz tę samą drogę albo masz już Maca i chcesz wiedzieć, czy warto inwestować czas w lokalny stack — czytaj dalej.

## Po co w ogóle lokalnie

Pierwsze pytanie, które dostaję od znajomych: „skoro masz subskrypcję Claude'a i klucz do API, po co Ci to?". Odpowiedź ma cztery elementy.

**Prywatność.** Kod klienta, logi z incydentów, fragmenty dokumentów wewnętrznych — wszystko to nie powinno trafiać do żadnego cloudowego dostawcy. Lokalny model uruchomiony na własnej maszynie nie wysyła nic na zewnątrz. To nie paranoja, to zgodność z polityką bezpieczeństwa większości firm, dla których pracuję.

**Brak kosztu per token.** Płacisz raz za prąd. Dla osób generujących setki promptów dziennie (testowanie skilli, agenty, RAG po dokumentacji) to realna różnica.

**Offline.** Nie trzeba dużo, żeby zrozumieć wartość lokalnego modelu — wystarczy raz lecieć pociągiem do Krakowa z padającym Wi-Fi i potrzebować pomocy z regexem.

**Kontrola.** Możesz zmieniać system prompty, kontekst, kwantyzację, parametry samplingu. Możesz fine-tunować pod własne dane. Możesz wyłączyć refusal-e. Frontier modele tego nie dadzą — i dobrze, że nie dają, ale dla researchu to istotne.

Lokalny stack nie jest *zamiast* Claude'a czy GPT-4. Jest *obok*, dla zadań, które frontier model wykonuje przesadnie precyzyjnie i przesadnie drogo.

## Hardware reality check — co realnie da 16 GB unified memory na M4

Apple Silicon ma jedną cechę, która zmienia kalkulacje vs PC: **unified memory**. CPU i GPU dzielą tę samą pulę RAM-u. Nie ma osobnego VRAM-u, nie ma kopiowania tensorów przez PCIe. To wielki plus dla LLM-ów, bo wagi modelu mogą być ładowane raz i serwowane bezpośrednio przez Metal/MLX.

Minus jest banalny, ale brutalny: ile masz, tyle masz. 16 GB to **całość** dla systemu, aplikacji i modelu. Po włączonym macOS-ie, Safari, Slacku i edytorze zostaje ci realnie ~10–12 GB na model. Wszystko, co przekracza ten budżet, albo wyswapuje na SSD i będzie się czołgać, albo nie wystartuje w ogóle.

Praktyczna mapa pamięci dla 16 GB:

- **Modele 3B–4B w q4** (~2–3 GB) — wjeżdża luźno, można obok mieć kontekst, embedder i sensowną listę otwartych aplikacji.
- **Modele 7B–8B w q4** (~5–6 GB) — sweet spot. Działa, zostaje miejsce na 32k–128k kontekstu, M4 daje 30–50 tokenów na sekundę.
- **Modele 13B–14B w q4** (~9–10 GB) — graniczne. Działa, jeśli zamkniesz inne ciężkie procesy. ~12–18 t/s. Komfort spada, ale nie jest fatalnie.
- **Modele 20B w MXFP4** (np. gpt-oss-20b) — to nowość 2026, kwantyzacja MXFP4 daje 4.25 bita na parametr. OpenAI projektowało ten model pod 16 GB pamięci. Działa, choć blisko sufitu.
- **Modele 27B+ dense** — zapomnij. Q4 ważą 16+ GB, Q3 brzydko obniżają jakość.
- **Modele MoE 30B+ totalne** — zależy od szczegółów. Qwen3-Coder-Next (80B total / 3B active) na papierze brzmi obiecująco, ale całe wagi muszą być w pamięci albo offloadowane na SSD, więc realnie nie. Mac Studio z 64+ GB to inna historia.

Co z prędkością? Dla orientacji, na M4 w wariancie z 10-rdzeniowym GPU:

- 3B q4 → ~80–100 t/s (instant feel)
- 7B q4 → ~30–50 t/s (real-time chat)
- 13B q4 → ~12–18 t/s (czytelne, ale czuć)
- 20B MXFP4 → ~15–25 t/s (zaskakująco dobre)

Wnioski? 16 GB to **starter pack**, nie warsztat. Zaspokoi codzienny chat, RAG po dokumentach, lekkie embeddings, asystenta kodu na poziomie autocomplete. Do agentowego workflow'u, w którym ten sam prompt leci 50 razy w pętli, lub do batch processingu dużych zbiorów — będzie boleć. Wtedy patrzy się na Mac Studio z 64–128 GB albo cloud GPU.

## LM Studio — GUI-first, sweet spot dla nietechnicznych

[LM Studio](https://lmstudio.ai/) to aplikacja desktopowa, która wygląda jak coś między iTunes-em a Visual Studio Code. Po pobraniu masz w jednym miejscu: przeglądarkę modeli (z Hugging Face), pobieranie z paskiem postępu, czat z modelem, ustawienia parametrów, suwaki kontekstu i — najważniejsze dla developera — **OpenAI-compatible serwer** uruchamiany jednym kliknięciem na `localhost:1234`.

Co w nim szczególnie cenię na M4:

- **Natywne wsparcie MLX**. To format Apple, który na Apple Silicon jest po prostu szybszy niż klasyczny GGUF. Nowsze modele często pojawiają się w MLX wcześniej niż w innych formatach, a LM Studio potrafi je załadować bez żadnej konfiguracji.
- **Suwaki, nie pliki konfiguracyjne**. Kontekst, temperatura, top-p, penalty — wszystko w UI. Zero `Modelfile`, zero parsowania YAML-a.
- **Multi-model serving**. Możesz mieć w kolejce kilka modeli, przełączać się między nimi w runtime, pożyczać ten sam endpoint dla różnych aplikacji.
- **Chat z plikami**. Drag & drop PDF-a do okna i pytanie — LM Studio robi tymczasowy in-memory RAG. Wystarczające do „streszcz ten papier".

Czego nie ma: prawdziwego CLI. Można odpalać modele z linii komend (`lms`), ale to dodatek, nie główny tryb pracy. Jak chcesz mieć modele w skryptach, w CI, w cron-ach — Ollama będzie wygodniejsza.

LM Studio to mój wybór, gdy ktoś pyta „jak zacząć". Pobieram, klikam jeden model (np. Gemma 4 e4b), włączam serwer, w aplikacji typu Open WebUI wpisuję URL — działa w 10 minut. Niedzielny tinkering, demo na warsztacie, eksploracja nowych modeli — to są moje case'y.

## Ollama — CLI-first, idealna do automatyzacji

[Ollama](https://ollama.com/) ma odwrotny DNA. To narzędzie linii poleceń napisane w Go, które uruchamia daemon na `localhost:11434` i daje ci REST API. UI to są nakładki społeczności, sam projekt celuje w skryptowalność.

```bash
ollama pull qwen2.5-coder:7b
ollama run qwen2.5-coder:7b
```

Tyle. Dwie komendy do pierwszej rozmowy. Jeśli chcesz zmienić zachowanie, piszesz `Modelfile`:

```
FROM qwen2.5-coder:7b
SYSTEM "Jesteś senior QA engineerem. Odpowiadaj zwięźle, bez wprowadzeń."
PARAMETER temperature 0.3
PARAMETER num_ctx 32768
```

```bash
ollama create qa-coder -f ./Modelfile
ollama run qa-coder
```

Customowy model gotowy. To samo można zrobić w skrypcie deploymentowym, w devcontainer, w Dockerze, w GitHub Action.

REST API jest minimalistyczne, ale w 2026 ekosystem dorobił się **OpenAI-compatible warstwy** (`/v1/chat/completions`), więc każda biblioteka napisana pod OpenAI SDK działa bez zmian po podmianie `base_url`. To kluczowe — większość aplikacji typu Cursor, Continue, Open WebUI ma tylko jedno pole „OpenAI base URL", i tam wpisujesz `http://localhost:11434/v1`. Koniec konfiguracji.

W oficjalnym README Ollamy jest lista modeli „w pierwszej kolejności wspieranych": gpt-oss, Qwen3, Gemma 4, DeepSeek, Kimi-K2.5, GLM-5, MiniMax. To dobry znak ekosystemu — projekt nie zostaje w tyle za releasami.

Ollama to mój wybór do pracy. Skille Claude Code wołają lokalny endpoint. Cron rebuilduje codziennie embeddingi. CI w sandboxie podnosi Ollamę i puszcza testy promptów na własnych modelach. Wszystko to da się zrobić w LM Studio, ale niewygodnie. Tu jest natywne.

## Kiedy co

Po miesiącu używania równolegle, prosta heurystyka:

- **Eksploracja nowego modelu, demo, warsztat** → LM Studio. Suwaki, UI, jednoklik.
- **Workflow developerski, integracja z aplikacją, CI, skille** → Ollama. CLI, API, skryptowalność.
- **Apple Silicon i potrzeba MLX** → LM Studio. Ollama dopiero dorabia natywne MLX.
- **Multi-platform stack (Mac + Linux serwer)** → Ollama. LM Studio jest mocno desktopowe.
- **Nie wiesz, co wybrać** → zacznij od LM Studio przez tydzień, potem dolóż Ollamę dla części automatyzowanej.

Te dwa narzędzia nie wykluczają się. Mogą działać równolegle na różnych portach (1234 i 11434). Jedno API dla aplikacji desktopowej, drugie dla skryptów — i nie ma konfliktu o pamięć, bo modele są ładowane na żądanie.

## Granica zdrowego rozsądku

Tu sprawa jest niewdzięczna, ale trzeba ją powiedzieć: **lokalny LLM w klasie 7B–14B nie jest Claude'em ani GPT-4**. Bliżej mu do Claude'a 3 Haiku albo GPT-3.5 sprzed dwóch lat — z istotnym progiem jakości, którego nie przeskoczysz kwantyzacją ani lepszym promptem. Dla wielu zadań to wystarcza. Dla wielu — nie.

Co realnie potrafi 7B q4 na M4 w 2026 roku:

- Streszczenia tekstu, klasyfikacja, ekstraktcja danych — bardzo dobrze.
- Q&A po dokumentacji własnej (RAG) — bardzo dobrze, jeśli embeddings są sensowne.
- Code completion w IDE — dobrze, na poziomie sensownego autocomplete'a.
- Pisanie testów Playwright/pytest z opisu funkcji — przyzwoicie, ale wymaga review.
- Złożone refactory, planowanie architektury, debugging cross-file — słabo.
- Reasoning matematyczny, logika wieloetapowa — tu już Phi-4 14B robi różnicę, ale do frontier daleko.
- Generowanie produkcyjnego kodu „na pierwszy strzał" — nie. Halucynuje API, miesza wersje, zmyśla biblioteki.

Po miesiącu pracy moja zasada brzmi: **lokalny model do tasków, w których koszt błędu jest niski lub natychmiast widoczny**. Sugeruje wartość dla pola w formularzu? OK. Pisze pytest stub? OK, sam zweryfikuję. Klasyfikuje ticket do priorytetu? OK. Pisze production code w wymianie z agentem? Nie, tu wracam do Claude'a.

## Co dalej

Następny wpis pokazuje konkretne modele, które warto pobrać i z czym je porównywałem. Trzeci wpis z serii — Open WebUI jako frontend, który zamienia ten lokalny stack w coś, czego cała rodzina jest w stanie używać bez czytania dokumentacji.

Dla kontekstu — ten lokalny setup wpada [w skali Holaka](/pl/blog/skala-holaka) w okolice warstwy szóstej i siódmej: integruje narzędzia (LM Studio/Ollama jako dostawcy modelu), buduje własny kontekst (RAG, system prompty), ale nie jest jeszcze pełnym agentem. To środkowy poziom dojrzałości, w którym przestajesz traktować LLM jak czarną skrzynkę i zaczynasz świadomie wybierać, **który model do którego zadania**.

Ostateczna myśl: 16 GB Mac mini M4 to maszyna, która **nie zastąpi** twojego głównego workstation, ale **uzupełnia** go w sensowny sposób. Za cenę średniego laptopa dostajesz lokalną stację AI, która działa cicho, jest energooszczędna, i pozwala eksperymentować bez patrzenia na licznik tokenów. Czy warto? Jeżeli generujesz dużo wywołań LLM-ów dziennie albo pracujesz z prywatnymi danymi — tak. Jeżeli używasz LLM-ów dorywczo — taniej zostać przy subskrypcji.
