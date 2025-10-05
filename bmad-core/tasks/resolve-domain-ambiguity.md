# Oracle Task: Resolve Domain Ambiguity

**Task ID:** oracle-resolve-ambiguity
**Agent:** Oracle
**Category:** Domain Clarification
**When to Use:** When terminology or domain concepts are unclear, inconsistent, or ambiguous

---

## Purpose

Resolve ambiguities in domain understanding by:
- Clarifying ambiguous terminology
- Distinguishing similar concepts
- Defining boundaries between overlapping terms
- Creating canonical definitions for unclear concepts

**Goal:** Ensure every domain term has ONE clear, unambiguous meaning.

---

## Context

You are the Oracle agent. Domain truth must be precise, but humans use language ambiguously. Terms can mean different things in different contexts, or different terms can mean the same thing. Your job is to clarify and canonicalize.

**Example ambiguities:**
- "session" vs "login" vs "connection" - same thing?
- "user" in authentication context vs "user" in billing context - different?
- "token expiry" vs "session timeout" - related how?

---

## Inputs Required

1. **Ambiguous term or concept**
2. **Context** (where ambiguity was found)
3. **Conflicting usages** (examples of inconsistent use)
4. **Domain truth file** (`domain-truth.yaml`)

**Optional:**
- **Domain expert consultation** (human input)
- **Existing terminology map** (`terminology-map.yaml`)

---

## Ambiguity Resolution Process

### Step 1: Identify Ambiguity Type

#### Type 1: Synonym Ambiguity
Different words for same concept:

```yaml
ambiguity_type: "synonym_confusion"
terms:
  - "session"
  - "login"
  - "connection"
  - "authentication state"

question: "Are these the same thing?"

evidence:
  prd_line_42: "User session expires after 15 minutes"
  architecture_line_78: "Login state maintained in Redis"
  story_line_23: "Connection timeout after inactivity"

analysis: "All refer to authenticated user state"
```

#### Type 2: Homonym Ambiguity
Same word, different meanings:

```yaml
ambiguity_type: "homonym_confusion"
term: "user"

usages:
  context_1:
    location: "authentication section"
    meaning: "Person with login credentials"

  context_2:
    location: "billing section"
    meaning: "Account owner (may differ from logged-in person)"

  context_3:
    location: "API documentation"
    meaning: "API client application (not a person)"

question: "Does 'user' mean the same thing everywhere?"
```

#### Type 3: Boundary Ambiguity
Unclear where one concept ends and another begins:

```yaml
ambiguity_type: "boundary_confusion"
concepts:
  - "user"
  - "visitor"
  - "guest"

question: "What's the difference?"

unclear_cases:
  - "Is someone who created account but hasn't logged in a 'user' or 'visitor'?"
  - "Is someone using free trial a 'user' or 'guest'?"
  - "Is someone logged out a 'visitor' again?"

need: "Clear boundaries for each term"
```

#### Type 4: Granularity Ambiguity
Concept needs subdivision:

```yaml
ambiguity_type: "granularity_insufficient"
term: "error"

problem: "Too broad, needs subcategories"

proposed_subdivisions:
  - "validation_error" (user input wrong)
  - "system_error" (server problem)
  - "integration_error" (external service failed)

need: "Define each error type precisely"
```

### Step 2: Gather Evidence

Collect all usages:

```yaml
evidence_collection:
  term: "session"

  usages_found:
    - artifact: "prd.md"
      line: 42
      context: "User session expires after 15 minutes"
      meaning_implied: "Authentication state with timeout"

    - artifact: "architecture.md"
      line: 78
      context: "Session data stored in Redis"
      meaning_implied: "Server-side storage of user state"

    - artifact: "story-1.1.md"
      line: 15
      context: "User creates session by logging in"
      meaning_implied: "Authenticated connection"

  inconsistencies:
    - "Sometimes 'session' means authentication token"
    - "Sometimes 'session' means server-side data storage"
    - "Unclear if session = JWT token or session = Redis record"
```

### Step 3: Define Resolution Strategy

#### Strategy A: Canonicalize Synonym

Pick ONE term as canonical:

```yaml
resolution_strategy: "canonicalize_synonym"

decision:
  canonical_term: "session"
  definition: "User authentication state with defined timeout (15 minutes)"

  forbidden_alternatives:
    - "login" → use "session"
    - "connection" → use "session"
    - "authentication state" → use "session" (except in technical specs)

  rationale: "Session is most common in web development, clear meaning"

  migration:
    - Replace "login state" with "session" in all artifacts
    - Update terminology-map.yaml
    - Run terminology consistency check
```

#### Strategy B: Distinguish Homonyms

Create context-specific definitions:

```yaml
resolution_strategy: "distinguish_homonyms"

term: "user"

resolutions:
  - context: "authentication"
    canonical_term: "authenticated_user"
    definition: "Person currently logged in with valid credentials"

  - context: "billing"
    canonical_term: "account_owner"
    definition: "Person who owns the account (may differ from logged-in user)"

  - context: "API"
    canonical_term: "api_client"
    definition: "Application consuming the API (not a human)"

migration:
  - Replace ambiguous "user" with specific term based on context
  - Update domain-truth.yaml with all three definitions
```

#### Strategy C: Define Boundaries

Create clear distinction rules:

