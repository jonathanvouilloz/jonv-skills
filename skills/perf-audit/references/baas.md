# Backends managés : Convex, Supabase, Firebase

## Convex

Convex a un modèle très différent d'une base SQL : requêtes en TypeScript, réactivité (chaque requête abonnée se réexécute quand une donnée lue change), transactions optimistes.

**Il existe un skill officiel** `convex-performance-audit` (dépôt `get-convex/agent-skills`). S'il est installé, l'utiliser pour la partie Convex et intégrer ses constats dans ce rapport. S'il ne l'est pas, le recommander dans le rapport et appliquer les points ci-dessous.

- **`.filter()` ne réduit pas le parcours** : il évalue chaque document de la plage. Toute requête sur une table qui grossit doit passer par `.withIndex(...)`. Constat type : `ctx.db.query("x").filter(...)` sur une table de plus de quelques centaines de documents.
- **`.collect()` sans borne** sur une table qui grossit → `.take(n)` ou `.paginate()`.
- **Index composites** : l'ordre des champs compte comme en SQL (égalité d'abord, plage ensuite). Limite de 32 index par table.
- **Réactivité trop large** : une requête qui lit beaucoup de documents (ou un document très modifié, comme un compteur global) se réexécute pour tous les abonnés à chaque écriture. Découper les requêtes, lire seulement ce qui est affiché, isoler les champs très volatils dans un document à part.
- **Contention d'écriture** (conflits OCC) : plusieurs mutations qui écrivent le même document (compteur, agrégat) → compteur réparti ou composant Aggregate de Convex.
- **N+1** : `Promise.all(ids.map(id => ctx.db.get(id)))` reste acceptable pour des listes bornées ; à surveiller sur des listes longues ou imbriquées.
- **Actions** : appels externes dans des actions, jamais dans des mutations ; action qui enchaîne beaucoup de `runQuery`/`runMutation` = plusieurs transactions et allers-retours.
- Limites d'exécution (documents lus, octets, durée) : un dépassement est une erreur en production, pas seulement une lenteur.
- Mesurer : dashboard Convex (durée des fonctions, documents lus, logs), `npx convex insights` si disponible dans la version utilisée.

## Supabase

C'est PostgreSQL : appliquer `db-postgresql.md` et les scripts. Spécificités :

- **RLS** : les politiques s'exécutent pour chaque ligne. Écrire `(select auth.uid()) = user_id` plutôt que `auth.uid() = user_id` (évaluation unique), indexer les colonnes utilisées dans les politiques, éviter les jointures dans les politiques (fonction `security definer` ou colonne dénormalisée).
- **PostgREST / client JS** : `select('*')` dans les listes ; ressources imbriquées profondes ; absence de `.range()`.
- **Connexions** : depuis du serverless, passer par le pooler (Supavisor) en mode transaction ; les requêtes préparées ne sont pas compatibles avec ce mode selon le driver.
- **Realtime** : abonnements sur des tables entières au lieu de filtres ; chaque changement est diffusé à tous les abonnés.
- **Edge Functions** : appels base multiples séquentiels, client créé à chaque appel.
- Mesurer : Performance Advisor et Index Advisor du dashboard, `pg_stat_statements` (activé par défaut).

## Firebase / Firestore

- Lectures facturées : listeners sur des collections larges, relectures complètes à chaque changement.
- Requêtes composées sans index composite (erreur) ou index trop nombreux (coût d'écriture).
- Dénormalisation volontaire pour éviter les lectures multiples ; compteurs distribués pour les écritures fréquentes sur un même document (limite d'environ une écriture par seconde et par document).
