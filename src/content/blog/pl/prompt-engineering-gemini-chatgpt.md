---
title: "Inżynieria promptów w praktyce - obrazy, wideo, Gemini, Veo i ChatGPT Images bez mitologii"
description: "Inżynieria promptów do obrazów i wideo bez mitologii: jak myśleć o promptach dla Gemini, Imagen, Veo i ChatGPT Images. Prompt jako specyfikacja intencji, nie magiczna formułka."
date: 2026-06-19
tags: ["ai", "prompt engineering", "obrazy ai", "wideo ai", "gemini", "chatgpt"]
lang: pl
readingTime: 11
author: [JS, GH]
---

## Wstęp: prompt engineering to nie sztuczka, tylko specyfikacja intencji

Przy generowaniu obrazów i wideo łatwo wpaść w dwie skrajności. Pierwsza mówi: „prompt nie ma znaczenia, model i tak zrobi po swojemu”. Druga mówi: „istnieje idealna magiczna formułka, która zawsze daje perfekcyjny wynik”. Obie są błędne. Prompt ma ogromne znaczenie, ale nie działa jak zaklęcie. Działa raczej jak specyfikacja: im lepiej opiszesz cel, ograniczenia i kryteria jakości, tym większa szansa, że model trafi w oczekiwany kierunek.

W 2026 roku narzędzia wizualne są już dużo bardziej dojrzałe niż proste generatory obrazków z kilku słów. Google rozwija ekosystem obejmujący m.in. **Imagen**, **Gemini Image / Nano Banana**, **Veo 3.1** i **Gemini Omni**. OpenAI rozwija **ChatGPT Images** i rodzinę **GPT Image**. Te systemy potrafią generować obrazy, edytować istniejące grafiki, korzystać z obrazów referencyjnych, tworzyć wideo z tekstu lub obrazu, a coraz częściej obsługują także iteracyjną rozmowę o zmianach.

To nie oznacza, że można pisać byle jak. Im bardziej zaawansowane narzędzie, tym ważniejsza jest precyzja. Przy prostym obrazku wystarczy „kot w kosmosie”. Przy materiale na bloga, slajdach, kampanii marketingowej, mockupie aplikacji albo filmie produktowym potrzebujemy już opisu kompozycji, stylu, światła, tekstu, proporcji, ograniczeń i tego, czego model nie powinien zmieniać.

Ten artykuł nie jest rankingiem typu „Gemini jest zawsze lepsze” albo „ChatGPT jest zawsze bardziej kreatywny”. Takie porównania szybko stają się nieaktualne. Lepiej zrozumieć, jak myśleć o promptach dla różnych formatów: statycznego obrazu, edycji obrazu, wideo i iteracyjnej pracy konwersacyjnej.

## Najpierw uporządkujmy nazwy, bo tu najłatwiej o bzdury

W szkicach artykułów o AI często pojawiają się nazwy modeli, które brzmią wiarygodnie, ale są pomieszane albo już nieaktualne. Dlatego warto pisać ostrożnie.

W ekosystemie Google mamy kilka powiązanych, ale różnych pojęć. **Imagen** to rodzina modeli do generowania obrazów. Dokumentacja Gemini API opisuje m.in. modele Imagen i ich zasady promptowania. **Gemini Image**, znane marketingowo jako **Nano Banana**, to obrazowy wariant oparty na Gemini, nastawiony na tworzenie i edycję obrazów z użyciem rozumienia multimodalnego. **Veo 3.1** to model generowania wideo, w tym wideo z audio, z obsługą tekstu, obrazu startowego, obrazów referencyjnych, pierwszej i ostatniej klatki oraz rozszerzania wideo. **Gemini Omni** jest prezentowane przez Google DeepMind jako kreatywny, multimodalny kierunek Gemini, łączący rozumowanie, edycję i pracę z różnymi typami wejścia.

Po stronie OpenAI mówimy dziś raczej o **ChatGPT Images** i modelach **GPT Image** niż wyłącznie o DALL·E. DALL·E 3 nadal bywa rozpoznawalną nazwą, ale w aktualnych materiałach developerskich OpenAI główną rodziną dla generowania i edycji obrazów są modele GPT Image. Co ważne, dokumentacja wymienia zarówno `gpt-image-2`, jak i wcześniejsze modele `gpt-image-1.5`, `gpt-image-1` oraz `gpt-image-1-mini`. Dlatego bezpieczniej pisać „ChatGPT Images / GPT Image” niż sugerować, że jeden konkretny model jest zawsze aktualnym standardem dla wszystkich użytkowników.

