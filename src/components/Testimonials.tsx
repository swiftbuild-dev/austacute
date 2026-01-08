import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Adebayo T.',
    role: 'Facial Treatment Client',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    quote:
      'AustaCute transformed my skin completely! The facial treatments are exceptional and the staff is incredibly professional. I have never felt more confident.',
    rating: 5,
  },
  {
    name: 'Chioma Obi',
    role: 'Dental Care Patient',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    quote:
      'Finally found a dental clinic where I feel comfortable. The team is gentle, thorough, and my smile has never looked better. Highly recommend!',
    rating: 5,
  },
  {
    name: 'Fatima Musa',
    role: 'Skincare Client',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=80',
    quote:
      'The personalized skincare regimen they created for me has worked wonders. My acne is finally under control and my skin glows. Thank you, AustaCute!',
    rating: 5,
  },
  {
    name: 'Olamide Adeyemi',
    role: 'Luxury Facial Client',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    quote:
      'The signature facial experience was pure bliss. From the moment I walked in, I felt pampered and cared for. Already booked my next appointment!',
    rating: 5,
  },
  {
    name: 'Emeka Okafor',
    role: 'Cosmetic Dentistry Patient',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    quote:
      'Got veneers done here and the results exceeded my expectations. Professional, painless, and the outcome is stunning. Worth every penny.',
    rating: 5,
  },
  {
    name: 'Grace Eze',
    role: 'Skincare & Facial Client',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    quote:
      'I have been coming to AustaCute for over a year now and the consistency in quality is remarkable. My skin has never looked or felt this good!',
    rating: 5,
  },
];

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[0];
  index: number;
}

const TestimonialCard = ({ testimonial, index }: TestimonialCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="bg-card p-8 rounded-2xl shadow-md border border-border hover:shadow-xl transition-all duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-primary text-primary" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-foreground leading-relaxed mb-6 italic">"{testimonial.quote}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
        />
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="testimonials" className="py-16 lg:py-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
            What Our Clients Say
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-lg text-muted-foreground">
            Don't just take our word for it – hear from the thousands of clients who have
            transformed their beauty journey with AustaCute.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
