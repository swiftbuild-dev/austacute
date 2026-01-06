import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import heroSkincare from '@/assets/austa-facial.jpg';
import heroFacial from '@/assets/austa-skincare.jpg';
import heroDental from '@/assets/austa-dental.jpg';

const slides = [
  {
    image: heroSkincare,
    title: 'Premium Facial Solutions',
    subtitle: 'Reveal your natural radiance with our advanced treatments',
    cta: 'Explore Skincare',
  },
  {
    image: heroFacial,
    title: 'Luxury Facial Treatments',
    subtitle: 'Experience rejuvenation like never before',
    cta: 'Discover Facials',
  },
  {
    image: heroDental,
    title: 'Advanced Dental Care',
    subtitle: 'Your smile, our passion – excellence in every detail',
    cta: 'View Dental Services',
  },
];

export const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preload all images on mount to prevent blank states
  useEffect(() => {
    const loadPromises = slides.map((slide, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = slide.image;
        img.onload = () => {
          setImagesLoaded((prev) => new Set(prev).add(index));
          resolve();
        };
        img.onerror = () => {
          // Even if image fails, mark as "loaded" to prevent infinite waiting
          setImagesLoaded((prev) => new Set(prev).add(index));
          resolve();
        };
      });
    });

    Promise.all(loadPromises).catch(() => {
      // Handle any errors gracefully
    });
  }, []);

  // Preload next image before transition
  const preloadNextImage = useCallback((nextIdx: number) => {
    if (!imagesLoaded.has(nextIdx)) {
      const img = new Image();
      img.src = slides[nextIdx].image;
      img.onload = () => {
        setImagesLoaded((prev) => new Set(prev).add(nextIdx));
      };
    }
  }, [imagesLoaded]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const transitionToSlide = useCallback((targetIndex: number) => {
    if (targetIndex === current || nextIndex !== null) return;

    preloadNextImage(targetIndex);

    // Start transition - show next image layer
    setNextIndex(targetIndex);

    // After transition completes, update current and reset
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setCurrent(targetIndex);
      setNextIndex(null);
    }, 1200); // Match transition duration
  }, [current, nextIndex, preloadNextImage]);

  const nextSlide = useCallback(() => {
    const next = (current + 1) % slides.length;
    transitionToSlide(next);
  }, [current, transitionToSlide]);

  const prevSlide = useCallback(() => {
    const prev = (current - 1 + slides.length) % slides.length;
    transitionToSlide(prev);
  }, [current, transitionToSlide]);

  const goToSlide = useCallback((index: number) => {
    if (index === current) return;
    transitionToSlide(index);
  }, [current, transitionToSlide]);

  // Lock hero to *actual* viewport height to avoid mobile 100vh/dvh quirks
  useEffect(() => {
    const update = () => setViewportHeight(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen w-full overflow-hidden bg-neutral-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Container - Layered crossfade approach prevents blank state */}
      <div className="absolute inset-0 w-full h-full">
        {/* Current image - always visible as base layer, fades out during transition */}
        <motion.div
          key={`current-${current}`}
          initial={false}
          animate={{ opacity: nextIndex !== null ? 0 : 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full"
          style={{
            willChange: 'opacity',
            transform: 'translateZ(0)' // GPU acceleration
          }}
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)', // GPU acceleration
              display: 'block'
            }}
          />
        </motion.div>

        {/* Next image - fades in on top during transition */}
        {nextIndex !== null && nextIndex !== current && (
          <motion.div
            key={`next-${nextIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 w-full h-full"
            style={{
              willChange: 'opacity',
              transform: 'translateZ(0)' // GPU acceleration
            }}
          >
            <img
              src={slides[nextIndex].image}
              alt={slides[nextIndex].title}
              className="w-full h-full object-cover"
              style={{
                willChange: 'opacity',
                transform: 'translateZ(0)', // GPU acceleration
                display: 'block'
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Overlay Gradient - improves text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={nextIndex !== null ? nextIndex : current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="w-full"
            >
              <motion.h1
                className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-medium text-primary-foreground mb-4 sm:mb-3 leading-tight"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
              >
                {slides[nextIndex !== null ? nextIndex : current].title}
              </motion.h1>
              <motion.p
                className="text-base sm:text-lg md:text-xl text-primary-foreground/90 mb-8 sm:mb-8 max-w-2xl mx-auto font-poppins font-light px-2"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
              >
                {slides[nextIndex !== null ? nextIndex : current].subtitle}
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => handleNavClick('#services')}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {slides[nextIndex !== null ? nextIndex : current].cta}
                </Button>
                <Button
                  variant="heroOutline"
                  size="lg"
                  onClick={() => handleNavClick('#contact')}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  Book Consultation
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 pointer-events-none flex items-center justify-between px-2 sm:px-4 md:px-8">
        <button
          onClick={prevSlide}
          className="p-2 sm:p-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all text-primary-foreground pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="p-2 sm:p-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all text-primary-foreground pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20 flex justify-center gap-2 sm:gap-3 px-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === current
              ? 'bg-primary-foreground w-8'
              : 'bg-primary-foreground/50 hover:bg-primary-foreground/70 w-2'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
