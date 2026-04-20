<div align="center">

```
███╗   ███╗██╗ ██████╗██████╗  ██████╗ ████████╗██╗   ██╗████████╗ ██████╗ ██████╗ 
████╗ ████║██║██╔════╝██╔══██╗██╔═══██╗╚══██╔══╝██║   ██║╚══██╔══╝██╔═══██╗██╔══██╗
██╔████╔██║██║██║     ██████╔╝██║   ██║   ██║   ██║   ██║   ██║   ██║   ██║██████╔╝
██║╚██╔╝██║██║██║     ██╔══██╗██║   ██║   ██║   ██║   ██║   ██║   ██║   ██║██╔══██╗
██║ ╚═╝ ██║██║╚██████╗██║  ██║╚██████╔╝   ██║   ╚██████╔╝   ██║   ╚██████╔╝██║  ██║
╚═╝     ╚═╝╚═╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝    ╚═╝    ╚═════╝ ╚═╝  ╚═╝
```

# 🤖 AI-Powered Micro-Programming Tutor

### *Stop copying. Start learning. One step at a time.*

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-black?style=for-the-badge)](https://ollama.ai)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![LeetCode](https://img.shields.io/badge/LeetCode-500_Problems-FFA116?style=for-the-badge&logo=leetcode&logoColor=white)](https://leetcode.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Penn State](https://img.shields.io/badge/Penn_State-CMPSC_496-1E407C?style=for-the-badge)](https://psu.edu)

<br/>

> *"Most AI tools just give you the answer. This one doesn't."*

<br/>

**[🎮 Play Now](#-getting-started) · [🧠 How It Works](#-how-it-works) · [📊 Research](#-research-context) · [🚀 Deploy](#-deployment)**

---

</div>

## 🔥 What Is This?

**MicroTutor** is a full-stack agentic AI system that teaches programming the way a great tutor would — by breaking problems into micro-steps, evaluating each one, and giving targeted hints when you're wrong.

It's also a **Duolingo-style game**. Hearts. XP. Level-ups. Streaks. Leaderboards.

And the twist? **Three AI students at different skill levels** also answer every step — simulating weak, normal, and strong learners — while their responses get logged, scored, and stored for research.

**100% local LLM inference. No OpenAI. No cloud. No cheating.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Decomposition** | Every problem broken into 7–10 ordered micro-steps with rubrics |
| ❤️ **Hearts System** | 5 hearts — lose one on every wrong answer |
| ⚡ **XP & Levels** | Earn XP for correct answers, level up through 10 tiers |
| 🔥 **Daily Streaks** | Keep your streak alive — 7-day bonus multiplier |
| 🤖 **3 AI Agents** | Weak (0.5b), Normal (1.5b), Strong (7b) — all answer independently |
| 📊 **Ground Truth Scoring** | Reconstructed solutions scored against LLM-generated reference answers |
| 🗃️ **500 Problems** | LeetCode problems fetched, stored, and served from Supabase |
| 🎮 **Game UI** | Next.js 16 + Tailwind — dark theme, animations, level-up modal |
| 🔐 **Auth** | Supabase Auth — email/password signup and login |
| 📡 **FastAPI Bridge** | Python LLM pipeline exposed as REST API for the web frontend |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         WEB FRONTEND                                │
│                    Next.js 16 · Tailwind CSS                        │
│                                                                     │
│  Landing → Auth → Dashboard → Problem → Tutor Game → Results       │
│                         ↕ REST API                                  │
└──────────────────────────┬──────────────────────────────────────────┘
                           │ http://localhost:8000
┌──────────────────────────▼──────────────────────────────────────────┐
│                      FASTAPI BRIDGE                                 │
│                    api_server.py                                    │
│              /decompose  ·  /evaluate  ·  /health                   │
│                         ↕ Python imports                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                    PYTHON LLM PIPELINE                              │
│                                                                     │
│   ┌─────────────────┐        ┌──────────────────────────────────┐  │
│   │   DECOMPOSER    │        │         3 AI STUDENTS            │  │
│   │  qwen2.5:7b     │        │  🔴 WEAK    qwen2.5:0.5b T=0.8  │  │
│   │  temp=0.2       │        │  🟡 NORMAL  qwen2.5:1.5b T=0.5  │  │
│   │  7-10 steps     │        │  🟢 STRONG  qwen2.5:7b   T=0.3  │  │
│   │  + rubrics      │        └──────────────────────────────────┘  │
│   └─────────────────┘                       ↓                      │
│                              ┌──────────────────────────────────┐  │
│   ┌─────────────────┐        │         EVALUATOR                │  │
│   │   SCORER        │        │  qwen2.5:7b · temp=0.0           │  │
│   │  reconstructs   │        │  rubric-grounded                 │  │
│   │  full solution  │        │  per-step grading                │  │
│   │  0.0 → 1.0      │        └──────────────────────────────────┘  │
│   └─────────────────┘                                               │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────┐
│                        SUPABASE                                     │
│                                                                     │
│  problems (500)  ·  steps  ·  interactions  ·  user_profiles       │
│  user_progress   ·  streaks                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗃️ Database Schema

```sql
-- 500 LeetCode problems with AI-generated ground truth solutions
problems      ( id · slug · title · difficulty · description · topic_tags · solution )

-- Decomposed micro-steps per problem
steps         ( id · problem_id · step_number · prompt · expected_type · rubric )

-- Every agent/human answer, grade, hint, score
interactions  ( id · step_id · agent_level · attempt · answer · correct
                   · hint_shown · final_answer · score · created_at )

-- Game state per user
user_profiles ( id · username · xp · level · hearts · streak · last_active )

-- Problem completion history
user_progress ( id · user_id · problem_id · completed · score · xp_earned )

-- Daily streak calendar
streaks       ( id · user_id · date · problems_solved )
```

---

## 📁 Project Structure

```
microprog-ai-tutor/
│
├── microprog_phase1/              ← 🐍 Python AI Backend
│   ├── run_phase1.py              # Main orchestrator
│   ├── api_server.py              # FastAPI bridge
│   ├── student_agent.py           # 3 AI student agents
│   ├── prompts.py                 # LLM system prompts
│   ├── schemas.py                 # Pydantic models
│   ├── ollama_client.py           # Ollama HTTP client
│   ├── fetch_problems.py          # LeetCode scraper
│   ├── fetch_solutions.py         # Ground truth generator
│   └── upload_to_supabase.py      # DB uploader
│
└── microprog-web/                 ← 🎮 Next.js Game Frontend
    └── src/
        ├── app/
        │   ├── page.tsx           # Landing page
        │   ├── auth/page.tsx      # Login / Signup
        │   ├── dashboard/page.tsx # Home — XP, hearts, problems
        │   └── problems/[slug]/   # Tutor game interface
        ├── components/game/
        │   ├── HeartsBar.tsx      # ❤️❤️❤️❤️❤️
        │   ├── XPBar.tsx          # Animated XP progress
        │   └── LevelUpModal.tsx   # 🏆 Full-screen celebration
        └── lib/
            ├── supabase.ts        # DB client + types
            └── xp.ts              # XP/level calculation logic
```

---

## 🚀 Getting Started

### Prerequisites

```bash
# 1. Install Ollama
brew install ollama
ollama serve

# 2. Pull all three student models
ollama pull qwen2.5:0.5b-instruct
ollama pull qwen2.5:1.5b-instruct
ollama pull qwen2.5:7b-instruct
```

### Backend Setup

```bash
cd microprog_phase1
python3 -m venv .venv
source .venv/bin/activate
pip install requests pydantic supabase python-dotenv fastapi uvicorn
```

Create `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

Load problems:
```bash
python fetch_problems.py       # fetch 500 LeetCode problems
python upload_to_supabase.py   # upload to Supabase
python fetch_solutions.py      # generate ground truth solutions
```

Start the API:
```bash
uvicorn api_server:app --port 8000 --reload
```

### Frontend Setup

```bash
cd microprog-web
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

Visit `http://localhost:3000` 🎮

---

## 🎮 XP & Level System

```
Correct first try    →  +20 XP  ⚡
Correct second try   →  +10 XP
Attempted (wrong)    →   +2 XP

Difficulty multiplier:
  Easy   × 1.0
  Medium × 1.2
  Hard   × 1.5

Streak bonus:
  3+ days  × 1.5
  7+ days  × 2.0

Level thresholds:
  Lv.1  Newbie       →     0 XP
  Lv.2  Apprentice   →   100 XP
  Lv.3  Coder        →   250 XP
  Lv.4  Developer    →   500 XP
  Lv.5  Engineer     →  1000 XP
  Lv.6  Architect    →  2000 XP
  Lv.7  Expert       →  3500 XP
  Lv.8  Master       →  5500 XP
  Lv.9  Legend       →  8000 XP
  Lv.10 God Mode     → 11000 XP
```

---

## 🔬 Research Context

**CMPSC 496 Independent Research · Penn State University · Spring 2026**

### Research Questions

| | Question |
|--|---------|
| **RQ1** | Can LLMs reliably decompose programming problems into ordered, gradable micro-steps? |
| **RQ2** | How accurately can rubric-grounded prompting evaluate single-line student answers? |
| **RQ3** | Does multi-ability-level agent simulation reveal meaningful patterns in student error types? |

### Key Findings (Phase 1)

- **~88%** step-level grading accuracy after rubric-grounded evaluation (up from ~70%)
- **Context isolation** per question eliminated cross-contamination in evaluation
- **normalize_code()** regex fix reduced false negatives from whitespace differences
- **Solution reconstruction** before scoring dramatically improved final score accuracy

### Analytics Queries

```sql
-- Pass rate by agent level
SELECT agent_level,
       ROUND(AVG(correct::int) * 100, 1) AS pass_rate_pct
FROM interactions
GROUP BY agent_level ORDER BY pass_rate_pct DESC;

-- Hardest problems
SELECT p.title, ROUND(AVG(i.correct::int) * 100, 1) AS pass_rate
FROM interactions i
JOIN steps s ON i.step_id = s.id
JOIN problems p ON s.problem_id = p.id
GROUP BY p.title ORDER BY pass_rate ASC LIMIT 10;

-- Average score by difficulty
SELECT p.difficulty, ROUND(AVG(i.score)::numeric, 2) AS avg_score
FROM interactions i
JOIN steps s ON i.step_id = s.id
JOIN problems p ON s.problem_id = p.id
WHERE i.score IS NOT NULL
GROUP BY p.difficulty;
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| LLM Runtime | Ollama (fully local) |
| AI Models | Qwen2.5 — 0.5b, 1.5b, 7b |
| Backend Language | Python 3.11+ |
| API Framework | FastAPI + Uvicorn |
| Data Validation | Pydantic |
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Problem Source | LeetCode GraphQL API |
| Version Control | Git / GitHub |
| Deployment | Vercel (frontend) |

---

## 🗺️ Roadmap

- [x] Phase 1 — Core tutoring pipeline (Python)
- [x] 3-agent AI student simulation
- [x] Supabase integration — problems, steps, interactions
- [x] 500 LeetCode problems ingested
- [x] Ground truth solution generation + scoring
- [x] FastAPI bridge
- [x] Next.js game UI — landing, auth, dashboard, tutor
- [x] Hearts, XP, levels, streaks
- [ ] Leaderboard page
- [ ] Profile page + streak calendar
- [ ] Deploy to Vercel
- [ ] Code execution sandbox (deterministic grading)
- [ ] Analytics dashboard
- [ ] Fine-tune on collected interaction data
- [ ] Phase 2 — Real student study with IRB approval

---

## 👤 Author

**Daksh Mainee**
B.S. Computer Science & AI · Penn State University
`dzm6085@psu.edu`

---

<div align="center">

*Built with 🧠 local LLMs, ☕ caffeine, and a firm belief that AI should teach — not just answer.*

**If this helped you, star the repo ⭐**

</div>