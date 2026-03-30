"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { isLight, toggleTheme } = useTheme();
  const navLinks = ["Community"];

  // ── Warm beige/gold palette for light, neon blue for dark ────────────
  const navBg = isLight
    ? (scrolled ? "rgba(248,240,218,0.94)" : "transparent")
    : (scrolled ? "rgba(5,8,22,0.88)"      : "transparent");
  const navBorder = isLight
    ? (scrolled ? "1px solid rgba(0,0,0,0.12)"    : "1px solid transparent")
    : (scrolled ? "1px solid rgba(79,209,255,0.10)"   : "1px solid transparent");
  const navShadow = isLight
    ? (scrolled ? "0 2px 20px rgba(80,50,10,0.09)"   : "none")
    : (scrolled ? "0 4px 30px rgba(5,8,22,0.6)"      : "none");

  const logoBg     = isLight ? "linear-gradient(135deg, #000000, #000000)" : "linear-gradient(135deg, #4FD1FF, #3B82F6)";
  const logoShadow = isLight ? "0 2px 14px rgba(0,0,0,0.40)"           : "0 0 18px rgba(79,209,255,0.45)";
  const logoColor  = isLight ? "#000000"                                     : "#EAF2FF";

  const linkColor      = isLight ? "rgba(0,0,0,0.65)"    : "rgba(165,180,252,0.75)";
  const linkHoverColor = isLight ? "#000000"                 : "#EAF2FF";
  const linkHoverBg    = isLight ? "rgba(0,0,0,0.07)"   : "rgba(79,209,255,0.07)";

  const btnOutlineBorder      = isLight ? "1px solid rgba(0,0,0,0.22)"    : "1px solid rgba(79,209,255,0.3)";
  const btnOutlineColor       = isLight ? "#D4A574"                           : "#4FD1FF";
  const btnOutlineHoverBg     = isLight ? "rgba(0,0,0,0.09)"             : "rgba(79,209,255,0.1)";
  const btnOutlineHoverBorder = isLight ? "rgba(0,0,0,0.50)"             : "rgba(79,209,255,0.65)";
  const btnOutlineHoverShadow = isLight ? "0 2px 12px rgba(0,0,0,0.18)" : "0 0 20px rgba(79,209,255,0.18)";

  const btnPrimaryBg          = isLight ? "linear-gradient(135deg, #000000, #000000)"  : "linear-gradient(135deg, #4FD1FF, #3B82F6)";
  const btnPrimaryColor       = isLight ? "#FFFFFF"                                     : "#050816";
  const btnPrimaryShadow      = isLight ? "0 4px 20px rgba(0,0,0,0.38)"           : "0 0 22px rgba(79,209,255,0.4)";
  const btnPrimaryHoverShadow = isLight ? "0 8px 35px rgba(0,0,0,0.58)"           : "0 0 40px rgba(79,209,255,0.65)";

  const mobileMenuBg     = isLight ? "rgba(248,240,218,0.97)"       : "rgba(5,8,22,0.97)";
  const mobileMenuBorder = isLight ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(79,209,255,0.12)";
  const hamburgerBorder  = isLight ? "1px solid rgba(0,0,0,0.20)" : "1px solid rgba(79,209,255,0.28)";
  const hamburgerColor   = isLight ? "#000000"                         : "#EAF2FF";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: "0 24px",
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        background: navBg,
        backdropFilter: scrolled ? "blur(22px)" : "none",
        borderBottom: navBorder,
        boxShadow: navShadow,
      }}
    >
      {/* Desktop nav links */}
      <div className="hidden md:flex" style={{ alignItems: "center", gap: "4px", marginRight: "auto" }}>
        {navLinks.map((link) => (
          <button
            key={link}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: linkColor, fontSize: "0.9rem", fontWeight: 500,
              padding: "8px 14px", borderRadius: "8px",
              transition: "color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = linkHoverColor;
              el.style.background = linkHoverBg;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.color = linkColor;
              el.style.background = "none";
            }}
          >
            {link}
          </button>
        ))}
      </div>

      {/* CTA + theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "1.15rem", padding: "8px", borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: linkHoverColor,
            transition: "all 0.3s ease",
          }}
        >
          {isLight ? "☀️" : "🌙"}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            style={{
              position: "absolute", top: "70px", left: 0, right: 0,
              background: mobileMenuBg, backdropFilter: "blur(22px)",
              borderBottom: mobileMenuBorder,
              padding: "16px 24px 24px",
              display: "flex", flexDirection: "column", gap: "4px",
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => setMenuOpen(false)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: linkColor, fontSize: "1rem", fontWeight: 500,
                  padding: "12px 16px", borderRadius: "10px", textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = linkHoverBg;
                  el.style.color = linkHoverColor;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.background = "none";
                  el.style.color = linkColor;
                }}
              >
                {link}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
