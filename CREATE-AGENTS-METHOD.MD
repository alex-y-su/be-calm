# BMAD Agent Creation Methodology

## Phase 1: Discovery & Requirements

### Step 1.1: Identify Agent Purpose & Position
**Questions to Answer:**
- What problem does this agent solve?
- Where in the BMAD workflow does it fit?
- Which agent(s) does it run after?
- Which agent(s) consume its output?

**Deliverable:** Purpose statement (1-2 sentences)

---

### Step 1.2: Define Inputs & Outputs
**Inputs:**
- What documents does it read?
- What configuration does it need?
- What context from previous agents?

**Outputs:**
- What artifacts does it create?
- What format?
- Where are outputs stored?

**Deliverable:** Input/Output matrix

---

### Step 1.3: Identify Technical Constraints
**Questions to Consider:**
- Scale constraints? (context limits, memory, file size)
- Tool requirements? (bash, external scripts, APIs)
- Format preferences? (YAML, JSON, CSV, Markdown)
- Performance needs? (seconds vs minutes vs hours)
- Special capabilities? (code execution, web search, image generation)

**Deliverable:** List of constraints + proposed solutions

---

## Phase 2: Architecture Design

### Step 2.1: Study Existing BMAD Agent Patterns
**Actions:**
1. Read 2-3 existing similar agents from `bmad-core/agents/`
2. Identify structural patterns (activation, persona, commands, dependencies)
3. Note how similar agents handle their domain
4. Understand task execution patterns from `bmad-core/tasks/`

**Deliverable:** Pattern template aligned with BMAD conventions

---

### Step 2.2: Design Agent Persona & Commands
**Agent Persona:**
- Name (human name)
- Role (primary function)
- Style (communication approach)
- Core Principles (5-10 guiding rules)

**Command Design:**
- Main command (primary workflow)
- Sub-commands (individual capabilities)
- Utility commands (`*help`, `*exit`)

**Deliverable:** Agent YAML structure (agent + persona + commands)

---

### Step 2.3: Decompose Main Workflow into Tasks
**Decomposition Strategy:**

1. **Start with end goal** (what success looks like)

2. **Work backwards:**
   - What must happen immediately before the goal?
   - What enables that?
   - What must happen first?

3. **Group related steps:**
   - Each task = single responsibility
   - Tasks should be 150-300 lines
   - Tasks can call other tasks

4. **Map dependencies:**
   - Sequential vs parallel execution
   - Data flow between tasks

**Deliverable:** Task dependency graph

---

### Step 2.4: Identify Required Templates & Data Files
**Templates:**
- What structured outputs are created?
- What variable placeholders are needed?
- What AI guidance is required?

**Data/Knowledge Files:**
- What domain knowledge is needed?
- What best practices should be encoded?
- What reference data is required?

**Deliverable:** List of supporting files with purpose

---

## Phase 3: Implementation

### Step 3.1: Create Agent Definition File
**File:** `bmad-core/agents/{agent-id}.md`

**Structure:**
```markdown
<!-- Powered by BMAD™ Core -->

# {agent-id}

[Standard activation notices]

```yaml
IDE-FILE-RESOLUTION: [copy from existing agent]
REQUEST-RESOLUTION: [copy from existing agent]
activation-instructions: [copy from existing agent, customize if needed]

agent:
  name: [Human Name]
  id: [agent-id]
  title: [Professional Title]
  icon: [emoji]
  whenToUse: [1-2 line description]
  customization: null

persona:
  role: [Primary Role]
  style: [Communication Style]
  identity: [Specialist Identity]
  focus: [Key Focus Areas]
  core_principles: [5-10 principles as list]

commands: [List with descriptions]

dependencies:
  tasks: [*.md files]
  templates: [*.yaml files]
  data: [*.md files]
```
```

**Deliverable:** Agent definition file

---

### Step 3.2: Create Task Files

**For Each Task:**

**File:** `bmad-core/tasks/{task-name}.md`

**Template:**
```markdown
<!-- Powered by BMAD™ Core -->

# {Task Name} Task

## Purpose
[What this task does and why]

## Input Parameters
[List expected inputs]

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. [Load Configuration/Initialize]
- Load `{root}/core-config.yaml`
- Extract relevant settings
- Prepare context

### 2-N. [Core Steps]
[Numbered hierarchically: 2, 2.1, 2.2, 3, 3.1...]

### Final. [Summary & Return]
#### Generate Summary
[Present results to user]

#### Return Status
[SUCCESS/FAILED with context]

## Error Handling
[Error scenarios and resolutions]

## Success Criteria
[Checklist of completion criteria]
```

