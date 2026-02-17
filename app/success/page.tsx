'use client'

import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#0A0A1A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="text-7xl mb-6">🎉</div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#EDE3D0] mb-4">
          Friday ของคุณกำลังถูกสร้าง!
        </h1>
        <p className="text-xl text-[#EDE3D0]/70 mb-4">
          ทดลองใช้ฟรี 7 วัน เริ่มต้นแล้ว ✅
        </p>
        <p className="text-[#EDE3D0]/60 mb-8">
          ทีมงานจะส่งลิงก์เริ่มใช้งานให้คุณภายใน <span className="text-[#B8963E] font-semibold">10 นาที</span><br />
          ผ่านทาง Telegram หรืออีเมลที่คุณให้ไว้
        </p>
        <div className="bg-[#B8963E]/10 border border-[#B8963E]/30 rounded-2xl p-6 mb-8">
          <p className="text-[#EDE3D0]/80 text-sm">
            💳 บัตรของคุณจะถูกเรียกเก็บ <strong className="text-[#B8963E]">฿1,490</strong> หลังจากทดลองฟรี 7 วัน<br />
            ยกเลิกได้ทุกเมื่อก่อนวันที่ 8
          </p>
        </div>
        <Link
          href="/"
          className="inline-block bg-[#B8963E] text-[#0A0A1A] px-8 py-3 rounded-full font-semibold hover:bg-[#B8963E]/90 transition-all"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  )
}
