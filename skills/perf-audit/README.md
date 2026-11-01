# perf-audit

**English** | [Français](README.fr.md)

A read-only performance audit for business web apps. It reads your code and your dev database, calibrates every finding against your real data volumes, and writes a prioritized report (`PERF_AUDIT.md`) with quick wins and P1 / P2 / P3 priorities.

**It never modifies your code.** The only file it writes is the report. Database scripts run in a forced read-only transaction, on a dev database only.

## Why

AI writes code that works. It does not always write code that holds up after three years of client data: missing indexes, N+1 queries, connection pools that wait forever, lists that are never paginated. With 50 rows in dev, everything is fast. This skill checks what the AI (or you) shipped, before your client finds out.

## What it checks

- **Database**: foreign keys without indexes, non-indexable filters, redundant and unused indexes, N+1 queries, deep `OFFSET`, row-by-row writes, long transactions, lock ordering, timeouts.
- **ORM**: what Drizzle, Prisma, Eloquent, EF Core, Hibernate, Django ORM, SQLAlchemy or ActiveRecord actually generate.
- **Backend**: connection pool and timeouts, unbounded concurrency (`Promise.all` against a 10-connection pool), slow work inside the request, blocking code on the event loop, compression, HTTP headers.
- **Cache**: what is cached, what should be, invalidation, user data leaking into shared caches.
- **Frontend**: network waterfalls in SPAs, data client settings (`staleTime`, polling), bundle size, heavy dependencies, images, PWA.
- **Mobile** (React Native / Expo): refetching, non-virtualized lists, images.
- **Measurement plan**: what to instrument so the next decisions rely on numbers.

## How it works

1. Detects your stack from the code (no assumptions).
2. Loads only the reference files for that stack.
3. Runs deterministic SQL scripts against your dev database (PostgreSQL) to get facts: volumes, missing FK indexes, timeouts, top queries.
4. Follows your critical paths end to end and counts queries.
5. Separates three kinds of risk: **blocking** (fix even at small volume), **slowness**, and **growth** (with the volume at which it will hurt).
6. Writes the report: each finding has a location (`file:line`), a status (observed / suspected), impact, effort, fix, how to measure before/after, and side effects.

See a real (anonymized) report excerpt: [examples/sample-report.md](examples/sample-report.md).

## Supported stacks

| Layer | Covered |
|---|---|
| Databases | PostgreSQL (incl. Supabase, Neon), MySQL / MariaDB, SQL Server |
| Runtimes | Node.js / Bun (Hono, Express, Fastify, NestJS, AdonisJS), PHP (Laravel, Symfony), .NET (ASP.NET Core, Blazor), JVM (Spring Boot, Quarkus), Python (Django, FastAPI), Ruby on Rails |
| Frameworks | Next.js (incl. Next 16 Cache Components), SvelteKit, Nuxt, React Router |
| Managed backends | Convex, Supabase, Firebase |
| Clients | React SPA, PWA, React Native / Expo |

The Node.js, PostgreSQL and React parts have been tested on real projects. The .NET, JVM, PHP and Rails references are newer: issues and PRs welcome.

For Convex, the skill recommends using the official `convex-performance-audit` skill alongside it.

## Install

**With the skills CLI** (Claude Code and other agents that support SKILL.md):
```bash
npx skills add jonathanvouilloz/jonv-skills --skill perf-audit
```

**Manually in Claude Code**: copy `skills/perf-audit/` into `~/.claude/skills/perf-audit/` (all projects) or `.claude/skills/perf-audit/` (one project).

**As a Claude Code plugin**:
```
/plugin marketplace add jonathanvouilloz/jonv-skills
/plugin install perf-audit@jonv-skills
```

**claude.ai**: download this folder as a zip and upload it in your skills settings.

## Use

In your project, ask for it:

```
run a performance audit of this app
```

or "perf audit". Point it to your dev database through your usual `DATABASE_URL` if you want the SQL checks. Never point it to production.

Note: the skill instructions are written in French. The report is written in the language you use with your agent.

## License

MIT