**Key Patterns:**
- Always load config first
- Use "SEQUENTIAL Task Execution" heading
- Number steps hierarchically
- Include user presentation
- Include error handling
- Include success criteria

**Deliverable:** All task files

---

### Step 3.3: Create Template Files

**For Each Template:**

**File:** `bmad-core/templates/{template-name}.yaml`

**Structure:**
```yaml
[[LLM: Instructions for populating this template]]

field1: {{placeholder1}}
field2: {{placeholder2}}
nested:
  field3: {{placeholder3}}
```

**Guidelines:**
- `{{placeholder}}` for variables
- `[[LLM: ...]]` for AI instructions
- Match expected output structure

**Deliverable:** All template files

---

### Step 3.4: Create Data/Knowledge Files

**For Each Knowledge File:**

**File:** `bmad-core/data/{knowledge-name}.md`

**Structure:**
```markdown
# {Topic}

## {Section}
[Patterns, rules, best practices]

## Examples
[Concrete examples]
```

**Deliverable:** All data files

---

## Phase 4: Validation & Integration

### Step 4.1: Self-Review Checklist
**Agent Definition:**
- [ ] All commands documented
- [ ] All dependencies exist
- [ ] `{root}` used consistently
- [ ] whenToUse is clear

**Tasks:**
- [ ] Main orchestrator exists
- [ ] All sub-tasks exist
- [ ] Error handling defined
- [ ] Success criteria listed
- [ ] User feedback included

**Templates & Data:**
- [ ] All placeholders documented
- [ ] Examples included
- [ ] Complete and actionable

---

### Step 4.2: Dependency Verification
**Verify:**
1. All `dependencies.tasks` files exist
2. All `dependencies.templates` files exist
3. All `dependencies.data` files exist
4. All task references resolve
5. All template/data references resolve

**Deliverable:** Verified dependency graph

---

### Step 4.3: Agent Testing Strategy
**Define test scenarios based on agent type:**

**For Data/Document Generators:**
- Happy path: Standard workflow
- Edge cases: Minimal/maximal input
- Errors: Missing dependencies, invalid data

**For Analysis/Planning Agents:**
- Happy path: Clear requirements
- Edge cases: Ambiguous input, complex scenarios
- Errors: Incomplete information, conflicting constraints

**For Communication/Coordination Agents:**
- Happy path: Standard stakeholder needs
- Edge cases: Multiple stakeholders, conflicting interests
- Errors: Missing context, unavailable information

**For Validation/QA Agents:**
- Happy path: Valid artifacts to check
- Edge cases: Edge cases in artifacts
- Errors: Missing artifacts, invalid formats

**Deliverable:** Test scenarios appropriate for agent type

---

## Phase 5: Documentation & Handoff

### Step 5.1: Update Team Configurations
**Add agent to relevant teams:**
1. Identify which teams need this agent
2. Add to team `agents` list
3. Update team description if needed

---

### Step 5.2: Build Distribution
```bash
npm run build:agents
npm run build:teams
```

**Verify outputs in `dist/`**

---

## Universal Agent Creation Checklist

### Phase 1: Discovery ✓
- [ ] Purpose & workflow position defined
- [ ] Inputs/outputs identified
- [ ] Technical constraints addressed

### Phase 2: Architecture ✓
- [ ] Existing patterns studied
- [ ] Persona & commands designed
- [ ] Tasks decomposed with dependencies
- [ ] Supporting files identified

### Phase 3: Implementation ✓
- [ ] Agent definition created
- [ ] Task files created
- [ ] Template files created
- [ ] Knowledge files created

### Phase 4: Validation ✓
- [ ] Self-review completed
- [ ] Dependencies verified
- [ ] Test strategy defined

### Phase 5: Integration ✓
- [ ] Teams updated
- [ ] Distribution built

---

## Universal Patterns

### ✅ DO:
- Study existing agents first
- Use `{root}` placeholder everywhere
- Follow "SEQUENTIAL Task Execution" pattern
- Present results to user at task end
- Load `core-config.yaml` first in tasks
- Include error handling in every task
- Add success criteria checklist

### ❌ DON'T:
- Hardcode paths
- Skip user interaction for `elicit=true`
- Create orphan files
- Assume context availability
- Mix responsibilities in one task
- Forget `{root}` replacement

---

## Common Agent Archetypes & Patterns

### Archetype 1: **Analysis/Planning Agent**
**Examples:** Analyst, PM, Architect, PO
**Pattern:**
- Read project context
- Elicit missing information
- Generate structured document
- Validate completeness

**Key Tasks:**
- Domain/requirement analysis
- Document creation
- Validation/alignment check

---

