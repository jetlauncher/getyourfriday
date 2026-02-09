import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8477111494:AAGRT3BQE3MMF6_uPyBaqRCfoQEhHKv2flg'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1460936021'

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

💰 *แพ็กเกจ:* Setup ฿35,000 + ฿5,000/เดือน

⚡ *Action:* Provision agent NOW!`

  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
    return res.ok
  } catch (error) {
    console.error('Telegram notification failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const required = ['businessName', 'industry', 'teamSize', 'needs', 'channels', 'customerName', 'phone', 'email', 'mainNeed']
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `กรุณากรอก ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email
    if (!data.email.includes('@')) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลที่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Send Telegram notification to Jedi
    await sendTelegramNotification(data)

    return NextResponse.json(
      { success: true, message: 'ลงทะเบียนสำเร็จ! เราจะติดต่อกลับภายใน 10 นาที' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Onboard error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
