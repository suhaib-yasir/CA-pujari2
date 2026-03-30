"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/hooks/useTheme";

gsap.registerPlugin(ScrollTrigger);

// ─── VERTEX SHADER ─────────────────────────────────────────────────────────
const VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uMouse;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 1.8 + uTime * 0.38) * 0.009
               + cos(pos.y * 1.8 + uTime * 0.33) * 0.009;
    pos.z += wave;
    pos.x += uMouse.x * 0.065;
    pos.y += uMouse.y * 0.065;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ─── FRAGMENT SHADER ───────────────────────────────────────────────────────
const FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTextureDark;
  uniform sampler2D uTextureLight;
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uLoaded;

  // Per-stage uniforms (0..1)
  uniform float uStage1;
  uniform float uStage2;
  uniform float uStage3;
  uniform float uStage4;
  uniform float uStage5;

  uniform float uGlow;
  uniform float uBrightness;
  uniform float uContrast;
  uniform float uHueShift;
  uniform float uDesaturate;

  // Light mode: 0 = dark, 1 = light
  uniform float uLightMode;

  void main() {
    vec2 uv = vUv;

    // UV micro-wave
    uv.x += sin(uv.y * 6.0 + uTime * 0.48) * 0.0020;
    uv.y += cos(uv.x * 6.0 + uTime * 0.43) * 0.0020;

    // Mouse parallax on UV
    uv.x -= uMouse.x * 0.012;
    uv.y -= uMouse.y * 0.012;

    vec4 texD = texture2D(uTextureDark, clamp(uv, 0.001, 0.999));
    vec4 texL = texture2D(uTextureLight, clamp(uv, 0.001, 0.999));
    
    // Fallback if the light texture didn't load properly
    if (texL.a < 0.1) texL = texD;

    vec4 tex = mix(texD, texL, uLightMode);
    vec3 color = tex.rgb;

    // ── Brightness / Contrast ────────────────────────────────────────────
    color = (color - 0.5) * uContrast + 0.5;
    color *= uBrightness;

    // ── Hue shift ────────────────────────────────────────────────────────
    float angle = uHueShift * 6.2832;
    float s = sin(angle), c2 = cos(angle);
    color = mat3(
      vec3(0.213+c2*0.787-s*0.213, 0.715-c2*0.715-s*0.715, 0.072-c2*0.072+s*0.928),
      vec3(0.213-c2*0.213+s*0.143, 0.715+c2*0.285+s*0.140, 0.072-c2*0.072-s*0.283),
      vec3(0.213-c2*0.213-s*0.787, 0.715-c2*0.715+s*0.715, 0.072+c2*0.928+s*0.072)
    ) * color;

    // ── Desaturation (stage 4 / 5) ───────────────────────────────────────
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(color, vec3(lum), uDesaturate);

    // ── Colour palette constants ─────────────────────────────────────────
    vec3 neonBlue   = vec3(0.310, 0.820, 1.000);  // #4FD1FF
    vec3 purple     = vec3(0.545, 0.361, 0.965);  // #8B5CF6
    vec3 deepBlue   = vec3(0.059, 0.047, 0.165);  // #0F0C2A
    vec3 warmLight  = vec3(1.0, 0.97, 0.90);      // warm white

    // ── DARK MODE scroll stages ───────────────────────────────────────────
    // Stage 1 – hero: dark blue base tint
    color = mix(color, mix(color, deepBlue, 0.28 * (1.0 - uLightMode)), uStage1 * 0.8);

    // Stage 2 – stats: neon blue glow surge
    color += neonBlue * uStage2 * 0.13 * (1.0 - uLightMode);

    // Stage 3 – features: blue+purple blend
    vec3 bpBlend = mix(neonBlue, purple, sin(uTime * 0.15) * 0.5 + 0.5);
    color += bpBlend * uStage3 * 0.10 * (1.0 - uLightMode);

    // Stage 4 – posts: contrast focus, cooler
    color = mix(color, mix(color, vec3(lum * 0.6), 0.35 * (1.0 - uLightMode)), uStage4);

    // Stage 5 – footer: dim and calm
    color = mix(color, color * mix(0.45, 0.78, uLightMode), uStage5 * 0.85);

    // ── Light mode: warm brightness lift ─────────────────────────────────
    // The designated light mode image is already warm, add only a minimal lift
    color = mix(color, color + warmLight * 0.05, uLightMode);

    // ── Screen glow (chart screen = upper-centre area of photo) ──────────
    float screenGlow = smoothstep(0.55, 0.0, length(uv - vec2(0.5, 0.28)));
    color += neonBlue  * screenGlow * uGlow * 0.18 * (1.0 - uLightMode * 0.7);
    color += purple    * screenGlow * uGlow * 0.09 * (1.0 - uLightMode * 0.7);

    // ── Vignette ────────────────────────────────────────────────────────
    float dist = length(uv - vec2(0.5, 0.5));
    float vigDark  = smoothstep(0.90, 0.12, dist);
    float vigLight = smoothstep(0.90, 0.30, dist);  // softer vignette in light
    float vig = mix(vigDark, vigLight, uLightMode);
    // dark mode: strong crush; light mode: gentle fade only
    color = mix(
      mix(color * 0.22, color, vigDark),
      mix(color * 0.82, color, vigLight),
      uLightMode
    );

    // ── Animated neon trickle ────────────────────────────────────────────
    float grad = sin(uv.x * 3.14159 + uTime * 0.14) * 0.5 + 0.5;
    color += neonBlue * grad * 0.022 * uGlow * (1.0 - uLightMode * 0.8);

    // ── Edge fades ───────────────────────────────────────────────────────
    float fadeY = smoothstep(0.0, 0.045, uv.y) * smoothstep(1.0, 0.93, uv.y);
    float fadeX = smoothstep(0.0, 0.06,  uv.x) * smoothstep(1.0, 0.94, uv.x);
    color *= fadeY * fadeX;

    gl_FragColor = vec4(color, tex.a * fadeY * fadeX * uLoaded);
  }
