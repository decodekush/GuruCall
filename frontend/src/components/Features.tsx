import { motion } from 'framer-motion';
import { 
  Phone, 
  Mic, 
  Brain, 
  Volume2, 
  Globe, 
  Clock, 
  Shield, 
  Users,
  Zap,
  BookOpen
} from 'lucide-react';

const features = [
  {
    icon: Phone,
    title: 'No Internet Required',
    description: 'Works on any basic mobile or landline. Just dial the number and start learning instantly.',
    color: 'from-primary-500 to-primary-600',
    bgColor: 'bg-primary-500/10',
  },
  {
    icon: Mic,
    title: 'Natural Voice Input',
    description: 'Ask questions in your natural language. Our Deepgram-powered STT captures every word accurately.',
    color: 'from-accent-500 to-accent-600',
    bgColor: 'bg-accent-500/10',
  },
  {
    icon: Brain,
    title: 'Groq-Powered AI',
    description: 'Powered by Groq\'s Llama 3.3 70B with conversation memory for personalized, context-aware explanations.',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Volume2,
    title: 'Natural Voice Output',
    description: 'ElevenLabs TTS delivers human-like voice responses that are clear and engaging.',
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Clock,
    title: 'Sub-3s Response',
    description: 'Lightning-fast end-to-end processing ensures answers arrive within 3 seconds.',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-500/10',
  },
  {
    icon: BookOpen,
    title: '7 Academic Domains',
    description: 'From Class 1-5 to specialized Engineering, Medical, Commerce, and Arts content.',
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Globe,
    title: 'Rural Accessibility',
    description: 'Designed for underconnected regions where smartphones and internet are limited.',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    title: 'Secure Sessions',
    description: 'Session data stored securely in MongoDB with enterprise-grade encryption and protection.',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-500/10',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function Features() {
  return (
    <section id="features" className="relative py-24 overflow-hidden bg-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium rounded-full bg-primary-500/10 text-primary-400">
            <Zap className="w-4 h-4" />
            Powerful Features
          </div>
          <h2 className="section-heading text-white">
            Everything You Need to
            <span className="gradient-text"> Learn Effortlessly</span>
          </h2>
          <p className="section-subheading">
            GuruCall combines cutting-edge AI with simple telephony to create 
            the most accessible educational platform ever built.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group"
            >
              <div className="relative h-full p-6 transition-all duration-300 border rounded-2xl bg-dark-800/50 border-dark-700 hover:border-dark-600 hover:bg-dark-800/80 hover:-translate-y-1">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl ${feature.bgColor}`}>
                  <feature.icon className={`w-6 h-6 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} style={{ color: feature.color.includes('primary') ? '#0ea5e9' : feature.color.includes('accent') ? '#d946ef' : feature.color.includes('emerald') ? '#10b981' : feature.color.includes('amber') ? '#f59e0b' : feature.color.includes('rose') ? '#f43f5e' : feature.color.includes('cyan') ? '#06b6d4' : feature.color.includes('violet') ? '#8b5cf6' : '#6366f1' }} />
                </div>

                {/* Content */}
                <h3 className="mb-2 text-lg font-semibold text-white font-display">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-dark-400">
                  {feature.description}
                </p>

                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-16 lg:gap-16"
        >
          {/* <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-400" />
            <div>
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-dark-400">Active Users</div>
            </div>
          </div> */}
          {/* <div className="w-px h-12 bg-dark-700 hidden sm:block" />
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-accent-400" />
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-dark-400">Calls Handled</div>
            </div>
          </div> */}
          {/* <div className="w-px h-12 bg-dark-700 hidden sm:block" />
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-emerald-400" />
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-sm text-dark-400">Uptime</div>
            </div>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
}
