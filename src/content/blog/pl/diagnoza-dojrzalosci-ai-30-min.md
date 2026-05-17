---
title: "Jak zdiagnozować poziom dojrzałości AI w zespole w 30 minut"
description: "Konkretny protokół oceny zespołu na skali Holaka — 8 pytań kalibrujących, 5 minut obserwacji w narzędziu i jednostronicowy raport. Bez ankiet, bez warsztatów, bez slajdów."
date: 2026-05-21
tags: ["ai", "adopcja", "diagnoza", "zespoly", "skala-holaka"]
lang: pl
readingTime: 10
author: GH
---

[Skala Holaka](/pl/blog/skala-holaka/) opisuje 11 poziomów adopcji AI od oporu do orkiestracji. Pytanie, które wraca w każdej rozmowie z menedżerem brzmi: **„OK, ale skąd mam wiedzieć, gdzie jest mój zespół?"**

Odpowiedź jest prosta: w 30 minut. Bez ankiet, bez warsztatu na cały dzień, bez slajdów. Poniżej protokół, którego używam u klientów.

## Co dostajesz na końcu

Jedną stronę A4:

- poziom jednostki (rozmówcy)
- poziom organizacji w jego oczach
- rozjazd (jeśli istnieje)
- dwie rekomendacje „co dalej"
- jedna rzecz, której **nie robić**

Tyle. Nic więcej nie potrzebujesz, żeby zaplanować pierwszy krok.

## Format sesji

30 minut, 1:1, kamera nie jest wymagana. Lepiej w narzędziu z chatem, do którego rozmówca ma już dostęp — żebyś mógł poprosić go o pokazanie czegoś na żywo.

Harmonogram:

| Czas | Co | Cel |
|------|-----|------|
| 0–5 min | Kontekst | Rola, branża, narzędzia, czas używania |
| 5–20 min | 8 pytań kalibrujących | Dane do scoringu |
| 20–25 min | Obserwacja na żywo | Walidacja deklaracji |
| 25–30 min | Feedback | Raport ustny + jedna pisemna rekomendacja |

## Pytania kalibrujące

Osiem pytań, po dwa na fazę. Nie pytaj „na którym jesteś poziomie" — odpowiedzi będą zniekształcone. Pytaj o zachowania.

### Faza Start (poziom 0–1)

1. *„Pokaż mi, jak najczęściej zaczynasz pracę z AI. Co konkretnie wpisujesz?"* — szukasz: brak konta vs jednorazowa próba vs nawyk. Jeśli nie ma konta, jesteś poniżej 1.
2. *„Kiedy ostatnio AI Cię zaskoczyło — w dobrą lub złą stronę?"* — brak takiego momentu = poziom 0–1. Świeże zaskoczenie = co najmniej 2.

### Faza Świadome użycie (poziom 2–4)

3. *„Masz własny szablon prompta, którego używasz częściej niż raz w miesiącu? Pokaż jeden."* — brak = poziom 1–2. Szablon „cytuj 3 źródła" = 3. Szablon z rolą, celem, ograniczeniami, formatem outputu = 3.
4. *„Co masz w custom instructions / ustawieniach modelu?"* — jeśli „nic, nigdy nie zmieniałem" = poziom 1–3. Jeśli „kilka linii o sobie" = 4. Jeśli „pół strony i przeglądam co kwartał" = pewne 4.

### Faza Kontekst i wiedza (poziom 5–8)

5. *„Pokaż AGENTS.md albo CLAUDE.md z jakiegokolwiek twojego projektu."* — nie ma takiego pliku = poziom 4 lub niżej. Plik istnieje i jest sprzed pół roku = 5 (z anti-patternem dokumentacja-cmentarz). Plik istnieje i ma datę z ostatniego tygodnia = 6.
6. *„Czy korzystasz z jakichś MCP / connectorów / wtyczek do AI? Jeśli tak, wymień trzy i powiedz, kiedy ostatnio cię nie zawiodły."* — zero = 5–7. Wymieni i opowie konkretnie = 8. Wymieni listę bez konkretów = 6–7 udający 8.

### Faza Autonomia (poziom 9–10)

7. *„Opowiedz o ostatnim zadaniu, które agent zrobił od początku do końca — bez Twojej ingerencji w środku."* — brak = poniżej 9. Krótka relacja = 9. „Codziennie mam takie zadania" + przykład = pewne 9.
8. *„Czy w ostatnim miesiącu projektowałeś system kilku agentów współpracujących? Co to było?"* — nie = nie ponad 9. Tak + zrozumiały opis = 10.

