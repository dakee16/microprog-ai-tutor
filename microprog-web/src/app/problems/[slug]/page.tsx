'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase, UserProfile } from '@/lib/supabase'
import HeartsBar from '@/components/game/HeartsBar'
import XPBar from '@/components/game/XPBar'
import LevelUpModal from '@/components/game/LevelUpModal'
import { getLevelFromXP, getDifficultyColor, getDifficultyBg, calculateXP } from '@/lib/xp'

type Step = { step_id: string; prompt: string; expected_type: string; rubric: string }
type EvalResult = { correct: boolean; short_reason: string; correct_answer: string }
type StepState = 'idle' | 'loading' | 'correct' | 'incorrect' | 'revealed'

export default function ProblemPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug as string

    const [user, setUser] = useState<any>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [problem, setProblem] = useState<any>(null)
    const [steps, setSteps] = useState<Step[]>([])
    const [currentStep, setCurrentStep] = useState(0)
    const [answer, setAnswer] = useState('')
    const [stepState, setStepState] = useState<StepState>('idle')
    const [evalResult, setEvalResult] = useState<EvalResult | null>(null)
    const [attempt, setAttempt] = useState(1)
    const [heartShake, setHeartShake] = useState(false)
    const [xpFloat, setXpFloat] = useState<string | null>(null)
    const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)
    const [context, setContext] = useState('')
    const [decomposing, setDecomposing] = useState(false)
    const [done, setDone] = useState(false)
    const [correctFirst, setCorrectFirst] = useState(0)
    const [correctSecond, setCorrectSecond] = useState(0)
    const [attempted, setAttempted] = useState(0)
    const answerRef = useRef<HTMLTextAreaElement>(null)
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    useEffect(() => {
        async function init() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { router.push('/auth'); return }
            setUser(user)
            const { data: prof } = await supabase.from('user_profiles').select('*').eq('id', user.id).single()
            setProfile(prof)
            const { data: prob } = await supabase.from('problems').select('*').eq('slug', slug).single()
            if (!prob) { router.push('/dashboard'); return }
            setProblem(prob)

            setDecomposing(true)
            try {
                const res = await fetch(`${API}/decompose`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug: prob.slug, description: prob.description }),
                })
                const data = await res.json()
                setSteps(data.steps || [])
            } catch {
                const { data: dbSteps } = await supabase
                    .from('steps').select('*').eq('problem_id', prob.id).order('step_number')
                setSteps(dbSteps?.map((s: any) => ({
                    step_id: `Step ${s.step_number}`,
                    prompt: s.prompt,
                    expected_type: s.expected_type,
                    rubric: s.rubric,
                })) || [])
            }
            setDecomposing(false)
        }
        init()
    }, [slug, router, API])

    async function submitAnswer() {
        if (!answer.trim() || stepState === 'loading') return
        setStepState('loading')
        try {
            const res = await fetch(`${API}/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: steps[currentStep], answer: answer.trim(), context }),
            })
            const result: EvalResult = await res.json()
            setEvalResult(result)

            if (result.correct) {
                setStepState('correct')
                setXpFloat(attempt === 1 ? '+20 XP ⚡' : '+10 XP ⚡')
                setTimeout(() => setXpFloat(null), 1400)
                if (attempt === 1) setCorrectFirst(p => p + 1)
                else setCorrectSecond(p => p + 1)
                setContext(prev => prev + `- ${steps[currentStep].step_id}: ${steps[currentStep].prompt} | Answer: ${answer}\n`)
                setTimeout(() => advanceStep(), 1200)
            } else {
                if (attempt === 1) {
                    setStepState('incorrect')
                    setAttempt(2)
                    loseHeart()
                } else {
                    setStepState('revealed')
                    setAttempted(p => p + 1)
                    setXpFloat('+2 XP')
                    setTimeout(() => setXpFloat(null), 1400)
                    loseHeart()
                }
            }
        } catch {
            setStepState('idle')
        }
    }

    function loseHeart() {
        if (!profile) return
        const newHearts = Math.max(0, profile.hearts - 1)
        setProfile(prev => prev ? { ...prev, hearts: newHearts } : prev)
        setHeartShake(true)
        setTimeout(() => setHeartShake(false), 600)
        supabase.from('user_profiles').update({ hearts: newHearts }).eq('id', user?.id)
    }

    function advanceStep() {
        if (currentStep + 1 >= steps.length) {
            finishProblem()
        } else {
            setCurrentStep(p => p + 1)
            setAnswer('')
            setAttempt(1)
            setStepState('idle')
            setEvalResult(null)
            setTimeout(() => answerRef.current?.focus(), 100)
        }
    }

    async function finishProblem() {
        setDone(true)
        if (!profile || !problem || !user) return
        const xpEarned = calculateXP(correctFirst, correctSecond, attempted, problem.difficulty, profile.streak)
        const newXP = profile.xp + xpEarned
        const oldLevel = getLevelFromXP(profile.xp)
        const newLevel = getLevelFromXP(newXP)
        await supabase.from('user_profiles').update({ xp: newXP, level: newLevel }).eq('id', user.id)
        await supabase.from('user_progress').upsert({
            user_id: user.id, problem_id: problem.id, completed: true,
            score: (correctFirst * 20 + correctSecond * 10) / (steps.length * 20),
            xp_earned: xpEarned, completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,problem_id' })
        setProfile(prev => prev ? { ...prev, xp: newXP, level: newLevel } : prev)
        if (newLevel > oldLevel) setTimeout(() => setLevelUpLevel(newLevel), 500)
    }

    const step = steps[currentStep]
    const progress = steps.length > 0 ? (currentStep / steps.length) * 100 : 0

    if (decomposing) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-muted)] font-mono text-sm animate-pulse">AI is breaking this down for you...</p>
        </div>
    )

    if (done) return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center max-w-lg">
                <div className="text-7xl mb-6">🎉</div>
                <h1 className="text-4xl font-black text-white mb-2">Problem Complete!</h1>
                <p className="text-[var(--text-muted)] mb-6">
                    {correctFirst} first-try · {correctSecond} second-try · {attempted} revealed
                </p>
                {profile && <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] mb-6"><XPBar xp={profile.xp} /></div>}
                <div className="flex gap-3 justify-center">
                    <button onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 bg-[var(--green)] text-black font-black rounded-xl hover:opacity-90 transition-opacity">
                        Back to Problems
                    </button>
                    <button onClick={() => { setDone(false); setCurrentStep(0); setAnswer(''); setContext(''); setAttempt(1); setStepState('idle'); setCorrectFirst(0); setCorrectSecond(0); setAttempted(0) }}
                        className="px-6 py-3 border border-[var(--border)] text-white font-semibold rounded-xl hover:bg-[var(--bg-hover)] transition-colors">
                        Try Again
                    </button>
                </div>
            </div>
            {levelUpLevel && <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />}
        </div>
    )

    return (
        <div className="min-h-screen flex flex-col">
            <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md px-6 py-3">
                <div className="max-w-3xl mx-auto flex items-center gap-4">
                    <button onClick={() => router.push('/dashboard')} className="text-[var(--text-muted)] hover:text-white text-xl">←</button>
                    <div className="flex-1">
                        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--green)] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between mt-1">
                            <span className="text-xs text-[var(--text-muted)] font-mono">Step {currentStep + 1} of {steps.length}</span>
                            <span className="text-xs text-[var(--text-muted)] font-mono">{Math.round(progress)}%</span>
                        </div>
                    </div>
                    <HeartsBar hearts={profile?.hearts ?? 5} shaking={heartShake} />
                </div>
            </div>

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${getDifficultyBg(problem?.difficulty)} ${getDifficultyColor(problem?.difficulty)}`}>
                            {problem?.difficulty}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                            {problem?.topic_tags?.slice(0, 3).join(' · ')}
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white">{problem?.title}</h1>
                </div>

                {step && (
                    <div className={`relative p-6 rounded-2xl border bg-[var(--bg-card)] mb-5 transition-all ${stepState === 'correct' ? 'border-[var(--green)] pulse-correct' :
                        stepState === 'incorrect' || stepState === 'revealed' ? 'border-[var(--red)]/50' :
                            'border-[var(--border)]'
                        }`}>
                        {xpFloat && (
                            <div className="absolute top-4 right-4 text-[var(--green)] font-black text-lg float-xp pointer-events-none">
                                {xpFloat}
                            </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)]">
                                {step.step_id}
                            </span>
                            <span className="text-xs font-mono text-[var(--text-muted)]">{step.expected_type}</span>
                        </div>

                        <p className="text-white font-semibold text-lg leading-relaxed mb-5">{step.prompt}</p>

                        <textarea
                            ref={answerRef}
                            value={answer}
                            onChange={e => setAnswer(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submitAnswer() }}
                            disabled={stepState === 'loading' || stepState === 'correct' || stepState === 'revealed'}
                            placeholder={step.expected_type === 'code' ? 'Write your code here...' : 'Type your answer...'}
                            rows={3}
                            className="w-full px-4 py-3 bg-[var(--bg)] border border-[var(--border)] rounded-xl text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--green)] transition-colors mono resize-none text-sm disabled:opacity-60"
                        />

                        {stepState === 'incorrect' && evalResult && (
                            <div className="mt-4 px-4 py-3 rounded-xl bg-[var(--amber-dim)] border border-[var(--amber)]/30">
                                <div className="flex items-center gap-2 mb-1">
                                    <span>💡</span>
                                    <span className="text-xs font-mono text-[var(--amber)] uppercase tracking-widest">Hint</span>
                                </div>
                                <p className="text-[var(--amber)] text-sm">{evalResult.short_reason}</p>
                            </div>
                        )}

                        {stepState === 'correct' && (
                            <div className="mt-4 px-4 py-3 rounded-xl bg-[var(--green-dim)] border border-[var(--green)]/30 flex items-center gap-2">
                                <span className="text-xl">✅</span>
                                <span className="text-[var(--green)] font-bold">Correct! Moving on...</span>
                            </div>
                        )}

                        {stepState === 'revealed' && evalResult && (
                            <div className="mt-4 px-4 py-3 rounded-xl bg-[var(--red-dim)] border border-[var(--red)]/30">
                                <div className="flex items-center gap-2 mb-1">
                                    <span>📖</span>
                                    <span className="text-xs font-mono text-[var(--red)] uppercase tracking-widest">Correct Answer</span>
                                </div>
                                <code className="text-white text-sm mono block">{evalResult.correct_answer}</code>
                            </div>
                        )}

                        {(stepState === 'idle' || stepState === 'incorrect') && (
                            <button onClick={submitAnswer} disabled={!answer.trim()}
                                className="mt-4 w-full py-3 bg-[var(--green)] text-black font-black rounded-xl hover:opacity-90 disabled:opacity-40 transition-all btn-glow">
                                {stepState as string === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        Checking...
                                    </span>
                                ) : attempt === 1 ? 'Check Answer ⌘↵' : 'Try Again →'}
                            </button>
                        )}

                        {stepState === 'revealed' && (
                            <button onClick={advanceStep}
                                className="mt-4 w-full py-3 bg-[var(--blue)] text-white font-black rounded-xl hover:opacity-90 transition-opacity btn-glow">
                                Next Step →
                            </button>
                        )}
                    </div>
                )}
            </div>

            {levelUpLevel && <LevelUpModal level={levelUpLevel} onClose={() => setLevelUpLevel(null)} />}
        </div>
    )
}