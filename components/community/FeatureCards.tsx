"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

const features = [
  { img: "live trading.jpeg", title: "Live Trading Signals",  colorA: "#4FD1FF", colorB: "#3B82F6",
    description: "Get real-time alerts from pro traders. Never miss a high-probability setup with our AI-powered signal system." },
  { img: "expertmentor.jpeg", title: "Expert Mentorship",      colorA: "#3B82F6", colorB: "#8B5CF6",
    description: "Learn from verified traders with years of experience. One-on-one sessions, group webinars, and curated courses." },
  { img: "advancedanalytics.jpeg", title: "Advanced Analytics",     colorA: "#8B5CF6", colorB: "#4FD1FF",
    description: "Deep-dive into market data with institutional-grade tools. Track your performance and optimize your strategy." },
  { img: "communityforums.jpeg", title: "Community Forums",        colorA: "#4FD1FF", colorB: "#3B82F6",
    description: "Engage with thousands of traders globally. Share ideas, discuss markets, and build your network." },
  { img: "riskmanagement.jpeg", title: "Risk Management",         colorA: "#3B82F6", colorB: "#8B5CF6",
    description: "Master the art of protecting capital. Our structured risk frameworks keep your portfolio safe." },
  { img: "exclusivelaunches.jpeg", title: "Exclusive Launches",      colorA: "#8B5CF6", colorB: "#4FD1FF",
    description: "Early access to new trading tools, strategies, and beta features before they go public." },
];

// Gold/amber equivalents for the neon accent colors (used on light cream cards)
const LIGHT_EQUIV: Record<string, string> = {
  "#4FD1FF": "#D4A574",
  "#3B82F6": "#D4A574",
  "#8B5CF6": "#D4A574",
};

function TiltCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref  = useRef<HTMLDivElement>(null);
  const x    = useMotionValue(0), y = useMotionValue(0);
  const sx   = useSpring(x, { stiffness: 180, damping: 22 });
  const sy   = useSpring(y, { stiffness: 180, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  const { isLight } = useTheme();

  const cA = isLight ? LIGHT_EQUIV[feature.colorA] || feature.colorA : feature.colorA;
  const cB = isLight ? LIGHT_EQUIV[feature.colorB] || feature.colorB : feature.colorB;

  const cardBg          = isLight ? "rgba(255,248,228,0.45)" : "rgba(11,15,42,0.52)";
  const cardBlur        = "blur(22px)";
  const cardBorder      = isLight ? "1px solid rgba(200,165,80,0.28)"  : "1px solid rgba(79,209,255,0.13)";
  const cardBorderLeave = isLight ? "rgba(200,165,80,0.28)"             : "rgba(79,209,255,0.13)";
  const cardBorderHover = isLight ? `${cA}66`                           : `${feature.colorA}66`;
  const cardShadowHover = isLight ? "none" : "none";

  const titleColor = isLight ? "#FFFFFF"              : "#EAF2FF";
  const descColor  = isLight ? "rgba(255,255,255,0.85)"  : "rgba(165,180,252,0.68)";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 55 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      onMouseMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width  - 0.5);
        y.set((e.clientY - r.top)  / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: rotX, rotateY: rotY, perspective: "900px", transformStyle: "preserve-3d" }}
    >
      <div
        style={{
          background: cardBg, backdropFilter: cardBlur, WebkitBackdropFilter: cardBlur,
          border: cardBorder, borderRadius: "20px", padding: "36px 28px",
          height: "100%", cursor: "default",
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "55%",
          background: `radial-gradient(ellipse at top left, ${cA}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
          background: `linear-gradient(to right, transparent, ${cA}50, ${cB}50, transparent)` }} />

        <div style={{
          width: "88px", height: "88px", borderRadius: "50%",
          background: "transparent",
          border: "none",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: "none",
          transition: "all 0.25s ease",
          overflow: "hidden",
        }}>
          <img src={`/${feature.img}`} alt={feature.title} loading="lazy" style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%", display: "block" }} />
        </div>

        <h3 style={{ color: titleColor, fontSize: "1.12rem", fontWeight: 700, marginBottom: "12px", lineHeight: 1.3, transition: "color 0.4s ease", textAlign: "center" }}>
          {feature.title}
        </h3>
        <p style={{ color: descColor, fontSize: "0.91rem", lineHeight: 1.68, transition: "color 0.4s ease" }}>
          {feature.description}
        </p>

        <div style={{ position: "absolute", bottom: 0, left: "20%", right: "20%", height: "1px",
          background: `linear-gradient(to right, transparent, ${cA}50, transparent)` }} />
      </div>
    </motion.div>
  );
}

export default function FeatureCards() {
  const { isLight } = useTheme();

  const eyebrowColor  = isLight ? "#D4A574" : "#4FD1FF";
  const eyebrowShadow = isLight ? "none"    : "0 0 20px rgba(79,209,255,0.6)";
  const titleColor    = isLight ? "#000000" : "#EAF2FF";

  return (
    <section style={{ padding: "90px 24px", position: "relative", zIndex: 2 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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
          }}>Everything You Need</p>
          <h2 style={{ color: titleColor, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1.2, transition: "color 0.4s ease" }}>
            Built for{" "}
            {isLight ? (
              <span style={{ color: "#D4A574" }}>serious traders</span>
            ) : (
              <span style={{
                background: "linear-gradient(135deg, #4FD1FF, #3B82F6, #8B5CF6)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 20px rgba(79,209,255,0.35))",
              }}>serious traders</span>
            )}
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {features.map((f, i) => <TiltCard key={f.title} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}
