import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { botToken } = await request.json()

    if (!botToken || typeof botToken !== 'string') {
      return NextResponse.json({ valid: false, message: 'กรุณาระบุ Bot Token' })
    }

    const cleanToken = botToken.trim()

    // Call Telegram API to validate token
    const res = await fetch(`https://api.telegram.org/bot${cleanToken}/getMe`, {
      method: 'GET',
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({
        valid: false,
        message: 'Token ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่',
      })
    }

    const data = await res.json()

    if (!data.ok || !data.result) {
      return NextResponse.json({
        valid: false,
        message: 'Token ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่',
      })
    }

    return NextResponse.json({
      valid: true,
      botName: data.result.first_name,
      username: data.result.username,
      id: data.result.id,
    })
  } catch (err) {
    console.error('verify-token error:', err)
    return NextResponse.json({
      valid: false,
      message: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
    })
  }
}
