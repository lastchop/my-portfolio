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
const generateImages = (seed, count, ratio) => {
  return Array.from({ length: count }).map((_, i) => {
    const width = ratio === '16:9' ? 1920 : 800;
    const height = ratio === '16:9' ? 1080 : 1000;
    return `https://picsum.photos/seed/${seed}${i}/${width}/${height}`;
  });
};

const placeholderDescription = "this project explores the boundaries between analog texture and digital precision. the goal was to develop a visual language that works seamlessly on both physical posters and in immersive online experiences. the color palette was deliberately reduced to draw focus to the shapes and strong typography.";

const initialProjects = [
  {
    id: 'p1',
    title: 'neon nights',
    category: 'posters',
    description: placeholderDescription,
    carousel: generateImages('neon', 4, '4:5'), 
    details: [
      { type: '4:5', url: `https://picsum.photos/seed/neon0/800/1000` },
      { type: '16:9', url: `https://picsum.photos/seed/neon-wide1/1920/1080` },
      { type: '4:5', url: `https://picsum.photos/seed/neon2/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/neon3/800/1000` },
    ]
  },
  {
    id: 'p2',
    title: 'eco brand',
    category: 'branding',
    description: "a comprehensive rebranding for a sustainable startup. from logo design to packaging, every touchpoint was designed to combine ecological values with modern aesthetics.",
    carousel: generateImages('eco', 3, '4:5'),
    details: [
      { type: '16:9', url: `https://picsum.photos/seed/eco-wide0/1920/1080` },
      { type: '4:5', url: `https://picsum.photos/seed/eco1/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/eco2/800/1000` },
    ]
  },
  {
    id: 'p3',
    title: 'character design',
    category: 'illustrations',
    description: placeholderDescription,
    carousel: generateImages('char', 5, '4:5'),
    details: [
      { type: '4:5', url: `https://picsum.photos/seed/char0/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/char1/800/1000` },
      { type: '16:9', url: `https://picsum.photos/seed/char-wide2/1920/1080` },
    ]
  },
  {
    id: 'p4',
    title: 'juice box',
    category: 'packaging',
    description: "a colorful and playful packaging series for cold-pressed juices. the design catches the eye on the supermarket shelf and communicates freshness at first glance.",
    carousel: generateImages('juice', 3, '4:5'),
    details: [
      { type: '4:5', url: `https://picsum.photos/seed/juice0/800/1000` },
      { type: '16:9', url: `https://picsum.photos/seed/juice-wide1/1920/1080` },
    ]
  },
  {
    id: 'p5',
    title: 'typo poster',
    category: 'posters',
    description: placeholderDescription,
    carousel: generateImages('typo', 2, '4:5'),
    details: [
      { type: '4:5', url: `https://picsum.photos/seed/typo0/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/typo1/800/1000` },
    ]
  },
  {
    id: 'p6',
    title: 'tech identity',
    category: 'branding',
    description: placeholderDescription,
    carousel: generateImages('tech', 4, '4:5'),
    details: [
      { type: '16:9', url: `https://picsum.photos/seed/tech-wide0/1920/1080` },
      { type: '16:9', url: `https://picsum.photos/seed/tech-wide1/1920/1080` },
    ]
  },
  {
    id: 'p7',
    title: 'botanical shapes',
    category: 'illustrations',
    description: "free graphic exploration of basic botanical shapes. created as a series for fine art prints.",
    carousel: generateImages('botanical', 3, '4:5'),
    details: [
      { type: '4:5', url: `https://picsum.photos/seed/botanical1/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/botanical2/800/1000` },
    ]
  },
  {
    id: 'p8',
    title: 'coffee roasters',
    category: 'packaging',
    description: "minimalist packaging design for a local coffee roastery in vienna. the focus was on tactile materials and concise typography.",
    carousel: generateImages('coffee', 4, '4:5'),
    details: [
      { type: '16:9', url: `https://picsum.photos/seed/coffee0/1920/1080` },
      { type: '4:5', url: `https://picsum.photos/seed/coffee1/800/1000` },
      { type: '4:5', url: `https://picsum.photos/seed/coffee2/800/1000` },
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
    <div id={id} className="flex flex-col mb-6 md:mb-0 smooth-appear">
      {/* Das eigentliche Bild-Karussell (Exakt 4:5 Format) */}
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

        {/* Indikator-Punkte (Dots) */}
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

        {/* Navigation Arrows (Nur auf Desktop! hidden md:flex) */}
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

        {/* Overlay Title on Hover (Desktop) */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center pointer-events-none">
          <h3 className="text-white text-base font-normal tracking-wide">{project.title}</h3>
        </div>
      </div>
      
      {/* Mobile Title */}
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
        
        {/* Header / Trigger */}
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

        {/* Aufklappbarer Inhalt */}
        <div 
          className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[550px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-6 pt-10 flex flex-col gap-4">
            
            {/* Projekt Kategorien */}
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

// 3. Projekt Detailseite
const ProjectView = ({ project }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  return (
    <div className="min-h-screen pb-24 pt-32">
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-3">
          {project.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 leading-normal max-w-2xl">
          {project.description}
        </p>
      </div>

      <div className="px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-2 max-w-7xl mx-auto">
        {project.details.map((media, idx) => {
          const isWide = media.type === '16:9';
          return (
            <div 
              key={idx} 
              className={`w-full overflow-hidden rounded-xl ${isWide ? 'md:col-span-2 aspect-video' : 'aspect-[4/5]'}`}
            >
              {renderMedia(media.url, `${project.title} detail ${idx}`, "w-full h-full object-cover hover:scale-105 transition-transform duration-700")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// 4. About Seite
const AboutPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          about studio
        </h1>
        <div className="w-full aspect-[4/5] bg-white rounded-xl overflow-hidden mb-8 shadow-sm">
          {renderMedia("https://picsum.photos/seed/about-studio-portrait/800/1000", "about studio portrait", "w-full h-full object-cover")}
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-black mb-0">the approach</h2>
            <p className="text-lg text-gray-700 leading-normal">
              lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. at vero eos et accusam et justo duo dolores et ea rebum.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-medium text-black mb-0">the vision</h2>
            <p className="text-lg text-gray-700 leading-normal">
              stet clita kasd gubergren, no sea takimata sanctus est lorem ipsum dolor sit amet. lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. Services Seite
const ServicesPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        
        {/* Unsichtbares Icon links, um die Main Headline exakt am Fließtext auszurichten */}
        <div className="flex items-start gap-6 mb-12">
          <div className="w-8 shrink-0"></div>
          <h1 className="text-4xl md:text-6xl font-medium tracking-tight">
            services
          </h1>
        </div>
        
        <div className="flex flex-col gap-12">
          
          {/* Service 1 */}
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="4"></circle>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-0">art direction</h2>
              <p className="text-lg text-gray-700 leading-normal">
                crafting unique visual concepts and strategic design solutions tailored to your brand's core identity. guiding the visual language from concept to final execution.
              </p>
            </div>
          </div>

          {/* Service 2 */}
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="3" y1="9" x2="21" y2="9"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-0">branding & identity</h2>
              <p className="text-lg text-gray-700 leading-normal">
                from logo design to comprehensive brand guidelines, creating cohesive and memorable brand experiences that resonate with your target audience across all channels.
              </p>
            </div>
          </div>

          {/* Service 3 */}
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-0">editorial design</h2>
              <p className="text-lg text-gray-700 leading-normal">
                layout and typesetting for books, magazines, and digital publications. a strong focus on typography and grid systems to ensure optimal readability and aesthetic appeal.
              </p>
            </div>
          </div>

          {/* Service 4 */}
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12.01" y2="18"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-0">ui/ux design</h2>
              <p className="text-lg text-gray-700 leading-normal">
                designing intuitive and aesthetically pleasing digital interfaces. bridging the gap between functional user experience and contemporary visual design.
              </p>
            </div>
          </div>

          {/* Service 5 */}
          <div className="flex items-start gap-6">
            <div className="w-8 h-8 shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-black">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-black mb-0">packaging design</h2>
              <p className="text-lg text-gray-700 leading-normal">
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
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          get in touch
        </h1>
        
        <div>
          <h2 className="text-lg font-medium text-black mb-0">project inquiries</h2>
          <p className="text-lg text-gray-700 leading-normal mb-10">
            have a project in mind or just want to say hi? drop me a line.
          </p>
        </div>
        
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-lg font-medium text-black pl-1">name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" 
              placeholder="your name" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-lg font-medium text-black pl-1">email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors text-lg" 
              placeholder="your@email.com" 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="request" className="text-lg font-medium text-black pl-1">message</label>
            <textarea 
              id="request" 
              rows="5" 
              className="w-full bg-transparent border border-black/20 focus:border-black rounded-xl px-4 py-3 focus:outline-none transition-colors resize-none text-lg" 
              placeholder="how can i help you?"
            ></textarea>
          </div>
          <button 
            type="submit" 
            className="self-start border border-black bg-transparent hover:bg-black text-black hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 mt-2 text-lg"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
};

// 7. Imprint & Privacy Policy Seite
const ImprintPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="min-h-screen pb-24 pt-32 px-6 md:px-12 flex justify-center">
      <div className="max-w-3xl w-full mb-16">
        <h1 className="text-4xl md:text-6xl font-medium tracking-tight mb-12">
          imprint & privacy policy
        </h1>
        
        <div className="space-y-12">
          <section className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-black mb-0">imprint</h2>
              <p className="text-lg text-gray-700 leading-normal">
                information according to § 5 ecg and disclosure according to § 25 medieng.
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-black mb-0">service provider, media owner and publisher:</h2>
              <p className="text-lg text-gray-700 leading-normal">
                [placeholder: lukas liszka]<br />
                [placeholder: street 12]<br />
                [placeholder: 1010 vienna, austria]
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">contact:</h2>
              <p className="text-lg text-gray-700 leading-normal">
                email: [placeholder: hello@lukasliszka.com]<br />
                phone: [placeholder: +43 123 456789]
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">legal information:</h2>
              <p className="text-lg text-gray-700 leading-normal">
                vat number: [placeholder: atu12345678]<br />
                business purpose: graphic design<br />
                member of wko: [placeholder: wko wien, fachgruppe werbung und marktkommunikation]<br />
                applicable legal regulations: gewerbeordnung (www.ris.bka.gv.at)<br />
                supervisory authority/trade authority: [placeholder: magistratisches bezirksamt des x. bezirkes]<br />
                job title: graphic designer
              </p>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-black mb-0">online dispute resolution</h2>
              <p className="text-lg text-gray-700 leading-normal">
                consumers have the opportunity to submit complaints to the eu's online dispute resolution platform: http://ec.europa.eu/odr. you can also send any complaints to the email address given above.
              </p>
            </div>
          </section>
          
          <section className="pt-12 border-t border-black/10 flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-medium text-black mb-0">privacy policy</h2>
              <p className="text-lg text-gray-700 leading-normal">
                the protection of your personal data is of particular concern to us. we therefore process your data exclusively on the basis of the statutory provisions (gdpr, tkg 2021). in this privacy policy we inform you about the most important aspects of data processing within the framework of our website.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">contacting us</h2>
              <p className="text-lg text-gray-700 leading-normal">
                if you contact us via the form on the website or by email, the data you provide will be stored by us for six months for the purpose of processing the inquiry and in case of follow-up questions. we do not pass on this data without your consent.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">cookies</h2>
              <p className="text-lg text-gray-700 leading-normal">
                our website uses so-called cookies. these are small text files that are stored on your device with the help of the browser. they do no harm. we use cookies to make our offer user-friendly. some cookies remain stored on your device until you delete them. they enable us to recognize your browser on your next visit. if you do not want this, you can set up your browser so that it informs you about the setting of cookies and you only allow this in individual cases.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">server log files</h2>
              <p className="text-lg text-gray-700 leading-normal">
                the provider of the pages automatically collects and stores information in so-called server log files, which your browser automatically transmits to us. these are: browser type and browser version, operating system used, referrer url, host name of the accessing computer, time of the server request, ip address. these data are not merged with other data sources.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-medium text-black mb-0">your rights</h2>
              <p className="text-lg text-gray-700 leading-normal">
                in principle, you have the rights to information, correction, deletion, restriction, data portability, revocation and objection regarding your stored data. if you believe that the processing of your data violates data protection law or your data protection claims have otherwise been violated in any way, you can complain to us [placeholder: hello@lukasliszka.com] or the data protection authority.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// --- HAUPT APP ---
export default function PortfolioApp() {
  const [activeProject, setActiveProject] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // Hört auf Fenster-Größenänderungen (Mobile vs Desktop)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const baseProjects = activeCategory 
    ? initialProjects.filter(p => p.category === activeCategory)
    : initialProjects;

  // Der mathematische Trick: Wir runden das Array exakt auf 15 Projekte auf!
  // Warum 15? Weil 15 das kleinste gemeinsame Vielfache von 3 (Tablet) und 5 (Desktop) Spalten ist.
  // Dadurch schließt das "Set" IMMER mit einer perfekten, vollen Zeile ab!
  const perfectSet = useMemo(() => {
    if (isMobile) return baseProjects; // Am Handy laden wir strikt nur das normale, einfache Set
    let arr = [...baseProjects];
    while (arr.length < 15) {
      arr = [...arr, ...baseProjects];
    }
    return arr.slice(0, 15);
  }, [baseProjects, isMobile]);

  // Auf Desktop rendern wir das perfekte Set 12 Mal unsichtbar hintereinander (180 Projekte!)
  const displayProjects = useMemo(() => {
    if (isMobile) return perfectSet;
    return Array(12).fill(perfectSet).flat().map((p, i) => ({ ...p, uniqueId: `${p.id}-${i}` }));
  }, [perfectSet, isMobile]);

  // Die Teleport-Logik (Lenis-Style Seamless Loop)
  useEffect(() => {
    if (isMobile || activeProject || currentView !== 'home') {
      window.scrollTo(0, 0);
      return;
    }

    let singleSetHeight = 0;

    // Errechnet die exakte Pixel-Höhe von einem einzigen 15er-Set
    const calculateHeight = () => {
      const item1 = document.getElementById('item-0-0');
      const item2 = document.getElementById('item-1-0');
      if (item1 && item2) {
        singleSetHeight = item2.offsetTop - item1.offsetTop;
      }
    };

    // Gib dem Browser eine Sekunde, um die Bilder für die Messung zu laden
    const initTimer = setTimeout(() => {
      calculateHeight();
      if (singleSetHeight > 0) {
        // TELEPORT ZUM START: Wirft dich unsichtbar in die exakte Mitte (Set Nr. 5) 
        // Du bist also bei Lade-Ende meilenweit von dem "grauen 0px Balken" entfernt!
        window.scrollTo({ top: singleSetHeight * 5, behavior: 'instant' });
      }
    }, 100);

    const handleScroll = () => {
      if (singleSetHeight === 0) calculateHeight();
      if (singleSetHeight === 0) return;

      const scrollY = window.scrollY;

      // TELEPORT NACH UNTEN: Wenn du in das obere Drittel scrollst
      if (scrollY < singleSetHeight * 3) {
        window.scrollTo({ top: scrollY + singleSetHeight, behavior: 'instant' });
      }
      // TELEPORT NACH OBEN: Wenn du in das untere Drittel scrollst
      else if (scrollY > singleSetHeight * 8) {
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
  }, [isMobile, activeProject, currentView, displayProjects]);

  const handleGoHome = () => {
    setActiveProject(null);
    setCurrentView('home');
    setActiveCategory(null);
  };

  const handleCategorySelect = (category) => {
    setActiveProject(null);
    setCurrentView('home');
    setActiveCategory(category);
  };

  return (
    <div className="bg-gray-200 min-h-screen text-black selection:bg-black selection:text-white" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500&display=swap');
        
        /* Unsichtbare Scrollbalken in ALLEN Browsern! */
        html, body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        html {
          scroll-behavior: smooth;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeInSmooth {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .smooth-appear {
          animation: fadeInSmooth 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      <FloatingMenu 
        onGoHome={handleGoHome} 
        onViewChange={(view) => {
          setActiveProject(null);
          setCurrentView(view);
        }} 
        onCategorySelect={handleCategorySelect}
      />

      {/* Main Content Area */}
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
        <main className="p-2 pt-32 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {isMobile ? (
              // MOBILE RENDER (Exakt 1 Set, kein Absturz)
              displayProjects.map((project, idx) => (
                <ProjectCarousel 
                  key={project.id} 
                  id={`item-0-${idx}`}
                  project={project} 
                  onClick={(p) => setActiveProject(p)} 
                />
              ))
            ) : (
              // DESKTOP RENDER (12 Sets für Seamless Teleport)
              Array(12).fill(displayProjects).map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {displayProjects.slice(setIndex * 15, (setIndex + 1) * 15).map((project, idx) => (
                    <ProjectCarousel 
                      key={`${setIndex}-${idx}`} 
                      id={`item-${setIndex}-${idx}`}
                      project={project} 
                      onClick={(p) => setActiveProject(p)} 
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
