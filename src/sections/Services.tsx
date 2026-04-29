import { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, Code2, Smartphone, Cloud, Brain, Palette } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const services = [
  {
    id: '01',
    title: '企业级软件开发',
    titleEn: 'Enterprise Software',
    description: '基于微服务架构的高可用企业系统，支持百万级并发，确保业务连续性。',
    icon: Code2,
    image: 'images/service-enterprise.jpg',
  },
  {
    id: '02',
    title: '移动应用开发',
    titleEn: 'Mobile App Development',
    description: 'iOS / Android 原生及跨平台应用开发，打造流畅的用户体验和强劲的性能表现。',
    icon: Smartphone,
    image: 'images/service-mobile.jpg',
  },
  {
    id: '03',
    title: '云原生架构',
    titleEn: 'Cloud Architecture',
    description: '基于 Kubernetes、Docker 的容器化部署方案，实现弹性伸缩和自动化运维。',
    icon: Cloud,
    image: 'images/service-cloud.jpg',
  },
  {
    id: '04',
    title: 'AI 智能集成',
    titleEn: 'AI Integration',
    description: '将机器学习、自然语言处理和计算机视觉技术融入您的产品，释放数据价值。',
    icon: Brain,
    image: 'images/service-ai.jpg',
  },
  {
    id: '05',
    title: 'UI/UX 设计',
    titleEn: 'UI/UX Design',
    description: '以用户为中心的产品设计方法论，打造直观、美观且高效的交互体验。',
    icon: Palette,
    image: 'images/service-uiux.jpg',
  },
];

export default function Services() {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`py-20 lg:py-32 section-padding transition-colors duration-700 ${
        isDark ? 'bg-[#080f1e]' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Sticky Header */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
              >
                <span className={`text-xs font-semibold tracking-widest uppercase mb-4 block ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  WHAT WE DO
                </span>
                <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-6 ${
                  isDark ? 'text-white' : 'text-insight-blue'
                }`}>
                  我们的
                  <br />
                  <span className="text-insight-yellow">核心服务</span>
                </h2>
                <p className={`text-sm lg:text-base leading-relaxed max-w-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  从需求分析到产品交付，我们提供端到端的软件开发服务，助力企业数字化转型。
                </p>
              </div>
            </div>
          </div>

          {/* Right: Service List */}
          <div className="lg:col-span-8">
            <div className="space-y-3">
              {services.map((service, index) => {
                const Icon = service.icon;
                const isActive = activeIndex === index;

                return (
                  <div
                    key={service.id}
                    className={`group rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8'
                    } ${
                      isActive
                        ? (isDark ? 'border-[#4A90D9]/50 bg-[#0f1f38]' : 'border-insight-blue/30 bg-insight-blue/[0.02]')
                        : (isDark ? 'border-white/5 bg-transparent' : 'border-insight-gray/60 bg-transparent')
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {/* Main Row */}
                    <div className="flex items-center gap-4 lg:gap-6 py-5 lg:py-6 px-5 lg:px-6">
                      {/* Number */}
                      <span
                        className={`font-mono text-sm font-bold transition-colors duration-300 shrink-0 w-6 ${
                          isActive ? 'text-insight-yellow' : isDark ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      >
                        {service.id}
                      </span>

                      {/* Icon */}
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isActive
                            ? (isDark ? 'bg-[#4A90D9] text-[#E5B80B]' : 'bg-insight-blue text-insight-yellow')
                            : (isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400')
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3
                            className={`text-base lg:text-lg font-semibold transition-colors duration-300 ${
                              isActive
                                ? (isDark ? 'text-[#4A90D9]' : 'text-insight-blue')
                                : (isDark ? 'text-gray-200' : 'text-gray-700')
                            }`}
                          >
                            {service.title}
                          </h3>
                          <span className={`hidden lg:inline text-xs font-medium ${
                            isDark ? 'text-gray-600' : 'text-gray-400'
                          }`}>
                            {service.titleEn}
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <ArrowUpRight
                        className={`w-5 h-5 transition-all duration-300 shrink-0 ${
                          isActive
                            ? 'text-insight-yellow translate-x-0 translate-y-0 opacity-100'
                            : (isDark ? 'text-gray-600 opacity-0' : 'text-gray-300 opacity-0')
                        }`}
                      />
                    </div>

                    {/* Expand Detail Row — 图片在文字下方，不遮挡 */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-out ${
                        isActive ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                          {/* Description */}
                          <p className={`text-sm leading-relaxed flex-1 ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {service.description}
                          </p>
                          {/* Image — 右侧小缩略图，与文字并排 */}
                          <div className="w-full sm:w-48 lg:w-56 aspect-video rounded-lg overflow-hidden shadow-md shrink-0">
                            <img
                              src={import.meta.env.BASE_URL + service.image}
                              alt={service.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
