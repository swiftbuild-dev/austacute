import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const videoTestimonials = [
  {
    name: 'Happy Client',
    role: 'Beauty Client',
    videoUrl: 'https://www.youtube.com/embed/9QWG7BpUuBs',
    quote: 'AustaCute transformed my skin completely! The results are beyond amazing.',
    rating: 5,
  },
  {
    name: 'Happy Client',
    role: 'Beauty Client',
    videoUrl: 'https://www.youtube.com/embed/CiNedaZP8WQ',
    quote: 'The quality of service is remarkable. I keep coming back for more!',
    rating: 5,
  },
];

interface VideoTestimonialCardProps {
  testimonial: typeof videoTestimonials[0];
  index: number;
  isActive: boolean;
}

const VideoTestimonialCard = ({ testimonial, index, isActive }: VideoTestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-full md:w-[400px] lg:w-[420px] snap-center"
    >
      <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl h-[600px] md:h-[650px] group">
        {/* Video Container */}
        <div className="relative w-full h-full">
          <iframe
            src={`${testimonial.videoUrl}?autoplay=0&controls=1&modestbranding=1&rel=0`}
            className="absolute inset-0 w-full h-full object-cover"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 pointer-events-none">
          {/* Client Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
              "{testimonial.quote}"
            </p>

            {/* Author */}
            <div>
              <div className="font-bold text-white text-lg">{testimonial.name}</div>
              <div className="text-sm text-white/80">{testimonial.role}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export const Testimonials = () => {
  const headerRef = useRef(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('div')?.offsetWidth || 0;
      const scrollAmount = direction === 'left' ? -cardWidth - 32 : cardWidth + 32;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      const newIndex = direction === 'left' 
        ? Math.max(0, currentIndex - 1)
        : Math.min(videoTestimonials.length - 1, currentIndex + 1);
      setCurrentIndex(newIndex);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const cardWidth = container.querySelector('div')?.offsetWidth || 0;
      const newIndex = Math.round(container.scrollLeft / (cardWidth + 32));
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="testimonials" className="py-16 lg:py-20 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isHeaderInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block mb-4"
          >
            <div className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-semibold">
              CLIENT STORIES
            </div>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-foreground mb-6">
            Real Results, Real Stories
          </h2>
          
          <div className="w-20 h-1 bg-primary mx-auto mb-6 rounded-full" />
          
          <p className="text-lg md:text-xl text-muted-foreground">
            Watch how AustaCute has transformed lives through our exceptional beauty and dental services
          </p>
        </motion.div>

        {/* Video Carousel */}
        <div className="relative">
          {/* Navigation Buttons - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={() => scroll('left')}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => scroll('right')}
              disabled={currentIndex === videoTestimonials.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-14 h-14 bg-white shadow-xl rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-foreground"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {videoTestimonials.map((testimonial, index) => (
              <VideoTestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={index}
                isActive={currentIndex === index}
              />
            ))}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {videoTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  const container = scrollContainerRef.current;
                  if (container) {
                    const cardWidth = container.querySelector('div')?.offsetWidth || 0;
                    container.scrollTo({ left: index * (cardWidth + 32), behavior: 'smooth' });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            Ready to start your transformation journey?
          </p>
          <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl">
            Book Your Appointment
          </button>
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};