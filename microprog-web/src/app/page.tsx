'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const FEATURES = [
  { icon: '🧠', title: 'AI Decomposition', desc: 'Every problem broken into 7–10 bite-sized steps' },
  { icon: '❤️', title: '5 Hearts System', desc: 'Lose a heart on wrong answers — stay sharp' },
  { icon: '⚡', title: 'XP & Levels', desc: 'Earn XP, level up, unlock new problem tiers' },
  { icon: '🔥', title: 'Daily Streaks', desc: 'Keep your streak alive — consistency beats intensity' },
  { icon: '🤖', title: '3 AI Agents', desc: 'See how weak, normal, and strong AIs compare to you' },
  { icon: '📊', title: 'Real Data', desc: '500 LeetCode problems, all graded with ground truth' },
]

const TICKER = [
  'TWO SUM', 'BINARY SEARCH', 'LINKED LIST', 'STACK & QUEUE',
  'HASH TABLE', 'RECURSION', 'DYNAMIC PROGRAMMING', 'GRAPHS', 'TREES',
]

export default function LandingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push('/dashboard')
      else setLoading(false)
    })
  }, [router])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="fixed inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #00e5a0, transparent 70%)' }} />
      <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-8"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent 70%)' }} />

      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight glow-green">MICRO</span>
          <span className="text-2xl font-black tracking-tight text-white">TUTOR</span>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/auth')}
            className="px-5 py-2 text-sm font-semibold text-[var(--text-muted)] hover:text-white transition-colors">
            Sign In
          </button>
          <button onClick={() => router.push('/auth')}
            className="px-5 py-2 text-sm font-semibold bg-[var(--green)] text-black rounded-lg hover:opacity-90 transition-opacity btn-glow">
            Start Learning →
          </button>
        </div>
      </nav>

      <div className="relative z-10 border-b border-[var(--border)] bg-[var(--bg-card)] py-2 overflow-hidden">
        <div className="flex gap-8 text-xs font-mono text-[var(--text-muted)] whitespace-nowrap animate-marquee">
          {[...TICKER, ...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-[var(--green)]">▶</span> {t}
            </span>
          ))}
        </div>
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--green)]/30 bg-[var(--green-dim)] text-[var(--green)] text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] animate-pulse" />
          CMPSC 496 Research · Penn State · Spring 2026
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
          <span className="glow-green">STOP</span>{' '}
          <span className="text-white">COPYING</span>
          <br />
          <span className="text-white">START</span>{' '}
          <span className="glow-green">LEARNING</span>
        </h1>
        <p className="text-lg text-[var(--text-muted)] max-w-xl mb-10 leading-relaxed">
          AI that teaches you <em>how</em> to code — not just what the answer is.
          Every problem, one micro-step at a time.
        </p>
        <div className="flex gap-4">
          <button onClick={() => router.push('/auth')}
            className="px-8 py-3.5 bg-[var(--green)] text-black font-bold rounded-xl hover:opacity-90 transition-all btn-glow text-base">
            Play Now — It's Free
          </button>
          <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3.5 border border-[var(--border)] text-white font-semibold rounded-xl hover:bg-[var(--bg-hover)] transition-colors text-base">
            How It Works
          </button>
        </div>
        <div className="flex gap-12 mt-16 text-center">
          {[{ val: '500+', label: 'Problems' }, { val: '3', label: 'AI Agents' }, { val: '10', label: 'Steps Each' }, { val: '∞', label: 'Practice' }].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black glow-green">{s.val}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1 font-mono uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-3xl font-black text-center mb-12">
          Built Different. <span className="glow-green">Actually Works.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] card-lift pixel-border">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-bold text-white mb-1">{f.title}</div>
              <div className="text-sm text-[var(--text-muted)]">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-20 text-center">
        <div className="max-w-2xl mx-auto p-10 rounded-2xl border border-[var(--green)]/20 bg-[var(--green-dim)]">
          <h2 className="text-4xl font-black mb-3">Ready to actually learn?</h2>
          <p className="text-[var(--text-muted)] mb-6">No setup. No credit card. Just code.</p>
          <button onClick={() => router.push('/auth')}
            className="px-10 py-4 bg-[var(--green)] text-black font-black rounded-xl text-lg hover:opacity-90 transition-opacity btn-glow">
            Start Your Streak →
          </button>
        </div>
      </section>

      <style jsx>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </main>
  )
}