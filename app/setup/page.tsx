'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface CustomerData {
  customerName: string
  businessName: string
  telegramUsername: string
}

interface SetupState {
  agentName: string
  useCases: string[]
  botToken: string
  botUsername: string
  botName: string
}

const USE_CASE_OPTIONS = [
  { id: 'customer-chat', label: '💬 ตอบแชทลูกค้า', value: 'customer-chat' },
  { id: 'scheduling', label: '📅 จัดการนัดหมาย', value: 'scheduling' },
  { id: 'reporting', label: '📊 สรุปรายงาน', value: 'reporting' },
  { id: 'leads', label: '🎯 ติดตาม Leads', value: 'leads' },
]

function SetupWizard() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [step, setStep] = useState(1)
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [loadingCustomer, setLoadingCustomer] = useState(true)
  const [tokenError, setTokenError] = useState(false)

  const [setup, setSetup] = useState<SetupState>({
    agentName: 'Friday',
    useCases: [],
    botToken: '',
    botUsername: '',
    botName: '',
  })

  const [verifyingToken, setVerifyingToken] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [tokenError2, setTokenError2] = useState('')
  const [progress, setProgress] = useState(0)
  const [completing, setCompleting] = useState(false)

  // Load customer data from token
  useEffect(() => {
    if (!token) {
      setTokenError(true)
      setLoadingCustomer(false)
      return
    }
    fetch(`/api/setup/customer?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setTokenError(true)
        } else {
          setCustomer(data)
        }
        setLoadingCustomer(false)
      })
      .catch(() => {
        setTokenError(true)
        setLoadingCustomer(false)
      })
  }, [token])

  const verifyBotToken = async () => {
    if (!setup.botToken.trim()) return
    setVerifyingToken(true)
    setTokenValid(null)
    setTokenError2('')
    try {
      const res = await fetch('/api/setup/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: setup.botToken.trim() }),
      })
      const data = await res.json()
      if (data.valid) {
        setTokenValid(true)
        setSetup(s => ({ ...s, botUsername: data.username, botName: data.botName }))
      } else {
        setTokenValid(false)
        setTokenError2(data.message || 'Token ไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง')
      }
    } catch {
      setTokenValid(false)
      setTokenError2('เกิดข้อผิดพลาด กรุณาลองใหม่')
    } finally {
      setVerifyingToken(false)
    }
  }

  const completeSetup = async () => {
    setStep(5)
    setCompleting(true)

    // Animate progress bar
    let p = 0
    const interval = setInterval(() => {
      p += Math.random() * 15
      if (p >= 90) { clearInterval(interval); p = 90 }
      setProgress(Math.min(p, 90))
    }, 400)

    try {
      await fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          agentName: setup.agentName,
          useCases: setup.useCases,
          botToken: setup.botToken,
          botUsername: setup.botUsername,
        }),
      })
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setStep(6), 800)
    } catch {
      clearInterval(interval)
      setProgress(100)
      setTimeout(() => setStep(6), 800)
    }
  }

  const toggleUseCase = (value: string) => {
    setSetup(s => ({
      ...s,
      useCases: s.useCases.includes(value)
        ? s.useCases.filter(u => u !== value)
        : [...s.useCases, value],
    }))
  }

  if (loadingCustomer) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cream/60">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  if (tokenError) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-cream mb-2">ลิงก์ไม่ถูกต้อง</h1>
          <p className="text-cream/60">กรุณาใช้ลิงก์ที่ได้รับจากอีเมลยืนยันการชำระเงิน</p>
          <p className="text-cream/40 text-sm mt-4">หากต้องการความช่วยเหลือ ติดต่อ @FridaySupport</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy">
      {/* Progress bar at top */}
      {step <= 4 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-navy/80">
            <div
              className="h-full bg-gradient-to-r from-gold to-yellow-400 transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="max-w-lg mx-auto px-6 py-12 pt-16">

        {/* Step indicators */}
        {step <= 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s < step ? 'bg-gold text-navy' :
                  s === step ? 'bg-gold text-navy ring-4 ring-gold/30' :
                  'bg-navy-800 text-cream/30 border border-cream/10'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 4 && <div className={`w-8 h-px mx-1 ${s < step ? 'bg-gold' : 'bg-cream/10'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* ─── STEP 1: Welcome ─── */}
        {step === 1 && (
          <div className="animate-fadeIn text-center">
            <div className="text-7xl mb-6">🎉</div>
            <h1 className="text-3xl font-bold text-cream mb-3">
              ยินดีต้อนรับ!
            </h1>
            <p className="text-xl text-gold font-medium mb-2">
              สวัสดี, {customer?.customerName || 'คุณลูกค้า'}!
            </p>
            <p className="text-cream/70 mb-2">
              {customer?.businessName && `จาก ${customer.businessName}`}
            </p>
            <p className="text-cream/60 text-lg mb-8">
              มาสร้าง Friday ของคุณกัน 🚀
            </p>
            <div className="bg-[#0F0F2A] border border-gold/20 rounded-2xl p-6 mb-8 text-left">
              <p className="text-cream/80 text-sm leading-relaxed">
                ภายใน 5 นาที Friday จะพร้อมรับ-ตอบแชทลูกค้า จัดการนัดหมาย และช่วยธุรกิจของคุณ 24 ชั่วโมงโดยไม่ต้องนอน 💪
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-4 rounded-2xl text-lg hover:opacity-90 transition-all active:scale-95"
            >
              เริ่มเลย! →
            </button>
          </div>
        )}

        {/* ─── STEP 2: Name your AI ─── */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="text-5xl text-center mb-6">🤖</div>
            <h2 className="text-2xl font-bold text-cream text-center mb-2">
              ตั้งชื่อ AI ของคุณ
            </h2>
            <p className="text-cream/60 text-center mb-8">
              AI จะใช้ชื่อนี้แนะนำตัวกับลูกค้าของคุณ
            </p>
            <div className="mb-6">
              <label className="block text-cream/80 text-sm font-medium mb-2">
                ชื่อ AI ของคุณ
              </label>
              <input
                type="text"
                value={setup.agentName}
                onChange={e => setSetup(s => ({ ...s, agentName: e.target.value }))}
                placeholder="Friday"
                maxLength={30}
                className="w-full bg-[#0F0F2A] border border-gold/30 rounded-xl px-4 py-4 text-cream text-lg focus:outline-none focus:border-gold transition-colors placeholder:text-cream/30"
              />
              <p className="text-cream/40 text-xs mt-2">เช่น Friday, Nova, Aria, Max...</p>
            </div>
            <div className="bg-[#0F0F2A] border border-cream/10 rounded-xl p-4 mb-8">
              <p className="text-cream/60 text-sm">
                💡 <span className="text-gold">{setup.agentName || 'Friday'}</span> จะทักทายลูกค้าว่า
                <br />
                <span className="text-cream/80 italic">"สวัสดีครับ/ค่ะ ผม/หนู {setup.agentName || 'Friday'} AI Assistant ของ {customer?.businessName} ยินดีให้บริการครับ/ค่ะ"</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-cream/20 text-cream/60 font-medium py-4 rounded-2xl hover:border-cream/40 transition-all"
              >
                ← ย้อนกลับ
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!setup.agentName.trim()}
                className="flex-2 flex-grow-[2] bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-40 active:scale-95"
              >
                ต่อไป →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Use Cases ─── */}
        {step === 3 && (
          <div className="animate-fadeIn">
            <div className="text-5xl text-center mb-6">⚡</div>
            <h2 className="text-2xl font-bold text-cream text-center mb-2">
              คุณต้องการให้ {setup.agentName} ช่วยอะไร?
            </h2>
            <p className="text-cream/60 text-center mb-8">
              เลือกได้หลายข้อ (เปลี่ยนได้ภายหลัง)
            </p>
            <div className="space-y-3 mb-8">
              {USE_CASE_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleUseCase(opt.value)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all text-left ${
                    setup.useCases.includes(opt.value)
                      ? 'bg-gold/10 border-gold text-cream'
                      : 'bg-[#0F0F2A] border-cream/10 text-cream/70 hover:border-cream/30'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    setup.useCases.includes(opt.value)
                      ? 'bg-gold border-gold'
                      : 'border-cream/30'
                  }`}>
                    {setup.useCases.includes(opt.value) && (
                      <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium text-lg">{opt.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-cream/20 text-cream/60 font-medium py-4 rounded-2xl hover:border-cream/40 transition-all"
              >
                ← ย้อนกลับ
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={setup.useCases.length === 0}
                className="flex-2 flex-grow-[2] bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-40 active:scale-95"
              >
                ต่อไป →
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Connect Telegram ─── */}
        {step === 4 && (
          <div className="animate-fadeIn">
            <div className="text-5xl text-center mb-6">📱</div>
            <h2 className="text-2xl font-bold text-cream text-center mb-2">
              เชื่อมต่อ Telegram
            </h2>
            <p className="text-cream/60 text-center mb-6">
              สร้าง Bot Telegram สำหรับ {setup.agentName}
            </p>

            {/* Step-by-step guide */}
            <div className="bg-[#0F0F2A] border border-cream/10 rounded-xl p-5 mb-6 space-y-4">
              {[
                { n: 1, text: 'เปิด Telegram แล้วค้นหา', bold: '@BotFather' },
                { n: 2, text: 'พิมพ์', bold: '/newbot' },
                { n: 3, text: 'ตั้งชื่อ Bot เช่น', bold: `${setup.agentName} Bot` },
                { n: 4, text: 'ตั้ง username (ต้องลงท้ายด้วย', bold: '_bot)' },
                { n: 5, text: 'Copy', bold: 'API Token' + ' ที่ได้รับ' },
              ].map(item => (
                <div key={item.n} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gold text-xs font-bold">{item.n}</span>
                  </div>
                  <p className="text-cream/70 text-sm">
                    {item.text} <span className="text-gold font-medium">{item.bold}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Token input */}
            <div className="mb-4">
              <label className="block text-cream/80 text-sm font-medium mb-2">
                วาง API Token ที่นี่
              </label>
              <input
                type="text"
                value={setup.botToken}
                onChange={e => {
                  setSetup(s => ({ ...s, botToken: e.target.value, botUsername: '', botName: '' }))
                  setTokenValid(null)
                  setTokenError2('')
                }}
                placeholder="1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ"
                className="w-full bg-[#0F0F2A] border border-gold/30 rounded-xl px-4 py-4 text-cream text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-cream/30 font-mono"
              />
            </div>

            {/* Verify button */}
            <button
              onClick={verifyBotToken}
              disabled={!setup.botToken.trim() || verifyingToken}
              className="w-full border-2 border-gold/50 text-gold font-semibold py-3 rounded-xl hover:bg-gold/10 transition-all disabled:opacity-40 mb-4 flex items-center justify-center gap-2"
            >
              {verifyingToken ? (
                <>
                  <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                  กำลังทดสอบ...
                </>
              ) : '🔍 ทดสอบ Token'}
            </button>

            {/* Validation feedback */}
            {tokenValid === true && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-4">
                <p className="text-green-400 font-medium">✅ Token ถูกต้อง!</p>
                <p className="text-cream/60 text-sm">Bot: <span className="text-cream">{setup.botName}</span></p>
                <p className="text-cream/60 text-sm">Username: <span className="text-gold">@{setup.botUsername}</span></p>
              </div>
            )}
            {tokenValid === false && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
                <p className="text-red-400">❌ {tokenError2}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 border border-cream/20 text-cream/60 font-medium py-4 rounded-2xl hover:border-cream/40 transition-all"
              >
                ← ย้อนกลับ
              </button>
              <button
                onClick={completeSetup}
                disabled={tokenValid !== true}
                className="flex-2 flex-grow-[2] bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-4 rounded-2xl hover:opacity-90 transition-all disabled:opacity-40 active:scale-95"
              >
                เสร็จสิ้น! 🚀
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 5: Loading ─── */}
        {step === 5 && (
          <div className="animate-fadeIn text-center min-h-[60vh] flex flex-col items-center justify-center">
            <div className="text-7xl mb-6 animate-pulse">✨</div>
            <h2 className="text-2xl font-bold text-cream mb-2">
              Friday กำลังตื่นขึ้น...
            </h2>
            <p className="text-cream/60 mb-10">
              กำลังตั้งค่าระบบ AI ของคุณ
            </p>
            <div className="w-full max-w-xs">
              <div className="bg-[#0F0F2A] rounded-full h-3 overflow-hidden border border-cream/10">
                <div
                  className="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-cream/40 text-sm mt-3">{Math.round(progress)}%</p>
            </div>
            <div className="mt-10 space-y-2 text-left">
              {[
                { label: 'ตั้งค่า AI Agent', done: progress > 20 },
                { label: 'เชื่อมต่อ Telegram Bot', done: progress > 50 },
                { label: 'เปิดใช้งานระบบ', done: progress > 80 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                    item.done ? 'bg-gold text-navy' : 'bg-cream/10 text-cream/30'
                  }`}>
                    {item.done ? '✓' : '○'}
                  </div>
                  <span className={item.done ? 'text-cream/80' : 'text-cream/30'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── STEP 6: Success ─── */}
        {step === 6 && (
          <div className="animate-fadeIn text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-cream mb-2">
              {setup.agentName} พร้อมแล้ว!
            </h2>
            <p className="text-gold font-medium mb-8">
              AI ของคุณกำลังรอรับลูกค้าอยู่แล้ว
            </p>

            {/* Bot link card */}
            <div className="bg-[#0F0F2A] border border-gold/30 rounded-2xl p-6 mb-6 text-left">
              <p className="text-cream/60 text-sm mb-2">Bot ของคุณ</p>
              <a
                href={`https://t.me/${setup.botUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold text-xl font-bold hover:underline"
              >
                t.me/{setup.botUsername}
              </a>
              <p className="text-cream/40 text-xs mt-2">คลิกเพื่อทดสอบใน Telegram</p>
            </div>

            {/* Test button */}
            <a
              href={`https://t.me/${setup.botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-gold to-yellow-500 text-navy font-bold py-4 rounded-2xl text-lg hover:opacity-90 transition-all mb-4 text-center"
            >
              📱 ส่งข้อความทดสอบ
            </a>

            {/* Coming soon channels */}
            <div className="bg-[#0F0F2A] border border-cream/10 rounded-2xl p-5 text-left">
              <p className="text-cream/60 text-sm font-medium mb-4">ช่องทางเพิ่มเติม (เร็วๆ นี้)</p>
              <div className="space-y-3">
                {[
                  { name: 'LINE OA', icon: '💚' },
                  { name: 'Instagram DM', icon: '📸' },
                  { name: 'Facebook Messenger', icon: '💙' },
                ].map(ch => (
                  <div key={ch.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span>{ch.icon}</span>
                      <span className="text-cream/60 text-sm">{ch.name}</span>
                    </div>
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded-full">เร็วๆ นี้</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-cream/30 text-xs mt-6">
              หากต้องการความช่วยเหลือ ติดต่อ @FridaySupport
            </p>
          </div>
        )}

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SetupWizard />
    </Suspense>
  )
}
