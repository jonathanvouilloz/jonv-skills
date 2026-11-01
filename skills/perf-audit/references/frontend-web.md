# Frontend web (SPA, méta-frameworks, PWA)

## Seuils de référence (Core Web Vitals, au 75e percentile)

LCP < 2,5 s · INP < 200 ms · CLS < 0,1. Pour une app métier derrière connexion, l'INP et le temps jusqu'aux données affichées comptent plus que le LCP de la page de connexion.

## Cascade de chargement (constat fréquent sur les SPA)

Séquence typique d'une SPA : HTML vide → JS d'entrée → vérification de session (`/me`) → montage de la page → ses requêtes de données → éventuellement des requêtes dépendantes. Chaque étape attend la précédente.

À chercher :
- Données chargées uniquement dans les composants (`useQuery`, `useEffect` + `fetch`) et jamais dans les loaders du routeur :
  - **TanStack Router** : `loader` avec `queryClient.ensureQueryData(...)` ; sans loader, `defaultPreload: 'intent'` ne précharge que le code, pas les données.
  - **React Router / Remix** : `loader`/`clientLoader`.
  - **SvelteKit** : fonctions `load` (exécutées en parallèle pour les layouts et la page) ; `await` séquentiels dans un `load` ou dépendances `await parent()` inutiles.
  - **Nuxt** : `useAsyncData`/`useFetch` avec clés stables ; `await` séquentiels dans `setup`.
- Requêtes enfants qui attendent la réponse du parent alors qu'elles pourraient partir en parallèle.
- Authentification vérifiée à chaque navigation sans cache.

## Client de données (TanStack Query, SWR, Apollo)

- `staleTime` par défaut à 0 dans TanStack Query : chaque montage et chaque retour sur l'onglet relancent la requête (`refetchOnWindowFocus` vrai par défaut). Fixer un `staleTime` global raisonnable (ex. 30 s) et plus long pour les référentiels.
- `refetchInterval` (polling) : vérifier la fréquence et ce que coûte chaque cycle côté serveur (simple lecture SQL ou opération externe comme IMAP, API tierce). Le polling s'arrête en arrière-plan par défaut (`refetchIntervalInBackground` faux).
- Invalidation trop large après une mutation (`invalidateQueries()` sans clé) = tout recharger.
- Mises à jour optimistes absentes sur les actions fréquentes (cocher, valider, répondre).

## Bundle

- Découpage par route actif ? (Vite le fait pour les imports dynamiques ; TanStack Router `autoCodeSplitting`, Next/SvelteKit/Nuxt par défaut.)
- Dépendances lourdes importées en statique : graphiques (recharts, chart.js), calendrier (FullCalendar), éditeur riche (TipTap, Lexical), PDF, cartes, export Excel. Correctif : `React.lazy`/`import()` sur le composant qui les utilise (onglet, modale), pas seulement sur la route.
- **Mesurer avant de recommander** : build frais + `rollup-plugin-visualizer` (Vite) ou analyseur du framework. Si le `dist/` présent est ancien, le dire et marquer le constat « suspecté ».
- Bibliothèques de dates, d'icônes, lodash importées en entier.

## Rendu

- Longues listes et grands tableaux sans virtualisation (TanStack Virtual, react-window).
- Contextes React qui changent souvent et re-rendent tout l'arbre ; calculs lourds dans le rendu.
- Animations sur `top/left/width` au lieu de `transform/opacity`.

## PWA et service des fichiers

- Pas de service worker : chaque lancement de la PWA retélécharge les assets. `vite-plugin-pwa` (`generateSW`) pour précacher les assets hachés. Risque à signaler : gestion des mises à jour (proposer « nouvelle version disponible », ne jamais servir un vieil `index.html` face à une nouvelle API).
- En-têtes : `/assets/*` hachés en `public, max-age=31536000, immutable` ; `index.html` en `no-cache` ; compression Brotli/gzip. Vérifier qui sert les fichiers (CDN, proxy, serveur Node) et si c'est configuré ou seulement prévu.

## Images et polices

- PNG/JPEG lourds affichés en petit (logos, filigranes, avatars) → SVG pour les logos, WebP/AVIF aux bonnes dimensions.
- `width`/`height` absents (CLS) ; pas de `loading="lazy"` sous la ligne de flottaison ; image principale sans `fetchpriority="high"`.
- Polices externes (Google Fonts) → auto-hébergées en WOFF2, sous-ensemble, `font-display: swap`.

## Mesurer

- Lighthouse en mode mobile sur 2-3 pages clés connectées (et l'onglet Network pour visualiser la cascade).
- Visualiseur de bundle sur un build frais ; budget de taille d'entrée en CI.
- RUM (web-vitals, Sentry, Speed Insights) une fois en production.
