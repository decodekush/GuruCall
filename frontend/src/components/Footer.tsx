import { motion } from 'framer-motion';
import { Phone, Mail, Github, Linkedin, Twitter, Heart, ArrowUp } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Categories', href: '#categories' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'GitHub', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#' },
  ],
};

const socialLinks = [
  { name: 'GitHub', icon: Github, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="relative pt-20 pb-8 overflow-hidden bg-dark-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <motion.a
              href="#"
              className="flex items-center gap-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 blur-lg opacity-50" />
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500">
                  <Phone className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-xl font-bold font-display">
                <span className="text-white">Guru</span>
                <span className="gradient-text">Call</span>
              </span>
            </motion.a>
            <p className="mt-4 text-sm text-dark-400 leading-relaxed">
              Voice-first AI tutor making education accessible to everyone. 
              No internet, no app, no barriers — just call and learn.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-10 h-10 transition-colors rounded-lg bg-dark-800 text-dark-400 hover:text-white hover:bg-dark-700"
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Product Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white">
                Product
              </h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors text-dark-400 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white">
                Resources
              </h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors text-dark-400 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider uppercase text-white">
                Company
              </h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors text-dark-400 hover:text-white"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-8 mt-12 border-t border-b border-dark-800">
          <a
            href="mailto:hello@gurucall.ai"
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
          >
            <Mail className="w-4 h-4 text-primary-400" />
            hello@gurucall.ai
          </a>
          <a
            href="tel:+1234567890"
            className="flex items-center gap-2 text-sm text-dark-400 hover:text-white transition-colors"
          >
            <Phone className="w-4 h-4 text-accent-400" />
            +1 (234) 567-890
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 mt-8 sm:flex-row">
          <p className="flex items-center gap-1 text-sm text-dark-500">
            © {new Date().getFullYear()} GuruCall. Made with
            <Heart className="w-4 h-4 text-red-500" />
            for accessible education.
          </p>
          
          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 text-sm transition-colors rounded-lg text-dark-400 hover:text-white bg-dark-800 hover:bg-dark-700"
          >
            Back to top
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
