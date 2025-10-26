<!-- Powered by BMAD™ Core -->

# Domain Research Guide

## Purpose

This guide provides best practices and strategies for conducting effective BUSINESS domain research. Use this when executing domain context research tasks to ensure comprehensive, accurate, and actionable business context.

**SCOPE:** This guide focuses on BUSINESS domain research only:
- ✅ Industry context, business methodologies, regulations, terminology, market dynamics
- ❌ Team roles, technical processes, tools/technologies (handled by Architect/PM agents)

---

## Research Principles

### 1. Currency Over Historical
- Prioritize information from 2023-2025
- Industry practices evolve rapidly
- Older methodologies may be deprecated
- Verify if frameworks are still actively used

### 2. Credibility of Sources
**High Credibility:**
- Official industry standards organizations (ISO, IEEE, W3C)
- Major technology vendors' documentation
- Established industry publications (Gartner, Forrester, ThoughtWorks)
- Academic research from reputable institutions
- Government regulatory bodies

**Medium Credibility:**
- Well-known industry blogs and practitioner sites
- Conference presentations from recognized events
- Popular developer communities (Stack Overflow, dev.to)
- Open-source project documentation

**Low Credibility:**
- Personal blogs without credentials
- Marketing materials from unknown vendors
- Outdated content (>3 years old without verification)
- Sources with obvious bias or conflicts of interest

### 3. Breadth Before Depth
- Cast wide net initially across all research categories
- Identify patterns and commonalities
- Then dive deeper into most relevant areas
- Balance comprehensiveness with conciseness

### 4. Validation Through Multiple Sources
- Confirm key findings with 2-3 sources
- Cross-reference methodologies and terminology
- Note when sources conflict or disagree
- Present consensus view or acknowledge debate

### 5. User Expertise as Primary Source
- User's domain knowledge is most valuable for their project
- Use research to supplement, not replace user input
- Validate findings against user's experience
- Defer to user on domain-specific nuances

### 6. Token Efficiency Over Completeness
- **AI agents will process this document repeatedly** - every token has a cost
- **Target: 1500-2500 tokens total** - ruthlessly prioritize high-value information
- **Quality > Quantity:** 3 well-chosen methodologies > 10 superficial ones
- **Prefer bullets over prose:** More scannable, fewer tokens
- **Eliminate redundancy:** Don't repeat the same point in different sections
- **No fluff:** Skip introductory phrases, marketing language, historical context

---

## Effective Web Search Strategies

### Query Construction

**Good Query Patterns:**
```
"{domain} industry overview 2025"
"{domain} business methodologies 2025"
"{domain} business frameworks"
"{domain} regulatory compliance requirements"
"{domain} industry standards"
"{domain} market trends current"
"{domain} business challenges"
"{domain} industry terminology"
```

**Poor Query Patterns:**
```
"what is {domain}" (too broad)
"{domain} history" (not actionable)
"{domain} future predictions" (speculative)
"best {domain} company" (subjective)
```

### Search Iteration Strategy

1. **Start Broad**
   - "{domain} industry overview"
   - Identify sub-domains and business specializations

2. **Narrow by Category**
   - "{domain} business methodologies"
   - "{domain} regulatory requirements"
   - "{domain} market dynamics"

3. **Get Specific**
   - "{domain} lean manufacturing principles"
   - "{domain} GDPR compliance requirements"
   - "{domain} customer acquisition challenges"

4. **Verify Currency**
   - Add "2024" or "2025" to queries
   - Search for "latest {domain} business trends"
   - Look for "{domain} emerging market opportunities"

---

## Research Category Guidelines

### 1. Industry Overview & Context

**What to Capture:**
- Market size and growth trends
- Key players and ecosystem
- Maturity level (emerging, growing, mature, declining)
- Major disruptions or shifts in the industry
- Primary business models

**Red Flags:**
- Outdated market data
- Single-source claims about market size
- Overly promotional language
- Missing context about domain boundaries

**Quality Indicators:**
- Multiple consistent sources
- Specific data with citations
- Recent publication dates
- Balanced perspective on challenges and opportunities

---

### 2. Business Methodologies & Frameworks

**What to Capture:**
- Name and origin of BUSINESS methodology (NOT software development methods)
- Core business principles and values
- Typical business implementation approach
- When it's appropriate to use in business context
- Known limitations or trade-offs

