'use client'
import { useEffect, useRef, useState } from 'react'
import { getLevelFromXP, getXPProgress, getLevelTitle } from '@/lib/xp'

interface XPBarProps {
    xp: number
    showLabel?: boolean
    compact?: boolean
}

export default function XPBar({ xp, showLabel = true, compact = false }: XPBarProps) {
    const { percent, current, next } = getXPProgress(xp)
    const level = getLevelFromXP(xp)
    const title = getLevelTitle(level)
    const [displayPercent, setDisplayPercent] = useState(0)

    useEffect(() => {
        const timeout = setTimeout(() => setDisplayPercent(percent), 100)
        return () => clearTimeout(timeout)
    }, [percent])

    if (compact) return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[var(--green)]">Lv.{level}</span>
            <div className="flex-1 h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--green)] rounded-full transition-all duration-1000"
                    style={{ width: `${displayPercent}%` }}
                />
            </div>
            <span className="text-xs font-mono text-[var(--text-muted)]">{xp} XP</span>
        </div>
    )

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[var(--green)]">Lv. {level}</span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{title}</span>
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                        {current} / {next} XP
                    </span>
                </div>
            )}
            <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden relative">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                        width: `${displayPercent}%`,
                        background: 'linear-gradient(90deg, #00e5a0, #00b87a)',
                    }}
                >
                    <div className="absolute inset-0 bg-white/20 rounded-full"
                        style={{ backgroundImage: 'linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%)', backgroundSize: '6px 100%' }} />
                </div>
            </div>
        </div>
    )
}