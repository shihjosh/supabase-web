const equipmentIcons = [
  { icon: "⚔️", top: "12%", left: "6%", size: "text-3xl", delay: "0s" },
  { icon: "🛡️", top: "68%", left: "9%", size: "text-4xl", delay: "1.2s" },
  { icon: "🏹", top: "22%", left: "88%", size: "text-3xl", delay: "0.6s" },
  { icon: "🗡️", top: "78%", left: "85%", size: "text-2xl", delay: "1.8s" },
  { icon: "🔰", top: "48%", left: "4%", size: "text-2xl", delay: "2.4s" },
  { icon: "🪓", top: "8%", left: "80%", size: "text-2xl", delay: "0.9s" },
  { icon: "🧪", top: "88%", left: "50%", size: "text-2xl", delay: "1.5s" },
  { icon: "💎", top: "35%", left: "94%", size: "text-xl", delay: "2.1s" },
];

const embers = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3) % 100}%`,
  delay: `${(i * 0.6) % 8}s`,
  duration: `${4 + (i % 5)}s`,
  drift: `${(i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 8)}px`,
  size: i % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1",
}));

export default function BattlefieldBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* 廢墟地面裂縫紋理 */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 opacity-40"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 40px, rgba(251,146,60,0.06) 40px 42px), repeating-linear-gradient(25deg, transparent 0 60px, rgba(239,68,68,0.05) 60px 62px)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-orange-950/30 via-transparent to-transparent" />

      {/* 遠處餘燼火光 */}
      <div className="animate-ember-glow absolute bottom-0 left-1/4 h-40 w-64 rounded-full bg-orange-600/20 blur-3xl" />
      <div
        className="animate-ember-glow absolute bottom-0 right-1/4 h-32 w-56 rounded-full bg-red-700/15 blur-3xl"
        style={{ animationDelay: "1.5s" }}
      />

      {/* 煙霧飄散 */}
      <div className="animate-smoke-drift absolute bottom-10 left-[15%] h-48 w-48 rounded-full bg-slate-500/10 blur-3xl" />
      <div
        className="animate-smoke-drift absolute bottom-20 right-[20%] h-40 w-40 rounded-full bg-slate-500/10 blur-3xl"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="animate-smoke-drift absolute bottom-0 left-[55%] h-36 w-36 rounded-full bg-slate-600/10 blur-3xl"
        style={{ animationDelay: "5s" }}
      />

      {/* 上升的餘燼火花 */}
      {embers.map((ember, i) => (
        <span
          key={i}
          className={`animate-ember-rise absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.9)] ${ember.size}`}
          style={
            {
              left: ember.left,
              animationDelay: ember.delay,
              animationDuration: ember.duration,
              "--drift": ember.drift,
            } as React.CSSProperties
          }
        />
      ))}

      {/* 飄浮裝備圖示 */}
      {equipmentIcons.map((item, i) => (
        <span
          key={i}
          className={`animate-equip-float absolute opacity-25 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)] ${item.size}`}
          style={{ top: item.top, left: item.left, animationDelay: item.delay }}
        >
          {item.icon}
        </span>
      ))}
    </div>
  );
}
