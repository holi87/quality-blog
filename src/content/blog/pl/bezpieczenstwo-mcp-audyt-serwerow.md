---
title: "Bezpieczeństwo MCP: co grozi, gdy podpinasz cudze serwery, i jak je audytować"
description: "Serwer MCP to cudzy kod z twoimi uprawnieniami i treści trafiające prosto do kontekstu modelu. Klasy ryzyka, lista kontrolna audytu przed podpięciem i proces dla zespołu."
date: 2026-08-27
tags: ["ai", "mcp", "bezpieczenstwo", "audyt", "claude-code"]
lang: pl
readingTime: 13
author: GH
---

Podpięcie serwera MCP do Claude Code to pięć linijek konfiguracji i dwie minuty pracy. Ta łatwość jest zwodnicza, bo techniczna prostota nie ma nic wspólnego ze skalą decyzji: właśnie uruchomiłeś cudzy kod z własnymi uprawnieniami i dałeś mu stały kanał komunikacji z modelem, który działa w twoim imieniu. Przez ostatni rok przeglądałem serwery MCP przed podpięciem ich do agentów - swoich i zespołowych - i wypracowałem procedurę, którą tu opisuję w całości. To tekst defensywny: nie znajdziesz w nim instrukcji ataku, znajdziesz listę kontrolną obrony i proces, który da się pokazać działowi bezpieczeństwa bez rumieńców.

## Serwer MCP to dwie powierzchnie ataku naraz

Klasyczny model zaufania do wtyczek jest prosty: instalujesz cudzy kod, więc ufasz autorowi, że ten kod nie robi nic złego. Rozszerzenia przeglądarki, paczki npm, wtyczki do edytora - wszędzie ta sama umowa. Serwer MCP podpada pod tę umowę w całości: to proces uruchamiany zwykle na twojej maszynie, z twoimi uprawnieniami, z dostępem do wszystkiego, do czego ma dostęp twój użytkownik systemowy.

Ale MCP dokłada drugą powierzchnię, której klasyczne wtyczki nie miały: wszystko, co serwer zwraca, trafia prosto do kontekstu modelu. Opisy narzędzi wchodzą do kontekstu już w momencie połączenia. Wyniki wywołań wchodzą do niego przy każdym użyciu. A kontekst jest dla modelu jedyną rzeczywistością - model nie odróżnia w nim danych od poleceń tak ostro, jak byśmy chcieli. Serwer MCP może więc zaszkodzić na dwa niezależne sposoby: jako kod, który robi coś złego na twojej maszynie, i jako treść, która skłania agenta do zrobienia czegoś złego twoimi rękami.

Z tej podwójności wynika cała reszta tego tekstu. Audyt, który sprawdza tylko kod, jest połowiczny; audyt, który sprawdza tylko treści, także. Pisałem już o tym, [kiedy MCP w ogóle się opłaca](/pl/blog/mcp-kiedy-warto-kiedy-overengineering/) - dziś zakładam, że decyzja "tak, potrzebujemy" już padła, a pytanie brzmi: czy temu konkretnemu serwerowi można zaufać.

## Klasy ryzyka, które warto znać z nazwy

Zanim przejdę do listy kontrolnej, nazwę zagrożenia, bo dobrze nazwane ryzyko łatwiej wykryć i łatwiej o nim rozmawiać z zespołem.