To uporządkowanie ma znaczenie praktyczne. Inaczej promptujemy statyczny obraz w Imagen, inaczej film w Veo, a jeszcze inaczej iteracyjną edycję w ChatGPT Images. Używanie jednego szablonu do wszystkiego prowadzi do wyników przypadkowych.

## Prompt do obrazu: temat, kontekst, styl i ograniczenia

Dla obrazu statycznego najważniejsze są cztery warstwy: **co ma być na obrazie**, **gdzie to się dzieje**, **w jakim stylu** i **co ma pozostać pod kontrolą**. Google w swoich materiałach o Imagen podkreśla prosty rdzeń: subject, context/background i style. To brzmi banalnie, ale w praktyce rozwiązuje większość problemów początkujących.

Słaby prompt:

> Nowoczesna aplikacja quality dashboard.

Lepszy prompt:

> Realistyczny mockup laptopa na biurku w jasnym biurze. Na ekranie widoczny dashboard jakości oprogramowania z kartami: test coverage, flaky tests, build status i release risk. Styl: nowoczesny produkt SaaS, jasny interfejs, czysta typografia, subtelne cienie, bez logotypów znanych firm.

Drugi prompt jest lepszy, bo definiuje obiekt, środowisko, zawartość, styl i ograniczenie dotyczące marek. Nie mówi tylko „ładnie”. Tłumaczy modelowi, co oznacza „ładnie” w tym kontekście.

W promptach obrazowych warto podawać też parametry fotograficzne, ale z umiarem. „Macro lens”, „wide angle”, „shallow depth of field”, „natural light”, „studio lighting”, „soft shadows” czy „film noir” są użyteczne, gdy naprawdę mają znaczenie. Jeżeli każde zdjęcie opisujemy jako cinematic, ultra detailed, award winning, 8k, masterpiece, to po chwili nie kontrolujemy niczego. Zamiast zwiększać jakość, tworzymy szum.

Dobry szablon promptu obrazowego może wyglądać tak:

> [Format i styl] + [główny obiekt] + [kontekst/tło] + [kompozycja] + [światło/kolor] + [elementy obowiązkowe] + [ograniczenia]

Przykład dla bloga technologicznego:

> Ilustracja redakcyjna do artykułu o testach automatycznych. Główny obiekt: architekt testów analizujący mapę zależności między usługami. Tło: abstrakcyjna sieć modułów backendowych i pipeline CI/CD. Kompozycja pozioma 16:9, centralna postać po lewej, po prawej czytelna mapa połączeń. Kolory: granat, biel, akcenty zielone. Styl: nowoczesna grafika technologiczna, bez fotorealizmu, bez tekstu na obrazie, bez logotypów firm.

Zwróć uwagę na „bez tekstu na obrazie”. Modele są coraz lepsze w renderowaniu tekstu, ale nadal potrafią popełniać błędy, zwłaszcza przy dłuższych frazach i precyzyjnym rozmieszczeniu. Dokumentacja Imagen zaleca przy tekście krótkie frazy, iterację i świadomość, że pozycjonowanie tekstu może się różnić. Dokumentacja OpenAI również wskazuje, że mimo poprawy modele mogą mieć problemy z precyzyjnym rozmieszczeniem i czytelnością tekstu.

Wniosek praktyczny: jeśli potrzebujesz perfekcyjnego tekstu, logo lub UI, często lepiej wygenerować tło bez tekstu, a napisy dodać później w narzędziu graficznym. AI może przygotować kompozycję, klimat i ilustrację, ale finalna typografia nadal bywa zadaniem dla człowieka.

## Prompt do edycji obrazu: co zmienić, czego nie ruszać

Edycja obrazu wymaga innego myślenia niż generowanie od zera. Tutaj najważniejsze jest rozdzielenie dwóch list: **zmień** i **nie zmieniaj**. Jeżeli wrzucasz zdjęcie produktu i prosisz „zrób bardziej premium”, model może zmienić tło, kolor produktu, proporcje, detale albo nawet charakter przedmiotu. Dla inspiracji to może być ciekawe. Dla pracy produkcyjnej to problem.

Lepszy prompt edycyjny:

> Zmień tylko tło i oświetlenie. Produkt, jego kolor, kształt, logo, proporcje i pozycja mają pozostać bez zmian. Dodaj ciepłe światło studyjne, beżowe tło i delikatny cień pod produktem. Nie dodawaj tekstu, znaków wodnych ani dodatkowych przedmiotów.

