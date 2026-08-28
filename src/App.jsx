import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// --- PERFORMANCE-BOOSTER 3.0 (Anti-Flackern & GPU-Beschleunigung) ---
const MediaItem = ({ url, alt, className, isPriority }) => {
  const isVideo = url && (url.toLowerCase().endsWith('.mp4') || url.includes('.mp4'));
  const mediaRef = useRef(null);

  useEffect(() => {
    if (!isVideo || !mediaRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Video startet durch den riesigen Puffer schon weit vor dem sichtbaren Bereich
            mediaRef.current?.play().catch(() => {});
          } else {
            // Pausiert sofort, wenn es weggescrollt wird (Spart massiv RAM & CPU)
            mediaRef.current?.pause();
          }
        });
      },
      // HIER GEÄNDERT: 800px Puffer! Das Video ist längst bereit, wenn du hinscrollst.
      { rootMargin: '800px' } 
    );

    observer.observe(mediaRef.current);

    return () => observer.disconnect();
  }, [isVideo]);

  if (isVideo) {
    return (
      <video 
        ref={mediaRef}
        src={url} 
        className={`${className} object-cover`}
        loop 
        muted 
        playsInline 
        preload="metadata" 
        style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
      />
    );
  }
  
  return (
    <img 
      src={url} 
      alt={alt || "portfolio media"} 
      className={`${className} object-cover`}
      loading={isPriority ? "eager" : "lazy"} 
      decoding={isPriority ? "sync" : "async"}
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    />
  );
};