**Common Business Methodologies by Domain:**
- **Manufacturing:** Lean Manufacturing, Six Sigma, Kaizen, Just-In-Time, Total Quality Management
- **Product Management:** Lean Startup, Jobs-to-be-Done, Design Thinking, Blue Ocean Strategy
- **Business Strategy:** Porter's Five Forces, SWOT, Business Model Canvas, OKRs
- **Customer Experience:** Customer Journey Mapping, Service Design, Voice of Customer
- **Process Improvement:** Six Sigma, Lean, Business Process Reengineering

**NOTE:** Focus on BUSINESS methodologies, NOT technical implementation methods like Agile/Scrum/DevOps

**Documentation Pattern:**
```
### [Methodology Name]

**Description:** [1-2 sentence overview]

**When Used:** [Project types, team sizes, constraints]

**Key Principles/Phases:**
- [Principle 1]
- [Principle 2]
- [Phase/Step 1] → [Phase/Step 2] → [Phase/Step 3]

**Considerations:** [Pros, cons, trade-offs]
```

---

### 3. Key Terminology & Concepts

**What to Capture:**
- Domain-specific BUSINESS jargon
- Industry acronyms and abbreviations
- Business concepts unique to domain
- Industry buzzwords with clear definitions
- Terms with domain-specific business meanings (differ from general usage)

**NOTE:** Focus on BUSINESS terminology, not technical/implementation terms

**Glossary Best Practices:**
- Define terms in plain language
- 1-3 sentence definitions
- Avoid circular definitions (using term in its own definition)
- Include context or examples when helpful
- Link related terms

**Example Entry:**
```
**CI/CD (Continuous Integration/Continuous Deployment)**:
A software development practice where code changes are automatically built,
tested, and deployed to production. CI focuses on frequently merging code
changes and running automated tests, while CD automates the release process
to push validated changes to users quickly and safely.
```

**Terms to Prioritize:**
- High-frequency terms (appear often in domain discussions)
- Terms with domain-specific meanings
- Process/methodology terminology
- Role-specific jargon
- Technology/tool categories

---

### 4. Standards & Compliance

**What to Capture:**
- Regulatory frameworks (laws, regulations, mandates)
- Industry standards (ISO, IEEE, NIST, OWASP, etc.)
- Certification programs
- Security and privacy requirements
- Accessibility standards
- Data governance requirements
- Audit and reporting obligations

**By Domain Examples:**
- **Healthcare:** HIPAA, HITECH, FDA regulations, HL7 standards
- **Finance:** SOX, PCI-DSS, GDPR, SOC 2, financial reporting standards
- **Education:** FERPA, COPPA, accessibility (WCAG, Section 508)
- **E-commerce:** PCI-DSS, GDPR, consumer protection laws
- **Government:** FedRAMP, FISMA, Section 508, ATO requirements

**Documentation Approach:**
```
### [Standard/Regulation Name]

**Applicability:** [Who must comply, when it applies]

**Key Requirements:** [High-level compliance requirements]

**Impact on Development:** [How it affects technical decisions]

**Resources:** [Official documentation links]
```

**Important:**
- Distinguish between mandatory and recommended
- Note geographic scope (US-only, EU, global)
- Flag high-impact requirements early
- Indicate if specialized compliance expertise needed
- Focus on BUSINESS/REGULATORY requirements, not technical standards

---

### 5. Business Challenges & Market Characteristics

**What to Capture:**
- Common business challenges and pain points
- Competitive landscape and market dynamics
- Key success factors for businesses in this domain
- Business risk areas
- Market opportunities and trends
- Customer/user expectations and behaviors
- Barriers to entry
- Industry consolidation or fragmentation trends

**Documentation Approach:**
```
### Business Challenges

**Common Pain Points:**
- [Challenge 1: description and impact]
- [Challenge 2: description and impact]
- [Challenge 3: description and impact]

**Market Characteristics:**
- Market maturity: [Emerging/Growing/Mature/Declining]
- Competition level: [High/Medium/Low with explanation]
- Key players: [Major competitors and their positioning]
- Differentiation factors: [What drives competitive advantage]

**Success Factors:**
- [Factor 1: why it's critical]
- [Factor 2: why it's critical]
- [Factor 3: why it's critical]
```

**Important:**
- Focus on BUSINESS challenges, not technical implementation challenges
- Provide evidence-based insights, not speculation
- Include market data when available
- Consider different business sizes (startup vs enterprise perspectives)

---

## Synthesis Best Practices

### Organize Information Hierarchically
1. **Start with big picture** (domain overview, market context)
2. **Add business framework** (business methodologies)
3. **Provide context** (terminology, standards, compliance)
4. **Identify challenges** (business challenges, market characteristics)
5. **Offer resources** (learning materials, organizations)

