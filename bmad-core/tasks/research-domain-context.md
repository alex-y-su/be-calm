<!-- Powered by BMAD™ Core -->

# Research Domain Context Task

## Purpose
Research and document comprehensive domain context including industry methodologies, typical roles, standard processes, tools, and best practices. This establishes foundational knowledge that informs all subsequent planning agents (Analyst, PM, Architect, etc.).

## Input Parameters
- Domain name or description (from user)
- Project type/category (optional)
- Any existing domain documentation (optional)

## SEQUENTIAL Task Execution (Do not proceed until current Task is complete)

### 1. Initialize & Load Configuration
- Load `{root}/core-config.yaml` to understand project configuration
- Extract domain research settings if available
- Load `{root}/data/domain-research-guide.md` for research best practices
- Prepare for web search capabilities

### 2. Elicit Domain Information from User

**Ask the user to provide:**

1. **Domain Name/Area** (required)
   - "What is the primary domain or industry for this project?"
   - Examples: FinTech, Healthcare, E-commerce, Game Development, EdTech, etc.

2. **Domain Context** (optional but helpful)
   - "Can you describe what this domain involves or any specific sub-areas?"
   - Example: "Healthcare - specifically telemedicine platforms"

3. **User Domain Expertise** (optional)
   - "What is your level of familiarity with this domain? (Novice/Intermediate/Expert)"
   - This helps calibrate research depth

4. **Specific Interests** (optional)
   - "Are there specific methodologies, roles, or processes you want to ensure are covered?"

**Store responses for use in research queries.**

### 3. Conduct Web-Based Domain Research

**Execute web searches to gather information across these categories:**

#### 3.1 Industry Overview & Context
- Search: "{domain} industry overview 2025"
- Search: "{domain} market trends current"
- Extract: Industry definition, scope, current state, key trends

#### 3.2 Standard Methodologies & Frameworks
- Search: "{domain} industry methodologies"
- Search: "{domain} best practices frameworks"
- Search: "{domain} development lifecycle"
- Extract: Common approaches (Agile, Waterfall, domain-specific methods)
- Identify: Industry-standard frameworks and their use cases

#### 3.3 Typical Roles & Responsibilities
- Search: "{domain} typical roles and responsibilities"
- Search: "{domain} team structure"
- Extract: Common job titles, role definitions, team compositions
- Map: Responsibilities and skill requirements per role

#### 3.4 Standard Processes & Workflows
- Search: "{domain} standard processes"
- Search: "{domain} workflow best practices"
- Extract: Typical project phases, process steps, workflow patterns
- Document: Standard operating procedures

#### 3.5 Common Tools & Technologies
- Search: "{domain} industry tools 2025"
- Search: "{domain} technology stack"
- Extract: Popular platforms, frameworks, software, and services
- Categorize: By function (development, collaboration, deployment, etc.)

#### 3.6 Key Terminology & Concepts
- Extract domain-specific terminology from all searches
- Define: Important acronyms, jargon, and concepts
- Create: Mini-glossary of essential terms

#### 3.7 Standards & Compliance
- Search: "{domain} industry standards"
- Search: "{domain} regulatory compliance"
- Extract: Relevant regulations, certifications, compliance requirements
- Note: Quality standards and best practice guidelines

### 4. Synthesize Research Findings

**Organize collected information into structured format:**

1. **Review all research findings**
2. **Remove duplicates and conflicting information**
3. **Prioritize most relevant and current information**
4. **Validate findings against user's domain expertise** (if provided)
5. **Structure content according to template sections**

### 5. Generate Domain Context Document

**Load template:** `{root}/templates/domain-context-tmpl.yaml`

**Populate template sections with researched information:**

- Domain Overview (synthesized from industry overview searches)
- Industry Methodologies (from methodology searches)
- Typical Roles (from role searches)
- Standard Processes (from workflow searches)
- Common Tools & Technologies (from tools searches)
- Key Terminology (extracted glossary)
- Standards & Compliance (from standards searches)
- Best Practices (synthesized recommendations)

**Follow template instructions for:**
- Variable substitution using `{{placeholders}}`
- AI-specific guidance in `[[LLM: ...]]` sections
- Section-by-section generation with user review

### 6. User Review & Refinement

**Present generated domain context document section by section**

For each section:
1. Output the drafted content
2. Offer advanced elicitation options (using `advanced-elicitation.md`)
3. Accept direct user feedback or corrections
4. Refine based on user's domain expertise
5. Proceed when user approves

### 7. Finalize & Save Document

**Determine output location:**
- Default: `docs/domain-context.md`
- Or: Use location from `core-config.yaml` if specified

**Save the completed document**

**Create document metadata:**
- Domain researched
- Date of research
- Web search sources used
- User expertise level
- Version: 1.0

### 8. Present Summary to User

**Generate and display summary:**

```
Domain Context Research Complete! 🔍

**Domain:** {{domain_name}}
**Document:** docs/domain-context.md
**Sections Documented:**
- ✓ Domain Overview
- ✓ Industry Methodologies ({{methodology_count}} identified)
- ✓ Typical Roles ({{role_count}} documented)
- ✓ Standard Processes ({{process_count}} mapped)
- ✓ Common Tools & Technologies
- ✓ Key Terminology & Concepts
- ✓ Standards & Compliance
- ✓ Best Practices

**Next Steps:**
This domain context will inform all subsequent planning agents:
- Analyst: Will reference industry trends and methodologies
- PM: Will use standard roles and processes for PRD
- Architect: Will consider typical tools and compliance requirements
- All agents: Will use terminology and best practices

**Recommended Next Agent:** Analyst (for project brief creation)
```

### 9. Return Status

**Return:** `SUCCESS - Domain context document created at docs/domain-context.md`

---

## Error Handling

### Missing Domain Information
- **Error:** User doesn't provide domain name
- **Resolution:** Re-prompt with examples and explanation of importance

### Web Search Failure
- **Error:** Cannot access web search or searches fail
- **Resolution:** Fall back to built-in AI knowledge with disclaimer about currency
- **User Action:** Offer to proceed with AI knowledge or retry later

### Insufficient Research Results
- **Error:** Very niche domain with limited search results
- **Resolution:**
  - Inform user of limited results
  - Research adjacent/parent domains
  - Heavily involve user expertise via elicitation
  - Document gaps for later research

### User Rejects Generated Content
- **Error:** User indicates content is inaccurate or incomplete
- **Resolution:**
  - Ask specific questions about inaccuracies
  - Conduct targeted additional research
  - Incorporate user's corrections
  - Re-generate affected sections

---

## Success Criteria

- [ ] Domain name and context clearly identified
- [ ] Web search conducted across all 7 research categories
- [ ] At least 3-5 methodologies documented
- [ ] At least 5-8 typical roles identified
- [ ] Standard processes/workflows mapped
- [ ] Common tools and technologies listed
- [ ] Key terminology glossary created (10+ terms)
- [ ] Standards and compliance requirements noted
- [ ] User reviewed and approved all sections
- [ ] Document saved to correct location
- [ ] Summary presented with next steps
- [ ] Return status: SUCCESS

---

## Notes

- **Web Search is Critical:** This task requires active web search to get current, accurate domain information
- **User Expertise Matters:** Leverage user's domain knowledge to validate and enhance research
- **Concise but Complete:** Balance thoroughness with readability - don't overwhelm with excessive detail
- **Foundation for All Agents:** The quality of this research directly impacts all downstream planning
- **Living Document:** Domain context can be updated as project evolves and more is learned
