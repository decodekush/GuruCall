import { motion } from 'framer-motion';
import { Phone, ArrowRight, Play, Sparkles, Zap, Globe, Cpu, Shield } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-dark-900">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
            x: [0, -30, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-400/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-dark-900/50 to-dark-900" />
        
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Badge with enhanced animation */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="mb-8"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full bg-dark-800/80 border border-dark-700 text-dark-200"
            whileHover={{ scale: 1.05, borderColor: 'rgba(14, 165, 233, 0.5)' }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-accent-400" />
            </motion.div>
            <span>Voice-First AI Education Platform</span>
            <span className="flex items-center gap-1 text-primary-400">
              Learn More <ArrowRight className="w-3 h-3" />
            </span>
          </motion.div>
        </motion.div>

        {/* Main Heading with staggered animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center"
        >
          <motion.span 
            className="block text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Education as Easy as
          </motion.span>
          <motion.span 
            className="block mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display gradient-text animate-gradient-x bg-[length:200%_auto]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Making a Phone Call
          </motion.span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-2xl mt-6 text-lg text-center text-dark-300 sm:text-xl"
        >
          GuruCall is an AI-powered voice tutor that delivers instant, curriculum-aligned 
          answers via phone. No internet, no app, no barriers — just call and learn.
        </motion.p>

        {/* Prototype Notice Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Shield className="w-3 h-3" />
            <span>Prototype Demo — Real telephony integration available for enterprise</span>
          </div>
        </motion.div>

        {/* CTA Buttons with enhanced hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-4 mt-10 sm:flex-row"
        >
          <motion.a
            href="#try-it"
            className="btn-primary gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Cpu className="w-5 h-5" />
            Try Voice Demo
          </motion.a>
          <motion.a
            href="#how-it-works"
            className="btn-secondary gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            See How It Works
          </motion.a>
        </motion.div>

        {/* Stats with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 gap-8 mt-16 sm:grid-cols-3 lg:gap-16"
        >
          {[
            { icon: Zap, value: '<3s', label: 'Response Time', color: 'text-primary-400' },
            { icon: Sparkles, value: '7+', label: 'Academic Domains', color: 'text-accent-400' },
            { icon: Globe, value: '24/7', label: 'Availability', color: 'text-primary-400' },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              <div className="flex items-center justify-center gap-2 text-3xl font-bold text-white sm:text-4xl font-display">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                {stat.value}
              </div>
              <p className="mt-2 text-sm text-dark-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Phone Animation with enhanced effects */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="relative mt-12 mb-24"
        >
          <div className="relative flex items-center justify-center w-32 h-32">
            {/* Pulse Rings with gradient */}
            {[0, 0.5, 1].map((delay, i) => (
              <motion.div 
                key={i}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 1, opacity: 0.2 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay,
                  ease: "easeOut"
                }}
              >
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-500/30 to-accent-500/30" />
              </motion.div>
            ))}
            
            {/* Phone Icon with glow */}
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Phone className="w-9 h-9 text-white" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator with enhanced animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <motion.a
            href="#features"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-dark-400 cursor-pointer hover:text-white transition-colors"
          >
            <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-primary-500"
              />
            </div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
