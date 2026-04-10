"use client";
import React, { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are an elite viral content strategist specializing in short-form Instagram Reels for a nurse-themed aesthetic account. You create CCTV-style, 3rd person perspective content ideas that are controversial, high-engagement, and algorithm-optimized.

The content format:
- CCTV/security camera angle or 3rd person perspective
- Aesthetic nurse setting (hospital corridor, nurse station, exam room, break room, supply closet, elevator, parking garage)
- The creator is an attractive woman in nurse aesthetic outfits (scrubs, fitted medical attire, stethoscope, badge)
- Maximum video length: 12 seconds
- Must achieve 2-3x watch time (people rewatch multiple times)
- Must generate massive comments, shares, saves, reposts
- Must be controversial enough to spark debate but not get removed
- Overall vibe must be AESTHETIC - clean, cinematic, moody lighting

When given a short idea (2-5 words), you produce a FULL production roadmap.

RESPOND ONLY IN THIS EXACT JSON FORMAT (no markdown, no backticks, no preamble):
{
  "title": "Catchy reel title (5-8 words)",
  "controversy_angle": "Why this will spark debate (1 sentence)",
  "virality_score": 8-10,
  "rewatch_factor": "Why people will watch 2-3x (1 sentence)",
  "background": {
    "location": "Specific location description",
    "lighting": "Lighting setup details",
    "props": "Key props visible in frame",
    "camera_angle": "CCTV or 3rd person angle description",
    "aesthetic_notes": "Color palette, mood, vibe details"
  },
  "characters": {
    "creator": "What the creator wears, her vibe, hair, energy",
    "others": "Other characters, what they wear, their role"
  },
  "script": {
    "hook": { "seconds": "0-3", "action": "Exact action description", "text_overlay": "Text on screen if any" },
    "buildup": { "seconds": "3-7", "action": "What happens next - the tension builder", "text_overlay": "Text on screen if any" },
    "turning_point": { "seconds": "7-10", "action": "The twist or shocking moment", "text_overlay": "Text on screen if any" },
    "end": { "seconds": "10-12", "action": "The ending that makes people rewatch", "text_overlay": "Text on screen if any" }
  },
  "audio": "Suggested trending sound or audio style",
  "hashtags": ["5-7 relevant hashtags"],
  "caption": "Engaging caption with emoji (max 2 lines)",
  "comment_bait": "First comment the creator should post to spark engagement",
  "posting_time": "Best time to post for US audience",
  "why_10m_potential": "1-2 sentences on why this could hit 10M views"
}`;

const THEMES = [
  { emoji: "📹", label: "CCTV", desc: "Security cam POV" },
  { emoji: "👁️", label: "3rd Person", desc: "Voyeur angle" },
  { emoji: "🏥", label: "Hospital", desc: "Clinical setting" },
  { emoji: "🌙", label: "Night Shift", desc: "After hours vibe" },
];

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const idx = useRef(0);
  useEffect(() => {
    idx.current = 0;
    setDisplayed("");
    if (!text) return;
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(text.slice(0, idx.current));
      if (idx.current >= text.length) clearInterval(iv);
    }, 8);
    return () => clearInterval(iv);
  }, [text]);
  return displayed;
}

function Badge({ children, color = "#ff3366" }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      background: color + "18",
      color: color,
      padding: "3px 10px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 700,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
      border: `1px solid ${color}30`,
    }}>{children}</span>
  );
}

function Section({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
        color: "#ff3366", textTransform: "uppercase", letterSpacing: "1.5px",
      }}>
        <span style={{ fontSize: 14 }}>{icon}</span> {label}
      </div>
      {children}
    </div>
  );
}

function ScriptBeat({ label, seconds, action, overlay, color }: { label: string; seconds: string; action: string; overlay?: string; color: string }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "90px 1fr", gap: 12,
      padding: "10px 14px", background: "#0d0d0d", borderRadius: 6,
      borderLeft: `3px solid ${color}`, marginBottom: 6,
    }}>
      <div>
        <div style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
        <div style={{ fontSize: 13, color: color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{seconds}s</div>
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#e0e0e0", lineHeight: 1.5 }}>{action}</div>
        {overlay && overlay !== "none" && overlay !== "None" && (
          <div style={{ marginTop: 4, fontSize: 11, color: "#888", fontStyle: "italic" }}>📝 "{overlay}"</div>
        )}
      </div>
    </div>
  );
}

export default function NurseReelIdeaFarm() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Array<{ idea: string; title: string; ts: number }>>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  async function generate() {
    if (!idea.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    const themePrefix = selectedTheme ? `[${selectedTheme} style] ` : "";
    const fullIdea = themePrefix + idea.trim();

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || "", "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 2048,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Generate a FULL viral reel roadmap for this idea: "${fullIdea}"\n\nRespond ONLY with valid JSON. No markdown, no backticks, no explanation.` }],
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }
      const text = (data.content || []).map((b: any) => b.text || "").join("");
      if (!text) throw new Error("Empty response from API");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setHistory(prev => [{ idea: fullIdea, title: parsed.title, ts: Date.now() }, ...prev].slice(0, 20));
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: any) {
      setError(`Error: ${e.message}`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const r = result;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#e0e0e0",
      fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "40px 24px 30px",
        borderBottom: "1px solid #1a1a1a",
        background: "linear-gradient(180deg, #0f0808 0%, #080808 100%)",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 28 }}>🔥</span>
            <h1 style={{
              margin: 0, fontSize: 28, fontWeight: 900,
              fontFamily: "'Playfair Display', serif",
              background: "linear-gradient(135deg, #ff3366, #ff6633)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>REEL IDEA FARM</h1>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#666", fontFamily: "'JetBrains Mono', monospace" }}>
            Nurse Aesthetic • CCTV/3rd Person • Controversial • Viral-Engineered
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px" }}>
        {/* Theme Pills */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {THEMES.map(t => (
            <button key={t.label} onClick={() => setSelectedTheme(selectedTheme === t.label ? null : t.label)}
              style={{
                background: selectedTheme === t.label ? "#ff336620" : "#111",
                border: `1px solid ${selectedTheme === t.label ? "#ff3366" : "#222"}`,
                color: selectedTheme === t.label ? "#ff3366" : "#888",
                padding: "8px 14px", borderRadius: 6, cursor: "pointer",
                fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              <span>{t.emoji}</span> {t.label}
              <span style={{ fontSize: 10, opacity: 0.6 }}>{t.desc}</span>
            </button>
          ))}
        </div>

        {/* Input + Button */}
        <div style={{ display: "flex", gap: 10 }}>
          <input
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !loading && generate()}
            placeholder="Describe your reel idea in 2-5 words..."
            style={{
              flex: 1, background: "#111", border: "1px solid #222",
              color: "#e0e0e0", padding: "14px 18px", borderRadius: 8,
              fontSize: 15, outline: "none", fontFamily: "inherit",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#ff3366"}
            onBlur={e => e.target.style.borderColor = "#222"}
          />
          <button
            onClick={generate}
            disabled={loading || !idea.trim()}
            style={{
              background: loading ? "#333" : "linear-gradient(135deg, #ff3366, #ff4433)",
              color: "#fff", border: "none", padding: "14px 28px",
              borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer",
              opacity: !idea.trim() ? 0.4 : 1, transition: "all 0.2s",
              whiteSpace: "nowrap", letterSpacing: "0.5px",
            }}>
            {loading ? "⏳ CRAFTING..." : "🎬 GENERATE"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: 12, background: "#1a0808", border: "1px solid #ff333340", borderRadius: 6, color: "#ff6666", fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div style={{
            marginTop: 30, padding: 40, textAlign: "center",
            background: "#0a0a0a", borderRadius: 10, border: "1px solid #1a1a1a",
          }}>
            <div style={{
              width: 40, height: 40, border: "3px solid #1a1a1a", borderTopColor: "#ff3366",
              borderRadius: "50%", margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ color: "#ff3366", fontSize: 13, fontFamily: "'JetBrains Mono', monospace", margin: 0 }}>
              Engineering viral potential...
            </p>
          </div>
        )}

        {/* Result */}
        {r && !loading && (
          <div ref={resultRef} style={{ marginTop: 28 }}>
            {/* Title Card */}
            <div style={{
              background: "linear-gradient(135deg, #0f0808, #1a0a0a)",
              border: "1px solid #ff336625",
              borderRadius: 12, padding: 24, marginBottom: 20,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{
                    margin: "0 0 8px", fontSize: 22, fontWeight: 900,
                    fontFamily: "'Playfair Display', serif", color: "#fff",
                  }}>
                    <TypewriterText text={r.title} />
                  </h2>
                  <p style={{ margin: 0, fontSize: 13, color: "#999", lineHeight: 1.6 }}>
                    {r.controversy_angle}
                  </p>
                </div>
                <div style={{
                  background: "#ff336615", border: "1px solid #ff336640",
                  borderRadius: 8, padding: "8px 14px", textAlign: "center",
                  minWidth: 70,
                }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace" }}>
                    {r.virality_score}
                  </div>
                  <div style={{ fontSize: 9, color: "#ff6666", textTransform: "uppercase", letterSpacing: 1 }}>VIRAL</div>
                </div>
              </div>
              <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge color="#ff3366">🔄 {r.rewatch_factor}</Badge>
              </div>
            </div>

            {/* Background / Set Design */}
            {r.background && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <Section label="Set Design & Background" icon="🎬">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      ["📍 Location", r.background.location],
                      ["💡 Lighting", r.background.lighting],
                      ["🎭 Props", r.background.props],
                      ["📷 Camera", r.background.camera_angle],
                    ].map(([label, val]) => (
                      <div key={label} style={{ background: "#080808", padding: "10px 14px", borderRadius: 6, border: "1px solid #151515" }}>
                        <div style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
                        <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {r.background.aesthetic_notes && (
                    <div style={{ marginTop: 10, padding: "10px 14px", background: "#080808", borderRadius: 6, border: "1px solid #151515" }}>
                      <div style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>🎨 Aesthetic</div>
                      <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{r.background.aesthetic_notes}</div>
                    </div>
                  )}
                </Section>
              </div>
            )}

            {/* Characters */}
            {r.characters && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <Section label="Characters" icon="👥">
                  <div style={{ display: "grid", gap: 10 }}>
                    <div style={{ background: "#080808", padding: "12px 14px", borderRadius: 6, border: "1px solid #ff336615" }}>
                      <div style={{ fontSize: 10, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>⭐ Creator / Main Character</div>
                      <div style={{ fontSize: 13, color: "#e0e0e0", lineHeight: 1.6 }}>{r.characters.creator}</div>
                    </div>
                    <div style={{ background: "#080808", padding: "12px 14px", borderRadius: 6, border: "1px solid #151515" }}>
                      <div style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>🎭 Supporting Characters</div>
                      <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>{r.characters.others}</div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* Script Timeline */}
            {r.script && (
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
                <Section label="12-Second Script Breakdown" icon="🎬">
                  <ScriptBeat label="HOOK" seconds={r.script.hook?.seconds} action={r.script.hook?.action} overlay={r.script.hook?.text_overlay} color="#ff3366" />
                  <ScriptBeat label="BUILDUP" seconds={r.script.buildup?.seconds} action={r.script.buildup?.action} overlay={r.script.buildup?.text_overlay} color="#ff6633" />
                  <ScriptBeat label="TWIST" seconds={r.script.turning_point?.seconds} action={r.script.turning_point?.action} overlay={r.script.turning_point?.text_overlay} color="#ffcc00" />
                  <ScriptBeat label="END" seconds={r.script.end?.seconds} action={r.script.end?.action} overlay={r.script.end?.text_overlay} color="#33ff66" />
                </Section>
              </div>
            )}

            {/* Audio + Posting Strategy */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>🎵 Audio</div>
                <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{r.audio}</div>
              </div>
              <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 10, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>⏰ Post Time</div>
                <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{r.posting_time}</div>
              </div>
            </div>

            {/* Caption + Comment Bait */}
            <div style={{ background: "#0d0d0d", border: "1px solid #1a1a1a", borderRadius: 10, padding: 20, marginBottom: 16 }}>
              <Section label="Caption & Engagement" icon="💬">
                <div style={{ background: "#080808", padding: 14, borderRadius: 6, border: "1px solid #151515", marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: "#666", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Caption</div>
                  <div style={{ fontSize: 14, color: "#e0e0e0", lineHeight: 1.5 }}>{r.caption}</div>
                </div>
                <div style={{ background: "#080808", padding: 14, borderRadius: 6, border: "1px solid #ff336615" }}>
                  <div style={{ fontSize: 10, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>💣 Comment Bait (pin this)</div>
                  <div style={{ fontSize: 14, color: "#e0e0e0", lineHeight: 1.5 }}>{r.comment_bait}</div>
                </div>
              </Section>
            </div>

            {/* Hashtags */}
            {r.hashtags && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                {r.hashtags.map((h: string, i: number) => (
                  <span key={i} style={{
                    background: "#111", border: "1px solid #222", borderRadius: 4,
                    padding: "5px 10px", fontSize: 12, color: "#888",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>{h.startsWith("#") ? h : "#" + h}</span>
                ))}
              </div>
            )}

            {/* 10M Potential */}
            {r.why_10m_potential && (
              <div style={{
                background: "linear-gradient(135deg, #1a0808, #0f0808)",
                border: "1px solid #ff336630",
                borderRadius: 10, padding: 18,
              }}>
                <div style={{ fontSize: 10, color: "#ff3366", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>🚀 10M View Potential</div>
                <div style={{ fontSize: 14, color: "#e0e0e0", lineHeight: 1.6 }}>{r.why_10m_potential}</div>
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div style={{ marginTop: 40, borderTop: "1px solid #1a1a1a", paddingTop: 24 }}>
            <div style={{ fontSize: 11, color: "#444", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>
              📋 Idea History ({history.length})
            </div>
            {history.map((h, i) => (
               <div key={h.ts} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", background: i === 0 ? "#0f0808" : "transparent",
                borderRadius: 6, marginBottom: 4, cursor: "pointer",
                border: i === 0 ? "1px solid #ff336615" : "1px solid transparent",
              }}
                onClick={() => { setIdea(h.idea.replace(/^\[.*?\]\s*/, "")); }}
              >
                <div style={{ fontSize: 13, color: "#999" }}>
                  <span style={{ color: "#ff3366", marginRight: 8 }}>→</span>{h.title}
                </div>
                <div style={{ fontSize: 10, color: "#444", fontFamily: "'JetBrains Mono', monospace" }}>
                  {new Date(h.ts).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