W pracy z ChatGPT Images albo GPT Image warto powtarzać ograniczenia w kolejnych iteracjach. Nie zakładaj, że model zawsze zachowa wszystkie wcześniejsze warunki, jeśli rozmowa trwa długo. W praktyce dobrze działa zasada: w każdej ważnej iteracji powtórz elementy, które mają pozostać niezmienne. OpenAI w swoich materiałach cookbookowych dla GPT Image 1.5 mocno akcentuje jawne ograniczenia i rozdzielanie zmian od invariantów, czyli rzeczy, które mają pozostać takie same.

To jest bardzo podobne do testowania. Prompt edycyjny powinien mieć swoje kryteria akceptacji. Jeżeli tworzysz grafikę do artykułu, kryteria mogą brzmieć:

- format 16:9,
- brak tekstu,
- brak logo znanych firm,
- styl zgodny z identyfikacją bloga,
- jasne miejsce na nagłówek,
- czytelność w miniaturze,
- brak deformacji ludzi, dłoni, ekranów i elementów UI.

Takie kryteria można wkleić wprost do promptu. Dzięki temu model nie dostaje tylko prośby kreatywnej, ale też warunki jakościowe.

## Prompt do wideo: dochodzi czas, ruch i dźwięk

Wideo nie jest „obrazem plus animacją”. To osobny format. Prompt musi opisać nie tylko scenę, ale też **co dzieje się w czasie**. Dlatego w przypadku Veo 3.1 sensowny prompt powinien uwzględniać temat, akcję, styl, ruch kamery, kompozycję, efekty obiektywu, światło i - jeśli potrzebne - audio.

Google w przewodniku Veo wskazuje elementy takie jak subject, action, style, camera positioning and motion, composition, focus/lens effects oraz ambiance. To jest bardzo praktyczna lista. Można ją potraktować jako checklistę przed wygenerowaniem filmu.

Słaby prompt:

> Zrób film o AI w testowaniu.

Lepszy prompt:

> Krótki film 8-10 sekund, styl realistyczny i nowoczesny. Scena: nocne biuro zespołu QA, na dużym monitorze widać abstrakcyjny pipeline CI/CD i zielone statusy testów. Akcja: kamera powoli przesuwa się od klawiatury do ekranu, na końcu widać architekta testów analizującego dashboard. Ruch kamery: płynny dolly shot, poziom oczu, lekkie zbliżenie. Światło: chłodne światło monitorów, delikatne ciepłe światło z lampki biurkowej. Audio: niski szum biura, ciche kliknięcia klawiatury, bez dialogu. Bez logotypów znanych firm, bez czytelnego tekstu na ekranie.

Taki prompt daje modelowi scenę, ruch i ograniczenia. Jeżeli chcemy wideo produktowe, warto dodać jeszcze: proporcje, tempo, pierwszy kadr, ostatni kadr, obiekty referencyjne i to, czy model ma zachować wygląd osoby lub produktu.

Veo 3.1 obsługuje m.in. generowanie tekst-do-wideo, obraz-do-wideo, obrazy referencyjne, pierwszą i ostatnią klatkę oraz rozszerzanie wcześniejszego wideo. To otwiera sensowny workflow: najpierw generujesz statyczną planszę lub obraz referencyjny, potem używasz go jako punktu startowego do filmu. Dzięki temu nie prosisz modelu o wymyślenie wszystkiego naraz.

Wideo ma jeszcze jeden problem: łatwo wygląda efektownie, ale niezgodnie z celem. Dlatego prompt powinien mieć jasny zamiar. Inaczej piszemy prompt do klimatycznego intro, inaczej do reklamy usługi, inaczej do edukacyjnej animacji, a inaczej do demo produktu. „Cinematic” nie jest strategią. Strategią jest: kto ogląda, co ma zrozumieć i jaką akcję ma wykonać po obejrzeniu.

## Gemini vs ChatGPT: różnice praktyczne, nie wojna religijna

Porównania narzędzi AI często są zbyt kategoryczne. „Gemini jest dosłowny, ChatGPT kreatywny” może być użytecznym skrótem, ale nie powinno być traktowane jak prawo fizyki. Modele się zmieniają, warstwy produktowe też się zmieniają, a wynik zależy od promptu, ustawień, dostępnego modelu i typu zadania.

Bezpieczniej mówić o tendencjach roboczych.