## Obserwacja na żywo (5 minut)

Najważniejsza część. Zwykle koryguje samoocenę o 1–2 poziomy w dół.

Poproś rozmówcę: *„Otwórz ulubione narzędzie AI i zrób coś, co robisz raz w tygodniu. Mów na głos, co i czemu."*

Sygnały:

- **Otwiera czyste okno bez ustawień** — poziom 1–2, niezależnie od tego co mówił wcześniej.
- **Wkleja prompt z dokumentu** — fetysz promptów, poziom 3 z anti-patternem.
- **Model już zna kontekst, prompt jest krótki** — poziom 4+.
- **Wywołuje skill / projekt / przestrzeń z konfiguracją** — poziom 5–7.
- **Wykonuje MCP-owe akcje (zapis pliku, push, wysłanie do Slacka)** — poziom 8.
- **Wpisuje cel i odchodzi od ekranu** — poziom 9.

## Scoring

Dla każdego pytania zapisuj poziom 0–10. Na końcu:

- **Poziom jednostki** = mediana z 8 pytań + obserwacja. Mediana, nie maksimum. Najczęstszy błąd początkujący „mam custom instructions więc jestem na 4" — ale wszystkie inne odpowiedzi mówią 2.
- **Poziom organizacji** = oceniany pośrednio przez pytania 5, 6, 8. Dopytaj: *„Czy to jest twoja prywatna konfiguracja, czy oficjalny stack firmowy?"* Jeśli prywatna — organizacja jest niżej.

## Czerwone flagi w odpowiedziach

Sygnały, że samoocena jest zawyżona:

- **„Mamy MCP" bez odpowiedzi na „kto autoryzuje akcje"** — to wciąż poziom 6–7 udający 8.
- **„Korzystam codziennie" bez różnicy między zadaniami** — codzienne Q&A to nadal poziom 1.
- **„Cały zespół jest na X" bez próbki** — średnia podana w mailu zarządczym to nie diagnoza.
- **„Mieliśmy szkolenie z prompt engineeringu"** — szkolenie nie zmienia poziomu, zachowanie zmienia.
- **„Wszystko mam w Confluence"** — Confluence to dokumentacja dla ludzi, nie kontekst dla agentów.

## Raport — format jednej strony

Po sesji wyślij mailem to:

```
Rozmówca: Imię Nazwisko, rola, firma
Data sesji: YYYY-MM-DD, czas trwania: 30 min

Poziom jednostki: [X / 10]
Poziom organizacji w opinii rozmówcy: [Y / 10]
Rozjazd: [opis lub "brak"]

Rekomendacje:
1. [konkretna akcja na 1-2 tygodnie, np. "spisz CLAUDE.md dla głównego repo, max strona, do przeglądu za 2 tygodnie"]
2. [konkretna akcja na 1 miesiąc, np. "wybierz jeden MCP server, postaw, użyj 10 razy w realnej pracy"]

Czego NIE robić:
- [konkretne ostrzeżenie, np. "nie kupuj subskrypcji multi-agent frameworka, dopóki pojedynczy agent nie radzi sobie z 80% zadań"]
```

## Co zwykle widzę

Z ostatnich kilkudziesięciu diagnoz:

- Mediana w zespołach inżynierskich: **3** (frameworki, biblioteki promptów).
- Mediana w zespołach managerskich: **2** (czat, sporadyczne użycie).
- Najczęstszy rozjazd: jednostka 4–5, organizacja 2. *„Jestem na 5, ale w firmie muszę używać czystego ChatGPT bo nie mamy zgody na nic innego."*
- Najczęstsza zawyżona samoocena: o 2 poziomy. *„Jestem na 7"* → realnie 4–5 po obserwacji.

## Co dalej

Diagnoza to start, nie cel. Po sesji wybierz **jeden** poziom do przeskoczenia w najbliższym kwartale. Nie dwa, nie trzy. Jeden, z konkretnym sygnałem przejścia (np. „CLAUDE.md w głównym repo zaktualizowany w ciągu ostatniego tygodnia").

Wracaj do tego samego rozmówcy co kwartał. Trzy diagnozy w roku pokazują trajektorię — która jest ważniejsza niż punktowa ocena.

Wersja 3 skali Holaka będzie miała ten protokół rozszerzony do template'u PDF z punktacją. Jeśli używasz go już teraz i widzisz luki — [napisz](https://holak.net.pl).
