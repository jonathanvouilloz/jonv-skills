# Node.js, Bun, Deno (Hono, Express, Fastify, NestJS, AdonisJS, Elysia, tRPC)

## Le modèle à garder en tête

Un seul thread exécute le JavaScript. Tout calcul synchrone long (parsing, nettoyage HTML, génération PDF, `JSON.parse` d'un gros document, crypto synchrone, regex catastrophique) **gèle toutes les requêtes en cours**. L'asynchrone ne protège que des attentes d'I/O.

## Pool de connexions (constat prioritaire)

Lire la création du client de base de données. Valeurs par défaut des drivers courants :

| Driver | Taille | Attente d'une connexion | Timeout requête |
|---|---|---|---|
| `pg` (node-postgres) `Pool` | `max: 10` | `connectionTimeoutMillis: 0` = **infinie** | aucun par défaut ; options `statement_timeout`, `query_timeout`, `idle_in_transaction_session_timeout` disponibles dans la config |
| `postgres` (postgres.js) | `max: 10` | `connect_timeout: 30` s | aucun par défaut |
| `mysql2` pool | `connectionLimit: 10` | `queueLimit: 0` = file illimitée | `connectTimeout` 10 s |
| Knex / Lucid | `min 2 / max 10` | `acquireConnectionTimeout: 60000` | aucun |

Constat type (P1, nature Blocage) : pool sans timeout d'acquisition ni `statement_timeout`. Correctif type :

```ts
new Pool({ connectionString, max: 10, connectionTimeoutMillis: 5_000,
  statement_timeout: 15_000, idle_in_transaction_session_timeout: 30_000 })
```

Vérifier aussi : un pool par process (API, worker, jobs) → somme des `max` vs `max_connections` ; un worker de purge a besoin d'un `statement_timeout` plus large que l'API.

## Concurrence

- `Promise.all(list.map(async x => …requêtes…))` : la concurrence réelle est plafonnée par le pool, le reste attend. Avec N éléments × k requêtes, la file peut dépasser le timeout et entraîner toutes les autres routes. Correctif : charger en lot (une requête `IN`), sinon borner (`p-limit`, traitement par paquets).
- À l'inverse, des `await` séquentiels pour des appels indépendants (`await a(); await b();`) → `Promise.all([a(), b()])`.

## Requête HTTP et travail lent

- Email, push, webhooks, PDF, appels IA attendus pendant la requête → file (outbox en base, pg-boss, graphile-worker, BullMQ si Redis). Si une outbox existe déjà dans le projet, vérifier que **tous** les envois l'utilisent.
- `fetch` sans `AbortSignal.timeout(ms)` : attente potentiellement infinie vers un service tiers. Vérifier les SDK (Resend, Stripe, Expo, OpenAI/Anthropic) et leurs timeouts par défaut.
- Worker : boucle qui traite un lot en séquentiel avec un timeout long par appel → un fournisseur lent retarde tout. Regrouper quand l'API le permet (Expo accepte des lots de messages push).

## Framework

- **Compression** : Hono `hono/compress`, Express `compression`, Fastify `@fastify/compress`, NestJS via Express/Fastify. Ou au proxy (souvent préférable) : vérifier qui le fait réellement.
- **En-têtes** : `Cache-Control: private, no-cache` (ou `no-store` pour les données sensibles) par défaut sur l'API ; sinon un proxy ou CDN peut conserver une réponse utilisateur.
- **Validation/sérialisation** : schémas Zod/Valibot reconstruits à chaque requête, `structuredClone` ou `JSON.parse(JSON.stringify())` de gros objets.
- **Healthcheck** qui interroge la base sans timeout court → redémarrages en cascade quand le pool sature.
- **Rate limiting et caches en mémoire** (`Map`, LRU, limiteurs de Better Auth et autres) : valables pour une instance. À signaler si plusieurs instances sont prévues.
- NestJS : intercepteurs/guards qui refont des requêtes de droits à chaque appel sans cache ; scope `REQUEST` sur des providers (recréés à chaque requête).
- AdonisJS : `preload` Lucid, cache de config en production, `node ace build`.

## Fichiers et mémoire

- Lecture complète d'un fichier, d'un email ou d'un upload en mémoire (`Buffer.concat`, `arrayBuffer()`) au lieu d'un stream ; plafond de taille absent ou trop haut.
- Fuites : listeners ajoutés par requête, caches `Map` sans limite.

## Mesurer

- Latence de l'event loop : `perf_hooks.monitorEventLoopDelay()` journalisé chaque minute (p99).
- Durée par route : middleware de log (méthode, route, statut, durée).
- Charge : `autocannon` ou `oha` sur les routes critiques ; `k6` pour des scénarios.
- Profil CPU : `node --cpu-prof` ou `clinic flame` sur une route lente.
