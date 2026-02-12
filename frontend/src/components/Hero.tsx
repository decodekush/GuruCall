import { motion } from 'framer-motion';
import { Phone, ArrowRight, Play, Sparkles, Zap, Globe } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-dark-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark-900/50 to-dark-900" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-dark-800/80 border border-dark-700 text-dark-200">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Voice-First AI Education Platform</span>
            <span className="flex items-center gap-1 text-primary-400">
              Learn More <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          <span className="block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display text-white">
            Education as Easy as
          </span>
          <span className="block mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display gradient-text animate-gradient-x bg-[length:200%_auto]">
            Making a Phone Call
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mt-6 text-lg text-center text-dark-300 sm:text-xl"
        >
          GuruCall is an AI-powered voice tutor that delivers instant, curriculum-aligned 
          answers via phone. No internet, no app, no barriers — just call and learn.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-4 mt-10 sm:flex-row"
        >
          <motion.button
            className="btn-primary gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-5 h-5" />
            Try GuruCall Now
          </motion.button>
          <motion.button
            className="btn-secondary gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 gap-8 mt-16 sm:grid-cols-3 lg:gap-16"
        >
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white sm:text-4xl font-display">
              <Zap className="w-6 h-6 text-primary-400" />
              &lt;3s
            </div>
            <p className="mt-2 text-sm text-dark-400">Response Time</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white sm:text-4xl font-display">
              <Sparkles className="w-6 h-6 text-accent-400" />
              7+
            </div>
            <p className="mt-2 text-sm text-dark-400">Academic Domains</p>
          </div>
          <div className="col-span-2 text-center sm:col-span-1">
            <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white sm:text-4xl font-display">
              <Globe className="w-6 h-6 text-primary-400" />
              24/7
            </div>
            <p className="mt-2 text-sm text-dark-400">Availability</p>
          </div>
        </motion.div>

        {/* Phone Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mt-12 mb-24"
        >
          <div className="relative flex items-center justify-center w-32 h-32">
            {/* Pulse Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary-500/20 pulse-ring" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary-500/10 pulse-ring" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-primary-500/5 pulse-ring" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Phone Icon */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow"
            >
              <Phone className="w-9 h-9 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-dark-400"
          >
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary-500"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
