# PROJECT_CONTEXT.md — D_cake

## 1. Cel projektu
Statyczna strona (HTML/CSS/JS, bez frameworka/builda) dla **D_cake** — butikowej/domowej pracowni
tortów (torty na zamówienie, torty bento, desery weselne/eventowe, słodkie stoły) prowadzonej przez
**Dominikę Sołoń**, Chojeniec 36 (okolice Chełma / Siedliszcza, woj. lubelskie, Polska).

Język strony: polski. Priorytet: konwersja (zamówienia przez WhatsApp) i wygląd "premium",
nieszablonowy — świadomie unikamy domyślnych, generycznych rozwiązań AI-designu.
**Mobile to ok. 90% ruchu — wszystkie decyzje projektowe traktują mobile jako pierwszorzędne,
nie jako przeskalowany desktop.**

## 2. Co jest zrobione
- **Design system**: fonty **Petrona** (display) + **Public Sans** (body), paleta
  blush/cream/gold/slate w zmiennych CSS.
- **Hero**: stały, mocno zaokrąglony panel wideo w tle (bez animacji scroll-expand), tekst
  wyrównany do lewej na desktopie / wyśrodkowany na mobile. Logotyp **"D_cake" jako H1**
  (duże italic "D" + małe "_CAKE", odtworzone w CSS na wzór prawdziwego logo, nie obrazek) z
  jednorazową animacją "shine-sweep" przy wczytaniu strony. Nowy tagline + krótki dopisek o
  kanałach kontaktu (WhatsApp/Instagram/Facebook) + podpis "— Dominika Sołoń, założycielka".
- **O nas**: sekcja z "sygnaturą" — stylizowany fragment prawdziwej rozmowy WhatsApp (dymki)
  zamiast generycznej siatki 2 zdjęć + checklisty. Na mobile karta czatu jest pełnej
  szerokości i w normalnym przepływie dokumentu (nie "przypięta" jak na desktopie) — dzięki
  temu nigdy nie jest wyższa niż zdjęcie, na którym wizualnie "leży".
- **Oferta**: 4 karty usług (Torty na zamówienie, Torty bento, Słodkie stoły, Desery weselne
  i eventowe) w układzie **pełnokartowe zdjęcie + gradientowy scrim + tekst nachodzący od
  dołu** — ten sam wzorzec co Galeria i Kontakt, zamiast "zdjęcie na górze + biały blok
  tekstu". Zdjęcie tortu bento i deseru eventowego to teraz **prawdziwe zdjęcia klientki**
  (nie zamienniki). Kontekstowa wiadomość WhatsApp per kategoria (`data-wa-text`).
- **Proces**: oś czasu na mobile / siatka 4-kolumnowa na desktopie, większy font (16px),
  nowy lead na początku i pasek z CTA na końcu sekcji.
- **Galeria**: pozioma karuzela "coverflow" (przeciąganie/scroll, tilt/scale/opacity liczone
  w JS wg odległości od środka), **8 prawdziwych zdjęć** (rozszerzona z 6), kropki paginacji.
- **Opinie**: karuzela z **4 prawdziwymi opiniami z Google** (Kasia Hołub, Dominika Dominika,
  Emilia Socha, Ela Balanda) + kropki paginacji (ten sam wzorzec co Galeria) + CTA do Google.
- **FAQ**: 6 pytań i odpowiedzi z realną treścią dostarczoną przez użytkowniczkę.
- **Kontakt**: zdjęcie w tle z powolnym efektem Ken Burns + scrim, subtelne ziarno (grain) na
  ciemnych sekcjach (Proces + Kontakt), lista "co podać w pierwszej wiadomości", 4 przyciski
  (WhatsApp/Instagram/Facebook/e-mail).
- **Cała treść tekstowa strony** (meta/SEO, hero, o nas, oferta, proces, galeria, opinie, FAQ,
  kontakt, stopka) napisana przez użytkowniczkę (nie AI) i wdrożona 1:1, z katalogiem
  wszystkich pozycji w `BRIEF_TEKSTOW.md`.
