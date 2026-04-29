import { useState, useCallback } from 'react';
import { ThemeProvider } from '../hooks/useTheme';
import SplashScreen from '../components/SplashScreen';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Keywords from '../sections/Keywords';
import Services from '../sections/Services';
import TechStack from '../sections/TechStack';
import DataStats from '../sections/DataStats';
import Contact from '../sections/Contact';

function AppContent() {
  const [entered, setEntered] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleEnter = useCallback(() => {
    setEntered(true);
  }, []);

  const handlePhaseChange = useCallback((phase: string) => {
    if (phase === 'fading') {
      setContentVisible(true);
    }
  }, []);

  return (
    <div className="relative">
      {/* 官网内容 - 预渲染在底层 */}
      <div
        className="relative z-0"
        style={{
          opacity: contentVisible ? 1 : 0,
          transform: contentVisible
            ? 'translateY(0) scale(1)'
            : 'translateY(30px) scale(0.98)',
          filter: contentVisible ? 'blur(0px)' : 'blur(2px)',
          transition: contentVisible
            ? 'opacity 1000ms ease 300ms, transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) 300ms, filter 800ms ease 400ms'
            : 'none',
          pointerEvents: contentVisible ? 'auto' : 'none',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <Keywords />
          <Services />
          <TechStack />
          <DataStats />
          <Contact />
        </main>
      </div>

      {/* Splash Screen */}
      {!entered && (
        <SplashScreen
          onEnter={handleEnter}
          onPhaseChange={handlePhaseChange}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
