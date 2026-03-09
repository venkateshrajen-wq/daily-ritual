import { useState, useEffect, useRef } from "react";

// ─── FONTS & BASE ─────────────────────────────────────────────────────────────
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');`;

// ─── AVATAR DATA ──────────────────────────────────────────────────────────────
const AVATARS = [
  {
    id: "dragon",
    name: "Dragon Warrior",
    emoji: "🐉",
    title: "The Flame Sovereign",
    element: "Fire",
    color: "#e85d04",
    glow: "#f48c06",
    bg: "linear-gradient(160deg, #1a0500 0%, #2d0900 40%, #1a0500 100%)",
    cardBg: "rgba(40,8,0,0.85)",
    tagline: "Forged in fire. Feared by fate.",
    lore: "You carry the ancient fire of a thousand battles. Where others see obstacles, you see fuel. Your habits are not chores — they are rituals of power.",
    traits: ["Unstoppable", "Fierce", "Legendary"],
    particles: "🔥",
  },
  {
    id: "ninja",
    name: "Shadow Ninja",
    emoji: "🥷",
    title: "The Unseen Blade",
    element: "Shadow",
    color: "#7b2d8b",
    glow: "#c77dff",
    bg: "linear-gradient(160deg, #080010 0%, #150025 40%, #080010 100%)",
    cardBg: "rgba(12,0,24,0.85)",
    tagline: "Strike swift. Leave no trace.",
    lore: "You move in silence, but your discipline is deafening. Every habit you build is a blade sharpened in the dark — invisible until it matters most.",
    traits: ["Disciplined", "Precise", "Relentless"],
    particles: "⭐",
  },
  {
    id: "forest",
    name: "Forest Guardian",
    emoji: "🌿",
    title: "The Ancient Root",
    element: "Nature",
    color: "#2d6a4f",
    glow: "#74c69d",
    bg: "linear-gradient(160deg, #020d06 0%, #071a0e 40%, #020d06 100%)",
    cardBg: "rgba(4,18,8,0.85)",
    tagline: "Rooted deep. Growing always.",
    lore: "Like the oldest trees, your strength comes from depth, not speed. Every habit is a root reaching deeper into who you are becoming.",
    traits: ["Patient", "Enduring", "Wise"],
    particles: "🍃",
  },
  {
    id: "mage",
    name: "Storm Mage",
    emoji: "⚡",
    title: "The Thunder Caller",
    element: "Storm",
    color: "#0077b6",
    glow: "#48cae4",
    bg: "linear-gradient(160deg, #00030d 0%, #000d1a 40%, #00030d 100%)",
    cardBg: "rgba(0,5,20,0.85)",
    tagline: "Command the chaos. Shape the storm.",
    lore: "You bend the laws of nature to your will. Chaos is your canvas. With every habit, you channel raw lightning into focused, unstoppable energy.",
    traits: ["Brilliant", "Volatile", "Transcendent"],
    particles: "⚡",
  },
  {
    id: "knight",
    name: "Iron Knight",
    emoji: "⚔️",
    title: "The Unbreakable",
    element: "Iron",
    color: "#8d8d8d",
    glow: "#e0e0e0",
    bg: "linear-gradient(160deg, #0a0a0a 0%, #151515 40%, #0a0a0a 100%)",
    cardBg: "rgba(15,15,15,0.85)",
    tagline: "Honor forged. Never broken.",
    lore: "Your shield has taken every blow the world can throw. You do not fall. Your habits are your armor — built plate by plate, day by day.",
    traits: ["Steadfast", "Honorable", "Invincible"],
    particles: "🛡️",
  },
  {
    id: "phoenix",
    name: "Phoenix Rising",
    emoji: "🔥",
    title: "The Eternal Flame",
    element: "Rebirth",
    color: "#d62828",
    glow: "#fcbf49",
    bg: "linear-gradient(160deg, #1a0000 0%, #2a0800 40%, #1a0000 100%)",
    cardBg: "rgba(30,4,0,0.85)",
    tagline: "From ash. Into glory.",
    lore: "You have burned before. You always rise. Every setback is kindling. Every habit rebuilt is a feather returned. You do not just survive — you become.",
    traits: ["Resilient", "Radiant", "Reborn"],
    particles: "✨",
  },
];

const DEFAULT_HABITS = [
  { id: "exercise", name: "Exercise / Movement", icon: "🏃", color: "#f97316" },
  { id: "water", name: "Water & Nutrition", icon: "💧", color: "#06b6d4" },
  { id: "sleep", name: "Sleep", icon: "🌙", color: "#8b5cf6" },
  { id: "reading", name: "Reading / Learning", icon: "📚", color: "#10b981" },
];

function lsGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function lsSet(k, v) { try { localStorage.setItem(k, v); } catch {} }
function getToday() { return new Date().toISOString().split("T")[0]; }
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d.toISOString().split("T")[0]); }
  return days;
}
function formatDay(s) { const d = new Date(s + "T00:00:00"); return { day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate() }; }
function fullDateStr(s) { return new Date(s + "T00:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" }); }