- Kanały kontaktu (WhatsApp, Instagram, Facebook, Google Maps/opinie) scentralizowane w
  `js/config.js`.
- Dostępność: kontrast WCAG, stany focus, skip-link, `prefers-reduced-motion` wszędzie tam,
  gdzie jest ruch (w tym nowe animacje: shine-sweep na logo, Ken Burns w Kontakcie).
- Autorskie mikro-interakcje: shine-sweep (przyciski, kafelki galerii, logo w hero), oś czasu
  Procesu z podświetlającymi się kółkami, efekt głębi w karuzelach Galerii/Opinii, kropki
  paginacji (Galeria + Opinie), Ken Burns w Kontakcie.
- Dwa własne skille Claude Code zainstalowane w `~/.claude/skills/`:
  **`dcake-web-designer`** (kontekst marki, zasady wizualne/copy, kiedy krytykować pomysły)
  i **`critical-ui-ux-web-reviewer`** (ogólny, krytyczny audyt UI/UX — diagnoza przed
  rekomendacją, format Krytyczne/Ważne/Nice-to-have).

## 3. Co NIE działa / niedokończone
- **Tło sekcji Kontakt** to obecnie zdjęcie tortu na 70. urodziny (`gallery-1.jpg`) —
  efekt uboczny rozbudowy Galerii o nowe zdjęcia, technicznie działa poprawnie, ale
  tematycznie niedopasowane do uniwersalnego CTA "zaplanujmy Twój tort". Do podmiany.
- **Brak realnego trust signala przy hero** (np. "⭐ 5.0 · X opinii na Google") — czeka na
  prawdziwą liczbę od użytkowniczki; świadomie nie zgadywana/zmyślona.
- **"Boxy firmowe" i "oferta sezonowa"** wspomniane jako realna część oferty, ale świadomie
  NIE dodane jako karty w Ofercie — czeka na decyzję, czy to stała kategoria, czy sezonowy,
  włączany moduł (patrz TODO).
- `og:image` w `<head>` ma nadal ścieżkę względną — zamienić na pełny URL dopiero po
  wdrożeniu na docelową domenę (przypominający komentarz już jest w kodzie).

## 4. Ważne pliki
| Plik | Rola |
|---|---|
| `index.html` | Cała struktura/markup strony |
| `css/style.css` | Pełny design system i style wszystkich komponentów |
| `js/script.js` | Cała logika interaktywna (nav, reveal, karuzele Galerii/Opinii, akordeon, lightbox, sloty na zdjęcia, postęp Procesu, kropki paginacji) |
| `js/config.js` | **Jedyne źródło prawdy** dla danych kontaktowych/adresu/godzin — edytować tylko tutaj |
| `assets/photos/` | 14 zdjęć: `gallery-1..8.jpg` (Galeria), `service-custom/bento/wedding/sweet-table.jpg` (Oferta), `about-1/2.jpg` (O nas) |
| `assets/` | `logo.png`, `hero-poster.jpg/webp`, `hero-video.mp4`, `og-image.jpg` |
| `BRIEF_TEKSTOW.md` | Katalog wszystkich tekstów strony (temat, charakter, długość) — punkt odniesienia przy przyszłych zmianach copy |
| `Imagins/nowe/` | Źródłowe, nieprzetworzone zdjęcia dostarczone przez użytkowniczkę (już przetworzone i skopiowane do `assets/photos/`) |
| `.claude/launch.json` | Konfiguracja serwera podglądu (`npx serve`) |
| `Imagins/` (reszta), `Logo.png`, `ChatGPT Image....png`, `kling_...mp4` | Oryginalne pliki źródłowe (archiwum) — nieużywane bezpośrednio przez stronę |

