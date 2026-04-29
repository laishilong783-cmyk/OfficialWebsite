import { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../hooks/useTheme';

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { value: 150, suffix: '+', label: '成功案例', decimals: 0 },
  { value: 99.9, suffix: '%', label: '系统稳定性', decimals: 1 },
  { value: 24, suffix: '/7', label: '技术支持', decimals: 0 },
  { value: 10, suffix: '年', label: '行业深耕', decimals: 0 },
];

function RollingNumber({ target, suffix, prefix, decimals, isVisible }: {
  target: number;
  suffix: string;
  prefix?: string;
  decimals: number;
  isVisible: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const duration = 2000;

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = target * eased;
    setDisplay(current);

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [target]);

  useEffect(() => {
    if (isVisible) {
      startTimeRef.current = undefined;
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, animate]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.floor(display).toString();

  return (
    <span className="font-mono">
      {prefix && <span>{prefix}</span>}
      <span>{formatted}</span>
      <span className="text-insight-yellow">{suffix}</span>
    </span>
  );
}

export default function DataStats() {
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
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stats"
      ref={sectionRef}
      className={`py-20 lg:py-32 section-padding transition-colors duration-700 ${
        isDark ? 'bg-[#0a1e3d]' : 'bg-insight-blue'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className={`text-xs font-semibold tracking-widest uppercase mb-4 block ${
            isDark ? 'text-white/30' : 'text-white/40'
          }`}>
            DATA & IMPACT
          </span>
          <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${
            isDark ? 'text-white' : 'text-white'
          }`}>
            数字见证实力
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3">
                <RollingNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals || 0}
                  isVisible={isVisible}
                />
              </div>
              <div className={`text-sm font-medium ${
                isDark ? 'text-white/50' : 'text-white/60'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
