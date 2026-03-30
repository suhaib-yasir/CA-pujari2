"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const posts = [
  { author: "Alex Chen",      avatar: "AC", role: "Pro Trader",     time: "2h ago",
    content: "Just closed a 3:1 risk/reward trade on BTC. The key was waiting for the liquidity sweep at the 4H demand zone before entering. Patience pays! 🎯",
    tags: ["BTC", "Crypto", "RiskManagement"], likes: 284, replies: 47 },
  { author: "Sarah Williams", avatar: "SW", role: "Forex Analyst",  time: "5h ago",
    content: "EUR/USD weekly outlook: watching the 1.0850 confluence zone. Strong rejection candle forming on the daily — could see a push back to 1.0920 if bulls hold.",
    tags: ["Forex", "EURUSD", "TechnicalAnalysis"], likes: 196, replies: 32 },
  { author: "Marcus Davis",   avatar: "MD", role: "Quant Trader",   time: "1d ago",
    content: "Backtest results for my new momentum strategy: 68% win rate across 5 years of SPX data. Sharing the full breakdown in the Education channel. Check it out!",
    tags: ["Quant", "SPX", "Momentum", "Strategy"], likes: 412, replies: 88 },
];

// Keep original avatar gradients — they're decorative and look great on both themes
const avatarGrads = [
  "linear-gradient(135deg, #4FD1FF, #3B82F6)",
  "linear-gradient(135deg, #3B82F6, #8B5CF6)",
  "linear-gradient(135deg, #8B5CF6, #4FD1FF)",
];

