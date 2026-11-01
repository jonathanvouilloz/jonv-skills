# jonv-skills

[English](README.md) | **Français**

Les skills d'agent que j'utilise pour créer des applications web métier pour mes clients, publiés pour que d'autres puissent s'en servir. Chaque skill est un dossier avec un `SKILL.md` et ses références, compatible avec Claude Code et les autres agents qui lisent le format SKILL.md.

## Skills

| Skill | Ce qu'il fait | Statut |
|---|---|---|
| [perf-audit](skills/perf-audit/README.fr.md) | Audit de performance en lecture seule d'une app web métier (base, ORM, backend, cache, web, mobile). Écrit un rapport priorisé avec quick wins et priorités P1/P2/P3. Ne modifie jamais le code. | Stable — v1.0.0 |

## Installation

Installer un skill avec le CLI skills :
```bash
npx skills add jonathanvouilloz/jonv-skills --skill perf-audit
```

Ou ajouter toute la collection comme marketplace de plugins Claude Code :
```
/plugin marketplace add jonathanvouilloz/jonv-skills
/plugin install perf-audit@jonv-skills
```

Ou copier un dossier de `skills/` dans `~/.claude/skills/` (tous les projets) ou `.claude/skills/` (un projet).

## Versions

Chaque skill a sa propre version : voir son `CHANGELOG.md`. Les versions sont taguées `<skill>@<version>`, par exemple `perf-audit@1.0.0`.

## Organisation du repo

```
skills/<nom>/         un dossier par skill : SKILL.md, README.md, README.fr.md, CHANGELOG.md,
                      plus references/, scripts/, examples/ si besoin
template/             point de départ d'un nouveau skill
.claude-plugin/       marketplace.json, une entrée plugin par skill
```

## Ajouter un skill

1. `cp -r template skills/<nom>` puis remplacer `skill-name` partout (le `name:` du `SKILL.md` doit égaler le nom du dossier).
2. Ajouter une entrée dans `plugins` de `.claude-plugin/marketplace.json` avec `"skills": ["./skills/<nom>"]`.
3. Ajouter une ligne au tableau Skills de `README.md` et `README.fr.md`.
4. Commit, puis tag `<nom>@1.0.0`.

## Contribuer

Issues et pull requests bienvenues, en particulier les retours d'audits réels sur les stacks que j'utilise moins (.NET, JVM, PHP, Rails).

## Licence

MIT
