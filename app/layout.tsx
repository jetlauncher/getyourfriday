import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Get Your Friday - AI Executive Assistant สำหรับผู้ประกอบการไทย',
  description: 'AI Executive Assistant ที่ทำงานให้คุณ 24/7 ไม่มีวันลา ไม่มีวันลาออก เริ่มต้นเพียง ฿5,000/เดือน',
  keywords: 'AI Assistant, Executive Assistant, ผู้ช่วยส่วนตัว, Automation, ไทย, Limitless Club',
  authors: [{ name: 'Limitless Club' }],
  openGraph: {
    title: 'Get Your Friday - AI Executive Assistant สำหรับผู้ประกอบการไทย',
    description: 'AI Executive Assistant ที่ทำงานให้คุณ 24/7 ไม่มีวันลา ไม่มีวันลาออก',
    url: 'https://getyourfriday.ai',
    siteName: 'Get Your Friday',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Your Friday - AI Executive Assistant',
    description: 'AI Executive Assistant ที่ทำงานให้คุณ 24/7 ไม่มีวันลา ไม่มีวันลาออก',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  )
}
