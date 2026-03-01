import { useState, useEffect } from "react";

const DEFAULT_HABITS = [
  { id: "exercise", name: "Exercise / Movement", icon: "🏃", color: "#f97316" },
  { id: "water", name: "Water & Nutrition", icon: "💧", color: "#06b6d4" },
  { id: "sleep", name: "Sleep", icon: "🌙", color: "#8b5cf6" },
  { id: "reading", name: "Reading / Learning", icon: "📚", color: "#10b981" },
];

const GOOGLE_FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400;1,500&display=swap');`;

// ─── localStorage helpers ─────────────────────────────────────────────────────
function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

function getToday() { return new Date().toISOString().split("T")[0]; }
function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}
function formatDay(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return { day: d.toLocaleDateString("en", { weekday: "short" }), num: d.getDate() };
}
function fullDateStr(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" });
}

// ─── JOURNALING PAGE ──────────────────────────────────────────────────────────
function JournalingPage({ date, onBack }) {
  const [entry, setEntry] = useState("");
  const [saved, setSaved] = useState(false);
  const [scene, setScene] = useState("forest");
  const key = `journal::${date}`;

  useEffect(() => {
    const saved = lsGet(key);
    if (saved) setEntry(saved);
  }, [key]);

  function save() {
    lsSet(key, entry);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const prompts = [
    "What are three things you're grateful for today?",
    "What challenged you, and what did you learn from it?",
    "Describe one small moment of beauty you noticed.",
    "How are you feeling right now, and why?",
    "What intention do you want to carry into tomorrow?",
  ];
  const prompt = prompts[new Date(date + "T00:00:00").getDay() % prompts.length];
  const isForest = scene === "forest";

  const bgGradient = isForest
    ? "linear-gradient(160deg, #050f05 0%, #0a1a0a 30%, #112211 55%, #0d1f15 80%, #060e08 100%)"
    : "linear-gradient(160deg, #020810 0%, #041828 30%, #062840 55%, #051e34 80%, #030c1c 100%)";

  const accentColor = isForest ? "#7ec87e" : "#5bb8d4";
  const paperBg = isForest ? "rgba(10, 22, 10, 0.75)" : "rgba(5, 18, 35, 0.75)";

  return (
    <div style={{ minHeight: "100vh", background: bgGradient, position: "relative", overflow: "hidden" }}>
      <style>{`
        ${GOOGLE_FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .journal-textarea {
          width: 100%; min-height: 300px; background: transparent;
          border: none; outline: none; resize: none;
          font-family: 'Lora', serif; font-size: 17px; line-height: 2;
          color: rgba(230,240,230,0.9); caret-color: ${accentColor};
        }
        .journal-textarea::placeholder { color: rgba(200,220,200,0.28); font-style: italic; }
        .scene-btn {
          background: transparent; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.45); border-radius: 20px; padding: 5px 14px;
          cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; transition: all 0.2s;
        }
        .scene-btn.active { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); color: rgba(255,255,255,0.8); }
        .scene-btn:hover { background: rgba(255,255,255,0.06); }
        .save-btn {
          background: ${accentColor}1a; border: 1px solid ${accentColor}44;
          color: ${accentColor}; border-radius: 10px; padding: 10px 28px;
          cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          transition: all 0.2s; letter-spacing: 0.04em;
        }
        .save-btn:hover { background: ${accentColor}2a; }
        .back-link {
          background: transparent; border: none; color: rgba(255,255,255,0.3);
          cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px;
          display: flex; align-items: center; gap: 6px; padding: 0; transition: color 0.2s;
        }
        .back-link:hover { color: rgba(255,255,255,0.65); }
      `}</style>

      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.14 }} preserveAspectRatio="none">
        {isForest ? (
          <>
            <circle cx="8%" cy="18%" r="140" fill="#2d6e2d" /><circle cx="88%" cy="12%" r="180" fill="#1e4e1e" />
            <circle cx="50%" cy="78%" r="220" fill="#1a401a" /><circle cx="72%" cy="55%" r="90" fill="#3a7e3a" />
            <circle cx="22%" cy="72%" r="110" fill="#255225" />
          </>
        ) : (
          <>
            <circle cx="12%" cy="22%" r="180" fill="#0a3a6e" /><circle cx="82%" cy="18%" r="150" fill="#0d4a7e" />
            <circle cx="50%" cy="72%" r="260" fill="#083055" /><circle cx="28%" cy="62%" r="100" fill="#1060a0" opacity="0.5" />
            <ellipse cx="50%" cy="92%" rx="420" ry="55" fill="#062040" opacity="0.7" />
          </>
        )}
      </svg>

      <div style={{ position: "absolute", top: "6%", right: "4%", fontFamily: "'Cormorant Garamond', serif", fontSize: 100, opacity: 0.04, lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>
        {isForest ? "🌿" : "∿"}
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "30px 24px 60px", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
          <button className="back-link" onClick={onBack}>← Back</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={`scene-btn ${scene === "forest" ? "active" : ""}`} onClick={() => setScene("forest")}>🌿 Forest</button>
            <button className={`scene-btn ${scene === "sea" ? "active" : ""}`} onClick={() => setScene("sea")}>🌊 Sea</button>
          </div>
        </div>

        <div style={{ marginBottom: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: accentColor, opacity: 0.65 }}>Journal Entry</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 300, color: "rgba(230,240,230,0.88)", letterSpacing: "-0.5px", marginBottom: 36, lineHeight: 1.1 }}>
          {fullDateStr(date)}
        </div>

        <div style={{ background: paperBg, backdropFilter: "blur(24px)", borderRadius: 22, border: `1px solid ${accentColor}18`, padding: "36px 40px 30px", boxShadow: `0 0 80px ${accentColor}06, 0 24px 64px rgba(0,0,0,0.5)` }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontStyle: "italic", color: accentColor, opacity: 0.7, marginBottom: 26, lineHeight: 1.65, borderLeft: `2px solid ${accentColor}35`, paddingLeft: 16 }}>
            {prompt}
          </div>
          <textarea className="journal-textarea" placeholder="Begin writing… let your thoughts flow freely." value={entry} onChange={e => setEntry(e.target.value)} />
          <div style={{ borderTop: `1px solid ${accentColor}15`, marginTop: 22, paddingTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(200,220,200,0.25)" }}>
              {entry.split(/\s+/).filter(Boolean).length} words
            </div>
            <button className="save-btn" onClick={save}>{saved ? "✓ Saved" : "Save entry"}</button>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 44, fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: 15, color: "rgba(200,220,200,0.25)", lineHeight: 1.9 }}>
          {isForest
            ? "The clearest way into the universe is through a forest wilderness."
            : "The sea, once it casts its spell, holds one in its net of wonder forever."}
        </div>
      </div>
    </div>
  );
}