### Archetype 2: **Generation/Synthesis Agent**
**Examples:** Eval, SM (story creation)
**Pattern:**
- Analyze source documents
- Extract patterns/requirements
- Generate multiple artifacts
- Validate quality

**Key Tasks:**
- Analysis task
- Multiple generation tasks
- Validation task
- Manifest/index creation

---

### Archetype 3: **Implementation Agent**
**Examples:** Dev
**Pattern:**
- Load requirements
- Execute implementation steps
- Validate results
- Update tracking

**Key Tasks:**
- Story/requirement loading
- Implementation execution
- Testing/validation
- Status updates

---

### Archetype 4: **Communication/Coordination Agent**
**Examples:** Stakeholder agent (hypothetical)
**Pattern:**
- Identify audience
- Gather relevant information
- Translate to audience format
- Distribute/track

**Key Tasks:**
- Audience identification
- Content gathering/synthesis
- Format translation
- Distribution/tracking

---

### Archetype 5: **Validation/QA Agent**
**Examples:** QA
**Pattern:**
- Load artifacts to validate
- Execute validation checks
- Generate findings report
- Track remediation

**Key Tasks:**
- Artifact loading
- Validation execution
- Report generation
- Remediation tracking

---

## Worked Example: Stakeholder Agent

### Phase 1: Discovery
**Purpose:** Generate stakeholder-appropriate summaries and updates from technical project documents

**Position:** Runs after PM/Architect, outputs to stakeholders (external to BMAD)

**Inputs:**
- `docs/prd.md` (technical requirements)
- `docs/architecture.md` (technical design)
- `docs/stakeholder-config.yaml` (audience definitions)

**Outputs:**
- `docs/stakeholders/executive-summary.md`
- `docs/stakeholders/technical-update.md`
- `docs/stakeholders/timeline-report.md`

**Constraints:**
- Must translate technical jargon to business language
- Different audiences need different detail levels
- Updates should be concise (1-2 pages max)

---

### Phase 2: Architecture
**Agent Persona:**
- Name: Sarah
- Role: Stakeholder Communication Specialist
- Style: Clear, concise, audience-aware, jargon-free
- Principles:
  - Audience-First Translation
  - Appropriate Detail Level
  - Highlight Business Impact
  - Visual Clarity (use diagrams/tables)
  - Track Communication History

**Commands:**
- `*help`
- `*identify-stakeholders` (analyze who needs what)
- `*create-executive-summary` (C-level summary)
- `*create-technical-update` (for technical stakeholders)
- `*create-timeline-report` (schedule/milestone view)
- `*generate-all-updates` (orchestrator)
- `*exit`

**Task Decomposition:**
```
1. identify-stakeholders.md
   ↓
2. create-stakeholder-updates.md (orchestrator)
   ├→ create-executive-summary.md
   ├→ create-technical-update.md
   └→ create-timeline-report.md
   ↓
3. validate-stakeholder-content.md
```

**Supporting Files:**
- Templates: `executive-summary-tmpl.yaml`, `technical-update-tmpl.yaml`, `timeline-report-tmpl.yaml`
- Data: `stakeholder-personas.md`, `translation-glossary.md`, `communication-best-practices.md`

---

### Phase 3: Implementation

**Agent file structure:**
```yaml
agent:
  name: Sarah
  id: stakeholder
  title: Stakeholder Communication Specialist
  icon: 📢
  whenToUse: After PRD/Architecture complete, to generate stakeholder-appropriate summaries and updates

persona:
  role: Communication Bridge Between Technical & Business
  style: Clear, concise, audience-aware, jargon-free
  core_principles:
    - Audience-First Translation
    - Appropriate Detail Level
    - Highlight Business Impact
    - Visual Clarity
    - Track Communication History

commands:
  - help: Show available commands
  - identify-stakeholders: Execute identify-stakeholders.md
  - create-executive-summary: Execute create-executive-summary.md
  - generate-all-updates: Execute create-stakeholder-updates.md
  - exit: Exit stakeholder agent

dependencies:
  tasks:
    - identify-stakeholders.md
    - create-stakeholder-updates.md
    - create-executive-summary.md
    - create-technical-update.md
    - validate-stakeholder-content.md
  templates:
    - executive-summary-tmpl.yaml
    - technical-update-tmpl.yaml
  data:
    - stakeholder-personas.md
    - translation-glossary.md
```

