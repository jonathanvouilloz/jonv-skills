# Mobile React Native / Expo

## Données

- TanStack Query sans `staleTime` : relecture à chaque montage d'écran et à chaque retour au premier plan (si `focusManager` est branché sur `AppState`). Aligner sur le web (ex. 30 s) ou plus.
- Requêtes lancées au retour au premier plan pour tous les écrans montés en même temps (pile de navigation).
- Réponses API surdimensionnées : le réseau mobile et le parsing JSON sur le thread JS coûtent plus que sur desktop.
- Pas de cache persistant pour un démarrage rapide (persister le cache de requêtes si l'usage le justifie).

## Listes

- `ScrollView` + `.map()` sur une liste qui grossit (messages, notifications, historique) : tous les éléments restent montés. Correctif : `FlatList` (ou FlashList) avec `keyExtractor` stable, `getItemLayout` si hauteur fixe.
- Éléments de liste non mémoïsés, fonctions inline recréées à chaque rendu dans `renderItem`.

## Images

- `Image` de base sans cache disque → `expo-image` (cache, placeholders, formats modernes).
- Images servies en pleine résolution pour un affichage miniature : demander au backend une variante redimensionnée.

## Rendu et thread JS

- Calculs lourds (tri, formatage de grandes listes, parsing) sur le thread JS au montage d'un écran.
- Animations pilotées par le thread JS au lieu de Reanimated / `useNativeDriver`.
- Re-rendus provoqués par un état global qui change souvent (contexte, store) sans sélecteurs.

## Démarrage et bundle

- Moteur Hermes actif (défaut récent) ; New Architecture selon la version d'Expo.
- Imports lourds chargés au démarrage alors qu'ils servent à un écran secondaire.
- Taille des mises à jour OTA (EAS Update) : assets inclus dans chaque mise à jour.

## Mesurer

- Outil de performance de React Native DevTools / profiler React ; moniteur de performance (FPS JS et UI).
- Compter les requêtes dans les logs de l'API en naviguant entre les onglets.
- Tester sur un appareil Android d'entrée de gamme, pas seulement sur simulateur.
