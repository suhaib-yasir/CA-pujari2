"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const stats = [
  { value: 48, suffix: "K+", label: "Active Members", img: "activemembers.png" },
  { value: 12, suffix: "K+", label: "Trading Signals", img: "tradingsignals.png" },
  { value: 98, suffix: "%",  label: "Success Rate",    img: "successrate.png" },
  { value: 24, suffix: "/7", label: "Live Support",    img: "livesupport.png" },
];

function AnimatedCounter({ value, suffix, duration = 2 }: { value: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1000 / duration, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function StatsSection() {
  const { isLight } = useTheme();

  // ── Warm beige/gold palette for light, neon blue for dark ────────────
  const eyebrowColor  = isLight ? "#D4A574" : "#4FD1FF";
  const eyebrowShadow = isLight ? "none"    : "0 0 20px rgba(79,209,255,0.6)";
  const titleColor    = isLight ? "#000000" : "#EAF2FF";

  // White cream cards on light, dark glass on dark
  const cardBg          = isLight ? "rgba(255,248,228,0.45)" : "rgba(11,15,42,0.52)";
  const cardBlur        = "blur(22px)";
  const cardBorder      = isLight ? "1px solid rgba(200,165,80,0.28)"  : "1px solid rgba(79,209,255,0.15)";
  const cardBorderHover = isLight ? "rgba(0,0,0,0.50)"            : "rgba(79,209,255,0.45)";
  const cardShadowHover = isLight ? "none" : "none";
  const cardRadial = isLight
    ? "radial-gradient(circle at top right, rgba(0,0,0,0.10), transparent 70%)"
    : "radial-gradient(circle at top right, rgba(79,209,255,0.12), transparent 70%)";
  const cardLine = isLight
    ? "linear-gradient(to right, transparent, rgba(180,145,60,0.32), transparent)"
    : "linear-gradient(to right, transparent, rgba(79,209,255,0.5), transparent)";

  const statLabelColor = isLight ? "rgba(255,255,255,0.85)" : "rgba(165,180,252,0.75)";

  return (
    <section style={{ padding: "90px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "64px" }}
        >
          <p style={{
            color: eyebrowColor, fontSize: "13px", fontWeight: 600,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px",
            textShadow: eyebrowShadow, transition: "color 0.4s ease",
          }}>Community Impact</p>
          <h2 style={{ color: titleColor, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, transition: "color 0.4s ease" }}>
            Trusted by traders{" "}
            {isLight ? (
              <span style={{ color: "#FFFFFF" }}>worldwide</span>
            ) : (
              <span style={{
                background: "linear-gradient(135deg, #4FD1FF, #3B82F6, #8B5CF6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>worldwide</span>
            )}
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "24px" }}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 45, scale: 0.93 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              style={{
                background: cardBg,
                backdropFilter: cardBlur, WebkitBackdropFilter: cardBlur,
                border: cardBorder, borderRadius: "20px",
                padding: "92px 28px 38px", textAlign: "center",
                cursor: "default",
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
                el.style.borderColor = isLight ? "rgba(200,165,80,0.28)" : "rgba(79,209,255,0.15)";
                el.style.boxShadow   = "none";
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, width: "90px", height: "90px",
                background: cardRadial, pointerEvents: "none", transition: "background 0.6s ease" }} />
              <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px",
                background: cardLine, transition: "background 0.6s ease" }} />

              <div style={{ position: "absolute", top: "24px", left: "50%", transform: "translateX(-50%)", width: "88px", height: "88px", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                <img src={`/${stat.img}`} alt={stat.label} style={{ width: "77px", height: "77px", objectFit: "cover", borderRadius: "50%", display: "block" }} />
              </div>

              {isLight ? (
                <div style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
                  color: "#FFFFFF",
                  lineHeight: 1, marginBottom: "12px",
                }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
              ) : (
                <div style={{
                  fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
                  background: "linear-gradient(135deg, #4FD1FF, #3B82F6)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  lineHeight: 1, marginBottom: "12px",
                }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
              )}
              <p style={{ color: statLabelColor, fontSize: "0.95rem", fontWeight: 500, transition: "color 0.4s ease" }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
