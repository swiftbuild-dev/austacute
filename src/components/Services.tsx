import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles, Heart, Smile, ArrowRight } from 'lucide-react';

import serviceSkincare from '@/assets/service-skincare.jpg';
import serviceFacial from '@/assets/service-facial.jpg';
import serviceDental from '@/assets/service-dental.jpg';

const services = [
  {
    icon: Sparkles,
    title: 'Advanced Skincare',
    description:
      'Experience transformative skincare with our cutting-edge treatments. Our expert aestheticians use the latest technology and premium products to address your unique skin concerns, from anti-aging solutions to targeted treatments for acne, hyperpigmentation, and more.',
    secondaryText:
      'Every treatment begins with a comprehensive skin analysis to ensure we create a personalized regimen that delivers visible, lasting results.',
    image: serviceSkincare,
    link: '#contact',
  },
  {
    icon: Heart,
    title: 'Luxury Facials',
    description:
      'Indulge in our signature facial experiences designed to cleanse, nourish, and revitalize your skin. From hydrating treatments to deep-cleansing protocols, each session is tailored to your skin type and goals.',
    secondaryText:
      'Our facials combine traditional techniques with modern innovations, including LED therapy, microcurrent, and organic botanical extracts for a truly luxurious experience.',
    image: serviceFacial,
    link: '#contact',
  },
  {
    icon: Smile,
    title: 'Dental Excellence',
    description:
      'Discover comprehensive dental care that prioritizes both health and aesthetics. Our state-of-the-art facility offers everything from routine cleanings to advanced cosmetic dentistry, all in a comfortable, welcoming environment.',
    secondaryText:
      'Whether you seek teeth whitening, veneers, or complete smile makeovers, our skilled dental professionals are dedicated to helping you achieve the confident smile you deserve.',
    image: serviceDental,
    link: '#contact',
  },
];

interface ServiceItemProps {
  service: (typeof services)[0];
  index: number;
}

const ServiceItem = ({ service, index }: ServiceItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isEven = index % 2 === 0;
  const Icon = service.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`flex flex-col ${
        isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
      } gap-8 lg:gap-16 items-center`}
    >
      {/* Text Content */}
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-3xl md:text-4xl font-serif font-medium text-foreground">
          {service.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed text-lg">
          {service.description}
        </p>
        <p className="text-muted-foreground leading-relaxed">
          {service.secondaryText}
        </p>
        <a
          href={service.link}
          className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector(service.link)?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>

      {/* Image */}
      <motion.div
        className="flex-1 w-full"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative rounded-3xl overflow-hidden shadow-xl">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Services = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-lg text-muted-foreground leading-relaxed">
            At AustaCute, we offer a comprehensive range of premium treatments designed to enhance
            your natural beauty and well-being. Each service is delivered by certified professionals
            using the finest products and latest techniques.
          </p>
        </motion.div>

        {/* Services List */}
        <div className="space-y-24 lg:space-y-32">
          {services.map((service, index) => (
            <ServiceItem key={service.title} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