- **Złośliwy lub przejęty serwer.** Najstarsza klasa problemu: łańcuch dostaw. Serwer MCP to paczka z npm albo pip, a paczki bywają podmieniane, przejmowane po wygaśnięciu konta opiekuna albo publikowane pod nazwą łudząco podobną do popularnego projektu. Nic w tym specyficznego dla AI - specyficzna jest skala, bo zespoły pracujące z agentami instalują więcej cudzego kodu szybciej niż kiedykolwiek, często na maszynach z kluczami do środowisk produkcyjnych.
- **Zatrucie opisów narzędzi (ang. tool poisoning).** Opis narzędzia to nie dokumentacja dla człowieka, tylko fragment promptu dla modelu. Złośliwy serwer może umieścić w opisie instrukcje niewidoczne przy zwykłym użyciu: polecenie dołączania określonych danych do parametrów wywołań albo modyfikowania zachowania agenta przy zupełnie innych zadaniach. Człowiek rzadko czyta opisy narzędzi w całości; model czyta je zawsze.
- **Pośrednie wstrzyknięcie promptu przez wyniki narzędzi.** Serwer może być uczciwy, a i tak stać się kanałem ataku, bo zwraca treści z niezaufanych źródeł: strony internetowe, zgłoszenia, komentarze, dokumenty. Jeśli ktoś umieścił w tych treściach polecenia dla modelu, agent może je potraktować jak własne zadanie. Rozbierałem ten mechanizm szczegółowo we wpisie o [prompt injection dla testerów](/pl/blog/prompt-injection-dla-testerow-owasp-llm/); tu wystarczy zapamiętać, że uczciwy serwer nie oznacza bezpiecznych treści.
- **Nadmiarowe uprawnienia.** Serwer "do sprawdzania pogody", którego konfiguracja wymaga dostępu do systemu plików i wszystkich zmiennych środowiskowych, nie musi być złośliwy - wystarczy, że jest niechlujny. Każde nadmiarowe uprawnienie to powierzchnia, którą kiedyś wykorzysta ktoś inny: przez błąd w serwerze, przez zatrute treści, przez przejętą paczkę.
- **Cicha podmiana (ang. rug pull).** Serwer był uczciwy w dniu audytu i to niczego nie gwarantuje. Aktualizacja może zmienić opisy narzędzi, dodać nowe narzędzia albo zmienić zachowanie istniejących - a jeśli instalujesz automatycznie wersję "najnowszą", zaakceptowałeś z góry wszystkie przyszłe wydania, których nikt jeszcze nie widział.

Wspólny mianownik jest niewygodny: żadna z tych klas nie wymaga błędu po twojej stronie. Wystarczy, że podpinasz i używasz zgodnie z instrukcją.

## Audyt przed podpięciem: lista kontrolna

Oto procedura, którą stosuję przed podpięciem każdego nowego serwera. Dla typowego przypadku zajmuje od pół godziny do godziny - mniej niż obsługa jednego incydentu z wyciekiem tokenu.

1. **Kto to utrzymuje i czy repozytorium żyje.** Oficjalny serwer dostawcy usługi, projekt znanej organizacji czy anonimowe konto z jednym repozytorium? Ilu opiekunów, jak często wychodzą wydania, czy zgłoszenia dostają odpowiedzi, czy historia zmian wygląda na pracę zespołu, czy na jednorazowy zrzut kodu. Serwer pisany hobbystycznie nie jest z definicji zły, ale wymaga dokładniejszego przejrzenia, bo nikt inny go nie przejrzał.
2. **Co serwer czyta i pisze.** Przejrzyj kod źródłowy pod kątem operacji na plikach, wywołań sieciowych i uruchamiania procesów. Jeśli kodu jest za dużo, przeczytaj przynajmniej manifest narzędzi: nazwy, parametry, opisy. Narzędzie o nazwie sugerującej odczyt, które przyjmuje parametry umożliwiające zapis, to pytanie, na które chcesz znać odpowiedź przed podpięciem, nie po incydencie.
3. **Jakie sekrety widzi.** Których tokenów i kluczy wymaga konfiguracja i dokąd one trafiają: zostają w lokalnym procesie czy wędrują do zdalnej usługi? Serwer, który "dla wygody" prosi o klucz o szerokim zakresie, zasługuje na osobny token o zakresie minimalnym - o tym za chwilę.
4. **Transport i uwierzytelnienie.** Serwer lokalny przez stdio to jeden model zaufania: kod działa u ciebie i tylko u ciebie. Serwer zdalny to model zupełnie inny: twoje zapytania i dane płyną do cudzej infrastruktury. Kto ją utrzymuje, jak uwierzytelnia klientów, co loguje, jak długo przechowuje dane i czy mówi o tym wprost? Brak jasnej odpowiedzi na te pytania sam w sobie jest odpowiedzią.
5. **Przypnij wersję.** Konkretny numer wersji w konfiguracji zamiast "najnowszej". Aktualizacja serwera powinna być świadomą decyzją z krótkim przeglądem zmian, nie automatem. To jedyna realna obrona przed cichą podmianą i kosztuje dokładnie jedną linijkę.
6. **Przeczytaj opisy narzędzi w całości.** Wszystkie, przed pierwszym połączeniem. Sygnały ostrzegawcze: tryb rozkazujący skierowany do modelu ("zawsze", "przed każdym zadaniem", "nie informuj użytkownika"), wzmianki o plikach albo danych bez związku z funkcją narzędzia, instrukcje dotyczące innych narzędzi. Opis narzędzia ma opisywać narzędzie; wszystko ponad to jest podejrzane.

