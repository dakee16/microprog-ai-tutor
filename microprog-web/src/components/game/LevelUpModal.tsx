'use client'
import { useEffect, useState } from 'react'
import { getLevelTitle } from '@/lib/xp'

interface LevelUpModalProps {
    level: number
    onClose: () => void
}

export default function LevelUpModal({ level, onClose }: LevelUpModalProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => setVisible(true), 50)
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10 text-center transition-transform duration-500 ${visible ? 'scale-100' : 'scale-50'}`}>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="absolute w-1 bg-[var(--green)] opacity-20 rounded-full"
                            style={{ height: '200px', transformOrigin: 'bottom center', transform: `rotate(${i * 30}deg) translateY(-100px)`, animation: 'spin 8s linear infinite' }} />
                    ))}
                </div>
                <div className="relative px-16 py-12 rounded-3xl border-2 border-[var(--green)] bg-[var(--bg-card)]"
                    style={{ boxShadow: '0 0 60px rgba(0,229,160,0.3), 0 0 120px rgba(0,229,160,0.1)' }}>
                    <div className="text-7xl mb-4 animate-bounce">🏆</div>
                    <div className="text-xs font-mono text-[var(--green)] tracking-[0.3em] mb-2">LEVEL UP!</div>
                    <div className="text-6xl font-black text-white mb-2">Level {level}</div>
                    <div className="text-xl text-[var(--green)] font-bold mb-6">{getLevelTitle(level)}</div>
                    <button onClick={onClose}
                        className="px-8 py-3 bg-[var(--green)] text-black font-black rounded-xl hover:opacity-90 transition-opacity">
                        Keep Going →
                    </button>
                </div>
            </div>
            <style jsx>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    )
}