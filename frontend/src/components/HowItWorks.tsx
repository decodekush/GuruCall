import { motion } from 'framer-motion';
import { Phone, Keyboard, Mic, Brain, Volume2, CheckCircle, ArrowDown } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Phone,
    title: 'Call the Number',
    description: 'Dial the GuruCall Twilio number from any phone — mobile, landline, or smartphone.',
    color: 'primary',
    details: ['No app download needed', 'Works without internet', 'Available 24/7'],
  },
  {
    number: '02',
    icon: Keyboard,
    title: 'Select Education Level',
    description: 'Use keypad input (1-7) to choose your academic level for personalized responses.',
    color: 'accent',
    details: ['Class 1-5, 6-10, 11-12', 'Engineering, Medical', 'Commerce, Arts'],
  },
  {
    number: '03',
    icon: Mic,
    title: 'Ask Your Question',
    description: 'Speak your academic question naturally after the beep. Our AI listens carefully.',
    color: 'emerald',
    details: ['Deepgram STT processing', 'Natural language support', 'Multi-language ready'],
  },
  {
    number: '04',
    icon: Brain,
    title: 'AI Processing',
    description: 'GPT-4o analyzes your question and generates a curriculum-aligned explanation.',
    color: 'amber',
    details: ['Contextual understanding', 'Age-appropriate content', 'Sub-3s processing'],
  },
  {
    number: '05',
    icon: Volume2,
    title: 'Receive Answer',
    description: 'Listen to your personalized answer delivered in a natural, clear voice.',
    color: 'rose',
    details: ['ElevenLabs TTS', 'Human-like voice', 'Crystal clear audio'],
  },
];

const colorMap: Record<string, { gradient: string; bg: string; text: string; border: string }> = {
  primary: {
    gradient: 'from-primary-500 to-primary-600',
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    border: 'border-primary-500/30',
  },
  accent: {
    gradient: 'from-accent-500 to-accent-600',
    bg: 'bg-accent-500/10',
    text: 'text-accent-400',
    border: 'border-accent-500/30',
  },
  emerald: {
    gradient: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  amber: {
    gradient: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  rose: {
    gradient: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-dark-950">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-700 to-transparent" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium rounded-full bg-accent-500/10 text-accent-400">
            <Phone className="w-4 h-4" />
            Simple Process
          </div>
          <h2 className="section-heading text-white">
            How <span className="gradient-text-accent">GuruCall</span> Works
          </h2>
          <p className="section-subheading">
            From dial to answer in under 3 seconds. Here's how our voice-first 
            AI tutor transforms your phone into a learning device.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-20">
          {/* Connecting Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-primary-500/50 via-accent-500/50 to-rose-500/50 hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => {
              const colors = colorMap[step.color];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-16 ${
                    index !== steps.length - 1 ? 'lg:pb-16' : ''
                  }`}
                >
                  {/* Step Card */}
                  <div className={`${isEven ? 'lg:pr-16' : 'lg:col-start-2 lg:pl-16'}`}>
                    <div className={`relative p-6 rounded-2xl border ${colors.border} bg-dark-900/50 backdrop-blur-sm`}>
                      {/* Step Number */}
                      <div className={`absolute -top-4 ${isEven ? 'left-6' : 'right-6'} px-3 py-1 text-sm font-bold rounded-full bg-gradient-to-r ${colors.gradient} text-white`}>
                        Step {step.number}
                      </div>

                      <div className="flex items-start gap-4 mt-2">
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center`}>
                          <step.icon className={`w-7 h-7 ${colors.text}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white font-display">
                            {step.title}
                          </h3>
                          <p className="mt-2 text-dark-400">
                            {step.description}
                          </p>

                          {/* Details */}
                          <ul className="mt-4 space-y-2">
                            {step.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-dark-300">
                                <CheckCircle className={`w-4 h-4 ${colors.text}`} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} ring-4 ring-dark-950`} />
                  </div>

                  {/* Arrow */}
                  {index !== steps.length - 1 && (
                    <div className="flex justify-center my-6 lg:hidden">
                      <ArrowDown className={`w-6 h-6 ${colorMap[steps[index + 1].color].text}`} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-dark-800/50 border border-dark-700">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-accent-500">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm text-dark-400">Ready to experience it?</p>
              <p className="text-lg font-semibold text-white">Call now and ask your first question!</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