// ─── GOALS PAGE ───────────────────────────────────────────────────────────────
function GoalsPage({ onBack }) {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = lsGet("goals");
    if (saved) { try { setGoals(JSON.parse(saved)); } catch {} }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    lsSet("goals", JSON.stringify(goals));
  }, [goals, loaded]);

  function addGoal() {
    if (!newGoal.trim()) return;
    setGoals(prev => [...prev, { id: Date.now().toString(), text: newGoal.trim(), deadline: newDeadline, done: false }]);
    setNewGoal(""); setNewDeadline(""); setAdding(false);
  }
  function toggleGoal(id) { setGoals(prev => prev.map(g => g.id === id ? { ...g, done: !g.done } : g)); }
  function deleteGoal(id) { setGoals(prev => prev.filter(g => g.id !== id)); }

  const active = goals.filter(g => !g.done);
  const completed = goals.filter(g => g.done);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0ece8" }}>
      <style>{`
        ${GOOGLE_FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .g-back { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #f0ece8; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; transition: all 0.2s; }
        .g-back:hover { background: rgba(255,255,255,0.1); }
        .goal-row { display: flex; align-items: flex-start; gap: 14px; background: rgba(255,255,255,0.02); border-radius: 14px; padding: 16px 18px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s; }
        .goal-row:hover { background: rgba(255,255,255,0.04); }
        .goal-check { width: 22px; height: 22px; border-radius: 6px; border: 2px solid; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; margin-top: 2px; transition: all 0.2s; font-size: 12px; }
        .goal-check:hover { transform: scale(1.1); }
        .goal-del { background: none; border: none; color: rgba(240,236,232,0.12); cursor: pointer; font-size: 18px; padding: 0 4px; transition: color 0.2s; margin-left: auto; }
        .goal-del:hover { color: #ef4444; }
        .g-input { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); color: #f0ece8; border-radius: 8px; padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; width: 100%; }
        .g-input:focus { border-color: rgba(255,255,255,0.32); }
        .g-submit { background: #f0ece8; color: #0d0d14; border: none; padding: 10px 22px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; }
        .g-cancel { background: transparent; color: rgba(240,236,232,0.35); border: none; padding: 10px 12px; cursor: pointer; font-size: 14px; font-family: 'DM Sans', sans-serif; }
        .g-add { background: none; border: 1.5px dashed rgba(240,236,232,0.18); color: rgba(240,236,232,0.4); border-radius: 12px; padding: 12px 20px; cursor: pointer; width: 100%; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: all 0.2s; }
        .g-add:hover { border-color: rgba(240,236,232,0.4); color: #f0ece8; }
        .slbl { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(240,236,232,0.28); margin-bottom: 10px; margin-top: 26px; }
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 28px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <button className="g-back" onClick={onBack}>← Back</button>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>Goal Setting</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(240,236,232,0.38)", marginTop: 5 }}>
              {active.length} active · {completed.length} achieved
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 24px 60px" }}>
        {adding ? (
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "20px", marginBottom: 8 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input className="g-input" placeholder="What's your goal?" value={newGoal} onChange={e => setNewGoal(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addGoal(); if (e.key === "Escape") setAdding(false); }} autoFocus />
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input type="date" className="g-input" value={newDeadline} onChange={e => setNewDeadline(e.target.value)} style={{ flex: "0 0 168px" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(240,236,232,0.28)" }}>target date (optional)</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="g-submit" onClick={addGoal}>Add Goal</button>
                <button className="g-cancel" onClick={() => { setAdding(false); setNewGoal(""); setNewDeadline(""); }}>Cancel</button>
              </div>
            </div>
          </div>
        ) : (
          <button className="g-add" onClick={() => setAdding(true)}>+ Add a new goal</button>
        )}

        {active.length > 0 && (
          <>
            <div className="slbl">In progress</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {active.map(goal => {
                const overdue = goal.deadline && goal.deadline < getToday();
                const daysLeft = goal.deadline ? Math.ceil((new Date(goal.deadline + "T00:00:00") - new Date()) / 86400000) : null;
                return (
                  <div key={goal.id} className="goal-row">
                    <div className="goal-check" onClick={() => toggleGoal(goal.id)} style={{ borderColor: "#a78bfa", color: "transparent" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, lineHeight: 1.4 }}>{goal.text}</div>
                      {goal.deadline && (
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, marginTop: 4, color: overdue ? "#ef4444" : daysLeft <= 3 ? "#f59e0b" : "rgba(240,236,232,0.32)" }}>
                          {overdue ? "⚠ Overdue — " : daysLeft === 0 ? "Due today — " : daysLeft === 1 ? "Due tomorrow — " : `${daysLeft} days left — `}
                          {new Date(goal.deadline + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" })}
                        </div>
                      )}
                    </div>
                    <button className="goal-del" onClick={() => deleteGoal(goal.id)}>×</button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {completed.length > 0 && (
          <>
            <div className="slbl">Achieved ✓</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {completed.map(goal => (
                <div key={goal.id} className="goal-row" style={{ opacity: 0.5 }}>
                  <div className="goal-check" onClick={() => toggleGoal(goal.id)} style={{ borderColor: "#10b981", background: "#10b98122", color: "#10b981" }}>✓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, textDecoration: "line-through", textDecorationColor: "rgba(240,236,232,0.25)" }}>{goal.text}</div>
                  </div>
                  <button className="goal-del" onClick={() => deleteGoal(goal.id)}>×</button>
                </div>
              ))}
            </div>
          </>
        )}

        {goals.length === 0 && !adding && (
          <div style={{ textAlign: "center", marginTop: 64, fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,232,0.28)", fontSize: 14, lineHeight: 1.9 }}>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🎯</div>
            Set your first goal and watch yourself grow.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DAY DETAIL PAGE ──────────────────────────────────────────────────────────
function DayDetailPage({ date, habits, completions, onToggle, onBack, onJournal, onGoals }) {
  const fullDate = fullDateStr(date);
  const done = habits.filter(h => !!completions[`${h.id}::${date}`]);
  const notDone = habits.filter(h => !completions[`${h.id}::${date}`]);
  const pct = habits.length ? Math.round((done.length / habits.length) * 100) : 0;
  const circumference = 2 * Math.PI * 44;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0ece8" }}>
      <style>{`
        ${GOOGLE_FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .d-back { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #f0ece8; border-radius: 8px; padding: 8px 16px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; transition: all 0.2s; }
        .d-back:hover { background: rgba(255,255,255,0.1); }
        .dhr { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.02); border-radius: 14px; padding: 16px 20px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.2s; cursor: pointer; }
        .dhr:hover { background: rgba(255,255,255,0.05) !important; }
        .bchk { width: 42px; height: 42px; border-radius: 50%; border: 2px solid; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: all 0.2s; }
        .bchk:hover { transform: scale(1.08); }
        .rsv2 circle { transition: stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1); }
        .slbl2 { font-family: 'DM Sans', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(240,236,232,0.3); margin-bottom: 10px; margin-top: 26px; }
        .action-card { display: flex; align-items: center; gap: 16px; border-radius: 14px; padding: 18px 22px; border: 1px solid rgba(255,255,255,0.07); cursor: pointer; transition: all 0.2s; text-align: left; background: none; color: #f0ece8; width: 100%; }
        .action-card:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "24px 28px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <button className="d-back" onClick={onBack}>← Back</button>
          <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700 }}>{fullDate}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(240,236,232,0.38)", marginTop: 5 }}>{done.length} of {habits.length} habits completed</div>
            </div>
            <div style={{ position: "relative", width: 92, height: 92 }}>
              <svg className="rsv2" width="92" height="92" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="46" cy="46" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
                <circle cx="46" cy="46" r="44" fill="none" stroke={pct === 100 ? "#10b981" : "#f0ece8"} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{pct}<span style={{ fontSize: 10 }}>%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "22px 24px 60px" }}>
        <div className="slbl2">Tools</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
          <button className="action-card" onClick={onJournal} style={{ background: "rgba(126,200,126,0.05)", borderColor: "rgba(126,200,126,0.18)" }}>
            <span style={{ fontSize: 24 }}>📓</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600 }}>Journal</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(240,236,232,0.38)", marginTop: 2 }}>Write & reflect</div>
            </div>
          </button>
          <button className="action-card" onClick={onGoals} style={{ background: "rgba(167,139,250,0.05)", borderColor: "rgba(167,139,250,0.18)" }}>
            <span style={{ fontSize: 24 }}>🎯</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600 }}>Goals</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(240,236,232,0.38)", marginTop: 2 }}>Track intentions</div>
            </div>
          </button>
        </div>

        {notDone.length > 0 && (
          <>
            <div className="slbl2">Not yet done</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {notDone.map(habit => (
                <div key={habit.id} className="dhr" onClick={() => onToggle(habit.id, date)}>
                  <div className="bchk" style={{ borderColor: "rgba(240,236,232,0.2)" }} />
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15 }}>{habit.icon} {habit.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {done.length > 0 && (
          <>
            <div className="slbl2">Completed</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {done.map(habit => (
                <div key={habit.id} className="dhr" onClick={() => onToggle(habit.id, date)} style={{ opacity: 0.6 }}>
                  <div className="bchk" style={{ borderColor: habit.color, background: habit.color + "22", color: habit.color }}>✓</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, textDecoration: "line-through", textDecorationColor: "rgba(240,236,232,0.25)" }}>{habit.icon} {habit.name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {habits.length === 0 && <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(240,236,232,0.35)", fontSize: 14, textAlign: "center", marginTop: 60 }}>No habits yet.</div>}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
export default function HabitTracker() {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [completions, setCompletions] = useState({});
  const [newHabitName, setNewHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState({ type: "home" });
  const today = getToday();
  const days = getLast7Days();

  useEffect(() => {
    const savedHabits = lsGet("habits");
    if (savedHabits) { try { setHabits(JSON.parse(savedHabits)); } catch {} }
    const savedCompletions = lsGet("completions");
    if (savedCompletions) { try { setCompletions(JSON.parse(savedCompletions)); } catch {} }
    setLoaded(true);
  }, []);

  useEffect(() => { if (!loaded) return; lsSet("habits", JSON.stringify(habits)); }, [habits, loaded]);
  useEffect(() => { if (!loaded) return; lsSet("completions", JSON.stringify(completions)); }, [completions, loaded]);

  function toggle(habitId, date) {
    const key = `${habitId}::${date}`;
    setCompletions(prev => ({ ...prev, [key]: !prev[key] }));
  }
  function isDone(habitId, date) { return !!completions[`${habitId}::${date}`]; }
  function streak(habitId) {
    let count = 0, d = new Date();
    while (true) {
      const key = d.toISOString().split("T")[0];
      if (!completions[`${habitId}::${key}`]) break;
      count++; d.setDate(d.getDate() - 1);
    }
    return count;
  }
  function addHabit() {
    if (!newHabitName.trim()) return;
    const colors = ["#ec4899", "#f59e0b", "#3b82f6", "#a78bfa", "#34d399"];
    const icons = ["⭐", "🎯", "✨", "🔥", "💪"];
    const idx = habits.length % colors.length;
    setHabits(prev => [...prev, { id: Date.now().toString(), name: newHabitName.trim(), icon: icons[idx], color: colors[idx] }]);
    setNewHabitName(""); setAdding(false);
  }
  function removeHabit(id) { setHabits(prev => prev.filter(h => h.id !== id)); }

  const todayScore = habits.filter(h => isDone(h.id, today)).length;
  const pct = habits.length ? Math.round((todayScore / habits.length) * 100) : 0;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (pct / 100) * circumference;

  if (page.type === "journal") return <JournalingPage date={page.date} onBack={() => setPage({ type: "day", date: page.date })} />;
  if (page.type === "goals") return <GoalsPage onBack={() => setPage({ type: "day", date: page.date })} />;
  if (page.type === "day") return (
    <DayDetailPage date={page.date} habits={habits} completions={completions}
      onToggle={toggle} onBack={() => setPage({ type: "home" })}
      onJournal={() => setPage({ type: "journal", date: page.date })}
      onGoals={() => setPage({ type: "goals", date: page.date })}
    />
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#f0ece8" }}>
      <style>{`
        ${GOOGLE_FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hr { transition: all 0.2s; }
        .hr:hover { background: rgba(255,255,255,0.04) !important; }
        .chk { width: 32px; height: 32px; border-radius: 50%; border: 2px solid; cursor: pointer; background: transparent; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 14px; flex-shrink: 0; }
        .chk:hover { transform: scale(1.15); }
        .ddot { width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid; cursor: pointer; background: transparent; display: flex; align-items: center; justify-content: center; transition: all 0.15s; font-size: 10px; }
        .ddot:hover { transform: scale(1.12); }
        .ab { background: none; border: 1.5px dashed rgba(240,236,232,0.18); color: rgba(240,236,232,0.4); border-radius: 12px; padding: 12px 20px; cursor: pointer; width: 100%; font-family: 'DM Sans', sans-serif; font-size: 14px; transition: all 0.2s; }
        .ab:hover { border-color: rgba(240,236,232,0.4); color: #f0ece8; background: rgba(255,255,255,0.03); }
        .sf { background: #f0ece8; color: #0d0d14; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; }
        .sf:hover { opacity: 0.85; }
        .cf { background: transparent; color: rgba(240,236,232,0.35); border: none; padding: 9px 12px; cursor: pointer; font-size: 14px; font-family: 'DM Sans', sans-serif; }
        .if { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.13); color: #f0ece8; border-radius: 8px; padding: 9px 13px; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; flex: 1; }
        .if:focus { border-color: rgba(255,255,255,0.3); }
        .rm { background: none; border: none; color: rgba(240,236,232,0.12); cursor: pointer; font-size: 16px; padding: 3px 6px; transition: color 0.2s; flex-shrink: 0; }
        .rm:hover { color: #ef4444; }
        .rsc circle { transition: stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1); }
        .dc { cursor: pointer; text-align: center; transition: opacity 0.15s; }
        .dc:hover { opacity: 0.6 !important; }
        .bc { display: flex; align-items: center; gap: 12px; border-radius: 14px; padding: 16px 18px; cursor: pointer; transition: all 0.2s; text-align: left; background: none; color: #f0ece8; border: 1px solid rgba(255,255,255,0.06); width: 100%; }
        .bc:hover { transform: translateY(-1px); }
      `}</style>

      <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "22px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 23, fontWeight: 700, letterSpacing: "-0.5px" }}>Daily Ritual</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(240,236,232,0.38)", marginTop: 3 }}>
              {new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ position: "relative", width: 76, height: 76 }}>
            <svg className="rsc" width="76" height="76" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="38" cy="38" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
              <circle cx="38" cy="38" r="36" fill="none" stroke={pct === 100 ? "#10b981" : "#f0ece8"} strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
              <div style={{ fontSize: 17, fontWeight: 500 }}>{pct}<span style={{ fontSize: 9 }}>%</span></div>
              <div style={{ fontSize: 8, color: "rgba(240,236,232,0.35)", marginTop: 1 }}>today</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32 }} />
          <div style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: 9, letterSpacing: "0.13em", color: "rgba(240,236,232,0.26)", textTransform: "uppercase" }}>Habit</div>
          <div style={{ display: "flex", gap: 5 }}>
            {days.map(d => {
              const { day, num } = formatDay(d);
              const isToday = d === today;
              return (
                <div key={d} className="dc" onClick={() => setPage({ type: "day", date: d })} title={`View ${d}`} style={{ width: 24 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 7.5, color: isToday ? "#f0ece8" : "rgba(240,236,232,0.25)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{day}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 9.5, color: isToday ? "#f0ece8" : "rgba(240,236,232,0.25)", fontWeight: isToday ? 600 : 400, borderBottom: "1px dotted rgba(240,236,232,0.14)", paddingBottom: 2 }}>{num}</div>
                </div>
              );
            })}
          </div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {habits.map(habit => {
            const s = streak(habit.id);
            return (
              <div key={habit.id} className="hr" style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "10px 10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <button className="chk" onClick={() => toggle(habit.id, today)} style={{ borderColor: isDone(habit.id, today) ? habit.color : "rgba(240,236,232,0.2)", background: isDone(habit.id, today) ? habit.color + "22" : "transparent", color: isDone(habit.id, today) ? habit.color : "transparent" }}>
                  {isDone(habit.id, today) ? "✓" : ""}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{habit.icon} {habit.name}</div>
                  {s > 0 && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: habit.color, marginTop: 1, opacity: 0.8 }}>🔥 {s}d</div>}
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {days.map(d => {
                    const done = isDone(habit.id, d);
                    const isToday = d === today;
                    return (
                      <button key={d} className="ddot" onClick={() => toggle(habit.id, d)} title={d}
                        style={{ borderColor: done ? habit.color : isToday ? "rgba(240,236,232,0.25)" : "rgba(240,236,232,0.08)", background: done ? habit.color : "transparent", color: done ? "#fff" : "transparent" }}>
                        {done ? "✓" : ""}
                      </button>
                    );
                  })}
                </div>
                <button className="rm" onClick={() => removeHabit(habit.id)}>×</button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          {adding ? (
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 0" }}>
              <input className="if" placeholder="Habit name…" value={newHabitName} onChange={e => setNewHabitName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") addHabit(); if (e.key === "Escape") setAdding(false); }} autoFocus />
              <button className="sf" onClick={addHabit}>Add</button>
              <button className="cf" onClick={() => { setAdding(false); setNewHabitName(""); }}>Cancel</button>
            </div>
          ) : (
            <button className="ab" onClick={() => setAdding(true)}>+ Add custom habit</button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 28 }}>
          <button className="bc" onClick={() => setPage({ type: "journal", date: today })} style={{ background: "rgba(126,200,126,0.04)", borderColor: "rgba(126,200,126,0.14)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(126,200,126,0.09)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(126,200,126,0.04)"}>
            <span style={{ fontSize: 22 }}>📓</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600 }}>Today's Journal</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(240,236,232,0.38)", marginTop: 2 }}>Reflect & write</div>
            </div>
          </button>
          <button className="bc" onClick={() => setPage({ type: "goals", date: today })} style={{ background: "rgba(167,139,250,0.04)", borderColor: "rgba(167,139,250,0.14)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.09)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(167,139,250,0.04)"}>
            <span style={{ fontSize: 22 }}>🎯</span>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 600 }}>Goals</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(240,236,232,0.38)", marginTop: 2 }}>Set & track</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
