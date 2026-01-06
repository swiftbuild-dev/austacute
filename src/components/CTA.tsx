import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ctaImage from '@/assets/austa-cream.jpg';

export const CTA = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [phone, setPhone] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone) {
      setIsModalOpen(true);
      setPhone('');
    }
  };

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
                treatments tailored to your unique needs. Share your phone number and we'll reach
                out to schedule your appointment.
              </motion.p>
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-6 pr-40 py-5 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground bg-background text-lg"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-6 whitespace-nowrap"
                  >
                    Get Started
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  or call us directly at +234 816 666 3089
                </p>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="items-center text-center space-y-4 pt-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-serif">Thank You!</DialogTitle>
            <DialogDescription className="text-lg text-center pb-4">
              We've received your phone number. One of our beauty experts will contact you shortly to schedule your consultation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pb-4">
            <Button onClick={() => setIsModalOpen(false)} className="px-8 min-w-[150px]">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};