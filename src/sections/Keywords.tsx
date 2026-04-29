import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const keywords = [
  '可靠架构',
  '高性能交付',
  '全栈解决方案',
  '数据驱动',
  '云原生',
  '敏捷开发',
  '安全合规',
  '持续集成',
  '微服务',
  'DevOps',
];

export default function Keywords() {
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`py-12 lg:py-16 section-padding transition-colors duration-700 ${
      isDark ? 'bg-[#080f1e]' : 'bg-white'
    }`}>
      <div className="max-w-5xl mx-auto">
        <div
          className={`text-center mb-8 transition-all duration-600 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className={`text-[10px] font-semibold tracking-[0.3em] uppercase ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            WHAT WE DO BEST
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3 lg:gap-4">
          {keywords.map((word, index) => (
            <span
              key={word}
              className={`inline-flex items-center px-5 py-2.5 rounded-full border text-sm font-medium
                transition-all duration-500 ease-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                ${isDark
                  ? 'border-white/10 text-gray-300 bg-[#0f1f38] hover:border-[#4A90D9] hover:text-[#4A90D9] hover:bg-[#4A90D9]/10 hover:shadow-sm hover:-translate-y-0.5'
                  : 'border-insight-gray text-gray-600 bg-white hover:border-insight-blue hover:text-insight-blue hover:bg-insight-blue/5 hover:shadow-sm hover:-translate-y-0.5'
                }
              `}
              style={{
                transitionDelay: isVisible ? `${index * 50}ms` : '0ms',
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
