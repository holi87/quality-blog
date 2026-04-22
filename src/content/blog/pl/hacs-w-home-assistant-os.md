---
title: "HACS w Home Assistant OS — po co, dlaczego warto i jak to zainstalować krok po kroku"
description: "Po co HACS w Home Assistant OS, na co uważać, jak zainstalować go krok po kroku i co zainstalować jako pierwsze — uczciwy przewodnik."
date: 2026-04-27
tags: ["smart-home", "home-assistant", "hacs"]
lang: pl
readingTime: 15
---

Jeśli używasz Home Assistant dłużej niż tydzień, prędzej czy później trafisz na forum, film na YouTubie albo wpis na Reddicie, w którym ktoś mówi: „zainstaluj to z HACS-a”. I zwykle jest to wypowiedziane tak mimochodem, jakby każdy użytkownik HA miał HACS-a domyślnie. Nie ma. HACS trzeba zainstalować samemu, a sama instalacja — chociaż w HACS 2.0 stała się zauważalnie prostsza — wciąż nie jest jednoklikowa.

Ten tekst ma być czymś, czego mi samemu brakowało, gdy kilka lat temu zaczynałem: uczciwym przewodnikiem po HACS-ie dla użytkownika Home Assistant OS. Nie tylko „gdzie kliknąć”, ale też „po co to robisz”, „czego HACS **nie** robi” i „na co uważać, żeby nie zepsuć sobie działającej instalacji”. Całość jest pisana z perspektywy realnego setupu domowego — prowadzę HA od lat, mam żółte HA Yellow, kilka Raspberry Pi z Zigbee2MQTT, Shelly Gen4 w kilkudziesięciu punktach w domu i kamery UniFi — więc wiem, jak łatwo popsuć działającą instalację jednym niedobrym klikiem.

Zanim przejdziemy do instalacji: oddam sprawiedliwość temu, że ten post czytasz pewnie dlatego, że już wiesz, iż *chcesz* HACS-a. Ale trzymaj się ze mną przez pierwsze sekcje — bo HACS jest na tyle potężny (i na tyle łatwo go sobie „przestrzelić”), że lepiej wiedzieć, co się zaraz zrobi.

## Co to jest HACS?

HACS to skrót od **Home Assistant Community Store** — Społecznościowego Sklepu Home Assistant. Nazwa jest myląca pod dwoma względami, więc od razu rozbrajam największe mity.

Po pierwsze, HACS **nie jest oficjalnym produktem Home Assistant** w tym sensie, w jakim jest nim sklep z dodatkami (Add-ons) czy wbudowane integracje. Jest to niezależny projekt open source, utrzymywany głównie przez Joakima Sørensena (`ludeeus`) i społeczność. Home Assistant zaczął współpracować z HACS-em oficjalnie dopiero od wersji 2.0 — HACS został przyjęty do Open Home Foundation jako partner, co nadało mu pewien status, ale technicznie wciąż pozostaje zewnętrznym rozszerzeniem.

Po drugie, „sklep” sugeruje, że coś kupujesz. Nie kupujesz. HACS jest darmowy, a wszystko, co przez niego instalujesz, to również darmowe projekty open source hostowane na GitHubie.

Najprościej HACS można opisać jako **menedżer paczek dla Home Assistant** — coś jak `apt` w Debianie, `brew` w macOS czy Chrome Web Store dla przeglądarki. Daje ci wygodny interfejs do wyszukiwania, instalowania, aktualizowania i usuwania społecznościowych rozszerzeń Home Assistant, których nie znajdziesz w oficjalnym repozytorium integracji.

Konkretnie HACS potrafi instalować pięć typów elementów: **integracje** (tzw. custom components — kod w Pythonie dodający obsługę nowych urządzeń i usług), **dashboardy/karty Lovelace** (elementy wizualne do paneli, np. `mini-graph-card`, `mushroom-cards`, `button-card`), **motywy** (kolorystyczne kompozycje dla interfejsu HA), **aplikacje AppDaemon** (zewnętrzne skrypty automatyzacji w Pythonie) oraz **skrypty Pythona** (krótkie fragmenty kodu uruchamiane z poziomu automatyzacji).