**Task example (create-executive-summary.md):**
```markdown
## Purpose
Generate C-level executive summary translating technical PRD/Architecture into business impact and timeline

## SEQUENTIAL Task Execution

### 1. Load Project Context
- Load `{root}/core-config.yaml`
- Load PRD from configured location
- Load Architecture from configured location

### 2. Extract Business-Relevant Information
- Project objectives and business goals
- Key deliverables and timeline
- Resource requirements and costs
- Risk factors and mitigation

### 3. Translate Technical to Business Language
- Load `{root}/data/translation-glossary.md`
- Replace technical terms with business equivalents
- Focus on outcomes, not implementation

### 4. Generate Executive Summary
- Use template `{root}/templates/executive-summary-tmpl.yaml`
- Populate: objectives, timeline, budget, risks
- Keep to 1-2 pages max

### 5. Present Summary to User
[Show generated summary, ask for approval]

## Success Criteria
- [ ] Summary under 2 pages
- [ ] No technical jargon
- [ ] Business impact clear
- [ ] Timeline included
```

---

### Phase 4-5: Validation & Integration
**Test scenarios:**
- Happy path: Standard PRD/Architecture → generates all summaries
- Edge case: Highly technical project → ensures good translation
- Error: Missing PRD → prompts user for minimum info

**Integration:**
- Add to `team-fullstack.yaml` (optional)
- Or create `team-stakeholder-comms.yaml` (with PM, PO, stakeholder agents)

---

## Comparison: Two Different Agents

### Eval Agent (Data Generator)
- **Archetype:** Generation/Synthesis
- **Scale challenge:** 100K records (solved with TS script)
- **Output:** Structured datasets (YAML/CSV)
- **Complexity:** Domain analysis + multi-format generation

### Stakeholder Agent (Communicator)
- **Archetype:** Communication/Coordination
- **Scale challenge:** None (small documents)
- **Output:** Human-readable reports (Markdown)
- **Complexity:** Translation + audience adaptation

**Same Methodology Applied:**
- Both follow 5-phase approach
- Both use task decomposition
- Both have templates/data files
- Both integrate with existing agents
- **Different implementation details based on archetype**

---

## Key Insight

**The methodology is archetype-agnostic.** The 5 phases work for ANY agent type:

1. **Discovery** → What problem to solve
2. **Architecture** → How to structure solution
3. **Implementation** → Build the components
4. **Validation** → Ensure quality
5. **Integration** → Connect to ecosystem

The **specifics** change per archetype (data generation vs communication vs validation), but the **process** remains the same.

---

## Advanced Patterns

### Pattern 1: Context-Efficient Large Data Generation
**Problem:** AI can't hold 100K records in context
**Solution:**
1. Generate small seed dataset (100 records)
2. Generate multiplication config (YAML)
3. Generate executable script (TS/Python/etc.)
4. Execute script via Bash tool
5. Script outputs bulk data (CSV/SQL)

**When to Use:** Performance testing, load testing, large dataset generation

---

### Pattern 2: Auto-Detection with Fallback Elicitation
**Problem:** Need domain info that may or may not be in docs
**Solution:**
1. Try to extract from available docs
2. Score confidence (high/medium/low)
3. If low confidence, execute `advanced-elicitation.md`
4. Combine extracted + elicited info

**When to Use:** Domain analysis, requirement extraction, configuration detection

---

### Pattern 3: Multi-Layer Output Generation
**Problem:** Different use cases need different data formats/scales
**Solution:**
1. Create separate tasks for each layer
2. Each task optimizes for its use case
3. Main orchestrator calls all tasks
4. Manifest ties layers together

**When to Use:** Multi-purpose data generation, varied output formats

---

### Pattern 4: Validation as Separate Concern
**Problem:** Data quality must be guaranteed
**Solution:**
1. Generate data in dedicated tasks
2. Create separate validation task
3. Validation task checks all generated artifacts
4. Report issues with auto-fix options
5. User confirms before proceeding

**When to Use:** Quality assurance, data validation, artifact verification

---

## Quick Reference Card

### 5-Phase Process
1. **Discovery** - Define problem, inputs/outputs, constraints
2. **Architecture** - Study patterns, design persona, decompose tasks
3. **Implementation** - Build agent, tasks, templates, data files
4. **Validation** - Self-review, verify dependencies, test
5. **Integration** - Update teams, build distribution

### Key Files Per Agent
- **1 Agent Definition:** `bmad-core/agents/{id}.md`
- **3-10 Tasks:** `bmad-core/tasks/{task-name}.md`
- **2-6 Templates:** `bmad-core/templates/{template-name}.yaml`
- **1-4 Data Files:** `bmad-core/data/{knowledge-name}.md`

### Critical Patterns
- Use `{root}` placeholder everywhere
- Load `core-config.yaml` first in tasks
- "SEQUENTIAL Task Execution" heading
- Present results to user at end
- Error handling + success criteria

### Time Estimates
- **Simple Agent:** 3-6 hours
- **Complex Agent:** 8-16 hours
- **AI-Assisted:** 1-5 conversation sessions
