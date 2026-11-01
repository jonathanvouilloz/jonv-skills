# Checklist commune (toutes stacks)

Points valables quel que soit le langage. Les références spécifiques précisent le « comment le détecter » propre à chaque techno.

## Points de blocage (à traiter même à petit volume)

- **Timeouts absents** à chaque frontière : acquisition d'une connexion au pool, durée d'une requête SQL (`statement_timeout` ou équivalent), transaction inactive (`idle_in_transaction`), appels HTTP sortants (API tierces, email, push, IA), connexions IMAP/SMTP, cache. Un défaut « attente infinie » est un constat P1.
- **Concurrence non bornée face à une ressource fixe** : `Promise.all`/`Task.WhenAll`/`asyncio.gather` sur N éléments qui chacun fait des requêtes, alors que le pool fait 10 connexions. Résultat : file d'attente, puis timeouts en cascade, y compris le healthcheck.
- **Transactions longues** : transaction qui englobe une boucle, un appel réseau (email, paiement, API) ou un traitement lourd. Elle garde ses verrous et une connexion pendant tout ce temps.
- **Verrous** : `SELECT … FOR UPDATE` pris un par un dans une boucle (risque d'interblocage si l'ordre varie) au lieu d'une seule requête triée.
- **Calcul synchrone sur un thread partagé** : parsing de gros fichiers, génération PDF, nettoyage HTML, crypto, compression dans la boucle de requêtes.
- **Healthcheck qui dépend de la base** sans timeout court : un pool saturé fait redémarrer l'instance par l'orchestrateur.

## Accès aux données

- N+1 : requête dans une boucle ou relation chargée à la demande dans une liste.
- **N+1 dans une transaction ou sous verrou** : le pire cas, à remonter en priorité.
- Fan-out métier (notifier N personnes, publier N séances, recalculer N membres) écrit requête par requête au lieu d'un chargement groupé (`IN`/`ANY`) et d'une insertion en lot.
- Table entière relue sans filtre (toutes saisons, tous clients) pour en extraire quelques lignes en mémoire.
- `find` en mémoire après avoir chargé une liste complète, alors qu'une requête ciblée par clé existe.
- Listes renvoyées sans pagination ni filtre par défaut (saison courante, 30 derniers jours, client courant).
- Colonnes lourdes (JSON, texte long, HTML, binaire) lues dans des listes qui ne les affichent pas.
- Filtres qui empêchent l'usage d'un index : fonction ou conversion sur la colonne (`date(col)`, `col AT TIME ZONE …`, `lower(col)`), `LIKE '%…'`, comparaison de types différents.
- Clés étrangères sans index (jointures, suppressions en cascade, purges).
- Écritures ligne par ligne qui pourraient être une seule requête (`UPDATE … WHERE id = ANY(…)`, insertion multi-lignes).
- Purges et tâches planifiées : leur coût croît avec la table ; vérifier les index qui servent leurs `WHERE` et les vérifications de clés étrangères.

## Backend

- Travail lent dans la requête HTTP qui devrait partir dans une file (email, PDF, webhooks, imports, appels IA). Vérifier si une outbox/file existe déjà et n'est pas utilisée partout.
- Worker : envois séquentiels, un fournisseur lent bloque le lot ; absence de regroupement quand l'API tierce accepte des lots.
- Polling (client ou worker) : fréquence vs utilité, coût de chaque cycle (une requête ou une opération réseau externe ?).
- Réponses sans compression ; JSON surdimensionné.
- Rate limiting et caches en mémoire locale : valables pour une seule instance. À signaler si plusieurs instances sont prévues.
- Fichiers volumineux chargés entièrement en mémoire au lieu d'être streamés.

## Cache

- Ce qui est lu souvent et change rarement (référentiels, réglages, droits calculés) sans cache.
- Cache sans stratégie d'invalidation, ou clés qui ne tiennent pas compte de l'utilisateur/tenant.
- En-têtes HTTP : `Cache-Control` absent sur l'API (risque qu'un proxy garde la donnée d'un utilisateur) ; assets hachés sans `immutable` ; `index.html` mis en cache long.

## Client (web et mobile)

- Cascade réseau : données chargées après le code de la page, puis après l'authentification, en série.
- Données relues à chaque montage d'écran (pas de `staleTime` ou équivalent).
- Longues listes non virtualisées.
- Dépendances lourdes (graphiques, calendrier, éditeur riche, PDF, cartes) dans le bundle initial ou dans le chunk d'une page entière au lieu d'être chargées à la demande.
- Images non optimisées (PNG lourds affichés en petit, pas de dimensions).

## Observabilité

- Aucune mesure = premier constat du plan de mesure, pas un constat de performance en soi.
- Jeu de données de dev trop petit pour que les mesures soient parlantes : le dire explicitement.

## Pièges de calibrage à éviter

- Remonter un parcours de table de 500 lignes en priorité haute.
- Proposer Redis ou une vue matérialisée avant d'avoir corrigé index, N+1 et pagination.
- Proposer un changement de stack ou de framework : hors périmètre d'un audit de performance.
