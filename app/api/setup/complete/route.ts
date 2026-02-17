import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bktfmvgutvvtxfagmgqq.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8477111494:AAGRT3BQE3MMF6_uPyBaqRCfoQEhHKv2flg'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1460936021'

async function notifyJedi(customerName: string, agentName: string, botUsername: string, useCases: string[]) {
  const useCaseLabels: Record<string, string> = {
    'customer-chat': 'ตอบแชทลูกค้า',
    'scheduling': 'จัดการนัดหมาย',
    'reporting': 'สรุปรายงาน',
    'leads': 'ติดตาม Leads',
  }
  const useCasesText = useCases.map(u => useCaseLabels[u] || u).join(', ')

  const message = `🤖 *FRIDAY SETUP COMPLETE!*

👤 *ลูกค้า:* ${customerName}
🤖 *ชื่อ AI:* ${agentName}
📱 *Telegram Bot:* @${botUsername}
⚡ *Use Cases:* ${useCasesText || 'ไม่ได้ระบุ'}

✅ *Status:* กำลังตั้งค่า (configuring)
🔗 *Bot link:* t.me/${botUsername}

_ระบบจะเปิดใช้งานอัตโนมัติใน 2-5 นาที_`

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
    const { token, agentName, useCases, botToken, botUsername } = await request.json()

    if (!token || !botToken || !botUsername) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not set')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Update the customer record with completed setup
    const { data, error } = await supabase
      .from('friday_customers')
      .update({
        agent_name: agentName || 'Friday',
        use_cases: useCases || [],
        bot_token: botToken,
        telegram_username: botUsername,
        status: 'configuring',
        configured_at: new Date().toISOString(),
      })
      .eq('token', token)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Token not found' }, { status: 404 })
    }

    // Notify Jedi
    try {
      await notifyJedi(
        data.customer_name || 'Unknown',
        agentName || 'Friday',
        botUsername,
        useCases || []
      )
    } catch (notifyErr) {
      console.error('Telegram notify error:', notifyErr)
      // Non-fatal — continue
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('complete route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