| Obszar | Gemini / Imagen / Gemini Image / Veo | ChatGPT Images / GPT Image |
| :--- | :--- | :--- |
| Generowanie obrazów | Dobre do precyzyjnych opisów sceny, pracy z kontekstem, stylami fotograficznymi i obrazami referencyjnymi. | Dobre do pracy konwersacyjnej, szybkiej iteracji, wariantów kreatywnych i edycji opisanej naturalnym językiem. |
| Wideo | Veo 3.1 jest wyspecjalizowany w generowaniu wideo, ruchu kamery, audio i pracy z klatkami/referencjami. | ChatGPT może pomóc przygotować prompt, scenariusz, storyboard i kryteria oceny, ale samo generowanie wideo zależy od dostępnych narzędzi w danym planie/ekosystemie. |
| Tekst na obrazie | Coraz lepszy, ale nadal warto ograniczać długość i weryfikować wynik. | Również coraz lepszy, ale dokumentacja nadal wskazuje możliwe problemy z czytelnością, rozmieszczeniem i spójnością. |
| Edycja | Mocna, gdy dobrze podamy referencje i ograniczenia. | Mocna w iteracji konwersacyjnej, szczególnie gdy jasno powtarzamy invarianty. |
| Największe ryzyko | Zbyt techniczny prompt bez celu komunikacyjnego. | Zbyt luźny prompt, który pozwala modelowi „upiększyć” wynik kosztem kontroli. |

W praktyce często najlepszy workflow jest mieszany. ChatGPT można wykorzystać do przygotowania briefu, wariantów promptu, checklisty jakości i opisów alternatywnych. Gemini lub Veo można wykorzystać do generowania konkretnego obrazu albo wideo na podstawie dopracowanego briefu. Potem znów można wrócić do LLM-a i poprosić o krytykę wyniku: czy grafika pasuje do artykułu, czy nie jest zbyt stockowa, czy miniatura będzie czytelna, czy nie ma elementów ryzykownych prawnie.

## Jak pisać prompty, które naprawdę pomagają?

Dobra praktyka numer jeden: **zacznij od celu, nie od stylu**. Zamiast „zrób ładną grafikę AI”, napisz: „grafika ma być nagłówkiem artykułu o wykorzystaniu LLM w testowaniu; ma wyglądać profesjonalnie, ale nie korporacyjnie; ma sugerować kontrolę jakości, automatyzację i człowieka w procesie”.

Dobra praktyka numer dwa: **oddziel treść od formy**. Treść to: kto, co, gdzie, jaka sytuacja. Forma to: styl, kolor, obiektyw, światło, kompozycja, proporcje. Jeżeli te elementy są wymieszane, prompt trudniej kontrolować.

Dobra praktyka numer trzy: **podawaj ograniczenia jako kryteria jakości**. Nie tylko „bez chaosu”, ale „maksymalnie trzy główne obiekty, jasne tło, brak tekstu, brak logotypów, czytelne w miniaturze 1200x630”.

Dobra praktyka numer cztery: **iteruj małymi krokami**. Jeśli pierwszy wynik ma dobrą kompozycję, ale złe światło, nie pisz od nowa całego promptu. Poproś o zmianę światła i zachowanie kompozycji. Jeżeli model zmienia za dużo, doprecyzuj invarianty.

Dobra praktyka numer pięć: **testuj prompt jak test case**. Zapisuj wersje promptu i wynik. Jeżeli prompt ma produkować spójny styl dla serii artykułów, potraktuj go jak szablon wielokrotnego użytku. To jest szczególnie ważne dla bloga, który ma mieć rozpoznawalną identyfikację wizualną.

## Przykładowy prompt dla grafiki blogowej

> Stwórz ilustrację nagłówkową 16:9 do artykułu technologicznego na blogu Quality Blog. Temat: wykorzystanie AI do projektowania automatyzacji testów. Styl: nowoczesna ilustracja editorial, czyste linie, lekko techniczny charakter, bez fotorealizmu. Scena: architekt testów stoi przed dużym ekranem z abstrakcyjną mapą testów, pipeline CI/CD i ikonami jakości. Kompozycja: po lewej człowiek, po prawej mapa systemu, dużo wolnej przestrzeni na tytuł. Kolory: jasne tło, granat, biel, akcent zielony. Ograniczenia: bez logo firm, bez czytelnego tekstu, bez znaków wodnych, bez zdeformowanych dłoni, bez twarzy znanych osób.

