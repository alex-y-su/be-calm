# Stage 6: Quick Reference Card

**Version:** 1.0 | **Date:** 2025-10-05

---

## 🚀 Quick Start

```bash
# Initialize
bmad config init

# Set autonomy level
bmad autonomy balanced

# Start dashboard
bmad dashboard
```

---

## ⚙️ Configuration Commands

```bash
bmad config show              # View current config
bmad config set <key> <value> # Update setting
bmad config validate          # Validate config
bmad config reset             # Reset to defaults
```

---

## 🎚️ Autonomy Levels

```bash
bmad autonomy conservative    # Maximum safety
bmad autonomy balanced        # Default (recommended)
bmad autonomy aggressive      # High automation
bmad autonomy full_auto       # Maximum automation
```

| Level | Automation | Safety | Best For |
|-------|------------|--------|----------|
| Conservative | Minimal | Maximum | New users, high-risk |
| Balanced | Moderate | High | Most projects |
| Aggressive | High | Moderate | Experienced teams |
| Full Auto | Maximum | Advisory | Rapid prototyping |

---

## 🤖 Agent Management

```bash
bmad agents list              # Show active agents
bmad agents invoke <agent>    # Manually invoke
bmad agents kill <agent>      # Stop agent
bmad agents status            # Health check
```

---

## 🔄 Workflow Control

```bash
bmad workflow status          # Current phase
bmad workflow next            # Next phase
bmad workflow rollback        # Rollback to checkpoint
bmad workflow reset           # Start over
```

---

## ✅ Validation

```bash
bmad validate all             # Run all validations
bmad validate skip <gate>     # Skip gate
bmad validate override        # Override validation
```

---

## 📊 Metrics & Monitoring

```bash
bmad metrics show             # Display key metrics
bmad metrics export json      # Export as JSON
bmad metrics export csv       # Export as CSV
bmad dashboard                # Open web dashboard
```

### Dashboards

- **Real-time:** http://localhost:3001/dashboard/realtime
- **Health:** http://localhost:3001/dashboard/health
- **Learning:** http://localhost:3001/dashboard/learning
- **Project:** http://localhost:3001/dashboard/project

---

## 🛡️ Safety Controls

```bash
bmad stop                     # Emergency stop
bmad resume                   # Resume after stop
bmad safe-mode                # Toggle safe mode
bmad pause                    # Pause automation
bmad workflow rollback        # Rollback
```

### Emergency Stop Flow

```bash
bmad stop                     # Halt everything
# Fix issues...
bmad resume                   # Restart when ready
```

---

## 📝 Audit Logs

```bash
bmad audit                    # View recent logs
bmad audit --category agent   # Filter by category
bmad audit --action validation # Filter by action
bmad audit --limit 100        # Limit results
```

### Categories

- `agent` - Agent invocations
- `validation` - Validation results
- `state` - State transitions
- `override` - User overrides
- `configuration` - Config changes
- `error` - Errors

---

## 🔧 Common Tasks

### Change Autonomy Level

```bash
bmad autonomy <level>
```

### View System Health

```bash
bmad agents status
bmad metrics show
bmad dashboard
```

### Create Checkpoint Before Major Change

```bash
bmad workflow status          # Check current state
# Make changes...
bmad workflow rollback        # If needed
```

### Export Metrics for Analysis

```bash
bmad metrics export json > metrics-$(date +%Y%m%d).json
```

### Monitor in Real-time

```bash
bmad dashboard                # Open in browser
# Leave running during development
```

---

## 🆘 Troubleshooting

### System Running Slow

```bash
bmad config set autonomy-settings.background_agents.max_concurrent 1
bmad safe-mode                # If needed
```

### Configuration Issues

```bash
bmad config validate          # Check for errors
bmad config reset             # Reset if broken
```

### Emergency Recovery

```bash
bmad stop                     # Halt everything
bmad safe-mode                # Enter safe mode
# Investigate and fix...
bmad resume                   # When ready
```

### Dashboard Won't Start

```bash
# Check port availability
lsof -i :3001

# Try different port
bmad dashboard --port 3002
```

---

## 📋 Configuration Keys

### Autonomy Settings

```bash
autonomy-settings.level                              # conservative|balanced|aggressive|full_auto
autonomy-settings.auto_agent_switching.enabled       # true|false
autonomy-settings.background_agents.max_concurrent   # number
autonomy-settings.auto_command_execution.enabled     # true|false
autonomy-settings.truth_validation.oracle_blocking   # true|false
```

### Truth Settings

```bash
truth-settings.domain_truth.auto_create              # true|false
truth-settings.eval_datasets.coverage_threshold      # 0.0-1.0
truth-settings.validation.oracle_validation          # blocking|warning|advisory
```

### Metrics Settings

```bash
metrics-config.collection.enabled                    # true|false
metrics-config.dashboards.port                       # number
metrics-config.alerting.enabled                      # true|false
```

---

## 🎯 Best Practices

1. **Start Conservative**
   - Begin with `conservative` for new projects
   - Increase autonomy gradually

2. **Monitor Regularly**
   - Keep dashboard open during work
   - Review metrics weekly

3. **Use Checkpoints**
   - Before major changes
   - After successful milestones

4. **Check Health**
   - Run `bmad config validate` after changes
   - Monitor `bmad agents status`

5. **Review Logs**
   - Check `bmad audit` for anomalies
   - Export for analysis

---

## 📞 Support

- **Docs:** `/docs/stage-6-user-guide.md`
- **GitHub:** https://github.com/bmadcode/bmad-method
- **Discord:** https://discord.gg/gk8jAdXWmj

---

## 🔗 Quick Links

| What | Command | URL/Path |
|------|---------|----------|
| User Guide | - | `/docs/stage-6-user-guide.md` |
| Dashboard | `bmad dashboard` | `http://localhost:3001` |
| Metrics | `bmad metrics show` | - |
| Health | `bmad agents status` | - |
| Config | `bmad config show` | `.bmad-config/` |
| Logs | `bmad audit` | `.bmad-audit/` |

---

**Print this page and keep it handy!** 📄
