import { 
  Navbar, 
  Hero, 
  Features, 
  HowItWorks, 
  TechStack, 
  Categories, 
  CTA, 
  Footer 
} from './components';

function App() {
  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <TechStack />
        <Categories />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
