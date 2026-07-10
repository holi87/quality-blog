---
title: "Backup Home Assistant zanim będzie za późno - strategia odtwarzania krok po kroku"
description: "Kompletna strategia kopii zapasowych Home Assistant: automatyczne kopie, przechowywanie poza urządzeniem, klucz szyfrowania i test odtworzenia, który mówi prawdę o tym, czy w ogóle masz kopię."
date: 2026-07-17
tags: ["smart-home", "home-assistant", "backup", "odtwarzanie", "niezawodnosc"]
lang: pl
readingTime: 10
author: GH
---

Karta SD umiera bez ostrzeżenia, a razem z nią dwa lata konfiguracji, automatyzacji i historii pomiarów. Ten tekst to kompletna strategia kopii zapasowych Home Assistant, którą skonfigurujesz w jeden wieczór: automatyczne kopie, przechowywanie poza urządzeniem i test odtworzenia, który powie ci prawdę o tym, czy w ogóle masz kopię.

## Dlaczego traktuję ten temat śmiertelnie poważnie

Znajomy prowadził Home Assistant na Raspberry Pi 4 przez ponad dwa lata. Czterdzieści automatyzacji, dopieszczone panele, parowania kilkudziesięciu urządzeń Zigbee, historia temperatur od pierwszej zimy. Pewnego ranka system po prostu nie wstał. Karta SD przeszła w tryb tylko do odczytu, a potem przestała odpowiadać w ogóle. Kopii zapasowej nie było żadnej - bo „kiedyś się zrobi".

To nie jest scenariusz egzotyczny. Home Assistant z włączoną bazą historii regularnie zapisuje dane, a trwałość karty SD zależy od jej jakości, obciążenia, temperatury i konfiguracji - nie ma uczciwego uniwersalnego przedziału „rok do trzech lat". Dyski SSD i pamięci eMMC (mam HA Yellow, więc znam temat z autopsji) zwykle lepiej znoszą takie obciążenie, ale też nie są kopią zapasową. Pytanie nie brzmi „ile lat obiecuje nośnik", tylko czy będziesz przygotowany na jego awarię.

Druga grupa scenariuszy to nie awarie, tylko my sami: nieudana aktualizacja, eksperyment z integracją z HACS, który położył system, przypadkowe skasowanie połowy konfiguracji przy sprzątaniu. Kopia zapasowa chroni przed sprzętem i przed człowiekiem jednocześnie.

## Co potrafi wbudowany system kopii w HA 2026

Dobra wiadomość: nie potrzebujesz żadnych zewnętrznych narzędzi, żeby mieć przyzwoitą strategię. System kopii zapasowych Home Assistant został gruntownie przebudowany w wydaniach z 2025 roku i w wersjach z 2026 dostajesz w standardzie: automatyczny harmonogram, szyfrowanie kopii, politykę przechowywania (ile kopii trzymać) i wysyłkę na lokalizacje sieciowe.

Pełna kopia obejmuje katalogi `config`, `share`, `ssl`, `media` oraz dane ręcznie zainstalowanych lub utworzonych dodatków. Dodatki ze sklepu są odtwarzane przez ponowną instalację, a ich dane wracają z kopii. Jeśli używasz domyślnej bazy SQLite w katalogu `config`, baza historii wchodzi do kopii razem z tym katalogiem - wbudowany formularz nie ma osobnego przełącznika „bez bazy". Wszystko ląduje w zaszyfrowanym archiwum.

Konfiguracja zaczyna się w `Ustawienia → System → Kopie zapasowe`, przycisk konfiguracji automatycznych kopii. Tam ustawiasz dzień i godzinę (proponuję środek nocy), liczbę przechowywanych kopii i miejsca docelowe. Przy pierwszym uruchomieniu system wygeneruje klucz szyfrowania i zaproponuje pobranie „zestawu ratunkowego" - pliku z tym kluczem.

**Zatrzymaj się przy tym kroku.** Bez klucza szyfrowania kopia jest bezużytecznym blobem danych. Pobierz zestaw ratunkowy i zapisz go w dwóch miejscach poza Home Assistant: w menedżerze haseł i na przykład w skrzynce pocztowej albo na wydruku w szufladzie. Klucz trzymany wyłącznie na tym samym urządzeniu co kopia to klasyczny błąd, który odkrywa się w najgorszym możliwym momencie.

## Zasada numer jeden: kopia poza urządzeniem