// --- MOCK DATA (NEU SORTIERT & NEU NUMMERIERT) ---
const initialProjects = [
  {
    id: 'p1',
    slug: 'niemann-plakat',
    title: 'niemann plakat',
    category: 'posters',
    description: {
      en: "Poster design for Christoph Niemann’s lecture “The Art of Change” at the University of Applied Arts in Vienna.",
      de: "Plakatentwurf für Christoph Niemanns Vortrag „The Art of Change“ an der Universität für angewandte Kunst in Wien."
    },
    carousel: [
      "/niemann-plakat.webp",
      "/niemann-3.webp",
      "/niemann-1.webp",
      "/niemann-2.webp",
      "/niemann-4.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/niemann-2.webp" },
        { type: '16:9', url: "/niemann-5.webp" }
      ],
      [
        { type: '4:5', url: "/niemann-plakat.webp" },
        { type: '4:5', url: "/niemann-1.webp" },
        { type: '4:5', url: "/niemann-3.webp" }
      ],
      [
        { type: '16:9', url: "/niemann-6.webp" }
      ]
    ]
  },
  {
    id: 'p2',
    slug: 'nein-zum-lobautunnel',
    title: 'nein zum lobautunnel',
    category: 'posters',
    description: {
      en: "The planned Lobau Tunnel is intended to run as a motorway route directly beneath the sensitive ecosystem of the Donau-Auen National Park. My poster design takes a clear stand against the project: putting a definitive stop to it is crucial in order to protect valuable groundwater reserves, prevent additional car traffic and consistently channel investment into a sustainable transport transition.",
      de: "Der geplante Lobautunnel soll als Autobahntrasse direkt unter dem sensiblen Ökosystem des Nationalparks Donau-Auen verlaufen. Mein Plakatentwurf bezieht klar Stellung gegen das Projekt: Ein endgültiger Baustopp ist unabdingbar, um wertvolle Grundwasserreserven zu schützen, zusätzlichen Autoverkehr zu verhindern und Investitionen konsequent in eine nachhaltige Verkehrswende zu lenken."
    },
    carousel: [
      "/lobautunnel-animation.mp4",
      "/lobautunnel-mockup.webp",
    ], 
    details: [
      [
        { type: '16:9', url: "/lobautunnel-mockup1.webp" },
        { type: '4:5', url: "/lobautunnel-mockup.webp" }
      ],
      [
        { type: '4:5', url: "/lobautunnel-animation.mp4" },
        { type: '4:5', url: "/lobautunnel-animation.mp4" },
        { type: '4:5', url: "/lobautunnel-animation.mp4" }
      ]
    ]
  },
  {
    id: 'p3',
    slug: 'waehlengehen',
    title: 'wählengehen',
    category: 'illustrations',
    description: {
      en: "An animation to mark the 2024 National Council elections, designed to encourage people to vote.",
      de: "Eine Animation anlässlich der Nationalratswahl 2024, die dazu aufrufen soll, wählen zu gehen."
    },
    carousel: [
      "/waehlengehen.mp4",
    ], 
    details: [
      [
        { type: '4:5', url: "/waehlengehen.mp4" },
        { type: '16:9', url: "/waehlengehen-1.webp" }
      ]
    ]
  },
  {
    id: 'p4',
    slug: 'wunderlich-christmas-planner',
    title: 'wunderlich christmas planner',
    category: 'branding',
    description: {
      en: "The aim of the logo design was to combine an elegant monogram with the emotional world of gift-giving. The result is a minimalist, festive symbol that brings together planning and the Christmas spirit.",
      de: "Ziel des Logodesigns war es, ein elegantes Monogramm mit der emotionalen Welt des Schenkens zu verbinden. Das Ergebnis ist ein minimalistisches, festliches Symbol, das Planung und Weihnachtsstimmung zusammenbringt."
    },
    carousel: [
      "/wunderlich-logo.webp",
      "/wunderlich-prozess.webp",
      "/wunderlich-papier.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/wunderlich-logo.webp" },
        { type: '16:9', url: "/wunderlich-prozess-1.webp" }
      ],
      [
        { type: '16:9', url: "/wunderlich-papier1.webp" }
      ]
    ]
  },
  {
    id: 'p5',
    slug: 'traeubchen',
    title: 'träubchen',
    category: 'packaging',
    description: {
      en: "The label range for the Dürnberg Winery is based on a circular motif that symbolises grapes and visually captures their interplay. Each bottle represents one of the winery’s four main target groups, thereby giving it its own distinctive identity within the overall system.",
      de: "Die Etikettenlinie für das Weingut Dürnberg basiert auf einem Kreismotiv, das Trauben symbolisiert und deren Zusammenspiel visuell einfängt. Jede Flasche repräsentiert eine der vier Hauptzielgruppen des Weinguts und erhält so eine unverwechselbare Identität innerhalb des Gesamtsystems."
    },
    carousel: [
      "/weinflaschen.webp",
    ], 
    details: [
      [
        { type: '16:9', url: "/weinflaschen1.webp" }
      ],
      [
        { type: '16:9', url: "/trauben1.webp" }
      ],
      [
        { type: '16:9', url: "/trauben2.webp" }
      ]
    ]
  },
  {
    id: 'p6',
    slug: 'hand-in-hand',
    title: 'hand in hand',
    category: 'illustrations',
    description: {
      en: "To mark the 2024 European Parliament elections, I created an animation illustrating the unity of the member states.",
      de: "Anlässlich der Europawahl 2024 habe ich eine Animation kreiert, die die Einheit der Mitgliedsstaaten illustriert."
    },
    carousel: [
      "/eu-animation.mp4"
    ], 
    details: [
      [
        { type: '4:5', url: "/eu-animation.mp4" },
        { type: '16:9', url: "public/eu-flagge.webp" }
      ]
    ]
  },
  {
    id: 'p7',
    slug: 'zonkey',
    title: 'zonkey',
    category: 'branding',
    description: {
      en: "Logo design for the “Zonkey” music studio. It was important to the team that the logo depicted both a zonkey (a cross between a zebra and a donkey) and music in the form of sound waves.",
      de: "Logodesign für das Tonstudio „Zonkey“. Dem Team war es wichtig, dass das Logo sowohl einen Zonkey (eine Kreuzung aus Zebra und Esel) als auch Musik in Form von Schallwellen darstellt."
    },
    carousel: [
      "/zonkey-logo.webp",
      "/zonkey-schild.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/zonkey-logo.webp" },
        { type: '16:9', url: "/zonkey-website.webp" }
      ],
      [
        { type: '16:9', url: "/zonkey-anwendungen.webp" },
        { type: '4:5', url: "/zonkey-schild.webp" }
      ],
      [
        { type: '16:9', url: "/zonkey-herleitung.webp" }
      ]
    ]
  },
  {
    id: 'p8',
    slug: 'fiktives-dixi-rebranding',
    title: 'fiktives dixi rebranding',
    category: 'branding',
    description: {
      en: "The focus of this fictional rebranding was a contemporary typographical refresh of the brand. The iconic hearts were deliberately retained and reinterpreted to combine brand recognition with a more modern visual language.",
      de: "Im Fokus dieses fiktiven Rebrandings stand eine zeitgemäße typografische Auffrischung der Marke. Die ikonischen Herzen wurden bewusst beibehalten und neu interpretiert, um Markenwiedererkennung mit einer moderneren Bildsprache zu verbinden."
    },
    carousel: [
      "/dixi-logo.webp",
      "/dixi-nonne.webp",
      "/dixi-festival1.webp",
    ], 
    details: [
      [
        { type: '16:9', url: "/dixi-vergleich.webp" },
        { type: '4:5', url: "/dixi-nonne.webp" }
      ],
      [
        { type: '16:9', url: "/dixi-festival.webp" },
        { type: '4:5', url: "/dixi-logo.webp" }
      ]
    ]
  },
  {
    id: 'p9',
    slug: 'on-digressing',
    title: 'alumnivortrag “on digressing”',
    category: 'posters',
    description: {
      en: "Design of a poster for the alumni lecture on the topic of “Distraction” by Katarina Šoškić in the Kartak class at the University of Applied Arts in Vienna.",
      de: "Gestaltung eines Plakats für den Alumni-Vortrag zum Thema „Ablenkung“ von Katarina Šoškić in der Klasse Kartak an der Universität für angewandte Kunst Wien."
    },
    carousel: [
      "/ondigressing-animation.mp4",
      "/ondigressing-mockup1.webp",
    ], 
    details: [
      [
        { type: '16:9', url: "/ondigressing-mockup2.webp" },
        { type: '4:5', url: "/ondigressing-animation.mp4" }
      ]
    ]
  },
  {
    id: 'p10',
    slug: 'gleisig',
    title: 'gllleisig',
    category: 'branding',
    description: {
      en: "A design concept was developed for the Wiener Linien Rave Festival, based on the analogue ticket as its visual starting point. The idea translates an everyday object into a cultural context and links urban mobility with club culture. Design in collaboration with @p.stuetz.",
      de: "Für das Wiener Linien Rave Festival wurde ein Designkonzept entwickelt, das den analogen Fahrschein als visuellen Ausgangspunkt nimmt. Die Idee übersetzt einen Alltagsgegenstand in einen kulturellen Kontext und verbindet urbane Mobilität mit Clubkultur. Design in Zusammenarbeit mit @p.stuetz."
    },
    carousel: [
      "/gleisig-tickets.webp",
      "/gleisig-fahrplan.webp",
      "/gleisig-bim1.webp",
      "/gleisig-plakat1.webp",
    ], 
    details: [
      [
        { type: '16:9', url: "/gleisig-bim.webp" }
      ],
      [
        { type: '16:9', url: "/gleisig-uebersicht.webp" },
        { type: '4:5', url: "/gleisig-tickets.webp" }
      ],
       [
        { type: '16:9', url: "/gleisig-plakat.webp" }
      ],
      [
        { type: '16:9', url: "/gleisig-uebersicht1.webp" },
        { type: '4:5', url: "/gleisig-fahrplan.webp" }
      ]
    ]
  },
  {
    id: 'p11',
    slug: 'burnout',
    title: 'burnout',
    category: 'illustrations',
    description: {
      en: "Our world is on fire and has a burn out.",
      de: "Unsere Welt brennt und hat ein Burn-out."
    },
    carousel: [
      "/burnout.mp4",
    ], 
    details: [
      [
        { type: '4:5', url: "/burnout.mp4" },
        { type: '16:9', url: "/burnout1.webp" }
      ]
    ]
  },
  {
    id: 'p12',
    slug: 'ma15-kalender',
    title: 'ma15 kalender',
    category: 'illustrations',
    description: {
      en: "As part of a course at the Graphische Wien, the MA 15 department of the City of Vienna approached us with the task of designing illustrations for their annual calendar. The result is a series of images that conveys complex content in a visually accessible and approachable way.",
      de: "Im Rahmen einer Lehrveranstaltung an der Graphischen Wien trat die Abteilung MA 15 der Stadt Wien mit der Aufgabe an uns heran, Illustrationen für ihren Jahreskalender zu entwerfen. Das Ergebnis ist eine Bilderserie, die komplexe Inhalte auf eine visuell zugängliche und nahbare Weise vermittelt."
    },
    carousel: [
      "/ma15.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/ma15-1.webp" },
        { type: '4:5', url: "/ma15-2.webp" },
        { type: '4:5', url: "/ma15-3.webp" }
      ]
    ]
  },
  {
    id: 'p13',
    slug: 'lazy-ways',
    title: 'lazy ways to help our planet',
    category: 'posters',
    description: {
      en: "The poster explores ways in which individuals can take action in the fight against global warming. Nine deliberately simple, almost ironic solutions show how one can make a contribution simply by being “lazy”. The poster was exhibited at the Museum of Applied Arts (MAK) in Vienna.",
      de: "Das Plakat untersucht Wege, wie Einzelpersonen im Kampf gegen die globale Erwärmung aktiv werden können. Neun bewusst einfache, fast ironische Lösungen zeigen, wie man einen Beitrag leisten kann, indem man einfach „faul“ ist. Das Plakat wurde im Museum für angewandte Kunst (MAK) in Wien ausgestellt."
    },
    carousel: [
      "/lazy.webp",
      "/lazy-piktogramm1.webp",
      "/lazy-piktogramm2.webp",
      "/lazy-piktogramm3.webp",
      "/lazy2.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/lazy.webp" },
        { type: '16:9', url: "/lazy1.webp" }
      ],
      [
        { type: '4:5', url: "/lazy-piktogramm1.webp" },
        { type: '4:5', url: "/lazy-piktogramm2.webp" },
        { type: '4:5', url: "/lazy-piktogramm3.webp" }
      ]
    ]
  },
  {
    id: 'p14',
    slug: 'forum-stadtpark',
    title: 'forum stadtpark',
    category: 'branding',
    description: {
      en: "As part of our final-year project at the College of Graphic and Communication Design at the Graphische in Vienna, Matthäus Jandl, Markus Leb and I developed a rebranding proposal for the Forum Stadtpark in Graz. The logo is based on the venue’s seven programme areas and is versatile by changing depending on the event. This resulted in a playful, flexible visual system that works equally well for printed materials and for the wayfinding system within the building.",
      de: "Im Rahmen unseres Diplomprojekts am Kolleg für Grafik- und Kommunikationsdesign an der Graphischen in Wien haben Matthäus Jandl, Markus Leb und ich einen Rebranding-Vorschlag für das Forum Stadtpark in Graz entwickelt. Das Logo basiert auf den sieben Programmbereichen des Hauses und ist wandelbar, je nach Veranstaltung. So entstand ein spielerisches, flexibles visuelles System, das für Drucksorten ebenso gut funktioniert wie für das Leitsystem im Gebäude."
    },
    carousel: [
      "/forum-icon.webp",
      "/forum-plakat.webp",
      "/forum-versionen.webp",
      "/forum-orientierung-4x5.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/forum-plakat.webp" },
        { type: '16:9', url: "/forum-versionen1.webp" }
      ],
      [
        { type: '16:9', url: "/forum-orientierung.webp" },
        { type: '5', url: "/forum-orientierung1.webp" }
      ],
      [
        { type: '16:9', url: "/forum-website.webp" },
        { type: '5', url: "/forum-haus.webp" }
      ]
    ]
  },
  {
    id: 'p15',
    slug: 'mentale-notfaelle',
    title: 'mentale notfälle',
    category: 'posters',
    description: {
      en: "In Austria, almost one in four young people now suffers from significant mental health issues. The proposed poster design for “Rat auf Draht” deliberately places the helpline number 147 on a par with 122, 133 and 144, to highlight the fact that mental health crises are just as real and urgent as other emergencies.",
      de: "In Österreich leidet mittlerweile fast jeder vierte Jugendliche an ernsthaften psychischen Problemen. Der Plakatentwurf für „Rat auf Draht“ stellt die Notrufnummer 147 bewusst auf eine Stufe mit 122, 133 und 144, um zu unterstreichen, dass psychische Krisen genauso real und akut sind wie andere Notfälle."
    },
    carousel: [
      "/147-mockup.webp",
      "/147-sticker.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/147-sticker.webp" },
        { type: '16:9', url: "/147-mockup1.webp" }
      ]
    ]
  },
  {
    id: 'p16',
    slug: 'sailor-gin',
    title: 'sailor gin',
    category: 'packaging',
    description: {
      en: "A packaging concept for gin was developed for a design competition organised by Etivera. Inspired by the history of gin as a popular drink amongst the British Navy in the 18th century, the bottle itself was transformed into a sailor. A narrative-driven design with high brand recognition.",
      de: "Für einen von Etivera organisierten Designwettbewerb wurde ein Verpackungskonzept für Gin entwickelt. Inspiriert von der Geschichte des Gins als beliebtes Getränk der britischen Marine im 18. Jahrhundert, wurde die Flasche selbst in einen Seemann verwandelt. Ein narratives Design mit hohem Wiedererkennungswert."
    },
    carousel: [
      "/sailor-gin-animation.mp4",
      "/sailor-gin-mockup1.webp",
    ], 
    details: [
      [
        { type: '4:5', url: "/sailor-gin-animation.mp4" },
        { type: '16:9', url: "/sailor-gin-mockup.webp" }
      ]
    ]
  },
  {
    id: 'p17',
    slug: 'gastvortrag-plakat',
    title: 'gastvortrag plakat',
    category: 'posters',
    description: {
      en: "Design of the poster for the guest lecture by Studio Beton, Bruch and Es at the Klasse für Ideen.",
      de: "Gestaltung des Plakats für den Gastvortrag von Studio Beton, Bruch und Es an der Klasse für Ideen."
    },
    carousel: [
      "/gastvortrag-plakat.webp",
      "/gastvortrag.webp",
      "/gastvortrag-snacks.mp4",
      "/gastvortrag-gang.webp",
      
    ], 
    details: [
      [
        { type: '4:5', url: "/gastvortrag-plakat.webp" },
        { type: '4:5', url: "/gastvortrag-gang.webp" },
        { type: '4:5', url: "/gastvortrag-snacks.mp4" }
      ]
    ]
  },
  {
    id: 'p18',
    slug: 'be-nice-get-nice',
    title: 'be-nice, get nice',
    category: 'illustration',
    description: {
      en: "An animation on the theme of happiness and how it can be passed on.",
      de: "Eine Animation zum Thema Glück und wie es weitergegeben werden kann."
    },
    carousel: [
      "/pendel-animation.mp4",
    ], 
    details: [
      [
        { type: '4:5', url: "/pendel-animation.mp4" },
        { type: '16:9', url: "/pendel.webp" }
      ],
    ]
  },
  {
    id: 'p19',
    slug: 'demok-raum-fuer-demokratie',
    title: 'demok - raum für demokratie',
    category: 'branding',
    description: {
      en: "This proposed branding for the “Raum für Demokratie” (Space for Democracy) at the Academy of Fine Arts Vienna was developed as part of the “Klasse für Ideen” initiative. The project is conceived as a space for socio-political exchange, bringing together formats such as talks, workshops and debates, and serving as a reminder that democracy cannot be taken for granted, but must be actively valued and protected. The visual concept is based on a dynamic system in which the respective medium, ranging from A1 posters to social media screens, always functions as a floor plan of the space. Black circles symbolise people; their arrangement generates the layout and makes the respective event format immediately recognisable. As a defining key visual, the circle also carries over into the physical identity of the space and is reflected in round seat cushions, speaking cards and name badges.",
      de: "Dieser Branding-Vorschlag für den „Raum für Demokratie“ an der Akademie der bildenden Künste Wien wurde im Rahmen der „Klasse für Ideen“ entwickelt. Das Projekt versteht sich als Raum für gesellschaftspolitischen Austausch, der Formate wie Vorträge, Workshops und Debatten zusammenbringt und erinnert daran, dass Demokratie keine Selbstverständlichkeit ist, sondern aktiv geschätzt und geschützt werden muss. Das visuelle Konzept basiert auf einem dynamischen System, bei dem das jeweilige Medium – vom A1-Plakat bis zum Social-Media-Screen – immer als Grundriss des Raumes fungiert. Schwarze Kreise symbolisieren Menschen; ihre Anordnung generiert das Layout und macht das jeweilige Veranstaltungsformat sofort erkennbar. Als prägendes Schlüsselbild überträgt sich der Kreis auch in die physische Identität des Raumes und findet sich in runden Sitzkissen, Sprechkarten und Namensschildern wieder."
    },
    carousel: [
      "/demok-discussions.mp4",
      "/demok-talks.mp4",
      "/demok-workshops.mp4",
    ], 
    details: [
        [
        { type: '16:9', url: "/demok-animationen.mp4" }
      ],
      [
        { type: '4:5', url: "/demok-polster.webp" },
        { type: '16:9', url: "/demok-eingang.webp" }
      ],
        [
        { type: '16:9', url: "/demok-drinnen.webp" },
        { type: '4:5', url: "/demok-draussen.webp" }
      ],
      [
        { type: '16:9', url: "/demok-plakate.webp" }
      ],
        [
        { type: '16:9', url: "/demok-shirt.webp" },
        { type: '4:5', url: "/demok-ball.webp" }
      ]
    ]
  },
];