## Dlaczego warto to mieć?

Najkrótsza odpowiedź: bo Home Assistant „z pudełka” jest bardzo dobry, ale nie obsługuje wszystkiego i nie wygląda tak, jak byś chciał.

Home Assistant ma setki oficjalnych integracji — i to świetne integracje, utrzymywane przez zespół core. Ale cały ekosystem smart home jest tak szeroki, że niemożliwe jest, żeby 400 wolontariuszy pokryło wszystkie urządzenia, wszystkie usługi i wszystkie pomysły, które przychodzą ludziom do głowy. HACS zapełnia tę lukę. Niektórzy autorzy nie mają po prostu czasu, żeby przejść przez proces akceptacji do oficjalnego repozytorium HA (który wymaga testów, dokumentacji, zgodności z wytycznymi). Inni robią rzeczy, których HA oficjalnie nie akceptuje — na przykład integracje oparte na web scrapingu, gdy dostawca usługi nie udostępnia API (kłania się tu np. wiele integracji z polskimi sieciami energetycznymi, aplikacjami samochodowymi czy lokalnymi serwisami pogodowymi).

Drugi filar HACS-a to **warstwa wizualna**. Domyślny interfejs Home Assistant jest funkcjonalny, ale dość oszczędny. Jeśli widziałeś gdziekolwiek ten piękny, minimalistyczny, nowoczesny dashboard Home Assistant z YouTube’a — masz gwarancję graniczącą z pewnością, że jest zbudowany na jakiejś karcie z HACS-a. `mushroom-cards` dały fali minimalistycznych interfejsów zamach, `button-card` pozwala zrobić praktycznie dowolny przycisk, `mini-graph-card` rysuje o niebo ładniejsze wykresy niż wbudowana karta historii, a `bubble-card` zrewolucjonizował nowoczesne układy panelu. Żadna z tych rzeczy nie jest dostępna bez HACS-a.

Trzeci powód jest bardziej pragmatyczny: **tempo rozwoju**. Oficjalne integracje HA wchodzą w 2-tygodniowym cyklu wydawniczym i muszą być przetestowane. HACS pozwala deweloperom publikować nowe wersje kiedy chcą, co oznacza, że integracja do nowego urządzenia pojawia się w HACS-ie tygodniami albo miesiącami przed tym, jak (o ile w ogóle) trafi do core. Jeśli kupiłeś nową zabawkę IoT i nie ma jej na liście integracji HA, pierwsze miejsce, gdzie warto zajrzeć, to HACS.

Czwarty, trochę ukryty powód — **długa droga do usprawnień**. Niektóre z najbardziej popularnych dziś integracji zaczęły życie w HACS, a dopiero po latach trafiły do oficjalnego HA. HACS jest poligonem, gdzie ciekawe pomysły dojrzewają, zanim staną się mainstreamem.

## Czym HACS **nie** jest

To jest ważne, bo początkujący użytkownicy HA mylą HACS-a z dwoma innymi rzeczami, i ta pomyłka prowadzi do mnóstwa straconego czasu.

**HACS to nie jest sklep z dodatkami (Add-ons).** Dodatki w Home Assistant OS to pełne kontenery Dockera, które działają *obok* Home Assistant — na przykład Mosquitto (broker MQTT), Zigbee2MQTT, AdGuard Home, Node-RED, File editor. One mają swój własny sklep, wbudowany w HAOS, i instaluje się je w `Ustawienia → Dodatki`. HACS nie ma z tym nic wspólnego i nic takiego nie instaluje.

**HACS to nie jest integracja z CHMUrą ani sklep z urządzeniami.** Nie kupisz w nim niczego fizycznego, nie podepniesz konta Google Home ani nic takiego. To repozytorium kodu — wyłącznie kod, który instalujesz do siebie, na swoim sprzęcie, pod swoim dachem.

