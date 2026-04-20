'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, UserProfile, Problem } from '@/lib/supabase'
import XPBar from '@/components/game/XPBar'
import HeartsBar from '@/components/game/HeartsBar'
import { getDifficultyColor, getDifficultyBg } from '@/lib/xp'

export default function Dashboard() {
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [problems, setProblems] = useState<Problem[]>([])
    const [completed, setCompleted] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All')
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/auth'); return }

            const { data: prof } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()
            if (!prof) {
                await supabase.from('user_profiles').insert({ id: user.id, username: user.email?.split('@')[0] || 'coder' })
                const { data: newProf } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()
                setProfile(newProf)
            } else {
                setProfile(prof)
            }

            const { data: probs } = await supabase.from('problems').select('id,slug,title,difficulty,topic_tags,description').limit(200)
            setProblems(probs || [])

            const { data: progress } = await supabase.from('user_progress').select('problem_id').eq('user_id', user.id).eq('completed', true)
            setCompleted(new Set(progress?.map((p: any) => p.problem_id) || []))
            setLoading(false)
        }
        load()
    }, [router])

    const filtered = problems.filter(p => {
        const matchDiff = filter === 'All' || p.difficulty === filter
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase())
        return matchDiff && matchSearch
    })

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="min-h-screen">
            <nav className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md px-6 py-3">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <button onClick={() => router.push('/')} className="flex items-center gap-1">
                        <span className="text-xl font-black glow-green">MICRO</span>
                        <span className="text-xl font-black text-white">TUTOR</span>
                    </button>
                    <div className="flex-1 max-w-sm">
                        {profile && <XPBar xp={profile.xp} compact />}
                    </div>
                    <div className="flex items-center gap-4">
                        {profile && <HeartsBar hearts={profile.hearts} />}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border)]">
                            <span className="text-lg">🔥</span>
                            <span className="text-sm font-bold text-white">{profile?.streak ?? 0}</span>
                        </div>
                        <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }}
                            className="text-xs text-[var(--text-muted)] hover:text-white transition-colors">
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-white mb-1">
                        Hey, <span className="glow-green">{profile?.username}</span> 👋
                    </h1>
                    <p className="text-[var(--text-muted)]">{completed.size} / {problems.length} problems solved · Keep going!</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total XP', value: profile?.xp?.toLocaleString() ?? '0', icon: '⚡', color: 'var(--green)' },
                        { label: 'Level', value: profile?.level ?? 1, icon: '🏆', color: '#f59e0b' },
                        { label: 'Streak', value: `${profile?.streak ?? 0} days`, icon: '🔥', color: '#ef4444' },
                        { label: 'Solved', value: `${completed.size}`, icon: '✅', color: '#6366f1' },
                    ].map(s => (
                        <div key={s.label} className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] pixel-border">
                            <div className="text-2xl mb-2">{s.icon}</div>
                            <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                            <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                <div className="mb-8 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                    {profile && <XPBar xp={profile.xp} />}
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-6">
                    <input type="text" placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)] transition-colors text-sm" />
                    <div className="flex gap-2">
                        {(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f ? 'bg-[var(--green)] text-black' : 'border border-[var(--border)] text-[var(--text-muted)] hover:text-white bg-[var(--bg-card)]'
                                    }`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(p => (
                        <button key={p.id} onClick={() => router.push(`/problems/${p.slug}`)}
                            className="text-left p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--green)]/50 hover:bg-[var(--bg-hover)] transition-all card-lift pixel-border group">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${getDifficultyBg(p.difficulty)} ${getDifficultyColor(p.difficulty)}`}>
                                    {p.difficulty}
                                </span>
                                {completed.has(p.id) && <span className="text-base">✅</span>}
                            </div>
                            <h3 className="font-bold text-white group-hover:text-[var(--green)] transition-colors text-sm leading-snug mb-3">
                                {p.title}
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {p.topic_tags?.slice(0, 3).map((tag: string) => (
                                    <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}