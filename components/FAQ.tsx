'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'ต้องมีความรู้ด้าน tech ไหม?',
      answer: 'ไม่ต้องเลย! Friday ออกแบบมาให้ใช้งานง่ายเหมือนคุยกับเพื่อน เพียงแค่คุณพิมพ์ข้อความได้ ก็ใช้งานได้แล้ว ไม่ต้องเขียนโค้ดหรือตั้งค่าซับซ้อนใดๆ'
    },
    {
      question: 'ใช้ได้กับธุรกิจประเภทไหน?',
      answer: 'ทุกประเภท! ไม่ว่าจะเป็น E-commerce, Agency, Consulting, Restaurant, Retail, Services หรือธุรกิจอะไรก็ตาม Friday สามารถปรับแต่งให้เข้ากับธุรกิจของคุณได้'
    },
    {
      question: 'ข้อมูลปลอดภัยไหม?',
      answer: 'ปลอดภัยแน่นอน! ข้อมูลทุกอย่างถูก encrypt และเก็บแยกตามแต่ละบัญชี ไม่มีการแชร์ข้อมูลระหว่าง user คุณเป็นเจ้าของข้อมูลของคุณ 100% และสามารถลบได้ทุกเมื่อ'
    },
    {
      question: 'ยกเลิกได้ไหม?',
      answer: 'ยกเลิกได้ทุกเมื่อ ไม่มีสัญญาผูกมัด ไม่มีค่าธรรมเนียมยกเลิก ถ้าคุณไม่พอใจก็สามารถหยุดใช้งานได้ทันที เราจะคืนเงินให้ภายใน 30 วัน (ถ้าคุณไม่พอใจ)'
    },
    {
      question: 'ต่างจาก ChatGPT ยังไง?',
      answer: 'Friday ต่างจาก ChatGPT ตรงที่: 1) จำประวัติและบริบทของธุรกิจคุณได้ 2) ทำงานอัตโนมัติและเชื่อมต่อกับ tools ต่างๆ ได้ 3) ตอบคำถามตาม context ของธุรกิจคุณโดยเฉพาะ 4) ไม่ต้อง login หลาย platform ใช้ผ่าน LINE/Telegram ที่คุณใช้อยู่แล้ว'
    },
    {
      question: 'ใช้เวลาเท่าไหร่ในการ setup?',
      answer: 'ใช้เวลาแค่ 15-20 นาที! คุณแค่ตอบคำถาม 10 ข้อเกี่ยวกับธุรกิจ ระบบจะสร้าง AI Assistant ที่เหมาะกับคุณโดยเฉพาะ แล้วคุณก็เริ่มใช้งานได้ทันที'
    },
  ]

  return (
    <section className="section-padding bg-navy/50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          คำถามที่<span className="gradient-text">พบบ่อย</span>
        </h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-navy border border-gold/20 rounded-2xl overflow-hidden hover:border-gold/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 md:p-8 flex justify-between items-start gap-4"
              >
                <h3 className="text-lg md:text-xl font-semibold text-cream flex-1">
                  {faq.question}
                </h3>
                <span className={`text-gold text-2xl flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-45' : ''
                }`}>
                  +
                </span>
              </button>
              
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8">
                  <p className="text-sm md:text-base text-cream/80 leading-relaxed border-t border-gold/10 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
