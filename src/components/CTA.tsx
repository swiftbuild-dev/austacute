import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingModal } from './BookingModal';
import ctaImage from '@/assets/austa-cream.jpg';

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <section className="py-8 lg:py-16 bg-background">
      <div className="container mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col lg:flex-row w-full max-w-8xl mx-auto rounded-3xl lg:rounded-3xl overflow-hidden border border-border bg-card shadow-sm"
        >
          {/* Image - Half Width */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px]">
            <img
              src={ctaImage}
              alt="Consultation at AustaCute"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content - Half Width */}
          <div className="w-full lg:w-1/2 flex items-center bg-card">
            <div className="w-full px-8 py-16 lg:px-16 lg:py-20">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-card-foreground mb-6"
              >
                Ready to Transform Your Beauty Journey?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg text-muted-foreground mb-8 leading-relaxed"
              >
                Book a personalized consultation with our experts and discover the perfect
                treatments tailored to your unique needs. Click below to schedule your appointment.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6"
              >
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-primary hover:bg-primary-dark text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  Book Free Consultation
                </Button>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  or call us directly at +234 816 666 3089
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <BookingModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} />
    </section>
  );
};