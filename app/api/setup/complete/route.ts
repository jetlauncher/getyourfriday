import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8477111494:AAGRT3BQE3MMF6_uPyBaqRCfoQEhHKv2flg'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1460936021'

export async function POST(request: NextRequest) {
  try {
    const {
      token,
      agentName,
      useCases,
      botToken,
      botUsername,
      customerName,
      businessName,
    } = await request.json()

    if (!token || !agentName || !botToken || !botUsername) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      )
    }

    // Send notification to Jedi
    const message = `⚙️ *FRIDAY SETUP COMPLETE!*

👤 *Customer:* ${customerName || 'N/A'}
💼 *Business:* ${businessName || 'N/A'}
🤖 *Agent:* ${agentName}
📋 *Use Cases:* ${useCases.join(', ') || 'ไม่ได้ระบุ'}
📱 *Bot:* @${botUsername}
🔑 *Token:* \`${botToken}\`

✅ *Ready to provision!*`

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete setup error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาด' },
      { status: 500 }
    )
  }
}
