import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(false);
      }
    };

    const animate = () => {
      // 更快的跟随：0.25 lerp 系数（之前是0.15，太慢）
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.25;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.25;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetRef.current.x}px, ${targetRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    rafRef.current = requestAnimationFrame(animate);

    document.body.style.cursor = 'none';
    // 隐藏所有交互元素的默认光标
    const style = document.createElement('style');
    style.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = 'auto';
      document.head.removeChild(style);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* 外圈环形光标 - 更大更明显 */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full border-2 border-insight-blue/80 transition-all duration-150 ${
            isHovering
              ? 'w-14 h-14 bg-insight-blue/15 border-insight-blue/50'
              : 'w-10 h-10 bg-transparent'
          }`}
          style={{
            boxShadow: isHovering
              ? '0 0 20px rgba(10, 36, 99, 0.25)'
              : '0 0 8px rgba(10, 36, 99, 0.15)',
          }}
        />
      </div>

      {/* 中心点 */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovering
              ? 'w-3 h-3 bg-insight-yellow shadow-lg shadow-insight-yellow/40'
              : 'w-2 h-2 bg-insight-blue'
          }`}
        />
      </div>
    </>
  );
}
