// Dziwkarot — talia 37 kart
// Każda karta: id, numer, nazwa, plik grafiki, słowa-klucze,
// znaczenie w pozycji prostej (upright) i odwróconej (reversed).
// Klimat: satyryczno-mistyczny. Projekt humorystyczny — nie traktuj poważnie.

export const cards = [
  {
    id: 0,
    name: "Klasyczna",
    file: "card_00_klasyczna.webp",
    keywords: ["archetyp", "tradycja", "porządek"],
    upright:
      "Fundament talii. Wszystko zaczyna się i kończy na niej — znak, że sytuacja rozwinie się dokładnie tak, jak podpowiada Ci intuicja, bez fajerwerków, ale i bez niespodzianek.",
    reversed:
      "Klasyka, która wyszła z formy. Trzymasz się schematu, który dawno przestał działać — czas odświeżyć podejście.",
  },
  {
    id: 1,
    name: "Głupia",
    file: "card_01_glupia.webp",
    keywords: ["naiwność", "spontaniczność", "brak planu"],
    upright:
      "Karta beztroski. Los sprzyja tym, którzy nie myślą za dużo — czasem najlepszą strategią jest jej całkowity brak.",
    reversed:
      "Udawana naiwność. Ktoś w Twoim otoczeniu gra głupszego niż jest — nie daj się zwieść.",
  },
  {
    id: 2,
    name: "Klasyczno-Głupia",
    file: "card_02_klasyczna-glupia.webp",
    keywords: ["sprzeczność", "hybryda", "chaos w porządku"],
    upright:
      "Spotkanie tradycji z brakiem refleksji. Znak, że dwie przeciwne siły w Twoim życiu właśnie się połączyły — wynik bywa zaskakująco udany.",
    reversed:
      "Konflikt wewnętrzny. Chcesz robić po swojemu i po staremu jednocześnie — wybierz jedno.",
  },
  {
    id: 3,
    name: "Ta z Pracy",
    file: "card_03_dziwka-z-pracy.webp",
    keywords: ["obowiązek", "rutyna", "granice"],
    upright:
      "Sprawy zawodowe wysuwają się na pierwszy plan. Karta przypomina, by nie mylić kolegów z rodziną — ale i nie wojować tam, gdzie wystarczy uśmiech.",
    reversed:
      "Praca wchodzi tam, gdzie nie powinna. Zatrzyj granicę między biurkiem a resztą życia, zanim ona zatrze Ciebie.",
  },
  {
    id: 4,
    name: "Fajna",
    file: "card_04_fajna.webp",
    keywords: ["lekkość", "sympatia", "dobra energia"],
    upright:
      "Rzadka i wyczekiwana. Zapowiada spotkanie z kimś, kto nic nie chce i niczego nie udaje — ciesz się, bo to prezent od wszechświata.",
    reversed:
      "Za dobre, by było prawdziwe. Ktoś jest „fajny” tylko dopóki mu to na rękę.",
  },
  {
    id: 5,
    name: "Chyba",
    file: "card_05_chyba.webp",
    keywords: ["niepewność", "wahanie", "przeczucie"],
    upright:
      "Karta niedopowiedzenia. Nie masz jeszcze pewności i słusznie — poczekaj, aż mgła opadnie, zanim wydasz werdykt.",
    reversed:
      "Wypieranie oczywistości. W głębi duszy już wiesz — przestań dodawać „chyba” do rzeczy pewnych.",
  },
  {
    id: 6,
    name: "Mobilna",
    file: "card_06_mobilna.webp",
    keywords: ["ruch", "dostępność", "zmienność"],
    upright:
      "Wszędzie i nigdzie. Zapowiada dynamiczny okres pełen ruchu — energia płynie, ale trudno ją złapać w jednym miejscu.",
    reversed:
      "Ciągła gotowość, która wypala. Bycie zawsze pod ręką sprawiło, że nikt już nie docenia Twojej obecności.",
  },
  {
    id: 7,
    name: "Tania",
    file: "card_07_tania.webp",
    keywords: ["kompromis", "wartość", "okazja"],
    upright:
      "Okazja za grosze — ale karta pyta, czy na pewno chcesz to, co dostajesz za darmo. Nie wszystko tanie jest oszczędnością.",
    reversed:
      "Zaniżona wartość. Sprzedajesz się poniżej ceny — świat kupi dokładnie tyle, ile sam za siebie zażądasz.",
  },
  {
    id: 8,
    name: "Książkowa",
    file: "card_08_ksiazkowa.webp",
    keywords: ["ideał", "teoria", "wzorzec"],
    upright:
      "Podręcznikowy przykład. Wszystko układa się dokładnie tak, jak powinno — czasem jednak życie jest ciekawsze poza konspektem.",
    reversed:
      "Teoria kontra praktyka. Trzymasz się zasad z książki, choć rzeczywistość napisała już własny rozdział.",
  },
  {
    id: 9,
    name: "Burdelowa",
    file: "card_09_burdelowa.webp",
    keywords: ["nadmiar", "bałagan", "intensywność"],
    upright:
      "Bujne, głośne i przesadzone. Nadchodzi okres obfitości we wszystkim — również w chaosie. Baw się, ale ogarnij po sobie.",
    reversed:
      "Bałagan, który wymknął się spod kontroli. Pora posprzątać — dosłownie i w przenośni.",
  },
  {
    id: 10,
    name: "Ex",
    file: "card_10_ex.webp",
    keywords: ["przeszłość", "powrót", "domknięcie"],
    upright:
      "Coś ze starego rozdziału wraca. Karta pyta: nauka czy nawyk? Przeszłość puka do drzwi — sam zdecyduj, czy otworzysz.",
    reversed:
      "Rozpamiętywanie. Trzymasz się tego, co dawno się skończyło — domknij i idź dalej.",
  },
  {
    id: 11,
    name: "Pół-Dziwka",
    file: "card_11_pol-dziwka.webp",
    keywords: ["połowiczność", "ambiwalencja", "niezdecydowanie"],
    upright:
      "Jedną nogą tu, drugą tam. Znak, że stoisz w rozkroku między dwiema opcjami — dobra chwila, by wreszcie postawić na jedną.",
    reversed:
      "Robota na pół gwizdka. Angażujesz się połowicznie i tego samego oczekujesz w zamian — podnieś stawkę albo odpuść.",
  },
  {
    id: 12,
    name: "Brzydka",
    file: "card_12_brzydka.webp",
    keywords: ["pozory", "głębia", "niedoceniona"],
    upright:
      "Nie oceniaj po okładce. Karta zdradza, że prawdziwa wartość kryje się tam, gdzie inni nawet nie spojrzą.",
    reversed:
      "Kompleks, który sam sobie stworzyłeś. To nie świat Cię tak widzi — to Twój własny osąd rzuca cień.",
  },
  {
    id: 13,
    name: "Randomowa",
    file: "card_13_randomowa.webp",
    keywords: ["przypadek", "los", "nieprzewidywalność"],
    upright:
      "Czysty rzut kośćmi. Wszechświat tasuje karty na oślep — nadchodzące wydarzenie nie ma logiki, ma tylko timing.",
    reversed:
      "Chaos udający przeznaczenie. Nie doszukuj się znaków tam, gdzie działa zwykły przypadek.",
  },
  {
    id: 14,
    name: "Skryta",
    file: "card_14_skryta.webp",
    keywords: ["tajemnica", "dystans", "ukryte intencje"],
    upright:
      "Nie wszystko widać na pierwszy rzut oka. Karta radzi cierpliwość — prawda wyjdzie, ale w swoim czasie.",
    reversed:
      "Sekret na wierzchu. To, co ktoś ukrywa, właśnie zaczyna prześwitywać — udawaj, że nie widzisz, albo zapytaj wprost.",
  },
  {
    id: 15,
    name: "Multi",
    file: "card_15_multi.webp",
    keywords: ["wielozadaniowość", "rozproszenie", "obfitość"],
    upright:
      "Wiele wątków naraz. Masz energię, by żonglować kilkoma sprawami — ale uważaj, by żadnej nie upuścić.",
    reversed:
      "Przebodźcowanie. Za dużo na raz sprawia, że nic nie jest zrobione porządnie — zawęź pole.",
  },
  {
    id: 16,
    name: "Niewdzięczna",
    file: "card_16_niewdzieczna.webp",
    keywords: ["brak uznania", "wysiłek", "równowaga"],
    upright:
      "Dajesz więcej, niż dostajesz. Karta przypomina, że dobroć nie musi być darmowa dla każdego — należy Ci się wdzięczność.",
    reversed:
      "To Ty zapomniałeś podziękować. Ktoś zrobił dla Ciebie więcej, niż zauważyłeś — odwdzięcz się, póki czas.",
  },
  {
    id: 17,
    name: "Natrętna",
    file: "card_17_natretna.webp",
    keywords: ["upór", "presja", "granice"],
    upright:
      "Coś lub ktoś nie odpuszcza. Znak, że warto jasno postawić granicę, zanim uprzejmość zostanie wzięta za zaproszenie.",
    reversed:
      "To Ty naciskasz za mocno. Odpuść — im mocniej ściskasz, tym szybciej to ucieka.",
  },
  {
    id: 18,
    name: "Materialna",
    file: "card_18_materialna.webp",
    keywords: ["pieniądze", "dobra", "przywiązanie"],
    upright:
      "Sprawy finansowe wchodzą na pierwszy plan. Dobry czas na inwestycję — pod warunkiem, że nie mylisz wartości z ceną.",
    reversed:
      "Chciwość przesłania resztę. Gonisz za tym, co się liczy, a mija to, co bezcenne.",
  },
  {
    id: 19,
    name: "Te Dziwki",
    file: "card_19_te-dziwki.webp",
    keywords: ["grupa", "plotka", "otoczenie"],
    upright:
      "Karta zbiorowości. Twoje otoczenie ma teraz realny wpływ na bieg spraw — dobierz towarzystwo z rozmysłem.",
    reversed:
      "Toksyczna sfora. Grupa ciągnie Cię w dół — czas wybić się z układu, który tylko obgaduje.",
  },
  {
    id: 20,
    name: "Mailowa",
    file: "card_20_mailowa.webp",
    keywords: ["komunikacja", "dystans", "formalność"],
    upright:
      "Wiadomość w drodze. Ktoś odezwie się na chłodno i konkretnie — odpowiedz w tym samym tonie, a sprawa pójdzie gładko.",
    reversed:
      "Nieodczytane wiadomości. Zwlekasz z odpowiedzią, która sama się nie napisze — skrzynka nie wybaczy.",
  },
  {
    id: 21,
    name: "Korpo",
    file: "card_21_korpo.webp",
    keywords: ["system", "hierarchia", "procedura"],
    upright:
      "Świat procedur i slajdów. Znak, że sukces wymaga teraz gry według reguł — nawet jeśli reguły są absurdalne.",
    reversed:
      "Wypalenie w trybach machiny. System Cię przeżuwa — poszukaj sensu poza organigramem.",
  },
  {
    id: 22,
    name: "Przełożona",
    file: "card_22_przeloz.webp",
    keywords: ["władza", "autorytet", "kontrola"],
    upright:
      "Ktoś trzyma stery. Karta radzi rozpoznać, kto naprawdę decyduje — i grać z tą osobą, a nie przeciw niej.",
    reversed:
      "Nadużycie władzy. Autorytet, który przestał zasługiwać na szacunek — nie każdy tytuł oznacza mądrość.",
  },
  {
    id: 23,
    name: "Neutralna",
    file: "card_23_neutralna.webp",
    keywords: ["równowaga", "dystans", "obiektywizm"],
    upright:
      "Ani ciepło, ani zimno. Znak, by zachować spokój i nie angażować się w cudze wojny — bezstronność to Twoja siła.",
    reversed:
      "Obojętność udająca spokój. Siedzenie na płocie też jest decyzją — czasem trzeba się opowiedzieć.",
  },
  {
    id: 24,
    name: "Marudna",
    file: "card_24_marudna.webp",
    keywords: ["narzekanie", "niezadowolenie", "perspektywa"],
    upright:
      "Głos, który we wszystkim widzi wadę. Karta przypomina: krytyka bywa cenna, ale nie zamieszkaj w niej na stałe.",
    reversed:
      "Narzekanie zamiast działania. Marudzenie nic nie zmieni — zamień skargę na jeden konkretny krok.",
  },
  {
    id: 25,
    name: "Stara",
    file: "card_25_stara.webp",
    keywords: ["doświadczenie", "mądrość", "czas"],
    upright:
      "Karta mądrości z przebiegiem. Zapowiada radę od kogoś, kto już to wszystko przeżył — słuchaj uważnie.",
    reversed:
      "Utknięcie w dawnych czasach. „Kiedyś to było” nie zapłaci dzisiejszych rachunków — zaktualizuj się.",
  },
  {
    id: 26,
    name: "Problematyczna",
    file: "card_26_problematyczna.webp",
    keywords: ["konflikt", "komplikacja", "wyzwanie"],
    upright:
      "Zapowiedź komplikacji. Nic się samo nie rozwiąże — ale każdy problem to też zaproszenie, by wykazać się sprytem.",
    reversed:
      "Robisz problem z niczego. Sprawa jest prostsza, niż ją malujesz — przestań dokładać dramatu.",
  },
  {
    id: 27,
    name: "Koordynatorka",
    file: "card_27_koordynatorka.webp",
    keywords: ["organizacja", "kontrola", "sprawczość"],
    upright:
      "Ktoś spina wszystko w całość. Karta zwiastuje osobę (może Ciebie), która zapanuje nad chaosem — doceń logistyków losu.",
    reversed:
      "Mikrozarządzanie. Chęć kontroli nad wszystkim dusi to, co miało płynąć samo — odpuść lejce.",
  },
  {
    id: 28,
    name: "Lodowa",
    file: "card_28_lodowa.webp",
    keywords: ["chłód", "dystans", "opanowanie"],
    upright:
      "Zimna krew w gorącej sytuacji. Karta radzi opanowanie — kto zachowa chłód, ten rozdaje karty.",
    reversed:
      "Mróz, który odstrasza. Twój dystans wzięto za pogardę — czasem warto odrobinę odtajać.",
  },
  {
    id: 29,
    name: "Wokalizująca",
    file: "card_29_wokalizujaca.webp",
    keywords: ["ekspresja", "głos", "dramat"],
    upright:
      "Nic po cichu. Znak, że nadchodzi czas głośnego wyrażania siebie — świat usłyszy Twoje zdanie, chcąc czy nie.",
    reversed:
      "Dużo hałasu o nic. Głośność nie równa się treści — mniej decybeli, więcej konkretu.",
  },
  {
    id: 30,
    name: "Strategiczna",
    file: "card_30_strategiczna.webp",
    keywords: ["plan", "kalkulacja", "dalekowzroczność"],
    upright:
      "Każdy ruch przemyślany. Karta sprzyja tym, którzy grają w długą — układ figur zaczyna działać na Twoją korzyść.",
    reversed:
      "Przekombinowanie. Tyle planujesz, że przegapiasz otwarte drzwi tuż przed nosem.",
  },
  {
    id: 31,
    name: "Ofiarna",
    file: "card_31_ofiarna.webp",
    keywords: ["poświęcenie", "hojność", "granice"],
    upright:
      "Dajesz siebie bez reszty. Piękna cecha — o ile na dnie zostaje jeszcze coś dla Ciebie.",
    reversed:
      "Męczeństwo na pokaz. Poświęcenie, którym się szantażuje, przestaje być darem — przestań liczyć rachunek krzywd.",
  },
  {
    id: 32,
    name: "Dziwki Ex",
    file: "card_32_dziwki-ex.webp",
    keywords: ["przeszłe więzi", "wspomnienia", "sieć"],
    upright:
      "Cały orszak przeszłości naraz. Karta zapowiada, że dawne wątki się przypomną — potraktuj je jak muzeum, nie jak dom.",
    reversed:
      "Grzebanie w archiwum. Wracasz do zamkniętych spraw w poszukiwaniu odpowiedzi, których tam już nie ma.",
  },
  {
    id: 33,
    name: "Lodowa II",
    file: "card_33_lodowa-2.webp",
    keywords: ["nawrót", "chłód", "powtórka"],
    upright:
      "Chłód powraca w nowej odsłonie. Ta sama lekcja o dystansie — tym razem odrób ją do końca.",
    reversed:
      "Zamrożenie totalne. Zbyt długo trzymasz gardę — pod lodem też można się udusić. Wpuść trochę ciepła.",
  },
  {
    id: 34,
    name: "Telefoniczna",
    file: "card_34_telefoniczna.webp",
    keywords: ["kontakt", "rozmowa", "sygnał"],
    upright:
      "Telefon zadzwoni w samą porę. Karta zwiastuje rozmowę, która przesunie sprawy do przodu — odbierz.",
    reversed:
      "Cisza w słuchawce. Czekasz na sygnał, który nie nadejdzie — zadzwoń pierwszy albo odpuść numer.",
  },
  {
    id: 35,
    name: "W Swoim Świecie",
    file: "card_35_z-autyzmem.webp",
    keywords: ["skupienie", "wewnętrzny świat", "hiperfokus"],
    upright:
      "Głęboka koncentracja na własnym rytmie. Karta chwali tych, którzy widzą świat po swojemu — Twoja unikalna perspektywa to atut, nie wada.",
    reversed:
      "Odcięcie od otoczenia. Tak głęboko wsiąkłeś we własny świat, że umknęło Ci to, co dzieje się obok — wychyl głowę.",
  },
  {
    id: 36,
    name: "Spóźnialska",
    file: "card_36_spoznialska.webp",
    keywords: ["czas", "opóźnienie", "rytm"],
    upright:
      "Wszystko przyjdzie — tylko później, niż planowałeś. Karta radzi cierpliwość: timing wszechświata rzadko zgadza się z Twoim kalendarzem.",
    reversed:
      "Chroniczne spóźnianie. Ciągłe „zaraz” zaczyna kosztować Cię szanse — ktoś w końcu przestanie czekać.",
  },
];

export default cards;
