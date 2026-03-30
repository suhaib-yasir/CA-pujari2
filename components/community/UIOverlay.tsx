"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useTheme } from "@/hooks/useTheme";

export default function UIOverlay() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { isLight } = useTheme();

  // ── Warm beige/gold palette for light, neon blue for dark ────────────
  const badgeBg     = isLight ? "rgba(0,0,0,0.14)"            : "rgba(79,209,255,0.08)";
  const badgeBorder = isLight ? "1px solid rgba(0,0,0,0.40)"  : "1px solid rgba(79,209,255,0.4)";
  const badgeShadow = isLight ? "none" : "none";
  const dotBg       = isLight ? "#D4A574"                           : "#4FD1FF";
  const dotShadow   = isLight
    ? "none"
    : "none";
  const badgeColor      = isLight ? "#D4A574"               : "#EAF2FF";
  const titleColor      = isLight ? "#000000"               : "#EAF2FF";
  const subtitleColor   = isLight ? "rgba(0,0,0,0.68)"   : "rgba(165,180,252,0.85)";
  const btnBg           = isLight
    ? "linear-gradient(135deg, #D4A574 0%, #C99564 60%, #B8855A 100%)"
    : "linear-gradient(135deg, #4FD1FF 0%, #3B82F6 50%, #8B5CF6 100%)";
  const btnColor        = "#FFFFFF"; // white text on both gold and neon
  const btnShadow       = isLight
    ? "none"
    : "none";
  const btnShadowHover  = isLight
    ? "none"
    : "none";
  const scrollColor     = isLight ? "rgba(0,0,0,0.42)"                              : "rgba(165,180,252,0.55)";
  const scrollLine      = isLight
    ? "linear-gradient(to bottom, rgba(0,0,0,0.80), transparent)"
    : "linear-gradient(to bottom, rgba(79,209,255,0.9), transparent)";

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1.3, ease: "power3.out", delay: 0.4 }
      );
    }
  }, []);

  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
    }}>
      <div style={{ position: "relative", textAlign: "center", padding: "0 1.5rem", maxWidth: "920px" }}>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "6px 18px", borderRadius: "100px",
            border: badgeBorder, background: badgeBg,
            backdropFilter: "blur(12px)",
            marginBottom: "28px", pointerEvents: "auto",
            boxShadow: badgeShadow,
            transition: "all 0.6s ease",
          }}
        >
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: dotBg, boxShadow: dotShadow,
            display: "inline-block",
            animation: "pulse-dot 2s ease-in-out infinite",
            transition: "all 0.6s ease",
          }} />
          <span style={{ color: badgeColor, fontSize: "13px", letterSpacing: "0.07em", fontWeight: 500, transition: "color 0.4s ease" }}>
            LIVE COMMUNITY
          </span>
        </motion.div>

        {/* Title */}
        <h1 ref={titleRef} style={{
          opacity: 0,
          fontSize: "clamp(2.8rem, 8vw, 6.2rem)",
          fontWeight: 800, lineHeight: 1.04,
          letterSpacing: "-0.025em", color: titleColor, marginBottom: "22px",
          transition: "color 0.4s ease",
        }}>
          <span style={{ display: "block", color: isLight ? "#FFFFFF" : titleColor }}>Trading</span>
          {isLight ? (
            <span style={{ display: "block", color: "#000000" }}>Community</span>
          ) : (
            <span style={{
              display: "block",
              background: "linear-gradient(135deg, #4FD1FF 0%, #3B82F6 50%, #8B5CF6 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Community</span>
          )}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75, ease: "easeOut" }}
          style={{ color: "#FFFFFF", fontSize: "clamp(1rem, 2.5vw, 1.25rem)", fontWeight: isLight ? 500 : 400, marginBottom: "44px", lineHeight: 1.65, transition: "color 0.4s ease" }}
        >
          Learn, share, and grow with traders worldwide
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: "easeOut" }}
          style={{ pointerEvents: "auto" }}
        >
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: "15px 44px", borderRadius: "100px",
              fontSize: "1rem", fontWeight: 600, letterSpacing: "0.04em",
              border: "none", cursor: "pointer",
              background: btnBg, color: btnColor,
              boxShadow: btnShadow,
              transition: "box-shadow 0.3s ease, background 0.6s ease",
            }}
            onMouseEnter={(e) => { (e.target as HTMLElement).style.boxShadow = btnShadowHover; }}
            onMouseLeave={(e) => { (e.target as HTMLElement).style.boxShadow = btnShadow; }}
          >
            Join Community
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: "absolute", bottom: "38px", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        }}
      >
        <span style={{ color: scrollColor, fontSize: "11px", letterSpacing: "0.12em", fontWeight: 500, transition: "color 0.4s ease" }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "1px", height: "42px", background: scrollLine, transition: "background 0.6s ease" }}
        />
      </motion.div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.8; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
