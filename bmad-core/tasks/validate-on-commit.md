# Validator Task: Validate on Commit

**Task ID:** validator-validate-commit
**Agent:** Validator
**Category:** Git Integration
**When to Use:** Pre-commit hook validation

---

## Purpose

Validate changed artifacts before git commit.

---

## Process

```bash
# Git hook: .git/hooks/pre-commit
#!/bin/bash

# Get changed files
FILES=$(git diff --cached --name-only --diff-filter=ACM)

# Validate each
for file in $FILES; do
  if [[ $file == docs/* ]]; then
    bmad validator validate-artifact --artifact $file
    if [ $? -ne 0 ]; then
      echo "Validation failed for $file"
      exit 1
    fi
  fi
done

echo "All validations passed ✅"
```

---

**Gate commits with validation.**
