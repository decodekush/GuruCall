import { motion } from 'framer-motion';
import { Phone, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';

const benefits = [
  'Free to try - no credit card required',
  'Works on any phone device',
  'Available 24/7 worldwide',
  'Instant AI-powered answers',
];

export default function CTA() {
  return (
    <section className="relative py-24 overflow-hidden bg-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 mx-auto max-w-5xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative p-8 overflow-hidden border md:p-12 rounded-3xl bg-dark-800/50 border-dark-700 backdrop-blur-sm"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary-500/10 text-primary-400">
                <Sparkles className="w-4 h-4" />
                Get Started Today
              </div>
              
              <h2 className="text-3xl font-bold text-white sm:text-4xl font-display">
                Ready to Transform
                <span className="gradient-text"> Learning?</span>
              </h2>
              
              <p className="mt-4 text-lg text-dark-300">
                Join thousands of learners who are already using GuruCall to get 
                instant answers to their academic questions. No app, no internet — just call.
              </p>

              {/* Benefits */}
              <ul className="mt-6 space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 text-dark-200"
                  >
                    <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* CTA Card */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="p-8 text-center border rounded-2xl bg-dark-900/80 border-dark-600"
              >
                {/* Phone Icon */}
                <motion.div
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
                  className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-glow"
                >
                  <Phone className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="mb-2 text-xl font-semibold text-white font-display">
                  Call GuruCall Now
                </h3>
                <p className="mb-6 text-dark-400">
                  Dial the number below to start learning
                </p>

                {/* Phone Number */}
                <div className="px-6 py-4 mb-6 text-2xl font-bold text-white rounded-xl bg-dark-800 font-mono">
                  +1 (800) GURU-CALL
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-secondary gap-2"
                  >
                    Learn More
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