I ostatni mit: **HACS to nie jest coś, co instaluje się raz i zapomina.** O tym za chwilę w sekcji o ryzykach.

## Czego warto być świadomym, zanim klikniesz „Zainstaluj”

Tu muszę założyć kapelusz inżyniera QA, który podłącza się do mnie na co dzień w pracy. HACS jest potężnym narzędziem, ale wprowadza do twojej instalacji HA kod napisany przez nieznanych ci ludzi. Twórcy HA powtarzają to jak mantrę: *HACS może destabilizować system*. I mają rację.

Po pierwsze, **kod z HACS-a ma pełny dostęp do twojej instalacji Home Assistant**. Może czytać twoje tokeny, stan urządzeń, historię, wszystko. Zanim zainstalujesz integrację, która synchronizuje ci lokalizację telefonu z jakimś egzotycznym serwisem, zastanów się, komu zaufałeś.

Po drugie, **custom components mogą zepsuć aktualizację HA**. Kiedy ekipa core HA zmienia wewnętrzne API (a zmienia regularnie, bo rozwój trwa), wszystkie niezaktualizowane integracje z HACS-a mogą przestać działać albo, w gorszym scenariuszu, uniemożliwić uruchomienie HA po restarcie. Nie żartuję — widziałem to na własnym systemie i widziałem to u znajomych. Dlatego **zawsze** przed aktualizacją HA warto sprawdzić release notes pod kątem sekcji „Breaking Changes” i spojrzeć, czy któraś z twoich integracji z HACS-a nie jest wymieniona jako źródło problemów.

Po trzecie, **projekty z HACS-a są porzucane**. Autor zainteresuje się czymś innym, zmieni pracę, straci motywację — i integracja przestaje być rozwijana. Kiedy przeglądasz HACS-a, zwracaj uwagę na datę ostatniej aktywności repozytorium. Jeśli od commita minął rok, to sygnał ostrzegawczy. Jeśli trzy lata — odpuść sobie, chyba że naprawdę nie ma alternatywy.

Po czwarte, **kopia zapasowa przed instalacją to nie sugestia, to wymóg**. W Home Assistant OS masz wbudowany mechanizm backupów (`Ustawienia → System → Kopie zapasowe`). Przed instalacją HACS-a i przed każdą większą operacją z HACS-em wykonaj backup i — to ważne — **pobierz go na inne urządzenie**. Kopia zapasowa, która leży na tym samym dysku co rozwalony system, ma ograniczoną wartość.

Jeśli po tych ostrzeżeniach uznałeś, że jesteś gotowy, a twoja instalacja jest stabilna i masz świeży backup — jedziemy.

## Czego potrzebujesz przed instalacją

Zestaw wymagań jest krótki, ale kompletny:

1. **Działająca instalacja Home Assistant OS (albo Supervised).** Ta instrukcja dotyczy HAOS — dla wersji Container albo Core procedura jest inna (tam używa się skryptu `wget -O - https://get.hacs.xyz | bash -` z poziomu kontenera lub terminala). Jeśli nie wiesz, jakiego typu masz instalację, zatrzymaj się i sprawdź w `Ustawienia → System → Informacje`. Dokumentacja HACS-a mówi wprost: jeśli nie wiesz, czego używasz, nie powinieneś instalować HACS-a.
2. **Home Assistant w miarę aktualny.** HACS 2.0 działa z każdą w miarę świeżą wersją HA, ale dla bezpieczeństwa warto być co najmniej na ostatnim wydaniu z poprzedniego kwartału.
3. **Konto GitHub.** Obowiązkowe. HACS pobiera paczki z GitHuba i wymaga autoryzacji przez twoje konto. Jeśli nie masz, załóż przed instalacją na `github.com/signup` — jest darmowe i nie trzeba nic więcej. Kilka pytań, które często słyszę: nie, konto nie musi być publiczne; nie, nie musisz nic tam pushować; nie, HACS nie dostaje dostępu do twoich repo.
4. **Świeża kopia zapasowa HA pobrana na inne urządzenie.** Powtarzam się, ale nie za wiele razy.
5. **Dostęp do interfejsu HA z poziomu przeglądarki.** Nie SSH, nie aplikacja mobilna na tym etapie — pełna przeglądarka, bo będziemy wchodzić w konfiguracje i kopiować kod urządzenia GitHuba.

