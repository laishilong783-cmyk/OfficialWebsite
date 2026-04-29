const items = [
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

export default function Marquee() {
  const renderItems = () => (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-5 mx-5 shrink-0">
          <span className="text-[15px] lg:text-base font-medium text-white/90 whitespace-nowrap tracking-wide">
            {item}
          </span>
          <span className="text-insight-yellow/60 text-sm shrink-0 font-light">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <section className="relative bg-insight-blue overflow-hidden py-4 lg:py-5">
      {/* 上沿渐变过渡 - 从 Hero 白色自然融入 */}
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />

      {/* 滚动内容 */}
      <div className="flex">
        <div className="flex animate-marquee">
          {renderItems()}
          {renderItems()}
        </div>
        <div className="flex animate-marquee" aria-hidden="true">
          {renderItems()}
          {renderItems()}
        </div>
      </div>

      {/* 下沿渐变过渡 */}
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white/5 to-transparent pointer-events-none z-10" />
    </section>
  );
}
