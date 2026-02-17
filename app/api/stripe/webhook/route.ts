import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8477111494:AAGRT3BQE3MMF6_uPyBaqRCfoQEhHKv2flg'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1460936021'
const DO_API_TOKEN = process.env.DO_API_TOKEN || ''

async function createDroplet(customerName: string, telegramUsername: string, businessName: string) {
  const safeName = (telegramUsername || customerName).replace(/[^a-z0-9-]/gi, '-').toLowerCase().substring(0, 30)
  const dropletName = `friday-${safeName}-${Date.now().toString().slice(-6)}`

  const userDataScript = `#!/bin/bash
set -e
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git

# Install OpenClaw
npm install -g openclaw@latest

# Log
echo "OpenClaw installed for: ${businessName}" > /var/log/friday-setup.log
echo "Customer: ${customerName}" >> /var/log/friday-setup.log
echo "Telegram: @${telegramUsername}" >> /var/log/friday-setup.log
echo "Setup complete at: $(date)" >> /var/log/friday-setup.log
`

  const response = await fetch('https://api.digitalocean.com/v2/droplets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: dropletName,
      region: 'sgp1',
      size: 's-1vcpu-2gb',
      image: 'ubuntu-24-04-x64',
      user_data: userDataScript,
      tags: ['friday-customer', 'auto-provisioned'],
    }),
  })

  const result = await response.json()
  return result.droplet
}

async function notifyJedi(metadata: any, dropletId: number, dropletName: string) {
  const message = `⚡ *FRIDAY CUSTOMER PAID!* ⚡

✅ *ชำระเงินสำเร็จ — ทดลองฟรี 7 วัน เริ่มแล้ว*

👤 *ลูกค้า:* ${metadata.customerName}
💼 *ธุรกิจ:* ${metadata.businessName}
📱 *Telegram:* @${metadata.telegramUsername || 'ไม่ได้ระบุ'}
📞 *โทร:* ${metadata.phone}
💬 *ช่องทาง:* ${metadata.channels}

🖥️ *Droplet สร้างแล้ว:*
• ID: ${dropletId}
• ชื่อ: ${dropletName}
• Region: Singapore
• Size: 1 vCPU / 2GB RAM
• Status: กำลัง boot (รอ ~2 นาที)

📋 *ขั้นตอนถัดไป:*
1. รอ droplet boot (~2 นาที)
2. ส่ง welcome message ให้ @${metadata.telegramUsername || 'ลูกค้า'}
3. ดู IP ที่: https://cloud.digitalocean.com/droplets

🔗 *Setup Link:* https://getyourfriday.ai/setup?token=${dropletId}&name=${encodeURIComponent(metadata.customerName)}&business=${encodeURIComponent(metadata.businessName)}`

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  })
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || '')
  } catch (err: any) {
    console.error('Webhook signature failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const metadata = session.metadata || {}

    try {
      // Create DigitalOcean droplet
      const droplet = await createDroplet(
        metadata.customerName || 'customer',
        metadata.telegramUsername || '',
        metadata.businessName || 'business'
      )

      // Notify Jedi
      await notifyJedi(metadata, droplet?.id, droplet?.name)
    } catch (err) {
      console.error('Provisioning error:', err)
      // Still return 200 to Stripe — log the error but don't fail the webhook
    }
  }

  return NextResponse.json({ received: true })
}
