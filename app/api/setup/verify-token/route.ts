import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { botToken } = await request.json()

    if (!botToken) {
      return NextResponse.json(
        { valid: false, error: 'กรุณาระบุ bot token' },
        { status: 400 }
      )
    }

    // Call Telegram API to verify token
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.ok) {
      return NextResponse.json({
        valid: true,
        botName: data.result.first_name,
        username: data.result.username,
      })
    } else {
      return NextResponse.json(
        { valid: false, error: 'Token ไม่ถูกต้อง กรุณาตรวจสอบและลองใหม่' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Verify token error:', error)
    return NextResponse.json(
      { valid: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่' },
      { status: 500 }
    )
  }
}
