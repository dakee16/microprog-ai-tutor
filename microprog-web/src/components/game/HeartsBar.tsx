'use client'
import { useEffect, useState } from 'react'

interface HeartsBarProps {
    hearts: number
    maxHearts?: number
    shaking?: boolean
}

export default function HeartsBar({ hearts, maxHearts = 5, shaking = false }: HeartsBarProps) {
    const [shake, setShake] = useState(false)

    useEffect(() => {
        if (shaking) {
            setShake(true)
            setTimeout(() => setShake(false), 600)
        }
    }, [shaking])

    return (
        <div className="flex items-center gap-1.5">
            {Array.from({ length: maxHearts }).map((_, i) => (
                <span
                    key={i}
                    className={`text-xl transition-all duration-200 ${i < hearts ? 'opacity-100' : 'opacity-20 grayscale'
                        } ${shake && i === hearts ? 'heart-shake' : ''}`}
                    style={{ transform: i < hearts ? 'scale(1)' : 'scale(0.85)' }}
                >
                    ❤️
                </span>
            ))}
        </div>
    )
}