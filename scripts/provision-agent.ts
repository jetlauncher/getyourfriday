#!/usr/bin/env ts-node

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

interface CustomerData {
  businessName: string
  industry: string
  teamSize: string
  needs: string[]
  otherNeed?: string
  channels: string[]
  telegramUsername?: string
  lineOAID?: string
  customerName: string
  phone: string
  email: string
  mainNeed: string
}

// Industry-specific personality configurations
const industryPersonalities: Record<
  string,
  { tone: string; focus: string; greeting: string }
> = {
  'ร้านอาหาร': {
    tone: 'friendly and warm',
    focus: 'customer satisfaction, reservations, menu inquiries',
    greeting: 'สวัสดีค่ะ! ยินดีต้อนรับสู่',
  },
  'คลินิค': {
    tone: 'professional, warm, and reassuring',
    focus: 'patient care, appointments, medical inquiries',
    greeting: 'สวัสดีค่ะ ยินดีให้บริการ',
  },
  'อสังหาริมทรัพย์': {
    tone: 'professional and consultative',
    focus: 'property inquiries, viewings, investment opportunities',
    greeting: 'สวัสดีครับ/ค่ะ ยินดีให้คำปรึกษา',
  },
  'E-commerce': {
    tone: 'energetic and helpful',
    focus: 'product recommendations, order tracking, customer support',
    greeting: 'สวัสดีค่ะ! มีอะไรให้ช่วยไหมคะ',
  },
  'บริการ': {
    tone: 'professional and helpful',
    focus: 'service inquiries, bookings, customer satisfaction',
    greeting: 'สวัสดีครับ/ค่ะ ยินดีให้บริการ',
  },
  'การศึกษา': {
    tone: 'knowledgeable and encouraging',
    focus: 'course information, enrollment, student support',
    greeting: 'สวัสดีค่ะ ยินดีให้ข้อมูล',
  },
  'อื่นๆ': {
    tone: 'professional and adaptable',
    focus: 'customer service, inquiries, support',
    greeting: 'สวัสดีครับ/ค่ะ',
  },
}

function generateIdentityMD(data: CustomerData): string {
  const personality = industryPersonalities[data.industry] || industryPersonalities['อื่นๆ']

  return `# IDENTITY.md - ${data.businessName} Friday AI Assistant

## Core Identity
- **Name:** Friday (${data.businessName})
- **Role:** AI Assistant for ${data.businessName}
- **Industry:** ${data.industry}
- **Personality:** ${personality.tone}

## Communication Style
- **Tone:** ${personality.tone}
- **Language:** Primarily Thai, English when needed
- **Greeting:** "${personality.greeting} ${data.businessName}"
- **Brand Voice:** Professional yet personable, efficient yet warm

## Primary Focus Areas
${personality.focus}

## Customer Needs Priority
${data.needs.map((n) => `- ${n}`).join('\n')}
${data.otherNeed ? `- ${data.otherNeed}` : ''}

## Special Context
${data.mainNeed}

---
Generated: ${new Date().toISOString()}
`
}

function generateSoulMD(data: CustomerData): string {
  const personality = industryPersonalities[data.industry] || industryPersonalities['อื่นๆ']

  return `# SOUL.md - Your Purpose & Values

## Your Mission
You are Friday, the AI assistant for ${data.businessName}. Your purpose is to help ${data.customerName} and their team by ${data.mainNeed.toLowerCase()}.

## Core Values
1. **Customer First** - Always prioritize the customer's needs and satisfaction
2. **Efficiency** - Save time and streamline operations
3. **Reliability** - Be consistent, accurate, and dependable
4. **Proactivity** - Anticipate needs before being asked
5. **Empathy** - Understand and respond to emotions appropriately

## How You Help
${data.needs.includes('customer-support') ? '- **Customer Support:** Respond to customer inquiries promptly and professionally\n' : ''}${data.needs.includes('analytics') ? '- **Analytics:** Provide insights and data summaries to inform business decisions\n' : ''}${data.needs.includes('content') ? '- **Content Creation:** Draft engaging posts and marketing content\n' : ''}${data.needs.includes('scheduling') ? '- **Scheduling:** Manage appointments and follow-ups efficiently\n' : ''}${data.needs.includes('sales') ? '- **Sales Support:** Nurture leads and close deals\n' : ''}

## Boundaries
- Never promise what you can't deliver
- Escalate complex issues to ${data.customerName}
- Respect privacy and confidentiality
- Stay within your scope of knowledge

## Success Metrics
You're successful when:
- Customers feel heard and helped
- ${data.customerName} has more time for strategic work
- Operations run smoothly without manual intervention
- The business grows and thrives

---
Remember: You're not just a tool - you're a trusted member of the ${data.businessName} team.
`
}

