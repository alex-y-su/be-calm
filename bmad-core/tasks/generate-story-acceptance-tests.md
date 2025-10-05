# Eval Task: Generate Story Acceptance Tests

**Task ID:** eval-generate-story-tests
**Agent:** Eval
**Category:** Story Testing

---

## Purpose

Generate acceptance test datasets for story based on acceptance criteria.

---

## Process

```yaml
story: "1.1 - Implement JWT Management"
acceptance_criteria:
  - "JWT token generated with 15-minute expiry"
  - "Token includes expiration timestamp"
  
test_datasets:
  - test_id: "STORY-1.1-T1"
    scenario: "Generate valid JWT"
    input: {username: "test@example.com", password: "pass"}
    expected:
      token: "<valid_jwt>"
      expiresIn: 900
      expiresAt: "<timestamp+900s>"
```

Output: `test-datasets/stories/story-1.1-tests.yaml`

---

**Stories validated empirically.**
