'use client'

import { useState } from 'react'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('🎉 สำเร็จ! เราจะติดต่อคุณเร็วๆ นี้')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      setStatus('error')
      setMessage('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    }

    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <section id="waitlist" className="section-padding">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            พร้อมมี <span className="gradient-text">Friday</span> ของคุณเอง?
          </h2>
          
          <p className="text-lg md:text-xl text-cream/80 mb-8">
            สมัคร Early Access วันนี้ รับส่วนลด <span className="text-gold font-bold">40% ตลอดชีพ</span>
          </p>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมลของคุณ"
                required
                disabled={status === 'loading'}
                className="flex-1 px-6 py-4 rounded-full bg-navy border-2 border-gold/30 text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition-all duration-300 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-4 bg-gold hover:bg-gold/90 text-navy font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                {status === 'loading' ? 'กำลังส่ง...' : 'สมัคร Early Access'}
              </button>
            </div>
          </form>

          {message && (
            <div className={`p-4 rounded-lg ${
              status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {message}
            </div>
          )}

          <p className="text-sm text-cream/50 mt-6">
            🎁 Early Access members รับส่วนลด 40% ตลอดชีพ + 1 เดือนทดลองใช้ฟรี
          </p>

          <div className="mt-8 pt-8 border-t border-gold/20">
            <p className="text-xs text-cream/40">
              Powered by <span className="text-gold font-semibold">Limitless Club</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