## Instalacja HACS w Home Assistant OS — krok po kroku

Od HACS 2.0 (sierpień 2024) proces jest sporo prostszy niż kiedyś. Dawniej trzeba było instalować Terminal & SSH, wchodzić po SSH, pobierać pliki przez `wget`, restartować — dziś większość tego robi za ciebie dedykowana „aplikacja” w sklepie HA.

Zanim zaczniesz, kilka słów o nazewnictwie. W najnowszej dokumentacji HACS używa się terminu „app” (aplikacja) zamiast dawnego „add-on” (dodatek). W interfejsie polskim Home Assistant prawdopodobnie zobaczysz „Dodatek” albo „Dodatki” — traktuj to jak to samo. W niektórych wersjach HAOS menu nazywa się `Ustawienia → Dodatki`, w innych `Ustawienia → Aplikacje`.

### Krok 1. Zrób backup (serio)

`Ustawienia → System → Kopie zapasowe → Utwórz kopię zapasową`. Wybierz **Pełna kopia zapasowa**. Poczekaj, aż się wykona — w zależności od wielkości twojej instalacji może to zająć od kilku sekund do kilkunastu minut. Po zakończeniu kliknij na nazwę backupu i **Pobierz** na swój komputer. Pobrany plik `.tar` trzymaj w bezpiecznym miejscu. Gdy cokolwiek pójdzie nie tak w kolejnych krokach, masz do czego wrócić.

### Krok 2. Dodaj repozytorium HACS do sklepu dodatków

Otwórz Home Assistant w przeglądarce i przejdź do `Ustawienia → Dodatki → Sklep z dodatkami`. W prawym górnym rogu kliknij ikonę z trzema kropkami (menu) i wybierz **Repozytoria**.

W otwartym oknie wklej adres:

```text
https://github.com/hacs/addons
```

Kliknij **Dodaj**, a następnie zamknij okno. Sklep z dodatkami odświeży się automatycznie i po chwili w dole listy pojawi się nowa sekcja o nazwie **Home Assistant Community Store (HACS)** z jednym dodatkiem w środku: **Get HACS**.

Jeśli nowa sekcja nie pojawia się od razu, wykonaj twarde odświeżenie przeglądarki (`Ctrl+Shift+R` na Windows/Linux, `Cmd+Shift+R` na macOS). To znany drobiazg — interfejs HA czasem cache’uje listę dodatków.

### Krok 3. Zainstaluj dodatek „Get HACS”

Kliknij na dodatek **Get HACS** i w nowym ekranie wybierz **Zainstaluj**. Instalacja zajmuje chwilę (z reguły mniej niż minutę).

Warto zaznaczyć: **ten dodatek nie jest samym HACS-em**. To tylko skrypt instalacyjny, który kopiuje właściwy kod HACS-a do twojego `/config/custom_components/hacs/` i przygotowuje wszystko do działania. Po jednorazowym uruchomieniu jego zadanie jest wykonane i nie musi działać stale.

### Krok 4. Uruchom dodatek i sprawdź logi

Po instalacji zostaniesz na stronie dodatku. Zostaw **Rozpocznij przy starcie** wyłączone (nie potrzebujesz tego) i kliknij **Uruchom**. Dodatek wystartuje, zrobi swoją robotę i po chwili sam się zatrzyma.

Teraz **najważniejsze**: kliknij w zakładkę **Log** (albo **Dziennik**, zależnie od języka) tego dodatku. Przewiń log w dół. Jeśli wszystko poszło dobrze, zobaczysz komunikat przypominający:

```text
[info] Installation complete.
[info] Remember to restart Home Assistant before you configure it.
```