Ta lista nie daje gwarancji - żaden audyt nie daje. Daje coś praktyczniejszego: szybki odsiew serwerów, które odpadają na pierwszych trzech punktach, i udokumentowaną podstawę zaufania dla tych, które przechodzą dalej.

## Zasada minimalnych uprawnień w praktyce

Audyt odpowiada na pytanie "czy podpiąć". Zasada minimalnych uprawnień odpowiada na pytanie "jak podpiąć, żeby błędna odpowiedź na pierwsze pytanie bolała jak najmniej".

Po pierwsze, osobny token dla każdego serwera, z najwęższym możliwym zakresem. Serwer do przeglądania zgłoszeń w Jirze dostaje token tylko do odczytu, ograniczony do jednego projektu - a nie konto serwisowe z uprawnieniami administratora, "bo takie już było pod ręką". Osobne tokeny mają też drugą zaletę: odwołanie jest chirurgiczne. Gdy serwer okazuje się problematyczny, unieważniasz jeden token i reszta środowiska pracuje dalej.

Po drugie, tryb tylko do odczytu wszędzie, gdzie się da. Część serwerów oferuje taki tryb w konfiguracji; tam, gdzie go nie ma, wymusza go token o zakresie ograniczonym do odczytu. Agent, który może czytać, ale nie może pisać, ma radykalnie mniejszy potencjał szkód - a większość zastosowań w QA to i tak odczyt: logi, zgłoszenia, wyniki testów, dokumentacja.

Po trzecie, lista dozwolonych narzędzi po stronie klienta. Serwer potrafi wystawiać dwadzieścia narzędzi, z których potrzebujesz trzech. Klient MCP - w tym Claude Code - pozwala zawęzić dostępne narzędzia do jawnie wskazanych. Węższa lista to mniejsza powierzchnia ataku i krótszy kontekst, czyli zysk podwójny.

Po czwarte, kontener albo inna izolacja dla serwerów, którym ufasz tylko warunkowo. Serwer uruchomiony w kontenerze bez dostępu do systemu plików gospodarza, z siecią ograniczoną do potrzebnych adresów, może być złośliwy do woli - zasięg szkód wyznacza ściana kontenera, a nie dobra wola autora.

Po piąte, i to uważam za najważniejsze: rozdziel agenta z dostępem do prywatnych danych od agenta czytającego niezaufane treści. Agent, który jednocześnie widzi twoje repozytoria i sekrety, czyta treści z internetu i może wysyłać dane na zewnątrz, łączy trzy składniki incydentu w jednym procesie. Rozbij ten trójkąt: agent od poszukiwań w sieci czyta niezaufane treści, ale nie widzi sekretów; agent z sekretami nie dotyka surowych treści z zewnątrz. To rozdzielenie bywa niewygodne i właśnie dlatego działa.

## Sygnały ostrzegawcze w działaniu

Audyt przed podpięciem to połowa pracy; druga połowa to uważność w trakcie używania. Trzy sygnały, przy których przerywam pracę i sprawdzam, co się właściwie dzieje:

- **Narzędzie prosi o dane bez związku z zadaniem.** Agent nagle chce przekazać do narzędzia zawartość pliku konfiguracyjnego, token albo fragment kodu, choć zadanie tego nie wymaga. Może to być nieszkodliwa nadgorliwość modelu - a może skutek instrukcji zaszytej w opisie narzędzia. Zanim zatwierdzisz wywołanie, przeczytaj, co dokładnie agent chce wysłać i dokąd.
- **Lista narzędzi zmienia się po aktualizacji.** Nowe narzędzia, zmienione opisy, rozszerzone parametry. Jeśli przypiąłeś wersje, taka zmiana zawsze zbiega się ze świadomą aktualizacją i jest częścią jej przeglądu. Jeśli lista zmienia się "sama", właśnie dowiedziałeś się, że nie kontrolujesz wersji swojego serwera.
- **Wyniki zawierają polecenia dla modelu.** Fragmenty zaadresowane do agenta, a nie do ciebie: instrukcje wywołania innych narzędzi, prośby o pominięcie wcześniejszych ustaleń, tekst udający komunikat systemowy. To nie ciekawostka, tylko trwający incydent: odłącz serwer, zachowaj zapis sesji i ustal, skąd przyszła ta treść.

