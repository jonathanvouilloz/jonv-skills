# Cache, infrastructure, déploiement et observabilité

## Couches de cache (du plus proche au plus loin de l'utilisateur)

1. **Navigateur / app** : `Cache-Control`, `ETag`/`Last-Modified` (réponses 304), cache du client de données.
2. **CDN** : assets statiques, pages publiques.
3. **Reverse proxy** (Nginx, Caddy, Traefik, proxy de l'hébergeur) : compression, cache de réponses publiques.
4. **Cache applicatif** : Redis/Valkey, cache mémoire du process, cache intégré du framework.
5. **Dans la requête** : mémoïsation (même utilisateur, mêmes droits relus plusieurs fois).

## Ce qu'il faut vérifier

- **Ordre des correctifs** : index, N+1, pagination et colonnes inutiles d'abord. Un cache posé sur une requête mal écrite masque le problème et ajoute de l'invalidation.
- **Données personnelles en cache partagé** : réponse API sans `Cache-Control` derrière un CDN/proxy ; clé de cache applicatif sans identifiant d'utilisateur ou de tenant.
- **Invalidation** : TTL, invalidation à l'écriture, clés versionnées. Cache sans stratégie = données périmées.
- **Stampede** : clé populaire qui expire et provoque N recalculs simultanés → verrou, `stale-while-revalidate`, expiration aléatoire.
- **Cache mémoire multi-instances** : chaque instance a sa propre copie, invalidation incohérente.
- **Taux de succès** : un cache sans mesure de hit rate est un pari.

## Déploiement

- Qui compresse (proxy de l'hébergeur ou application) ? Qui sert les fichiers statiques et avec quels en-têtes ? Souvent « prévu » dans la doc mais absent du code : le dire.
- Plusieurs instances prévues ? Conséquences : rate limiting et caches mémoire à déplacer (Redis, base), sessions, websockets.
- Région : application et base dans le même datacenter. Une latence app↔base de 20 ms multipliée par 30 requêtes = 600 ms.
- Ressources : RAM suffisante pour que la base garde ses index chauds en mémoire ; limites CPU du conteneur cohérentes avec le runtime (nombre de workers, heap JVM).
- Healthcheck : léger, avec timeout court ; ne doit pas saturer quand le pool est plein.

## Observabilité (plan de mesure)

Ordre recommandé pour une app métier qui n'a rien :
1. **Jeu de données réaliste** : seed multiplié (plusieurs saisons, clients, années). Sans lui, aucune mesure n'est parlante.
2. **Base** : requêtes lentes journalisées + statistiques de requêtes (pg_stat_statements, Query Store, sys schema).
3. **API** : durée par route (middleware de log ou OpenTelemetry), latence de l'event loop / file du thread pool selon le runtime.
4. **Erreurs et traces** : Sentry, ou OpenTelemetry vers un backend (Grafana, Honeycomb, Axiom…).
5. **Charge** : autocannon/oha (simple), k6 (scénarios) sur les routes critiques, avec le jeu de données réaliste.
6. **Frontend** : Lighthouse sur les pages clés, visualiseur de bundle, puis RUM en production.
7. **Budgets en CI** : taille du bundle d'entrée, nombre de requêtes SQL par route critique (tests avec compteur de requêtes).
