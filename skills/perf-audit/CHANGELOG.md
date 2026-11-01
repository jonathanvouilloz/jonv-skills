# Changelog — perf-audit

## 1.0.0 — 2026-11-01

- First public version.
- Read-only audit workflow: stack detection, layer-based references, end-to-end critical paths, P1/P2/P3 prioritization, report template.
- References: PostgreSQL, MySQL/MariaDB, SQL Server, ORMs, Node.js/Bun, Next.js, PHP, .NET, JVM, Python/Ruby, Convex/Supabase/Firebase, web frontend, React Native/Expo, cache and infrastructure.
- Seven read-only PostgreSQL scripts (volumes, FK without index, unused and redundant indexes, sequential scans, settings, top queries) with a runner that forces read-only transactions.
