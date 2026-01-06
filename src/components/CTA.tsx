import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

import ctaImage from '@/assets/cta-consultation.jpg';

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden bg-gradient-primary shadow-glow"
        >
          <div className="flex flex-col lg:flex-row items-center">
            {/* Image */}
            <div className="lg:w-2/5 h-64 lg:h-auto lg:absolute lg:left-0 lg:top-0 lg:bottom-0 w-full">
              <img
                src={ctaImage}
                alt="Consultation at AustaCute"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/30 lg:bg-gradient-to-r lg:from-transparent lg:to-primary" />
            </div>

            {/* Content */}
            <div className="lg:w-3/5 lg:ml-auto p-8 lg:p-16 text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-primary-foreground mb-6"
              >
                Ready to Transform Your Beauty Journey?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-primary-foreground/90 mb-8 max-w-lg mx-auto lg:mx-0"
              >
                Book a personalized consultation with our experts and discover the perfect
                treatments tailored to your unique needs.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
              >
                <Button variant="hero" size="xl" onClick={() => handleNavClick('#contact')}>
                  Schedule Consultation
                </Button>
                <a
                  href="tel:+15551234567"
                  className="inline-flex items-center gap-2 text-primary-foreground font-medium hover:underline"
                >
                  <Phone className="w-5 h-5" />
                  or call (555) 123-4567
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