## 5. Kluczowe decyzje
- Stack: czyste HTML/CSS/JS bez builda — świadomy wybór dla prostoty hostingu.
- Fonty: **Petrona + Public Sans** (zmiana z Fraunces + Instrument Sans — pierwszy wybór
  uznany za zbyt "AI-domyślny" dla tej branży w 2026 roku).
- Hero: **logotyp "D_cake" zostaje jako H1** (nie zamieniony na opisowe zdanie SEO) —
  zachowuje zbudowaną animację shine-sweep; zdanie SEO wykorzystane jako tagline zamiast.
  Layout zainspirowany tailark "hero-section-5" (21st.dev), przełożony na czysty CSS/JS.
- Galeria: karuzela "coverflow" zainspirowana "circular gallery" (21st.dev), świadomie
  przełożona na czysty CSS/JS zamiast WebGL/OGL — lżejsze, bez nowej zależności.
- **Odrzucone pomysły (z uzasadnieniem, nie wdrożone)**: animowany shader w tle całej
  strony (generyczny wzorzec SaaS/AI, ryzyko wydajności/reduced-motion), marquee opinii
  (słaba czytelność treści tekstowej, za mało realnych opinii by nie wyglądać na sztuczne),
  wyśrodkowane/oversized animowane logo w centrum hero (dubluje informację z H1, konkuruje
  z sygnaturowym momentem wideo).
- Sekcja O nas: zamiast siatki zdjęć + checklisty — stylizowana rozmowa WhatsApp jako
  "signature moment"; na mobile świadomie INNY układ niż desktop (pełna szerokość zamiast
  przypiętej karteczki), żeby dłuższy, realny tekst nie psuł proporcji.
- Oferta: **zostaje przy 4 kartach** — dodanie "boxów firmowych"/"oferty sezonowej" odłożone
  do osobnej decyzji (czy stała karta, czy sezonowy moduł).
- WhatsApp jako główny kanał zamówień (deep link `wa.me`, z kontekstową wiadomością per
  kategoria oferty), Instagram/Facebook/Google jako kanały drugorzędne. Brak
  koszyka/płatności/własnego backendu — strona to portfolio + kontakt, nie e-commerce.
- Zdjęcia wpinane przez auto-wykrywający system placeholderów (`data-photo` + JS) — podmiana
  pliku w `assets/photos/` = zero zmian w kodzie.
- Cała treść tekstowa napisana przez użytkowniczkę na podstawie briefu (`BRIEF_TEKSTOW.md`),
  nie generowana przez AI — wdrożona 1:1, z drobnymi edycjami strukturalnymi tam, gdzie
  tekst i zdjęcie się rozjeżdżały (np. usunięcie zbędnego powtórzenia nazwy marki).
- Do przetwarzania/kompresji zdjęć: **Node.js + pakiet `sharp`** (ad hoc, w scratchpadzie) —
  w tym środowisku brak ImageMagick i Pythona.

## 6. Błędne ścieżki — NIE powtarzać
- **Nie naprawiać scrolla poziomego przez `overflow-x: hidden` na `html`/`body`** — po cichu
  psuje `position: sticky` w całym dokumencie. Właściwe rozwiązanie: dedykowany wrapper
  `position: fixed` (rozmiar przez `100vw`/`100dvh`, NIE `inset: 0` jeśli jakiś przodek ma
  `backdrop-filter`) opakowujący tylko problematyczny element poza-ekranowy.
- **`backdrop-filter` (albo transform/filter/perspective) na przodku** po cichu staje się
  containing blockiem dla potomków `position: fixed` — `inset: 0` przestaje odnosić się do
  viewportu.
- **CSS Grid + domyślne `min-width: auto` na elementach siatki** potrafi zepsuć layout w
  obie strony: (a) kolumna zapada się do `0×0`, jeśli jedyna treść potomków jest
  `position:absolute` (bez realnej, wpływającej na rozmiar zawartości) — dodać jawne
  `width: 100%`; (b) kolumna robi się SZERSZA niż powinna, jeśli potomek ma
  `white-space: nowrap` i długi tekst (np. przycisk) — dodać `min-width: 0` na elemencie
  siatki, żeby respektował zamierzoną szerokość zamiast rozciągać się pod treść.
