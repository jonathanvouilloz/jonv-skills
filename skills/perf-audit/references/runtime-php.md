# PHP (Laravel, Symfony)

Lire aussi `orm.md` (sections Eloquent / Doctrine).

## Modèle d'exécution

- **PHP-FPM classique** : l'application démarre à chaque requête. Le coût de démarrage (config, routes, conteneur) compte. OPcache est indispensable.
- **Serveur applicatif persistant** (Laravel Octane avec FrankenPHP, Swoole ou RoadRunner ; Symfony avec FrankenPHP worker mode ou Runtime) : l'app reste en mémoire entre les requêtes. Gain important, mais tout état statique ou singleton fuit d'une requête à l'autre (données d'un utilisateur visibles par un autre, mémoire qui grossit).

## Laravel

**Configuration de production**
- `php artisan optimize` (ou `config:cache`, `route:cache`, `view:cache`, `event:cache`) dans le déploiement.
- `APP_DEBUG=false` ; Debugbar et Telescope désactivés ou restreints en production (Telescope enregistre chaque requête en base).
- OPcache activé avec `opcache.validate_timestamps=0` en production.
- `composer install --optimize-autoloader --no-dev`.

**Code**
- N+1 : voir `orm.md`. Vérifier si `Model::preventLazyLoading()` est actif en dev.
- Travail lent dans la requête → jobs en file (`ShouldQueue`) ; driver de file `sync` en production = tout s'exécute dans la requête.
- Cache : `Cache::remember()` sur les lectures coûteuses et stables ; driver `file` ou `database` en production quand Redis est disponible.
- Sessions et cache sur le driver `database` sans index adapté.
- `Http::` sans `->timeout()` (défaut long) vers les API tierces.
- Octane : services enregistrés en `singleton` qui gardent la requête ou l'utilisateur ; propriétés statiques qui accumulent.

**Mesurer** : Laravel Pulse (requêtes lentes, jobs, endpoints), Telescope en dev, `DB::listen()` pour compter les requêtes.

## Symfony

- Cache de production (`APP_ENV=prod`, `cache:warmup`), preloading OPcache (`config/preload.php`).
- Doctrine : voir `orm.md` ; cache de métadonnées et de requêtes DQL sur APCu/Redis.
- Messenger pour le travail asynchrone, transport `sync` en production = travail dans la requête.
- HttpClient : `timeout` et `max_duration`.
- Mesurer : Symfony Profiler (onglets Doctrine, Performance), Blackfire.

## Base

- MySQL/MariaDB fréquents : voir `db-mysql-sqlserver.md`. PostgreSQL : `db-postgresql.md`.
- Connexions persistantes (`PDO::ATTR_PERSISTENT`) avec FPM : nombre de connexions = nombre de workers FPM × serveurs.