Warunkiem zauważenia czegokolwiek jest telemetria, choćby najprostsza: dziennik wywołań narzędzi - które narzędzie, z jakimi parametrami, co zwróciło. Claude Code zapisuje przebieg sesji lokalnie; w środowisku zespołowym warto taki zapis zbierać centralnie. Bez tego incydentu nie da się odtworzyć i nie nauczysz się z niego niczego.

## Proces dla zespołu

Indywidualna higiena nie skaluje się na zespół; skaluje się proces. Cztery elementy wystarczą na start:

- **Rejestr zatwierdzonych serwerów.** Plik w repozytorium: nazwa serwera, przypięta wersja, zakres uprawnień, data audytu, właściciel. Nowa osoba w zespole podpina to, co jest w rejestrze, i wie, że ktoś to wcześniej sprawdził.
- **Przegląd przed dodaniem.** Kandydat na nowy serwer przechodzi listę kontrolną z tego tekstu, a wynik ogląda druga osoba - dokładnie tak, jak przegląda się kod. Dobrym pierwszym kandydatem jest [prosty serwer do wyszukiwania i pobierania treści](/pl/blog/pierwszy-mcp-dla-qa-search-fetch/), bo jego powierzchnię łatwo zrozumieć w całości.
- **Właściciel dla każdego serwera.** Konkretna osoba śledzi wydania, decyduje o aktualizacjach i robi przegląd zmian przed podniesieniem wersji. "Wszyscy" jako właściciel oznacza w praktyce "nikt".
- **Przegląd okresowy.** Raz na kwartał: czy serwer jest nadal używany, czy wersja jest nadal wspierana, czy tokeny wciąż mają minimalny zakres. Serwery nieużywane wylatują z rejestru - martwa integracja to czysty koszt ryzyka bez żadnego zysku.

Z takim procesem rozmowa z działem bezpieczeństwa wygląda zupełnie inaczej. Zamiast prosić o zgodę na "podpinanie AI do systemów", pokazujesz rejestr, listę kontrolną i zasadę minimalnych uprawnień - czyli ten sam aparat, którym firma od lat zarządza zależnościami w kodzie, zastosowany do nowej klasy zależności. W moim doświadczeniu taka rama zmienia rozmowę z "nie, bo nie wiemy, co to robi" na negocjację zakresu pilotażu. A alternatywą dla procesu nie jest brak MCP w firmie - jest MCP podpinane po cichu, bez audytu i bez rejestru, bo zakaz nie usuwa potrzeby, tylko widoczność.

## Podsumowanie

Serwer MCP to dwie powierzchnie ataku w jednej paczce: kod uruchamiany z twoimi uprawnieniami i treści trafiające prosto do kontekstu modelu. Klasy ryzyka są znane i nazwane: przejęty łańcuch dostaw, zatrucie opisów narzędzi, pośrednie wstrzyknięcie promptu przez wyniki, nadmiarowe uprawnienia i cicha podmiana po aktualizacji. Obrona też nie jest tajemnicą: audyt według listy kontrolnej przed podpięciem, osobne tokeny o minimalnym zakresie, tryb tylko do odczytu, lista dozwolonych narzędzi, izolacja serwerów o warunkowym zaufaniu i rozdzielenie agenta z sekretami od agenta czytającego internet. Na poziomie zespołu: rejestr, przegląd przed dodaniem, właściciel per serwer i przegląd okresowy. Jeśli masz wynieść z tego tekstu jedną rzecz, niech będzie najtańsza z możliwych: zanim podepniesz następny serwer, otwórz manifest i przeczytaj opisy wszystkich narzędzi do końca. Dziesięć minut, po których nigdy nie spojrzysz na "pięć linijek konfiguracji" tak samo.