Jeśli zamiast tego widzisz błędy (np. odmowę dostępu do GitHuba, timeout sieciowy) — to najczęściej problem z połączeniem internetowym twojego HA albo z DNS-em. Zrestartuj router, sprawdź `Ustawienia → System → Sieć` i spróbuj ponownie uruchomić dodatek.

### Krok 5. Zrestartuj Home Assistant

Przejdź do `Deweloper → YAML` (albo `Programista → YAML`) i kliknij **Zrestartuj Home Assistant**. Alternatywnie: `Ustawienia → System → góra strony → Uruchom ponownie → Uruchom ponownie Home Assistant`. Ważne — potrzebny jest restart **Home Assistant Core**, nie całego hosta.

Restart zajmuje zwykle 30-90 sekund. Poczekaj, aż interfejs wróci i poprosi cię o zalogowanie.

### Krok 6. Dodaj integrację HACS

Teraz trzeba dopiąć HACS-a do HA jako integrację. Przejdź do `Ustawienia → Urządzenia i usługi`.

**Uwaga**: bardzo często w tym miejscu HACS „nie widać” na liście dostępnych do dodania integracji, nawet jeśli poprawnie zainstalowałeś wszystko powyżej. Dokumentacja HACS-a wymienia to wprost: musisz **wyczyścić cache przeglądarki** albo wykonać twarde odświeżenie strony (`Ctrl+Shift+R`). Potem działa.

W prawym dolnym rogu kliknij **+ Dodaj integrację**. W wyszukiwarce wpisz `HACS` i wybierz go z listy.

Pokaże ci się okienko z kilkoma zgodami do zaznaczenia. Standardowo zaznaczasz wszystkie — to potwierdzenia, że rozumiesz, że HACS to niezależny projekt, że wprowadza custom kod, i że robisz backupy. Po potwierdzeniu kliknij **Wyślij**.

### Krok 7. Autoryzacja z GitHubem

Teraz najciekawszy moment. HACS używa tzw. **OAuth Device Flow** — metody uwierzytelniania, która nie wymaga żeby HA „widział” twoje hasło GitHuba. Zamiast tego dostajesz krótki kod (8 znaków), który wpisujesz ręcznie na stronie GitHuba.

Zobaczysz komunikat podobny do:

> Aby kontynuować, otwórz https://github.com/login/device i wprowadź kod: `XXXX-XXXX`

Skopiuj ten kod. W nowej karcie otwórz `https://github.com/login/device`. Jeśli nie jesteś zalogowany na GitHubie — zaloguj się teraz (albo załóż konto).

Wklej kod w odpowiednie pole, kliknij **Continue**. Na kolejnym ekranie zobaczysz informację, że aplikacja HACS prosi o dostęp. Kliknij **Authorize HACS**.

Po chwili zobaczysz potwierdzenie. Możesz zamknąć tę kartę i wrócić do Home Assistant.

### Krok 8. Przypisz obszar i zakończ

Home Assistant poprosi cię o przypisanie HACS-a do jakiegoś obszaru (Area). Nie jest to szczególnie ważne z technicznego punktu widzenia — HACS to nie urządzenie, tylko integracja systemowa. Możesz wybrać obszar „Studio”, „Serwerownia” albo po prostu zostawić pusto. Kliknij **Zakończ**.

**Gotowe.** W lewym menu bocznym (sidebar) po chwili pojawi się nowa pozycja: **HACS** z charakterystyczną ikoną. Jeśli nie widzisz jej od razu — znowu twarde odświeżenie przeglądarki.

## Pierwsze minuty z HACS-em

Po kliknięciu w HACS w menu trafisz na główny ekran ze zakładkami na górze: **Integrations**, **Frontend**, **Automations**, **Themes** (zależnie od wersji nazewnictwo się nieco zmienia). Przy pierwszym uruchomieniu HACS pobierze listę repozytoriów i zindeksuje ją — to może trochę potrwać, bo baza ma tysiące projektów. Widzisz wtedy wyszukiwarkę i filtry.

Na początek polecam zrobić dwie rzeczy.

