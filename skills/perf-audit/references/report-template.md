# Modèle du rapport PERF_AUDIT.md

Respecter l'ordre des sections. Supprimer une section seulement si elle est vide, en le disant en une ligne.

```markdown
# Audit de performance — <nom du projet>

Audit en lecture seule du <date>, commit `<hash court>` (si dépôt git). Aucun fichier de code modifié.
Périmètre : <apps/packages audités>. Hors périmètre : <ce qui n'a pas été regardé et pourquoi>.

## Contexte et calibrage

- **Stack** : <runtime, framework, ORM, base, cache, worker, web, mobile, hébergement prévu>
- **Volumes lus** : <table: lignes, taille> (source : base de dev `<nom>`) — ou « non mesurés : aucune base joignable »
- **Volumes visés** : <si connus, sinon renvoi aux questions ouvertes>
- **Instrumentation existante** : <APM, pg_stat_statements, logs de durée… ou « aucune »>
- **Lecture du risque** : <une ou deux phrases : à ce volume, le risque dominant est-il le blocage, la lenteur ou la croissance ?>

## Priorités

### P1 — À faire maintenant
1. **<titre court>** — <une phrase : pourquoi c'est P1>. (§<n>)
2. …

### P2 — Prochain cycle
- **<titre>** — <une phrase>. (§<n>)

### P3 — À planifier ou à surveiller
- **<titre>** — <une phrase, avec le seuil de volume si c'est un problème de croissance>. (§<n>)

## Quick wins (dans l'ordre)

1. <action concrète> — <effort estimé> — (§<n>)
2. …

## Tableau des constats

Trié par priorité, puis par impact décroissant.

| # | Prio | Domaine | Problème | Emplacement | Nature | Impact | Effort | Risque correctif | Statut |
|---|---|---|---|---|---|---|---|---|---|
| 1 | P1 | Base | … | `chemin:ligne` | Blocage | Élevé | Faible | Faible | constaté |

Nature : Blocage / Lenteur / Croissance / Coût.

## Détail des constats

### <n>. <titre>
- **Constat** : ce qui est fait aujourd'hui, avec emplacement.
- **Pourquoi ça pèse** : mécanisme, multiplicateur, et à partir de quel volume ça devient visible.
- **Correctif proposé** : extrait de code ou SQL minimal.
- **Mesurer avant/après** : commande exacte.
- **Effets de bord et risques** : ce que le correctif peut casser, tests nécessaires.

## Chantiers structurels

Pour chaque chantier : objectif, constats regroupés, prérequis (tests, contrat d'API, déploiement), ordre conseillé.

## Plan de mesure

Ce qu'il faut instrumenter, dans l'ordre, pour que les prochaines décisions reposent sur des mesures :
1. Jeu de données réaliste (seed ×10 ou volume à N saisons/clients).
2. Base : pg_stat_statements, log des requêtes lentes.
3. API : durée par route, latence de l'event loop (ou équivalent runtime).
4. Charge : outil et routes ciblées.
5. Frontend : Lighthouse/LCP sur les pages clés, visualiseur de bundle, budget en CI.

## Écartés

Points vus mais volontairement non retenus au volume visé (une ligne chacun, avec la raison).

## Questions ouvertes

Informations manquantes qui changeraient une priorité. Incohérences doc/code relevées.
```

## Règles de rédaction

- Phrases courtes, vocabulaire précis, pas de remplissage.
- Un correctif = le plus petit changement qui supprime le problème. Mentionner l'alternative structurelle seulement si elle change la décision.
- Ne jamais présenter un constat suspecté comme certain.
- Quand le code contient déjà un commentaire qui reconnaît le problème (`TODO`, `shortcut:`, `HACK`), le citer : ça confirme et ça date la dette.
