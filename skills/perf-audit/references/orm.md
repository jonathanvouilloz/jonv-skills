# ORM et query builders : où se cachent les problèmes

Règle générale : l'ORM ne génère pas de requêtes lentes par lui-même, il en génère **beaucoup** sans que le code le montre. Pour chaque chemin critique, compter les requêtes émises (log des requêtes en dev) plutôt que lire seulement le code.

## Motifs à chercher (toutes technos)

| Motif | Symptôme dans le code |
|---|---|
| N+1 | `await` d'une requête dans un `for`/`map`/`forEach` ; accès à une relation dans une boucle de rendu ou de sérialisation |
| Concurrence non bornée | `Promise.all(items.map(async i => db...))` sur une liste de taille variable |
| Liste puis filtre en mémoire | `findMany()` / `all()` puis `.filter()` / `.find()` |
| Lignes entières | `select()` / `findMany()` sans liste de colonnes dans une route de liste ; colonne JSON/HTML lue sans être utilisée |
| Écritures unitaires | `update`/`insert` dans une boucle |
| Transaction trop large | `db.transaction(async tx => { … boucle … appel réseau … })` |

## Spécifique par outil

### Drizzle (TypeScript)
- `db.select().from(t)` sans `.where()` sur une table qui grossit ; `db.query.x.findMany({ with: … })` sans `limit`.
- Préférer `inArray(col, ids)` pour charger en une fois ; `db.insert(t).values([...])` pour les lots.
- Le pool est celui du driver (`pg`, `postgres.js`, `@neondatabase/serverless`) : voir `runtime-node.md` pour ses timeouts. `drizzle(url)` crée un pool avec les valeurs par défaut du driver.
- Log : `drizzle(client, { logger: true })` en dev.

### Prisma (TypeScript)
- `include` imbriqués profonds = requêtes multiples ou jointures lourdes ; `select` explicite dans les listes.
- `findMany` sans `take` ; `count` à chaque page.
- Pool : `connection_limit` et `pool_timeout` dans l'URL, ou configuration de l'adaptateur de driver selon la version. En serverless, un client par invocation épuise les connexions.
- Log : `new PrismaClient({ log: ['query'] })`.

### Kysely, Knex, Lucid (AdonisJS), TypeORM, MikroORM
- Lucid : `preload()` pour les relations ; Knex sous-jacent, pool `min 2 / max 10`, `acquireConnectionTimeout` par défaut de 60 s (long).
- TypeORM : relations `eager: true` déclarées sur l'entité = chargées partout, y compris là où c'est inutile ; `lazy` relations = N+1.
- MikroORM : Identity Map par requête, attention aux `populate` larges.

### Eloquent (Laravel)
- `with()` / `load()` pour l'eager loading ; `withCount()` au lieu de `->relation->count()`.
- **Détection** : `Model::preventLazyLoading(! app()->isProduction())` dans un service provider fait échouer tout chargement paresseux en dev. Si absent, le recommander comme mesure.
- `chunkById()` / `lazyById()` pour les traitements de masse, `cursor()` pour la mémoire.
- `upsert()`, `insert([...])`, `update()` sur un query builder pour les lots.

### Doctrine (Symfony)
- Associations `LAZY` parcourues en boucle ; `fetch="EAGER"` partout ; hydratation d'entités complètes pour une liste → DQL `SELECT NEW` / `getArrayResult()`.
- `JOIN FETCH` pour charger en une fois ; Symfony Profiler (onglet Doctrine) pour compter.

### Entity Framework Core (.NET)
- `AsNoTracking()` pour les lectures ; projection `Select(x => new Dto {...})` au lieu d'entités complètes.
- `Include` multiples sur des collections = explosion cartésienne → `AsSplitQuery()`.
- Évaluation côté client : `.ToList()` avant `.Where()`.
- `ExecuteUpdate` / `ExecuteDelete` pour les modifications en masse (EF Core 7+) ; requêtes compilées pour les chemins très chauds.
- Log : `LogTo(Console.WriteLine)` en dev ; intercepteur ou Serilog pour les requêtes lentes.

### Hibernate / JPA (Spring Data)
- `@ManyToOne` et `@OneToOne` sont **EAGER par défaut** en JPA : les passer en `LAZY` et charger explicitement (`JOIN FETCH`, `@EntityGraph`).
- N+1 classique sur `@OneToMany` parcourue → `@BatchSize` ou fetch join.
- Insertion en lot : `hibernate.jdbc.batch_size` ; la génération d'ID `IDENTITY` désactive le batching des inserts (préférer `SEQUENCE`).
- `@Transactional(readOnly = true)` sur les lectures.
- Log : `spring.jpa.show-sql` en dev, ou datasource-proxy pour compter.

### Django ORM
- `select_related` (FK, jointure) et `prefetch_related` (relations multiples) ; `only()` / `defer()` pour les colonnes lourdes.
- `len(qs)` au lieu de `qs.count()` ; `if qs:` au lieu de `qs.exists()`.
- `bulk_create`, `bulk_update`, `update()` sur queryset ; `.iterator()` pour les gros parcours.
- Mesure : django-debug-toolbar, `django.db.connection.queries` en dev, `assertNumQueries` dans les tests.

### SQLAlchemy (FastAPI, Flask)
- Chargement paresseux par défaut : N+1 en synchrone, erreur en asynchrone. `selectinload()` (collections) et `joinedload()` (FK).
- Pool par défaut `pool_size=5`, `max_overflow=10`, `pool_timeout=30` ; `pool_pre_ping` pour les connexions coupées.

### ActiveRecord (Rails)
- `includes` / `preload` / `eager_load` ; `strict_loading` pour détecter le chargement paresseux.
- `counter_cache` pour les compteurs affichés en liste ; `find_each` pour les gros parcours ; `insert_all` / `upsert_all`.
- Mesure : gem `bullet`, `rack-mini-profiler`.
