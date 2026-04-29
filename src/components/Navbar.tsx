import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const navItems = [
  { label: '首页', href: '#hero' },
  { label: '服务', href: '#services' },
  { label: '技术栈', href: '#techstack' },
  { label: '数据', href: '#stats' },
  { label: '联系', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav shadow-sm dark:bg-[#0a1628]/90 dark:backdrop-blur-xl dark:border-b dark:border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="section-padding">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-insight-blue dark:bg-[#4A90D9] flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-insight-yellow font-bold text-sm lg:text-base font-mono">IB</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-insight-blue dark:text-white font-bold text-sm lg:text-base tracking-tight">InsightBit</span>
              <span className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400 font-medium">拓知微科技</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-insight-blue dark:hover:text-[#4A90D9] transition-colors link-underline"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right: Theme Toggle + CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 dark:hover:bg-white/20"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-insight-blue" />
              ) : (
                <Sun className="w-4 h-4 text-[#E5B80B]" />
              )}
            </button>

            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              className="btn-primary text-sm"
            >
              立即咨询
            </a>
          </div>

          {/* Mobile: Theme Toggle + Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center transition-all duration-300 hover:bg-gray-200 dark:hover:bg-white/20"
              aria-label={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-insight-blue" />
              ) : (
                <Sun className="w-4 h-4 text-[#E5B80B]" />
              )}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-insight-blue dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-insight-blue dark:text-white" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-nav dark:bg-[#0a1628]/95 border-t border-insight-gray dark:border-white/5 px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-insight-blue dark:hover:text-[#4A90D9] transition-colors py-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
                className="btn-primary w-full text-sm"
              >
                立即咨询
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
