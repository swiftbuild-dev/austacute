import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Users, Sparkles, Clock } from 'lucide-react';

const stats = [
  { icon: Clock, value: '15+', label: 'Years of Excellence' },
  { icon: Users, value: '10,000+', label: 'Happy Clients' },
  { icon: Sparkles, value: '50,000+', label: 'Treatments Performed' },
  { icon: Award, value: '25+', label: 'Industry Awards' },
];

export const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' });

  return (
    <section id="about" className="py-24 lg:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"
                alt="AustaCute Wellness Center"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 border-2 border-primary rounded-2xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground mb-6">
                About AustaCute
              </h2>
              <div className="w-20 h-1 bg-primary rounded-full" />
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Founded with a vision to redefine beauty and wellness, AustaCute has become a
              sanctuary for those seeking exceptional skincare, facial treatments, and dental care.
              Our philosophy centers on the belief that true beauty comes from within, and our
              role is to help you reveal your most radiant self.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              Our team of certified professionals brings together decades of combined experience in
              aesthetics and dentistry. We continuously invest in the latest technologies and
              training to ensure every client receives world-class care in a nurturing,
              personalized environment.
            </p>

            <div className="p-6 bg-accent rounded-2xl border border-primary/10">
              <h3 className="text-xl font-serif font-medium text-foreground mb-3">Our Mission</h3>
              <p className="text-muted-foreground italic">
                "To empower individuals to feel confident and beautiful through personalized,
                results-driven treatments delivered with care, expertise, and integrity."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-4xl font-serif font-semibold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
