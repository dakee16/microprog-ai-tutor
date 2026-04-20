'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
    const router = useRouter()
    const [mode, setMode] = useState<'login' | 'signup'>('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setMessage('')
        setLoading(true)
        try {
            if (mode === 'signup') {
                const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
                if (signUpError) throw signUpError
                if (data.user) {
                    const { error: profileError } = await supabase
                        .from('user_profiles')
                        .insert({ id: data.user.id, username: username || email.split('@')[0] })
                    if (profileError && !profileError.message.includes('duplicate')) throw profileError
                }
                setMessage('Account created! Redirecting...')
                setTimeout(() => router.push('/dashboard'), 1500)
            } else {
                const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
                if (loginError) throw loginError
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="fixed inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(var(--green) 1px, transparent 1px), linear-gradient(90deg, var(--green) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 rounded-full"
                style={{ background: 'radial-gradient(ellipse, #00e5a0, transparent 70%)' }} />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <button onClick={() => router.push('/')} className="inline-flex items-center gap-1 mb-4">
                        <span className="text-3xl font-black glow-green">MICRO</span>
                        <span className="text-3xl font-black text-white">TUTOR</span>
                    </button>
                    <p className="text-[var(--text-muted)] text-sm">
                        {mode === 'login' ? 'Welcome back. Keep your streak alive.' : 'Create your account. Start learning.'}
                    </p>
                </div>

                <div className="p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] pixel-border">
                    <div className="flex mb-6 p-1 bg-[var(--bg)] rounded-xl">
                        {(['login', 'signup'] as const).map(m => (
                            <button key={m} onClick={() => setMode(m)}
                                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${mode === m ? 'bg-[var(--green)] text-black' : 'text-[var(--text-muted)] hover:text-white'
                                    }`}>
                                {m === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 uppercase tracking-widest">Username</label>
                                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                                    placeholder="coolcoder42"
                                    className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 uppercase tracking-widest">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                placeholder="you@psu.edu"
                                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-[var(--text-muted)] mb-1.5 uppercase tracking-widest">Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)] transition-colors" />
                        </div>
                        {error && <div className="px-4 py-3 rounded-xl bg-[var(--red-dim)] border border-[var(--red)]/30 text-[var(--red)] text-sm">{error}</div>}
                        {message && <div className="px-4 py-3 rounded-xl bg-[var(--green-dim)] border border-[var(--green)]/30 text-[var(--green)] text-sm">{message}</div>}
                        <button type="submit" disabled={loading}
                            className="w-full py-3.5 bg-[var(--green)] text-black font-black rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 btn-glow mt-2">
                            {loading ? '...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}