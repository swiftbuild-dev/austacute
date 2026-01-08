import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sparkles, Flower2, Stethoscope } from 'lucide-react';
import heroSkincare from '@/assets/austa-facial.jpg';
import heroFacial from '@/assets/austa-skincare.jpg';
import heroDental from '@/assets/austa-dental.jpg';

const services = [
  {
    title: 'Advanced Skincare',
    icon: Sparkles,
    image: heroSkincare,
    description: 'Experience our medical-grade skincare treatments tailored to your unique skin type. We use proven techniques to rejuvenate, hydrate, and restore your skin\'s natural glow.',
    link: '#skincare'
  },
  {
    title: 'Facial Treatments',
    icon: Flower2,
    image: heroFacial,
    description: 'Indulge in our relaxing and therapeutic facials. From deep cleansing to anti-aging, our customized treatments address specific concerns for a healthier, more radiant complexion.',
    link: '#facials'
  },
  {
    title: 'Dental Care',
    icon: Stethoscope,
    image: heroDental,
    description: 'Comprehensive dental services ensuring your smile is as healthy as it is beautiful. We offer routine checkups, cleaning, and cosmetic procedures in a comfortable environment.',
    link: '#dental'
  }
];

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
            your natural beauty and well-being.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[500px] md:h-[600px] overflow-hidden cursor-pointer"
              >
                {/* Background Image */}
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium tracking-wider uppercase mb-2 opacity-90">
                      {service.title.split(' ')[0]}
                    </p>
                    <h3 className="text-3xl md:text-4xl font-serif font-medium mb-4">
                      {service.title}
                    </h3>
                    <p className="text-base text-gray-200 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};