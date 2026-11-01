# perf-audit

[English](README.md) | **Français**

Un audit de performance en lecture seule pour les applications web métier. Il lit votre code et votre base de dev, calibre chaque constat sur vos vrais volumes de données, et écrit un rapport priorisé (`PERF_AUDIT.md`) avec les quick wins et les priorités P1 / P2 / P3.

**Il ne modifie jamais votre code.** Le seul fichier écrit est le rapport. Les scripts SQL s'exécutent dans une transaction en lecture seule forcée, uniquement sur une base de dev.

## Pourquoi

L'IA écrit du code qui marche. Pas forcément du code qui tient après trois ans de données chez un client : index manquants, requêtes N+1, pool de connexions qui attend à l'infini, listes jamais paginées. Avec 50 lignes en dev, tout est rapide. Ce skill vérifie ce que l'IA (ou vous) avez livré, avant que votre client ne s'en aperçoive.

## Ce qu'il vérifie

- **Base de données** : clés étrangères sans index, filtres non indexables, index redondants ou inutilisés, N+1, `OFFSET` profond, écritures ligne par ligne, transactions longues, ordre des verrous, timeouts.
- **ORM** : ce que Drizzle, Prisma, Eloquent, EF Core, Hibernate, l'ORM Django, SQLAlchemy ou ActiveRecord génèrent vraiment.
- **Backend** : pool de connexions et timeouts, concurrence non bornée (`Promise.all` face à un pool de 10 connexions), travail lent dans la requête, code bloquant sur l'event loop, compression, en-têtes HTTP.
- **Cache** : ce qui est en cache, ce qui devrait l'être, invalidation, données utilisateur dans un cache partagé.
- **Frontend** : cascades réseau des SPA, réglages du client de données (`staleTime`, polling), taille du bundle, dépendances lourdes, images, PWA.
- **Mobile** (React Native / Expo) : relectures, listes non virtualisées, images.
- **Plan de mesure** : quoi instrumenter pour que les prochaines décisions reposent sur des chiffres.

## Comment il fonctionne

1. Il détecte votre stack dans le code, sans supposition.
2. Il ne charge que les fichiers de référence de cette stack.
3. Il exécute des scripts SQL déterministes sur votre base de dev (PostgreSQL) pour obtenir des faits : volumes, clés étrangères sans index, timeouts, requêtes les plus coûteuses.
4. Il suit vos chemins critiques de bout en bout et compte les requêtes.
5. Il distingue trois natures de risque : **blocage** (à corriger même à petit volume), **lenteur**, et **croissance** (avec le volume à partir duquel ça deviendra visible).
6. Il écrit le rapport : chaque constat a un emplacement (`fichier:ligne`), un statut (constaté / suspecté), un impact, un effort, un correctif, la façon de mesurer avant/après, et les effets de bord.

Un extrait de rapport réel (anonymisé) : [examples/sample-report.md](examples/sample-report.md).

## Stacks couvertes

| Couche | Couvert |
|---|---|
| Bases de données | PostgreSQL (y compris Supabase, Neon), MySQL / MariaDB, SQL Server |
| Runtimes | Node.js / Bun (Hono, Express, Fastify, NestJS, AdonisJS), PHP (Laravel, Symfony), .NET (ASP.NET Core, Blazor), JVM (Spring Boot, Quarkus), Python (Django, FastAPI), Ruby on Rails |
| Frameworks | Next.js (y compris les Cache Components de Next 16), SvelteKit, Nuxt, React Router |
| Backends managés | Convex, Supabase, Firebase |
| Clients | SPA React, PWA, React Native / Expo |

Les parties Node.js, PostgreSQL et React ont été éprouvées sur de vrais projets. Les références .NET, JVM, PHP et Rails sont plus récentes : issues et PR bienvenues.

Pour Convex, le skill recommande d'utiliser en complément le skill officiel `convex-performance-audit`.

## Installation

**Avec le CLI skills** (Claude Code et les autres agents compatibles SKILL.md) :
```bash
npx skills add jonv/jonv-skills --skill perf-audit
```

**À la main dans Claude Code** : copier `skills/perf-audit/` dans `~/.claude/skills/perf-audit/` (tous les projets) ou `.claude/skills/perf-audit/` (un projet).

**Comme plugin Claude Code** :
```
/plugin marketplace add jonv/jonv-skills
/plugin install perf-audit@jonv-skills
```

**claude.ai** : télécharger ce dossier en zip et l'importer dans les réglages des skills.

## Utilisation

Dans votre projet, demandez-le :

```
fais un audit de performance de cette app
```

ou « perf audit ». Pour les vérifications SQL, il utilise votre `DATABASE_URL` de dev habituelle. Ne jamais le faire pointer vers la production.

## Licence

MIT
