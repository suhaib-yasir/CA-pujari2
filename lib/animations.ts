export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
}

export const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// --- Premium Animation System ---
export const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const premiumStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // intentional, luxury pacing
      delayChildren: 0.1,
    }
  }
}

export const premiumFadeUp = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: premiumEasing }
  }
}

export const microPop = {
  hidden: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: premiumEasing } 
  }
}