**Pierwsza: nie instaluj niczego przez najbliższych 15 minut.** Poklikaj, pooglądaj. HACS ma uzależniający efekt „sklepu z cukierkami” — wszystko wydaje się fascynujące i chcesz wszystko. Pamiętaj, że każda zainstalowana integracja to jedna rzecz więcej, która może się zepsuć przy aktualizacji HA.

**Druga: przejrzyj sekcję Explore, posortuj po liczbie instalacji i zobacz, co ma największą popularność**. To, co instalują dziesiątki tysięcy użytkowników, jest zwykle dobrze utrzymane i przetestowane. Przykłady, na które na pewno traficsz: `HACS Frontend`, `Mushroom`, `Mini Graph Card`, `Button Card`, `Browser Mod`, `Card Mod`, `Adaptive Lighting`, `Alarmo`, `Spook`.

Gdy znajdziesz coś, co chcesz zainstalować, klikasz w nie i wybierasz **Download** (albo **Install**). HACS pobierze pliki. Co do zasady **każda zmiana w HACS-ie wymaga restartu Home Assistant**, żeby kod został faktycznie załadowany. Po instalacji integracji (custom component) idziesz do `Ustawienia → Urządzenia i usługi → Dodaj integrację` i konfigurujesz ją tak samo, jak każdą oficjalną integrację HA. W przypadku kart Lovelace i motywów — zmiany pojawią się automatycznie po odświeżeniu dashboardu, chociaż czasem też trzeba zrestartować HA.

## Aktualizacje i utrzymanie

Gdy autor którejś z twoich integracji wyda nową wersję, HACS powiadomi cię o tym przez standardowy mechanizm aktualizacji Home Assistant. Zobaczysz czerwoną kropkę w `Ustawienia` i listę dostępnych aktualizacji, identycznie jak przy aktualizacji samego HA. To jedna z większych nowości HACS 2.0 — wcześniej powiadomienia były osobne, schowane w interfejsie HACS.

Moja rekomendacja: **nie aktualizuj wszystkiego na raz**. Aktualizuj integracje pojedynczo, odczekaj dzień czy dwa i sprawdzaj, czy nic się nie psuje. To samo dotyczy aktualizacji samego HA — jeśli właśnie wyszła nowa wersja core, daj jej tydzień, żeby deweloperzy z HACS-a zaktualizowali swoje projekty. Aktualizacja HA i dziesięciu integracji z HACS-a naraz to prosta droga do spędzenia sobotniego wieczoru na rollbackach.

HACS sam w sobie też się aktualizuje — jako „zwykła” integracja. Kiedy wyjdzie nowa wersja, zobaczysz powiadomienie, klikasz zainstaluj, restartujesz HA.

## Typowe problemy i szybkie rozwiązania

Jeśli coś poszło nie tak, najczęstsze scenariusze wyglądają tak.

**„Nie widzę HACS-a na liście integracji po restarcie.”** Prawie zawsze winny jest cache przeglądarki. Zrób `Ctrl+Shift+R`, zamknij wszystkie karty HA, otwórz na nowo. Jeśli dalej nic — sprawdź w logach HA (`Ustawienia → System → Dzienniki`), czy nie ma błędu związanego z `hacs`.

**„Dodatek Get HACS wyrzuca błąd przy pobieraniu”.** Sprawdź połączenie sieciowe HA z internetem. Najłatwiej: uruchom w `Deweloper → Usługi` usługę `homeassistant.check_config` — jeśli działa, HA ma internet. Jeśli nie, problem jest sieciowy. Sprawdź DNS (AdGuard, Pi-hole, własny DNS na routerze — wszystko to może blokować niektóre domeny).

**„Autoryzacja GitHuba nie chce zadziałać, kod wygasa za szybko.”** Kod jest ważny 15 minut. Jeśli zasiadłeś do tego z przerwami — po prostu wyjdź z ekranu konfiguracji integracji, dodaj integrację HACS od nowa i powtórz proces. Dostaniesz nowy kod.

