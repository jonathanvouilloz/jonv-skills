---
name: perf-audit
description: Audit de performance en lecture seule d'une application web métier (base de données, ORM, backend, cache, frontend web/mobile, infra) qui produit un rapport priorisé PERF_AUDIT.md avec quick wins et priorités P1/P2/P3. Utiliser quand l'utilisateur demande un audit de performance, d'optimiser les requêtes, les index, le cache, de trouver ce qui ralentit ou risque de bloquer son app, ou dit "perf audit". Ne modifie jamais le code.
---

# Audit de performance — application web métier

Tu réalises un audit de performance **en lecture seule** et tu livres un rapport priorisé.
Tu ne corriges rien : le livrable est `PERF_AUDIT.md` à la racine du projet (ou le chemin demandé).

## Règles non négociables

1. **Aucune modification** de code, de configuration, de schéma ou de données. Pas de migration, pas de `npm install`, pas de build qui écrase un artefact existant. Seul fichier écrit : le rapport.
2. **Base de données : lecture seule, dev uniquement.** Tu peux exécuter les scripts SQL de `scripts/` et des `EXPLAIN` (sans `ANALYZE` sur une requête qui écrit, sauf dans `BEGIN … ROLLBACK`) sur une base de dev ou locale. Jamais sur la production sans accord explicite de l'utilisateur dans la conversation.
3. **Aucune supposition sur la stack** : tu la détectes dans le code (manifestes, configs, schéma, migrations). Si deux sources se contredisent (doc vs code), tu le signales.
4. **Constaté vs suspecté** : constaté = vu dans le code, la config ou le catalogue de la base ; suspecté = plausible mais à confirmer par une mesure. Chaque constat porte son statut.
5. **Aucun gain chiffré inventé.** Impact en Élevé / Moyen / Faible, justifié. Un chiffre n'apparaît que s'il est mesuré ou lu (taille de table, nombre de requêtes compté dans le code, poids d'un bundle).
6. **Calibrer sur le volume réel et projeté.** Une table de 2 000 lignes parcourue en entier coûte moins d'une milliseconde : ce n'est pas un problème aujourd'hui. Distingue trois natures de risque :
   - **Blocage** (attente infinie, transaction longue, pool épuisé, event loop gelée) — prioritaire même à petit volume.
   - **Lenteur** perçue par l'utilisateur — dépend du volume.
   - **Croissance** (coût qui augmente à chaque saison/mois/client) — à planifier, avec le seuil où ça deviendra visible.
7. **Emplacement exact** pour chaque constat : `fichier:ligne` (ou plage).
8. **Ce que tu ne sais pas va dans « Questions ouvertes »**, pas dans une hypothèse.

## Phase 0 — Cadrage et cartographie

1. **Stack** : langage, runtime, framework(s), ORM/accès aux données, base(s), cache, file de jobs/worker, frontend web, mobile, hébergement prévu. Sources : `package.json`, `composer.json`, `*.csproj`, `pom.xml`/`build.gradle`, `pyproject.toml`/`requirements.txt`, `Gemfile`, `convex/`, Dockerfile, docs d'architecture.
2. **Monorepo** : repère chaque app/package et ce qu'il fait.
3. **Schéma de données** : tables, relations, index existants (schéma ORM, migrations).
4. **Volumes** : si une base de dev est joignable (variable `DATABASE_URL` ou équivalent dans `.env` local), lance `scripts/postgres/01_volumes.sql`. Sinon, note-le et demande les volumes visés dans les questions ouvertes.
5. **Chemins critiques** : les 5 à 10 routes/pages les plus appelées ou les plus lourdes (accueil connecté, listes principales, publication/validation métier, endpoints appelés en polling, jobs planifiés).

## Phase 1 — Charger les références utiles

Lis **uniquement** les fichiers qui correspondent à la stack détectée :

| Détecté | Fichier(s) à lire |
|---|---|
| Toujours | `references/checklist-commune.md` |
| PostgreSQL (y compris Supabase, Neon) | `references/db-postgresql.md` + `scripts/postgres/` |
| MySQL / MariaDB, SQL Server | `references/db-mysql-sqlserver.md` |
| Un ORM ou query builder (Drizzle, Prisma, Kysely, Lucid, TypeORM, Eloquent, Doctrine, EF Core, Hibernate/JPA, Django ORM, SQLAlchemy, ActiveRecord) | `references/orm.md` |
| Node.js / Bun / Deno (Hono, Express, Fastify, NestJS, AdonisJS, Elysia, tRPC) | `references/runtime-node.md` |
| Next.js | `references/framework-nextjs.md` (en plus de runtime-node) |
| SvelteKit, Nuxt, Remix/React Router, Astro en mode serveur | `references/frontend-web.md` (section méta-frameworks) |
| PHP (Laravel, Symfony) | `references/runtime-php.md` |
| .NET (ASP.NET Core, Blazor) | `references/runtime-dotnet.md` |
| JVM (Spring Boot, Quarkus, Kotlin) | `references/runtime-jvm.md` |
| Python (Django, FastAPI, Flask) ou Ruby on Rails | `references/runtime-python-ruby.md` |
| Convex, Supabase, Firebase | `references/baas.md` |
| Frontend web (SPA ou SSR) | `references/frontend-web.md` |
| React Native / Expo | `references/frontend-mobile.md` |
| Cache, CDN, proxy, déploiement, observabilité | `references/cache-infra.md` |

Stack non couverte : applique `checklist-commune.md` et signale dans le rapport que l'audit n'a pas de référence spécifique pour cette techno.

## Phase 2 — Audit

Pour chaque domaine pertinent, parcours la checklist des références chargées. Méthode :

1. **Commencer par les faits déterministes** : scripts SQL du catalogue (clés étrangères sans index, index inutilisés, tailles, réglages de timeout), configuration du pool, en-têtes HTTP configurés, configuration du client de requêtes (staleTime, polling).
2. **Puis suivre les chemins critiques** de bout en bout : route → middleware → service → requêtes → réponse → consommation côté client. Compte les requêtes SQL par appel quand c'est possible (boucles, `Promise.all`, appels imbriqués).
3. **Chercher les multiplicateurs** : tout ce qui multiplie un coût par N (boucle sur des invités, des séances, des salons ; polling ; fan-out de notifications ; relecture à chaque écran).
4. **Chercher les points de blocage** : pas de timeout, transaction qui englobe du réseau ou une boucle, verrou tenu longtemps, concurrence non bornée face à un pool fixe, calcul CPU synchrone sur l'event loop.
5. Pour chaque requête suspecte, fournis **la commande exacte** pour confirmer (`EXPLAIN (ANALYZE, BUFFERS) …`, script, `curl`, Lighthouse, visualiseur de bundle).

## Phase 3 — Prioriser

Évalue chaque constat sur trois axes : **Impact** (Élevé/Moyen/Faible, pondéré par la nature du risque et le volume), **Effort** (Faible = moins d'une demi-journée, pas de changement de contrat ; Moyen = quelques jours ou change un contrat d'API ; Élevé = refonte), **Risque du correctif** (Faible/Moyen/Élevé : logique métier touchée, tests nécessaires).

Puis classe :

- **P1 — À faire maintenant** : tout risque de blocage, et tout impact Élevé avec effort Faible.
- **P2 — Prochain cycle** : impact Moyen à effort Faible, ou impact Élevé à effort Moyen.
- **P3 — À planifier ou à surveiller** : chantiers structurels, ou problèmes de croissance qui n'apparaîtront qu'au-delà d'un seuil (indique le seuil).
- **Écarté** : micro-optimisations sans effet mesurable au volume visé. Liste-les brièvement pour montrer qu'elles ont été vues.

**Quick win** = P1 ou P2 avec effort Faible et risque Faible. Les quick wins sont numérotés dans l'ordre où les faire.

## Phase 4 — Rapport

Écris `PERF_AUDIT.md` en suivant **exactement** `references/report-template.md`. Langue : celle de l'utilisateur. Pas d'emoji dans les titres.

Avant de rendre le rapport, vérifie :
- chaque constat a un emplacement, un statut, un impact, un effort, une priorité ;
- chaque correctif proposé indique comment mesurer avant/après et ses effets de bord ;
- le tableau est trié par priorité puis par impact décroissant ;
- aucun chiffre de gain n'est inventé ;
- les volumes utilisés pour calibrer sont écrits en tête du rapport.

En fin de tâche, donne à l'utilisateur dans la conversation : les 3 priorités P1, le nombre de constats par priorité, et le chemin du rapport. Rien de plus.
