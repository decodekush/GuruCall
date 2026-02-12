import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Atom, 
  Stethoscope, 
  TrendingUp, 
  Palette,
  Baby,
  School
} from 'lucide-react';

const categories = [
  {
    digit: '1',
    level: 'Class 1-5',
    icon: Baby,
    description: 'Basic, playful explanations designed for young learners with simple language and fun examples.',
    tone: 'Playful & Simple',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
  },
  {
    digit: '2',
    level: 'Class 6-10',
    icon: School,
    description: 'School-level content with relatable examples and clear concept breakdowns.',
    tone: 'Relatable & Clear',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  {
    digit: '3',
    level: 'Class 11-12',
    icon: BookOpen,
    description: 'Conceptual depth with academic tone, preparing students for higher education.',
    tone: 'Academic & Conceptual',
    color: 'from-violet-500 to-purple-500',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
  },
  {
    digit: '4',
    level: 'Engineering',
    icon: Atom,
    description: 'Technical depth covering physics, mathematics, computer science, and engineering concepts.',
    tone: 'Technical & Precise',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  {
    digit: '5',
    level: 'Medical',
    icon: Stethoscope,
    description: 'Clinical relevance with medical terminology and healthcare-focused explanations.',
    tone: 'Clinical & Detailed',
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    digit: '6',
    level: 'Commerce',
    icon: TrendingUp,
    description: 'Economics, business studies, accounting, and financial concepts explained clearly.',
    tone: 'Business-Oriented',
    color: 'from-amber-500 to-yellow-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  {
    digit: '7',
    level: 'Arts',
    icon: Palette,
    description: 'Social sciences, history, literature, and creative subjects with contextual depth.',
    tone: 'Creative & Contextual',
    color: 'from-fuchsia-500 to-pink-500',
    bgColor: 'bg-fuchsia-500/10',
    borderColor: 'border-fuchsia-500/30',
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
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4 },
  },
};

export default function Categories() {
  return (
    <section id="categories" className="relative py-24 overflow-hidden bg-dark-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium rounded-full bg-violet-500/10 text-violet-400">
            <GraduationCap className="w-4 h-4" />
            Education Levels
          </div>
          <h2 className="section-heading text-white">
            <span className="gradient-text">7 Academic Domains</span> Covered
          </h2>
          <p className="section-subheading">
            Press a digit (1-7) to select your education level. GuruCall adapts its 
            explanations to match your academic background and learning needs.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 mt-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {categories.map((category) => (
            <motion.div
              key={category.digit}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className={`relative h-full p-6 transition-all duration-300 border rounded-2xl bg-dark-900/50 backdrop-blur-sm ${category.borderColor} hover:bg-dark-900/80`}>
                {/* Digit Badge */}
                <div className={`absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                  {category.digit}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${category.bgColor} flex items-center justify-center mb-4`}>
                  <category.icon className={`w-7 h-7 bg-gradient-to-r ${category.color} bg-clip-text`} style={{ color: category.color.includes('pink') ? '#ec4899' : category.color.includes('blue') ? '#3b82f6' : category.color.includes('violet') ? '#8b5cf6' : category.color.includes('emerald') ? '#10b981' : category.color.includes('red') ? '#ef4444' : category.color.includes('amber') ? '#f59e0b' : '#d946ef' }} />
                </div>

                {/* Content */}
                <h3 className="mb-1 text-xl font-semibold text-white font-display">
                  {category.level}
                </h3>
                <p className={`text-sm font-medium mb-3 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                  {category.tone}
                </p>
                <p className="text-sm leading-relaxed text-dark-400">
                  {category.description}
                </p>

                {/* Press Indicator */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-dark-800">
                  <div className={`px-2 py-1 text-xs font-mono rounded bg-dark-800 text-dark-300`}>
                    Press {category.digit}
                  </div>
                  <span className="text-xs text-dark-500">on keypad</span>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="p-6 text-center border rounded-2xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-dark-700">
            <h3 className="mb-2 text-lg font-semibold text-white font-display">
              Personalized Learning Experience
            </h3>
            <p className="text-dark-300">
              Each level is fine-tuned to deliver age-appropriate content with the right tone, 
              complexity, and examples. Our AI ensures every answer matches your learning stage.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
