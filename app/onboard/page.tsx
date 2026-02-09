'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface FormData {
  businessName: string
  industry: string
  teamSize: string
  needs: string[]
  otherNeed: string
  channels: string[]
  telegramUsername: string
  lineOAID: string
  customerName: string
  phone: string
  email: string
  mainNeed: string
}

const industries = [
  'ร้านอาหาร',
  'คลินิค',
  'อสังหาริมทรัพย์',
  'E-commerce',
  'บริการ',
  'การศึกษา',
  'อื่นๆ',
]

const teamSizes = ['1-5', '6-20', '21-50', '50+']

const needOptions = [
  { id: 'customer-support', label: '📧 ตอบแชทลูกค้า', value: 'customer-support' },
  { id: 'analytics', label: '📊 สรุปรายงาน วิเคราะห์ข้อมูล', value: 'analytics' },
  { id: 'content', label: '📝 เขียน Content โพสต์', value: 'content' },
  { id: 'scheduling', label: '💼 จัดการนัดหมาย ติดตามงาน', value: 'scheduling' },
  { id: 'sales', label: '💰 Sales & Follow-up', value: 'sales' },
  { id: 'other', label: '🔧 อื่นๆ', value: 'other' },
]

const channelOptions = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'line', label: 'LINE' },
]

