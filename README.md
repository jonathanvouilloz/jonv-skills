# jonv-skills

**English** | [Français](README.fr.md)

Agent skills I use to build business web apps for clients, published so others can use them too. Each skill is a folder with a `SKILL.md` and its references, compatible with Claude Code and other agents that support the SKILL.md format.

## Skills

| Skill | What it does | Status |
|---|---|---|
| [perf-audit](skills/perf-audit/) | Read-only performance audit of a business web app (database, ORM, backend, cache, web, mobile). Writes a prioritized report with quick wins and P1/P2/P3 priorities. Never modifies code. | Stable — v1.0.0 |

## Install

Install one skill with the skills CLI:
```bash
npx skills add jonathanvouilloz/jonv-skills --skill perf-audit
```

Or add the whole collection as a Claude Code plugin marketplace:
```
/plugin marketplace add jonathanvouilloz/jonv-skills
/plugin install perf-audit@jonv-skills
```

Or copy a folder from `skills/` into `~/.claude/skills/` (all projects) or `.claude/skills/` (one project).

## Versioning

Each skill is versioned on its own: see its `CHANGELOG.md`. Releases are tagged `<skill>@<version>`, for example `perf-audit@1.0.0`.

## Repository layout

```
skills/<name>/        one folder per skill: SKILL.md, README.md, README.fr.md, CHANGELOG.md,
                      plus optional references/, scripts/, examples/
template/             starting point for a new skill
.claude-plugin/       marketplace.json, one plugin entry per skill
```

## Adding a skill

1. `cp -r template skills/<name>` and replace `skill-name` everywhere (the `name:` in `SKILL.md` must match the folder).
2. Add an entry to `plugins` in `.claude-plugin/marketplace.json` with `"skills": ["./skills/<name>"]`.
3. Add a row to the Skills table in `README.md` and `README.fr.md`.
4. Commit, then tag `<name>@1.0.0`.

## Contributing

Issues and pull requests are welcome, especially feedback from real audits on stacks I use less (.NET, JVM, PHP, Rails).

## License

MIT
