# Script-injection fix for workflow 03

## The vulnerable step

```yaml
- name: DANGEROUS - echo user input via interpolation
  run: |
    echo "user said: ${{ inputs.free_text }}"
```

## Why it's broken

`${{ inputs.free_text }}` is evaluated by the runner BEFORE the shell starts.
The runner pastes the literal value of `free_text` into the script. If a user
passes `"; echo PWNED; #` as `free_text`, the runner produces this script:

```bash
echo "user said: "; echo PWNED; #"
```

The shell sees three statements: a harmless `echo`, then `echo PWNED` (the
attacker's payload), then a comment. The attacker runs arbitrary commands on
the runner — with whatever permissions the workflow has, including
`GITHUB_TOKEN` access.

The class is the same as SQL injection: untrusted data being concatenated
into code at the wrong layer.

## The fix

Route attacker-controlled values through an environment variable. The shell
sees a variable expansion (`$USER_INPUT`), which is treated as data, not
code:

```yaml
- name: SAFE - echo user input via env
  env:
    USER_INPUT: ${{ inputs.free_text }}
  run: |
    echo "user said: $USER_INPUT"
```

Now if `USER_INPUT` is `"; echo PWNED; #`, the shell expands it inside a
quoted string and `echo` prints the literal text. No command runs.

## Tips for spotting this in code review

Any `${{ ... }}` inside a `run:` block whose value comes from outside the
workflow author's control is suspect. Common sources:

- `github.event.pull_request.title` / `body` / `head.ref`
- `github.event.issue.title` / `body`
- `github.event.commits[*].message`
- `inputs.*` (workflow_dispatch / workflow_call)
- `github.head_ref`
- anything from `repository_dispatch` payloads

Allow-list:

- `secrets.*` and `vars.*` are author-controlled (still mask secrets).
- `github.sha`, `github.run_id`, etc. are runner-generated.
- `github.ref` is controllable for branch-name injection — be careful.

When in doubt, use the env-var passthrough.
