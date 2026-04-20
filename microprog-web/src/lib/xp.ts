export const XP_REWARDS = {
    CORRECT_FIRST_TRY: 20,
    CORRECT_SECOND_TRY: 10,
    ATTEMPTED: 2,
    HARD_MULTIPLIER: 1.5,
    MEDIUM_MULTIPLIER: 1.2,
    EASY_MULTIPLIER: 1.0,
    STREAK_7_MULTIPLIER: 2.0,
    STREAK_3_MULTIPLIER: 1.5,
}

export const LEVEL_THRESHOLDS = [
    0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 11000, 15000
]

export function getLevelFromXP(xp: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (xp >= LEVEL_THRESHOLDS[i]) return i + 1
    }
    return 1
}

export function getXPForNextLevel(level: number): number {
    return LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
}

export function getXPProgress(xp: number): { current: number; next: number; percent: number } {
    const level = getLevelFromXP(xp)
    const current = LEVEL_THRESHOLDS[level - 1] ?? 0
    const next = LEVEL_THRESHOLDS[level] ?? current + 1000
    const percent = Math.min(((xp - current) / (next - current)) * 100, 100)
    return { current: xp - current, next: next - current, percent }
}

export function calculateXP(
    correctOnFirstTry: number,
    correctOnSecondTry: number,
    attempted: number,
    difficulty: string,
    streak: number
): number {
    const base =
        correctOnFirstTry * XP_REWARDS.CORRECT_FIRST_TRY +
        correctOnSecondTry * XP_REWARDS.CORRECT_SECOND_TRY +
        attempted * XP_REWARDS.ATTEMPTED

    const diffMultiplier =
        difficulty === 'Hard' ? XP_REWARDS.HARD_MULTIPLIER :
            difficulty === 'Medium' ? XP_REWARDS.MEDIUM_MULTIPLIER :
                XP_REWARDS.EASY_MULTIPLIER

    const streakMultiplier =
        streak >= 7 ? XP_REWARDS.STREAK_7_MULTIPLIER :
            streak >= 3 ? XP_REWARDS.STREAK_3_MULTIPLIER : 1.0

    return Math.round(base * diffMultiplier * streakMultiplier)
}

export function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
        case 'Easy': return 'text-emerald-400'
        case 'Medium': return 'text-amber-400'
        case 'Hard': return 'text-red-400'
        default: return 'text-gray-400'
    }
}

export function getDifficultyBg(difficulty: string): string {
    switch (difficulty) {
        case 'Easy': return 'bg-emerald-400/10 border-emerald-400/30'
        case 'Medium': return 'bg-amber-400/10 border-amber-400/30'
        case 'Hard': return 'bg-red-400/10 border-red-400/30'
        default: return 'bg-gray-400/10 border-gray-400/30'
    }
}

export const LEVEL_TITLES = [
    '', 'Newbie', 'Apprentice', 'Coder', 'Developer',
    'Engineer', 'Architect', 'Expert', 'Master', 'Legend', 'God Mode'
]

export function getLevelTitle(level: number): string {
    return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)]
}