```yaml
resolution_strategy: "define_boundaries"

concepts:
  - term: "user"
    definition: "Person with account credentials (registered and activated)"
    boundaries:
      - "Has account in database"
      - "Has verified email"
      - "Can authenticate"

  - term: "visitor"
    definition: "Person browsing site without authentication"
    boundaries:
      - "No account OR not currently logged in"
      - "Cannot access authenticated features"

  - term: "guest"
    definition: "Person using limited trial without full registration"
    boundaries:
      - "Has limited-time access token"
      - "No email verification required"
      - "Cannot access full features"

decision_tree:
  - question: "Has account?"
    no: "visitor"
    yes: "Is authenticated?"
      no: "visitor"
      yes: "user"
```

#### Strategy D: Subdivide Concept

Create precise subcategories:

```yaml
resolution_strategy: "subdivide_concept"

broad_term: "error"

subcategories:
  - term: "validation_error"
    definition: "User input failed validation rules"
    http_status: 400
    example: "Email format invalid"

  - term: "system_error"
    definition: "Server encountered unexpected problem"
    http_status: 500
    example: "Database connection failed"

  - term: "integration_error"
    definition: "External service call failed"
    http_status: 502
    example: "Payment gateway timeout"

canonical_usage:
  - Use specific term, not generic "error"
  - "validation_error" in input handling
  - "system_error" in server issues
  - "integration_error" in external calls
```

### Step 4: Update Domain Truth

Add resolution to `domain-truth.yaml`:

```yaml
# domain-truth.yaml

terminology:
  "session":
    definition: "User authentication state with defined timeout (15 minutes)"
    canonical: true
    alternatives_forbidden:
      - "login"
      - "connection"
      - "auth state"
    rationale: "Standardize on 'session' for clarity"

ambiguity_resolutions:
  - resolution_id: "AMB-001"
    date: "2025-10-04"
    term: "session"
    ambiguity: "Multiple terms used for authentication state (session, login, connection)"
    resolution: "Canonical term is 'session'; forbid alternatives"
    decision_rationale: "Session is standard web development term"
```

Update `terminology-map.yaml`:

```yaml
# terminology-map.yaml

ambiguity_resolutions:
  - term: "session"
    ambiguity: "Synonym confusion: session vs login vs connection"
    resolution: "Use 'session' exclusively"
    use_when: "Referring to authenticated user state"
    avoid_when: "Never use 'login state' or 'connection'"
    decided_date: "2025-10-04"
    source: "domain-truth.yaml#ambiguity_resolutions"
```

### Step 5: Propagate Resolution

Trigger updates across artifacts:

```yaml
propagation:
  - artifact: "prd.md"
    action: "Replace 'login' with 'session'"
    agent: "pm"

  - artifact: "architecture.md"
    action: "Replace 'connection' with 'session'"
    agent: "architect"

  - run: "check-terminology-consistency"
    to_verify: "All alternatives replaced"
```

---

## Output Format

**Resolution Document:** `docs/domain-truth-resolutions/AMB-{{id}}.md`

```markdown
# Ambiguity Resolution: AMB-001

**Date:** 2025-10-04
**Term:** session
**Type:** Synonym Confusion

## Ambiguity
Multiple terms used for authentication state:
- "session" (prd.md:42)
- "login state" (architecture.md:78)
- "connection" (story-1.1.md:15)

## Resolution
**Canonical Term:** session

**Definition:**
User authentication state with defined timeout (15 minutes)

**Forbidden Alternatives:**
- login → use "session"
- connection → use "session"
- auth state → use "session"

## Rationale
"Session" is standard web development terminology, widely understood, and unambiguous in authentication context.

## Migration
1. ✅ Update domain-truth.yaml
2. ⏳ Update prd.md (no changes needed - already uses "session")
3. ⏳ Update architecture.md (replace "login state" → "session")
4. ⏳ Update story-1.1.md (replace "connection" → "session")
5. ⏳ Run terminology consistency check

## Validation
Run: `bmad oracle check-terminology`
```

---

## Success Criteria

- [ ] Ambiguity clearly identified and categorized
- [ ] Resolution defined with canonical term
- [ ] Boundaries or distinctions clarified
- [ ] Domain truth updated
- [ ] Terminology map updated
- [ ] Migration plan created
- [ ] Artifacts updated to use canonical terms

---

## Examples

### Example 1: Resolve Synonym Ambiguity

**Input:**
```yaml
Ambiguity: "session" vs "login" vs "connection"
Context: Authentication domain
Evidence: Used interchangeably in PRD and Architecture
```

**Resolution:**
```markdown
Canonical: session
Forbidden: login, connection
Rationale: Standard term
Action: Replace all alternatives with "session"
```

### Example 2: Resolve Homonym Ambiguity

**Input:**
```yaml
Ambiguity: "user" means different things in different contexts
Contexts: authentication, billing, API
```

**Resolution:**
```markdown
Create three distinct terms:
- authenticated_user (authentication context)
- account_owner (billing context)
- api_client (API context)

Update all artifacts to use context-specific term.
```

---

## Integration Points

**Called by:**
- Oracle `validate-artifact-against-truth` (when ambiguity detected)
- Oracle `check-terminology-consistency` (when inconsistency found)
- User (manual ambiguity resolution request)

**Triggers:**
- `update-domain-truth` (add resolution to canonical truth)
- `check-terminology-consistency` (validate resolution propagated)

---

## Command Signature

```bash
bmad oracle resolve-ambiguity \
  --term "session" \
  --type synonym \
  --context "authentication" \
  --strategy canonicalize
```

---

**Clear definitions eliminate confusion. One term, one meaning.**
