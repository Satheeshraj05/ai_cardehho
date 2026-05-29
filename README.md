# AI Car Advisor 🚗

An AI-powered full-stack web app that helps confused car buyers discover the best cars for their needs. Describe what you want in plain English and get intelligent, explainable recommendations instantly.

## What did you build?

A chat-style car recommendation engine for the Indian market. Users type natural language queries like _"Safe SUV for family of 4 under 15 lakh"_ and receive a ranked shortlist of top 5 cars with match scores, score breakdowns, AI-generated explanations, and a side-by-side comparison table.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Zustand, React Query
- **Backend**: Next.js API Routes
- **Database**: SQLite via Prisma 7 + `@prisma/adapter-better-sqlite3`
- **AI**: Mistral API (`mistral-small-latest`) for preference extraction and explanation generation
- **UI**: Custom components with Radix UI primitives, `react-markdown` for rendered AI responses

## Getting Started

```bash
npm install
```

Copy the example env file and add your Mistral API key:

```bash
cp .env.example .env
# Edit .env and set MISTRAL_API_KEY
```

Seed the database with 51 Indian cars:

```bash
node prisma/seed.js
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path (default: `file:./dev.db`) |
| `MISTRAL_API_KEY` | Your Mistral API key from [console.mistral.ai](https://console.mistral.ai) |

## How AI is Used

1. **Preference Extraction** — User's natural language query is sent to `mistral-small-latest` which returns structured JSON (budget, body type, fuel, transmission, family size, priority, usage type)
2. **Recommendation Explanation** — After the scoring engine ranks cars, Mistral generates a conversational explanation of why the top cars were recommended
3. **Fallback** — If the API is unavailable, regex-based extraction and template explanations keep the app functional

## Recommendation Algorithm

Weighted scoring across 5 dimensions:

| Factor | Default Weight | Safety Priority | Mileage Priority |
|---|---|---|---|
| Budget Match | 30% | 20% | 20% |
| Safety Rating | 25% | 40% | 15% |
| Mileage | 15% | 10% | 40% |
| Preference Match | 20% | 20% | 15% |
| Review Score | 10% | 10% | 10% |

Weights shift dynamically based on the user's stated priority.

## What was intentionally cut?

- Authentication / user accounts
- Voice input
- Car detail pages
- PDF export
- Advanced animations
- Complex dashboards

MVP focus: working product with quality recommendations.

## What would you build with another 4 hours?

- Streaming AI responses so results appear progressively
- Car detail pages with full specs and image gallery
- Follow-up chat questions ("show me only automatics from that list")
- Vercel deployment with edge-compatible DB (Turso/libSQL)
- Favorites and compare saved lists
