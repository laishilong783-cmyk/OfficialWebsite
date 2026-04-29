import { useEffect, useState, lazy, Suspense } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const HeroCanvas = lazy(() => import('../components/HeroCanvas'));
const StarfieldCanvas = lazy(() => import('../components/StarfieldCanvas'));

function CanvasFallback() {
  return (
    <div className="absolute inset-0 w-full h-full flex items-center justify-center">
      <div className="w-64 h-64 rounded-full bg-insight-blue/[0.03] dark:bg-white/[0.02] blur-3xl" />
    </div>
  );
}

export default function Hero() {
  const { theme } = useTheme();
  const [showCanvas, setShowCanvas] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCanvas(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleExplore = () => {
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden transition-colors duration-700 ${
        isDark ? 'bg-[#080f1e]' : 'bg-white'
      }`}
    >
      {/* Background Layer */}
      {showCanvas && (
        <Suspense fallback={<CanvasFallback />}>
          {isDark ? <StarfieldCanvas /> : <HeroCanvas />}
        </Suspense>
      )}
      {!showCanvas && <CanvasFallback />}

      {/* Content Layer */}
      <div className="relative z-10 w-full section-padding">
        <div className="flex flex-col items-center text-center py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-slide-up" style={{ animationDelay: '0s' }}>
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide mb-6 shadow-sm backdrop-blur-sm ${
                isDark
                  ? 'bg-white/10 border-white/10 text-[#4A90D9]'
                  : 'bg-insight-blue/5 border-insight-blue/10 text-insight-blue'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-insight-yellow animate-pulse" />
                软件定制开发专家
              </span>
            </div>

            {/* Main Title */}
            <h1 className={`animate-slide-up text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] mb-6 drop-shadow-sm ${
              isDark ? 'text-white' : 'text-insight-blue'
            }`} style={{ animationDelay: '0.15s' }}>
              以代码，
              <br />
              <span className={isDark ? 'text-[#6BB3FF]' : 'text-[#1E40AF]'}>重构万物</span>
            </h1>

            {/* Subtitle */}
            <p className={`animate-slide-up text-base lg:text-lg leading-relaxed mb-8 max-w-lg mx-auto ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`} style={{ animationDelay: '0.3s' }}>
              InsightBit（拓知微科技）—— 提供深度定制的软件架构与数字化转型方案，用技术驱动业务增长。
            </p>

            {/* Buttons */}
            <div className="animate-slide-up flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: '0.45s' }}>
              <button
                onClick={handleExplore}
                className={`btn-primary group shadow-lg ${isDark ? 'shadow-[#4A90D9]/20' : ''}`}
              >
                <span>探索解决方案</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#techstack"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#techstack')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`btn-outline backdrop-blur-sm ${
                  isDark ? 'bg-white/5' : 'bg-white/60'
                }`}
              >
                技术能力
              </a>
            </div>

            {/* Stats Preview */}
            <div className={`animate-slide-up mt-14 pt-8 border-t ${
              isDark ? 'border-white/10' : 'border-insight-gray/60'
            }`} style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-center gap-8 lg:gap-16">
                <div>
                  <div className={`text-2xl lg:text-3xl font-bold font-mono ${isDark ? 'text-white' : 'text-insight-blue'}`}>
                    150<span className="text-insight-yellow">+</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>成功案例</div>
                </div>
                <div>
                  <div className={`text-2xl lg:text-3xl font-bold font-mono ${isDark ? 'text-white' : 'text-insight-blue'}`}>
                    99.9<span className="text-insight-yellow">%</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>系统稳定性</div>
                </div>
                <div>
                  <div className={`text-2xl lg:text-3xl font-bold font-mono ${isDark ? 'text-white' : 'text-insight-blue'}`}>
                    10<span className="text-insight-yellow">年</span>
                  </div>
                  <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>行业深耕</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2 animate-bounce">
        <span className={`text-[10px] tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>SCROLL</span>
        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>

      {/* Bottom fade */}
      <div className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10 transition-colors duration-700 ${
        isDark ? 'bg-gradient-to-t from-[#080f1e] to-transparent' : 'bg-gradient-to-t from-white to-transparent'
      }`} />
    </section>
  );
}
