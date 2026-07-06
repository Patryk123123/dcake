# PROJECT_CONTEXT.md — D_cake

## 1. Cel projektu
Statyczna strona (HTML/CSS/JS, bez frameworka/builda) dla **D_cake** — butikowej pracowni tortów
(torty na zamówienie, torty bento, desery weselne, słodkie stoły) prowadzonej przez
**Dominikę Sołoń**, Chojeniec 36 (okolice Chełma / Siedliszcza, Polska).

Język strony: polski. Priorytet: konwersja (zamówienia przez WhatsApp) i wygląd "premium",
nieszablonowy — świadomie unikamy domyślnych, generycznych rozwiązań AI-designu.

## 2. Co jest zrobione
- Pełna struktura strony: nagłówek/nawigacja, hero (stały, mocno zaokrąglony panel wideo
  w tle — bez animacji scroll-expand, tekst wyrównany do lewej na desktopie/wyśrodkowany
  na mobile, hasło, CTA i podpis właścicielki), O nas (sekcja z "sygnaturą": stylizowany
  fragment rozmowy WhatsApp przypięty na zdjęciu tortu zamiast generycznej siatki 2 zdjęć),
  Oferta (4 karty usług), Proces (oś czasu na mobile / siatka na desktopie), Galeria
  (pozioma karuzela typu "coverflow" — przeciąganie/scroll w bok, karty tilt/scale/opacity
  wg odległości od środka, ta sama wersja na desktopie i mobile), Opinie (karuzela z
  prawdziwymi opiniami z Google + CTA do Google), FAQ (układ 2-kolumnowy na desktopie),
  Kontakt, stopka.
- Design system: fonty **Petrona** (display) + **Public Sans** (body) — świadomie
  zmienione z Fraunces+Instrument Sans (uznanych za zbyt "AI-domyślne" dla tej branży),
  paleta blush/cream/gold/slate w zmiennych CSS.
- 12 prawdziwych zdjęć klientki wpiętych przez system samo-wypełniających się placeholderów
  (atrybut `data-photo` + próba wczytania w JS + fallback na graficzny placeholder).
- Kanały kontaktu (WhatsApp, Instagram, Facebook, Google Maps/opinie) scentralizowane w
  `js/config.js`.
- Wydajność: skompresowane assety (webp/jpg zamiast oryginalnych PNG), `og:image` do
  udostępniania linków.
- Dostępność: poprawki kontrastu WCAG, stany focus, skip-link, `prefers-reduced-motion`
  wszędzie tam, gdzie jest ruch.
- Autorskie mikro-interakcje: shine-sweep na głównych przyciskach i kafelkach galerii,
  oś czasu Procesu z podświetlającymi się kółkami, efekt głębi w karuzeli opinii, kropki
  paginacji galerii na mobile, akcent FAQ.
- Naprawione realne błędy: `overflow-x` psujący `position:sticky`, kontrast tekstu na
  ciemnym tle (footer/kontakt), niedopasowane wagi/style fontów (fake bold/italic), błąd
  struktury siatki hero, nadpisywanie ikony Instagrama przez tekst.

## 3. Co NIE działa / niedokończone
- Hero i Galeria zostały przeprojektowane (patrz sekcja 2) — stary problem ze
  scroll-expand wideo na mobile jest nieaktualny, bo cały ten mechanizm został usunięty.
- W środowisku podglądu (preview tool) zaobserwowano migotanie `video.paused` na hero —
  **zdiagnozowane jako artefakt narzędzia**, nie błąd strony: `document.hidden` zwracał
  `true` (karta w tle z perspektywy przeglądarki), a instrumentacja `play()`/`pause()`
  potwierdziła zero wywołań z kodu strony. Realny odwiedzający z aktywną kartą tego nie
  zobaczy — nie wymaga dalszej akcji.
- Opinie w sekcji Testimonials to teraz **prawdziwe opinie z Google** (Kasia Hołub,
  Dominika Dominika, Emilia Socha, Ela Balanda) — dostarczone przez użytkowniczkę jako
  zrzuty ekranu.
- Zdjęcie w kategorii **"Torty bento"** (`assets/photos/service-bento.jpg`) to zamiennik
  (mini-deserki jednoporcjowe), nie prawdziwy tort bento — brak takiego zdjęcia wśród
  dostarczonych.
- Niewykorzystane, dobre zdjęcia w zapasie (folder `Imagins/`): `Tort 1.jpeg` (kolorowy tort
  pop-art), `Ozdoby.jpeg` (zbliżenie na dekorację z misiem) — można nimi coś podmienić.

## 4. Ważne pliki
| Plik | Rola |
|---|---|
| `index.html` | Cała struktura/markup strony |
| `css/style.css` | Pełny design system i style wszystkich komponentów |
| `js/script.js` | Cała logika interaktywna (nav, reveal, hero expand, karuzela, akordeon, lightbox, sloty na zdjęcia, postęp Procesu, kropki galerii) |
| `js/config.js` | **Jedyne źródło prawdy** dla danych kontaktowych/adresu/godzin — edytować tylko tutaj, reszta kodu czyta stąd automatycznie |
| `assets/` | `logo.png`, `hero-poster.jpg/webp`, `hero-video.mp4`, `og-image.jpg`, `assets/photos/` (12 przetworzonych zdjęć: `about-1/2.jpg`, `service-custom/bento/wedding/sweet-table.jpg`, `gallery-1..6.jpg`) |
| `.claude/launch.json` | Konfiguracja serwera podglądu (`npx serve`) |
| `Imagins/`, `Logo.png`, `ChatGPT Image....png`, `kling_...mp4` | Oryginalne pliki źródłowe (mastery) — nieużywane bezpośrednio przez stronę, tylko jako archiwum |