// --- KOMPONENTEN ---

// 1. Das interaktive Karussell für das Grid
const ProjectCarousel = ({ project, onClick, id }) => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction, e) => {
    e.stopPropagation();
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.floor((scrollLeft + width * 0.5) / width);
      setCurrentIndex(index);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div id={id} className="flex flex-col smooth-appear">
      <div 
        className="relative w-full aspect-[4/5] bg-white overflow-hidden group cursor-pointer rounded-xl"
        onClick={() => onClick(project)}
      >
        <div 
          ref={scrollRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        >
          {project.carousel.map((imgUrl, idx) => (
            <div key={idx} className="min-w-full h-full snap-center relative">
              <MediaItem url={imgUrl} alt={`${project.title} - media ${idx + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {project.carousel.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="bg-black/30 backdrop-blur-sm rounded-full px-2 py-1.5 flex gap-1.5">
              {project.carousel.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-[5px] h-[5px] rounded-full bg-white transition-opacity duration-300 ${idx === currentIndex ? 'opacity-100' : 'opacity-40'}`}
                />
              ))}
            </div>
          </div>
        )}

        {project.carousel.length > 1 && (
          <>
            <button 
              onClick={(e) => scroll('left', e)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 hidden md:flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            
            <button 
              onClick={(e) => scroll('right', e)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 hidden md:flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
      
      <div 
        className="md:hidden mt-3 text-left cursor-pointer px-1" 
        onClick={() => onClick(project)}
      >
        <h3 className="text-black text-sm font-medium tracking-wide">{project.title}</h3>
      </div>
    </div>
  );
};

// 2. Das schwebende Menü
const FloatingMenu = ({ onGoHome, onViewChange, onCategorySelect, language, setLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const handleHomeClick = () => {
    onGoHome();
    setIsOpen(false);
  };

  const handleNavClick = (view) => {
    if (onViewChange) onViewChange(view);
    setIsOpen(false);
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) onCategorySelect(category);
    setIsOpen(false);
  };

  const t = {
    categories: language === 'de' ? 'projektkategorien' : 'project categories',
    all: language === 'de' ? 'alle projekte' : 'all projects',
    posters: language === 'de' ? 'plakate' : 'posters',
    branding: language === 'de' ? 'branding' : 'branding',
    illustrations: language === 'de' ? 'illustrationen' : 'illustrations',
    packaging: language === 'de' ? 'verpackungsdesign' : 'packaging',
    services: language === 'de' ? 'leistungen' : 'services',
    about: language === 'de' ? 'über mich' : 'about me',
    contact: language === 'de' ? 'kontakt' : 'contact',
    imprint: language === 'de' ? 'impressum & datenschutz' : 'imprint & privacy policy',
  };

  return (
    // HIER GEÄNDERT: "select-none" macht das Menü immun gegen jegliche Cursor-Markierungen
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[273px] select-none">
      <div className="bg-black/30 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-500 ease-in-out rounded-[20px] text-white">
        
        <div 
          className="flex items-center justify-between px-6 h-[40px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* HIER GEÄNDERT: Vom klickbaren <div> zu einem echten <button>. */}
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleHomeClick();
            }}
            className="font-normal text-base tracking-wide hover:text-white/70 transition-colors h-full flex items-center bg-transparent border-none p-0 focus:outline-none"
          >
            lukas liszka
          </button>
          
          <div className="text-white h-full flex items-center justify-center transition-transform">
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </div>
        </div>

        <div 
          className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-6 pt-10 flex flex-col gap-4">
            
            <div className="flex flex-col">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCategoriesOpen(!categoriesOpen);
                }}
                className="flex items-center justify-between text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none"
              >
                {t.categories}
                <ChevronDown size={18} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-3 pl-4 ${categoriesOpen ? 'max-h-72 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                <button onClick={() => handleCategoryClick(null)} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">{t.all}</button>
                <button onClick={() => handleCategoryClick('posters')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">{t.posters}</button>
                <button onClick={() => handleCategoryClick('branding')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">{t.branding}</button>
                <button onClick={() => handleCategoryClick('illustrations')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">{t.illustrations}</button>
                <button onClick={() => handleCategoryClick('packaging')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">{t.packaging}</button>
              </div>
            </div>

            <button onClick={() => handleNavClick('services')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">{t.services}</button>
            <button onClick={() => handleNavClick('about')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">{t.about}</button>
            <button onClick={() => handleNavClick('contact')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">{t.contact}</button>
            <button onClick={() => handleNavClick('imprint')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">{t.imprint}</button>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); setLanguage('de'); }}
                className={`w-9 h-9 rounded-full border border-white text-xs font-medium flex items-center justify-center transition-colors focus:outline-none ${language === 'de' ? 'bg-white text-black/80' : 'bg-transparent text-white hover:bg-white/20'}`}
              >
                DE
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setLanguage('en'); }}
                className={`w-9 h-9 rounded-full border border-white text-xs font-medium flex items-center justify-center transition-colors focus:outline-none ${language === 'en' ? 'bg-white text-black/80' : 'bg-transparent text-white hover:bg-white/20'}`}
              >
                EN
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Projekt Detailseite - FULL WIDTH GRID
const ProjectView = ({ project, language }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
  }, [project]);

  return (
    <div className="min-h-screen pb-2 pt-24">
      <div className="px-4 md:px-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-snug max-w-2xl">
          {project.description[language]}
        </p>
      </div>

      <div className="px-2 flex flex-col gap-2 w-full">
        {project.details.map((rowOrItem, idx) => {
          const row = Array.isArray(rowOrItem) ? rowOrItem : [rowOrItem];

          return (
            <div key={idx} className="flex flex-col md:flex-row gap-2 w-full">
              {row.map((media, colIdx) => {
                const flexValue = media.type === '16:9' ? 1.777 : media.type === '4:5' ? 0.8 : 1;
                const ratioValue = media.type === '16:9' ? '16/9' : media.type === '4:5' ? '4/5' : '1/1';

                return (
                  <div 
                    key={colIdx} 
                    className="w-full relative overflow-hidden rounded-xl flex-editorial"
                    style={{
                      '--desktop-flex': flexValue,
                      aspectRatio: ratioValue
                    }}
                  >
                    <MediaItem 
                      url={media.url} 
                      alt={`${project.title} detail ${idx}-${colIdx}`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      isPriority={true} 
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// 4. About Seite
const AboutPage = ({ language }) => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  
  const t = {
    title: language === 'de' ? 'über mich' : 'about me',
    aboutMe: language === 'de' ? 'profil' : 'profile',
    aboutText: language === 'de' 
      ? 'Für mich steht eine klare und verständliche Idee immer im Vordergrund. Mit einer starken Idee eröffnen sich jedes Mal neue Wege, die es Spaß macht zu entdecken. Mein Fokus liegt darin, Themen visuell auf das notwendigste runterzukochen und zeitlose Designs zu gestalten.' 
      : 'For me, a clear and understandable concept is always the top priority. A strong concept always opens up new possibilities that are a joy to explore. My focus is on distilling themes visually down to their bare essentials and creating timeless designs.',
    exp: language === 'de' ? 'erfahrung' : 'experience',
    edu: language === 'de' ? 'ausbildung' : 'education',
    now: language === 'de' ? 'Jetzt' : 'Now',
    exp1: language === 'de' ? <>Freiberuflicher Grafikdesigner<br />Wien, Österreich</> : <>Freelance Graphic Designer<br />Vienna, Austria</>,
    exp2: language === 'de' ? <>Art Director bei Thies Design<br />Wien, Österreich</> : <>Art Director at Thies Design<br />Vienna, Austria</>,
    edu1: language === 'de' ? <>Universität für angewandte Kunst Wien<br />Kommunikationsdesign an der „Klasse für Ideen“</> : <>University of Applied Arts Vienna<br />Communication Design at the “Klasse für Ideen”</>,
    edu2: language === 'de' ? <>Meisterklasse Kommunikationsdesign<br />Die Graphische Wien</> : <>Graphische Wien<br />Meisterklasse for Communication Design</>,
    edu3: language === 'de' ? <>Kolleg Grafik- und Kommunikationsdesign<br />Die Graphische Wien</> : <>Graphische Wien<br />College Graphic and Communication Design</>,
  };

  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-5xl w-full mb-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-8 items-start">
          
          <div className="md:col-start-6 md:col-span-7">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
              {t.title}
            </h1>
          </div>

          <div className="md:col-start-1 md:col-span-5 w-full shrink-0 aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-sm">
            <MediaItem url="/profilbild.webp" alt="portrait lukas liszka" className="w-full h-full object-cover" isPriority={true} />
          </div>
          
          <div className="md:col-start-6 md:col-span-7 flex flex-col gap-10 md:gap-12">
            
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.aboutMe}</h2>
              <p className="text-lg text-gray-700 leading-snug">
                {t.aboutText}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-4">{t.exp}</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-[85px_1fr] md:grid-cols-[110px_1fr] gap-2 md:gap-4">
                  <span className="text-lg text-gray-700">2021 - {t.now}</span>
                  <span className="text-lg text-gray-700 leading-snug">{t.exp1}</span>
                </div>
                <div className="grid grid-cols-[85px_1fr] md:grid-cols-[110px_1fr] gap-2 md:gap-4">
                  <span className="text-lg text-gray-700">2023 - {t.now}</span>
                  <span className="text-lg text-gray-700 leading-snug">{t.exp2}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-4">{t.edu}</h2>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-[85px_1fr] md:grid-cols-[110px_1fr] gap-2 md:gap-4">
                  <span className="text-lg text-gray-700">2023 - {t.now}</span>
                  <span className="text-lg text-gray-700 leading-snug">{t.edu1}</span>
                </div>
                <div className="grid grid-cols-[85px_1fr] md:grid-cols-[110px_1fr] gap-2 md:gap-4">
                  <span className="text-lg text-gray-700">2022 - 2023</span>
                  <span className="text-lg text-gray-700 leading-snug">{t.edu2}</span>
                </div>
                <div className="grid grid-cols-[85px_1fr] md:grid-cols-[110px_1fr] gap-2 md:gap-4">
                  <span className="text-lg text-gray-700">2020 - 2022</span>
                  <span className="text-lg text-gray-700 leading-snug">{t.edu3}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Services Seite
const ServicesPage = ({ language }) => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  
  const t = {
    title: language === 'de' ? 'leistungen' : 'services',
    h1: language === 'de' ? 'art direktion' : 'art direction',
    p1: language === 'de' ? "Entwicklung einzigartiger visueller Konzepte und strategischer Designlösungen, zugeschnitten auf die Kernidentität deiner Marke. Führung der Bildsprache vom Konzept bis zur finalen Umsetzung." : "Crafting unique visual concepts and strategic design solutions tailored to your brand's core identity. Guiding the visual language from concept to final execution.",
    h2: language === 'de' ? 'branding & identität' : 'branding & identity',
    p2: language === 'de' ? "Vom Logodesign bis zu umfassenden Markenrichtlinien – Gestaltung kohärenter und einprägsamer Markenerlebnisse, die bei der Zielgruppe auf allen Kanälen Resonanz finden." : "From logo design to comprehensive brand guidelines, creating cohesive and memorable brand experiences that resonate with your target audience across all channels.",
    h3: language === 'de' ? 'editorial design' : 'editorial design',
    p3: language === 'de' ? "Layout und Satz für Bücher, Magazine und digitale Publikationen. Starker Fokus auf Typografie und Rastersysteme, um optimale Lesbarkeit und Ästhetik zu gewährleisten." : "Layout and typesetting for books, magazines, and digital publications. A strong focus on typography and grid systems to ensure optimal readability and aesthetic appeal.",
    h4: language === 'de' ? 'ui/ux design' : 'ui/ux design',
    p4: language === 'de' ? "Gestaltung intuitiver und ästhetisch ansprechender digitaler Benutzeroberflächen. Die Brücke zwischen funktionaler User Experience und zeitgemäßem visuellen Design." : "Designing intuitive and aesthetically pleasing digital interfaces. Bridging the gap between functional user experience and contemporary visual design.",
    h5: language === 'de' ? 'verpackungsdesign' : 'packaging design',
    p5: language === 'de' ? "Entwicklung physischer Verpackungskonzepte, die im Regal auffallen. Fokus auf nachhaltige Materialien, strukturelle Integrität und aufmerksamkeitsstarke Grafiken." : "Developing physical packaging concepts that stand out on the shelf. Focusing on sustainable materials, structural integrity, and eye-catching graphics.",
  };

  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <div className="flex items-start gap-6 mb-12">
          <div className="w-8 shrink-0"></div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            {t.title}
          </h1>
        </div>
        <div className="flex flex-col gap-12">
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.h1}</h2>
              <p className="text-lg text-gray-700 leading-snug">{t.p1}</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.h2}</h2>
              <p className="text-lg text-gray-700 leading-snug">{t.p2}</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.h3}</h2>
              <p className="text-lg text-gray-700 leading-snug">{t.p3}</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.h4}</h2>
              <p className="text-lg text-gray-700 leading-snug">{t.p4}</p>
            </div>
          </div>
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.h5}</h2>
              <p className="text-lg text-gray-700 leading-snug">{t.p5}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Contact Seite
const ContactPage = ({ language }) => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  
  const [status, setStatus] = useState(''); 

  const t = {
    title: language === 'de' ? 'kontakt aufnehmen' : 'get in touch',
    inquiries: language === 'de' ? 'projektanfragen' : 'project inquiries',
    subtitle: language === 'de' ? 'Hast du ein Projekt im Kopf oder möchtest einfach Hallo sagen? Schreib mir eine Nachricht.' : 'Have a project in mind or just want to say hi? Drop me a line.',
    name: language === 'de' ? 'name' : 'name',
    namePl: language === 'de' ? 'Dein Name' : 'Your name',
    email: language === 'de' ? 'e-mail' : 'email',
    emailPl: language === 'de' ? 'deine@email.com' : 'your@email.com',
    message: language === 'de' ? 'nachricht' : 'message',
    messagePl: language === 'de' ? 'Wie kann ich dir helfen?' : 'How can I help you?',
    error: language === 'de' ? 'Hoppla, etwas ist schiefgelaufen. Bitte versuche es später noch einmal.' : 'Oops, something went wrong. Please try again later.',
    sending: language === 'de' ? 'wird gesendet...' : 'sending...',
    submit: language === 'de' ? 'absenden' : 'submit',
    thankYou: language === 'de' ? 'danke dir!' : 'thank you!',
    successMsg: language === 'de' ? <>Deine Nachricht wurde erfolgreich verschickt.<br />Ich melde mich so schnell wie möglich bei dir.</> : <>Your message has been sent successfully.<br />I’ll get back to you as soon as possible.</>
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const form = e.target;
    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/xnpapgop', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        
        {status === 'success' ? (
          <div className="smooth-appear text-center mt-24">
            <h2 className="text-lg font-medium text-black mb-1">{t.thankYou}</h2>
            <p className="text-lg text-gray-700 leading-snug">
              {t.successMsg}
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
              {t.title}
            </h1>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">{t.inquiries}</h2>
              <p className="text-lg text-gray-700 leading-snug mb-10">
                {t.subtitle}
              </p>
            </div>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-lg font-medium text-black pl-1">{t.name}</label>
                <input type="text" id="name" name="name" required className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" placeholder={t.namePl} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-lg font-medium text-black pl-1">{t.email}</label>
                <input type="email" id="email" name="email" required className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" placeholder={t.emailPl} />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="request" className="text-lg font-medium text-black pl-1">{t.message}</label>
                <textarea id="request" name="message" required rows="5" className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none text-lg" placeholder={t.messagePl}></textarea>
              </div>
              
              {status === 'error' && (
                <p className="text-red-500 text-base">{t.error}</p>
              )}

              <button 
                type="submit" 
                disabled={status === 'loading'}
                className="self-start border border-black bg-transparent hover:bg-black text-black hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 mt-2 text-lg disabled:opacity-50"
              >
                {status === 'loading' ? t.sending : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

// 7. Imprint & Privacy Policy Seite
const ImprintPage = ({ language }) => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 

  const t = {
    title: language === 'de' ? 'impressum & datenschutz' : 'imprint & privacy policy',
    imprint: language === 'de' ? 'impressum' : 'imprint',
    imprintText: language === 'de' 
      ? 'Informationspflicht laut § 5 ECG und Offenlegungspflicht laut § 25 Medieng.' 
      : 'Information according to § 5 ECG and disclosure according to § 25 Medieng.',
    provider: language === 'de' ? 'diensteanbieter, medieninhaber und herausgeber:' : 'service provider, media owner and publisher:',
    contact: language === 'de' ? 'kontakt:' : 'contact:',
    legal: language === 'de' ? 'rechtliche informationen:' : 'legal information:',

    purpose: language === 'de' ? 'Unternehmensgegenstand: Grafikdesign' : 'Business purpose: Graphic Design',
    chamber: language === 'de' ? 'Mitglied der WKO:' : 'Member of WKO:',
    law: language === 'de' ? 'Anwendbare Rechtsvorschriften: Gewerbeordnung (www.ris.bka.gv.at)' : 'Applicable legal regulations: Gewerbeordnung (www.ris.bka.gv.at)',
    auth: language === 'de' ? 'Aufsichtsbehörde/Gewerbebehörde:' : 'Supervisory authority/trade authority:',
    job: language === 'de' ? 'Berufsbezeichnung: Grafikdesigner' : 'Job title: Graphic Designer',
    copyrightTitle: language === 'de' ? 'urheberrecht' : 'copyright',
    copyrightText: language === 'de' 
      ? 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem österreichischen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht-kommerziellen Gebrauch gestattet.'
      : 'The content and works created by the site operators on these pages are subject to Austrian copyright law. The reproduction, editing, distribution, and any kind of exploitation outside the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use.',
    
    disclaimerTitle: language === 'de' ? 'haftungsausschluss' : 'disclaimer',
    disclaimerText: language === 'de'
      ? 'Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.'
      : 'The contents of this website were created with great care. However, we cannot accept any liability for the accuracy, completeness, and timeliness of the content. Our website contains links to external third-party websites over whose contents we have no influence. Therefore, we cannot accept any liability for these external contents.',
    
    privacyTitle: language === 'de' ? 'datenschutzerklärung' : 'privacy policy',
    privacy1Title: language === 'de' ? '1. allgemeine hinweise' : '1. general information',
    privacy1Text: language === 'de'
      ? 'Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit deinen personenbezogenen Daten passiert, wenn du diese Website besuchst. Personenbezogene Daten sind alle Daten, mit denen du persönlich identifiziert werden kannst.'
      : 'The following notes provide a simple overview of what happens to your personal data when you visit this website. Personal data is any data with which you could be personally identified.',
    
    privacy2Title: language === 'de' ? '2. verantwortlicher' : '2. controller',
    privacy2Text: language === 'de'
      ? 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:'
      : 'The controller responsible for data processing on this website is:',
      
    privacy3Title: language === 'de' ? '3. datenerfassung (server-log-dateien)' : '3. data collection (server log files)',
    privacy3Text: language === 'de'
      ? 'Der Provider dieser Website erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die dein Browser automatisch an uns übermittelt. Dies sind: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage und IP-Adresse. Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen. Die Erfassung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO. Der Betreiber der Website hat ein berechtigtes Interesse an der technisch fehlerfreien Darstellung und der Optimierung seiner Website – hierzu müssen die Server-Log-Files erfasst werden.'
      : 'The provider of this website automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. These are: browser type and browser version, operating system used, referrer URL, host name of the accessing computer, time of the server request, and IP address. This data is not combined with other data sources. The collection of this data is based on Art. 6(1)(f) GDPR. The website operator has a legitimate interest in the technically error-free presentation and optimization of the website – for this purpose, the server log files must be recorded.',
      
    privacy4Title: language === 'de' ? '4. kontaktaufnahme' : '4. contacting us',
    privacy4Text: language === 'de'
      ? 'Wenn du mir per Kontaktformular oder E-Mail Anfragen zukommen lässt, werden deine Angaben aus dem Anfrageformular inklusive der von dir dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei mir gespeichert. Diese Daten gebe ich nicht ohne deine Einwilligung weiter.'
      : 'If you send inquiries via the contact form or e-mail, your details from the inquiry form, including the contact details you provided there, will be stored by me for the purpose of processing the inquiry and in case of follow-up questions. I do not pass on this data without your consent.',
      
    privacy5Title: language === 'de' ? '5. deine rechte' : '5. your rights',
    privacy5Text: language === 'de'
      ? 'Du hast jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck deiner gespeicherten personenbezogenen Daten zu erhalten. Du hast außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn du eine Einwilligung zur Datenverarbeitung erteilt hast, kannst du diese Einwilligung jederzeit für die Zukunft widerrufen. Des Weiteren steht dir ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.'
      : 'You have the right to receive information about the origin, recipient, and purpose of your stored personal data at any time free of charge. You also have the right to request the correction or deletion of this data. If you have given your consent to data processing, you can revoke this consent at any time for the future. Furthermore, you have the right to lodge a complaint with the competent supervisory authority.'
  };

  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-16">
          {t.title}
        </h1>
        
        <div className="space-y-16">
          {/* IMPRESSUM / IMPRINT */}
          <section className="flex flex-col gap-8">
            <h2 className="text-2xl font-medium text-black border-b border-black/10 pb-2">
              {t.imprint}
            </h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-lg text-gray-700 leading-snug">{t.imprintText}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.provider}</h3>
                <p className="text-lg text-gray-700 leading-snug">
                  Lukas Liszka<br />
                  Bruno-Marek-Allee 13<br />
                  1020 Vienna, Austria
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.contact}</h3>
                <p className="text-lg text-gray-700 leading-snug">
                  Email: liszka.lukas@gmx.at<br />
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.legal}</h3>
                <p className="text-lg text-gray-700 leading-snug">
                  {t.purpose}<br />
                  {t.chamber} WKO Wien, Fachgruppe Werbung und Marktkommunikation<br />
                  {t.law}<br />
                  {t.auth} Magistratisches Bezirksamt des 2. Bezirkes<br />
                  {t.job}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.copyrightTitle}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.copyrightText}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.disclaimerTitle}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.disclaimerText}</p>
              </div>
            </div>
          </section>

          {/* DATENSCHUTZ / PRIVACY POLICY */}
          <section className="flex flex-col gap-8">
            <h2 className="text-2xl font-medium text-black border-b border-black/10 pb-2">
              {t.privacyTitle}
            </h2>
            
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.privacy1Title}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.privacy1Text}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.privacy2Title}</h3>
                <p className="text-lg text-gray-700 leading-snug">
                  {t.privacy2Text}<br /><br />
                  Lukas Liszka<br />
                  Bruno-Marek-allee 13<br />
                  1020 Vienna, Austria<br />
                  Email: liszka.lukas@gmx.at
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.privacy3Title}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.privacy3Text}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.privacy4Title}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.privacy4Text}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-black mb-1">{t.privacy5Title}</h3>
                <p className="text-lg text-gray-700 leading-snug">{t.privacy5Text}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


// --- HAUPT APP (Klassisches Grid ohne Infinite Scroll) ---
export default function PortfolioApp() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [language, setLanguage] = useState('de');

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  let currentView = 'home';
  let activeProject = null;
  let activeCategory = null;

  if (hash.startsWith('#project=')) {
    const projectSlug = hash.replace('#project=', '');
    activeProject = initialProjects.find(p => p.slug === projectSlug) || null;
  } else if (hash.startsWith('#view=')) {
    currentView = hash.replace('#view=', '');
  } else if (hash.startsWith('#category=')) {
    activeCategory = hash.replace('#category=', '');
  }

  const handleGoHome = () => { window.location.hash = ''; };
  const handleCategorySelect = (category) => { window.location.hash = category ? `#category=${category}` : ''; };
  const handleViewChange = (view) => { window.location.hash = `#view=${view}`; };
  const handleProjectClick = (project) => { window.location.hash = `#project=${project.slug}`; };

  const baseProjects = activeCategory 
    ? initialProjects.filter(p => p.category === activeCategory)
    : initialProjects;

  // Scrollt beim Wechsel der Ansicht ganz sanft nach oben
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
  }, [currentView, activeProject, activeCategory]);

  return (
    <div className="bg-gray-200 min-h-screen text-black selection:bg-black selection:text-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        
        html, body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
        html { scroll-behavior: smooth; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes fadeInSmooth {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .smooth-appear {
          animation: fadeInSmooth 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        @media (min-width: 768px) {
          .flex-editorial {
            flex: var(--desktop-flex) 1 0% !important;
          }
        }
      `}</style>

      <FloatingMenu 
        onGoHome={handleGoHome} 
        onViewChange={handleViewChange} 
        onCategorySelect={handleCategorySelect}
        language={language}
        setLanguage={setLanguage}
      />

      {activeProject ? (
        <ProjectView project={activeProject} language={language} />
      ) : currentView === 'about' ? (
        <AboutPage language={language} />
      ) : currentView === 'contact' ? (
        <ContactPage language={language} />
      ) : currentView === 'services' ? (
        <ServicesPage language={language} />
      ) : currentView === 'imprint' ? (
        <ImprintPage language={language} />
      ) : (
        <main className="p-2 md:pt-32 md:pb-2">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-2">
            {baseProjects.map((project, idx) => (
              <ProjectCarousel 
                key={project.id} 
                id={`item-${idx}`} 
                project={project} 
                onClick={handleProjectClick} 
              />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