`;

// ─── Helpers ───────────────────────────────────────────────────────────────
function isWebGLAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl"));
  } catch { return false; }
}

function CSSFallbackBg({ isLight }: { isLight: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <img src={isLight ? "/light-hero-bg.png" : "/hero-bg.png"} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center top",
        transform: isLight ? "scale(1.08)" : "scale(1)",
        filter: isLight
          ? "brightness(1.15) saturate(0.85) blur(8px)"
          : "brightness(0.45) saturate(0.7) hue-rotate(210deg) blur(6px)",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: isLight
          ? "linear-gradient(160deg, rgba(255,248,235,0.55) 0%, rgba(200,169,106,0.08) 50%, rgba(180,150,100,0.10) 100%)"
          : "linear-gradient(160deg, rgba(5,8,22,0.7) 0%, rgba(79,209,255,0.06) 50%, rgba(139,92,246,0.09) 100%)",
        transition: "background 0.6s ease",
      }} />
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
          width: `${Math.random() * 3 + 1}px`, height: `${Math.random() * 3 + 1}px`,
          background: isLight
            ? (i % 2 === 0 ? "#C8A96A" : "#B49664")
            : (i % 2 === 0 ? "#4FD1FF" : "#8B5CF6"),
          opacity: Math.random() * 0.5 + 0.1,
          animation: `fp ${Math.random() * 12 + 8}s linear infinite`,
          animationDelay: `${Math.random() * 8}s`,
        }} />
      ))}
      <style>{`@keyframes fp{0%{transform:translateY(0);opacity:.3}50%{transform:translateY(-40px) translateX(10px);opacity:.7}100%{transform:translateY(-90px);opacity:0}}`}</style>
    </div>
  );
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const webglOk   = isWebGLAvailable();
  const { isLight } = useTheme();

  // Ref to hold shader uniforms so we can tween from outside the setup effect
  const uniformsRef = useRef<Record<string, { value: number | THREE.Vector2 | THREE.Texture | null }> | null>(null);

  // ── React to light/dark toggle: smoothly tween uLightMode uniform ──────
  useEffect(() => {
    if (!uniformsRef.current) return;
    const u = uniformsRef.current;
    // Tween uLightMode 0↔1 + adjust base brightness/contrast for light
    gsap.to(u.uLightMode, { value: isLight ? 1 : 0, duration: 0.6, ease: "power2.inOut" });
    // In light mode: use natural image brightness, gentle contrast
    if (isLight) {
      gsap.to(u.uBrightness, { value: 1.05, duration: 0.6, ease: "power2.inOut" });
      gsap.to(u.uContrast,   { value: 0.95, duration: 0.6, ease: "power2.inOut" });
    } else {
      gsap.to(u.uBrightness, { value: 0.80, duration: 0.6, ease: "power2.inOut" });
      gsap.to(u.uContrast,   { value: 1.00, duration: 0.6, ease: "power2.inOut" });
    }
  }, [isLight]);

  useEffect(() => {
    if (!webglOk) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ── Renderer ──────────────────────────────────────────────────────────
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 1);

    // ── Shader plane ──────────────────────────────────────────────────────
    const geo = new THREE.PlaneGeometry(2.2, 1.4, 36, 36);

    const uniforms: Record<string, { value: number | THREE.Vector2 | THREE.Texture | null }> = {
      uTextureDark:  { value: null },
      uTextureLight: { value: null },
      uTime:       { value: 0 },
      uMouse:      { value: new THREE.Vector2() },
      uLoaded:     { value: 0 },
      uStage1:     { value: 0 },
      uStage2:     { value: 0 },
      uStage3:     { value: 0 },
      uStage4:     { value: 0 },
      uStage5:     { value: 0 },
      uGlow:       { value: 0.4 },
      uBrightness: { value: isLight ? 1.05 : 0.80 },
      uContrast:   { value: isLight ? 0.95 : 1.00 },
      uHueShift:   { value: 0.00 },
      uDesaturate: { value: 0.00 },
      uLightMode:  { value: isLight ? 1 : 0 },
    };

    // Expose uniforms so the isLight effect can tween them
    uniformsRef.current = uniforms;

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // ── Texture ───────────────────────────────────────────────────────────
    let loadedCount = 0;
    const checkLoad = () => {
      loadedCount++;
      // Kickstart fade-in once at least one image loads
      if (loadedCount === 1) {
        gsap.to(uniforms.uLoaded, { value: 1, duration: 1.4, ease: "power2.inOut" });
      }
    };

    new THREE.TextureLoader().load("/hero-bg.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTextureDark.value = tex;
      checkLoad();
    });

    new THREE.TextureLoader().load("/light-hero-bg.png", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      uniforms.uTextureLight.value = tex;
      checkLoad();
    }, undefined, () => {
      // Fallback if light image is missing
      if (uniforms.uTextureDark.value) {
        uniforms.uTextureLight.value = uniforms.uTextureDark.value;
      }
      checkLoad();
    });

    // ── Particles ─────────────────────────────────────────────────────────
    const isMobile = window.innerWidth < 768;
    const pCount = isMobile ? 70 : 240;
    const pPos   = new Float32Array(pCount * 3);
    const pCol   = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]   = (Math.random() - 0.5) * 3.0;
      pPos[i*3+1] = (Math.random() - 0.5) * 2.0;
      pPos[i*3+2] = (Math.random() - 0.5) * 0.7;
      // Blue/purple particles same as dark mode; will be softened in light via overlay
      if (i % 2 === 0) { pCol[i*3]=0.31; pCol[i*3+1]=0.82; pCol[i*3+2]=1.00; }
      else             { pCol[i*3]=0.54; pCol[i*3+1]=0.36; pCol[i*3+2]=0.96; }
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("color",    new THREE.BufferAttribute(pCol, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.006, transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false, vertexColors: true,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Scroll state object (tweened by GSAP) ─────────────────────────────
    const S = {
      stage1: 0, stage2: 0, stage3: 0, stage4: 0, stage5: 0,
      camZ: 1.0, camRotY: 0, camRotX: 0, camRotZ: 0,
      glow: 0.4, brightness: isLight ? 1.05 : 0.80, contrast: isLight ? 0.95 : 1.00,
      hueShift: 0.00, desaturate: 0.00,
      pOpacity: 0.0, pSpeed: 1.0,
    };

    // ── 5-Stage scroll timeline ───────────────────────────────────────────
    // IDENTICAL to dark mode – same timing, same camera moves, same transitions
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 2.0,
      },
    });

    // Stage 1 → 2  (hero → stats, 0–20%)
    tl.to(S, {
      stage1: 1,
      camZ: 0.78, camRotY: 0.045,
      glow: 0.6, brightness: isLight ? 1.00 : 0.75, contrast: isLight ? 0.95 : 1.10, hueShift: 0.012,
      pOpacity: 0.55, pSpeed: 1.5,
      ease: "power2.out", duration: 0.20,
    }, 0)

    // Stage 2 peak (stats / start of features, 20–40%)
    .to(S, {
      stage2: 1,
      camZ: 0.60, camRotY: 0.085, camRotZ: 0.018,
      glow: 1.0, brightness: isLight ? 1.08 : 0.96, contrast: isLight ? 0.92 : 1.20, hueShift: 0.022,
      pOpacity: 0.90, pSpeed: 2.2,
      ease: "power2.inOut", duration: 0.20,
    }, 0.20)

    // Stage 3 (mid features → posts, 40–60%)
    .to(S, {
      stage3: 1,
      camZ: 0.68, camRotY: 0.025, camRotZ: 0.0,
      glow: 0.75, brightness: isLight ? 1.05 : 0.85, contrast: isLight ? 0.95 : 1.28, hueShift: 0.030,
      desaturate: 0.08,
      pOpacity: 0.70, pSpeed: 1.6,
      ease: "power2.inOut", duration: 0.20,
    }, 0.40)

    // Stage 4 (lower posts, 60–80%)
    .to(S, {
      stage4: 1,
      camZ: 0.82, camRotY: 0.010, camRotX: -0.015,
      glow: 0.45, brightness: isLight ? 0.90 : 0.68, contrast: isLight ? 1.00 : 1.35, hueShift: 0.010,
      desaturate: 0.25,
      pOpacity: 0.40, pSpeed: 1.0,
      ease: "power2.inOut", duration: 0.20,
    }, 0.60)

    // Stage 5 (footer, 80–100%)
    .to(S, {
      stage5: 1,
      camZ: 0.92, camRotY: 0.0, camRotX: 0.0,
      glow: 0.18, brightness: isLight ? 0.80 : 0.48, contrast: isLight ? 0.98 : 1.10, hueShift: 0.005,
      desaturate: 0.45,
      pOpacity: 0.15, pSpeed: 0.6,
      ease: "power2.in", duration: 0.20,
    }, 0.80);

    // ── Mouse ─────────────────────────────────────────────────────────────
    const onMouse = (e: MouseEvent) => {
      if (isMobile) return;
      targetRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      targetRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // ── Render loop ───────────────────────────────────────────────────────
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;

      // Smooth mouse lerp
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.042;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.042;
      (uniforms.uMouse.value as THREE.Vector2).set(mouseRef.current.x, mouseRef.current.y);

      // Push scroll state → shader uniforms
      uniforms.uStage1.value     = S.stage1;
      uniforms.uStage2.value     = S.stage2;
      uniforms.uStage3.value     = S.stage3;
      uniforms.uStage4.value     = S.stage4;
      uniforms.uStage5.value     = S.stage5;
      uniforms.uGlow.value       = S.glow;
      // Only push brightness/contrast from scroll S if uLightMode GSAP tween isn't active
      // We blend: scroll S values are used as a base, uLightMode adjusts them in the shader
      uniforms.uBrightness.value = S.brightness;
      uniforms.uContrast.value   = S.contrast;
      uniforms.uHueShift.value   = S.hueShift;
      uniforms.uDesaturate.value = S.desaturate;

      // Camera from scroll state + live mouse tilt
      camera.position.z = S.camZ;
      camera.rotation.y = S.camRotY + mouseRef.current.x * 0.030;
      camera.rotation.x = S.camRotX + mouseRef.current.y * 0.030;
      camera.rotation.z = S.camRotZ;

      // Particle opacity + drift speed
      pMat.opacity = Math.min(S.pOpacity, 1);
      const spd = 0.00021 * S.pSpeed;
      const pa  = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pCount; i++) {
        pa[i*3+1] += spd;
        if (pa[i*3+1] > 1.0) pa[i*3+1] = -1.0;
        pa[i*3]   += Math.sin(t * 0.38 + i * 0.7) * 0.00009;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Breathing scale + light mode zoom
      const baseScale = isLight ? 1.08 : 1;
      mesh.scale.setScalar(baseScale + Math.sin(t * 0.24) * 0.005);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      tl.kill();
      ScrollTrigger.getAll().forEach(s => s.kill());
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      uniformsRef.current = null;
    };
  }, [webglOk]);

  if (!webglOk) return <CSSFallbackBg isLight={isLight} />;

  return (
    <>
      {/* The WebGL canvas is ALWAYS visible in both modes */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />

      {/*
        Light mode warm overlay — sits ABOVE the canvas.
        Does NOT replace the background; just tints it warm.
        In dark mode this is fully transparent (opacity 0).
      */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(160deg, rgba(235,210,150,0.22) 0%, rgba(210,175,100,0.12) 50%, rgba(190,155,85,0.08) 100%)",
          opacity: isLight ? 1 : 0,
          transition: "opacity 0.6s ease",
        }}
      />

      {/* Dark overlay for text visibility */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: isLight
            ? "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.60) 100%)"
            : "radial-gradient(ellipse at center, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.55) 100%)",
          transition: "background 0.6s ease",
        }}
      />

      {/* Hero blur glow effect — visible on all pages */}
      <div
        style={{
          position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "280px",
          background: isLight
            ? "radial-gradient(ellipse, rgba(0,0,0,0.15) 0%, transparent 70%)"
            : "radial-gradient(ellipse, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(50px)", pointerEvents: "none",
          transition: "background 0.6s ease",
        }}
      />

      {/* Dark mode screen glow — fades out in light */}
      <div style={{
        position: "absolute",
        top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "50%", height: "40%",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(79,209,255,0.10) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)",
        filter: "blur(50px)",
        pointerEvents: "none",
        opacity: isLight ? 0 : 1,
        transition: "opacity 0.6s ease",
      }} />
    </>
  );
}