// ─── PARTICLE FIELD ───────────────────────────────────────────────────────────
function Particles({ emoji, color }) {
  const particles = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map(i => (
        <div key={i} style={{
          position: "absolute",
          left: `${(i * 37 + 10) % 90}%`,
          top: `${(i * 53 + 5) % 90}%`,
          fontSize: `${10 + (i % 3) * 6}px`,
          opacity: 0.08 + (i % 4) * 0.04,
          animation: `float${i % 3} ${6 + i % 4}s ease-in-out infinite`,
          animationDelay: `${i * 0.6}s`,
        }}>{emoji}</div>
      ))}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onEnter }) {
  const [lit, setLit] = useState(false);
  useEffect(() => { setTimeout(() => setLit(true), 100); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #0a0600 0%, #160b00 30%, #0f0800 60%, #0a0500 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-20px) rotate(5deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-30px) rotate(-5deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(8deg)} }
        @keyframes ember { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0.6} 100%{transform:translateY(-120px) translateX(${Math.random()>0.5?'':'-'}20px) scale(0);opacity:0} }
        @keyframes pulse-glow { 0%,100%{text-shadow: 0 0 20px #c8703060, 0 0 60px #c8703030} 50%{text-shadow: 0 0 40px #c8703090, 0 0 100px #c8703050} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes runeRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 94%{opacity:0.8} 96%{opacity:1} 98%{opacity:0.85} }
        .enter-btn {
          background: transparent; border: 1px solid rgba(200,112,48,0.5);
          color: #c87030; font-family: 'Cinzel', serif; font-size: 13px;
          letter-spacing: 0.3em; text-transform: uppercase; padding: 16px 48px;
          cursor: pointer; position: relative; overflow: hidden; transition: all 0.4s;
        }
        .enter-btn::before { content:''; position:absolute; inset:0; background:rgba(200,112,48,0.08); transform:scaleX(0); transition:transform 0.4s; transform-origin:left; }
        .enter-btn:hover::before { transform:scaleX(1); }
        .enter-btn:hover { border-color:rgba(200,112,48,0.9); color:#e8a060; box-shadow:0 0 30px rgba(200,112,48,0.2); }
      `}</style>

      {/* Background texture layers */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120,50,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse 40% 30% at 50% 80%, rgba(60,20,0,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Floating embers */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", bottom: 0, left: `${(i * 17 + 5) % 95}%`, width: 2, height: 2, borderRadius: "50%", background: i % 3 === 0 ? "#f48c06" : i % 3 === 1 ? "#e85d04" : "#c87030", animation: `ember ${4 + i % 5}s ease-out infinite`, animationDelay: `${i * 0.4}s`, opacity: 0 }} />
      ))}

      {/* Ancient rune ring */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, opacity: 0.03, animation: "runeRotate 120s linear infinite", pointerEvents: "none" }}>
        <svg viewBox="0 0 200 200" width="600" height="600">
          <circle cx="100" cy="100" r="95" fill="none" stroke="#c87030" strokeWidth="0.5" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#c87030" strokeWidth="0.3" strokeDasharray="2 12" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <text key={i} x={100 + 88 * Math.cos(a)} y={100 + 88 * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#c87030" transform={`rotate(${i * 30}, ${100 + 88 * Math.cos(a)}, ${100 + 88 * Math.sin(a)})`}>᚛</text>;
          })}
        </svg>
      </div>

      {/* Main content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Icon */}
        <div style={{ fontSize: 64, marginBottom: 24, animation: "flicker 8s ease-in-out infinite", filter: "drop-shadow(0 0 20px rgba(200,112,48,0.5))", opacity: lit ? 1 : 0, transition: "opacity 1.5s ease" }}>🔥</div>

        {/* Title */}
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(32px, 6vw, 72px)", fontWeight: 700, color: "#c87030", letterSpacing: "0.1em", lineHeight: 1.1, animation: "pulse-glow 4s ease-in-out infinite", opacity: lit ? 1 : 0, transition: "opacity 2s ease 0.3s", marginBottom: 8 }}>
          DAILY RITUAL
        </div>

        <div style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(10px, 1.5vw, 14px)", letterSpacing: "0.5em", color: "rgba(200,112,48,0.5)", textTransform: "uppercase", marginBottom: 48, opacity: lit ? 1 : 0, transition: "opacity 2s ease 0.6s", animation: lit ? "fadeUp 1s ease 0.6s both" : "none" }}>
          Forge Your Legend
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 48, opacity: lit ? 1 : 0, transition: "opacity 2s ease 0.9s" }}>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, transparent, rgba(200,112,48,0.4))" }} />
          <div style={{ color: "rgba(200,112,48,0.4)", fontSize: 16 }}>⬡</div>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to left, transparent, rgba(200,112,48,0.4))" }} />
        </div>

        {/* Tagline */}
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: "clamp(14px, 2vw, 18px)", color: "rgba(200,160,100,0.6)", marginBottom: 56, maxWidth: 380, margin: "0 auto 56px", lineHeight: 1.8, opacity: lit ? 1 : 0, transition: "opacity 2s ease 1.1s" }}>
          Every great warrior was once a beginner who refused to quit.
        </div>

        {/* CTA */}
        <div style={{ opacity: lit ? 1 : 0, transition: "opacity 2s ease 1.4s" }}>
          <button className="enter-btn" onClick={onEnter}>
            Begin Your Journey
          </button>
        </div>

        {/* Bottom text */}
        <div style={{ marginTop: 48, fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(200,112,48,0.2)", opacity: lit ? 1 : 0, transition: "opacity 2s ease 1.8s" }}>
          CHOOSE YOUR PATH · FORGE YOUR FATE
        </div>
      </div>
    </div>
  );
}

// ─── AVATAR SELECTION ─────────────────────────────────────────────────────────
function AvatarSelectionPage({ onSelect }) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  function choose(avatar) {
    setSelected(avatar.id);
    setTimeout(() => onSelect(avatar), 600);
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #080500 0%, #120900 50%, #080500 100%)", padding: "48px 24px 60px" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes chosenPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .avatar-card {
          border-radius: 20px; padding: 28px 22px; cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
          position: relative; overflow: hidden; border: 1px solid;
          animation: fadeUp 0.6s ease both;
        }
        .avatar-card:hover { transform: translateY(-6px) scale(1.02); }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 11, letterSpacing: "0.4em", color: "rgba(200,112,48,0.45)", textTransform: "uppercase", marginBottom: 16 }}>Choose Your Path</div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(22px, 4vw, 40px)", color: "#c87030", letterSpacing: "0.05em", marginBottom: 12 }}>Select Your Avatar</div>
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 17, color: "rgba(200,160,100,0.5)", maxWidth: 400, margin: "0 auto" }}>
          Your archetype shapes your journey. Choose wisely — for it reflects your spirit.
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
        {AVATARS.map((av, i) => {
          const isHov = hovered === av.id;
          const isSel = selected === av.id;
          return (
            <div key={av.id} className="avatar-card"
              style={{
                background: isHov || isSel ? av.cardBg : "rgba(15,10,5,0.7)",
                borderColor: isHov || isSel ? av.color + "80" : "rgba(200,112,48,0.12)",
                boxShadow: isHov || isSel ? `0 0 40px ${av.glow}18, 0 20px 40px rgba(0,0,0,0.5)` : "0 4px 20px rgba(0,0,0,0.4)",
                animationDelay: `${i * 0.08}s`,
                animation: isSel ? "chosenPulse 0.6s ease" : `fadeUp 0.6s ease ${i * 0.08}s both`,
              }}
              onMouseEnter={() => setHovered(av.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => choose(av)}
            >
              <Particles emoji={av.particles} color={av.glow} />

              {/* Element badge */}
              <div style={{ position: "absolute", top: 16, right: 16, fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.2em", color: av.color, opacity: 0.7, textTransform: "uppercase" }}>{av.element}</div>

              {/* Emoji */}
              <div style={{ fontSize: 52, marginBottom: 16, filter: `drop-shadow(0 0 12px ${av.glow}60)`, animation: `float${i % 3} ${4 + i % 2}s ease-in-out infinite` }}>{av.emoji}</div>

              {/* Name */}
              <div style={{ fontFamily: "'Cinzel', serif", fontSize: 17, fontWeight: 700, color: isHov || isSel ? av.glow : "#c8a070", marginBottom: 4, transition: "color 0.3s", letterSpacing: "0.05em" }}>{av.name}</div>

              {/* Title */}
              <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 13, color: "rgba(200,160,100,0.45)", marginBottom: 16 }}>{av.title}</div>

              {/* Divider */}
              <div style={{ height: 1, background: `linear-gradient(to right, ${av.color}40, transparent)`, marginBottom: 14 }} />

              {/* Tagline */}
              <div style={{ fontFamily: "'EB Garamond', serif", fontSize: 14, color: "rgba(220,180,130,0.7)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 16 }}>"{av.tagline}"</div>

              {/* Traits */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {av.traits.map(t => (
                  <span key={t} style={{ fontFamily: "'Cinzel', serif", fontSize: 9, letterSpacing: "0.15em", color: av.color, border: `1px solid ${av.color}40`, borderRadius: 4, padding: "3px 8px", textTransform: "uppercase" }}>{t}</span>
                ))}
              </div>

              {/* Select indicator */}
              {isSel && (
                <div style={{ position: "absolute", inset: 0, border: `2px solid ${av.color}`, borderRadius: 20, pointerEvents: "none", boxShadow: `inset 0 0 30px ${av.glow}15` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AVATAR WELCOME ───────────────────────────────────────────────────────────
function AvatarWelcomePage({ avatar, onContinue }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: avatar.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "40px 24px" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-30px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
        @keyframes revealUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{filter:drop-shadow(0 0 20px ${avatar.glow}80)} 50%{filter:drop-shadow(0 0 50px ${avatar.glow})} }
        @keyframes runeRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .continue-btn {
          background: ${avatar.color}18; border: 1px solid ${avatar.color}60;
          color: ${avatar.glow}; font-family: 'Cinzel', serif; font-size: 12px;
          letter-spacing: 0.3em; padding: 14px 44px; cursor: pointer;
          transition: all 0.3s; text-transform: uppercase;
          border-radius: 2px;
        }
        .continue-btn:hover { background: ${avatar.color}30; box-shadow: 0 0 30px ${avatar.color}30; }
      `}</style>

      <Particles emoji={avatar.particles} color={avatar.glow} />

      {/* Rotating rune ring */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, opacity: 0.05, animation: "runeRotate 80s linear infinite", pointerEvents: "none" }}>
        <svg viewBox="0 0 200 200" width="500" height="500">
          <circle cx="100" cy="100" r="95" fill="none" stroke={avatar.color} strokeWidth="0.5" strokeDasharray="3 6" />
        </svg>
      </div>

      {/* Glow orb */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${avatar.color}15 0%, transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 560 }}>
        {/* Avatar icon */}
        <div style={{ fontSize: 96, marginBottom: 24, animation: phase >= 1 ? "glowPulse 3s ease-in-out infinite, float0 6s ease-in-out infinite" : "none", opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.8s ease" }}>
          {avatar.emoji}
        </div>

        {/* Element */}
        <div style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.5em", color: avatar.color, opacity: phase >= 1 ? 0.7 : 0, transition: "opacity 1s ease 0.2s", marginBottom: 12, textTransform: "uppercase" }}>
          The {avatar.element} Path
        </div>

        {/* Name */}
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: "clamp(24px, 5vw, 48px)", color: avatar.glow, letterSpacing: "0.08em", marginBottom: 6, opacity: phase >= 1 ? 1 : 0, transition: "opacity 1s ease 0.4s", lineHeight: 1.1 }}>
          {avatar.name}
        </div>

        {/* Title */}
        <div style={{ fontFamily: "'EB Garamond', serif", fontStyle: "italic", fontSize: 18, color: `${avatar.glow}80`, marginBottom: 36, opacity: phase >= 1 ? 1 : 0, transition: "opacity 1s ease 0.6s" }}>
          {avatar.title}
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, opacity: phase >= 2 ? 1 : 0, transition: "opacity 1s ease" }}>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, transparent, ${avatar.color}60)` }} />
          <div style={{ color: avatar.color, fontSize: 14 }}>⬡</div>
          <div style={{ height: 1, flex: 1, background: `linear-gradient(to left, transparent, ${avatar.color}60)` }} />
        </div>

        {/* Lore */}
        <div style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(220,190,150,0.75)", lineHeight: 1.9, marginBottom: 40, fontStyle: "italic", opacity: phase >= 2 ? 1 : 0, transition: "opacity 1.2s ease 0.2s" }}>
          {avatar.lore}
        </div>

        {/* Traits */}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48, opacity: phase >= 2 ? 1 : 0, transition: "opacity 1s ease 0.4s", flexWrap: "wrap" }}>
          {avatar.traits.map(t => (
            <span key={t} style={{ fontFamily: "'Cinzel', serif", fontSize: 10, letterSpacing: "0.2em", color: avatar.color, border: `1px solid ${avatar.color}50`, padding: "6px 16px", textTransform: "uppercase" }}>{t}</span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ opacity: phase >= 3 ? 1 : 0, transition: "opacity 1s ease" }}>
          <button className="continue-btn" onClick={onContinue}>
            Begin Your Ritual →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── JOURNALING PAGE ──────────────────────────────────────────────────────────
function JournalingPage({ date, avatar, onBack }) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [scene, setScene] = useState("forest");
  const key = `journal::${date}`;

  useEffect(() => { const s = lsGet(key); if (s) setEntry(s); }, [key]);
  function save() { lsSet(key, entry); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const prompts = ["What are three things you're grateful for today?","What challenged you, and what did you learn from it?","Describe one small moment of beauty you noticed.","How are you feeling right now, and why?","What intention do you want to carry into tomorrow?"];
  const prompt = prompts[new Date(date + "T00:00:00").getDay() % prompts.length];
  const isForest = scene === "forest";
  const accentColor = isForest ? "#7ec87e" : "#5bb8d4";
  const paperBg = isForest ? "rgba(10,22,10,0.75)" : "rgba(5,18,35,0.75)";
  const bgGradient = isForest ? "linear-gradient(160deg,#050f05 0%,#0a1a0a 30%,#112211 55%,#0d1f15 80%,#060e08 100%)" : "linear-gradient(160deg,#020810 0%,#041828 30%,#062840 55%,#051e34 80%,#030c1c 100%)";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, position: "relative", overflow: "hidden" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .jta { width:100%;min-height:300px;background:transparent;border:none;outline:none;resize:none;font-family:'EB Garamond',serif;font-size:17px;line-height:2;color:rgba(230,240,230,0.9);caret-color:${accentColor}; }
        .jta::placeholder { color:rgba(200,220,200,0.28);font-style:italic; }
        .sbt { background:${accentColor}1a;border:1px solid ${accentColor}44;color:${accentColor};border-radius:10px;padding:10px 28px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;transition:all 0.2s; }
        .sbt:hover { background:${accentColor}2a; }
        .scb { background:transparent;border:1px solid rgba(255,255,255,0.12);color:rgba(255,255,255,0.45);border-radius:20px;padding:5px 14px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:12px;transition:all 0.2s; }
        .scb.active { background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.3);color:rgba(255,255,255,0.8); }
        .scb:hover { background:rgba(255,255,255,0.06); }
        .blk { background:transparent;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;padding:0;transition:color 0.2s; }
        .blk:hover { color:rgba(255,255,255,0.65); }
      `}</style>
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",opacity:0.14 }} preserveAspectRatio="none">
        {isForest?(<><circle cx="8%" cy="18%" r="140" fill="#2d6e2d"/><circle cx="88%" cy="12%" r="180" fill="#1e4e1e"/><circle cx="50%" cy="78%" r="220" fill="#1a401a"/></>):(<><circle cx="12%" cy="22%" r="180" fill="#0a3a6e"/><circle cx="82%" cy="18%" r="150" fill="#0d4a7e"/><circle cx="50%" cy="72%" r="260" fill="#083055"/></>)}
      </svg>
      <div style={{ maxWidth:680,margin:"0 auto",padding:"30px 24px 60px",position:"relative",zIndex:1 }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:40 }}>
          <button className="blk" onClick={onBack}>← Back</button>
          <div style={{ display:"flex",gap:8 }}>
            <button className={`scb ${scene==="forest"?"active":""}`} onClick={()=>setScene("forest")}>🌿 Forest</button>
            <button className={`scb ${scene==="sea"?"active":""}`} onClick={()=>setScene("sea")}>🌊 Sea</button>
          </div>
        </div>
        <div style={{ marginBottom:6,fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:accentColor,opacity:0.6 }}>Journal Entry</div>
        <div style={{ fontFamily:"'Cinzel Decorative',serif",fontSize:30,fontWeight:400,color:"rgba(230,240,230,0.85)",letterSpacing:"-0.5px",marginBottom:36,lineHeight:1.1 }}>{fullDateStr(date)}</div>
        <div style={{ background:paperBg,backdropFilter:"blur(24px)",borderRadius:22,border:`1px solid ${accentColor}18`,padding:"36px 40px 30px",boxShadow:`0 24px 64px rgba(0,0,0,0.5)` }}>
          <div style={{ fontFamily:"'EB Garamond',serif",fontSize:16,fontStyle:"italic",color:accentColor,opacity:0.7,marginBottom:26,lineHeight:1.65,borderLeft:`2px solid ${accentColor}35`,paddingLeft:16 }}>{prompt}</div>
          <textarea className="jta" placeholder="Begin writing… let your thoughts flow freely." value={entry} onChange={e=>setEntry(e.target.value)} />
          <div style={{ borderTop:`1px solid ${accentColor}15`,marginTop:22,paddingTop:18,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(200,220,200,0.25)" }}>{entry.split(/\s+/).filter(Boolean).length} words</div>
            <button className="sbt" onClick={save}>{saved?"✓ Saved":"Save entry"}</button>
          </div>
        </div>
        <div style={{ textAlign:"center",marginTop:44,fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:15,color:"rgba(200,220,200,0.22)",lineHeight:1.9 }}>
          {isForest?"The clearest way into the universe is through a forest wilderness.":"The sea, once it casts its spell, holds one in its net of wonder forever."}
        </div>
      </div>
    </div>
  );
}

