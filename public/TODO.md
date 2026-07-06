# TODO.md — D_cake

## Priorytet 1 — prawdziwy trust signal przy hero
- [x] Ocena potwierdzona: **5.0** na Google.
- [ ] Brakuje jeszcze liczby opinii (np. "5.0 · 15 opinii") — dopytać
      użytkowniczkę o dokładną liczbę z wizytówki Google.
- [ ] Dodać krótką linijkę z tą liczbą przy CTA w hero (albo mały cytat z jednej
      z 4 już wdrożonych opinii) — **nie zgadywać/zmyślać liczby**.

## Priorytet 2 — "Boxy firmowe" i "Oferta sezonowa"
- [ ] Ustalić z użytkowniczką: czy pudełka/boxy firmowe to stała kategoria (dodać
      5. kartę do Oferty), czy oferta sezonowa pojawia się tylko okresowo
      (wtedy zaprojektować jako łatwy do włączenia/wyłączenia moduł, nie stałą
      kartę widoczną cały rok). Świadomie odłożone podczas audytu UI/UX
      2026-07-06 — użytkowniczka wybrała "zostawmy jako otwarte" w tamtej chwili.
- [ ] Po decyzji: dopisać brief tekstu dla nowej karty (wzorem `BRIEF_TEKSTOW.md`)
      albo od razu wdrożyć, jeśli użytkowniczka dostarczy gotowy tekst i zdjęcie.

## Do rozważenia (niepilne)
- [ ] Kiedy strona trafi na docelową domenę: zaktualizować `og:image` w
      `index.html` z relatywnej ścieżki na pełny URL (przypominający komentarz
      już jest w kodzie).
- [ ] Rozważyć dodanie kropek/scroll-hint także gdzie indziej, jeśli powstanie
      kolejny poziomy karuzelowy komponent — wzorzec (`*-dots` + JS z
      `initGalleryCarousel`/`initTestimonialCarousel`) jest już gotowy do
      skopiowania.
- [ ] Poprawić brakujące `aria-controls`/oznaczenie regionu na akordeonie FAQ
      (drobny odstęp od best practice ARIA, nie blokuje nawigacji klawiaturą).
- [ ] Kropki paginacji (Galeria/Opinie) mają ~28px tap target, poniżej
      zalecanych 44px — niska waga, bo główny gest to przeciąganie/swipe.

## Rozstrzygnięte podczas audytu UI/UX 2026-07-06
- [x] Tło Kontaktu zmienione z `gallery-1.jpg` (tort na 70. urodziny) na
      `gallery-6.jpg` (słodki stół) — usunięty tematyczny rozjazd z ogólnym CTA.
- [x] FAQ: brak pytań o alergie/zadatek to świadome uproszczenie — potwierdzone
      przez użytkowniczkę, nie wymaga zmian.
- [x] Promień dowozu "~30 km" w Kontakcie — potwierdzony jako realna liczba.
- [x] Naprawiony brak nazwy dostępnej (accessible name) przycisku WhatsApp
      w headerze na mobile (<560px) — dodany `aria-label`.
- [x] Naprawiony zbyt mały/niedopasowany obszar klikalny w kartach Oferty —
      cała karta jest teraz linkiem, nie tylko dolny tekst.
- [x] Naprawiona niewidoczność podpisów zdjęć w Galerii na dotyku (były tylko
      na `:hover`) — teraz zawsze widoczne poniżej 768px.
- [x] Dodany tekstowy odpowiednik oceny gwiazdkowej w Opiniach dla czytników
      ekranu (`aria-label` zamiast `aria-hidden`).
- [x] Pogłębiony scrim pod tekstem pomocniczym w Hero na mobile (ryzyko niskiego
      kontrastu na jaśniejszych klatkach wideo).
- [x] Naprawiona nieczytelność nagłówków na kartach Oferty — `.service-scrim`
      zaczynał się od `transparent`, więc dłuższy tekst (np. 2-liniowy nagłówek)
      pchał treść w jasną, nieprzyciemnioną strefę zdjęcia. Wzmocniony gradient
      (bazowe przyciemnienie od samej góry), dodany `text-shadow` na h3/p,
      opis kart ograniczony do 3 linii (`-webkit-line-clamp`), skrócony
      nagłówek "Desery weselne i eventowe" → "Desery weselne" (potem
      przemianowany, patrz niżej).
- [x] Karta "Desery weselne" przemianowana na **"Desery okazjonalne"** —
      zdjęcie (`service-wedding.jpg`) w rzeczywistości pokazuje tort na
      Pierwszą Komunię (widoczny napis na torcie), nie tort weselny. Zamiast
      szukać zamiennika, kategoria została uczciwie przemianowana pod to,
      co zdjęcie faktycznie pokazuje. `data-wa-text`/`aria-label` zaktualizowane
      zgodnie (emoji 💍 → 🎉). `alt` zdjęcia zostaje bez zmian (nadal uczciwie
      opisuje realną treść zdjęcia — tort komunijny).
