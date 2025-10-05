# Compatibility Task: Analyze Existing Architecture

**Task ID:** compatibility-analyze-architecture
**Agent:** Compatibility
**Category:** Architecture Analysis

---

## Purpose

Extract current architecture patterns, components, and design decisions.

---

## Process

```yaml
architecture_analysis:
  patterns_identified:
    - architecture_style: "MVC monolith"
    - framework: "Express.js v4.18"
    - data_layer: "TypeORM + PostgreSQL"
    
  components:
    - component: "AuthService"
      location: "src/services/auth/"
      dependencies: ["UserModel", "JWTService"]
      
  constraints:
    - constraint: "Cannot change database without migration"
      severity: "critical"
```

Outputs to: `existing-system-truth.yaml#architecture_facts`

---

**Maps current system design.**
