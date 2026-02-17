import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
})

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8477111494:AAGRT3BQE3MMF6_uPyBaqRCfoQEhHKv2flg'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1460936021'
const PRICE_ID = 'price_1T1ow7L635dy15nN4Fuy1Qvp'

async function sendTelegramNotification(data: any) {
  const needs = Array.isArray(data.needs) ? data.needs.join(', ') : data.needs
  const message = `🔔 *NEW FRIDAY CUSTOMER!* 🔔

💼 *ธุรกิจ:* ${data.businessName}
🏢 *ประเภท:* ${data.industry}
👥 *ขนาดทีม:* ${data.teamSize}

📋 *ต้องการ:* ${needs}
💬 *ช่องทาง:* ${Array.isArray(data.channels) ? data.channels.join(', ') : data.channels}
${data.telegramUsername ? `📱 *Telegram:* @${data.telegramUsername}` : ''}
${data.lineOAID ? `💚 *LINE OA:* ${data.lineOAID}` : ''}

👤 *ชื่อ:* ${data.customerName}
📞 *โทร:* ${data.phone}
📧 *อีเมล:* ${data.email}

💡 *สิ่งที่ต้องการมากที่สุด:*
${data.mainNeed}

💰 *แพ็กเกจ:* ฿1,490/เดือน (ทดลองฟรี 7 วัน)

⏳ *Status:* กำลังไปชำระเงิน Stripe...`

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
  try {
    const data = await request.json()

    // Validate required fields
    const required = ['businessName', 'industry', 'teamSize', 'needs', 'channels', 'customerName', 'phone', 'email', 'mainNeed']
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `กรุณากรอก ${field}` }, { status: 400 })
      }
    }

    // Notify Jedi on Telegram
    await sendTelegramNotification(data)

    // Create Stripe Checkout Session with customer metadata
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      customer_email: data.email,
      subscription_data: {
        trial_period_days: 7,
        metadata: {
          customerName: data.customerName,
          telegramUsername: data.telegramUsername || '',
          lineOAID: data.lineOAID || '',
          businessName: data.businessName,
          industry: data.industry,
          phone: data.phone,
          channels: Array.isArray(data.channels) ? data.channels.join(',') : data.channels,
          mainNeed: data.mainNeed.substring(0, 490),
        },
      },
      metadata: {
        customerName: data.customerName,
        telegramUsername: data.telegramUsername || '',
        businessName: data.businessName,
        phone: data.phone,
        channels: Array.isArray(data.channels) ? data.channels.join(',') : data.channels,
      },
      success_url: 'https://getyourfriday.ai/success',
      cancel_url: 'https://getyourfriday.ai/onboard',
    })

    return NextResponse.json({ url: session.url }, { status: 200 })
  } catch (error: any) {
    console.error('Onboard error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
