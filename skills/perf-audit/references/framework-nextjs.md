# Next.js (App Router)

Lire aussi `runtime-node.md` (serveur) et `frontend-web.md` (client).

## Identifier le modèle de cache en vigueur

Le modèle de cache dépend de la version et de la configuration. **Lire `package.json` et `next.config.*` avant de juger.**

- **Next.js 16+ avec Cache Components** (`cacheComponents: true`, activé par défaut sur les nouveaux projets depuis 16.4) : tout est dynamique par défaut ; la mise en cache est explicite via la directive `'use cache'` (fichier, composant ou fonction), `cacheLife()` pour la durée et `cacheTag()` + `updateTag()`/`revalidateTag()` pour l'invalidation. Le rendu combine une coquille statique pré-rendue et des parties dynamiques sous `<Suspense>`.
- **Next.js 15** : `fetch` et les GET Route Handlers ne sont plus mis en cache par défaut ; `unstable_cache`, `revalidate` et `dynamic` par segment.
- **Next.js 14 et antérieur** : `fetch` mis en cache par défaut, beaucoup de comportements implicites.

## Points à auditer

- **Cascades dans les Server Components** : `await a(); await b();` séquentiels pour des données indépendantes, ou composants parents qui attendent avant que les enfants puissent lancer leurs requêtes. Correctif : `Promise.all`, ou découper en composants sous `<Suspense>` pour streamer.
- **Données lues souvent, communes à tous, jamais mises en cache** (référentiels, listes publiques, réglages) : candidates à `'use cache'` avec un tag d'invalidation.
- **Données utilisateur mises en cache par erreur** : `'use cache'` sur une fonction qui dépend d'un cookie/session (la clé ne tient compte que des arguments) ; ou ancienne configuration qui rend statique une page personnalisée.
- **Même requête répétée dans un rendu** (layout + page + composant) : `React.cache()` pour dédupliquer dans une requête.
- **Frontière `'use client'` trop haute** : un layout ou une page entière en client = tout son arbre envoyé en JS. Pousser `'use client'` vers les feuilles interactives.
- **Server Actions** : action qui revalide trop large (toute une route) ou trop souvent ; mutation suivie d'un rechargement complet des données.
- **Middleware** (renommé `proxy` dans Next.js 16) : exécuté sur chaque requête, y compris les assets s'il n'y a pas de `matcher` ; appel base ou réseau à l'intérieur = coût sur tout le site.
- **Connexions base en serverless** (Vercel, Lambda) : client créé par invocation sans pooler → saturation de `max_connections`. Utiliser un pooler (Supavisor, PgBouncer, pooler Neon) et un singleton de client.
- **Images et polices** : `next/image` avec `sizes` correct et `priority` sur l'image LCP ; `next/font` (auto-hébergement, pas de requête externe).
- **React Compiler** (stable avec Next 16) : réduit les re-rendus sans `useMemo` manuel ; noter s'il est activé ou non, sans en faire un constat prioritaire.

## Mesurer

- `next build` : taille des routes (First Load JS) affichée en sortie.
- `@next/bundle-analyzer` pour le détail des chunks.
- Lighthouse / PageSpeed sur les pages clés en production ; Speed Insights si hébergé chez Vercel.