function generateUserMD(data: CustomerData): string {
  return `# USER.md - About ${data.customerName}

## Business Owner Profile
- **Name:** ${data.customerName}
- **Business:** ${data.businessName}
- **Industry:** ${data.industry}
- **Team Size:** ${data.teamSize} employees

## Contact Information
- **Phone:** ${data.phone}
- **Email:** ${data.email}
${data.telegramUsername ? `- **Telegram:** @${data.telegramUsername}\n` : ''}${data.lineOAID ? `- **LINE OA:** ${data.lineOAID}\n` : ''}

## Communication Preferences
- **Primary Channels:** ${data.channels.join(', ')}
- **Language:** Thai (default), English when needed

## Business Context
${data.mainNeed}

## What They Value Most
Based on their sign-up, they prioritize:
${data.needs.map((n, i) => `${i + 1}. ${n}`).join('\n')}

## How to Support Them
- Be proactive but not intrusive
- Provide actionable insights
- Save them time on repetitive tasks
- Help them focus on growth and strategy

---
Last updated: ${new Date().toISOString()}
`
}

function generateToolsMD(data: CustomerData): string {
  return `# TOOLS.md - Available Tools & Integrations

## Communication Channels
${data.channels.includes('telegram') ? `- **Telegram:** @${data.telegramUsername}\n` : ''}${data.channels.includes('line') ? `- **LINE:** ${data.lineOAID}\n` : ''}

## Configured Capabilities
${data.needs.includes('customer-support') ? '- Customer support via messaging platforms\n' : ''}${data.needs.includes('analytics') ? '- Data analysis and reporting\n' : ''}${data.needs.includes('content') ? '- Content creation tools\n' : ''}${data.needs.includes('scheduling') ? '- Calendar and appointment management\n' : ''}${data.needs.includes('sales') ? '- CRM and sales tracking\n' : ''}

## Integration Notes
- This is a starter configuration
- Additional tools can be added based on business needs
- Credentials and API keys should be added by the administrator

## Future Enhancements
- [ ] Custom integrations
- [ ] Advanced automation workflows
- [ ] Analytics dashboards
- [ ] Multi-agent collaboration

---
For technical setup, contact support or refer to OpenClaw documentation.
`
}

function generateHeartbeatMD(data: CustomerData): string {
  return `# HEARTBEAT.md - Check-in Schedule

## Daily Tasks
${data.needs.includes('customer-support') ? '- Check for unanswered customer messages\n' : ''}${data.needs.includes('scheduling') ? '- Review upcoming appointments (next 24-48 hours)\n' : ''}${data.needs.includes('analytics') ? '- Monitor key business metrics\n' : ''}

## Weekly Tasks
${data.needs.includes('content') ? '- Prepare content ideas for the week\n' : ''}${data.needs.includes('sales') ? '- Review sales pipeline and follow-ups\n' : ''}${data.needs.includes('analytics') ? '- Generate weekly summary report\n' : ''}

## Proactive Reminders
- Check in with ${data.customerName} if no interaction for 48+ hours
- Surface important insights or patterns
- Suggest optimizations based on observed workflows

## Quiet Hours
- Late night (23:00-07:00) - Only urgent matters
- Respect business hours and personal time

## When to Reach Out
- Critical customer issues
- Upcoming deadlines or appointments
- Significant business opportunities
- Weekly summary ready for review

---
Balance helpfulness with respect for ${data.customerName}'s time and attention.
`
}

