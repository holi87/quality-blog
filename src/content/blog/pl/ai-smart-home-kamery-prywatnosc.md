---
title: "AI w Smart Home, część 8: Dom, który pilnuje - kamery, prywatność i analiza zdarzeń lokalnie"
description: "Ósma część mini-serii o AI w smart home. Składamy lokalny monitoring: Frigate do detekcji, model wizyjny do opisu zdarzeń, Home Assistant do powiadomień - oraz wytyczamy granice prywatności, których kamera nie powinna przekraczać."
date: 2026-07-27
tags: ["ai", "smart home", "home assistant", "kamery", "prywatność", "monitoring"]
lang: pl
readingTime: 9
author: [JS, GH]
---

Monitoring z analizą AI nie musi oznaczać wysyłania obrazu z twojego ogrodu do chmury producenta kamery. Frigate do detekcji, lokalny model wizyjny do opisu zdarzeń i Home Assistant do powiadomień mogą dać monitoring, który mówi "kurier zostawił paczkę" zamiast "wykryto ruch". Nagrania nie opuszczają domu tylko wtedy, gdy również opis obrazu działa lokalnie i konfiguracja nie wysyła migawek do usług chmurowych. W tej części składamy ten wariant w całość i rysujemy granice, których kamera przekraczać nie powinna.

## Frigate: oczy, które nie wysyłają niczego na zewnątrz

W [pierwszej części serii](/pl/blog/ai-smart-home-llm-vision/) pokazaliśmy, jak model wizyjny interpretuje obraz. Tutaj domykamy architekturę od strony źródła. Frigate to lokalny rejestrator z detekcją obiektów: czyta strumienie z kamer, rozpoznaje obiekty obsługiwane przez wybrany model, nagrywa zdarzenia i wystawia je do Home Assistant. Domyślnie śledzona jest osoba; samochody, zwierzęta i inne klasy trzeba skonfigurować, a etykieta `package` wymaga modelu Frigate+ lub innego modelu, który ją obsługuje. Sam proces detekcji dzieje się na twoim sprzęcie.

Do większej instalacji warto dobrać sprzętowy detektor. Frigate ma detektor procesorowy, ale dokumentacja go nie rekomenduje; na zgodnym procesorze Intela wydajniejszy bywa OpenVINO, a inną opcją jest Coral. Liczba obsługiwanych kamer zależy od rozdzielczości strumienia detekcyjnego, liczby klatek, modelu i konkretnego sprzętu, więc nie da się uczciwie obiecać jej na podstawie samej nazwy akceleratora. Tania detekcja na brzegu sprawia, że droższa analiza modelem wizyjnym uruchamia się tylko wtedy, gdy jest co analizować.

## Strefy i maski: właściwe alerty to nie maska prywatności

Najwięcej jakości w monitoringu daje nie lepszy model, tylko dobre wykadrowanie problemu. Frigate pozwala narysować na obrazie strefy oraz maski ruchu i obiektów. Strefa "podjazd" i strefa "furtka" to różne zdarzenia o różnej wadze. Jeśli nie chcesz alertów lub zdarzeń z chodnika, zdefiniuj strefę na własnej posesji i ustaw ją jako wymaganą dla przeglądu. Maska ruchu nie ukrywa pikseli, nie wycina obszaru z nagrania i nie gwarantuje, że obiekt nie zostanie wykryty. Do ochrony prywatności potrzebujesz właściwego kadru albo trwałej maski prywatności nałożonej przez kamerę lub tor wideo.

To nie tylko kwestia spokoju, ale i prywatności sąsiadów. Standardem powinien być kadr ograniczony do własnej posesji; programowa maska detekcji nie zastępuje fizycznego wykadrowania ani maski prywatności w obrazie. Dobre powiadomienie zaczyna się od dobrze zdefiniowanego "gdzie": "osoba w strefie furtki dłużej niż 10 sekund" to zupełnie inny sygnał niż "osoba gdziekolwiek w kadrze".

## Od "wykryto ruch" do "kurier zostawił paczkę"

