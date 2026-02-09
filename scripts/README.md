# Friday Provisioning Scripts

## Overview
This directory contains the provisioning engine for creating new Friday AI assistant instances for customers.

## Provision Agent Script

### Usage
```bash
npx ts-node scripts/provision-agent.ts --config path/to/customer.json
```

### What It Does
1. Creates agent workspace at `~/.openclaw/agents/{agent-name}/workspace/`
2. Generates personalized configuration files:
   - `IDENTITY.md` - Agent personality tailored to industry
   - `SOUL.md` - Mission, values, and purpose
   - `USER.md` - Customer profile and preferences
   - `TOOLS.md` - Available integrations and capabilities
   - `HEARTBEAT.md` - Proactive check-in schedule
3. Creates `memory/` directory with initial log
4. Saves customer config for reference

### Example
See `example-customer.json` for the expected data format.

```bash
npx ts-node scripts/provision-agent.ts --config scripts/example-customer.json
```

### Customer Data Format
```json
{
  "businessName": "Business Name",
  "industry": "ร้านอาหาร | คลินิค | อสังหาริมทรัพย์ | E-commerce | บริการ | การศึกษา | อื่นๆ",
  "teamSize": "1-5 | 6-20 | 21-50 | 50+",
  "needs": ["customer-support", "analytics", "content", "scheduling", "sales", "other"],
  "otherNeed": "Optional: custom need description",
  "channels": ["telegram", "line"],
  "telegramUsername": "username (if telegram selected)",
  "lineOAID": "@line-oa-id (if line selected)",
  "customerName": "Full Name",
  "phone": "Phone number",
  "email": "email@example.com",
  "mainNeed": "What they most want help with"
}
```

### Industry Personalities
The script automatically tailors the agent personality based on industry:

- **ร้านอาหาร** - Friendly and warm, focused on reservations and menu
- **คลินิค** - Professional and reassuring, patient care focused
- **อสังหาริมทรัพย์** - Consultative, property and investment focused
- **E-commerce** - Energetic and helpful, product recommendations
- **บริการ** - Professional and helpful, service bookings
- **การศึกษา** - Knowledgeable and encouraging, course information
- **อื่นๆ** - Professional and adaptable

## Workflow Integration

### 1. Customer Signs Up (Onboarding Page)
Customer completes form at `/onboard`

### 2. API Endpoint Processes Submission
- Validates data
- Sends Telegram notification to Jedi
- Saves JSON to /tmp

### 3. Manual Provisioning (For Now)
```bash
# Download customer JSON from /tmp or Telegram notification
npx ts-node scripts/provision-agent.ts --config customer.json
```

### 4. Future: Automated Provisioning
- API endpoint could trigger provisioning directly
- Or use a queue system for batch processing
- GitHub Actions or similar CI/CD pipeline

## Next Steps After Provisioning

1. **Review Generated Files**
   - Check `~/.openclaw/agents/{agent-name}/workspace/`
   - Verify personality and configuration

2. **Set Up Integrations**
   - Configure Telegram bot for the customer
   - Set up LINE OA connection
   - Add necessary API credentials to TOOLS.md

3. **Test Agent**
   ```bash
   openclaw agent:{agent-name}
   ```

4. **Send Welcome Message**
   - Contact customer via their preferred channel
   - Provide bot username/links
   - Guide them through first interaction

5. **Monitor & Iterate**
   - Check agent logs
   - Gather customer feedback
   - Refine personality and capabilities

## Security Notes
- Never commit customer data to git
- Keep credentials in environment variables or secure vaults
- Use `.gitignore` to exclude customer JSON files
- Telegram bot tokens and API keys should be in `.env.local`

## Development
- Script is written in TypeScript
- Requires `ts-node` to run
- Uses Node.js built-in `fs` and `path` modules
- No external dependencies for core functionality