## 5. Kluczowe decyzje
- Stack: czyste HTML/CSS/JS bez builda — świadomy wybór dla prostoty hostingu.
- Fonty zmienione z Playfair Display + Jost na **Fraunces + Instrument Sans** — pierwszy
  wybór uznany za zbyt szablonowy dla tej branży (audyt wg wytycznych frontend-design).
- Hero: scalone w JEDNĄ sekcję (tekst + wideo), z nałożonym CTA i podpisem
  "— Dominika Sołoń, założycielka". Pierwotny "kinowy" mechanizm scroll-expand (sticky +
  rosnąca ramka przy przewijaniu) zamieniony na stały, mocno zaokrąglony panel wideo w
  tle z tekstem wyrównanym do lewej (desktop) — użytkowniczka oceniła oryginał jako
  "brak wow"; inspiracja layoutem: tailark "hero-section-5" (21st.dev), przełożona na
  czysty CSS/JS bez frameworka/zależności (projekt nie ma builda).
- Galeria: bento-grid (desktop) + przewijany pasek (mobile) zamienione na JEDNĄ,
  ujednoliconą poziomą karuzelę "coverflow" (przeciąganie/scroll w bok, tilt/scale/opacity
  liczone w JS wg odległości od środka) na obu rozdzielczościach — inspiracja: "circular
  gallery" z 21st.dev, świadomie przełożona na czysty CSS/JS zamiast WebGL/OGL (lżejsze,
  bez nowej zależności, spójne z resztą strony).
- WhatsApp jako główny kanał zamówień (deep link `wa.me`), Instagram/Facebook/Google jako
  kanały drugorzędne. Brak koszyka/płatności/własnego backendu.
- Proces i Galeria na mobile zaprojektowane od nowa (oś czasu / przewijany pasek), nie
  przeskalowany układ desktopowy.
- Zdjęcia wpinane przez auto-wykrywający system placeholderów — podmiana pliku w
  `assets/photos/` = zero zmian w kodzie.
- Opinie Google: zamiast zmyślać treść, dodany uczciwy link wychodzący do prawdziwej
  wizytówki (bo statyczna strona bez backendu/Places API nie może ich realnie pobrać).

## 6. Błędne ścieżki — NIE powtarzać
- **Nie naprawiać scrolla poziomego przez `overflow-x: hidden` na `html`/`body`** — po cichu
  psuje `position: sticky` w całym dokumencie. Właściwe rozwiązanie: dedykowany wrapper
  `position: fixed` (rozmiar przez `100vw`/`100dvh`, NIE `inset: 0` jeśli jakiś przodek ma
  `backdrop-filter`) opakowujący tylko problematyczny element poza-ekranowy.
- **`backdrop-filter` (albo transform/filter/perspective) na przodku** (np. nagłówek z
  efektem szkła) po cichu staje się containing blockiem dla potomków `position: fixed` —
  `inset: 0` przestaje odnosić się do viewportu.
- **Nie odczytywać `getBoundingClientRect()`/pozycji scrolla zaraz po `window.scrollTo()`**
  gdy `scroll-behavior: smooth` jest ustawione na `html` — wynik jest z animacji w trakcie
  (nieaktualny). Rozdzielać na dwa osobne wywołania.
- **Zawsze sprawdzać zgodność wag/stylów fontów w CSS z tym, co faktycznie wczytane** w
  `<link>` Google Fonts — niezgodność = cichy fake bold/italic (font-synthesis) bez
  ostrzeżenia w konsoli.
- **Nie wstawiać `<div>` bezpośrednio wewnątrz `<ol>`/`<ul>`** dla elementów
  dekoracyjnych — invalid HTML; opakować listę w pozycjonowany `<div>`-wrapper zamiast tego.
- **`WebFetch` nie widzi treści renderowanej przez JS** (np. opinii na Google Maps) —
  potrzebna prawdziwa przeglądarka (`claude-in-chrome`) albo treść dostarczona przez
  użytkownika.
- **Zrzuty ekranu podglądu bywają zniekształcone przy szerokich viewportach** w tym
  środowisku — to problem narzędzia, nie strony. Weryfikować przez DOM/computed style,
  restart serwera podglądu zwykle pomaga przy zawieszeniu.
- **Nie mylić zamiennika zdjęcia z prawdziwym produktem** w podpisach/alt — jeśli użyte
  jest zdjęcie zastępcze (np. mini-deserki zamiast tortu bento), opisywać uczciwie co
  faktycznie widać i jawnie zgłosić lukę użytkowniczce.

## 7. Stan sesji
Zobacz `TODO.md` dla konkretnych, zadaniowych następnych kroków.