Łańcuch zdarzeń wygląda tak: Frigate wykrywa obiekt w strefie i zgłasza zdarzenie do Home Assistant. Automatyzacja decyduje, czy zdarzenie zasługuje na analizę - osoba przy furtce tak, kot na podjeździe nie. Jeśli tak, najlepszy kadr zdarzenia trafia do modelu wizyjnego (lokalnego albo chmurowego - kompromisy opisaliśmy w części pierwszej), a ten zwraca strukturalną odpowiedź: kto, gdzie, z czym, czy powiadamiać.

Efekt jest odczuwalny w telefonie. Zamiast trzydziestu powiadomień "wykryto ruch" dziennie dostajesz trzy: "kurier zostawił paczkę pod drzwiami", "nieznana osoba stoi przy furtce od 30 sekund", "brama otwarta, na podjeździe nie ma auta". U Julii liczba powiadomień z kamer spadła ponad dziesięciokrotnie, a zaufanie do nich wzrosło na tyle, że przestały być wyciszone. To jest właściwa miara sukcesu: powiadomienie, którego nikt nie wycisza.

> Monitoring nie jest po to, żeby dom widział wszystko. Jest po to, żeby powiedział ci o trzech rzeczach dziennie, które naprawdę chcesz wiedzieć - i o niczym więcej.

## Retencja: ile dom pamięta

Nagrania to dane wrażliwe, więc zasada minimalizacji z części pierwszej dotyczy też dysku. Frigate rozdziela retencję nagrań ciągłych i zdarzeń, co pozwala ustawić rozsądny kompromis: nagrania ciągłe 2 dni, zdarzenia z obiektami 14 dni, migawki zdarzeń 30 dni.

Liczby pomagają podjąć decyzję: jedna kamera 1080p przy strumieniu 3 Mb/s to około 30 GB nagrań ciągłych na dobę. Cztery kamery z dwudniową retencją ciągłą i dwutygodniową retencją zdarzeń mieszczą się na dysku 1 TB z zapasem. Dłuższa pamięć rzadko się broni: jeśli zdarzenie było ważne, wiesz o nim z powiadomienia tego samego dnia. Archiwum "na wszelki wypadek" to głównie ryzyko, nie wartość.

Retencja to także pytanie o dostęp: kto w domu może oglądać nagrania i z jakiego urządzenia. U nas zasada jest prosta - podgląd na żywo z kamer zewnętrznych mają wszyscy domownicy na panelu, archiwum zdarzeń wymaga zalogowania na konto administratora, a eksport nagrania poza dom (np. dla policji po incydencie) to świadoma, ręczna czynność, nie funkcja w aplikacji. Monitoring, do którego każdy ma pełny dostęp z telefonu, zbyt łatwo zamienia się w narzędzie podglądania codziennego życia rodziny.

## Co AI myli - i jak z tym żyć

Po roku z lokalnym monitoringiem mamy uczciwą listę pomyłek. Cienie drzew o zachodzie słońca potrafią chodzić jak ludzie. Deszcz na obiektywie zamienia latarnię w "osobę z parasolem". Pająk spacerujący nocą po obudowie wygląda w podczerwieni jak potwór wart stu powiadomień. Kot bywa psem, pies bywa osobą przy niskim progu pewności, a flaga na wietrze jest wiecznym źródłem ruchu.

Trzy mechanizmy obrony, w kolejności skuteczności:

- **Próg pewności i minimalny czas obecności** - obiekt "osoba" z pewnością poniżej 70% albo obecny krócej niż kilka sekund nie generuje zdarzenia;
- **weryfikacja drugim okiem** - zdarzenie z niską pewnością trafia do modelu wizyjnego z pytaniem zamkniętym ("czy na obrazie jest człowiek - tak, nie, brak pewności"), zanim cokolwiek dotrze do telefonu;
- **higiena fizyczna** - czysty obiektyw, doświetlenie strefy wejścia i kamera zamontowana tak, żeby reflektory aut nie świeciły prosto w obiektyw, załatwiają więcej niż niejedna zmiana konfiguracji.

Pomyłek nie wyzerujesz. Projektuj system tak, żeby fałszywy alarm kosztował jedno niepotrzebne powiadomienie, a nie syrenę o 3:00. I prowadź prosty rejestr pomyłek przez pierwszy miesiąc - po dziesięciu wpisach zobaczysz, że 80% fałszywych alarmów ma jedną, dwie przyczyny, które da się usunąć jedną maską albo jednym progiem.