function provisionAgent(configPath: string) {
  console.log('🚀 Friday Agent Provisioning System\n')

  // Read customer data
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Config file not found: ${configPath}`)
    process.exit(1)
  }

  const data: CustomerData = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  console.log(`📋 Provisioning agent for: ${data.businessName}`)
  console.log(`👤 Customer: ${data.customerName}\n`)

  // Generate agent name (slug)
  const agentName = data.businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)

  console.log(`🏷️  Agent name: ${agentName}`)

  // Create workspace directory
  const workspaceDir = path.join(
    process.env.HOME || '~',
    '.openclaw',
    'agents',
    agentName,
    'workspace'
  )

  console.log(`📁 Workspace: ${workspaceDir}`)

  if (fs.existsSync(workspaceDir)) {
    console.log(`⚠️  Workspace already exists. Backing up...`)
    const backupDir = `${workspaceDir}.backup.${Date.now()}`
    fs.renameSync(workspaceDir, backupDir)
    console.log(`   Backup created: ${backupDir}`)
  }

  fs.mkdirSync(workspaceDir, { recursive: true })

  // Create memory directory
  const memoryDir = path.join(workspaceDir, 'memory')
  fs.mkdirSync(memoryDir, { recursive: true })

  // Generate and write workspace files
  console.log('\n📝 Generating workspace files...')

  const files = [
    { name: 'IDENTITY.md', content: generateIdentityMD(data) },
    { name: 'SOUL.md', content: generateSoulMD(data) },
    { name: 'USER.md', content: generateUserMD(data) },
    { name: 'TOOLS.md', content: generateToolsMD(data) },
    { name: 'HEARTBEAT.md', content: generateHeartbeatMD(data) },
  ]

  files.forEach((file) => {
    const filepath = path.join(workspaceDir, file.name)
    fs.writeFileSync(filepath, file.content)
    console.log(`   ✓ ${file.name}`)
  })

  // Create initial memory file
  const today = new Date().toISOString().split('T')[0]
  const memoryFile = path.join(memoryDir, `${today}.md`)
  const memoryContent = `# ${today} - First Day

## Provisioning Complete
- Agent created for ${data.businessName}
- Customer: ${data.customerName}
- Industry: ${data.industry}
- Primary needs: ${data.needs.join(', ')}

## Next Steps
- [ ] Set up communication channels
- [ ] Configure integrations
- [ ] First contact with ${data.customerName}
- [ ] Begin learning business workflows

---
Ready to serve! 🎉
`
  fs.writeFileSync(memoryFile, memoryContent)
  console.log(`   ✓ memory/${today}.md`)

  // Save customer config for reference
  const configSavePath = path.join(workspaceDir, 'customer-config.json')
  fs.writeFileSync(configSavePath, JSON.stringify(data, null, 2))
  console.log(`   ✓ customer-config.json`)

  console.log('\n✅ Provisioning complete!')
  console.log(`\n📦 Agent workspace: ${workspaceDir}`)
  console.log(`\n🎯 Next steps:`)
  console.log(`   1. Review generated files`)
  console.log(`   2. Set up ${data.channels.join(' and ')} integration`)
  console.log(`   3. Test agent with: openclaw agent:${agentName}`)
  console.log(`   4. Send welcome message to ${data.customerName}`)
  console.log('\n🚀 Your Friday is ready to work!\n')
}

// CLI
const args = process.argv.slice(2)
const configIndex = args.indexOf('--config')

if (configIndex === -1 || !args[configIndex + 1]) {
  console.error('Usage: npx ts-node provision-agent.ts --config <path-to-customer.json>')
  process.exit(1)
}

const configPath = path.resolve(args[configIndex + 1])
provisionAgent(configPath)
