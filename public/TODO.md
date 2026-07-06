# TODO.md — D_cake

## Priorytet 1 — hero przeprojektowane ✅ ZROBIONE
- [x] Usunięto kinowy mechanizm "rozwijania" wideo przy scrollu (sticky +
      scroll-driven `--progress`) — użytkowniczka oceniła go jako mało efektowny
      ("brak wow"). Nowy hero: stały, mocno zaokrąglony panel wideo w tle,
      tekst wyrównany do lewej (desktop) / wyśrodkowany (mobile), inspiracja:
      tailark "hero-section-5" z 21st.dev, przełożona na czysty CSS/JS (bez
      React/framer-motion — projekt celowo nie ma builda).
      Stare klasy `.hero-media-section/.hero-media-sticky/.hero-media-frame/
      .hero-overlay-*` zastąpione przez `.hero-media-panel/.hero-inner/.hero-copy/
      .hero-tag/.hero-brand/.hero-tagline/.hero-cta/.hero-signature`.
      `autoplay` na `<video>` i `100dvh` już były/są poprawne w nowej wersji.

## Priorytet 2 — prawdziwe opinie Google ✅ ZROBIONE
- [x] Podmieniono 4 wymyślone karty w sekcji Testimonials (`index.html`) na
      prawdziwe opinie z Google (Kasia Hołub, Dominika Dominika, Emilia Socha,
      Ela Balanda) — zrzuty ekranu dostarczone przez użytkowniczkę.

## Priorytet 3 — zdjęcie "Torty bento"
- [ ] Ustalić z użytkowniczką: czy dostarczy prawdziwe zdjęcie tortu bento, czy zostaje
      obecny zamiennik (`assets/photos/service-bento.jpg` — mini-deserki jednoporcjowe).
- [ ] Jeśli nowe zdjęcie: podmienić plik pod tą samą nazwą (`service-bento.jpg`) —
      strona podchwyci je automatycznie, zero zmian w kodzie.

## Do rozważenia (niepilne)
- [ ] Ewentualnie wykorzystać niewykorzystane zdjęcia z `Imagins/`: `Tort 1.jpeg`
      (kolorowy tort pop-art), `Ozdoby.jpeg` (zbliżenie na dekorację) — do zamiany
      któregoś z obecnych zdjęć w galerii, jeśli klientka zechce większą wariację.
- [ ] Kiedy strona trafi na docelową domenę: zaktualizować `og:image` w `index.html`
      z relatywnej ścieżki na pełny URL (obecnie jest komentarz przypominający o tym
      w kodzie).
