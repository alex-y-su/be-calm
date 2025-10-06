# Stage 6: Configuration & Deployment - User Guide

**Version:** 1.0
**Date:** 2025-10-05
**Status:** Implementation Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Configuration Management](#configuration-management)
4. [Autonomy Levels](#autonomy-levels)
5. [Metrics & Dashboards](#metrics--dashboards)
6. [Safety & Risk Management](#safety--risk-management)
7. [CLI Commands](#cli-commands)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Stage 6 makes BMAD production-ready with comprehensive configuration options, monitoring dashboards, safety controls, and deployment strategies. You now have full control over autonomy levels, real-time visibility into system health, and robust safety mechanisms.

### Key Features

- **4 Autonomy Levels**: Conservative → Balanced → Aggressive → Full Auto
- **Real-time Dashboards**: Health, Learning, Metrics, Project Progress
- **Safety Controls**: Emergency Stop, Rollback, Safe Mode
- **Comprehensive Audit Logging**: Track every action
- **Flexible Deployment**: Local, Team, CI/CD integration
- **Health Monitoring**: Automated system health checks

---

## Quick Start

### Installation

```bash
# Initialize BMAD configuration
bmad config init

# Set autonomy level
bmad autonomy balanced

# Start metrics dashboard
bmad dashboard
```

### First-Time Setup

1. **Initialize Configuration**
   ```bash
   bmad config init
   ```

2. **Choose Autonomy Level**
   ```bash
   # For new users or high-risk projects
   bmad autonomy conservative

   # For most projects (default)
   bmad autonomy balanced

   # For experienced teams
   bmad autonomy aggressive
   ```

3. **Start Monitoring**
   ```bash
   bmad dashboard
   # Opens http://localhost:3001
   ```

---

## Configuration Management

### Configuration Files

All configurations are stored in `.bmad-config/`:

```
.bmad-config/
├── autonomy-settings.yaml      # Autonomy level and automation
├── truth-settings.yaml          # Truth validation settings
├── metrics-config.yaml          # Metrics collection
├── deployment-config.yaml       # Deployment mode
└── notification-config.yaml     # Notification preferences
```

### View Current Configuration

```bash
bmad config show
```

### Update Settings

```bash
# Set specific value
bmad config set autonomy-settings.auto_agent_switching.enabled true

# Enable background agents
bmad config set autonomy-settings.background_agents.enabled true

# Set max concurrent agents
bmad config set autonomy-settings.background_agents.max_concurrent 4
```

### Validate Configuration

```bash
bmad config validate
```

### Reset to Defaults

```bash
# Reset all
bmad config reset

# Reset specific config
bmad config reset autonomy-settings
```

---

## Autonomy Levels

### Conservative Mode

**Best for:** New users, high-risk projects, regulatory compliance

**Characteristics:**
- ❌ Auto agent switching disabled
- ✅ Background agents (read-only)
- ❌ Auto command execution disabled
- ✅ Predictive suggestions (notification only)
- ❌ Goal mode disabled
- ✅ Full validation (all gates blocking)

```bash
bmad autonomy conservative
```

### Balanced Mode (Default)

**Best for:** Most projects, experienced BMAD users

**Characteristics:**
- ✅ Auto agent switching (with confirmation)
- ✅ Background agents enabled
- ⚠️ Auto command execution (whitelist only)
- ✅ Predictive suggestions (with preview)
- ✅ Goal mode (checkpoint approval required)
- ✅ Critical validations blocking

```bash
bmad autonomy balanced
```

### Aggressive Mode

**Best for:** Experienced teams, rapid prototyping

**Characteristics:**
- ✅ Auto agent switching (no confirmation)
- ✅ Background agents (max concurrency)
- ✅ Auto command execution (except deploy)
- ✅ Auto-accept high-confidence suggestions
- ✅ Goal mode (minimal checkpoints)
- ⚠️ Validations as warnings only

```bash
bmad autonomy aggressive
```

### Full Auto Mode

**Best for:** AI-driven experiments, low-risk internal tools

**Characteristics:**
- ✅ Fully automatic agent switching
- ✅ Unlimited background agents
- ✅ Full auto command execution (including deploy)
- ✅ Auto-accept all suggestions
- ✅ Fully autonomous goal mode
- ⚠️ Validations advisory only

```bash
bmad autonomy full_auto
```

### Granular Controls

You can fine-tune individual settings:

```bash
# Enable auto-agent switching but require confirmation
bmad config set autonomy-settings.auto_agent_switching.enabled true
bmad config set autonomy-settings.auto_agent_switching.require_confirmation true

# Limit background agents
bmad config set autonomy-settings.background_agents.max_concurrent 2

# Set confidence threshold for auto-switching
bmad config set autonomy-settings.auto_agent_switching.confidence_threshold 0.85
```

---

## Metrics & Dashboards

### Available Dashboards

1. **Real-time Dashboard** (`/dashboard/realtime`)
   - Eval test pass rate
   - Agent utilization
   - Validation gates status
   - Drift alerts

2. **Health Dashboard** (`/dashboard/health`)
   - System health status
   - Truth alignment metrics
   - Quality metrics
   - Overall health score

3. **Learning Dashboard** (`/dashboard/learning`)
   - Reflection insights
   - Process optimization trends
   - Agent improvement rates
   - Pattern library growth

4. **Project Dashboard** (`/dashboard/project`)
   - Workflow progress
   - Phase duration statistics
   - Validation metrics
   - Team velocity

### Start Dashboard Server

```bash
bmad dashboard
# Opens http://localhost:3001
```

### View Metrics in CLI

```bash
# Show all key metrics
bmad metrics show

# Export metrics
bmad metrics export json > metrics.json
bmad metrics export csv > metrics.csv
```

### Metric Categories

**Autonomy Metrics:**
- Agent switch automation rate
- Human intervention rate
- Workflow completion time
- Agent utilization
- Parallel execution rate

**Truth Reliability:**
- Domain coverage
- Traceability score
- Eval pass rate
- Drift detection rate
- Oracle accuracy

**Quality Metrics:**
- Bug escape rate
- Requirements defect rate
- Architectural drift
- Test coverage
- Code quality score

**Learning Metrics:**
- Reflection insights per sprint
- Process optimization rate
- Agent improvement rate
- Pattern library size

**Performance Metrics:**
- Phase duration
- Validation gate time
- Agent response time
- Resource utilization

---

## Safety & Risk Management

### Emergency Stop

Immediately halt all operations:

```bash
bmad stop
```

**What happens:**
1. All agents stopped
2. Current state saved
3. Emergency report generated
4. Manual resume required

**Resume after emergency stop:**
```bash
# System will prompt for confirmation
bmad resume
```

### Safe Mode

Enter restricted operational mode:

```bash
bmad safe-mode
```

**Safe mode characteristics:**
- All automation disabled
- Manual agent invocation only
- Full validation enabled
- No background execution
- Confirmation required for all actions

**Exit safe mode:**
```bash
bmad safe-mode  # Toggle off
```

### Rollback System

Rollback to previous checkpoint:

```bash
bmad workflow rollback
```

System will show available checkpoints and ask for confirmation.

**Create manual checkpoint:**
```bash
bmad workflow checkpoint "Before major refactor"
```

### Audit Logging

Query audit logs:

```bash
# View all recent logs
bmad audit

# Filter by category
bmad audit --category agent

# Filter by action
bmad audit --action validation

# Filter by user
bmad audit --user system

# Limit results
bmad audit --limit 50
```

**Audit categories:**
- `agent` - Agent invocations
- `validation` - Validation results
- `state` - State transitions
- `override` - User overrides
- `configuration` - Config changes
- `error` - Errors and exceptions
- `security` - Security events

---

## CLI Commands

### Configuration

```bash
bmad config show                    # Display current configuration
bmad config set <key> <value>       # Update setting
bmad config reset [name]            # Reset to defaults
bmad config validate                # Validate configuration
```

### Autonomy Control

```bash
bmad autonomy <level>               # Set autonomy level
bmad pause                          # Pause automation
bmad resume                         # Resume automation
bmad stop                           # Emergency stop
```

### Agent Management

```bash
bmad agents list                    # Show active agents
bmad agents invoke <agent>          # Manually invoke agent
bmad agents kill <agent>            # Stop agent
bmad agents status                  # Show agent health
```

### Workflow Control

```bash
bmad workflow status                # Show current phase
bmad workflow next                  # Transition to next phase
bmad workflow rollback              # Rollback to checkpoint
bmad workflow reset                 # Start over
```

### Validation

```bash
bmad validate all                   # Run all validations
bmad validate skip <gate>           # Skip validation gate
bmad validate override              # Override blocking validation
```

### Metrics

```bash
bmad metrics show                   # Display key metrics
bmad metrics export [format]        # Export metrics (json/csv)
bmad dashboard                      # Open web dashboard
```

### Safety

```bash
bmad safe-mode                      # Toggle safe mode
bmad audit [options]                # Query audit logs
```

---

## Deployment

### Local Development

**Setup:**
```bash
npm install bmad-method
bmad config init
bmad autonomy balanced
```

**Characteristics:**
- Single user
- Local state storage
- Full file system access

### Team Shared

**Setup:**
```bash
# On shared server
npm install -g bmad-method
bmad config set deployment-config.mode team_shared
bmad config set deployment-config.multi_user.enabled true
```

**Characteristics:**
- Multi-user support
- Shared state
- Centralized metrics
- Web dashboard

### CI/CD Integration

**Setup:**
```bash
# In CI pipeline
npm install bmad-method
bmad config set deployment-config.mode ci_cd_integration
bmad config set deployment-config.ci_cd.validation_only true
```

**Example GitHub Actions:**
```yaml
- name: BMAD Validation
  run: |
    npm install bmad-method
    bmad validate all
```

### Docker Deployment

```dockerfile
FROM node:20
WORKDIR /app
RUN npm install -g bmad-method
COPY . .
CMD ["bmad", "dashboard"]
```

```bash
docker build -t bmad-app .
docker run -v $(pwd):/app -p 3001:3001 bmad-app
```

---

## Troubleshooting

### Configuration Issues

**Problem:** Configuration validation fails

**Solution:**
```bash
# View detailed validation errors
bmad config validate

# Reset problematic config
bmad config reset <config-name>

# Restore defaults
bmad config reset
```

### Performance Issues

**Problem:** System running slow

**Solution:**
```bash
# Check health status
bmad agents status

# Reduce concurrent agents
bmad config set autonomy-settings.background_agents.max_concurrent 1

# Enter safe mode temporarily
bmad safe-mode
```

### Dashboard Not Loading

**Problem:** Dashboard won't start

**Solution:**
```bash
# Check port availability
lsof -i :3001

# Try different port
bmad dashboard --port 3002

# Check metrics collection
bmad metrics show
```

### Emergency Recovery

**Problem:** System in bad state

**Solution:**
```bash
# Execute emergency stop
bmad stop

# Enter safe mode
bmad safe-mode

# Run health checks
bmad config validate

# Rollback if needed
bmad workflow rollback

# Resume when ready
bmad resume
```

---

## Best Practices

1. **Start Conservative**
   - Begin with `conservative` autonomy for new projects
   - Gradually increase as you gain confidence

2. **Monitor Regularly**
   - Keep dashboard open during development
   - Review metrics weekly
   - Check audit logs for anomalies

3. **Use Checkpoints**
   - Create checkpoints before major changes
   - Rollback if issues arise

4. **Validate Configuration**
   - Run `bmad config validate` after changes
   - Review validation warnings

5. **Emergency Preparedness**
   - Know how to execute emergency stop
   - Practice rollback procedures
   - Keep recent backups

6. **Incremental Automation**
   - Don't jump to `full_auto` immediately
   - Test each autonomy level thoroughly
   - Adjust based on project needs

---

## Support

- **Documentation:** `/docs`
- **GitHub Issues:** https://github.com/bmadcode/bmad-method/issues
- **Discord:** https://discord.gg/gk8jAdXWmj

---

## Next Steps

1. **Configure your autonomy level** based on project needs
2. **Start the dashboard** to monitor system health
3. **Run your first workflow** with Stage 6 controls
4. **Review metrics** after completion
5. **Adjust settings** based on results

You now have production-ready BMAD with full control and visibility! 🎉
