---
title: "Skill prompt-master w Claude Code: generator promptów do innych narzędzi AI"
description: "Zamiast pisać prompt do Midjourneya, Sory, Suno czy Cursora ręcznie, masz w Claude Code skill, który to zrobi. Jak działa, gdzie nie zastąpi znajomości narzędzia docelowego."
date: 2026-05-13
tags: ["ai", "claude-code", "skill", "prompty"]
lang: pl
readingTime: 7
author: GH
---

Piszesz dziś prompt do Midjourneya. Zaczynasz od „cyberpunkowy portret Beksińskiego, wysokie szczegóły, ciemna paleta", patrzysz na efekt, dodajesz `--ar 16:9 --style raw --v 6`, iterujesz dziesięć razy. Potem to samo z promptem do GPT-5 do wygenerowania kodu Python, potem do Sory na video animację. Każde narzędzie ma własną gramatykę promptingu, własne parametry, własne idiosynkrazje. Pisanie tego ręcznie z głowy = strata czasu.

Skill `prompt-master` w Claude Code rozwiązuje konkretnie ten problem: dajesz mu wejście („chcę portret cyberpunkowy w stylu Beksińskiego do MJ"), a on zwraca prompt zoptymalizowany pod konkretne narzędzie docelowe, z parametrami i strukturą, której wymaga to narzędzie.

## Co dokładnie robi

`prompt-master` to skill (nie subagent) - zestaw wiedzy plus wzorce plus reguły, które ładują się do głównego Claude w terminalu w odpowiedzi na konkretne wyzwalacze. Generuje, naprawia, ulepsza i adaptuje prompty dla różnych narzędzi:

- **LLM tekstowe** (GPT, Claude, Gemini) - system prompts, role definitions, few-shot examples
- **Image AI** (Midjourney, DALL-E, Stable Diffusion, Flux) - opisy sceny, parametry stylu, weighty
- **Video AI** (Sora, Runway, Veo) - opis ujęcia, ruch kamery, długość, atmosfera
- **Audio AI** (Suno, Udio) - gatunek, tempo, instrumentarium, struktura piosenki
- **Coding agents** (Cursor, GitHub Copilot, Codex, Claude Code) - system prompts, kontekst projektu, ograniczenia

## Jak wywołać

Trzy ścieżki:

1. **Slash command**: `/prompt-master` w Claude Code
2. **Natural language**: „napisz prompt na X", „popraw prompt do MJ", „zaadaptuj ten prompt z GPT do Cursora" - skill triggeruje się po opisie
3. **Część większego workflow**: gdy piszesz artykuł i mówisz „dodaj prompt, który mógłbym puścić do Sory dla intra wideo"

Skill nie wymaga żadnej dodatkowej konfiguracji, jeśli masz go zainstalowanego (sprawdź `/help` lub `~/.claude/skills/`).

## End-to-end: prompt do Midjourneya

Wejście:

> Potrzebuję promptu do MJ na portret cyberpunkowy w stylu Zdzisława Beksińskiego. Format 16:9, klimat ponury, neon w tle.

Skill robi w głowie kilka rzeczy:

1. Identyfikuje narzędzie docelowe (MJ) i wersję (domyślnie najnowsza, v6 w 2026)
2. Wie, że MJ preferuje opisy w formie „temat → cechy → styl → parametry techniczne"
3. Zna idiosynkrazje: „cinematic" działa dla MJ, ale nie dla Stable Diffusion; weighty `::` to składnia MJ; styl referencyjny przez `--sref`
4. Mapuje „Beksiński" na konkretne deskryptory wizualne (lone figures, decaying landscapes, brown-orange palette, oil painting texture)

Wyjście:

```
A cyberpunk portrait in the style of Zdzisław Beksiński,
lone figure with bionic implants and exposed cables,
decaying urban background with flickering neon signs in muted reds and ambers,
oil painting texture with painterly brushstrokes, melancholic atmosphere,
dramatic chiaroscuro, fine cracks across the canvas surface
--ar 16:9 --style raw --v 6 --stylize 350
```

Plus krótkie uzasadnienie, czemu te, a nie inne deskryptory, oraz wskazówka „jeśli MJ rzuca za dużo neonu, zmniejsz `--stylize` do 200".

## Cross-tool: ten sam temat, inne narzędzie

Drugie zadanie: ten sam wizualny pomysł, ale do Sory na 5-sekundowy clip.

Skill nie kopiuje promptu z MJ. Wie, że Sora oczekuje opisu ruchu, kontekstu czasowego i akcji. Output będzie wyglądał inaczej:

```
A 5-second cinematic clip in the style of Zdzisław Beksiński.
Camera slowly dollies forward toward a lone figure with bionic implants
standing in a decaying urban square. Flickering neon signs cast shifting
red and amber light across cracked concrete. The figure does not move;
only the cables on its body sway slightly in wind. Painterly oil-painting
texture, melancholic atmosphere, dramatic chiaroscuro. Aspect 16:9,
slow contemplative pacing.
```

Cross-tool adaptation, nie copy-paste.

## Iteracja: „prawie dobry prompt"

Częsty case: masz prompt, który częściowo działa, ale efekt nie jest tym, czego chcesz. Zamiast pisać od zera, powiedz skillowi: „Mam ten prompt do MJ. Wychodzi za bardzo cartoon. Chcę bardziej oil painting."

`prompt-master` robi diff w głowie - identyfikuje, które tokeny pchają w stronę „cartoon" (np. „illustration", „character design"), zamienia je na „oil painting", „painterly brushstrokes", „canvas texture". Zwraca poprawiony prompt z explanation, który token został zmieniony i czemu.

To oszczędza więcej czasu niż generowanie od zera, bo trzymasz to, co już działa.

## Limit: nie zastąpi znajomości narzędzia docelowego

Skill jest dobry w gramatyce promptingu i typowych wzorcach. Nie zastąpi:

- **Eksperymentalnej wiedzy** - które konkretne `--sref` dają jaki styl, jakie wartości `--stylize` najlepiej pasują do twojego stylu
- **Aktualnych zmian w narzędziu** - MJ co miesiąc dodaje/usuwa parametry, skill ma wiedzę do daty cutoff
- **Twoich preferencji estetycznych** - czy lubisz raczej miękkie cienie, czy ostre kontrasty

Traktuj output jako 80% rozwiązania, nie 100%. Pierwszy wygenerowany prompt zostawi 1-2 rzeczy do dopolerowania ręcznie.

## Anti-patterns

Trzy rzeczy, które ludzie robią źle:

- **Wejście za ogólne** („zrób prompt na grafikę"). Skill nie zgadnie tematu, narzędzia ani celu. Output będzie generic. Im konkretniejsze wejście, tym lepszy output
- **Liczenie, że jeden output będzie idealny.** Skill optymalizuje pod typowy wzorzec. Twój specyficzny wymóg (np. „muszę mieć dokładnie 12 elementów na obrazie") wymaga iteracji
- **Pomijanie kontekstu narzędzia.** „Zrób prompt do AI" - jakie AI? MJ inny niż DALL-E, inny niż SD. Powiedz wprost

## Kiedy używać, kiedy odpuścić

Używaj, gdy:

- Pracujesz z nowym narzędziem AI i nie znasz jego idiosynkrazji
- Adaptujesz prompt z jednego narzędzia do drugiego
- Masz prompt, który prawie działa, i chcesz go ulepszyć
- Generujesz prompty seryjnie (np. dziesięć promptów do MJ na różne sceny)

Odpuść, gdy:

- Znasz narzędzie tak dobrze, że jesteś szybszy ręcznie
- Masz już działający szablon, którym tylko podmieniasz parametry
- Twój prompt jest czysto tekstowy do GPT na rzecz, którą i tak wiesz, jak opisać

## Crosslinki

Podstawy promptingu (zasady, które działają niezależnie od narzędzia) → [prompty AI](/pl/blog/prompty-ai/). Wczoraj o subagentach, które w innym wymiarze mogą mieć custom prompty → [subagenci](/pl/blog/subagenci-claude-code-co-to-i-po-co/). Jutro: [`advisor()`](/pl/blog/advisor-claude-code-druga-opinia/) - druga opinia w terminalu.