Ten prompt nie gwarantuje perfekcji, ale daje dobry punkt startowy. Jeżeli wynik będzie zbyt korporacyjny, można zmienić styl na bardziej „hand-drawn technical illustration”. Jeżeli będzie zbyt bajkowy, można dodać „more mature, less playful, professional software engineering tone”.

## Przykładowy prompt dla wideo

> Wygeneruj krótkie wideo 9:16 do social media, 8 sekund. Temat: AI pomaga zespołowi QA szybciej znaleźć ryzyko w release. Pierwsze 2 sekundy: abstrakcyjny dashboard z czerwonymi i zielonymi statusami testów. Sekundy 3-5: kamera przesuwa się do osoby analizującej wynik na laptopie. Sekundy 6-8: czerwone ryzyka grupują się w czytelną mapę, a większość statusów zmienia się na zielone. Styl: realistyczny, nowoczesne biuro, spokojny profesjonalny klimat. Kamera: płynny tracking shot, lekkie zbliżenie. Światło: chłodne światło ekranu, subtelne ciepłe światło boczne. Audio: delikatny ambient technologiczny, bez dialogu. Ograniczenia: bez prawdziwych logo, bez czytelnych danych osobowych, bez migającego chaotycznego tekstu.

W tym promptcie najważniejsza jest oś czasu. Model wie, co ma dziać się w kolejnych sekundach. To zwiększa szansę, że wideo będzie opowiadać mini-historię, a nie tylko pokazywać efektowną scenę.

## Jak oceniać wynik, żeby nie publikować przypadkowej grafiki?

Wizualne AI potrafi wygenerować coś, co na pierwszy rzut oka wygląda świetnie, ale po chwili okazuje się puste albo błędne. Dlatego przed publikacją warto zrobić małe review.

Pytania kontrolne:

- Czy obraz faktycznie wspiera temat artykułu?
- Czy nie wygląda jak generyczny stock?
- Czy nie zawiera przypadkowych napisów, logo lub znaków wodnych?
- Czy jest czytelny jako miniatura?
- Czy nie sugeruje funkcji produktu, których nie opisujemy?
- Czy osoby, urządzenia i interfejsy nie są zdeformowane?
- Czy styl pasuje do innych materiałów na blogu?
- Czy grafika nie wprowadza czytelnika w błąd?

To ostatnie jest bardzo ważne. Jeżeli artykuł jest o testach automatycznych, a grafika pokazuje „AI, które samo certyfikuje release”, to komunikacyjnie przesadzamy. Dobra grafika powinna wzmacniać artykuł, a nie obiecywać więcej niż tekst.

## Podsumowanie: mniej magii, więcej specyfikacji

Najlepsze prompty nie są najdłuższe. Najlepsze prompty są najbardziej świadome. Określają cel, format, odbiorcę, treść, styl, ograniczenia i kryteria jakości. Dla obrazu najważniejsze są temat, kontekst, styl i kompozycja. Dla edycji obrazu - lista zmian i lista rzeczy niezmiennych. Dla wideo - czas, akcja, ruch kamery, atmosfera i audio.

Największy błąd to traktowanie narzędzi wizualnych jak generatora losowych inspiracji, a potem dziwienie się, że wynik nie pasuje do publikacji. Drugi błąd to publikowanie porównań modeli w tonie absolutnym. Gemini, Veo i ChatGPT Images zmieniają się szybko. Dlatego lepiej pisać o praktycznych wzorcach pracy niż o wiecznych przewagach jednego narzędzia nad drugim.

Jeżeli używasz AI do bloga, prezentacji albo materiałów QA, traktuj prompt jak mini brief projektowy. Nie musi być idealny od razu. Ma być wystarczająco jasny, żeby dało się iterować. Wtedy AI przestaje być zabawką do efektownych obrazków, a staje się realnym elementem procesu twórczego.

**Źródła i weryfikacja:**

- [Google AI for Developers - Generate images using Imagen](https://ai.google.dev/gemini-api/docs/imagen)
- [Google AI for Developers - Generate videos with Veo 3.1](https://ai.google.dev/gemini-api/docs/video)
- [Google DeepMind - Gemini Image / Nano Banana](https://deepmind.google/models/gemini-image/)
- [Google DeepMind - Gemini Omni](https://deepmind.google/models/gemini-omni/)
- [OpenAI API Docs - Image generation](https://developers.openai.com/api/docs/guides/image-generation)
- [OpenAI Cookbook - GPT Image 1.5 prompting guide](https://developers.openai.com/cookbook/examples/multimodal/image-gen-1.5-prompting_guide)