**„HACS się zainstalował, ale po restarcie HA nie startuje.”** Najgorszy scenariusz, ale rozwiązywalny. Najpierw spróbuj przez SSH (dodatek Terminal & SSH z zaawansowanego trybu) zajrzeć do logów HA (`cat /config/home-assistant.log`). Jeśli widzisz jasno, że winna jest któraś integracja z custom_components, usuń jej katalog przez SSH i zrestartuj. Jeśli nie wiesz, co się stało — przywracasz backup z kroku 1.

**„HACS działał, a po ostatniej aktualizacji HA przestał.”** To klasyka po dużych wydaniach HA. Dokumentacja HACS-a ma osobną sekcję „HA update broke my HACS” — zwykle wystarczy poczekać dzień-dwa na aktualizację samego HACS-a albo problematycznej integracji. Jeśli nie możesz czekać, zawsze jest opcja przywrócenia backupu sprzed aktualizacji HA.

## Co zainstalować na początek

Żeby nie zostawiać cię z pustym interfejsem, moje subiektywne rekomendacje na pierwsze kilka instalacji — rzeczy, które prawie każdy użytkownik HA doceni.

Jeśli chcesz ładniejszy wygląd dashboardów: **Mushroom Cards** (nowoczesny, minimalistyczny styl), **Mini Graph Card** (wykresy historii znacznie ładniejsze od wbudowanych), **Button Card** (elastyczne przyciski z dowolną zawartością) i **Card Mod** (pozwala dorzucić CSS do dowolnej karty — gdy jesteś gotowy na więcej kontroli).

Jeśli masz oświetlenie: **Adaptive Lighting**. To integracja, która automatycznie dostosowuje barwę i jasność świateł do pory dnia, symulując naturalne światło słoneczne. Po dwóch tygodniach przestaniesz pamiętać, że kiedyś miałeś ten sam biały kolor lamp całą dobę.

Jeśli interesuje cię alarm: **Alarmo**. Pełna obsługa stref, kodów użytkowników, opóźnień, integracji z czujnikami ruchu i otwarcia. Robi z HA normalny system alarmowy.

Jeśli chcesz większej kontroli nad interfejsem: **Browser Mod** — pozwala sterować tym, co dzieje się w przeglądarce użytkownika (np. przełączyć kafelek na konkretnym tablecie, kiedy ktoś dzwoni do drzwi). Genialne rzeczy w automatyzacjach.

I jedna rzecz, która trochę nie jest „must have”, ale bardzo mi się podoba: **Spook**. Rozszerza HA o wiele dodatkowych usług (services), których brakuje w core — np. czyszczenie nieużywanych encji, naprawianie zepsutych integracji, rozszerzone akcje. Nazywam to „szwajcarskim scyzorykiem dla HA”.

Każde z nich to osobny temat na osobny post. Ale jeśli chcesz od razu zobaczyć, co HACS potrafi — od tego bym zaczął.

## Podsumowanie

HACS to coś, bez czego zaawansowana instalacja Home Assistant praktycznie nie istnieje. Daje dostęp do ekosystemu kilku tysięcy społecznościowych projektów — od integracji do urządzeń, których HA oficjalnie nie obsługuje, po wizualne elementy, które zmienią twój dashboard z „funkcjonalnego” w „pokazuję to każdemu, kto wejdzie”. Cena za tę moc to odpowiedzialność: kod od nieznanych autorów, ryzyko destabilizacji przy aktualizacjach, konieczność pilnowania, co masz zainstalowane, i twarda higiena backupów.

Jeśli przeszedłeś przez tę instrukcję, masz już HACS-a działającego i masz przed sobą kilka wieczorów ciekawej zabawy. Moja ostatnia rada jest banalna, ale naprawdę kluczowa: **nie instaluj zbyt wielu rzeczy naraz i testuj po każdej instalacji**. Minimalizm w HACS-ie popłaca długofalowo. Lepiej mieć pięć solidnie sprawdzonych rozszerzeń niż trzydzieści, z których połowa nie działa.

Powodzenia — i nie zapomnij zrobić kolejnego backupu, zanim zaczniesz klikać.
