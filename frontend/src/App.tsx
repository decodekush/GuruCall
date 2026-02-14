import { useEffect } from 'react';
import { 
  Navbar, 
  Hero, 
  Features, 
  HowItWorks, 
  TechStack, 
  Categories, 
  VoiceDemo,
  CTA, 
  Footer 
} from './components';

function App() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TechStack />
        <Categories />
        <VoiceDemo />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
