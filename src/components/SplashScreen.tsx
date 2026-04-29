import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface SplashScreenProps {
  onEnter: () => void;
  onPhaseChange?: (phase: string) => void;
}

export default function SplashScreen({ onEnter, onPhaseChange }: SplashScreenProps) {
  const { theme } = useTheme();
  const [phase, setPhase] = useState<'entering' | 'scanning' | 'ready' | 'fading'>('entering');
  const [mouseActive, setMouseActive] = useState(false);
  const [scanX, setScanX] = useState(-160);
  const containerRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // ready 阶段用 ref 追踪鼠标位置，避免 React 重渲染
  const targetX = useRef(0);
  const currentX = useRef(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lensWrapperRef = useRef<HTMLDivElement | null>(null);
  const lensTextRef = useRef<HTMLDivElement | null>(null);

  // 通知父组件
  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  // 入场后文字浮现
  useEffect(() => {
    const t = setTimeout(() => setPhase('scanning'), 600);
    return () => clearTimeout(t);
  }, []);

  // 扫描动画：用 state 驱动，确保 React 重渲染
  useEffect(() => {
    if (phase !== 'scanning') return;
    let startTime = 0;
    const duration = 2400;
    let raf: number;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const x = -160 + eased * 320;
      setScanX(x);

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setPhase('ready');
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // 鼠标移动：只在 ready 阶段响应，只水平
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (phase !== 'ready') return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetX.current = e.clientX - rect.left - rect.width / 2;
    if (!mouseActive) setMouseActive(true);
  }, [phase, mouseActive]);

  // 触摸移动：移动端支持
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (phase !== 'ready') return;
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    targetX.current = touch.clientX - rect.left - rect.width / 2;
    if (!mouseActive) setMouseActive(true);
  }, [phase, mouseActive]);

  // 触摸开始：阻止默认行为，确保 touchmove 能持续触发
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (phase !== 'ready') return;
    e.preventDefault();
  }, [phase]);

  // ready 阶段：raf 循环同步更新放大镜和文字
  useEffect(() => {
    if (phase !== 'ready') return;

    // 获取 DOM 引用
    lensWrapperRef.current = containerRef.current?.querySelector('.lens-wrapper') as HTMLDivElement | null;
    lensTextRef.current = containerRef.current?.querySelector('.lens-text') as HTMLDivElement | null;
    if (!lensWrapperRef.current || !lensTextRef.current) return;

    // 初始化当前位置为扫描结束位置
    currentX.current = scanX;
    targetX.current = scanX;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.2);
      const x = currentX.current;

      if (lensWrapperRef.current) {
        lensWrapperRef.current.style.transform = `translate(calc(-50% + ${x}px), -50%)`;
      }
      if (lensTextRef.current) {
        lensTextRef.current.style.transform = `translateX(${-x * 0.5}px) scale(1.5)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, scanX]);

  // 点击过场
  const handleClick = useCallback(() => {
    if (phase !== 'ready') return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setPhase('fading');
    setTimeout(() => {
      onEnter();
    }, 1800);
  }, [phase, onEnter]);

  const isLocked = phase === 'entering' || phase === 'scanning';
  const isFading = phase === 'fading';

  // 当前放大镜 x 位置：扫描阶段用 scanX state，ready 阶段用 currentX ref
  const lensX = isLocked ? scanX : currentX.current;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        cursor: isLocked ? 'default' : 'none',
        opacity: isFading ? 0 : 1,
        transition: 'opacity 1200ms ease 600ms',
        pointerEvents: isFading ? 'none' : 'auto',
        background: isDark ? '#080f1e' : 'white',
        touchAction: 'none',
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {/* 微网格背景 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${isDark ? '#4A90D9' : '#0A2463'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? '#4A90D9' : '#0A2463'} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.025,
        }}
      />

      {/* 星空背景（深色模式） */}
      {isDark && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: Math.random() * 2 + 1,
                height: Math.random() * 2 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>
      )}

      {/* 中央内容 */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: isFading ? 0 : 1,
          transform: isFading ? 'translateY(-40px)' : 'translateY(0)',
          transition: isFading
            ? 'opacity 600ms ease, transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
            : 'none',
        }}
      >
        {/* 文字 + 放大镜区域 */}
        <div className="relative" style={{ width: 560, height: 240 }}>

          {/* 底层文字 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h1
              className={`text-[52px] sm:text-[60px] font-extrabold tracking-tight leading-none ${
                isDark ? 'text-white' : 'text-insight-blue'
              }`}
              style={{
                opacity: phase === 'entering' ? 0 : 1,
                transform: phase === 'entering' ? 'translateY(16px)' : 'translateY(0)',
                transition: 'opacity 600ms ease, transform 700ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              InsightBit
            </h1>
            <p
              className={`text-xl sm:text-2xl font-medium tracking-[0.3em] mt-4 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
              style={{
                opacity: phase === 'entering' ? 0 : 1,
                transform: phase === 'entering' ? 'translateY(16px)' : 'translateY(0)',
                transition: 'opacity 600ms ease 150ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
              }}
            >
              拓知微科技
            </p>
          </div>

          {/* 放大镜 — 扫描阶段 state 驱动，ready 阶段 raf 驱动 */}
          <div
            className="lens-wrapper absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              opacity: phase === 'entering' ? 0 : 1,
              transform: `translate(calc(-50% + ${lensX}px), -50%)`,
              transition: 'opacity 400ms ease',
              willChange: 'transform',
            }}
          >
            {/* 手柄 */}
            <div className="absolute top-[74%] left-1/2 -translate-x-1/2">
              <div className={`w-2 h-20 rounded-full shadow-md ${isDark ? 'bg-[#4A90D9]' : 'bg-insight-blue'}`} />
              <div className={`absolute top-[72px] left-1/2 -translate-x-1/2 w-7 h-7 rounded-full shadow-md ${isDark ? 'bg-[#4A90D9]' : 'bg-insight-blue'}`} />
              <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${isDark ? 'bg-[#4A90D9]' : 'bg-insight-blue'}`} />
            </div>

            {/* 镜片 */}
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                width: 170,
                height: 170,
                background: isDark ? 'rgba(10,22,40,0.97)' : 'rgba(255,255,255,0.97)',
                border: `2px solid ${isDark ? '#4A90D9' : '#0A2463'}`,
                boxShadow: isDark
                  ? '0 6px 24px rgba(74, 144, 217, 0.2)'
                  : '0 6px 24px rgba(10, 36, 99, 0.1)',
              }}
            >
              {/* 玻璃反光 */}
              <div className={`absolute inset-0 rounded-full pointer-events-none z-20 ${isDark ? 'bg-gradient-to-br from-[#4A90D9]/20 via-transparent to-transparent' : 'bg-gradient-to-br from-white/70 via-transparent to-insight-blue/5'}`} />
              <div className={`absolute top-3 left-4 w-9 h-5 rounded-full -rotate-45 pointer-events-none z-20 ${isDark ? 'bg-white/20' : 'bg-white/40'}`} />

              {/* 放大文字层 */}
              <div
                className="lens-text absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  transform: `translateX(${-lensX * 0.5}px) scale(1.5)`,
                  willChange: 'transform',
                }}
              >
                <h2
                  className={`font-extrabold tracking-tight leading-none whitespace-nowrap ${isDark ? 'text-white' : 'text-insight-blue'}`}
                  style={{ fontSize: 90 }}
                >
                  InsightBit
                </h2>
                <p
                  className={`font-medium tracking-[0.25em] mt-2 whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-400'}`}
                  style={{ fontSize: 33 }}
                >
                  拓知微科技
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div
          className="mt-10 flex flex-col items-center gap-2"
          style={{
            opacity: phase === 'ready' ? 1 : 0,
            transform: phase === 'ready' ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 400ms ease, transform 400ms ease',
            pointerEvents: 'none',
          }}
        >
          <span className={`text-sm font-medium tracking-widest ${isDark ? 'text-[#4A90D9]' : 'text-insight-blue'}`}>
            开始洞悉
          </span>
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {mouseActive ? '点击开始' : '移动放大镜探索'}
          </span>
        </div>
      </div>

      {/* 扫描进度指示 */}
      {isLocked && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className={`w-32 h-0.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
            <div
              className={`h-full rounded-full ${isDark ? 'bg-[#4A90D9]' : 'bg-insight-blue'}`}
              style={{
                width: `${((scanX + 160) / 320) * 100}%`,
                transition: 'width 80ms linear',
              }}
            />
          </div>
          <span className={`text-[10px] tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>INITIALIZING SCAN</span>
        </div>
      )}
    </div>
  );
}