### Remove Noise and Redundancy
- Eliminate marketing fluff
- Merge overlapping information
- Remove contradictory information (or note disagreement)
- Focus on actionable insights

### Balance Detail and Brevity - TOKEN EFFICIENCY IS CRITICAL

**Target Token Budget:** 1500-2500 tokens total for entire document

**Section Budgets:**
- **Domain Overview:** 150-250 tokens (bullet points, not paragraphs)
- **Business Methodologies:** 200-300 tokens (3-4 methodologies, 50-75 tokens each)
- **Terminology:** 250-400 tokens (15-20 terms, 15-20 tokens per definition)
- **Standards & Compliance:** 150-250 tokens (bullet lists, minimal explanation)
- **Business Challenges:** 200-300 tokens (bullets only)
- **Resources:** 100-150 tokens (names only, no descriptions)

**Format Preferences:**
- Bullet points > prose paragraphs
- Short definitions (1-2 sentences) > verbose explanations
- Structured lists > narrative descriptions
- Concise labels > lengthy titles

### Make It Actionable
- Describe what practitioners *do*, not just what things *are*
- Include when/why to use methodologies, not just how
- Connect roles to their deliverables and workflows
- Link tools to the problems they solve

### Maintain Objectivity
- Present multiple approaches neutrally
- Note trade-offs and context dependencies
- Avoid prescriptive "you must" language
- Acknowledge domain diversity ("commonly" not "always")

---

## Common Research Pitfalls

### 1. **Recency Bias**
- **Problem:** Over-weighting newest trends as "the way"
- **Solution:** Balance emerging practices with proven approaches
- **Example:** "Microservices are popular but monoliths remain valid for many use cases"

### 2. **Vendor Bias**
- **Problem:** Research dominated by vendor marketing
- **Solution:** Seek practitioner experiences and independent sources
- **Red Flag:** "Best tool for X" (usually marketing)

### 3. **Depth Over Breadth**
- **Problem:** Spending too much time on one methodology, missing others
- **Solution:** Set time limits per category, survey broadly first

### 4. **Assumption of Universality**
- **Problem:** Treating domain practices as universal rules
- **Solution:** Use "commonly," "typically," "often" rather than "always," "must," "all"

### 5. **Ignoring User Context**
- **Problem:** Generic research not adapted to user's specific project
- **Solution:** Regularly validate findings with user, ask clarifying questions

### 6. **Information Overload**
- **Problem:** Trying to document everything discovered
- **Solution:** Ruthlessly prioritize—what will planning agents actually use?

### 7. **Stale Information**
- **Problem:** Including outdated practices without verification
- **Solution:** Check publication dates, verify currency, flag deprecated approaches

### 8. **Verbosity and Token Waste**
- **Problem:** Long prose paragraphs, verbose explanations, repetitive content
- **Solution:** Use bullets, keep definitions to 1-2 sentences, eliminate redundancy
- **Example:**
  - ❌ Bad: "Six Sigma is a methodology that was developed by Motorola in the 1980s and focuses on improving quality by identifying and removing the causes of defects and minimizing variability in manufacturing and business processes through the use of statistical methods."
  - ✅ Good: "Six Sigma: Data-driven methodology for reducing defects and process variation using statistical analysis."

---

## Quality Checklist

Before finalizing domain context document, verify:

**Token Efficiency:**
- [ ] Total document is 1500-2500 tokens (approximately 1200-2000 words)
- [ ] Bullet points used instead of prose paragraphs where possible
- [ ] Glossary definitions are 1-2 sentences maximum (15-20 tokens)
- [ ] No redundancy between sections
- [ ] No marketing language, fluff, or verbose explanations
- [ ] Every section stays within token budget

**Completeness:**
- [ ] All 6 template sections populated (Overview, Methodologies, Terminology, Standards, Challenges, Resources)
- [ ] 3-4 business methodologies documented (NOT 10+)
- [ ] 15-20 business glossary terms defined (NOT exhaustive list)
- [ ] Applicable regulatory/compliance standards identified (key ones only)
- [ ] Business challenges and market characteristics documented (top 5-7)
- [ ] Additional learning resources curated (3-5 total)
- [ ] NO technical implementation details included (roles, processes, tools)

**Accuracy:**
- [ ] Information from 2023-2025 (or verified as still current)
- [ ] Key facts confirmed by multiple sources
- [ ] User validated domain-specific details
- [ ] No obvious vendor bias or marketing language

**Actionability:**
- [ ] Business methodologies include "when to use" guidance
- [ ] Challenges include business impact and context
- [ ] Market characteristics provide actionable insights
- [ ] Standards include "impact on business operations"

