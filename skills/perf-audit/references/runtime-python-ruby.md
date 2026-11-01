# Python (Django, FastAPI, Flask) et Ruby on Rails

Lire aussi `orm.md`.

## Django

- **Connexions** : `CONN_MAX_AGE = 0` (défaut) ouvre une connexion par requête. Utiliser des connexions persistantes (`CONN_MAX_AGE` > 0 avec `CONN_HEALTH_CHECKS`) ou le pool natif PostgreSQL de Django 5.1+ (`OPTIONS: {"pool": True}`), ou PgBouncer.
- N+1 dans les templates, les sérialiseurs DRF (champs imbriqués, `SerializerMethodField` qui requête) et l'admin (`list_display` avec relations → `list_select_related`).
- Pagination DRF absente (`DEFAULT_PAGINATION_CLASS`).
- Cache : framework de cache configuré sur `LocMemCache` en production multi-process (un cache par worker) ; `cache_page` sur des vues personnalisées.
- Travail lent → Celery, RQ, Dramatiq, ou les tâches de fond intégrées (Django 6).
- `DEBUG = True` en production (garde toutes les requêtes SQL en mémoire).
- Mesurer : django-debug-toolbar, django-silk, `assertNumQueries`.

## FastAPI / Starlette

- **`async def` avec un appel bloquant** (driver synchrone, `requests`, `time.sleep`, calcul CPU) → bloque la boucle pour toutes les requêtes. Un endpoint `def` (synchrone) est exécuté dans un pool de threads : préférable si le code est bloquant.
- SQLAlchemy async : chargement paresseux impossible → `selectinload`/`joinedload` ; pool `pool_size=5, max_overflow=10` par défaut.
- `httpx.AsyncClient` créé par requête (pas de réutilisation des connexions) et sans `timeout`.
- Dépendances (`Depends`) qui refont la même requête (utilisateur, droits) plusieurs fois par appel.
- Workers : nombre de workers Uvicorn/Gunicorn vs CPU ; chaque worker a son propre pool de connexions.
- Mesurer : `pyinstrument` ou `py-spy` sur une route lente, OpenTelemetry.

## Flask

- Mêmes points que Django pour l'ORM (SQLAlchemy) ; serveur de dev utilisé en production ; pas de pool configuré.

## Ruby on Rails

- N+1 : `includes`/`preload`, `strict_loading`, gem `bullet` (voir `orm.md`).
- **Pool vs threads** : `pool` dans `database.yml` ≥ threads Puma (`RAILS_MAX_THREADS`), sinon attente de connexion (`ActiveRecord::ConnectionTimeoutError`).
- Rails 8 : Solid Queue, Solid Cache, Solid Cable sur la base : vérifier qu'ils ne partagent pas la base principale sous forte charge, et leurs index.
- Cache de fragments (`cache @record do`) et cache russe sur les vues lourdes ; `counter_cache`.
- Travail lent dans le contrôleur → Active Job (`deliver_later` au lieu de `deliver_now`).
- Hotwire/Turbo : Turbo Frames qui rechargent de grosses portions ; broadcasts Turbo Streams à chaque mise à jour d'un enregistrement très modifié.
- Mesurer : rack-mini-profiler, `ActiveSupport::Notifications`, APM (Skylight, Scout, AppSignal).