// ─── GOALS PAGE ───────────────────────────────────────────────────────────────
function GoalsPage({ avatar, onBack }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { const s=lsGet("goals"); if(s){try{setGoals(JSON.parse(s));}catch{}} setLoaded(true); }, []);
  useEffect(() => { if(!loaded)return; lsSet("goals",JSON.stringify(goals)); }, [goals,loaded]);

  function addGoal() { if(!newGoal.trim())return; setGoals(p=>[...p,{id:Date.now().toString(),text:newGoal.trim(),deadline:newDeadline,done:false}]); setNewGoal(""); setNewDeadline(""); setAdding(false); }
  function toggleGoal(id) { setGoals(p=>p.map(g=>g.id===id?{...g,done:!g.done}:g)); }
  function deleteGoal(id) { setGoals(p=>p.filter(g=>g.id!==id)); }

  const ac = avatar.color, gl = avatar.glow;
  const active=goals.filter(g=>!g.done), completed=goals.filter(g=>g.done);

  return (
    <div style={{ minHeight:"100vh",background:"#080500",color:"#f0ece8" }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box;margin:0;padding:0; }
        .gb { background:${ac}18;border:1px solid ${ac}40;color:${gl};border-radius:8px;padding:8px 16px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;transition:all 0.2s; }
        .gb:hover { background:${ac}28; }
        .gr { display:flex;align-items:flex-start;gap:14px;background:rgba(255,255,255,0.02);border-radius:14px;padding:16px 18px;border:1px solid rgba(200,112,48,0.08);transition:all 0.2s; }
        .gr:hover { background:rgba(255,255,255,0.04); }
        .gch { width:22px;height:22px;border-radius:6px;border:2px solid;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;margin-top:2px;transition:all 0.2s;font-size:12px; }
        .gch:hover { transform:scale(1.1); }
        .gdl { background:none;border:none;color:rgba(240,236,232,0.12);cursor:pointer;font-size:18px;padding:0 4px;transition:color 0.2s;margin-left:auto; }
        .gdl:hover { color:#ef4444; }
        .gi { background:rgba(255,255,255,0.04);border:1px solid rgba(200,112,48,0.2);color:#f0ece8;border-radius:8px;padding:10px 14px;font-family:'EB Garamond',serif;font-size:15px;outline:none;width:100%; }
        .gi:focus { border-color:${ac}60; }
        .gsub { background:${ac};color:#080500;border:none;padding:10px 22px;border-radius:8px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em; }
        .gcan { background:transparent;color:rgba(240,236,232,0.35);border:none;padding:10px 12px;cursor:pointer;font-size:14px;font-family:'DM Sans',sans-serif; }
        .gadd { background:none;border:1.5px dashed rgba(200,112,48,0.2);color:rgba(200,112,48,0.4);border-radius:12px;padding:12px 20px;cursor:pointer;width:100%;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;transition:all 0.2s; }
        .gadd:hover { border-color:rgba(200,112,48,0.5);color:rgba(200,112,48,0.8); }
        .slbl { font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(200,112,48,0.35);margin-bottom:10px;margin-top:26px; }
      `}</style>
      <div style={{ background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(200,112,48,0.1)",padding:"24px 28px" }}>
        <div style={{ maxWidth:620,margin:"0 auto" }}>
          <button className="gb" onClick={onBack}>← Back to Ritual</button>
          <div style={{ marginTop:18,display:"flex",alignItems:"center",gap:16 }}>
            <span style={{ fontSize:32,filter:`drop-shadow(0 0 10px ${gl}60)` }}>{avatar.emoji}</span>
            <div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif",fontSize:24,color:gl }}>Quest Log</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:13,color:"rgba(200,160,100,0.45)",marginTop:3 }}>{active.length} active · {completed.length} achieved</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:620,margin:"0 auto",padding:"24px 24px 60px" }}>
        {adding?(
          <div style={{ background:"rgba(255,255,255,0.03)",border:`1px solid ${ac}20`,borderRadius:14,padding:"20px",marginBottom:8 }}>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <input className="gi" placeholder="Name your quest…" value={newGoal} onChange={e=>setNewGoal(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addGoal();if(e.key==="Escape")setAdding(false);}} autoFocus />
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <input type="date" className="gi" value={newDeadline} onChange={e=>setNewDeadline(e.target.value)} style={{ flex:"0 0 168px" }} />
                <span style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"rgba(240,236,232,0.28)" }}>target date (optional)</span>
              </div>
              <div style={{ display:"flex",gap:8 }}>
                <button className="gsub" onClick={addGoal}>Add Quest</button>
                <button className="gcan" onClick={()=>{setAdding(false);setNewGoal("");setNewDeadline("");}}>Cancel</button>
              </div>
            </div>
          </div>
        ):(
          <button className="gadd" onClick={()=>setAdding(true)}>+ Add a new quest</button>
        )}
        {active.length>0&&(<>
          <div className="slbl">Active Quests</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {active.map(goal=>{
              const overdue=goal.deadline&&goal.deadline<getToday();
              const daysLeft=goal.deadline?Math.ceil((new Date(goal.deadline+"T00:00:00")-new Date())/86400000):null;
              return(
                <div key={goal.id} className="gr">
                  <div className="gch" onClick={()=>toggleGoal(goal.id)} style={{ borderColor:ac,color:"transparent" }} />
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontFamily:"'EB Garamond',serif",fontSize:16,lineHeight:1.4,color:"rgba(240,230,210,0.9)" }}>{goal.text}</div>
                    {goal.deadline&&(<div style={{ fontFamily:"'DM Sans',sans-serif",fontSize:12,marginTop:4,color:overdue?"#ef4444":daysLeft<=3?"#f59e0b":"rgba(200,160,100,0.4)" }}>
                      {overdue?"⚠ Overdue — ":daysLeft===0?"Due today — ":daysLeft===1?"Due tomorrow — ":`${daysLeft} days left — `}
                      {new Date(goal.deadline+"T00:00:00").toLocaleDateString("en",{month:"short",day:"numeric"})}
                    </div>)}
                  </div>
                  <button className="gdl" onClick={()=>deleteGoal(goal.id)}>×</button>
                </div>
              );
            })}
          </div>
        </>)}
        {completed.length>0&&(<>
          <div className="slbl">Conquered ✓</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {completed.map(goal=>(
              <div key={goal.id} className="gr" style={{ opacity:0.5 }}>
                <div className="gch" onClick={()=>toggleGoal(goal.id)} style={{ borderColor:"#10b981",background:"#10b98122",color:"#10b981" }}>✓</div>
                <div style={{ flex:1 }}><div style={{ fontFamily:"'EB Garamond',serif",fontSize:16,textDecoration:"line-through",textDecorationColor:"rgba(240,236,232,0.25)" }}>{goal.text}</div></div>
                <button className="gdl" onClick={()=>deleteGoal(goal.id)}>×</button>
              </div>
            ))}
          </div>
        </>)}
        {goals.length===0&&!adding&&(
          <div style={{ textAlign:"center",marginTop:64,fontFamily:"'EB Garamond',serif",fontStyle:"italic",color:"rgba(200,160,100,0.3)",fontSize:17,lineHeight:1.9 }}>
            <div style={{ fontSize:36,marginBottom:14 }}>📜</div>
            Every legend begins with a single quest.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DAY DETAIL ───────────────────────────────────────────────────────────────
function DayDetailPage({ date, habits, completions, onToggle, onBack, onJournal, onGoals, avatar }) {
  const done=habits.filter(h=>!!completions[`${h.id}::${date}`]);
  const notDone=habits.filter(h=>!completions[`${h.id}::${date}`]);
  const pct=habits.length?Math.round((done.length/habits.length)*100):0;
  const circ=2*Math.PI*44, dash=circ-(pct/100)*circ;
  const ac=avatar.color, gl=avatar.glow;

  return (
    <div style={{ minHeight:"100vh",background:"#080500",color:"#f0ece8" }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box;margin:0;padding:0; }
        .db { background:${ac}18;border:1px solid ${ac}40;color:${gl};border-radius:8px;padding:8px 16px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;transition:all 0.2s; }
        .db:hover { background:${ac}28; }
        .dhr2 { display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.02);border-radius:14px;padding:16px 20px;border:1px solid rgba(200,112,48,0.08);transition:all 0.2s;cursor:pointer; }
        .dhr2:hover { background:rgba(255,255,255,0.05)!important; }
        .bchk2 { width:42px;height:42px;border-radius:50%;border:2px solid;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;transition:all 0.2s; }
        .rsv3 circle { transition:stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1); }
        .slbl3 { font-family:'Cinzel',serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(200,112,48,0.35);margin-bottom:10px;margin-top:26px; }
        .acard { display:flex;align-items:center;gap:14px;border-radius:14px;padding:18px 20px;border:1px solid;cursor:pointer;transition:all 0.25s;text-align:left;background:none;color:#f0ece8;width:100%; }
        .acard:hover { transform:translateY(-2px); }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>
      <div style={{ background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(200,112,48,0.1)",padding:"24px 28px" }}>
        <div style={{ maxWidth:620,margin:"0 auto" }}>
          <button className="db" onClick={onBack}>← Back</button>
          <div style={{ marginTop:18,display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.2em",color:"rgba(200,112,48,0.4)",textTransform:"uppercase",marginBottom:6 }}>{fullDateStr(date)}</div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif",fontSize:22,color:gl }}>Daily Ritual</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:13,color:"rgba(200,160,100,0.45)",marginTop:3 }}>{done.length} of {habits.length} rituals completed</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:32,animation:"float0 4s ease-in-out infinite",filter:`drop-shadow(0 0 10px ${gl}60)` }}>{avatar.emoji}</div>
              <div style={{ position:"relative",width:72,height:72,marginTop:8 }}>
                <svg className="rsv3" width="72" height="72" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                  <circle cx="36" cy="36" r="32" fill="none" stroke={pct===100?"#10b981":ac} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}/>
                </svg>
                <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif",fontSize:14,color:gl }}>{pct}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:620,margin:"0 auto",padding:"22px 24px 60px" }}>
        <div className="slbl3">Ancient Tools</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:4 }}>
          <button className="acard" onClick={onJournal} style={{ background:`${ac}08`,borderColor:`${ac}25` }}>
            <span style={{ fontSize:24 }}>📓</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:13,color:gl }}>Chronicle</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:12,color:"rgba(200,160,100,0.45)",marginTop:2 }}>Write & reflect</div>
            </div>
          </button>
          <button className="acard" onClick={onGoals} style={{ background:`${ac}08`,borderColor:`${ac}25` }}>
            <span style={{ fontSize:24 }}>📜</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:13,color:gl }}>Quest Log</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:12,color:"rgba(200,160,100,0.45)",marginTop:2 }}>Track intentions</div>
            </div>
          </button>
        </div>
        {notDone.length>0&&(<>
          <div className="slbl3">Awaiting Completion</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {notDone.map(h=>(
              <div key={h.id} className="dhr2" onClick={()=>onToggle(h.id,date)}>
                <div className="bchk2" style={{ borderColor:"rgba(200,112,48,0.2)" }}/>
                <div style={{ fontFamily:"'EB Garamond',serif",fontSize:16,color:"rgba(240,225,200,0.85)" }}>{h.icon} {h.name}</div>
              </div>
            ))}
          </div>
        </>)}
        {done.length>0&&(<>
          <div className="slbl3">Completed ✓</div>
          <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
            {done.map(h=>(
              <div key={h.id} className="dhr2" onClick={()=>onToggle(h.id,date)} style={{ opacity:0.6 }}>
                <div className="bchk2" style={{ borderColor:h.color,background:h.color+"22",color:h.color }}>✓</div>
                <div style={{ fontFamily:"'EB Garamond',serif",fontSize:16,textDecoration:"line-through",textDecorationColor:"rgba(240,236,232,0.25)" }}>{h.icon} {h.name}</div>
              </div>
            ))}
          </div>
        </>)}
      </div>
    </div>
  );
}

// ─── MAIN TRACKER ─────────────────────────────────────────────────────────────
function HabitTracker({ avatar }) {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [completions, setCompletions] = useState({});
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState({ type: "home" });
  const today = getToday(), days = getLast7Days();
  const ac = avatar.color, gl = avatar.glow;

  useEffect(() => {
    const h=lsGet("habits"); if(h){try{setHabits(JSON.parse(h));}catch{}}
    const c=lsGet("completions"); if(c){try{setCompletions(JSON.parse(c));}catch{}}
    setLoaded(true);
  }, []);
  useEffect(() => { if(!loaded)return; lsSet("habits",JSON.stringify(habits)); }, [habits,loaded]);
  useEffect(() => { if(!loaded)return; lsSet("completions",JSON.stringify(completions)); }, [completions,loaded]);

  function toggle(hId,date) { const k=`${hId}::${date}`; setCompletions(p=>({...p,[k]:!p[k]})); }
  function isDone(hId,date) { return !!completions[`${hId}::${date}`]; }
  function streak(hId) { let n=0,d=new Date(); while(true){const k=d.toISOString().split("T")[0];if(!completions[`${hId}::${k}`])break;n++;d.setDate(d.getDate()-1);} return n; }
  function addHabit() { if(!newHabitName.trim())return; const cs=["#ec4899","#f59e0b","#3b82f6","#a78bfa","#34d399"],is=["⭐","🎯","✨","🔥","💪"],i=habits.length%cs.length; setHabits(p=>[...p,{id:Date.now().toString(),name:newHabitName.trim(),icon:is[i],color:cs[i]}]); setNewHabitName(""); setAdding(false); }
  function removeHabit(id) { setHabits(p=>p.filter(h=>h.id!==id)); }

  const score=habits.filter(h=>isDone(h.id,today)).length;
  const pct=habits.length?Math.round((score/habits.length)*100):0;
  const circ=2*Math.PI*34, dash=circ-(pct/100)*circ;

  if(page.type==="journal") return <JournalingPage date={page.date} avatar={avatar} onBack={()=>setPage({type:"day",date:page.date})}/>;
  if(page.type==="goals") return <GoalsPage avatar={avatar} onBack={()=>setPage({type:"day",date:page.date})}/>;
  if(page.type==="day") return <DayDetailPage date={page.date} habits={habits} completions={completions} onToggle={toggle} onBack={()=>setPage({type:"home"})} onJournal={()=>setPage({type:"journal",date:page.date})} onGoals={()=>setPage({type:"goals",date:page.date})} avatar={avatar}/>;

  return (
    <div style={{ minHeight:"100vh",background:"#080500",color:"#f0ece8" }}>
      <style>{`
        ${FONTS}
        * { box-sizing:border-box;margin:0;padding:0; }
        @keyframes float0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .hr2 { transition:all 0.2s; }
        .hr2:hover { background:rgba(200,112,48,0.05)!important; }
        .chk2 { width:30px;height:30px;border-radius:50%;border:2px solid;cursor:pointer;background:transparent;display:flex;align-items:center;justify-content:center;transition:all 0.2s;font-size:13px;flex-shrink:0; }
        .chk2:hover { transform:scale(1.15); }
        .ddot2 { width:22px;height:22px;border-radius:50%;border:1.5px solid;cursor:pointer;background:transparent;display:flex;align-items:center;justify-content:center;transition:all 0.15s;font-size:9px; }
        .ddot2:hover { transform:scale(1.12); }
        .ab2 { background:none;border:1.5px dashed rgba(200,112,48,0.18);color:rgba(200,112,48,0.4);border-radius:12px;padding:12px 20px;cursor:pointer;width:100%;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.1em;transition:all 0.2s; }
        .ab2:hover { border-color:rgba(200,112,48,0.45);color:rgba(200,112,48,0.8); }
        .sf2 { background:${ac};color:#080500;border:none;padding:9px 18px;border-radius:8px;cursor:pointer;font-family:'Cinzel',serif;font-size:11px;letter-spacing:0.08em; }
        .cf2 { background:transparent;color:rgba(240,236,232,0.35);border:none;padding:9px 12px;cursor:pointer;font-size:14px;font-family:'DM Sans',sans-serif; }
        .if2 { background:rgba(200,112,48,0.06);border:1px solid rgba(200,112,48,0.2);color:#f0ece8;border-radius:8px;padding:9px 13px;font-family:'EB Garamond',serif;font-size:15px;outline:none;flex:1; }
        .if2:focus { border-color:${ac}60; }
        .rm2 { background:none;border:none;color:rgba(240,236,232,0.1);cursor:pointer;font-size:16px;padding:3px 6px;transition:color 0.2s;flex-shrink:0; }
        .rm2:hover { color:#ef4444; }
        .rsc2 circle { transition:stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1); }
        .dc2 { cursor:pointer;text-align:center;transition:opacity 0.15s; }
        .dc2:hover { opacity:0.6!important; }
        .bc2 { display:flex;align-items:center;gap:12px;border-radius:14px;padding:15px 18px;cursor:pointer;transition:all 0.2s;text-align:left;background:none;color:#f0ece8;border:1px solid rgba(200,112,48,0.12);width:100%; }
        .bc2:hover { transform:translateY(-1px);border-color:rgba(200,112,48,0.25); }
      `}</style>

      {/* Header */}
      <div style={{ background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(200,112,48,0.1)",padding:"18px 22px" }}>
        <div style={{ maxWidth:800,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div style={{ display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ fontSize:28,animation:"float0 5s ease-in-out infinite",filter:`drop-shadow(0 0 8px ${gl}50)` }}>{avatar.emoji}</div>
            <div>
              <div style={{ fontFamily:"'Cinzel Decorative',serif",fontSize:16,color:gl,letterSpacing:"0.04em" }}>Daily Ritual</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:12,color:"rgba(200,160,100,0.4)",marginTop:1 }}>
                {new Date().toLocaleDateString("en",{weekday:"long",month:"long",day:"numeric"})}
              </div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ fontFamily:"'Cinzel',serif",fontSize:9,letterSpacing:"0.15em",color:"rgba(200,112,48,0.45)",textAlign:"right" }}>
              <div>{avatar.name}</div>
              <div style={{ color:"rgba(200,160,100,0.3)",marginTop:2 }}>{avatar.element} Path</div>
            </div>
            <div style={{ position:"relative",width:68,height:68 }}>
              <svg className="rsc2" width="68" height="68" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="34" cy="34" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4"/>
                <circle cx="34" cy="34" r="34" fill="none" stroke={pct===100?"#10b981":ac} strokeWidth="4" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={dash}/>
              </svg>
              <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"'Cinzel',serif" }}>
                <div style={{ fontSize:15,color:gl }}>{pct}<span style={{ fontSize:8 }}>%</span></div>
                <div style={{ fontSize:7,color:"rgba(200,160,100,0.35)",marginTop:1 }}>today</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:800,margin:"0 auto",padding:"22px 18px" }}>
        {/* Column headers */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <div style={{ width:30 }}/>
          <div style={{ flex:1,fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.18em",color:"rgba(200,112,48,0.25)",textTransform:"uppercase" }}>Ritual</div>
          <div style={{ display:"flex",gap:5 }}>
            {days.map(d=>{
              const {day,num}=formatDay(d), isT=d===today;
              return(
                <div key={d} className="dc2" onClick={()=>setPage({type:"day",date:d})} title={`View ${d}`} style={{ width:22 }}>
                  <div style={{ fontFamily:"'Cinzel',serif",fontSize:7,color:isT?gl:"rgba(200,112,48,0.25)",letterSpacing:"0.05em",textTransform:"uppercase",marginBottom:2 }}>{day}</div>
                  <div style={{ fontFamily:"'Cinzel',serif",fontSize:9,color:isT?gl:"rgba(200,112,48,0.25)",fontWeight:isT?600:400,borderBottom:`1px dotted ${isT?ac+"60":"rgba(200,112,48,0.12)"}`,paddingBottom:2 }}>{num}</div>
                </div>
              );
            })}
          </div>
          <div style={{ width:22 }}/>
        </div>

        {/* Habit rows */}
        <div style={{ display:"flex",flexDirection:"column",gap:5 }}>
          {habits.map(habit=>{
            const s=streak(habit.id);
            return(
              <div key={habit.id} className="hr2" style={{ display:"flex",alignItems:"center",gap:8,background:"rgba(200,112,48,0.02)",borderRadius:12,padding:"10px",border:"1px solid rgba(200,112,48,0.07)" }}>
                <button className="chk2" onClick={()=>toggle(habit.id,today)} style={{ borderColor:isDone(habit.id,today)?habit.color:"rgba(200,112,48,0.2)",background:isDone(habit.id,today)?habit.color+"22":"transparent",color:isDone(habit.id,today)?habit.color:"transparent" }}>
                  {isDone(habit.id,today)?"✓":""}
                </button>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontFamily:"'EB Garamond',serif",fontSize:15,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:"rgba(240,225,200,0.88)" }}>{habit.icon} {habit.name}</div>
                  {s>0&&<div style={{ fontFamily:"'Cinzel',serif",fontSize:8,letterSpacing:"0.1em",color:habit.color,marginTop:1,opacity:0.8 }}>🔥 {s}d STREAK</div>}
                </div>
                <div style={{ display:"flex",gap:4 }}>
                  {days.map(d=>{
                    const done=isDone(habit.id,d), isT=d===today;
                    return(
                      <button key={d} className="ddot2" onClick={()=>toggle(habit.id,d)} title={d}
                        style={{ borderColor:done?habit.color:isT?"rgba(200,112,48,0.25)":"rgba(200,112,48,0.08)",background:done?habit.color:"transparent",color:done?"#fff":"transparent" }}>
                        {done?"✓":""}
                      </button>
                    );
                  })}
                </div>
                <button className="rm2" onClick={()=>removeHabit(habit.id)}>×</button>
              </div>
            );
          })}
        </div>

        {/* Add */}
        <div style={{ marginTop:12 }}>
          {adding?(
            <div style={{ display:"flex",gap:8,alignItems:"center",padding:"8px 0" }}>
              <input className="if2" placeholder="Name your ritual…" value={newHabitName} onChange={e=>setNewHabitName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")addHabit();if(e.key==="Escape")setAdding(false);}} autoFocus/>
              <button className="sf2" onClick={addHabit}>Add</button>
              <button className="cf2" onClick={()=>{setAdding(false);setNewHabitName("");}}>Cancel</button>
            </div>
          ):(
            <button className="ab2" onClick={()=>setAdding(true)}>+ Add new ritual</button>
          )}
        </div>

        {/* Quick nav */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:24 }}>
          <button className="bc2" onClick={()=>setPage({type:"journal",date:today})} style={{ background:`${ac}04` }}
            onMouseEnter={e=>e.currentTarget.style.background=`${ac}0a`}
            onMouseLeave={e=>e.currentTarget.style.background=`${ac}04`}>
            <span style={{ fontSize:20 }}>📓</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:12,color:gl }}>Chronicle</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:11,color:"rgba(200,160,100,0.38)",marginTop:1 }}>Write today's entry</div>
            </div>
          </button>
          <button className="bc2" onClick={()=>setPage({type:"goals",date:today})} style={{ background:`${ac}04` }}
            onMouseEnter={e=>e.currentTarget.style.background=`${ac}0a`}
            onMouseLeave={e=>e.currentTarget.style.background=`${ac}04`}>
            <span style={{ fontSize:20 }}>📜</span>
            <div>
              <div style={{ fontFamily:"'Cinzel',serif",fontSize:12,color:gl }}>Quest Log</div>
              <div style={{ fontFamily:"'EB Garamond',serif",fontStyle:"italic",fontSize:11,color:"rgba(200,160,100,0.38)",marginTop:1 }}>Set your intentions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | select | welcome | tracker
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const saved = lsGet("avatar");
    if (saved) { try { const a=JSON.parse(saved); setAvatar(a); setScreen("tracker"); } catch {} }
  }, []);

  function handleAvatarSelect(av) {
    setAvatar(av);
    setScreen("welcome");
  }

  function handleWelcomeContinue() {
    lsSet("avatar", JSON.stringify(avatar));
    setScreen("tracker");
  }

  if (screen === "landing") return <LandingPage onEnter={() => setScreen("select")} />;
  if (screen === "select") return <AvatarSelectionPage onSelect={handleAvatarSelect} />;
  if (screen === "welcome" && avatar) return <AvatarWelcomePage avatar={avatar} onContinue={handleWelcomeContinue} />;
  if (screen === "tracker" && avatar) return <HabitTracker avatar={avatar} />;
  return null;
}