export default function PostsSection() {
  const { isLight } = useTheme();

  // ── Warm beige/gold palette for light, neon blue for dark ────────────
  const eyebrowColor  = isLight ? "#D4A574" : "#4FD1FF";
  const eyebrowShadow = isLight ? "none"    : "none";
  const titleColor    = isLight ? "#000000" : "#EAF2FF";

  const btnOutlineColor       = isLight ? "#D4A574"                             : "#4FD1FF";
  const btnOutlineBorder      = isLight ? "1px solid rgba(107,79,10,0.28)"      : "1px solid rgba(79,209,255,0.35)";
  const btnOutlineBg          = isLight ? "rgba(0,0,0,0.07)"               : "rgba(79,209,255,0.07)";
  const btnOutlineShadow      = isLight ? "none"    : "none";
  const btnOutlineHoverBg     = isLight ? "rgba(0,0,0,0.14)"               : "rgba(79,209,255,0.15)";
  const btnOutlineHoverBorder = isLight ? "rgba(0,0,0,0.55)"               : "rgba(79,209,255,0.65)";
  const btnOutlineHoverShadow = isLight ? "none"   : "none";

  const cardBg          = isLight ? "rgba(255,248,228,0.92)" : "rgba(11,15,42,0.55)";
  const cardBlur        = "blur(22px)";
  const cardBorder      = isLight ? "1px solid rgba(200,165,80,0.28)"  : "1px solid rgba(79,209,255,0.10)";
  const cardBorderLeave = isLight ? "rgba(200,165,80,0.28)"             : "rgba(79,209,255,0.10)";
  const cardBorderHover = isLight ? "rgba(0,0,0,0.45)"             : "rgba(79,209,255,0.35)";
  const cardShadowHover = isLight ? "none" : "none";
  const cardTopLine = isLight
    ? "linear-gradient(to right, transparent, rgba(0,0,0,0.32), rgba(0,0,0,0.24), transparent)"
    : "linear-gradient(to right, transparent, rgba(79,209,255,0.45), rgba(139,92,246,0.35), transparent)";
  const cardRadial = isLight
    ? "radial-gradient(circle at top right, rgba(200,165,80,0.09), transparent 70%)"
    : "radial-gradient(circle at top right, rgba(79,209,255,0.08), transparent 70%)";

  const authorColor  = isLight ? "#000000"              : "#EAF2FF";
  const roleColor    = isLight ? "#FFFFFF"              : "#4FD1FF";
  const roleShadow   = isLight ? "none"                 : "none";
  const timeColor    = isLight ? "rgba(0,0,0,0.46)"  : "rgba(165,180,252,0.45)";
  const contentColor = isLight ? "rgba(0,0,0,0.82)"  : "rgba(234,242,255,0.80)";

  const tagBg     = isLight ? "rgba(0,0,0,0.12)"           : "rgba(79,209,255,0.08)";
  const tagBorder = isLight ? "1px solid rgba(0,0,0,0.32)" : "1px solid rgba(79,209,255,0.22)";
  const tagColor  = isLight ? "#FFFFFF"                          : "#4FD1FF";

  const btnDivider      = isLight ? "1px solid rgba(0,0,0,0.10)"   : "1px solid rgba(79,209,255,0.07)";
  const actionColor     = isLight ? "rgba(255,255,255,0.50)"              : "rgba(165,180,252,0.5)";
  const actionHoverLike = isLight ? "#FFFFFF"                           : "#4FD1FF";
  const actionHoverChat = isLight ? "#FFFFFF"                           : "#8B5CF6";
  const shareColor      = isLight ? "rgba(255,255,255,0.40)"              : "rgba(165,180,252,0.4)";
  const shareHoverColor = isLight ? "#FFFFFF"                           : "#EAF2FF";

  return (
    <section style={{ padding: "90px 24px 130px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "48px", flexWrap: "wrap", gap: "16px" }}
        >
          <div>
            <p style={{
              color: eyebrowColor, fontSize: "13px", fontWeight: 600,
              letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px",
              textShadow: eyebrowShadow, transition: "color 0.4s ease",
            }}>Latest Discussions</p>
            <h2 style={{ color: titleColor, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, transition: "color 0.4s ease" }}>
              Community{" "}
              {isLight ? (
                <span style={{ color: "#FFFFFF" }}>Feed</span>
              ) : (
                <span style={{
                  background: "linear-gradient(135deg, #4FD1FF, #3B82F6, #8B5CF6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}>Feed</span>
              )}
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
            style={{
              padding: "11px 26px", borderRadius: "100px", fontSize: "0.875rem", fontWeight: 600,
              border: btnOutlineBorder, background: btnOutlineBg,
              color: btnOutlineColor, cursor: "pointer", backdropFilter: "blur(12px)",
              transition: "all 0.3s ease", boxShadow: btnOutlineShadow,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = btnOutlineHoverBg;
              el.style.borderColor = btnOutlineHoverBorder;
              el.style.boxShadow  = btnOutlineHoverShadow;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.background = btnOutlineBg;
              el.style.borderColor = btnOutlineBorder;
              el.style.boxShadow  = btnOutlineShadow;
            }}
          >View All Posts</motion.button>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
          {posts.map((post, i) => (
            <motion.div
              key={post.author}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.025, y: -5 }}
              style={{
                background: cardBg, backdropFilter: cardBlur, WebkitBackdropFilter: cardBlur,
                border: cardBorder, borderRadius: "18px", padding: "24px",
                cursor: "pointer",
                transition: "all 0.4s ease, border-color 0.3s, box-shadow 0.3s",
                position: "relative", overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = cardBorderHover;
                el.style.boxShadow   = cardShadowHover;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = cardBorderLeave;
                el.style.boxShadow   = "none";
              }}
            >
              <div style={{ position: "absolute", top: 0, left: "12%", right: "12%", height: "1px", background: cardTopLine }} />
              <div style={{ position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
                background: cardRadial, pointerEvents: "none" }} />

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "50%",
                    background: avatarGrads[i % 3],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#FFFFFF", fontSize: "13px", fontWeight: 800,
                    border: isLight ? "2px solid rgba(200,165,80,0.45)" : "2px solid rgba(79,209,255,0.25)",
                    boxShadow: isLight ? "0 2px 10px rgba(80,50,10,0.15)" : "0 0 18px rgba(79,209,255,0.22)",
                    flexShrink: 0, transition: "all 0.4s ease",
                  }}>{post.avatar}</div>
                  <div>
                    <div style={{ color: authorColor, fontWeight: 600, fontSize: "0.9rem", transition: "color 0.4s ease" }}>{post.author}</div>
                    <div style={{ color: roleColor, fontSize: "0.75rem", fontWeight: 500, textShadow: roleShadow, transition: "color 0.4s ease" }}>{post.role}</div>
                  </div>
                </div>
                <span style={{ color: timeColor, fontSize: "0.78rem", transition: "color 0.4s ease" }}>{post.time}</span>
              </div>

              <p style={{ color: contentColor, fontSize: "0.9rem", lineHeight: 1.68, marginBottom: "16px", transition: "color 0.4s ease" }}>
                {post.content}
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {post.tags.map(tag => (
                  <span key={tag} style={{
                    padding: "3px 11px", borderRadius: "100px", fontSize: "0.73rem", fontWeight: 600,
                    background: tagBg, border: tagBorder, color: tagColor, letterSpacing: "0.03em",
                    transition: "all 0.4s ease",
                  }}>#{tag}</span>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "20px", borderTop: btnDivider, paddingTop: "14px", transition: "border-color 0.4s ease" }}>
                {[
                  { icon: "❤️", count: post.likes,   hc: actionHoverLike },
                  { icon: "💬", count: post.replies, hc: actionHoverChat },
                ].map(({ icon, count, hc }) => (
                  <button key={icon} style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    background: "none", border: "none", cursor: "pointer",
                    color: actionColor, fontSize: "0.85rem", fontWeight: 500,
                    transition: "color 0.2s", padding: 0,
                  }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = hc; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = actionColor; }}
                  >{icon} {count}</button>
                ))}
                <button style={{
                  marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px",
                  background: "none", border: "none", cursor: "pointer",
                  color: shareColor, fontSize: "0.85rem",
                  transition: "color 0.2s", padding: 0,
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = shareHoverColor; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = shareColor; }}
                >↗ Share</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
