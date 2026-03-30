"use client"

import { useEffect, useState } from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Calendar, Users, Video, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import { Playfair_Display } from "next/font/google"
import Image from "next/image"

const playfair = Playfair_Display({ subsets: ["latin"] })

import { premiumFadeUp, premiumStagger } from "@/lib/animations"
import { PremiumCard } from "@/components/ui/premium-card"

function formatDateTime(iso?: string) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function formatDate(iso?: string) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

type Webinar = {
  id: string
  title: string
  description?: string
  starts_at?: string
  duration_minutes?: number
  platform?: string
  price?: string
  seats?: number
}

export default function WebinarsPage() {
  const [upcomingWebinars, setUpcoming] = useState<Webinar[]>([])
  const [pastWebinars, setPast] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch('/api/webinars')
        const json = await res.json()
        if (res.ok) {
          const data = (json.data as Webinar[]) ?? []
          const now = new Date()
          const upcoming = data.filter((w) => w.starts_at && new Date(w.starts_at) >= now)
          const past = data.filter((w) => !w.starts_at || new Date(w.starts_at) < now)
          if (mounted) {
            setUpcoming(upcoming)
            setPast(past)
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch /api/webinars', json)
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching /api/webinars', err)
      }
      if (mounted) setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // fallback demo data when DB empty
  const defaultUpcoming: Webinar[] = [
    { id: '1', title: 'Stock Market Basics for Beginners', starts_at: '2026-04-15T19:00:00+05:30', duration_minutes: 90, platform: 'Zoom', price: 'Free', seats: 500 },
    { id: '2', title: 'Candlestick Patterns That Actually Work', starts_at: '2026-04-22T19:00:00+05:30', duration_minutes: 120, platform: 'Google Meet', price: '₹299', seats: 300 },
    { id: '3', title: 'Risk Management Strategies', starts_at: '2026-05-05T18:30:00+05:30', duration_minutes: 100, platform: 'Zoom', price: '₹499', seats: 400 },
    { id: '4', title: 'Live Trading Session: Real Market Analysis', starts_at: '2026-05-12T09:00:00+05:30', duration_minutes: 150, platform: 'Zoom', price: '₹799', seats: 200 },
  ]

  const defaultPast: Webinar[] = [
    { id: 'p1', title: 'Introduction to Options Trading', starts_at: '2026-01-08T19:00:00+05:30' },
    { id: 'p2', title: 'Market Psychology 101', starts_at: '2025-12-28T19:00:00+05:30' },
    { id: 'p3', title: 'Technical Analysis Deep Dive', starts_at: '2025-12-15T19:00:00+05:30' },
  ]

  const effectiveUpcoming = upcomingWebinars.length ? upcomingWebinars : defaultUpcoming
  const effectivePast = pastWebinars.length ? pastWebinars : defaultPast

  return (
    <main
      style={{
        '--fin-bg-primary': '#F7F2E8',
        '--fin-bg-secondary': '#EBE5D8',
        '--fin-bg-accent': '#DFD8CC',
        '--fin-gradient-hero': 'linear-gradient(90deg, #FBF8F2 0%, #F7F2E8 50%, #F5F0E6 100%)',
        '--fin-text-primary': '#3E3730',
        '--fin-text-secondary': '#645E56',
        '--fin-text-light': '#8A847C',
        '--fin-accent-gold': '#D1AF62',
        '--fin-accent-soft-gold': '#A38970',
        '--fin-border-light': '#A38970',
        '--fin-border-divider': '#D6CCBE'
      } as React.CSSProperties}
      className="bg-white min-h-screen text-[var(--fin-text-primary)] transition-colors duration-500 font-sans"
    >
      <Navigation />

      {/* HERO — EXPERIENCE FIRST (video background with translucent overlay) */}
      <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden border-b border-[var(--fin-border-divider)] perspective-1000">
        <video
          src="/finance.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* dark translucent overlay so text remains readable */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

        <motion.div
          variants={premiumStagger}
          initial="hidden"
          animate="visible"
          className="relative max-w-5xl mx-auto px-6 text-center z-10"
        >
          {/* Translucent premium glass panel to improve text legibility */}
          <motion.div
            variants={premiumFadeUp}
            className="mx-auto w-full max-w-3xl rounded-2xl p-10 md:p-14 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-md"
            style={{ backgroundColor: 'rgba(247,242,232,0.85)', border: '1px solid rgba(214,204,190,0.4)' }}
          >
            <p className="uppercase tracking-[0.2em] text-[var(--fin-text-secondary)] mb-6 font-semibold text-sm">
              Learn Live • Ask Questions • Grow Faster
            </p>

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[var(--fin-text-primary)] ${playfair.className} tracking-tight leading-tight`}>
              Live Trading Webinars
            </h1>

            <p className="text-xl max-w-2xl mx-auto text-[var(--fin-text-secondary)] leading-relaxed">
              Interactive sessions designed to give beginners real clarity — not recorded noise.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* UPCOMING WEBINARS GRID (Matching Courses Layout) */}
      <section className="py-24 bg-white relative">
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-4xl md:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Upcoming Sessions
            </motion.h2>
            <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
              Showing {effectiveUpcoming.length} upcoming interactive webinar(s). Secure your seat now.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {loading && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)] font-medium">Loading premium webinars...</div>}
            {!loading && effectiveUpcoming.length === 0 && <div className="col-span-full text-center py-20 text-[var(--fin-text-secondary)]">No upcoming sessions available.</div>}

            {effectiveUpcoming.map((w) => (
              <PremiumCard
                key={w.id}
                id={w.id}
                title={w.title}
                description={w.description || 'Join this live session to build your trading foundation with expert guidance and real-time Q&A.'}
                badgeLabel="Live Session"
                metaItems={[
                  { icon: <Calendar size={16} />, label: w.starts_at ? formatDateTime(w.starts_at) : '-' },
                  { icon: <Video size={16} />, label: w.platform || 'Online Platform' },
                  { icon: <Users size={16} />, label: `${w.seats || 0} seats available` }
                ]}
                price={w.price || 'Free'}
                priceLabel="Reserve"
                actionUrl={`/webinars/book/${w.id}`}
                actionLabel="Book Seat"
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* PAYMENT — SOFT TRUST */}
      <section className="py-20 bg-[var(--fin-bg-primary)]/30 border-t border-[var(--fin-border-divider)]">
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.h2 variants={premiumFadeUp} className={`text-3xl font-bold mb-10 text-[var(--fin-text-primary)] ${playfair.className}`}>
            Simple & Secure Payments
          </motion.h2>

          <motion.div variants={premiumStagger} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
              <Image src="/upi.svg" alt="UPI" width={72} height={72} />
            </motion.div>

            <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
              <Image src="/razorpay.svg" alt="Razorpay" width={96} height={48} />
            </motion.div>

            <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300">
              <Image src="/paytm.svg" alt="Paytm" width={96} height={48} />
            </motion.div>

            <motion.div variants={premiumFadeUp} className="rounded-2xl bg-white border border-[var(--fin-border-divider)] py-6 flex flex-col gap-2 items-center justify-center shadow-sm hover:shadow-md hover:border-[var(--fin-accent-gold)] transition-all duration-300 text-[var(--fin-text-primary)]">
              <CreditCard size={40} className="text-[var(--fin-accent-gold)]" />
              <span className="text-xs font-semibold tracking-wider uppercase">Cards</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* PAST SESSIONS GRID (Matching specific structure but with past label) */}
      <section className="py-24 bg-[var(--fin-bg-primary)]/40 relative border-t border-[var(--fin-border-divider)]">
        <motion.div
          variants={premiumStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-6"
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={premiumFadeUp}
              className={`text-4xl md:text-5xl font-bold mb-4 text-[var(--fin-text-primary)] ${playfair.className}`}
            >
              Past Sessions (Recorded)
            </motion.h2>
            <motion.p variants={premiumFadeUp} className="text-lg text-[var(--fin-text-secondary)] max-w-2xl mx-auto">
              Catch up on what you missed.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {effectivePast.map((w) => (
              <PremiumCard
                key={w.id}
                id={w.id}
                title={w.title}
                description={
                  <span className="font-medium text-sm">
                    Recorded on: {w.starts_at ? formatDate(w.starts_at) : 'Unknown'}
                  </span>
                }
                accentColor="silver"
                topIcon={<Video size={24} />}
                actionLabel="Watch Recording"
                actionUrl="#"
                fullWidthButton={true}
              />
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