Kopia zapasowa leżąca na tej samej karcie SD co system ginie razem z kartą. To zdanie brzmi banalnie, a mimo to domyślna konfiguracja wielu instalacji wygląda dokładnie tak. Minimalny sensowny standard dla domu: kopie w dwóch miejscach, z czego jedno poza samym urządzeniem - a najlepiej poza domem.

Masz trzy praktyczne opcje, które można łączyć:

- **NAS w sieci lokalnej.** W `Ustawienia → System → Pamięć masowa` dodajesz udział sieciowy (SMB lub NFS), wskazujesz folder i poświadczenia, a potem w ustawieniach kopii zaznaczasz go jako miejsce docelowe. Kopie lecą tam automatycznie, bez żadnych skryptów.
- **Home Assistant Cloud.** Jeśli płacisz za subskrypcję (głównie dla zdalnego dostępu i asystentów głosowych), dostajesz miejsce na jedną, ostatnią kopię o maksymalnym rozmiarze 5 GB. Limit nie wyklucza bazy automatycznie - jeśli kopia jest za duża, ogranicz `media`, `share` i zbędne dodatki oraz uporządkuj retencję Recorder albo wybierz inne miejsce docelowe.
- **Google Drive przez dodatek społecznościowy.** Dodatek Home Assistant Google Drive Backup od lat jest złotym standardem: dodajesz jego repozytorium do sklepu z dodatkami, autoryzujesz konto Google i ustalasz, ile generacji kopii ma trzymać na Dysku. Darmowe 15 GB w zupełności wystarcza na kopie bez bazy historii.

Moja konfiguracja domowa: kopia codzienna lokalnie (trzy ostatnie), wysyłka na NAS (dziesięć ostatnich) i raz w tygodniu na Google Drive. Trzy niezależne miejsca, zero ręcznej pracy.

## Harmonogram i retencja, które mają sens

Jak często robić kopie? Prosta reguła: tak często, jak często zmieniasz konfigurację. Jeśli co wieczór dłubiesz przy automatyzacjach - codziennie. Jeśli system stoi i działa miesiącami - raz w tygodniu wystarczy, bo utrata tygodnia historii boli mniej niż utrata tygodnia pracy nad konfiguracją.

Osobna decyzja dotyczy bazy historii. Przy domyślnej SQLite baza leży w `config` i wchodzi do każdej kopii obejmującej ten katalog. Rozmiar ograniczaj ustawieniami retencji i filtrami integracji Recorder, a nie obietnicą nieistniejącego przełącznika w kopiach. Jeśli historia jest krytyczna albo baza bardzo duża, rozważ zewnętrzny silnik na NAS-ie i jego osobną, spójną kopię - zewnętrzna baza nie jest zawartością archiwum Home Assistant.

Trzeci element, o którym prawie nikt nie pamięta: pilnowanie, czy kopie w ogóle się wykonują. Cicha awaria mechanizmu kopii to klasyka - NAS zapełnił dysk, autoryzacja Google wygasła, hasło do udziału SMB zmienione przy okazji porządków. Integracja Backup udostępnia stan ostatniego automatycznego zadania, a dodatki mogą mieć własne sensory. Zbuduj powiadomienie o wyniku `failed` i zapisuj znacznik czasu tylko po potwierdzonym sukcesie; jeśli znacznik jest starszy niż 48 godzin, wyślij alarm. Nie zakładaj, że każda instalacja ma gotową encję z datą ostatniej kopii.

I jeszcze jedna siatka bezpieczeństwa dla osób dłubiących w plikach yaml: repozytorium git na katalogu konfiguracji. Kopia zapasowa odpowiada na pytanie „jak wrócić do wczoraj", git odpowiada na pytanie „co dokładnie zmieniłem w automatyzacji trzy tygodnie temu i czemu wtedy działała". To nie jest zamiennik kopii - baza, dodatki i sekrety zostają poza repozytorium - ale przy diagnozowaniu regresji po własnych zmianach bywa bezcenne.

## Czego standardowa kopia nie obejmuje

To najczęściej pomijany fragment układanki. Kopia Home Assistant chroni Home Assistant - ale twój smart home to więcej niż jeden system. Oto lista elementów, które przy odtwarzaniu potrafią zaskoczyć:

| Element | Gdzie naprawdę żyje | Jak zabezpieczyć |
| --- | --- | --- |
| Sieć Zigbee (klucz sieci, parowania) | Koordynator i dane integracji | ZHA wykonuje automatyczne kopie sieci i potrafi migrować między obsługiwanymi koordynatorami; Zigbee2MQTT ma własne procedury i ograniczenia, więc sprawdź dokumentację używanego stosu |
| Zewnętrzna baza historii | Serwer bazy poza Home Assistant | Osobna, spójna kopia wykonywana narzędziem właściwym dla użytego silnika |
| Tokeny i sesje integracji chmurowych | U zewnętrznych dostawców | Lista kont w menedżerze haseł; część integracji po odtworzeniu poprosi o ponowne logowanie |
| Konfiguracja sieci (rezerwacje DHCP, VLAN-y, DNS) | Router | Eksport konfiguracji routera przy każdej większej zmianie |
| Sceny i ustawienia w aplikacjach producentów | Chmura producenta | Przenoś logikę do HA zamiast trzymać ją w aplikacjach urządzeń |
| System operacyjny hosta (instalacje Container/Core) | Poza zasięgiem kopii HA | Obraz dysku lub własny skrypt kopii systemu |

Najwięcej nerwów kosztuje punkt pierwszy. W ZHA kopia sieci pozwala odtworzyć lub migrować sieć na obsługiwany koordynator, także innego typu, bez ponownego parowania urządzeń. Trzeba jednak przejść procedurę migracji, zachować właściwy adres IEEE i sprawdzić zgodność adaptera. Zigbee2MQTT ma inne reguły migracji zależne od rodziny adaptera. Zapasowy koordynator nadal skraca przestój, ale nie musi być identycznym modelem - ma być zgodny z procedurą twojego stosu.

## Test odtworzenia, czyli moment prawdy

> Kopia zapasowa, której nigdy nie odtworzyłeś, to nie kopia zapasowa. To plik o optymistycznej nazwie.

W pracy testera powtarzam to zespołom przy każdym planie ciągłości działania i dokładnie ta sama zasada obowiązuje w domu. Test na drugim systemie jest bezpieczny dopiero po izolacji: nie uruchamiaj równolegle dwóch instancji z tą samą konfiguracją w tej samej sieci i nie podłączaj sklonowanych koordynatorów radiowych. Testową maszynę odłącz od sieci produkcyjnej albo na czas próby wyłącz instancję produkcyjną; inaczej zdublowane automatyzacje i integracje mogą sterować prawdziwym domem.

1. Weź zapasowy nośnik (stara karta SD, dysk USB) albo maszynę wirtualną na komputerze. Wgraj świeży obraz Home Assistant OS.
2. Uruchom system i w kreatorze pierwszego startu wybierz opcję przywracania z kopii zapasowej zamiast tworzenia nowej instalacji.
3. Wskaż plik kopii pobrany z NAS-a lub Google Drive i podaj klucz szyfrowania z zestawu ratunkowego.
4. Poczekaj - przywracanie potrafi trwać kilkanaście minut i przez ten czas interfejs wygląda, jakby nic się nie działo. Cierpliwość.

Po starcie przejdź krótką listę kontrolną: czy logowanie działa, czy automatyzacje są na miejscu, czy panele wyglądają znajomo, czy dodatki się uruchomiły, które integracje proszą o ponowną autoryzację. Zapisz sobie czas całej operacji - u mnie to około 40 minut od wyjęcia karty z szuflady do działającego systemu. Ta liczba to twój realny czas odtworzenia po awarii i warto ją znać, zanim awaria nastąpi.

Taki test powtarzam co pół roku, zwykle przy okazji większej aktualizacji. Dwa razy wykrył problem: raz uszkodzone archiwum (NAS ucinał transfer), raz klucz szyfrowania zapisany w starej wersji. Oba odkrycia w warunkach ćwiczeń, nie katastrofy - i o to dokładnie chodzi.

## Podsumowanie

Strategia kopii zapasowych Home Assistant w trzech zdaniach: automatyczne kopie wbudowanym mechanizmem (codziennie lub co tydzień, z rozsądną retencją), przechowywanie poza urządzeniem w co najmniej dwóch miejscach (NAS plus chmura), klucz szyfrowania zabezpieczony osobno. Do tego świadomość, czego kopia nie obejmuje - z siecią Zigbee i konfiguracją routera na czele. I rytuał, który odróżnia posiadanie pliku od posiadania zabezpieczenia: test odtworzenia na czystym sprzęcie raz na pół roku. Jeśli po lekturze masz zrobić jedną rzecz, zrób tę: sprawdź dziś wieczorem, kiedy powstała twoja ostatnia kopia i czy umiesz wskazać jej klucz szyfrowania.
