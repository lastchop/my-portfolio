import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// --- HELPER TO RENDER IMAGES OR VIDEOS AUTOMATICALLY ---
const renderMedia = (url, alt, className) => {
  const isVideo = url.toLowerCase().endsWith('.mp4') || url.includes('.mp4');
  if (isVideo) {
    return (
      <video 
        src={url} 
        className={`${className} object-cover`}
        autoPlay 
        loop 
        muted 
        playsInline 
      />
    );
  }
  return (
    <img 
      src={url} 
      alt={alt} 
      className={className} 
      loading="lazy" 
    />
  );
};

// --- MOCK DATA ---
const placeholderDescription = "this project explores the boundaries between analog texture and digital precision. the goal was to develop a visual language that works seamlessly on both physical posters and in immersive online experiences. the color palette was deliberately reduced to draw focus to the shapes and strong typography.";

const initialProjects = [
  {
    id: 'p1',
    slug: 'nein-zum-lobautunnel', // <--- NEU: Der saubere Name für die URL
    title: 'nein zum lobautunnel',
    category: 'posters',
    description: placeholderDescription,
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
    id: 'p2',
    slug: 'niemann-plakat',
    title: 'niemann plakat',
    category: 'posters',
    description: placeholderDescription,
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
    id: 'p3',
    slug: 'waehlengehen',
    title: 'wählengehen',
    category: 'illustrations',
    description: placeholderDescription,
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
    slug: 'sailor-gin',
    title: 'sailor gin',
    category: 'packaging',
    description: placeholderDescription,
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
    id: 'p5',
    slug: 'traeubchen',
    title: 'träubchen',
    category: 'packaging',
    description: placeholderDescription,
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
    description: placeholderDescription,
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
    description: placeholderDescription,
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
    description: placeholderDescription,
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
    title: 'alumnivortrag “on digressing” ',
    category: 'posters',
    description: placeholderDescription,
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
    slug: 'forum-stadtpark',
    title: 'forum stadtpark',
    category: 'branding',
    description: placeholderDescription,
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
    id: 'p11',
    slug: 'burnout',
    title: 'burnout',
    category: 'illustrations',
    description: placeholderDescription,
    carousel: [
      "/burnout.mp4",
    ], 
    details: [
      [
        { type: '4:5', url: "/burnout.mp4" },
        { type: '16:9', url: "/" }
      ]
    ]
  },
  {
    id: 'p12',
    slug: 'ma15-kalender',
    title: 'ma15 kalender',
    category: 'illustrations',
    description: placeholderDescription,
    carousel: [
      "/ma15.webp",
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
    id: 'p13',
    slug: 'lazy-ways',
    title: 'lazy ways to help our planet',
    category: 'posters',
    description: placeholderDescription,
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
    slug: 'gleisig',
    title: 'glleisig',
    category: 'branding',
    description: placeholderDescription,
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
    id: 'p15',
    slug: 'mentale-notfaelle',
    title: 'mentale notfälle',
    category: 'posters',
    description: placeholderDescription,
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
    slug: 'wunderlich-christmas-planner',
    title: 'wunderlich christmas planner',
    category: 'branding',
    description: placeholderDescription,
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
    id: 'p17',
    slug: 'gastvortrag-plakat',
    title: 'Gastvortrag Plakat',
    category: 'posters',
    description: placeholderDescription,
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
    title: 'be nice, get nice',
    category: 'illustration',
    description: placeholderDescription,
    carousel: [
      "/pendel-animation.mp4",
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
    id: 'p19',
    slug: 'demok-raum-fuer-demokratie',
    title: 'demok - Raum für Demokratie',
    category: 'branding',
    description: placeholderDescription,
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
              {renderMedia(imgUrl, `${project.title} - media ${idx + 1}`, "w-full h-full object-cover")}
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
const FloatingMenu = ({ onGoHome, onViewChange, onCategorySelect }) => {
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

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[273px]">
      <div className="bg-black/30 backdrop-blur-md shadow-xl overflow-hidden transition-all duration-500 ease-in-out rounded-[20px] text-white">
        
        <div 
          className="flex items-center justify-between px-6 h-[40px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div 
            onClick={(e) => {
              e.stopPropagation();
              handleHomeClick();
            }}
            className="font-normal text-base tracking-wide hover:text-white/70 transition-colors h-full flex items-center"
          >
            lukas liszka
          </div>
          
          <div className="text-white h-full flex items-center justify-center transition-transform">
            {isOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </div>
        </div>

        <div 
          className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'}`}
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
                project categories
                <ChevronDown size={18} className={`transition-transform duration-300 ${categoriesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 flex flex-col gap-3 pl-4 ${categoriesOpen ? 'max-h-72 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                <button onClick={() => handleCategoryClick(null)} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">all projects</button>
                <button onClick={() => handleCategoryClick('posters')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">posters</button>
                <button onClick={() => handleCategoryClick('branding')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">branding</button>
                <button onClick={() => handleCategoryClick('illustrations')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">illustrations</button>
                <button onClick={() => handleCategoryClick('packaging')} className="text-left text-white/70 hover:text-white text-sm tracking-wide focus:outline-none font-normal">packaging</button>
              </div>
            </div>

            <button onClick={() => handleNavClick('services')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">services</button>
            <button onClick={() => handleNavClick('about')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">about</button>
            <button onClick={() => handleNavClick('contact')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">contact</button>
            <button onClick={() => handleNavClick('imprint')} className="text-left text-base hover:text-white/70 transition-colors py-1 font-normal focus:outline-none">imprint & privacy policy</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. Projekt Detailseite - FULL WIDTH GRID
const ProjectView = ({ project }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
  }, [project]);

  return (
    // HIER GEÄNDERT: "pt-20" wurde zu "pt-24" (der perfekte Sweet Spot)
    <div className="min-h-screen pb-2 pt-24">
      <div className="px-4 md:px-6 mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-snug max-w-2xl">
          {project.description}
        </p>
      </div>

      <div className="px-2 flex flex-col gap-6 md:gap-2 w-full">
        {project.details.map((rowOrItem, idx) => {
          const row = Array.isArray(rowOrItem) ? rowOrItem : [rowOrItem];

          return (
            <div key={idx} className="flex flex-col md:flex-row gap-6 md:gap-2 w-full">
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
                    {renderMedia(
                      media.url, 
                      `${project.title} detail ${idx}-${colIdx}`, 
                      "absolute inset-0 w-full h-full object-cover" 
                    )}
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
const AboutPage = () => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-5xl w-full mb-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-8 items-start">
          
          <div className="md:col-start-6 md:col-span-7">
            <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
              about studio
            </h1>
          </div>

          <div className="md:col-start-1 md:col-span-5 w-full shrink-0 aspect-[4/5] bg-white rounded-xl overflow-hidden shadow-sm">
            {renderMedia("https://picsum.photos/seed/about-studio-portrait/800/1000", "about studio portrait", "w-full h-full object-cover")}
          </div>
          
          <div className="md:col-start-6 md:col-span-7 flex flex-col gap-6 md:gap-8">
            <div>
              <h2 className="text-lg font-medium text-black mb-1">the approach</h2>
              <p className="text-lg text-gray-700 leading-snug">
                lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">the vision</h2>
              <p className="text-lg text-gray-700 leading-snug">
                stet clita kasd gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing elitr.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// 5. Services Seite
const ServicesPage = () => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <div className="flex items-start gap-6 mb-12">
          <div className="w-8 shrink-0"></div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            services
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
              <h2 className="text-lg font-medium text-black mb-1">art direction</h2>
              <p className="text-lg text-gray-700 leading-snug">
                crafting unique visual concepts and strategic design solutions tailored to your brand's core identity. guiding the visual language from concept to final execution.
              </p>
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
              <h2 className="text-lg font-medium text-black mb-1">branding & identity</h2>
              <p className="text-lg text-gray-700 leading-snug">
                from logo design to comprehensive brand guidelines, creating cohesive and memorable brand experiences that resonate with your target audience across all channels.
              </p>
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
              <h2 className="text-lg font-medium text-black mb-1">editorial design</h2>
              <p className="text-lg text-gray-700 leading-snug">
                layout and typesetting for books, magazines, and digital publications. a strong focus on typography and grid systems to ensure optimal readability and aesthetic appeal.
              </p>
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
              <h2 className="text-lg font-medium text-black mb-1">ui/ux design</h2>
              <p className="text-lg text-gray-700 leading-snug">
                designing intuitive and aesthetically pleasing digital interfaces. bridging the gap between functional user experience and contemporary visual design.
              </p>
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
              <h2 className="text-lg font-medium text-black mb-1">packaging design</h2>
              <p className="text-lg text-gray-700 leading-snug">
                developing physical packaging concepts that stand out on the shelf. focusing on sustainable materials, structural integrity, and eye-catching graphics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. Contact Seite
const ContactPage = () => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          get in touch
        </h1>
        <div>
          <h2 className="text-lg font-medium text-black mb-1">project inquiries</h2>
          <p className="text-lg text-gray-700 leading-snug mb-10">
            have a project in mind or just want to say hi? drop me a line.
          </p>
        </div>
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-medium text-black pl-1">name</label>
            <input type="text" id="name" className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" placeholder="your name" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-medium text-black pl-1">email</label>
            <input type="email" id="email" className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" placeholder="your@email.com" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="request" className="text-lg font-medium text-black pl-1">message</label>
            <textarea id="request" rows="5" className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none text-lg" placeholder="how can i help you?"></textarea>
          </div>
          <button type="submit" className="self-start border border-black bg-transparent hover:bg-black text-black hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 mt-2 text-lg">
            submit
          </button>
        </form>
      </div>
    </div>
  );
};

// 7. Imprint & Privacy Policy Seite
const ImprintPage = () => {
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, []); 
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          imprint & privacy policy
        </h1>
        <div className="space-y-12">
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-black mb-1">imprint</h2>
              <p className="text-lg text-gray-700 leading-snug">information according to § 5 ecg and disclosure according to § 25 medieng.</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">service provider, media owner and publisher:</h2>
              <p className="text-lg text-gray-700 leading-snug">[placeholder: lukas liszka]<br />[placeholder: street 12]<br />[placeholder: 1010 vienna, austria]</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">contact:</h2>
              <p className="text-lg text-gray-700 leading-snug">email: [placeholder: hello@lukasliszka.com]<br />phone: [placeholder: +43 123 456789]</p>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-1">legal information:</h2>
              <p className="text-lg text-gray-700 leading-snug">vat number: [placeholder: atu12345678]<br />business purpose: graphic design<br />member of wko: [placeholder: wko wien, fachgruppe werbung und marktkommunikation]<br />applicable legal regulations: gewerbeordnung (www.ris.bka.gv.at)<br />supervisory authority/trade authority: [placeholder: magistratisches bezirksamt des x. bezirkes]<br />job title: graphic designer</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- HAUPT APP (NEU MIT SLUG-ROUTING) ---
export default function PortfolioApp() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let currentView = 'home';
  let activeProject = null;
  let activeCategory = null;

  // NEU: Hier wird jetzt nach dem 'slug' gesucht statt nach der 'id'
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
  
  // NEU: Hier wird der 'slug' in die URL gepackt statt der 'id'
  const handleProjectClick = (project) => { window.location.hash = `#project=${project.slug}`; };

  const baseProjects = activeCategory 
    ? initialProjects.filter(p => p.category === activeCategory)
    : initialProjects;

  const perfectSet = useMemo(() => {
    if (isMobile) return baseProjects;
    let arr = [...baseProjects];
    
    const targetLength = Math.max(15, Math.ceil(arr.length / 15) * 15);
    
    while (arr.length < targetLength) { 
      arr = [...arr, ...baseProjects]; 
    }
    return arr.slice(0, targetLength);
  }, [baseProjects, isMobile]);

  const displayProjects = useMemo(() => {
    if (isMobile) return perfectSet;
    return Array(12).fill(perfectSet).flat().map((p, i) => ({ ...p, uniqueId: `${p.id}-${i}` }));
  }, [perfectSet, isMobile]);

  useEffect(() => {
    if (isMobile || activeProject || currentView !== 'home') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); 
      return;
    }

    let singleSetHeight = 0;

    const calculateHeight = () => {
      const item1 = document.getElementById('item-0-0');
      const item2 = document.getElementById('item-1-0');
      if (item1 && item2) {
        singleSetHeight = item2.offsetTop - item1.offsetTop;
      }
    };

    const initTimer = setTimeout(() => {
      calculateHeight();
      if (singleSetHeight > 0 && window.scrollY === 0) {
        window.scrollTo({ top: singleSetHeight * 5, behavior: 'instant' });
      }
    }, 100);

    const handleScroll = () => {
      if (singleSetHeight === 0) calculateHeight();
      if (singleSetHeight === 0) return;

      const scrollY = window.scrollY;

      if (scrollY < singleSetHeight * 3) {
        window.scrollTo({ top: scrollY + singleSetHeight, behavior: 'instant' });
      } else if (scrollY > singleSetHeight * 8) {
        window.scrollTo({ top: scrollY - singleSetHeight, behavior: 'instant' });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateHeight);

    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [isMobile, activeProject, currentView, displayProjects, hash]);

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
      />

      {activeProject ? (
        <ProjectView project={activeProject} />
      ) : currentView === 'about' ? (
        <AboutPage />
      ) : currentView === 'contact' ? (
        <ContactPage />
      ) : currentView === 'services' ? (
        <ServicesPage />
      ) : currentView === 'imprint' ? (
        <ImprintPage />
      ) : (
        <main className="p-2 md:pt-32 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2">
            {isMobile ? (
              displayProjects.map((project, idx) => (
                <ProjectCarousel key={project.uniqueId || project.id} id={`item-0-${idx}`} project={project} onClick={handleProjectClick} />
              ))
            ) : (
              Array(12).fill(null).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {displayProjects
                    .slice(setIndex * perfectSet.length, (setIndex + 1) * perfectSet.length)
                    .map((project, idx) => (
                      <ProjectCarousel 
                        key={`${setIndex}-${idx}`} 
                        id={`item-${setIndex}-${idx}`} 
                        project={project} 
                        onClick={handleProjectClick} 
                      />
                  ))}
                </React.Fragment>
              ))
            )}
          </div>
        </main>
      )}
    </div>
  );
}
