import { Leaf, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About Us', href: '#about' },
  { name: 'Testimonials', href: '#testimonials' },
  { name: 'Contact', href: '#contact' },
];

const services = [
  { name: 'Advanced Skincare', href: '#services' },
  { name: 'Luxury Facials', href: '#services' },
  { name: 'Dental Excellence', href: '#services' },
  { name: 'Consultations', href: '#contact' },
];

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

export const Footer = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <a href="#home" className="flex items-center gap-2" onClick={(e) => handleNavClick(e, '#home')}>
              <Leaf className="w-8 h-8" />
              <span className="text-2xl font-serif font-semibold tracking-tight">AustaCute</span>
            </a>
            <p className="text-primary-foreground/80 text-sm leading-relaxed">
              Your sanctuary for premium skincare, luxury facials, and exceptional dental care.
              Discover your most radiant self with us.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 hover:scale-110 transition-all"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    onClick={(e) => handleNavClick(e, link.href)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    onClick={(e) => handleNavClick(e, service.href)}
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li>123 Beauty Boulevard</li>
              <li>Suite 456, Los Angeles, CA 90210</li>
              <li className="pt-2">(555) 123-4567</li>
              <li>hello@austacute.com</li>
              <li className="pt-2">Mon - Fri: 9AM - 8PM</li>
              <li>Sat - Sun: 10AM - 6PM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/70">
            © {new Date().getFullYear()} AustaCute. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-primary-foreground/70">
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary-foreground transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
