import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// --- MOCK DATEN (English) ---
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
const ProjectCarousel = ({ project, onClick }) => {
  const scrollRef = useRef(null);
  const [showArrows, setShowArrows] = useState(false);
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
    <div className="flex flex-col mb-12 md:mb-0 smooth-appear">
      {/* Das eigentliche Bild-Karussell (Exakt 4:5 Format garantiert) */}
      <div
