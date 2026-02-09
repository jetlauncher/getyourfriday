import { NextRequest, NextResponse } from 'next/server'

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Send Telegram notification
async function sendTelegramNotification(email: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.error('Telegram credentials missing')
    return false
  }

  try {
    const timestamp = new Date().toLocaleString('th-TH', { 
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    const message = `🔔 New Friday Waitlist Signup!\n📧 ${email}\n⏰ ${timestamp}`

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Telegram notification failed:', error)
    return false
  }
}

// Add to Notion database
async function addToNotion(email: string): Promise<boolean> {
  const notionKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!notionKey || !databaseId) {
    console.warn('Notion credentials missing - skipping Notion storage')
    return false
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionKey}`,
        'Notion-Version': '2025-09-03',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          'Email': {
            title: [{ text: { content: email } }]
          },
          'Signed Up': {
            date: { start: new Date().toISOString() }
          },
          'Source': {
            select: { name: 'website' }
          },
          'Status': {
            select: { name: 'waitlist' }
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Notion API error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Notion storage failed:', error)
    return false
  }
}

// Check for duplicates in Notion
async function checkDuplicateInNotion(email: string): Promise<boolean> {
  const notionKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!notionKey || !databaseId) {
    return false // Can't check, assume not duplicate
  }

  try {
    // Convert database_id to data_source_id for querying
    // In the new API, we need to query data_sources
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionKey}`,
          'Notion-Version': '2025-09-03',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            property: 'Email',
            title: { equals: email }
          }
        })
      }
    )

    if (!response.ok) {
      console.warn('Could not check for duplicates in Notion')
      return false
    }

    const data = await response.json()
    return data.results && data.results.length > 0
  } catch (error) {
    console.error('Duplicate check failed:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลที่ถูกต้อง' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicateInNotion(email.toLowerCase())
    if (isDuplicate) {
      return NextResponse.json(
        { error: 'อีเมลนี้ลงทะเบียนแล้ว' },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }

    // PRIORITY #1: Send Telegram notification
    const telegramSent = await sendTelegramNotification(email)
    
    // BONUS: Try to save to Notion
    const notionSaved = await addToNotion(email)

    // Success if Telegram worked (Notion is optional)
    if (telegramSent) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'ลงทะเบียนสำเร็จ!',
          notionSaved // For debugging
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    } else {
      // Telegram failed - this is a problem
      console.error('Critical: Telegram notification failed for', email)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          }
        }
      )
    }
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    )
  }
}

// Handle CORS preflight
export async function OPTIONS(request: NextRequest) {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}
