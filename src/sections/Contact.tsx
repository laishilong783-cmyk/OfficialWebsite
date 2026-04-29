import { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Contact() {
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
    <section
      id="contact"
      ref={sectionRef}
      className={`py-20 lg:py-32 section-padding transition-colors duration-700 ${
        isDark ? 'bg-[#080f1e]' : 'bg-white'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Main Contact */}
        <div
          className={`text-center mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className={`text-xs font-semibold tracking-widest uppercase mb-4 block ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>
            CONTACT US
          </span>
          <h2 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-8 ${
            isDark ? 'text-white' : 'text-insight-blue'
          }`}>
            LET'S TALK.
          </h2>
          <a
            href="mailto:hello@insightbit.tech"
            className={`inline-flex items-center gap-3 text-xl lg:text-2xl font-semibold transition-colors duration-300 group link-underline ${
              isDark ? 'text-[#4A90D9] hover:text-insight-yellow' : 'text-insight-blue hover:text-insight-yellow'
            }`}
          >
            <Mail className="w-6 h-6" />
            <span>hello@insightbit.tech</span>
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>

        {/* Contact Info Grid */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          {[
            { icon: MapPin, title: '总部地址', lines: ['深圳市南山区科技园', '高新南一道数字技术园 A座 18层'] },
            { icon: Phone, title: '商务咨询', lines: ['+86 755 8888 6666', '周一至周五 9:00 - 18:00'] },
            { icon: Mail, title: '合作邮箱', lines: ['business@insightbit.tech', '通常在 24 小时内回复'] },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className={`p-6 lg:p-8 rounded-xl border transition-colors duration-300 hover:border-insight-blue/30 ${
                  isDark
                    ? 'bg-[#0f1f38] border-white/10 hover:border-[#4A90D9]/40'
                    : 'bg-insight-light border-insight-gray hover:border-insight-blue/30'
                }`}
              >
                <Icon className={`w-6 h-6 mb-4 ${isDark ? 'text-[#4A90D9]' : 'text-insight-blue'}`} />
                <h3 className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-insight-blue'}`}>
                  {card.title}
                </h3>
                {card.lines.map((line, i) => (
                  <p key={i} className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {line}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className={`border-t pt-12 transition-colors duration-700 ${
        isDark ? 'border-white/10' : 'border-insight-gray'
      }`}>
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isDark ? 'bg-[#4A90D9]' : 'bg-insight-blue'
              }`}>
                <span className="text-insight-yellow font-bold text-sm font-mono">IB</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className={`font-bold text-sm tracking-tight ${isDark ? 'text-white' : 'text-insight-blue'}`}>InsightBit</span>
                <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-400'}`}>拓知微科技</span>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 lg:gap-8">
              {[
                { label: '首页', href: '#hero' },
                { label: '服务', href: '#services' },
                { label: '技术栈', href: '#techstack' },
                { label: '隐私政策', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('#') && link.href !== '#') {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`text-sm transition-colors ${
                    isDark ? 'text-gray-400 hover:text-[#4A90D9]' : 'text-gray-500 hover:text-insight-blue'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-4">
              {[
                { label: 'GitHub', href: 'https://github.com' },
                { label: 'LinkedIn', href: 'https://linkedin.com' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 text-gray-400 hover:text-[#4A90D9] hover:bg-[#4A90D9]/10'
                      : 'bg-insight-light text-gray-400 hover:text-insight-blue hover:bg-insight-blue/5'
                  }`}
                  aria-label={social.label}
                >
                  {social.label === 'GitHub' ? <Github className="w-5 h-5" /> : <Linkedin className="w-5 h-5" />}
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className={`mt-12 pt-8 border-t text-center transition-colors duration-700 ${
            isDark ? 'border-white/10' : 'border-insight-gray'
          }`}>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} InsightBit 拓知微科技有限公司. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
