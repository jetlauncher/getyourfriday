'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface FormData {
  agentName: string
  useCases: string[]
  botToken: string
  botUsername: string
  botName: string
}

const useCaseOptions = [
  { id: 'customer-support', label: '💬 ตอบแชทลูกค้า', value: 'customer-support' },
  { id: 'scheduling', label: '📅 จัดการนัดหมาย', value: 'scheduling' },
  { id: 'analytics', label: '📊 สรุปรายงาน', value: 'analytics' },
  { id: 'leads', label: '🎯 ติดตาม leads', value: 'leads' },
]

function SetupForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const customerName = searchParams.get('name') || 'ลูกค้า'
  const businessName = searchParams.get('business') || 'ธุรกิจ'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    agentName: 'Friday',
    useCases: [],
    botToken: '',
    botUsername: '',
    botName: '',
  })
  const [error, setError] = useState('')

  const totalSteps = 6

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const toggleUseCase = (useCase: string) => {
    setFormData((prev) => ({
      ...prev,
      useCases: prev.useCases.includes(useCase)
        ? prev.useCases.filter((u) => u !== useCase)
        : [...prev.useCases, useCase],
    }))
  }

  const canProceed = () => {
    if (step === 1) return true
    if (step === 2) return formData.agentName.trim().length > 0
    if (step === 3) return formData.useCases.length > 0
    if (step === 4) return verified && formData.botToken
    if (step === 5) return true
    return false
  }

  const verifyToken = async () => {
    if (!formData.botToken) return

    setVerifying(true)
    setError('')

    try {
      const response = await fetch('/api/setup/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ botToken: formData.botToken }),
      })

      const data = await response.json()

      if (data.valid) {
        setVerified(true)
        updateField('botUsername', data.username)
        updateField('botName', data.botName)
      } else {
        setError(data.error || 'Token ไม่ถูกต้อง')
        setVerified(false)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setVerified(false)
    } finally {
      setVerifying(false)
    }
  }

  const completeSetup = async () => {
    setStep(5)
    setLoading(true)

    try {
      const response = await fetch('/api/setup/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          agentName: formData.agentName,
          useCases: formData.useCases,
          botToken: formData.botToken,
          botUsername: formData.botUsername,
          customerName,
          businessName,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep(6)
      } else {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        setStep(4)
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1A] py-8 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#EDE3D0] mb-2">
          ตั้งค่า Friday
        </h1>
        <p className="text-[#EDE3D0]/70">
          สร้าง AI Assistant สำหรับ {businessName}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all text-sm ${
                  s <= step
                    ? 'bg-[#B8963E] text-[#0A0A1A]'
                    : 'bg-[#0A0A1A] border-2 border-[#B8963E]/30 text-[#B8963E]/30'
                }`}
              >
                {s}
              </div>
              {s < 6 && (
                <div
                  className={`flex-1 h-1 mx-1 md:mx-2 transition-all ${
                    s < step ? 'bg-[#B8963E]' : 'bg-[#B8963E]/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#EDE3D0]/60 px-1">
          <span>ยินดีต้อนรับ</span>
          <span>ชื่อ AI</span>
          <span>ฟีเจอร์</span>
          <span>Telegram</span>
          <span>กำลังตั้งค่า</span>
          <span>เสร็จ!</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-2xl mx-auto bg-[#0A0A1A] border border-[#B8963E]/30 rounded-2xl p-6 md:p-8">
        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center py-8">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-[#B8963E] mb-4">
              ยินดีต้อนรับ{customerName !== 'ลูกค้า' ? ` ${customerName}` : ''}!
            </h2>
            <p className="text-xl text-[#EDE3D0] mb-4">
              มาสร้าง Friday ของคุณกัน
            </p>
            <p className="text-[#EDE3D0]/70 mb-8">
              ใช้เวลาแค่ 2-3 นาที เพื่อตั้งค่า AI Assistant สำหรับ{businessName}
            </p>
            <button
              onClick={() => setStep(2)}
              className="bg-[#B8963E] text-[#0A0A1A] px-10 py-4 rounded-full font-semibold hover:bg-[#B8963E]/90 transition-all"
            >
              เริ่มต้น 🚀
            </button>
          </div>
        )}

        {/* Step 2: Name Your AI */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">ตั้งชื่อ AI ของคุณ</h2>
            <p className="text-[#EDE3D0]/70 mb-6">
              คุณจะเรียก AI ว่าอะไร?
            </p>

            <div>
              <input
                type="text"
                value={formData.agentName}
                onChange={(e) => updateField('agentName', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-4 text-xl text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all text-center"
                placeholder="Friday"
              />
              <p className="text-sm text-[#EDE3D0]/60 mt-3 text-center">
                ชื่อนี้จะแสดงในการสนทนากับลูกค้า
              </p>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-6 rounded-full border-2 border-[#B8963E] text-[#B8963E] font-semibold hover:bg-[#B8963E]/10 transition-all"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canProceed()}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  canProceed()
                    ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                    : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
                }`}
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Use Cases */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-2">คุณต้องการให้ Friday ช่วยอะไร?</h2>
            <p className="text-[#EDE3D0]/70 mb-4">เลือกได้มากกว่า 1 ข้อ</p>

            <div className="space-y-3">
              {useCaseOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.useCases.includes(option.value)
                      ? 'border-[#B8963E] bg-[#B8963E]/10'
                      : 'border-[#B8963E]/20 hover:border-[#B8963E]/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.useCases.includes(option.value)}
                    onChange={() => toggleUseCase(option.value)}
                    className="mr-3 w-5 h-5 accent-[#B8963E]"
                  />
                  <span className="text-[#EDE3D0] font-medium">{option.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 px-6 rounded-full border-2 border-[#B8963E] text-[#B8963E] font-semibold hover:bg-[#B8963E]/10 transition-all"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!canProceed()}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  canProceed()
                    ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                    : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
                }`}
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Connect Telegram */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">เชื่อมต่อ Telegram</h2>

            {/* Instructions */}
            <div className="bg-[#0A0A1A] border border-[#B8963E]/20 rounded-xl p-5 space-y-4">
              <p className="text-[#EDE3D0]/80 font-medium">วิธีสร้าง Bot:</p>
              <ol className="space-y-3 text-[#EDE3D0]/70">
                <li className="flex gap-3">
                  <span className="text-[#B8963E] font-bold">1.</span>
                  <span>เปิด Telegram ค้นหา <strong className="text-[#EDE3D0]">@BotFather</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#B8963E] font-bold">2.</span>
                  <span>พิมพ์ <code className="bg-[#B8963E]/20 px-2 py-0.5 rounded text-[#B8963E]">/newbot</code> แล้วตั้งชื่อ bot</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#B8963E] font-bold">3.</span>
                  <span>Copy token ที่ได้รับ (รูปแบบ: <code className="bg-[#B8963E]/20 px-2 py-0.5 rounded text-[#B8963E]">123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11</code>)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#B8963E] font-bold">4.</span>
                  <span>วาง token ในช่องด้านล่าง</span>
                </li>
              </ol>
            </div>

            {/* Token Input */}
            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">Bot Token</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={formData.botToken}
                  onChange={(e) => {
                    updateField('botToken', e.target.value)
                    setVerified(false)
                  }}
                  className="flex-1 bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all font-mono text-sm"
                  placeholder="วาง token ที่นี่..."
                />
                <button
                  onClick={verifyToken}
                  disabled={!formData.botToken || verifying}
                  className={`px-5 py-3 rounded-lg font-medium transition-all ${
                    formData.botToken && !verifying
                      ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                      : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
                  }`}
                >
                  {verifying ? 'กำลังตรวจ...' : 'ทดสอบ Token'}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
              {verified && (
                <div className="flex items-center gap-2 text-green-400 mt-3">
                  <span>✅</span>
                  <span>เชื่อมต่อสำเร็จ! Bot: <strong>{formData.botName}</strong> (@{formData.botUsername})</span>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 px-6 rounded-full border-2 border-[#B8963E] text-[#B8963E] font-semibold hover:bg-[#B8963E]/10 transition-all"
              >
                ย้อนกลับ
              </button>
              <button
                onClick={completeSetup}
                disabled={!verified || loading}
                className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                  verified && !loading
                    ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                    : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
                }`}
              >
                {loading ? 'กำลังตั้งค่า...' : 'เชื่อมต่อ & สร้าง'}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Loading */}
        {step === 5 && (
          <div className="text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto border-4 border-[#B8963E]/30 border-t-[#B8963E] rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">
              Friday กำลังตื่นขึ้น...
            </h2>
            <p className="text-[#EDE3D0]/70">
              กำลังตั้งค่าระบบให้คุณ กรุณารอสักครู่ ⏳
            </p>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && (
          <div className="text-center py-8">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-[#B8963E] mb-4">
              Friday พร้อมแล้ว!
            </h2>
            <p className="text-xl text-[#EDE3D0] mb-8">
              {formData.agentName} พร้อมช่วยเหลือคุณแล้ว
            </p>

            {/* Bot Link */}
            <a
              href={`https://t.me/${formData.botUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#B8963E] text-[#0A0A1A] px-8 py-4 rounded-full font-semibold hover:bg-[#B8963E]/90 transition-all mb-8"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.696.064-1.225-.46-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              เริ่มคุยกับ Friday
            </a>

            {/* Coming Soon Badges */}
            <div className="flex justify-center gap-4">
              <div className="bg-[#0A0A1A] border border-[#B8963E]/20 rounded-full px-5 py-2 text-[#EDE3D0]/60 text-sm">
                📱 LINE — เร็วๆ นี้
              </div>
              <div className="bg-[#0A0A1A] border border-[#B8963E]/20 rounded-full px-5 py-2 text-[#EDE3D0]/60 text-sm">
                📸 Instagram — เร็วๆ นี้
              </div>
            </div>

            <p className="text-[#EDE3D0]/50 text-sm mt-8">
              คุณสามารถเริ่มใช้งานได้ทันทีที่ t.me/{formData.botUsername}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SetupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A1A] flex items-center justify-center">
        <div className="text-[#B8963E] text-xl">กำลังโหลด...</div>
      </div>
    }>
      <SetupForm />
    </Suspense>
  )
}
