import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type UserProfile = {
    id: string
    username: string
    xp: number
    level: number
    hearts: number
    streak: number
    last_active: string
}

export type Problem = {
    id: string
    slug: string
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    description: string
    topic_tags: string[]
    solution?: string
}

export type Step = {
    id: string
    problem_id: string
    step_number: number
    prompt: string
    expected_type: string
    rubric: string
}