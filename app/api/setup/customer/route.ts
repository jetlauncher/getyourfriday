import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://bktfmvgutvvtxfagmgqq.supabase.co'
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 })
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabase
      .from('friday_customers')
      .select('customer_name, business_name, telegram_username, status')
      .eq('token', token)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    return NextResponse.json({
      customerName: data.customer_name,
      businessName: data.business_name,
      telegramUsername: data.telegram_username,
      status: data.status,
    })
  } catch (err) {
    console.error('customer route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
