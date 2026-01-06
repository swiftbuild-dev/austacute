import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

import heroSkincare from '@/assets/hero-skincare.jpg';
import heroFacial from '@/assets/hero-facial.jpg';
import heroDental from '@/assets/hero-dental.jpg';

const slides = [
  {
    image: heroSkincare,
    title: 'Premium Skincare Solutions',
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

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

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
      className="relative h-screen w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={slides[current].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-medium text-primary-foreground mb-6 leading-tight"
                style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl md:text-2xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto font-light"
                style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}
              >
                {slides[current].subtitle}
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="hero"
                  size="xl"
                  onClick={() => handleNavClick('#services')}
                >
                  {slides[current].cta}
                </Button>
                <Button
                  variant="heroOutline"
                  size="xl"
                  onClick={() => handleNavClick('#contact')}
                >
                  Book Consultation
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all text-primary-foreground"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all text-primary-foreground"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current
                ? 'bg-primary-foreground w-8'
                : 'bg-primary-foreground/50 hover:bg-primary-foreground/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
