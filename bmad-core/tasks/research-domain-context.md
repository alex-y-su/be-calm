<!-- Powered by BMAD™ Core -->

# Research Domain Context Task

## Purpose
Research and document BUSINESS-FOCUSED domain context including industry overview, business methodologies, regulations, terminology, and market characteristics. This establishes foundational business knowledge that informs all subsequent planning agents (Analyst, PM, Architect, etc.).

**SCOPE:** This task focuses ONLY on business domain knowledge, NOT implementation details:
- ✅ INCLUDES: Industry context, business methodologies, regulations, terminology, market trends, business challenges
- ❌ EXCLUDES: Team roles, technical processes, tools/technologies, implementation best practices (handled by Architect/PM)

**OUTPUT REQUIREMENTS - LEAN & TOKEN-EFFICIENT:**
- **Target:** 1500-2500 tokens total (approximately 1200-2000 words)
- **Priority:** High-value, actionable information only - NO fluff or verbose explanations
- **Format:** Prefer bullet points and concise definitions over prose paragraphs
- **Balance:** Enough context for AI agents to make informed decisions, minimal redundancy

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

4. **Specific Business Interests** (optional)
   - "Are there specific business methodologies, market challenges, compliance areas, or industry frameworks you want to ensure are covered?"

**Store responses for use in research queries.**

### 3. Conduct Web-Based Domain Research

**Execute web searches to gather information across these categories:**

#### 3.1 Industry Overview & Context
- Search: "{domain} industry overview 2025"
- Search: "{domain} market trends current"
- Extract: Industry definition, scope, current state, key trends

#### 3.2 Business Methodologies & Frameworks
- Search: "{domain} industry business methodologies"
- Search: "{domain} business frameworks"
- Search: "{domain} industry best practices"
- Extract: Domain-specific business approaches (e.g., Lean Manufacturing, Six Sigma, Design Thinking)
- Identify: Business frameworks and when they're used
- NOTE: Focus on BUSINESS methodologies, not software development processes

#### 3.3 Key Terminology & Concepts
- Extract domain-specific terminology from all searches
- Define: Important acronyms, jargon, and concepts
- Create: Mini-glossary of essential terms

#### 3.4 Standards & Compliance
- Search: "{domain} industry standards"
- Search: "{domain} regulatory compliance"
- Extract: Relevant regulations, certifications, compliance requirements
- Note: Quality standards and business practice guidelines

#### 3.5 Business Challenges & Market Characteristics
- Search: "{domain} industry challenges"
- Search: "{domain} market dynamics"
- Extract: Common business challenges, competitive landscape, market opportunities
- Identify: Key success factors and risk areas
- NOTE: Focus on business/market challenges, not technical implementation challenges

### 4. Synthesize Research Findings

**Organize collected information into LEAN, TOKEN-EFFICIENT format:**

1. **Review all research findings**
2. **Remove duplicates and conflicting information**
3. **Ruthlessly prioritize:** Keep only high-value, actionable information
4. **Eliminate verbose explanations:** Use bullet points, short definitions, concise descriptions
5. **Target token budget:**
   - Domain Overview: 150-250 tokens (3-5 key points)
   - Business Methodologies: 200-300 tokens (3-4 methodologies, brief descriptions)
   - Terminology: 250-400 tokens (15-20 terms, 1-2 sentence definitions)
   - Standards & Compliance: 150-250 tokens (key regulations only)
   - Business Challenges: 200-300 tokens (top 5-7 challenges/characteristics)
   - Resources: 100-150 tokens (curated list, no descriptions)
6. **Validate findings against user's domain expertise** (if provided)
7. **Structure content according to template sections**

### 5. Generate Domain Context Document

**Load template:** `{root}/templates/domain-context-tmpl.yaml`

**Populate template sections with researched information:**

- Domain Overview (synthesized from industry overview searches)
- Business Methodologies & Frameworks (from methodology searches)
- Key Terminology (extracted glossary)
- Standards & Compliance (from standards searches)
- Business Challenges & Market Characteristics (from market research)
- Additional Resources (curated learning resources)

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
- ✓ Business Methodologies & Frameworks ({{methodology_count}} identified)
- ✓ Key Terminology & Concepts ({{term_count}} terms)
- ✓ Standards & Compliance
- ✓ Business Challenges & Market Characteristics
- ✓ Additional Resources

**Next Steps:**
This business domain context will inform all subsequent planning agents:
- Analyst: Will reference industry trends, methodologies, and market characteristics
- PM: Will use domain terminology and business challenges for PRD
- Architect: Will consider compliance requirements and industry standards
- All agents: Will use consistent domain terminology

**Recommended Next Agent:** Analyst (for project brief creation)

**Note:** Team structure, technical processes, and technology selection will be defined by Architect and PM agents.
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
- [ ] Web search conducted across all 5 research categories
- [ ] At least 3-5 business methodologies/frameworks documented
- [ ] Key terminology glossary created (15+ terms)
- [ ] Standards and compliance requirements noted
- [ ] Business challenges and market characteristics documented
- [ ] Additional resources curated
- [ ] User reviewed and approved all sections
- [ ] Document saved to correct location
- [ ] Summary presented with next steps
- [ ] Return status: SUCCESS
- [ ] NO technical implementation details included (roles, processes, tools)

---

## Notes

- **BUSINESS FOCUS ONLY:** This task researches the BUSINESS domain, NOT implementation details. Team structure, development processes, and technology choices are handled by Architect/PM agents.
- **TOKEN EFFICIENCY IS CRITICAL:** AI agents will process this document repeatedly. Keep it lean (1500-2500 tokens). Every token must provide value.
- **Quality Over Quantity:** 5 well-chosen methodologies are better than 15 superficial ones. Ruthlessly prioritize.
- **Web Search is Critical:** This task requires active web search to get current, accurate domain information
- **User Expertise Matters:** Leverage user's domain knowledge to validate and enhance research
- **Concise but Complete:** Balance thoroughness with readability - don't overwhelm with excessive detail
- **Foundation for All Agents:** The quality of this research directly impacts all downstream planning
- **Living Document:** Domain context can be updated as project evolves and more is learned
- **Clear Boundaries:** If user asks about roles, processes, or tools, remind them these are defined later by Architect/PM
- **Prefer Bullets Over Prose:** Use bullet points, short definitions, and structured lists instead of paragraphs where possible
