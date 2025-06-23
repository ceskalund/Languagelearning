// src/components/NorwegianSynonyms.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const NorwegianSynonyms = ({ sessionType, onScoreUpdate }) => {
  // State for session tracking
  const [gameStage, setGameStage] = useState('intro');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [questionCount, setQuestionCount] = useState(0);
  const maxQuestions = 20;
  
  // State for current question
  const [currentWord, setCurrentWord] = useState(null);
  const [options, setOptions] = useState([]);
  const [usedWordIds, setUsedWordIds] = useState(new Set());
  const [incorrectWordIds, setIncorrectWordIds] = useState(new Set());
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [result, setResult] = useState({ 
    status: '',
    message: ''
  });
  const [readyForNextQuestion, setReadyForNextQuestion] = useState(false);
  
  // State for tracking score and session stats
  const [score, setScore] = useState(0);
  const [sessionStats, setSessionStats] = useState({
    correct: [],
    incorrect: [],
    words: {}
  });

  // Norwegian synonym data (this would normally be imported from a data file)
  const norwegianSynonyms = [
    {
      id: 1,
      word: "Vakker",
      options: [
        { id: "A", text: "Pen", correct: true },
        { id: "B", text: "Nydelig", correct: false },
        { id: "C", text: "Praktfull", correct: false }
      ],
      nuance: "\"Pen\" er mer hverdagslig enn \"nydelig\", mens \"praktfull\" er enda sterkere og mer storslått. (\"Pen\" is more everyday than \"nydelig\", while \"praktfull\" is even stronger and more magnificent.)"
    },
    {
      id: 2,
      word: "Rask",
      options: [
        { id: "A", text: "Kjapp", correct: true },
        { id: "B", text: "Hurtig", correct: false },
        { id: "C", text: "Lynrask", correct: false }
      ],
      nuance: "\"Kjapp\" refererer til noe som skjer på kort tid, \"hurtig\" fokuserer på fart, mens \"lynrask\" er ekstremt raskt. (\"Kjapp\" refers to something happening in a short time, \"hurtig\" focuses on speed, while \"lynrask\" is extremely fast.)"
    },
    {
      id: 3,
      word: "Stor",
      options: [
        { id: "A", text: "Enorm", correct: false },
        { id: "B", text: "Svær", correct: false },
        { id: "C", text: "Anselig", correct: true }
      ],
      nuance: "\"Anselig\" betyr betydelig stor, \"svær\" er mer uformelt og indikerer noe veldig stort, mens \"enorm\" er ekstremt stort. (\"Anselig\" means considerably large, \"svær\" is more informal and indicates something very big, while \"enorm\" is extremely large.)"
    },
    {
      id: 4,
      word: "Glad",
      options: [
        { id: "A", text: "Lykkelig", correct: false },
        { id: "B", text: "Fornøyd", correct: true },
        { id: "C", text: "Munter", correct: false }
      ],
      nuance: "\"Fornøyd\" indikerer tilfredshet, \"lykkelig\" er en dypere følelse av glede, mens \"munter\" fokuserer på humøret. (\"Fornøyd\" indicates satisfaction, \"lykkelig\" is a deeper feeling of happiness, while \"munter\" focuses on cheerfulness.)"
    },
    {
      id: 5,
      word: "Plutselig",
      options: [
        { id: "A", text: "Uventet", correct: false },
        { id: "B", text: "Brått", correct: true },
        { id: "C", text: "Overraskende", correct: false }
      ],
      nuance: "\"Brått\" fokuserer på at noe skjer raskt uten forvarsel, \"uventet\" fokuserer på mangel på forventning, mens \"overraskende\" fokuserer på reaksjonen. (\"Brått\" focuses on something happening quickly without warning, \"uventet\" focuses on lack of expectation, while \"overraskende\" focuses on the reaction.)"
    },
    {
      id: 6,
      word: "Vanskelig",
      options: [
        { id: "A", text: "Komplisert", correct: false },
        { id: "B", text: "Krevende", correct: true },
        { id: "C", text: "Problematisk", correct: false }
      ],
      nuance: "\"Krevende\" indikerer noe som krever innsats, \"komplisert\" fokuserer på noe med mange deler eller aspekter, mens \"problematisk\" antyder at noe skaper problemer. (\"Krevende\" indicates something requiring effort, \"komplisert\" focuses on something with many parts or aspects, while \"problematisk\" suggests something causing problems.)"
    },
    {
      id: 7,
      word: "Interessant",
      options: [
        { id: "A", text: "Spennende", correct: false },
        { id: "B", text: "Fascinerende", correct: false },
        { id: "C", text: "Fengslende", correct: true }
      ],
      nuance: "\"Fengslende\" betyr noe som holder oppmerksomheten din, \"spennende\" antyder spenning eller forventning, mens \"fascinerende\" indikerer dyp interesse. (\"Fengslende\" means something that holds your attention, \"spennende\" suggests excitement or anticipation, while \"fascinerende\" indicates deep interest.)"
    },
    {
      id: 8,
      word: "Modig",
      options: [
        { id: "A", text: "Tapper", correct: true },
        { id: "B", text: "Dristig", correct: false },
        { id: "C", text: "Uredd", correct: false }
      ],
      nuance: "\"Tapper\" beskriver mot til tross for frykt, \"dristig\" innebærer å ta risiko, mens \"uredd\" betyr uten frykt. (\"Tapper\" describes courage despite fear, \"dristig\" implies taking risks, while \"uredd\" means without fear.)"
    },
    {
      id: 9,
      word: "Lei",
      options: [
        { id: "A", text: "Irritert", correct: false },
        { id: "B", text: "Misfornøyd", correct: false },
        { id: "C", text: "Oppgitt", correct: true }
      ],
      nuance: "\"Oppgitt\" beskriver en følelse av resignasjon, \"irritert\" fokuserer på irritasjon, mens \"misfornøyd\" indikerer generell utilfredshet. (\"Oppgitt\" describes a feeling of resignation, \"irritert\" focuses on annoyance, while \"misfornøyd\" indicates general dissatisfaction.)"
    },
    {
      id: 10,
      word: "Rolig",
      options: [
        { id: "A", text: "Fredelig", correct: false },
        { id: "B", text: "Avslappet", correct: true },
        { id: "C", text: "Stille", correct: false }
      ],
      nuance: "\"Avslappet\" refererer til en mental tilstand, \"fredelig\" fokuserer mer på omgivelsene, mens \"stille\" refererer hovedsakelig til fravær av lyd. (\"Avslappet\" refers to a mental state, \"fredelig\" focuses more on the surroundings, while \"stille\" primarily refers to absence of sound.)"
    },
    {
      id: 11,
      word: "Skremmende",
      options: [
        { id: "A", text: "Fryktelig", correct: false },
        { id: "B", text: "Urovekkende", correct: true },
        { id: "C", text: "Skummel", correct: false }
      ],
      nuance: "\"Urovekkende\" betyr noe som skaper uro eller bekymring, \"fryktelig\" er intenst skremmende, mens \"skummel\" ofte brukes om noe som virker mystisk og truende. (\"Urovekkende\" means something that creates unease or concern, \"fryktelig\" is intensely frightening, while \"skummel\" is often used for something that seems mysterious and threatening.)"
    },
    {
      id: 12,
      word: "Viktig",
      options: [
        { id: "A", text: "Vesentlig", correct: true },
        { id: "B", text: "Avgjørende", correct: false },
        { id: "C", text: "Betydningsfull", correct: false }
      ],
      nuance: "\"Vesentlig\" betyr noe som er grunnleggende eller essensielt, \"avgjørende\" impliserer noe som har kritisk betydning, mens \"betydningsfull\" indikerer noe som har stor innvirkning. (\"Vesentlig\" means something that is fundamental or essential, \"avgjørende\" implies something critical, while \"betydningsfull\" indicates something having significant impact.)"
    },
    {
      id: 13,
      word: "Rar",
      options: [
        { id: "A", text: "Merkelig", correct: true },
        { id: "B", text: "Underlig", correct: false },
        { id: "C", text: "Uvanlig", correct: false }
      ],
      nuance: "\"Merkelig\" beskriver noe som virker fremmed eller uforklarlig, \"underlig\" kan indikere noe mystisk, mens \"uvanlig\" bare betyr noe som ikke er vanlig. (\"Merkelig\" describes something that seems alien or inexplicable, \"underlig\" can indicate something mystical, while \"uvanlig\" just means something that isn't common.)"
    },
    {
      id: 14,
      word: "Sliten",
      options: [
        { id: "A", text: "Trøtt", correct: false },
        { id: "B", text: "Utmattet", correct: false },
        { id: "C", text: "Utslitt", correct: true }
      ],
      nuance: "\"Utslitt\" indikerer ekstrem tretthet, \"trøtt\" er en mildere form for tretthet, mens \"utmattet\" innebærer uttømming av energi. (\"Utslitt\" indicates extreme tiredness, \"trøtt\" is a milder form of tiredness, while \"utmattet\" implies depletion of energy.)"
    },
    {
      id: 15,
      word: "Snakke",
      options: [
        { id: "A", text: "Prate", correct: true },
        { id: "B", text: "Konversere", correct: false },
        { id: "C", text: "Diskutere", correct: false }
      ],
      nuance: "\"Prate\" er den mest uformelle og hverdagslige varianten, \"konversere\" er mer formelt og betyr å føre en samtale, mens \"diskutere\" innebærer å utveksle synspunkter om et emne. (\"Prate\" is the most informal and everyday variant, \"konversere\" is more formal and means to have a conversation, while \"diskutere\" involves exchanging views about a topic.)"
    },
    {
      id: 16,
      word: "Farlig",
      options: [
        { id: "A", text: "Risikabel", correct: true },
        { id: "B", text: "Modig", correct: false },
        { id: "C", text: "Skummel", correct: false }
      ],
      nuance: "\"Risikabel\" describes something involving danger or risk, \"modig\" means brave or courageous, and \"skummel\" often refers to something spooky or scary, not necessarily dangerous."
    },
    {
      id: 17,
      word: "Lage",
      options: [
        { id: "A", text: "Bygge", correct: false },
        { id: "B", text: "Skape", correct: true },
        { id: "C", text: "Finne", correct: false }
    ],
    nuance: "\"Skape\" means to create or bring something into existence, \"bygge\" refers specifically to physical construction, and \"finne\" means to discover something that already exists."
    },
    {
      id: 18, 
      word: "Hyggelig",
      options: [
        { id: "A", text: "Koselig", correct: false },
        { id: "B", text: "Venlig", correct: true },
        { id: "C", text: "Glad", correct: false }
        ],
        nuance: "\"Venlig\" means friendly or kind in attitude, \"koselig\" refers to a warm, cozy atmosphere, and \"glad\" means happy — more about emotion than behaviour."
    },
    {
      id: 19,
      word: "Se",
      options: [
        { id: "A", text: "Observere", correct: true },
        { id: "B", text: "Tenke", correct: false },
        { id: "C", text: "Kjenne", correct: false }
      ],
      nuance: "\"Observere\" means to watch or notice something carefully, \"tenke\" means to think (a mental process), and \"kjenne\" usually means to feel — either physically or emotionally."
    },
    {
     id: 20,
     word: "Hus",
     options: [
        { id: "A", text: "Bolig", correct: true },
        { id: "B", text: "Hytte", correct: false },
        { id: "C", text: "Rom", correct: false }
     ],
     nuance: "\"Bolig\" er et mer formelt og bredere begrep enn \"hus\", og refererer til alle typer boliger inkludert leiligheter. \"Hytte\" er en spesifikk type hus ofte brukt for ferie, og \"rom\" er bare en del av et hus. (\"Bolig\" is more formal and broader than \"hus\", referring to any type of residence including apartments. \"Hytte\" is a specific type of house often used for vacation, and \"rom\" is just a part of a house.)"
    },
    {
      id: 21,
      word: "Arbeid",
      options: [
        { id: "A", text: "Kontor", correct: false },
        { id: "B", text: "Jobb", correct: true },
        { id: "C", text: "Karriere", correct: false }
      ],
      nuance: "\"Jobb\" er litt mer uformelt enn \"arbeid\", som også kan referere til konseptet arbeid eller innsats mer generelt. \"Kontor\" er et sted hvor arbeid kan skje, og \"karriere\" refererer til en lengre profesjonell bane. (\"Jobb\" is slightly more casual than \"arbeid\", which can also refer to the concept of labor or effort more broadly. \"Kontor\" is a place where work might happen, and \"karriere\" is a longer professional path.)"
    },
    {
      id: 22,
      word: "Mat",
      options: [
        { id: "A", text: "Måltid", correct: false },
        { id: "B", text: "Kjøkken", correct: false },
        { id: "C", text: "Næring", correct: true }
      ],
      nuance: "\"Næring\" fokuserer på den funksjonelle aspekten av mat som noe som gir næring til kroppen, mens \"mat\" er det mer hverdagslige begrepet. \"Måltid\" er en instans av å spise mat, og \"kjøkken\" er hvor mat lages. (\"Næring\" focuses on the functional aspect of food as something that nourishes the body, while \"mat\" is the more everyday term. \"Måltid\" is an instance of eating food, and \"kjøkken\" is where food is prepared.)"
    },
    {
      id: 23,
      word: "Tid",
      options: [
        { id: "A", text: "Klokke", correct: false },
        { id: "B", text: "Stund", correct: true },
        { id: "C", text: "Alder", correct: false }
      ],
      nuance: "\"Stund\" refererer typisk til en kortere, udefinert periode, mens \"tid\" er mer generell og kan referere til enhver varighet eller til og med konseptet tid selv. \"Klokke\" måler tid men er ikke tid i seg selv, og \"alder\" er relatert til tid men spesifikt om livets år. (\"Stund\" typically refers to a shorter, undefined period, while \"tid\" is more general and can refer to any duration or even the concept of time itself. \"Klokke\" measures time but isn't time itself, and \"alder\" is related to time but specifically about years of life.)"
    },
    {
      id: 24,
      word: "Venn",
      options: [
        { id: "A", text: "Kamerat", correct: true },
        { id: "B", text: "Kollega", correct: false },
        { id: "C", text: "Nabo", correct: false }
      ],
      nuance: "\"Kamerat\" antyder ofte et mer uformelt vennskap enn \"venn\", og er noe mer vanlig blant menn. \"Kollega\" er en arbeidsrelasjon, og \"nabo\" er en nærhetsrelasjon. (\"Kamerat\" often implies a more casual friendship than \"venn\", and is somewhat more commonly used among men. \"Kollega\" is a work relationship, and \"nabo\" is a proximity relationship.)"
    },
    {
      id: 25,
      word: "Bil",
      options: [
        { id: "A", text: "Kjøretøy", correct: true },
        { id: "B", text: "Sykkel", correct: false },
        { id: "C", text: "Garasje", correct: false }
      ],
      nuance: "\"Kjøretøy\" er mer formelt og bredt, og inkluderer \"biler\", \"busser\", \"lastebiler\", osv. \"Sykkel\" er ikke det samme som \"bil\" men en form for transport, og \"garasje\" er et sted hvor du parkerer en \"bil\", ikke et synonym. (\"Kjøretøy\" is more formal or broad, and includes \"biler\", \"busser\", \"lastebiler\", etc. \"Sykkel\" is not the same as \"bil\" but a form of transport, and \"garasje\" is a place where you park a \"bil\", not a synonym.)"
    },
    {
      id: 26,
      word: "Bok",
      options: [
        { id: "A", text: "Magasin", correct: false },
        { id: "B", text: "Verk", correct: true },
        { id: "C", text: "Bibliotek", correct: false }
      ],
      nuance: "\"Verk\" refererer til et litterært eller kunstnerisk arbeid, som kan inkludere bøker. \"Magasin\" er en periodisk publikasjon, ikke en bok, og \"bibliotek\" er et sted hvor bøker oppbevares. (\"Verk\" refers to a literary or artistic work, which can include books. \"Magasin\" is a periodical publication, not a book, and \"bibliotek\" is a place where books are kept.)"
    },
    {
      id: 27,
      word: "Penger",
      options: [
        { id: "A", text: "Valuta", correct: true },
        { id: "B", text: "Bank", correct: false },
        { id: "C", text: "Lommebok", correct: false }
      ],
      nuance: "\"Valuta\" er et mer teknisk begrep for penger eller betalingsmidler. \"Bank\" er en institusjon som håndterer penger, og \"lommebok\" er hvor du oppbevarer penger. (\"Valuta\" is a more technical term for money or currency. \"Bank\" is an institution that handles money, and \"lommebok\" is where you keep money.)"
    },
    {
      id: 28,
      word: "Vann",
      options: [
        { id: "A", text: "Innsjø", correct: false },
        { id: "B", text: "Drikke", correct: false },
        { id: "C", text: "Væske", correct: true }
      ],
      nuance: "\"Væske\" er en bredere kategori som inkluderer vann og andre flytende stoffer. \"Innsjø\" er en vannmasse, ikke vann i seg selv, og \"drikke\" refererer til handlingen å drikke eller en spesifikk drikkevare. (\"Væske\" is a broader category that includes water and other liquid substances. \"Innsjø\" is a body of water, not water itself, and \"drikke\" refers to the action of drinking or a specific beverage.)"
    },
    {
      id: 29,
      word: "Klær",
      options: [
        { id: "A", text: "Mote", correct: false },
        { id: "B", text: "Garderobe", correct: true },
        { id: "C", text: "Butikk", correct: false }
      ],
      nuance: "\"Garderobe\" refererer til en samling av klær, ofte til en person. \"Mote\" er en trend eller stil innen klær, og \"butikk\" er et sted hvor klær selges. (\"Garderobe\" refers to a collection of clothes, often belonging to one person. \"Mote\" is a trend or style in clothing, and \"butikk\" is a place where clothes are sold.)"
    },
    {
      id: 30,
      word: "Vei",
      options: [
        { id: "A", text: "Gate", correct: true },
        { id: "B", text: "Kart", correct: false },
        { id: "C", text: "Reise", correct: false }
      ],
      nuance: "\"Gate\" er en type vei, typisk i urbane områder. \"Kart\" viser veier men er ikke en vei selv, og \"reise\" involverer å følge veier men er handlingen å reise. (\"Gate\" is a type of road, typically in urban areas. \"Kart\" shows roads but isn't a road itself, and \"reise\" involves following roads but is the action of traveling.)"
    },
    {
      id: 31,
      word: "Trøtt",
      options: [
        { id: "A", text: "Søvnig", correct: true },
        { id: "B", text: "Syk", correct: false },
        { id: "C", text: "Lat", correct: false }
      ],
      nuance: "\"Søvnig\" er en tilstand av å føle behov for søvn, veldig lik \"trøtt\". \"Syk\" refererer til dårlig helse, og \"lat\" indikerer manglende motivasjon til å gjøre noe, ikke nødvendigvis relatert til tretthet. (\"Søvnig\" is a state of feeling the need for sleep, very similar to \"trøtt\". \"Syk\" refers to poor health, and \"lat\" indicates a lack of motivation to do something, not necessarily related to tiredness.)"
    },
    {
      id: 32,
      word: "Begynnelse",
      options: [
        { id: "A", text: "Introduksjon", correct: true },
        { id: "B", text: "Slutt", correct: false },
        { id: "C", text: "Midtpunkt", correct: false }
      ],
      nuance: "\"Introduksjon\" refererer til starten av noe, ofte i en formell eller strukturert kontekst. \"Slutt\" er det motsatte av \"begynnelse\", og \"midtpunkt\" er midt i noe, ikke starten. (\"Introduksjon\" refers to the start of something, often in a formal or structured context. \"Slutt\" is the opposite of \"begynnelse\", and \"midtpunkt\" is the middle of something, not the beginning.)"
    },
    {
      id: 33,
      word: "Høy",
      options: [
        { id: "A", text: "Lang", correct: false },
        { id: "B", text: "Lav", correct: false },
        { id: "C", text: "Opphøyd", correct: true }
      ],
      nuance: "\"Opphøyd\" beskriver noe som er hevet over bakken eller over standard nivå, liknende \"høy\". \"Lang\" refererer til lengde, ikke høyde, og \"lav\" er det motsatte av \"høy\". (\"Opphøyd\" describes something that is elevated above the ground or above standard level, similar to \"høy\". \"Lang\" refers to length, not height, and \"lav\" is the opposite of \"høy\".)"
    },
    {
      id: 34,
      word: "Morsom",
      options: [
        { id: "A", text: "Komisk", correct: true },
        { id: "B", text: "Seriøs", correct: false },
        { id: "C", text: "Aktiv", correct: false }
      ],
      nuance: "\"Komisk\" refererer til noe som fremkaller latter eller er humoristisk, som \"morsom\". \"Seriøs\" er det motsatte av \"morsom\", og \"aktiv\" beskriver høyt energi- eller aktivitetsnivå. (\"Komisk\" refers to something that provokes laughter or is humorous, like \"morsom\". \"Seriøs\" is the opposite of \"morsom\", and \"aktiv\" describes high energy or activity level.)"
    },
    {
      id: 35,
      word: "Løpe",
      options: [
        { id: "A", text: "Springe", correct: true },
        { id: "B", text: "Gå", correct: false },
        { id: "C", text: "Hoppe", correct: false }
      ],
      nuance: "\"Springe\" er et direkte synonym til \"løpe\", begge beskriver den raske bevegelsen med bena. \"Gå\" er å bevege seg saktere enn å løpe, og \"hoppe\" er en vertikal bevegelse oppover, ikke fremover. (\"Springe\" is a direct synonym to \"løpe\", both describing the rapid movement with legs. \"Gå\" is moving slower than running, and \"hoppe\" is a vertical movement upwards, not forward.)"
    },
    {
      id: 36,
      word: "Pent",
      options: [
        { id: "A", text: "Fint", correct: true },
        { id: "B", text: "Stygt", correct: false },
        { id: "C", text: "Stort", correct: false }
      ],
      nuance: "\"Fint\" og \"pent\" brukes ofte om hverandre for å beskrive noe som er estetisk tiltalende. \"Stygt\" er det motsatte av \"pent\", og \"stort\" refererer til størrelse, ikke utseende. (\"Fint\" and \"pent\" are often used interchangeably to describe something that is aesthetically pleasing. \"Stygt\" is the opposite of \"pent\", and \"stort\" refers to size, not appearance.)"
    },
    {
      id: 37,
      word: "Kjøpe",
      options: [
        { id: "A", text: "Selge", correct: false },
        { id: "B", text: "Anskaffe", correct: true },
        { id: "C", text: "Spare", correct: false }
      ],
      nuance: "\"Anskaffe\" betyr å få tak i noe, enten gjennom kjøp eller andre metoder. \"Selge\" er det motsatte av \"kjøpe\", og \"spare\" er å holde av penger i stedet for å bruke dem på kjøp. (\"Anskaffe\" means to acquire something, either through purchase or other methods. \"Selge\" is the opposite of \"kjøpe\", and \"spare\" is to set aside money instead of spending it on purchases.)"
    },
    {
      id: 38,
      word: "Ung",
      options: [
        { id: "A", text: "Gammel", correct: false },
        { id: "B", text: "Voksen", correct: false },
        { id: "C", text: "Ungdommelig", correct: true }
      ],
      nuance: "\"Ungdommelig\" beskriver noe som har kvalitetene til ungdom eller som virker ungt, meget lik \"ung\". \"Gammel\" er det motsatte av \"ung\", og \"voksen\" refererer til en moden alder, ikke ungdom. (\"Ungdommelig\" describes something having the qualities of youth or appearing young, very similar to \"ung\". \"Gammel\" is the opposite of \"ung\", and \"voksen\" refers to a mature age, not youth.)"
    },
    {
      id: 39,
      word: "Rett",
      options: [
        { id: "A", text: "Direkte", correct: true },
        { id: "B", text: "Kroket", correct: false },
        { id: "C", text: "Kort", correct: false }
      ],
      nuance: "\"Direkte\" kan beskrive en rett linje eller en direkte rute, liknende \"rett\". \"Kroket\" er det motsatte av \"rett\", og \"kort\" refererer til lengde, ikke form. (\"Direkte\" can describe a straight line or a direct route, similar to \"rett\". \"Kroket\" is the opposite of \"rett\", and \"kort\" refers to length, not shape.)"
    },
    {
      id: 40,
      word: "Mørk",
      options: [
        { id: "A", text: "Lys", correct: false },
        { id: "B", text: "Dyster", correct: true },
        { id: "C", text: "Fargerik", correct: false }
      ],
      nuance: "\"Dyster\" beskriver noe som er mørkt eller mangler lysstyrke, men har også en emosjonell konnotasjon av tristhet eller uhygge. \"Lys\" er det motsatte av \"mørk\", og \"fargerik\" refererer til mange farger, ikke lysnivå. (\"Dyster\" describes something that is dark or lacks brightness but also has an emotional connotation of sadness or gloominess.)"
    },
    {
      id: 41,
      word: "Lønne",
      options: [
        { id: "A", text: "Funksjonell", correct: false },
        { id: "B", text: "Lønne", correct: true },
        { id: "C", text: "Funksjonell", correct: false }
      ],
      nuance: "\"Lønne\" beskriver noe som er avhengig av en annen sak for å fungere, meget lik \"lovable\". \"Funksjonell\" beskriver noe som er nødvendig for å fungere, ikke avhengig av noe annet. (\"Lønne\" describes something that depends on another thing to function, very similar to \"lovable\". \"Funksjonell\" describes something that is necessary to function, not dependent on anything else.)"
    },
    {
      id: 41,
      word: "Sulten",
      options: [
        { id: "A", text: "Tørst", correct: false },
        { id: "B", text: "Mett", correct: false },
        { id: "C", text: "Utsultet", correct: true }
      ],
      nuance: "\"Utsultet\" er en mer intens versjon av \"sulten\", som indikerer ekstrem hunger. \"Tørst\" refererer til behov for væske, ikke mat, og \"mett\" er det motsatte av \"sulten\". (\"Utsultet\" is a more intense version of \"sulten\", indicating extreme hunger. \"Tørst\" refers to need for liquids, not food, and \"mett\" is the opposite of \"sulten\".)"
    },
    {
      id: 42,
      word: "Fattig",
      options: [
        { id: "A", text: "Rik", correct: false },
        { id: "B", text: "Ubemidlet", correct: true },
        { id: "C", text: "Heldig", correct: false }
      ],
      nuance: "\"Ubemidlet\" er en mer formell måte å si at noe mangler økonomiske ressurser, lignende \"fattig\". \"Rik\" er det motsatte av \"fattig\", og \"heldig\" refererer til flaks eller godhet, ikke økonomisk status. (\"Ubemidlet\" is a more formal way of saying someone lacks financial resources, similar to \"fattig\". \"Rik\" is the opposite of \"fattig\", and \"heldig\" refers to luck or fortune, not economic status.)"
    },
    {
      id: 43,
      word: "Kaste",
      options: [
        { id: "A", text: "Fange", correct: false },
        { id: "B", text: "Slippe", correct: true },
        { id: "C", text: "Holde", correct: false }
      ],
      nuance: "\"Slippe\" kan i noen kontekster bety å frigjøre noe fra hånden, som ligner på å kaste. \"Fange\" er det motsatte av å kaste, og \"holde\" betyr å beholde noe i hånden, ikke å sende det bort. (\"Slippe\" can in some contexts mean to release something from the hand, which is similar to throwing. \"Fange\" is the opposite of throwing, and \"holde\" means to keep something in your hand, not to send it away.)"
    },
    {
      id: 44,
      word: "Forvirret",
      options: [
        { id: "A", text: "Klar", correct: false },
        { id: "B", text: "Forundret", correct: false },
        { id: "C", text: "Desorientert", correct: true }
      ],
      nuance: "\"Desorientert\" beskriver en tilstand av forvirring eller mangel på retningssans, veldig likt \"forvirret\". \"Klar\" er det motsatte av \"forvirret\", og \"forundret\" betyr overrasket eller forbløffet. (\"Desorientert\" describes a state of confusion or lack of orientation, very similar to \"forvirret\". \"Klar\" is the opposite of \"forvirret\", and \"forundret\" means surprised or amazed.)"
    },
    {
      id: 45,
      word: "Trist",
      options: [
        { id: "A", text: "Munter", correct: false },
        { id: "B", text: "Bedrøvet", correct: true },
        { id: "C", text: "Spent", correct: false }
      ],
      nuance: "\"Bedrøvet\" beskriver en følelse av sorg eller tristhet, meget lik \"trist\". \"Munter\" er det motsatte av \"trist\", og \"spent\" refererer til en følelse av spenning eller forventning. (\"Bedrøvet\" describes a feeling of sadness or sorrow, very similar to \"trist\". \"Munter\" is the opposite of \"trist\", and \"spent\" refers to a feeling of excitement or anticipation.)"
    },
    {
      id: 46,
      word: "Kaffe",
      options: [
        { id: "A", text: "Te", correct: false },
        { id: "B", text: "Brygg", correct: true },
        { id: "C", text: "Kopp", correct: false }
      ],
      nuance: "\"Brygg\" kan referere til kaffe som er brygget eller til drikke laget ved å brygge, en litt mer generell term men ofte brukt om kaffe. \"Te\" er en annen varm drikk, ikke kaffe, og \"kopp\" er beholderen kaffe serveres i. (\"Brygg\" can refer to brewed coffee or to a beverage made by brewing, a slightly more general term but often used for coffee. \"Te\" is another hot beverage, not coffee, and \"kopp\" is the container coffee is served in.)"
    },
    {
      id: 47,
      word: "Vindu",
      options: [
        { id: "A", text: "Dør", correct: false },
        { id: "B", text: "Glassrute", correct: true },
        { id: "C", text: "Vegg", correct: false }
      ],
      nuance: "\"Glassrute\" refererer til glasset i et vindu, og brukes ofte som synonym for hele vinduet. \"Dør\" er en annen type åpning i en vegg, og \"vegg\" er strukturen hvor vinduer plasseres. (\"Glassrute\" refers to the glass in a window, and is often used as a synonym for the entire window. \"Dør\" is another type of opening in a wall, and \"vegg\" is the structure where windows are placed.)"
    },
    {
      id: 48,
      word: "Spise",
      options: [
        { id: "A", text: "Drikke", correct: false },
        { id: "B", text: "Svelge", correct: false },
        { id: "C", text: "Fortære", correct: true }
      ],
      nuance: "\"Fortære\" er et mer formelt ord for å spise eller konsumere. \"Drikke\" er å ta væske, ikke fast føde, og \"svelge\" er en spesifikk handling som er en del av å spise, ikke hele prosessen. (\"Fortære\" is a more formal word for eating or consuming. \"Drikke\" is to take in liquid, not solid food, and \"svelge\" is a specific action that is part of eating, not the whole process.)"
    },
    {
      id: 49,
      word: "Skog",
      options: [
        { id: "A", text: "Trær", correct: false },
        { id: "B", text: "Kratt", correct: true },
        { id: "C", text: "Park", correct: false }
      ],
      nuance: "\"Kratt\" refererer til en mindre samling av busker og små trær, en mindre versjon av skog. \"Trær\" er bestanddelene av en skog, ikke skogen selv, og \"park\" er et planlagt grøntområde, ofte i byer. (\"Kratt\" refers to a smaller collection of bushes and small trees, a smaller version of a forest. \"Trær\" are the components of a forest, not the forest itself, and \"park\" is a planned green area, often in cities.)"
    },
    {
      id: 50,
      word: "Sterk",
      options: [
        { id: "A", text: "Kraftig", correct: true },
        { id: "B", text: "Svak", correct: false },
        { id: "C", text: "Høy", correct: false }
      ],
      nuance: "\"Kraftig\" beskriver noe som har mye styrke eller kraft, meget likt \"sterk\". \"Svak\" er det motsatte av \"sterk\", og \"høy\" refererer til fysisk høyde eller volum, ikke styrke. (\"Kraftig\" describes something that has a lot of strength or power, very similar to \"sterk\". \"Svak\" is the opposite of \"sterk\", and \"høy\" refers to physical height or volume, not strength.)"
    },
    {
      id: 51,
      word: "Hjelpe",
      options: [
        { id: "A", text: "Bistå", correct: true },
        { id: "B", text: "Hindre", correct: false },
        { id: "C", text: "Spørre", correct: false }
      ],
      nuance: "\"Bistå\" betyr å gi støtte eller assistanse, på samme måte som \"hjelpe\". \"Hindre\" er det motsatte, å stå i veien for noen, og \"spørre\" er å be om informasjon, ikke å gi støtte. (\"Bistå\" means to provide support or assistance, just like \"hjelpe\". \"Hindre\" is the opposite, to stand in someone's way, and \"spørre\" is to ask for information, not to provide support.)"
    },
    {
      id: 52,
      word: "Sann",
      options: [
        { id: "A", text: "Falsk", correct: false },
        { id: "B", text: "Ekte", correct: true },
        { id: "C", text: "Viktig", correct: false }
      ],
      nuance: "\"Ekte\" beskriver noe som er genuint eller autentisk, som overlapper med betydningen av \"sann\". \"Falsk\" er det motsatte av \"sann\", og \"viktig\" refererer til verdi eller betydning, ikke autentisitet. (\"Ekte\" describes something that is genuine or authentic, which overlaps with the meaning of \"sann\". \"Falsk\" is the opposite of \"sann\", and \"viktig\" refers to value or significance, not authenticity.)"
    },
    {
      id: 53,
      word: "Glemme",
      options: [
        { id: "A", text: "Huske", correct: false },
        { id: "B", text: "Overse", correct: true },
        { id: "C", text: "Lære", correct: false }
      ],
      nuance: "\"Overse\" kan bety å ikke legge merke til eller ignorere noe, som ligner på å glemme i noen kontekster. \"Huske\" er det motsatte av \"glemme\", og \"lære\" er å tilegne seg ny kunnskap. (\"Overse\" can mean to not notice or to ignore something, which is similar to forgetting in some contexts. \"Huske\" is the opposite of \"glemme\", and \"lære\" is to acquire new knowledge.)"
    },
    {
      id: 54,
      word: "Dag",
      options: [
        { id: "A", text: "Natt", correct: false },
        { id: "B", text: "Døgn", correct: true },
        { id: "C", text: "Morgen", correct: false }
      ],
      nuance: "\"Døgn\" inkluderer både dag og natt, en 24-timers periode, men kan i noen sammenhenger brukes for å referere til dagen. \"Natt\" er det motsatte av \"dag\", og \"morgen\" er bare en del av dagen. (\"Døgn\" includes both day and night, a 24-hour period, but can in some contexts be used to refer to the day. \"Natt\" is the opposite of \"dag\", and \"morgen\" is just a part of the day.)"
    },
    {
      id: 55,
      word: "Syk",
      options: [
        { id: "A", text: "Frisk", correct: false },
        { id: "B", text: "Usunn", correct: false },
        { id: "C", text: "Indisponert", correct: true }
      ],
      nuance: "\"Indisponert\" er en høflig eller formell måte å si at noen er syk eller utilgjengelig på grunn av sykdom. \"Frisk\" er det motsatte av \"syk\", og \"usunn\" refererer til dårlige helsevaner, ikke en sykdomstilstand. (\"Indisponert\" is a polite or formal way of saying someone is sick or unavailable due to illness. \"Frisk\" is the opposite of \"syk\", and \"usunn\" refers to poor health habits, not a state of illness.)"
    },
    {
      id: 56,
      word: "Luft",
      options: [
        { id: "A", text: "Vind", correct: false },
        { id: "B", text: "Atmosfære", correct: true },
        { id: "C", text: "Oksygen", correct: false }
      ],
      nuance: "\"Atmosfære\" refererer til luftlaget som omgir jorden, en bredere term som inkluderer \"luft\". \"Vind\" er luft i bevegelse, ikke luft generelt, og \"oksygen\" er en spesifikk gass som er en del av luft. (\"Atmosfære\" refers to the layer of air surrounding the earth, a broader term that includes \"luft\". \"Vind\" is air in motion, not air in general, and \"oksygen\" is a specific gas that is part of air.)"
    },
    {
      id: 57,
      word: "Grov",
      options: [
        { id: "A", text: "Fin", correct: false },
        { id: "B", text: "Ru", correct: true },
        { id: "C", text: "Jevn", correct: false }
      ],
      nuance: "\"Ru\" beskriver en overflate som ikke er glatt, veldig lik \"grov\" når det gjelder tekstur. \"Fin\" er det motsatte av \"grov\", beskriver noe som er delikat eller forfinet, og \"jevn\" beskriver noe som er konsistent eller uten variasjoner. (\"Ru\" describes a surface that is not smooth, very similar to \"grov\" when it comes to texture. \"Fin\" is the opposite of \"grov\", describing something delicate or refined, and \"jevn\" describes something that is consistent or without variations.)"
    },
    {
      id: 58,
      word: "Verden",
      options: [
        { id: "A", text: "Land", correct: false },
        { id: "B", text: "Univers", correct: false },
        { id: "C", text: "Klode", correct: true }
      ],
      nuance: "\"Klode\" refererer spesifikt til jorden som planet, som ofte brukes synonymt med \"verden\". \"Land\" er en del av verden, og \"univers\" er mye større, inkluderer alle planeter og stjerner. (\"Klode\" refers specifically to the earth as a planet, which is often used synonymously with \"verden\". \"Land\" is a part of the world, and \"univers\" is much larger, including all planets and stars.)"
    },
    {
      id: 59,
      word: "Lære",
      options: [
        { id: "A", text: "Undervise", correct: false },
        { id: "B", text: "Tilegne", correct: true },
        { id: "C", text: "Glemme", correct: false }
      ],
      nuance: "\"Tilegne\" betyr å erverve kunnskap eller ferdigheter, som er grunnleggende det samme som \"lære\". \"Undervise\" er å formidle kunnskap til andre, ikke å motta den, og \"glemme\" er det motsatte av å lære. (\"Tilegne\" means to acquire knowledge or skills, which is essentially the same as \"lære\". \"Undervise\" is to impart knowledge to others, not to receive it, and \"glemme\" is the opposite of learning.)"
    },
    {
      id: 60,
      word: "Dyp",
      options: [
        { id: "A", text: "Grunn", correct: false },
        { id: "B", text: "Bunnløs", correct: true },
        { id: "C", text: "Høy", correct: false }
      ],
      nuance: "\"Bunnløs\" beskriver noe som er ekstremt dypt eller uten bunn, en intensivering av \"dyp\". \"Grunn\" er det motsatte av \"dyp\", og \"høy\" refererer til høyde, ikke dybde. (\"Bunnløs\" describes something that is extremely deep or without a bottom, an intensification of \"dyp\". \"Grunn\" is the opposite of \"dyp\", and \"høy\" refers to height, not depth.)"
    },
    {
      id: 61,
      word: "Årsak",
      options: [
        { id: "A", text: "Grunn", correct: true },
        { id: "B", text: "Resultat", correct: false },
        { id: "C", text: "Problem", correct: false }
      ],
      nuance: "\"Grunn\" refererer til begrunnelsen eller motivet for noe, veldig likt \"årsak\". \"Resultat\" er konsekvensen av en årsak, ikke årsaken selv, og \"problem\" kan være en konsekvens av en årsak, men er ikke selve årsaken. (\"Grunn\" refers to the reason or motive for something, very similar to \"årsak\". \"Resultat\" is the consequence of a cause, not the cause itself, and \"problem\" may be a consequence of a cause, but is not the cause itself.)"
    },
    {
      id: 62,
      word: "Undersøke",
      options: [
        { id: "A", text: "Studere", correct: false },
        { id: "B", text: "Granske", correct: true },
        { id: "C", text: "Ignorere", correct: false }
      ],
      nuance: "\"Granske\" betyr å undersøke noe grundig eller nøye, veldig likt \"undersøke\". \"Studere\" fokuserer mer på læring, og \"ignorere\" er det motsatte av å undersøke. (\"Granske\" means to examine something thoroughly or carefully, very similar to \"undersøke\". \"Studere\" focuses more on learning, and \"ignorere\" is the opposite of examining.)"
    },
    {
      id: 63,
      word: "Utvikling",
      options: [
        { id: "A", text: "Forandring", correct: false },
        { id: "B", text: "Stillstand", correct: false },
        { id: "C", text: "Fremgang", correct: true }
      ],
      nuance: "\"Fremgang\" refererer til bevegelse fremover eller forbedring, som en positiv utvikling. \"Forandring\" er mer nøytralt og kan være positiv eller negativ, og \"stillstand\" er mangel på utvikling. (\"Fremgang\" refers to forward movement or improvement, like a positive development. \"Forandring\" is more neutral and can be positive or negative, and \"stillstand\" is lack of development.)"
    },
    {
      id: 64,
      word: "Bekymre",
      options: [
        { id: "A", text: "Engste", correct: true },
        { id: "B", text: "Berolige", correct: false },
        { id: "C", text: "Adsprede", correct: false }
      ],
      nuance: "\"Engste\" betyr å gjøre nervøs eller urolig, veldig likt \"bekymre\". \"Berolige\" er det motsatte, å roe ned bekymringer, og \"adsprede\" betyr å distrahere, som kan være en måte å håndtere bekymringer på, men ikke det samme. (\"Engste\" means to make nervous or anxious, very similar to \"bekymre\". \"Berolige\" is the opposite, to calm down worries, and \"adsprede\" means to distract, which can be a way of dealing with worries, but not the same.)"
    },
    {
      id: 65,
      word: "Samtale",
      options: [
        { id: "A", text: "Diskusjon", correct: false },
        { id: "B", text: "Dialog", correct: true },
        { id: "C", text: "Monolog", correct: false }
      ],
      nuance: "\"Dialog\" er en utveksling av ideer eller meninger mellom to eller flere personer, veldig likt \"samtale\". \"Diskusjon\" kan være mer formelt eller fokusert på å løse et problem, og \"monolog\" er når én person snakker alene. (\"Dialog\" is an exchange of ideas or opinions between two or more people, very similar to \"samtale\". \"Diskusjon\" can be more formal or focused on solving a problem, and \"monolog\" is when one person speaks alone.)"
    },
    {
      id: 66,
      word: "Overraske",
      options: [
        { id: "A", text: "Sjokkere", correct: false },
        { id: "B", text: "Forbause", correct: true },
        { id: "C", text: "Forberede", correct: false }
      ],
      nuance: "\"Forbause\" betyr å overraske eller forbløffe noen, veldig likt \"overraske\". \"Sjokkere\" er en sterkere reaksjon, ofte negativ, og \"forberede\" er det motsatte av å overraske. (\"Forbause\" means to surprise or amaze someone, very similar to \"overraske\". \"Sjokkere\" is a stronger reaction, often negative, and \"forberede\" is the opposite of surprising.)"
    },
    {
      id: 67,
      word: "Respekt",
      options: [
        { id: "A", text: "Forakt", correct: false },
        { id: "B", text: "Aktelse", correct: true },
        { id: "C", text: "Kjærlighet", correct: false }
      ],
      nuance: "\"Aktelse\" er høy grad av respekt eller ærbødighet for noen, veldig likt \"respekt\". \"Forakt\" er det motsatte av respekt, og \"kjærlighet\" er en dypere følelsesmessig tilknytning, ikke nødvendigvis basert på respekt. (\"Aktelse\" is a high degree of respect or reverence for someone, very similar to \"respekt\". \"Forakt\" is the opposite of respect, and \"kjærlighet\" is a deeper emotional attachment, not necessarily based on respect.)"
    },
    {
      id: 68,
      word: "Feil",
      options: [
        { id: "A", text: "Korrekt", correct: false },
        { id: "B", text: "Mangel", correct: false },
        { id: "C", text: "Mistak", correct: true }
      ],
      nuance: "\"Mistak\" er en feilhandling eller feilvurdering, veldig likt \"feil\". \"Korrekt\" er det motsatte av \"feil\", og \"mangel\" er fravær av noe nødvendig, som kan føre til feil men er ikke selve feilen. (\"Mistak\" is an error in action or judgment, very similar to \"feil\". \"Korrekt\" is the opposite of \"feil\", and \"mangel\" is absence of something necessary, which can lead to mistakes but is not the mistake itself.)"
    },
    {
      id: 69,
      word: "Forsiktig",
      options: [
        { id: "A", text: "Hensynsfull", correct: true },
        { id: "B", text: "Uforsiktig", correct: false },
        { id: "C", text: "Rask", correct: false }
      ],
      nuance: "\"Hensynsfull\" beskriver noen som viser omtanke og er varsom, lignende \"forsiktig\". \"Uforsiktig\" er det motsatte av \"forsiktig\", og \"rask\" refererer til hastighet, ofte assosiert med mindre forsiktighet. (\"Hensynsfull\" describes someone who shows consideration and is careful, similar to \"forsiktig\". \"Uforsiktig\" is the opposite of \"forsiktig\", and \"rask\" refers to speed, often associated with less caution.)"
    },
    {
      id: 70,
      word: "Mulighet",
      options: [
        { id: "A", text: "Sjanse", correct: true },
        { id: "B", text: "Hindring", correct: false },
        { id: "C", text: "Plikt", correct: false }
      ],
      nuance: "\"Sjanse\" er en anledning til å oppnå noe, veldig likt \"mulighet\". \"Hindring\" er noe som blokkerer en mulighet, og \"plikt\" er noe man må gjøre, uavhengig av om man ønsker det. (\"Sjanse\" is an opportunity to achieve something, very similar to \"mulighet\". \"Hindring\" is something that blocks an opportunity, and \"plikt\" is something one must do, regardless of whether one wants to.)"
    },
    {
      id: 71,
      word: "Enkel",
      options: [
        { id: "A", text: "Komplisert", correct: false },
        { id: "B", text: "Sammensatt", correct: false },
        { id: "C", text: "Grei", correct: true }
      ],
      nuance: "\"Grei\" beskriver noe som er ukomplisert og lett å forstå eller gjøre, lignende \"enkel\". \"Komplisert\" og \"sammensatt\" er begge det motsatte av \"enkel\". (\"Grei\" describes something that is uncomplicated and easy to understand or do, similar to \"enkel\". \"Komplisert\" and \"sammensatt\" are both the opposite of \"enkel\".)"
    },
    {
      id: 72,
      word: "Behov",
      options: [
        { id: "A", text: "Luksus", correct: false },
        { id: "B", text: "Trang", correct: true },
        { id: "C", text: "Ønske", correct: false }
      ],
      nuance: "\"Trang\" refererer til en sterk følelse av å trenge noe, lignende \"behov\". \"Luksus\" er noe man kan nyte men ikke trenger, og \"ønske\" er noe man vil ha men ikke nødvendigvis trenger. (\"Trang\" refers to a strong feeling of needing something, similar to \"behov\". \"Luksus\" is something you can enjoy but don't need, and \"ønske\" is something you want but don't necessarily need.)"
    },
    {
      id: 73,
      word: "Sjelden",
      options: [
        { id: "A", text: "Hyppig", correct: false },
        { id: "B", text: "Unik", correct: false },
        { id: "C", text: "Uvanlig", correct: true }
      ],
      nuance: "\"Uvanlig\" beskriver noe som ikke skjer ofte eller er utenom det vanlige, veldig likt \"sjelden\". \"Hyppig\" er det motsatte av \"sjelden\", og \"unik\" er noe som er helt enestående, enda mer ekstremt enn \"sjelden\". (\"Uvanlig\" describes something that doesn't happen often or is out of the ordinary, very similar to \"sjelden\". \"Hyppig\" is the opposite of \"sjelden\", and \"unik\" is something that is completely one-of-a-kind, even more extreme than \"sjelden\".)"
    },
    {
      id: 74,
      word: "Fantasi",
      options: [
        { id: "A", text: "Virkelighet", correct: false },
        { id: "B", text: "Drøm", correct: false },
        { id: "C", text: "Forestilling", correct: true }
      ],
      nuance: "\"Forestilling\" refererer til et mentalt bilde eller idé skapt i sinnet, veldig likt \"fantasi\". \"Virkelighet\" er det motsatte av \"fantasi\", og \"drøm\" er lignende, men skjer spesifikt under søvn. (\"Forestilling\" refers to a mental image or idea created in the mind, very similar to \"fantasi\". \"Virkelighet\" is the opposite of \"fantasi\", and \"drøm\" is similar, but happens specifically during sleep.)"
    },
    {
      id: 75,
      word: "Tillate",
      options: [
        { id: "A", text: "Godkjenne", correct: true },
        { id: "B", text: "Forby", correct: false },
        { id: "C", text: "Anbefale", correct: false }
      ],
      nuance: "\"Godkjenne\" betyr å gi tillatelse eller aksept for noe, veldig likt \"tillate\". \"Forby\" er det motsatte av \"tillate\", og \"anbefale\" er å foreslå noe, men ikke nødvendigvis gi tillatelse. (\"Godkjenne\" means to give permission or acceptance for something, very similar to \"tillate\". \"Forby\" is the opposite of \"tillate\", and \"anbefale\" is to suggest something, but not necessarily give permission.)"
    },
    {
      id: 76,
      word: "Målsetting",
      options: [
        { id: "A", text: "Plan", correct: false },
        { id: "B", text: "Formål", correct: true },
        { id: "C", text: "Metode", correct: false }
      ],
      nuance: "\"Formål\" refererer til hensikten eller målet med noe, veldig likt \"målsetting\". \"Plan\" er en mer detaljert strategi for å oppnå et mål, og \"metode\" er måten man gjør noe på, ikke selve målet. (\"Formål\" refers to the purpose or goal of something, very similar to \"målsetting\". \"Plan\" is a more detailed strategy to achieve a goal, and \"metode\" is the way something is done, not the goal itself.)"
    },
    {
      id: 77,
      word: "Voksen",
      options: [
        { id: "A", text: "Moden", correct: true },
        { id: "B", text: "Barn", correct: false },
        { id: "C", text: "Eldre", correct: false }
      ],
      nuance: "\"Moden\" beskriver noen som har nådd full utvikling eller viser voksent ansvar, lignende \"voksen\". \"Barn\" er det motsatte av \"voksen\", og \"eldre\" refererer til høy alder, utover bare det å være voksen. (\"Moden\" describes someone who has reached full development or shows adult responsibility, similar to \"voksen\". \"Barn\" is the opposite of \"voksen\", and \"eldre\" refers to advanced age, beyond just being an adult.)"
    },
    {
      id: 78,
      word: "Beslutning",
      options: [
        { id: "A", text: "Valg", correct: false },
        { id: "B", text: "Avgjørelse", correct: true },
        { id: "C", text: "Tvil", correct: false }
      ],
      nuance: "\"Avgjørelse\" er en endelig bestemmelse eller konklusjon, veldig likt \"beslutning\". \"Valg\" refererer mer til prosessen eller alternativene man velger mellom, og \"tvil\" er usikkerhet, det motsatte av en klar beslutning. (\"Avgjørelse\" is a final determination or conclusion, very similar to \"beslutning\". \"Valg\" refers more to the process or alternatives one chooses between, and \"tvil\" is uncertainty, the opposite of a clear decision.)"
    },
    {
      id: 79,
      word: "Opplevelse",
      options: [
        { id: "A", text: "Erfaring", correct: true },
        { id: "B", text: "Begivenhet", correct: false },
        { id: "C", text: "Minne", correct: false }
      ],
      nuance: "\"Erfaring\" refererer til kunnskap eller ferdigheter oppnådd gjennom direkte deltakelse, lignende \"opplevelse\". \"Begivenhet\" er hendelsen selv, ikke den subjektive erfaringen av den, og \"minne\" er erindringen om en tidligere opplevelse. (\"Erfaring\" refers to knowledge or skills gained through direct participation, similar to \"opplevelse\". \"Begivenhet\" is the event itself, not the subjective experience of it, and \"minne\" is the memory of a past experience.)"
    },
    {
      id: 80,
      word: "Betydning",
      options: [
        { id: "A", text: "Konsekvens", correct: false },
        { id: "B", text: "Mening", correct: true },
        { id: "C", text: "Detalj", correct: false }
      ],
      nuance: "\"Mening\" refererer til det en ord, symbol eller handling formidler, veldig likt \"betydning\". \"Konsekvens\" er resultatet eller virkningen av noe, og \"detalj\" er en liten, spesifikk del av noe større. (\"Mening\" refers to what a word, symbol, or action conveys, very similar to \"betydning\". \"Konsekvens\" is the result or effect of something, and \"detalj\" is a small, specific part of something larger.)"
    },
    {
      id: 81,
      word: "Rengjøre",
      options: [
        { id: "A", text: "Vaske", correct: true },
        { id: "B", text: "Tørke", correct: false },
        { id: "C", text: "Organisere", correct: false }
      ],
      nuance: "\"Vaske\" fokuserer spesielt på å gjøre noe rent med vann eller annen væske, mens \"rengjøre\" er mer generelt. \"Tørke\" er å fjerne fuktighet, og \"organisere\" handler om å sette ting i orden. (\"Vaske\" specifically focuses on cleaning something with water or other liquid, while \"rengjøre\" is more general. \"Tørke\" is to remove moisture, and \"organisere\" is about putting things in order.)"
    },
    {
      id: 82,
      word: "Skrubbe",
      options: [
        { id: "A", text: "Polere", correct: false },
        { id: "B", text: "Gni", correct: true },
        { id: "C", text: "Støvsuge", correct: false }
      ],
      nuance: "\"Gni\" innebærer å bevege noe frem og tilbake mot en overflate med trykk, lignende \"skrubbe\". \"Polere\" er å gjøre noe glatt og skinnende, og \"støvsuge\" er spesifikt for å fjerne støv med en støvsuger. (\"Gni\" involves moving something back and forth against a surface with pressure, similar to \"skrubbe\". \"Polere\" is to make something smooth and shiny, and \"støvsuge\" is specifically for removing dust with a vacuum cleaner.)"
    },
    {
      id: 83,
      word: "Klappe",
      options: [
        { id: "A", text: "Stryke", correct: true },
        { id: "B", text: "Slå", correct: false },
        { id: "C", text: "Klemme", correct: false }
      ],
      nuance: "\"Stryke\" betyr å føre hånden jevnt over noe, ofte i en kjærlig eller beroligende gest, lignende \"klappe\". \"Slå\" involverer mer kraft og er ofte negativt, og \"klemme\" er å omfavne eller presse. (\"Stryke\" means to move your hand smoothly over something, often in a loving or soothing gesture, similar to \"klappe\". \"Slå\" involves more force and is often negative, and \"klemme\" is to embrace or squeeze.)"
    },
    {
      id: 84,
      word: "Børste",
      options: [
        { id: "A", text: "Gre", correct: true },
        { id: "B", text: "Vaske", correct: false },
        { id: "C", text: "Pusse", correct: false }
      ],
      nuance: "\"Gre\" brukes spesifikt for å ordne hår med en kam eller børste, veldig likt \"børste\" når det brukes om hår. \"Vaske\" er mer generelt om rengjøring, og \"pusse\" kan brukes for tenner eller overflater. (\"Gre\" is used specifically for arranging hair with a comb or brush, very similar to \"børste\" when used about hair. \"Vaske\" is more general about cleaning, and \"pusse\" can be used for teeth or surfaces.)"
    },
    {
      id: 85,
      word: "Henge opp",
      options: [
        { id: "A", text: "Plassere", correct: false },
        { id: "B", text: "Montere", correct: true },
        { id: "C", text: "Legge", correct: false }
      ],
      nuance: "\"Montere\" betyr å feste eller sette sammen noe, ofte på en vegg, lignende \"henge opp\". \"Plassere\" er mer generelt om å sette noe et sted, og \"legge\" refererer til å sette noe horisontalt. (\"Montere\" means to attach or assemble something, often on a wall, similar to \"henge opp\". \"Plassere\" is more general about putting something somewhere, and \"legge\" refers to putting something horizontally.)"
    },
    {
      id: 86,
      word: "Spise",
      options: [
        { id: "A", text: "Gumle", correct: true },
        { id: "B", text: "Drikke", correct: false },
        { id: "C", text: "Servere", correct: false }
      ],
      nuance: "\"Gumle\" beskriver en spesifikk måte å spise på, ofte langsomt og med tydelige tyggbevegelser. \"Drikke\" er for væsker, ikke fast føde, og \"servere\" er å tilby mat til andre. (\"Gumle\" describes a specific way of eating, often slowly and with noticeable chewing movements. \"Drikke\" is for liquids, not solid food, and \"servere\" is to offer food to others.)"
    },
    {
      id: 87,
      word: "Tygge",
      options: [
        { id: "A", text: "Svelge", correct: false },
        { id: "B", text: "Gnage", correct: true },
        { id: "C", text: "Smake", correct: false }
      ],
      nuance: "\"Gnage\" er å tygge på noe hardt eller seigt, ofte over tid, lignende \"tygge\" men mer intenst eller vedvarende. \"Svelge\" er å få mat ned i halsen, og \"smake\" er å oppleve smaken av noe. (\"Gnage\" is to chew on something hard or tough, often over time, similar to \"tygge\" but more intense or persistent. \"Svelge\" is to get food down the throat, and \"smake\" is to experience the taste of something.)"
    },
    {
      id: 88,
      word: "Se på",
      options: [
        { id: "A", text: "Stirre", correct: true },
        { id: "B", text: "Høre", correct: false },
        { id: "C", text: "Overse", correct: false }
      ],
      nuance: "\"Stirre\" er å se intenst eller vedvarende på noe, en mer fokusert versjon av \"se på\". \"Høre\" involverer en annen sans, og \"overse\" betyr å ikke legge merke til eller ignorere. (\"Stirre\" is to look intensely or persistently at something, a more focused version of \"se på\". \"Høre\" involves a different sense, and \"overse\" means to not notice or to ignore.)"
    },
    {
      id: 89,
      word: "Skap",
      options: [
        { id: "A", text: "Hylle", correct: true },
        { id: "B", text: "Bord", correct: false },
        { id: "C", text: "Stol", correct: false }
      ],
      nuance: "\"Hylle\" er en flat, horisontal overflate for lagring eller utstilling, men mindre innelukket enn et \"skap\". \"Bord\" er en møbel med flat topp og ben, og \"stol\" er for å sitte på. (\"Hylle\" is a flat, horizontal surface for storage or display, but less enclosed than a \"skap\". \"Bord\" is a piece of furniture with a flat top and legs, and \"stol\" is for sitting on.)"
    },
    {
      id: 90,
      word: "Fullføre",
      options: [
        { id: "A", text: "Starte", correct: false },
        { id: "B", text: "Oppnå", correct: true },
        { id: "C", text: "Prøve", correct: false }
      ],
      nuance: "\"Oppnå\" betyr å lykkes med å få eller nå noe, veldig likt \"fullføre\" når det gjelder å nå et mål. \"Starte\" er det motsatte, begynnelsen av noe, og \"prøve\" er å gjøre et forsøk uten garantert suksess. (\"Oppnå\" means to succeed in getting or reaching something, very similar to \"fullføre\" when it comes to reaching a goal. \"Starte\" is the opposite, the beginning of something, and \"prøve\" is to make an attempt without guaranteed success.)"
    },
    {
      id: 91,
      word: "Innrømme",
      options: [
        { id: "A", text: "Bekjenne", correct: true },
        { id: "B", text: "Nekte", correct: false },
        { id: "C", text: "Spørre", correct: false }
      ],
      nuance: "\"Bekjenne\" er å tilstå eller erkjenne noe, ofte med en tone av skyld eller anger, veldig likt \"innrømme\". \"Nekte\" er det motsatte, å avvise noe som sant, og \"spørre\" er å be om informasjon. (\"Bekjenne\" is to confess or acknowledge something, often with a tone of guilt or regret, very similar to \"innrømme\". \"Nekte\" is the opposite, to deny something as true, and \"spørre\" is to ask for information.)"
    },
    {
      id: 92,
      word: "Stor",
      options: [
        { id: "A", text: "Liten", correct: false },
        { id: "B", text: "Massiv", correct: true },
        { id: "C", text: "Middels", correct: false }
      ],
      nuance: "\"Massiv\" beskriver noe som er meget stort, tungt eller solid, en mer intens versjon av \"stor\". \"Liten\" er det motsatte av \"stor\", og \"middels\" refererer til gjennomsnittlig størrelse. (\"Massiv\" describes something that is very large, heavy, or solid, a more intense version of \"stor\". \"Liten\" is the opposite of \"stor\", and \"middels\" refers to average size.)"
    },
    {
      id: 93,
      word: "Assistere",
      options: [
        { id: "A", text: "Hjelpe", correct: true },
        { id: "B", text: "Hindre", correct: false },
        { id: "C", text: "Observere", correct: false }
      ],
      nuance: "\"Hjelpe\" er å gi støtte eller bistand, praktisk talt det samme som \"assistere\" men mer hverdagslig. \"Hindre\" er det motsatte, å stå i veien for noen, og \"observere\" er bare å se på uten å involvere seg. (\"Hjelpe\" is to provide support or assistance, practically the same as \"assistere\" but more everyday. \"Hindre\" is the opposite, to stand in someone's way, and \"observere\" is just to watch without getting involved.)"
    },
    {
      id: 94,
      word: "Lik",
      options: [
        { id: "A", text: "Identisk", correct: true },
        { id: "B", text: "Forskjellig", correct: false },
        { id: "C", text: "Unik", correct: false }
      ],
      nuance: "\"Identisk\" betyr at to ting er helt like, uten forskjeller, en sterkere versjon av \"lik\". \"Forskjellig\" og \"unik\" er begge motsetninger til \"lik\", med \"unik\" som betyr at noe er helt enestående. (\"Identisk\" means that two things are exactly the same, without differences, a stronger version of \"lik\". \"Forskjellig\" and \"unik\" are both opposites of \"lik\", with \"unik\" meaning that something is completely one-of-a-kind.)"
    },
    {
      id: 95,
      word: "Imidlertid",
      options: [
        { id: "A", text: "Derfor", correct: false },
        { id: "B", text: "Ikke desto mindre", correct: true },
        { id: "C", text: "Dessuten", correct: false }
      ],
      nuance: "\"Ikke desto mindre\" introduserer en kontrast eller innvending, veldig likt \"imidlertid\". \"Derfor\" indikerer en konsekvens, ikke en kontrast, og \"dessuten\" legger til informasjon uten nødvendigvis å kontrastere. (\"Ikke desto mindre\" introduces a contrast or objection, very similar to \"imidlertid\". \"Derfor\" indicates a consequence, not a contrast, and \"dessuten\" adds information without necessarily contrasting.)"
    },
    {
      id: 96,
      word: "Tanke",
      options: [
        { id: "A", text: "Følelse", correct: false },
        { id: "B", text: "Idé", correct: true },
        { id: "C", text: "Handling", correct: false }
      ],
      nuance: "\"Idé\" refererer til et konsept eller forslag som oppstår i sinnet, veldig likt \"tanke\". \"Følelse\" er en emosjonell reaksjon, ikke en kognitiv prosess, og \"handling\" er noe man gjør, ikke tenker. (\"Idé\" refers to a concept or suggestion that arises in the mind, very similar to \"tanke\". \"Følelse\" is an emotional reaction, not a cognitive process, and \"handling\" is something one does, not thinks.)"
    },
    {
      id: 97,
      word: "Organisert",
      options: [
        { id: "A", text: "Ryddig", correct: true },
        { id: "B", text: "Rotete", correct: false },
        { id: "C", text: "Kreativ", correct: false }
      ],
      nuance: "\"Ryddig\" beskriver noe som er ordnet og uten rot, veldig likt \"organisert\". \"Rotete\" er det motsatte, og \"kreativ\" refererer til evnen til å skape, ikke til orden. (\"Ryddig\" describes something that is ordered and without mess, very similar to \"organisert\". \"Rotete\" is the opposite, and \"kreativ\" refers to the ability to create, not to order.)"
    },
    {
      id: 98,
      word: "Le",
      options: [
        { id: "A", text: "Gråte", correct: false },
        { id: "B", text: "Fnise", correct: true },
        { id: "C", text: "Sukke", correct: false }
      ],
      nuance: "\"Fnise\" er en type latter, ofte stille eller undertrykt, en spesifikk måte å \"le\" på. \"Gråte\" er det motsatte av å le, og \"sukke\" er å puste tungt ut, ofte i frustrasjon eller tretthet. (\"Fnise\" is a type of laughter, often quiet or suppressed, a specific way to \"le\". \"Gråte\" is the opposite of laughing, and \"sukke\" is to breathe out heavily, often in frustration or tiredness.)"
    },
    {
      id: 99,
      word: "Gråte",
      options: [
        { id: "A", text: "Le", correct: false },
        { id: "B", text: "Hulke", correct: true },
        { id: "C", text: "Hviske", correct: false }
      ],
      nuance: "\"Hulke\" er en intens form for gråting, ofte med dype, ujevne pust, en mer emosjonell versjon av \"gråte\". \"Le\" er det motsatte av å gråte, og \"hviske\" er å snakke veldig lavt. (\"Hulke\" is an intense form of crying, often with deep, uneven breaths, a more emotional version of \"gråte\". \"Le\" is the opposite of crying, and \"hviske\" is to speak very quietly.)"
    },
    {
      id: 100,
      word: "Rope",
      options: [
        { id: "A", text: "Skrike", correct: true },
        { id: "B", text: "Hviske", correct: false },
        { id: "C", text: "Mumle", correct: false }
      ],
      nuance: "\"Skrike\" er å lage en høy, intens lyd med stemmen, ofte mer intenst enn \"rope\". \"Hviske\" og \"mumle\" er begge det motsatte, å snakke lavt, med \"mumle\" som innebærer utydelig tale. (\"Skrike\" is to make a loud, intense sound with the voice, often more intense than \"rope\". \"Hviske\" and \"mumle\" are both the opposite, speaking quietly, with \"mumle\" implying unclear speech.)"
    },
    {
      id: 101,
      word: "Interessant",
      options: [
        { id: "A", text: "Kjedelig", correct: false },
        { id: "B", text: "Spennende", correct: true },
        { id: "C", text: "Vanskelig", correct: false }
      ],
      nuance: "\"Spennende\" beskriver noe som vekker nysgjerrighet eller begeistring, ofte mer intenst enn bare \"interessant\". \"Kjedelig\" er det motsatte av \"interessant\", og \"vanskelig\" refererer til nivå av utfordring, ikke interesse. (\"Spennende\" describes something that arouses curiosity or excitement, often more intensely than just \"interesting\". \"Kjedelig\" is the opposite of \"interessant\", and \"vanskelig\" refers to level of challenge, not interest.)"
    },
    {
      id: 102,
      word: "Samle",
      options: [
        { id: "A", text: "Splitte", correct: false },
        { id: "B", text: "Spre", correct: false },
        { id: "C", text: "Innhente", correct: true }
      ],
      nuance: "\"Innhente\" betyr å bringe sammen eller akkumulere, lignende \"samle\". \"Splitte\" og \"spre\" er begge det motsatte, å atskille eller distribuere. (\"Innhente\" means to bring together or accumulate, similar to \"samle\". \"Splitte\" and \"spre\" are both the opposite, to separate or distribute.)"
    },
    {
      id: 103,
      word: "Rask",
      options: [
        { id: "A", text: "Treg", correct: false },
        { id: "B", text: "Sakte", correct: false },
        { id: "C", text: "Kvikk", correct: true }
      ],
      nuance: "\"Kvikk\" beskriver noe eller noen som beveger seg eller reagerer raskt, veldig likt \"rask\". \"Treg\" og \"sakte\" er begge det motsatte, å bevege seg langsomt. (\"Kvikk\" describes something or someone that moves or reacts quickly, very similar to \"rask\". \"Treg\" and \"sakte\" are both the opposite, moving slowly.)"
    },
    {
      id: 104,
      word: "Varm",
      options: [
        { id: "A", text: "Kald", correct: false },
        { id: "B", text: "Lun", correct: true },
        { id: "C", text: "Fuktig", correct: false }
      ],
      nuance: "\"Lun\" beskriver noe som er behagelig varmt, men ikke intenst, en mild form for \"varm\". \"Kald\" er det motsatte av \"varm\", og \"fuktig\" refererer til fuktighet, ikke temperatur. (\"Lun\" describes something that is pleasantly warm, but not intense, a mild form of \"varm\". \"Kald\" is the opposite of \"varm\", and \"fuktig\" refers to moisture, not temperature.)"
    },
    {
      id: 105,
      word: "Het",
      options: [
        { id: "A", text: "Sval", correct: false },
        { id: "B", text: "Kokende", correct: true },
        { id: "C", text: "Varm", correct: false }
      ],
      nuance: "\"Kokende\" beskriver ekstrem varme, ofte til kokepunktet, en mer intens versjon av \"het\". \"Sval\" er det motsatte, litt kjølig, og \"varm\" er mindre intenst enn \"het\". (\"Kokende\" describes extreme heat, often to the boiling point, a more intense version of \"het\". \"Sval\" is the opposite, slightly cool, and \"varm\" is less intense than \"het\".)"
    },
    {
      id: 106,
      word: "Snøfylt",
      options: [
        { id: "A", text: "Isete", correct: true },
        { id: "B", text: "Tørt", correct: false },
        { id: "C", text: "Varmt", correct: false }
      ],
      nuance: "\"Isete\" beskriver noe dekket av is, som kan være et resultat av snø som har smeltet og fryst igjen, relatert til \"snøfylt\". \"Tørt\" er det motsatte av både snøfylt og isete, og \"varmt\" er en temperatur som ville smelte både snø og is. (\"Isete\" describes something covered in ice, which can be a result of snow that has melted and frozen again, related to \"snøfylt\". \"Tørt\" is the opposite of both snowy and icy, and \"varmt\" is a temperature that would melt both snow and ice.)"
    },
    {
      id: 107,
      word: "Kjølig",
      options: [
        { id: "A", text: "Varm", correct: false },
        { id: "B", text: "Kald", correct: false },
        { id: "C", text: "Bitende", correct: true }
      ],
      nuance: "\"Bitende\" beskriver intens kulde som føles skarp eller smertefullt, mer ekstrem enn \"kjølig\". \"Varm\" er det motsatte av \"kjølig\", og \"kald\" er mer intens enn \"kjølig\" men mindre ekstrem enn \"bitende\". (\"Bitende\" describes intense cold that feels sharp or painful, more extreme than \"kjølig\". \"Varm\" is the opposite of \"kjølig\", and \"kald\" is more intense than \"kjølig\" but less extreme than \"bitende\".)"
    },
    {
      id: 108,
      word: "Forvirret",
      options: [
        { id: "A", text: "Klar", correct: false },
        { id: "B", text: "Rådvill", correct: true },
        { id: "C", text: "Sikker", correct: false }
      ],
      nuance: "\"Rådvill\" beskriver en tilstand av å ikke vite hva man skal gjøre, lignende \"forvirret\" men med mer vekt på beslutningsvansker. \"Klar\" og \"sikker\" er begge det motsatte, å ha tydelig forståelse eller overbevisning. (\"Rådvill\" describes a state of not knowing what to do, similar to \"forvirret\" but with more emphasis on decision difficulties. \"Klar\" and \"sikker\" are both the opposite, having clear understanding or conviction.)"
    },
    {
      id: 109,
      word: "Sliten",
      options: [
        { id: "A", text: "Opplagt", correct: false },
        { id: "B", text: "Uthvilt", correct: false },
        { id: "C", text: "Utmattet", correct: true }
      ],
      nuance: "\"Utmattet\" beskriver ekstrem tretthet eller utmattelse, en mer intens versjon av \"sliten\". \"Opplagt\" og \"uthvilt\" er begge det motsatte, å føle seg frisk og energisk. (\"Utmattet\" describes extreme tiredness or exhaustion, a more intense version of \"sliten\". \"Opplagt\" and \"uthvilt\" are both the opposite, feeling fresh and energetic.)"
    },
    {
      id: 110,
      word: "Sint",
      options: [
        { id: "A", text: "Rolig", correct: false },
        { id: "B", text: "Rasende", correct: true },
        { id: "C", text: "Glad", correct: false }
      ],
      nuance: "\"Rasende\" beskriver intens sinne eller raseri, en mer ekstrem form for \"sint\". \"Rolig\" og \"glad\" er begge det motsatte, å være fredelig eller positiv. (\"Rasende\" describes intense anger or rage, a more extreme form of \"sint\". \"Rolig\" and \"glad\" are both the opposite, being peaceful or positive.)"
    },
    {
      id: 111,
      word: "Rar",
      options: [
        { id: "A", text: "Normal", correct: false },
        { id: "B", text: "Vanlig", correct: false },
        { id: "C", text: "Sprø", correct: true }
      ],
      nuance: "\"Sprø\" beskriver noe som er veldig uvanlig, eksentrisk eller merkelig, ofte mer ekstremt enn bare \"rar\". \"Normal\" og \"vanlig\" er begge det motsatte, å være innenfor det forventede. (\"Sprø\" describes something that is very unusual, eccentric, or strange, often more extreme than just \"rar\". \"Normal\" and \"vanlig\" are both the opposite, being within the expected.)"
    },
    {
      id: 112,
      word: "Vill",
      options: [
        { id: "A", text: "Tam", correct: false },
        { id: "B", text: "Utemmelig", correct: true },
        { id: "C", text: "Kontrollert", correct: false }
      ],
      nuance: "\"Utemmelig\" beskriver noe som ikke kan temmes eller kontrolleres, en mer ekstrem versjon av \"vill\". \"Tam\" og \"kontrollert\" er begge det motsatte, å være under kontroll eller temmet. (\"Utemmelig\" describes something that cannot be tamed or controlled, a more extreme version of \"vill\". \"Tam\" and \"kontrollert\" are both the opposite, being under control or tamed.)"
    },
    {
      id: 113,
      word: "Trist",
      options: [
        { id: "A", text: "Glad", correct: false },
        { id: "B", text: "Tungsindig", correct: true },
        { id: "C", text: "Livlig", correct: false }
      ],
      nuance: "\"Tungsindig\" beskriver en dyp, vedvarende tristhet eller melankoli, en mørkere eller mer intens form for \"trist\". \"Glad\" og \"livlig\" er begge det motsatte, å føle glede eller entusiasme. (\"Tungsindig\" describes a deep, persistent sadness or melancholy, a darker or more intense form of \"trist\". \"Glad\" and \"livlig\" are both the opposite, feeling joy or enthusiasm.)"
    },
    {
      id: 114,
      word: "Bitter",
      options: [
        { id: "A", text: "Søt", correct: false },
        { id: "B", text: "Gretten", correct: true },
        { id: "C", text: "Vennlig", correct: false }
      ],
      nuance: "\"Gretten\" beskriver en irritabel eller sur holdning, ofte relatert til \"bitter\" når det gjelder personlighet. \"Søt\" er det motsatte av \"bitter\" i smak, og \"vennlig\" er det motsatte i personlighet. (\"Gretten\" describes an irritable or grumpy attitude, often related to \"bitter\" when it comes to personality. \"Søt\" is the opposite of \"bitter\" in taste, and \"vennlig\" is the opposite in personality.)"
    },
    {
      id: 115,
      word: "Slem",
      options: [
        { id: "A", text: "Snill", correct: false },
        { id: "B", text: "Uhøflig", correct: true },
        { id: "C", text: "Vennlig", correct: false }
      ],
      nuance: "\"Uhøflig\" beskriver mangel på gode manerer eller respekt, en mildere form for \"slem\" som fokuserer på oppførsel heller enn intensjon. \"Snill\" og \"vennlig\" er begge det motsatte, å være omtenksom eller hyggelig. (\"Uhøflig\" describes a lack of good manners or respect, a milder form of \"slem\" that focuses on behavior rather than intention. \"Snill\" and \"vennlig\" are both the opposite, being considerate or nice.)"
    },
    {
      id: 116,
      word: "Høflig",
      options: [
        { id: "A", text: "Frekk", correct: false },
        { id: "B", text: "Respektfull", correct: true },
        { id: "C", text: "Uhøflig", correct: false }
      ],
      nuance: "\"Respektfull\" beskriver å vise respekt eller aktelse, en dypere form for \"høflig\" som fokuserer på holdning, ikke bare handlinger. \"Frekk\" og \"uhøflig\" er begge det motsatte, å mangle respekt eller gode manerer. (\"Respektfull\" describes showing respect or esteem, a deeper form of \"høflig\" that focuses on attitude, not just actions. \"Frekk\" and \"uhøflig\" are both the opposite, lacking respect or good manners.)"
    },
    {
      id: 117,
      word: "Skarp",
      options: [
        { id: "A", text: "Butt", correct: false },
        { id: "B", text: "Stump", correct: false },
        { id: "C", text: "Spiss", correct: true }
      ],
      nuance: "\"Spiss\" beskriver noe som har en skarp ende eller punkt, veldig likt \"skarp\" når det gjelder objekter. \"Butt\" og \"stump\" er begge det motsatte, å mangle en skarp kant eller punkt. (\"Spiss\" describes something that has a sharp end or point, very similar to \"skarp\" when it comes to objects. \"Butt\" and \"stump\" are both the opposite, lacking a sharp edge or point.)"
    },
    {
      id: 118,
      word: "Starte",
      options: [
        { id: "A", text: "Slutte", correct: false },
        { id: "B", text: "Avslutte", correct: false },
        { id: "C", text: "Begynne", correct: true }
      ],
      nuance: "\"Begynne\" er praktisk talt identisk med \"starte\", begge refererer til å sette i gang eller initiere noe. \"Slutte\" og \"avslutte\" er begge det motsatte, å bringe noe til en slutt. (\"Begynne\" is practically identical to \"starte\", both referring to setting something in motion or initiating something. \"Slutte\" and \"avslutte\" are both the opposite, bringing something to an end.)"
    },
    {
      id: 119,
      word: "Skade",
      options: [
        { id: "A", text: "Helbrede", correct: false },
        { id: "B", text: "Såre", correct: true },
        { id: "C", text: "Reparere", correct: false }
      ],
      nuance: "\"Såre\" betyr å forårsake smerte eller skade, særlig følelsesmessig, lignende \"skade\" men ofte mer fokusert på emosjonelle sår. \"Helbrede\" og \"reparere\" er begge det motsatte, å gjøre noe bedre eller fikse det. (\"Såre\" means to cause pain or hurt, especially emotionally, similar to \"skade\" but often more focused on emotional wounds. \"Helbrede\" and \"reparere\" are both the opposite, making something better or fixing it.)"
    },
    {
      id: 120,
      word: "Lytte",
      options: [
        { id: "A", text: "Ignorere", correct: false },
        { id: "B", text: "Snakke", correct: false },
        { id: "C", text: "Høre", correct: true }
      ],
      nuance: "\"Høre\" refererer til sansningen av lyd gjennom ørene, en mer passiv versjon av \"lytte\" som innebærer mer aktiv oppmerksomhet. \"Ignorere\" er det motsatte, å ikke gi oppmerksomhet, og \"snakke\" er å produsere lyd i stedet for å motta den. (\"Høre\" refers to the perception of sound through the ears, a more passive version of \"lytte\" which implies more active attention. \"Ignorere\" is the opposite, not giving attention, and \"snakke\" is producing sound instead of receiving it.)"
    },
    {
      id: 121,
      word: "Behandle",
      options: [
        { id: "A", text: "Kurere", correct: true },
        { id: "B", text: "Forsømme", correct: false },
        { id: "C", text: "Skade", correct: false }
      ],
      nuance: "\"Kurere\" betyr å helbrede eller fikse et problem, spesielt i medisinsk sammenheng, en mer spesifikk og målrettet form for \"behandle\". \"Forsømme\" er å ikke gi nødvendig omsorg, og \"skade\" er å forårsake problemer, ikke løse dem. (\"Kurere\" means to heal or fix a problem, especially in a medical context, a more specific and targeted form of \"behandle\". \"Forsømme\" is not giving necessary care, and \"skade\" is causing problems, not solving them.)"
    },
    {
      id: 122,
      word: "Skape",
      options: [
        { id: "A", text: "Produsere", correct: true },
        { id: "B", text: "Ødelegge", correct: false },
        { id: "C", text: "Ignorere", correct: false }
      ],
      nuance: "\"Produsere\" betyr å fremstille eller lage noe, en mer teknisk eller industriell versjon av \"skape\" som kan ha mer kreative konnotasjoner. \"Ødelegge\" er det motsatte, å bryte ned noe, og \"ignorere\" er å ikke legge merke til noe. (\"Produsere\" means to manufacture or make something, a more technical or industrial version of \"skape\" which may have more creative connotations. \"Ødelegge\" is the opposite, breaking something down, and \"ignorere\" is not noticing something.)"
    },
    {
      id: 123,
      word: "Dømme",
      options: [
        { id: "A", text: "Akseptere", correct: false },
        { id: "B", text: "Vurdere", correct: true },
        { id: "C", text: "Unngå", correct: false }
      ],
      nuance: "\"Vurdere\" betyr å evaluere eller bedømme verdien av noe, en mer nøytral prosess lignende \"dømme\" men ofte uten den moralske komponenten. \"Akseptere\" er å godta noe uten nødvendigvis å vurdere det, og \"unngå\" er å holde seg unna noe. (\"Vurdere\" means to evaluate or assess the value of something, a more neutral process similar to \"dømme\" but often without the moral component. \"Akseptere\" is to accept something without necessarily judging it, and \"unngå\" is to stay away from something.)"
    },
    {
      id: 124,
      word: "Stole",
      options: [
        { id: "A", text: "Mistenke", correct: false },
        { id: "B", text: "Ha tiltro", correct: true },
        { id: "C", text: "Tvile", correct: false }
      ],
      nuance: "\"Ha tiltro\" betyr å ha tillit eller tro på noen/noe, praktisk talt det samme som \"stole\". \"Mistenke\" innebærer mangel på tillit med mistanke om noe negativt, og \"tvile\" er å være usikker, ofte på grunn av mangel på tillit. (\"Ha tiltro\" means to have confidence or belief in someone/something, practically the same as \"stole\". \"Mistenke\" involves lack of trust with suspicion of something negative, and \"tvile\" is to be uncertain, often due to lack of trust.)"
    },
    {
      id: 125,
      word: "Forvente",
      options: [
        { id: "A", text: "Overraskes", correct: false },
        { id: "B", text: "Anta", correct: true },
        { id: "C", text: "Glemme", correct: false }
      ],
      nuance: "\"Anta\" betyr å ta noe for gitt eller tro at noe vil skje, lignende \"forvente\" men kan være mindre bestemt. \"Overraskes\" er å bli møtt med noe uventet, det motsatte av å forvente, og \"glemme\" er å miste noe fra minnet. (\"Anta\" means to take something for granted or believe something will happen, similar to \"forvente\" but can be less certain. \"Overraskes\" is to be met with something unexpected, the opposite of expecting, and \"glemme\" is to lose something from memory.)"
    },
    {
      id: 126,
      word: "Beskrive",
      options: [
        { id: "A", text: "Fortie", correct: false },
        { id: "B", text: "Skjule", correct: false },
        { id: "C", text: "Skildre", correct: true }
      ],
      nuance: "\"Skildre\" betyr å fremstille eller portrettere med ord eller bilder, veldig likt \"beskrive\". \"Fortie\" er å bevisst ikke nevne noe, og \"skjule\" er å aktivt holde noe hemmelig. (\"Skildre\" means to depict or portray with words or images, very similar to \"beskrive\". \"Fortie\" is to deliberately not mention something, and \"skjule\" is to actively keep something secret.)"
    },
    {
      id: 127,
      word: "Diskutere",
      options: [
        { id: "A", text: "Ignorere", correct: false },
        { id: "B", text: "Tie", correct: false },
        { id: "C", text: "Debattere", correct: true }
      ],
      nuance: "\"Debattere\" betyr å utveksle meninger eller argumenter, ofte mer formelt eller strukturert enn \"diskutere\". \"Ignorere\" er å ikke gi oppmerksomhet til noe, og \"tie\" er å være stille eller ikke snakke. (\"Debattere\" means to exchange opinions or arguments, often more formal or structured than \"diskutere\". \"Ignorere\" is not giving attention to something, and \"tie\" is to be quiet or not speak.)"
    },
    {
      id: 128,
      word: "Endre",
      options: [
        { id: "A", text: "Beholde", correct: false },
        { id: "B", text: "Modifisere", correct: true },
        { id: "C", text: "Bevare", correct: false }
      ],
      nuance: "\"Modifisere\" betyr å gjøre endringer eller justeringer, ofte mindre eller mer spesifikke enn å \"endre\" noe fullstendig. \"Beholde\" og \"bevare\" er begge det motsatte, å holde noe i sin opprinnelige tilstand. (\"Modifisere\" means to make changes or adjustments, often smaller or more specific than \"endre\" something completely. \"Beholde\" and \"bevare\" are both the opposite, keeping something in its original state.)"
    },
    {
      id: 129,
      word: "Klatre",
      options: [
        { id: "A", text: "Falle", correct: false },
        { id: "B", text: "Stige", correct: true },
        { id: "C", text: "Synke", correct: false }
      ],
      nuance: "\"Stige\" betyr å bevege seg oppover, lignende \"klatre\" men kan referere til enhver oppoverrettet bevegelse, ikke bare med kroppen. \"Falle\" og \"synke\" er begge det motsatte, å bevege seg nedover. (\"Stige\" means to move upward, similar to \"klatre\" but can refer to any upward movement, not just with the body. \"Falle\" and \"synke\" are both the opposite, moving downward.)"
    },
    {
      id: 130,
      word: "Lede",
      options: [
        { id: "A", text: "Følge", correct: false },
        { id: "B", text: "Styre", correct: true },
        { id: "C", text: "Adlyde", correct: false }
      ],
      nuance: "\"Styre\" betyr å kontrollere retningen eller aktivitetene til noe, lignende \"lede\" men med mer vekt på kontroll og mindre på å gå foran. \"Følge\" og \"adlyde\" er begge det motsatte, å gå etter noen eller følge instruksjoner. (\"Styre\" means to control the direction or activities of something, similar to \"lede\" but with more emphasis on control and less on going in front. \"Følge\" and \"adlyde\" are both the opposite, going after someone or following instructions.)"
    },
  ];

  // Get a random word that hasn't been used yet in this session, 
  // unless it was answered incorrectly
  const getRandomWord = () => {
    // Filter out words that have been used (except incorrect ones that should be repeated)
    const availableWords = norwegianSynonyms.filter(word => 
      !usedWordIds.has(word.id) || incorrectWordIds.has(word.id)
    );

    // If all words have been used or we're out of words, show summary
    if (availableWords.length === 0) {
      endSession();
      return null;
    }

    // Select a random word from available words
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const selectedWord = availableWords[randomIndex];

    // Prepare the options
    const shuffledOptions = [...selectedWord.options].sort(() => Math.random() - 0.5);
    
    // Set the current word and options
    setCurrentWord(selectedWord);
    setOptions(shuffledOptions);
    
    // Mark this word as used
    setUsedWordIds(prev => new Set([...prev, selectedWord.id]));
    
    // If this word was previously incorrect and is now being repeated,
    // remove it from the incorrectWordIds set
    if (incorrectWordIds.has(selectedWord.id)) {
      setIncorrectWordIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(selectedWord.id);
        return newSet;
      });
    }

    // Reset the selected option and result
    setSelectedOption(null);
    setResult({ status: '', message: '' });
    setReadyForNextQuestion(false);

    return selectedWord;
  };

  // Start the game session
  const startSession = () => {
    setGameStage('gameplay');
    setIsSessionActive(true);
    setTimeLeft(300); // 5 minutes
    setQuestionCount(0);
    setScore(0);
    setSelectedOption(null);
    setUsedWordIds(new Set());
    setIncorrectWordIds(new Set());
    setSessionStats({
      correct: [],
      incorrect: [],
      words: {}
    });

    // Get the first random word
    getRandomWord();
  };

  // End the session and go to summary
  const endSession = () => {
    setIsSessionActive(false);
    setGameStage('summary');
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    if (selectedOption || !isSessionActive || readyForNextQuestion) return;
    
    setSelectedOption(option);
    
    // Find the correct option
    const correctOption = currentWord.options.find(opt => opt.correct);
    
    if (option.id === correctOption.id) {
      // Correct answer
      setResult({
        status: 'correct',
        message: 'Bra jobba! Svaret ditt er riktig.'
      });
      
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Update score
      setScore(prevScore => prevScore + 1);
      
      // Update stats
      updateStats(true);
      
      // Move to next question after a short delay
      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } else {
      // Incorrect answer
      setResult({
        status: 'incorrect',
        message: `Det riktige svaret er "${correctOption.text}".`
      });
      
      // Add to incorrect words to be repeated later
      setIncorrectWordIds(prev => new Set([...prev, currentWord.id]));
      
      // Update stats
      updateStats(false);
      
      // Set ready for next question instead of automatically moving to next question
      setReadyForNextQuestion(true);
    }
  };

  // Move to the next question
  const moveToNextQuestion = () => {
    // Increment question count
    const newQuestionCount = questionCount + 1;
    setQuestionCount(newQuestionCount);
    
    // Check if we've reached the max questions for question-based sessions
    if (sessionType === 'questions' && newQuestionCount >= maxQuestions) {
      endSession();
    } else {
      // Get the next random word
      getRandomWord();
    }
  };

  // Update session statistics
  const updateStats = (isCorrect) => {
    if (!currentWord) return;

    setSessionStats(prevStats => {
      const wordId = currentWord.id;
      const wordInfo = {
        word: currentWord.word,
        options: currentWord.options,
        selected: selectedOption,
        nuance: currentWord.nuance
      };
      
      return {
        correct: isCorrect 
          ? [...prevStats.correct, wordInfo] 
          : prevStats.correct,
        incorrect: !isCorrect 
          ? [...prevStats.incorrect, wordInfo] 
          : prevStats.incorrect,
        words: {
          ...prevStats.words,
          [wordId]: {
            total: (prevStats.words[wordId]?.total || 0) + 1,
            correct: (prevStats.words[wordId]?.correct || 0) + (isCorrect ? 1 : 0)
          }
        }
      };
    });
  };

  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Timer effect for timed sessions
  useEffect(() => {
    if (!isSessionActive || sessionType !== 'timed') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, sessionType]);

  // Render intro/instruction screen
  const renderIntro = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="synonym-intro"
    >
      <h2>Norske Synonymer</h2>
      <div className="instructions">
        <p>Velg det synonymet som er nærmest ordet som blir vist.</p>
        <p>Vær oppmerksom på nyansene mellom lignende ord!</p>
        <p>Spillmodus: {sessionType === 'timed' ? '5 minutter' : '20 spørsmål'}</p>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startSession}
        className="start-session-btn"
      >
        Start
      </motion.button>
    </motion.div>
  );

  // Render gameplay screen
  const renderGameplay = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="synonym-gameplay"
    >
      {/* Session info bar */}
      <div className="session-info">
        {sessionType === 'timed' && (
          <div className="timer">
            <span>Tid igjen: {formatTime(timeLeft)}</span>
          </div>
        )}
        {sessionType === 'questions' && (
          <div className="question-counter">
            <span>Spørsmål: {questionCount + 1}/{maxQuestions}</span>
          </div>
        )}
        <div className="score">
          <span>Poeng: {score}</span>
        </div>
        <button onClick={endSession} className="end-session-btn">
          Avslutt
        </button>
      </div>

      {/* Current word and options */}
      {currentWord && (
        <div className="word-container">
          <motion.h3 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="current-word"
          >
            {currentWord.word}
          </motion.h3>
          
          <div className="options-container">
            {options.map(option => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: options.indexOf(option) * 0.1 }}
                className={`option-btn ${selectedOption?.id === option.id 
                  ? (option.correct ? 'correct' : 'incorrect') 
                  : ''}`}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
              >
                <span className="option-letter">{option.id}:</span> {option.text}
              </motion.button>
            ))}
          </div>
          
          {/* Result feedback */}
          <AnimatePresence>
            {result.message && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`result-feedback ${result.status}`}
              >
                <p>{result.message}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Nuance explanation (shown after selection) */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="nuance-container"
              >
                <h4>Nyanse:</h4>
                <p>{currentWord.nuance}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Next question button - show only after selection */}
          {readyForNextQuestion && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              onClick={moveToNextQuestion}
              className="next-question-btn"
              style={{
                marginTop: '20px',
                padding: '12px 25px',
                backgroundColor: '#4ECDC4',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Neste Spørsmål →
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );

  // Render session summary screen
  const renderSummary = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="session-summary"
    >
      <h2>Øktsammendrag</h2>
      
      <div className="summary-stats">
        <div className="stat-item">
          <p>Totale spørsmål</p>
          <p className="stat-value">{questionCount}</p>
        </div>
        <div className="stat-item">
          <p>Riktige svar</p>
          <p className="stat-value">{sessionStats.correct.length}</p>
        </div>
        <div className="stat-item">
          <p>Endelig poengsum</p>
          <p className="stat-value">{score}</p>
        </div>
      </div>
      
      {/* List of incorrect answers for review */}
      {sessionStats.incorrect.length > 0 && (
        <div className="incorrect-answers">
          <h3>Gjennomgang av feil</h3>
          {sessionStats.incorrect.map((item, index) => (
            <div key={index} className="incorrect-item">
              <h4>{item.word}</h4>
              <div className="options-review">
                {item.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`review-option ${
                      option.correct ? 'correct' : (item.selected.id === option.id ? 'selected' : '')
                    }`}
                  >
                    <span className="option-letter">{option.id}:</span> {option.text}
                    {option.correct && <span className="correct-marker">✓</span>}
                  </div>
                ))}
              </div>
              <div className="nuance-review">
                <h5>Nyanse:</h5>
                <p>{item.nuance}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Action buttons */}
      <div className="summary-actions">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startSession}
          className="restart-btn"
        >
          Prøv igjen
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setGameStage('intro')}
          className="back-btn"
        >
          Tilbake til menyen
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="norwegian-synonyms-container">
      <AnimatePresence mode="wait">
        {gameStage === 'intro' && renderIntro()}
        {gameStage === 'gameplay' && renderGameplay()}
        {gameStage === 'summary' && renderSummary()}
      </AnimatePresence>
    </div>
  );
};

export default NorwegianSynonyms;