**Clarity:**
- [ ] Business jargon defined in glossary
- [ ] Sections organized logically
- [ ] Appropriate level of detail (not too shallow, not overwhelming)
- [ ] Consistent terminology throughout
- [ ] Clear headings and structure
- [ ] Clear separation between business and technical concerns

**Utility:**
- [ ] Analyst can use for market research and competitive analysis
- [ ] PM can reference for PRD (business context, terminology, challenges)
- [ ] Architect can reference for compliance requirements
- [ ] All agents benefit from shared business terminology and domain context
- [ ] Provides foundation for business decisions, NOT technical decisions

---

## Domain-Specific Research Tips

### SaaS / Web Applications
- **Business Models:** Subscription-based (per-user, usage-based, tiered pricing)
- **Key Metrics:** ARR, MRR, churn rate, CAC, LTV, NPS
- **Market Dynamics:** Highly competitive, low switching costs, product-led growth common
- **Compliance:** GDPR, SOC 2, data residency requirements
- **Business Challenges:** Customer acquisition costs, retention, market saturation

### Mobile Applications
- **Business Models:** Freemium, in-app purchases, subscriptions, advertising
- **Market Dynamics:** App store monopolies, high discoverability challenges
- **Compliance:** App store policies, COPPA (children's apps), regional data laws
- **Business Challenges:** User acquisition, retention, monetization balance
- **Success Factors:** Strong user experience, viral growth potential, category positioning

### Game Development
- **Business Models:** Premium, free-to-play, live service, subscription (Game Pass)
- **Market Dynamics:** Hit-driven industry, high development costs, publisher relationships
- **Compliance:** Platform certification, age ratings (ESRB, PEGI), regional regulations
- **Business Challenges:** Long development cycles, uncertain ROI, live ops sustainability
- **Success Factors:** Player retention, monetization without player backlash, community engagement

### Enterprise Software
- **Business Models:** Enterprise licensing, multi-year contracts, professional services
- **Market Dynamics:** Long sales cycles (6-18 months), relationship-driven, high switching costs
- **Compliance:** SOC 2, ISO 27001, industry-specific regulations
- **Business Challenges:** Complex procurement, change management, ROI demonstration
- **Success Factors:** Customer success programs, integration ecosystems, regulatory compliance

### Data Science / ML
- **Business Models:** SaaS platforms, consulting services, embedded AI features
- **Market Dynamics:** Rapidly evolving, talent shortage, commoditization of basic ML
- **Compliance:** Model governance, algorithmic bias regulations, data privacy laws
- **Business Challenges:** Demonstrating ROI, managing expectations, ethics and bias
- **Success Factors:** Explainability, measurable business outcomes, continuous improvement

### E-commerce
- **Business Models:** Direct-to-consumer, marketplace, dropshipping, subscription boxes
- **Market Dynamics:** Amazon dominance, thin margins, logistics challenges
- **Compliance:** PCI-DSS, consumer protection laws, accessibility standards
- **Business Challenges:** Customer acquisition costs, cart abandonment, logistics costs
- **Success Factors:** Conversion optimization, customer experience, supply chain efficiency

### Healthcare / HealthTech
- **Business Models:** B2B (providers/payers), B2C (direct to patient), B2B2C (employer)
- **Market Dynamics:** Heavily regulated, long sales cycles, reimbursement complexity
- **Compliance:** HIPAA, HITECH, FDA approval (medical devices), state licensing
- **Business Challenges:** Clinical validation, reimbursement pathways, interoperability
- **Success Factors:** Clinical evidence, integration with existing workflows, regulatory approval

### FinTech / Financial Services
- **Business Models:** Transaction fees, subscription, interest spread, SaaS licensing
- **Market Dynamics:** Traditional banks vs disruptors, trust-dependent, network effects
- **Compliance:** SOX, PCI-DSS, KYC, AML, banking licenses, regional regulations
- **Business Challenges:** Regulatory approval, fraud prevention, building trust
- **Success Factors:** Security, regulatory compliance, partnerships with established banks

---

## Example: Quality Domain Research

**Domain:** SaaS Project Management Tools

**Good Domain Overview:**
> "SaaS project management is a mature, competitive market dominated by established players (Jira, Asana, Monday.com) and challenged by newer alternatives (Linear, Height, Notion). The industry has shifted from feature-rich, complex tools toward simpler, faster, more opinionated products. Key trends include AI-powered automation, native integrations with development tools, and hybrid work support. Typical customers range from 10-person startups to 10,000-person enterprises, with pricing models based on per-user seats and feature tiers."

**Poor Domain Overview:**
> "Project management software helps teams manage projects. There are many tools available. Companies use them to track work. The market is growing."

**Good Methodology Description:**
> **Lean Startup**
>
> **Description:** Business methodology for developing products and businesses through Build-Measure-Learn feedback loops, emphasizing validated learning, experimentation, and iterative product releases to minimize waste and market risk.
>
> **When Used:** Best for new product development with uncertain market demand, startup environments, and innovation initiatives. Common in SaaS, consumer products, and new market entry. Less suitable for products with well-understood markets or strict regulatory requirements demanding upfront certainty.
>
> **Key Principles:**
> - Build Minimum Viable Product (MVP) to test assumptions
> - Measure real customer behavior and feedback
> - Learn from data to pivot or persevere
> - Validated learning over vanity metrics
> - Continuous deployment and rapid iteration
>
> **Typical Workflow:** Hypothesis → Build MVP → Launch to Customers → Measure Results → Learn & Decide → Pivot or Persevere → Repeat
>
> **Considerations:** Requires comfort with uncertainty and potential failure. MVP quality must balance speed with credibility. Can struggle with enterprise sales requiring polished demos. Risk of over-pivoting without adequate conviction. Works best when customer feedback is accessible and actionable.

**Poor Methodology Description:**
> "Lean Startup is about building things quickly and testing them. Companies use it to save money and move fast."

---

## Token Efficiency Examples

### Example 1: Domain Overview

**❌ VERBOSE (400+ tokens):**
> "The Software as a Service (SaaS) industry has experienced tremendous growth over the past decade, fundamentally transforming how businesses consume and deploy software solutions. Unlike traditional on-premises software that required significant upfront capital investment and ongoing maintenance costs, SaaS products are delivered over the internet and typically follow a subscription-based pricing model. The market has become increasingly competitive, with major players like Salesforce, Microsoft, and Google competing alongside thousands of smaller startups and niche solutions. Current trends in the industry include the rise of artificial intelligence integration, increased focus on product-led growth strategies, and a shift toward vertical-specific solutions rather than horizontal platforms. The market is considered mature but still growing, with an estimated compound annual growth rate of 18% through 2027. Key challenges include customer acquisition costs, churn management, and market saturation in certain categories."

**✅ LEAN (150 tokens):**
> **SaaS Industry Overview**
> - Subscription-based software delivered via internet
> - Market maturity: Mature but growing (18% CAGR through 2027)
> - Key trends:
>   - AI integration becoming standard
>   - Product-led growth strategies
>   - Shift to vertical-specific solutions
>   - Platform consolidation
> - Competitive landscape: Highly competitive, dominated by major players (Salesforce, Microsoft) with thousands of niche competitors

### Example 2: Methodology Description

**❌ VERBOSE (120 tokens):**
> "Design Thinking is a human-centered approach to innovation that draws from the designer's toolkit to integrate the needs of people, the possibilities of technology, and the requirements for business success. Originally developed at Stanford's d.school and popularized by IDEO, this methodology has become increasingly popular across industries. It involves five key phases that teams iterate through: empathize with users, define the problem, ideate solutions, prototype concepts, and test with users. The methodology is particularly valuable when dealing with complex, ambiguous problems."

**✅ LEAN (45 tokens):**
> **Design Thinking:** Human-centered innovation methodology. Five phases: Empathize → Define → Ideate → Prototype → Test. Best for complex, ambiguous problems requiring user understanding. Iterative process emphasizing rapid experimentation.

### Example 3: Glossary Term

**❌ VERBOSE (60 tokens):**
> **Customer Acquisition Cost (CAC)**: This is a critical business metric that represents the total amount of money a company spends to acquire a new customer, calculated by dividing all sales and marketing expenses by the number of new customers acquired during a specific time period.

**✅ LEAN (18 tokens):**
> **CAC (Customer Acquisition Cost)**: Total sales/marketing spend divided by new customers acquired in a period.

---

## Final Reminder

**The goal of domain research is to establish a shared foundation of knowledge that informs all subsequent planning.**

**CRITICAL: Target 1500-2500 tokens total. AI agents will process this repeatedly - every token must provide value.**

- Ruthlessly prioritize: Quality over quantity
- Prefer bullets over prose paragraphs
- Keep definitions to 1-2 sentences
- Eliminate redundancy and fluff
- Validate with user expertise
- Focus on current, credible information
- Make it actionable for Analyst, PM, and Architect agents

**When in doubt, ask the user.** They are the ultimate authority on their domain needs.
