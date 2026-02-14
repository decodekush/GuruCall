import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';

const techStack = [
  {
    name: 'Cloud Telephony',
    role: 'IVR & Voice Infrastructure',
    description: 'Enterprise-grade telephony infrastructure powering call flow, IVR menus, and voice routing.',
    logo: '📞',
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-500/10',
    link: '#',
  },
  {
    name: 'Node.js',
    role: 'Backend Runtime',
    description: 'TypeScript-based Express server with modular architecture and robust error handling.',
    logo: '🟢',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-500/10',
    link: 'https://nodejs.org',
  },
  {
    name: 'Deepgram',
    role: 'Speech-to-Text',
    description: 'Nova-2 model for industry-leading STT that transcribes voice recordings with high accuracy.',
    logo: '🎤',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-500/10',
    link: 'https://deepgram.com',
  },
  {
    name: 'Groq LLM',
    role: 'AI Intelligence',
    description: 'Groq-powered Llama 3.3 70B generates lightning-fast, curriculum-aligned academic answers with conversation memory.',
    logo: '⚡',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-orange-500/10',
    link: 'https://groq.com',
  },
  {
    name: 'ElevenLabs',
    role: 'Text-to-Speech',
    description: 'Multilingual v2 model converts AI responses into natural, human-like voice output.',
    logo: '🔊',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-500/10',
    link: 'https://elevenlabs.io',
  },
  {
    name: 'MongoDB',
    role: 'Data Storage',
    description: 'Stores user profiles and conversation history for personalized, context-aware responses.',
    logo: '🗄️',
    color: 'from-green-600 to-emerald-600',
    bgColor: 'bg-green-500/10',
    link: 'https://mongodb.com',
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

export default function TechStack() {
  return (
    <section id="tech-stack" className="relative py-24 overflow-hidden bg-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium rounded-full bg-emerald-500/10 text-emerald-400">
            <Code2 className="w-4 h-4" />
            Technology Stack
          </div>
          <h2 className="section-heading text-white">
            Powered by <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="section-subheading">
            GuruCall combines best-in-class technologies to deliver a seamless, 
            reliable, and lightning-fast educational experience.
          </p>
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3"
        >
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              variants={itemVariants}
              className="group"
            >
              <div className="relative h-full p-6 transition-all duration-300 border rounded-2xl bg-dark-800/50 border-dark-700 hover:border-dark-600 hover:bg-dark-800/80">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex items-center justify-center w-14 h-14 text-2xl rounded-xl ${tech.bgColor}`}>
                    {tech.logo}
                  </div>
                  <a
                    href={tech.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 transition-colors rounded-lg text-dark-500 hover:text-white hover:bg-dark-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-white font-display">
                      {tech.name}
                    </h3>
                  </div>
                  <p className={`text-sm font-medium bg-gradient-to-r ${tech.color} bg-clip-text text-transparent mb-3`}>
                    {tech.role}
                  </p>
                  <p className="text-sm leading-relaxed text-dark-400">
                    {tech.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-20"
        >
          <div className="p-8 border rounded-2xl bg-dark-800/30 border-dark-700">
            <h3 className="mb-6 text-xl font-semibold text-center text-white font-display">
              System Architecture Flow
            </h3>
            
            {/* Flow Diagram */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { label: 'User Call', icon: '📞', color: 'bg-red-500/20 text-red-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'Cloud IVR', icon: '🔀', color: 'bg-red-500/20 text-red-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'Node.js API', icon: '⚡', color: 'bg-green-500/20 text-green-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'Deepgram STT', icon: '🎤', color: 'bg-purple-500/20 text-purple-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'Groq LLM', icon: '🧠', color: 'bg-orange-500/20 text-orange-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'ElevenLabs TTS', icon: '🔊', color: 'bg-cyan-500/20 text-cyan-400' },
                { label: '→', icon: '', color: 'text-dark-500 text-2xl' },
                { label: 'Voice Response', icon: '✅', color: 'bg-primary-500/20 text-primary-400' },
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${item.color}`}>
                  {item.icon && <span>{item.icon}</span>}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