- **Specyficzność CSS**: reguła z klasą stanu (np. `.step-num.is-reached`) może po cichu
  wygrać z "resetem" wewnątrz media query, mimo że reset jest fizycznie później w pliku —
  wyższa specyficzność wygrywa niezależnie od kolejności/media query. Trzeba dopasować
  specyficzność w regule resetującej (dopisać tę samą klasę stanu), nie tylko przenosić ją
  niżej w pliku.
- **`z-index: -1` wymaga, żeby rodzic faktycznie tworzył stacking context** (`position:
  relative` + jawne `z-index: 0`, samo `position: relative` nie wystarczy) — inaczej
  pseudo-element z ujemnym z-index może wylądować za wcześniejszą, niepowiązaną treścią
  strony zamiast tylko za własnym rodzicem.
- **`setPointerCapture()` potrafi po cichu przekierować cel zdarzenia `click`** na element
  przechwytujący (np. tor karuzeli), psując pojedyncze listenery kliknięcia na dzieciach
  (np. otwieranie lightboxa po drag-to-scroll w galerii) — używać `pointermove`/`pointerup`
  na `window` w trakcie przeciągania zamiast pointer capture.
- **Nie odczytywać `getBoundingClientRect()`/pozycji scrolla zaraz po `window.scrollTo()`**
  gdy `scroll-behavior: smooth` jest ustawione na `html` — wynik jest z animacji w trakcie
  (nieaktualny). Rozdzielać na dwa osobne wywołania.
- **Zawsze sprawdzać zgodność wag/stylów fontów w CSS z tym, co faktycznie wczytane** w
  `<link>` Google Fonts — niezgodność = cichy fake bold/italic (font-synthesis) bez
  ostrzeżenia w konsoli.
- **Nie wstawiać `<div>` bezpośrednio wewnątrz `<ol>`/`<ul>`** dla elementów
  dekoracyjnych — invalid HTML; opakować listę w pozycjonowany `<div>`-wrapper zamiast tego.
- **Po podmianie krótkiego tekstu placeholder na dłuższy, prawdziwy — zawsze przeliczyć
  proporcje kontenerów** kalibrowanych pod tamten krótszy tekst (np. karta czatu, która była
  mniejsza niż zdjęcie, urosła i zaczęła je przesłaniać po wstawieniu realnej treści).
- **`WebFetch` nie widzi treści renderowanej przez JS** (np. opinii na Google Maps) —
  potrzebna prawdziwa przeglądarka albo treść dostarczona przez użytkownika.
- **Artefakty środowiska podglądu — rozpoznawać i nie gonić jako błędy strony**:
  pusty/zbiały zrzut ekranu przy pierwszym ujęciu zaraz po scrollu/reloadzie (pomaga
  ponowny zrzut); `preview_click` czasem fałszywie wykrywa "przeciągnięcie" tuż po innej
  interakcji, blokując oczekiwany klik (weryfikować przez bezpośredni `element.click()` w
  `preview_eval`); `window.innerWidth` bywa szerszy niż `document.documentElement.
  clientWidth` o szerokość scrollbara zarezerwowanego przez testową przeglądarkę (nie
  występuje na prawdziwych telefonach — overlay scrollbars mają zerową szerokość).
- **Nie mylić zamiennika zdjęcia z prawdziwym produktem** w podpisach/alt — jeśli używane
  jest zdjęcie zastępcze, opisywać uczciwie co faktycznie widać i jawnie zgłosić lukę
  użytkowniczce (ten problem został już rozwiązany dla bento/deseru eventowego — oba mają
  teraz prawdziwe zdjęcia).

## 7. Stan sesji
Zobacz `TODO.md` dla konkretnych, zadaniowych następnych kroków.