## Rozpoznawanie twarzy: dlaczego odpuściliśmy

Techniczna pokusa jest oczywista: skoro dom rozpoznaje osobę, niech rozpoznaje, którą. Powiadomienie "Julia wróciła" zamiast "wykryto osobę" brzmi jak naturalny kolejny krok. Po testach świadomie się z niego wycofaliśmy, z trzech powodów.

Po pierwsze, niezawodność: rozpoznawanie twarzy na kamerze zewnętrznej, pod kątem, w czapce i o zmierzchu, myli się na tyle często, że automatyzacje warunkowane tożsamością stają się loterią. Po drugie, ten sam efekt osiągasz tańszymi i pewniejszymi sygnałami - telefon domownika w sieci domowej i czujnik drzwi mówią "Julia wróciła" z większą pewnością niż jakikolwiek model wizyjny. Po trzecie, baza twarzy domowników i gości to najbardziej wrażliwy zbiór danych, jaki dom może przechowywać, a utrzymywanie go dla powiadomienia, które i tak masz skądinąd, to ryzyko bez nagrody.

To dobre ćwiczenie z myślenia o AI w domu w ogóle: zanim dodasz kolejną warstwę inteligencji, sprawdź, czy nudny czujnik nie daje tej samej informacji taniej, pewniej i bez danych wrażliwych.

## Granice prywatności: gdzie kamera nie powinna być w ogóle

Najważniejsza decyzja w monitoringu nie jest techniczna. Brzmi: gdzie kamery nie wieszamy, choćby była tania i łatwa w montażu. Nasza mapa wygląda tak:

| Miejsce | Kamera? | Uzasadnienie |
|---|---|---|
| Furtka, drzwi wejściowe, podjazd | Tak | Realny cel: przesyłki, goście, auto |
| Ogród, taras | Tak, z maskami | Maska na posesję sąsiada i chodnik |
| Garaż, kotłownia | Tak | Przestrzeń techniczna, niski koszt prywatności |
| Salon, kuchnia | Tylko świadomie | Jeśli już, to z fizyczną przesłoną i trybem obecności |
| Sypialnie, łazienki, pokoje dzieci | Nigdy | Żaden scenariusz nie uzasadnia ryzyka |

Do tego trzy zasady miękkie. Po pierwsze, domownicy wiedzą o każdej kamerze i mają prawo weta - monitoring, o którym ktoś w domu nie wie, to nadzór, nie bezpieczeństwo. Po drugie, goście zasługują na informację, a tryb gościa znany z [poprzednich części serii](/pl/blog/ai-smart-home-automatyzacje/) może po prostu wstrzymywać analizę wnętrza, jeśli jakąkolwiek masz. Po trzecie, dźwięk traktuj surowiej niż obraz - nagrywanie rozmów to inna kategoria ingerencji i w wielu sytuacjach po prostu go wyłącz.

Od strony sieci: kamery dostają osobny VLAN bez dostępu do internetu, rozmawiają wyłącznie z serwerem Frigate, a dostęp zdalny do podglądu idzie przez Home Assistant, nie przez aplikację producenta. Wtedy obietnica "obraz nie opuszcza domu" przestaje zależeć od polityki prywatności firmy, której kamerę kupiłeś, a zaczyna zależeć od twojej konfiguracji.

## Podsumowanie

Lokalny monitoring z AI to domknięcie wątku, który zaczęliśmy w części pierwszej: Frigate tanio wykrywa, model wizyjny mądrze opisuje, Home Assistant powiadamia tylko o tym, co ważne. Dobre strefy i maski dają więcej niż mocniejszy model, krótka retencja jest bezpieczniejsza niż wieczne archiwum, a pomyłki AI neutralizuje się progami pewności i pytaniami zamkniętymi. Granice prywatności wytycz przed zakupem pierwszej kamery, nie po: sypialnie i pokoje dzieci są poza dyskusją, a domownicy i goście mają wiedzieć, na co patrzy dom. Jeśli masz już jedną kamerę przy wejściu, weekend z Frigate i jedną strefą przy furtce pokaże ci, ile spokoju daje monitoring, który odzywa się trzy razy dziennie - i zawsze z sensem.