export default function OnboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'starter'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    industry: '',
    teamSize: '',
    needs: [],
    otherNeed: '',
    channels: [],
    telegramUsername: '',
    lineOAID: '',
    customerName: '',
    phone: '',
    email: '',
    mainNeed: '',
  })

  const totalSteps = 4

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleNeed = (need: string) => {
    setFormData((prev) => ({
      ...prev,
      needs: prev.needs.includes(need)
        ? prev.needs.filter((n) => n !== need)
        : [...prev.needs, need],
    }))
  }

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }))
  }

  const canProceed = () => {
    if (step === 1) {
      return formData.businessName && formData.industry && formData.teamSize
    }
    if (step === 2) {
      return formData.needs.length > 0
    }
    if (step === 3) {
      return (
        formData.channels.length > 0 &&
        (!formData.channels.includes('telegram') || formData.telegramUsername) &&
        (!formData.channels.includes('line') || formData.lineOAID)
      )
    }
    if (step === 4) {
      return formData.customerName && formData.phone && formData.email && formData.mainNeed
    }
    return false
  }

  const handleSubmit = async () => {
    if (!canProceed()) return

    setLoading(true)
    try {
      const response = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      console.error(error)
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A0A1A] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="text-7xl mb-6">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#EDE3D0] mb-4">
            Friday ของคุณกำลังถูกสร้าง!
          </h1>
          <p className="text-xl text-[#EDE3D0]/70 mb-8">
            คุณจะได้รับลิงก์ Telegram ภายใน 10 นาที
          </p>
          <p className="text-[#EDE3D0]/60 mb-8">
            เราจะส่งรายละเอียดการเข้าใช้งานไปที่อีเมลและ {formData.channels.join(', ')} ของคุณ
          </p>
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

  return (
    <div className="min-h-screen bg-[#0A0A1A] py-8 px-4">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-8">
        <Link href="/" className="inline-flex items-center text-[#B8963E] hover:text-[#B8963E]/80 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าแรก
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold text-[#EDE3D0] mb-2">
          สร้าง Friday ของคุณ
        </h1>
        <p className="text-[#EDE3D0]/70">
          ใช้เวลาแค่ 2 นาที เพื่อสร้าง AI Assistant ที่เหมาะกับธุรกิจของคุณ
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-all ${
                  s <= step
                    ? 'bg-[#B8963E] text-[#0A0A1A]'
                    : 'bg-[#0A0A1A] border-2 border-[#B8963E]/30 text-[#B8963E]/30'
                }`}
              >
                {s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? 'bg-[#B8963E]' : 'bg-[#B8963E]/20'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-[#EDE3D0]/60 px-1">
          <span>ธุรกิจ</span>
          <span>ความต้องการ</span>
          <span>ช่องทาง</span>
          <span>ข้อมูลติดต่อ</span>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto bg-[#0A0A1A] border border-[#B8963E]/30 rounded-2xl p-6 md:p-8">
        {/* Step 1: About Your Business */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">เกี่ยวกับธุรกิจของคุณ</h2>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">ชื่อธุรกิจ *</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => updateField('businessName', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                placeholder="เช่น Beauty Clinic XYZ"
              />
            </div>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">ประเภทธุรกิจ *</label>
              <select
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
              >
                <option value="">เลือกประเภทธุรกิจ</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">จำนวนพนักงาน *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {teamSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateField('teamSize', size)}
                    className={`py-3 px-4 rounded-lg font-medium transition-all ${
                      formData.teamSize === size
                        ? 'bg-[#B8963E] text-[#0A0A1A]'
                        : 'bg-[#0A0A1A] border border-[#B8963E]/30 text-[#EDE3D0] hover:border-[#B8963E]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: What Do You Need? */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">เลือก Friday ที่เหมาะกับคุณ</h2>
            <p className="text-[#EDE3D0]/70 mb-4">เลือกได้มากกว่า 1 ข้อ</p>

            <div className="space-y-3">
              {needOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.needs.includes(option.value)
                      ? 'border-[#B8963E] bg-[#B8963E]/10'
                      : 'border-[#B8963E]/20 hover:border-[#B8963E]/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.needs.includes(option.value)}
                    onChange={() => toggleNeed(option.value)}
                    className="mt-1 mr-3 w-5 h-5 accent-[#B8963E]"
                  />
                  <span className="text-[#EDE3D0] font-medium">{option.label}</span>
                </label>
              ))}
            </div>

            {formData.needs.includes('other') && (
              <div>
                <label className="block text-[#EDE3D0] mb-2 font-medium">
                  บอกเราว่าคุณต้องการอะไร
                </label>
                <textarea
                  value={formData.otherNeed}
                  onChange={(e) => updateField('otherNeed', e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all min-h-[100px]"
                  placeholder="เช่น จัดการสต็อกสินค้า, ติดตามการจัดส่ง"
                />
              </div>
            )}
          </div>
        )}

        {/* Step 3: Communication */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">ช่องทางการสื่อสาร</h2>

            <div>
              <label className="block text-[#EDE3D0] mb-3 font-medium">
                ช่องทางที่ต้องการ (เลือกได้มากกว่า 1) *
              </label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {channelOptions.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => toggleChannel(channel.id)}
                    className={`py-4 px-6 rounded-lg font-medium transition-all ${
                      formData.channels.includes(channel.id)
                        ? 'bg-[#B8963E] text-[#0A0A1A]'
                        : 'bg-[#0A0A1A] border border-[#B8963E]/30 text-[#EDE3D0] hover:border-[#B8963E]'
                    }`}
                  >
                    {channel.label}
                  </button>
                ))}
              </div>
            </div>

            {formData.channels.includes('telegram') && (
              <div>
                <label className="block text-[#EDE3D0] mb-2 font-medium">
                  Telegram Username *
                </label>
                <div className="flex items-center">
                  <span className="text-[#EDE3D0]/70 mr-2">@</span>
                  <input
                    type="text"
                    value={formData.telegramUsername}
                    onChange={(e) => updateField('telegramUsername', e.target.value)}
                    className="flex-1 bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                    placeholder="yourusername"
                  />
                </div>
              </div>
            )}

            {formData.channels.includes('line') && (
              <div>
                <label className="block text-[#EDE3D0] mb-2 font-medium">LINE OA ID *</label>
                <input
                  type="text"
                  value={formData.lineOAID}
                  onChange={(e) => updateField('lineOAID', e.target.value)}
                  className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                  placeholder="@your-line-oa"
                />
                <p className="text-sm text-[#EDE3D0]/60 mt-2">
                  หา LINE OA ID ได้ที่ LINE Official Account Manager
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: About You */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#B8963E] mb-4">ข้อมูลของคุณ</h2>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">ชื่อ-นามสกุล *</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                placeholder="คุณสมศรี ใจดี"
              />
            </div>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">เบอร์โทร *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                placeholder="0891234567"
              />
            </div>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">อีเมล *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-[#EDE3D0] mb-2 font-medium">
                สิ่งที่อยากให้ Friday ช่วยมากที่สุด *
              </label>
              <textarea
                value={formData.mainNeed}
                onChange={(e) => updateField('mainNeed', e.target.value)}
                className="w-full bg-[#0A0A1A] border border-[#B8963E]/30 rounded-lg px-4 py-3 text-[#EDE3D0] focus:outline-none focus:border-[#B8963E] transition-all min-h-[120px]"
                placeholder="เช่น ต้องการให้ช่วยตอบแชทลูกค้าใน LINE และจัดการนัดหมาย"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 px-6 rounded-full border-2 border-[#B8963E] text-[#B8963E] font-semibold hover:bg-[#B8963E]/10 transition-all"
            >
              ย้อนกลับ
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                canProceed()
                  ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                  : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
              }`}
            >
              ถัดไป
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                canProceed() && !loading
                  ? 'bg-[#B8963E] text-[#0A0A1A] hover:bg-[#B8963E]/90'
                  : 'bg-[#B8963E]/30 text-[#0A0A1A]/50 cursor-not-allowed'
              }`}
            >
              {loading ? 'กำลังสร้าง Friday...' : 'เริ่มใช้งาน'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
