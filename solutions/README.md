# Solutions — don't peek first

This directory holds completed versions of workflows 04–08 plus the answer
to the script-injection exercise in workflow 03.

**Use these as a check, not a head start.** The whole point of the lab is
muscle memory: type the YAML yourself, push, watch it fail, fix it, push
again. Then compare your file with the one here.

When you do peek, diff your file against the solution to see what you missed:

```bash
diff -u .github/workflows/04-conditionals.yml solutions/04-conditionals.yml
```

Files:

- `04-conditionals.yml` — all three TODOs filled in
- `05-jobs-dag.yml`     — build / deploy / notify jobs added
- `06-matrix.yml`       — 27 → 6 via `exclude:`, plus dynamic matrix
- `07-reusable-called.yml` — dry_run input, outputs block, job outputs
- `08-reusable-caller.yml` — `uses:` + `with:` + `secrets: inherit`, output consumed
- `03-contexts-fix.md`  — the script-injection fix explained
