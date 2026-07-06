# TODO.md — D_cake

## Priorytet 1 — zdjęcie w tle Kontaktu
- [ ] Podmienić `assets/photos/gallery-1.jpg` używane jako tło sekcji Kontakt
      (`.contact-bg` w `index.html`) na coś tematycznie bardziej uniwersalnego —
      obecnie jest to zdjęcie tortu na 70. urodziny (przypadkowy efekt uboczny
      rozbudowy Galerii), niepasujące do ogólnego CTA "zaplanujmy Twój tort".
      Wystarczy zmienić `data-photo` na inny plik z `assets/photos/gallery-*.jpg`
      — zero zmian w CSS/JS.

## Priorytet 2 — prawdziwy trust signal przy hero
- [ ] Poprosić użytkowniczkę o realną ocenę i liczbę opinii z wizytówki Google
      (np. "5.0 · 15 opinii").
- [ ] Dodać krótką linijkę z tą liczbą przy CTA w hero (albo mały cytat z jednej
      z 4 już wdrożonych opinii) — **nie zgadywać/zmyślać liczby**.

## Priorytet 3 — "Boxy firmowe" i "Oferta sezonowa"
- [ ] Ustalić z użytkowniczką: czy pudełka/boxy firmowe to stała kategoria (dodać
      5. kartę do Oferty), czy oferta sezonowa pojawia się tylko okresowo
      (wtedy zaprojektować jako łatwy do włączenia/wyłączenia moduł, nie stałą
      kartę widoczną cały rok).
- [ ] Po decyzji: dopisać brief tekstu dla nowej karty (wzorem `BRIEF_TEKSTOW.md`)
      albo od razu wdrożyć, jeśli użytkowniczka dostarczy gotowy tekst i zdjęcie.

## Do rozważenia (niepilne)
- [ ] Kiedy strona trafi na docelową domenę: zaktualizować `og:image` w
      `index.html` z relatywnej ścieżki na pełny URL (przypominający komentarz
      już jest w kodzie).
- [ ] FAQ: nowa wersja (6 pytań od użytkowniczki) nie zawiera już starych pytań
      o alergie/dietę i o zadatek/płatność — sprawdzić z użytkowniczką, czy to
      świadome uproszczenie, czy warto je jednak przywrócić.
- [ ] Rozważyć dodanie kropek/scroll-hint także gdzie indziej, jeśli powstanie
      kolejny poziomy karuzelowy komponent — wzorzec (`*-dots` + JS z
      `initGalleryCarousel`/`initTestimonialCarousel`) jest już gotowy do
      skopiowania.
