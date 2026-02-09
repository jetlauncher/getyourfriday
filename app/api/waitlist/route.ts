import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'กรุณากรอกอีเมลที่ถูกต้อง' },
        { status: 400 }
      )
    }

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data')
    try {
      await fs.mkdir(dataDir, { recursive: true })
    } catch (error) {
      // Directory already exists, ignore error
    }

    const filePath = path.join(dataDir, 'waitlist.json')

    // Read existing data or create new array
    let waitlist: Array<{ email: string; timestamp: string }> = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      waitlist = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist yet, start with empty array
    }

    // Check if email already exists
    if (waitlist.some(entry => entry.email === email)) {
      return NextResponse.json(
        { error: 'อีเมลนี้ลงทะเบียนแล้ว' },
        { status: 400 }
      )
    }

    // Add new email
    waitlist.push({
      email,
      timestamp: new Date().toISOString(),
    })

    // Save to file
    await fs.writeFile(filePath, JSON.stringify(waitlist, null, 2))

    return NextResponse.json(
      { success: true, message: 'ลงทะเบียนสำเร็จ!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
}
