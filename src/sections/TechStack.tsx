import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const techStack = [
  { name: 'React', category: 'Frontend', description: '组件化UI开发框架' },
  { name: 'Vue', category: 'Frontend', description: '渐进式JavaScript框架' },
  { name: 'Node.js', category: 'Backend', description: '高性能服务端运行时' },
  { name: 'Python', category: 'Backend', description: 'AI与数据处理首选' },
  { name: 'Go', category: 'Backend', description: '高并发微服务利器' },
  { name: 'Kubernetes', category: 'DevOps', description: '容器编排平台' },
  { name: 'AWS', category: 'Cloud', description: '全球领先的云服务' },
  { name: 'Flutter', category: 'Mobile', description: '跨平台移动开发' },
  { name: 'PostgreSQL', category: 'Database', description: '企业级关系型数据库' },
];

export default function TechStack() {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="techstack"
      ref={sectionRef}
      className={`py-20 lg:py-32 section-padding transition-colors duration-700 ${
        isDark ? 'bg-[#0a1628]' : 'bg-insight-light'
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
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            TECHNOLOGY THAT POWERS US
          </span>
          <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ${
            isDark ? 'text-white' : 'text-insight-blue'
          }`}>
            核心技术栈
          </h2>
          <p className={`mt-4 max-w-lg mx-auto text-sm lg:text-base ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            我们采用业界领先的技术方案，确保产品的高性能、可扩展性和安全性。
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {techStack.map((tech, index) => (
            <div
              key={tech.name}
              className={`card-tech group relative overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              {/* Background watermark */}
              <div className={`absolute -right-4 -bottom-4 text-7xl font-bold font-mono select-none transition-all duration-500 group-hover:scale-110 ${
                isDark ? 'text-white/[0.03] group-hover:text-[#4A90D9]/[0.06]' : 'text-gray-100/50 group-hover:text-insight-blue/5'
              }`}>
                {tech.name.charAt(0)}
              </div>

              <div className="relative z-10">
                <span className={`text-[10px] font-semibold tracking-wider uppercase ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {tech.category}
                </span>
                <h3 className={`text-lg lg:text-xl font-bold mt-1 transition-colors duration-300 ${
                  isDark
                    ? 'text-white group-hover:text-insight-yellow'
                    : 'text-insight-blue group-hover:text-insight-yellow'
                }`}>
                  {tech.name}
                </h3>
                <p className={`text-xs mt-2 leading-relaxed ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {tech.description}
                </p>
              </div>

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 transition-all duration-300 opacity-0 group-hover:opacity-100">
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-insight-yellow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
