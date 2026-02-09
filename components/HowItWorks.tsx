export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'ตอบคำถาม 10 ข้อเกี่ยวกับธุรกิจคุณ',
      description: 'บอกเราว่าคุณต้องการให้ Friday ช่วยอะไร ใช้เวลาแค่ 5 นาที'
    },
    {
      number: '2',
      title: 'เราสร้าง AI Assistant ให้คุณภายใน 10 นาที',
      description: 'ระบบจะปรับแต่ง AI ให้เหมาะกับธุรกิจคุณโดยเฉพาะ'
    },
    {
      number: '3',
      title: 'เริ่มใช้งานผ่าน Telegram ได้ทันที',
      description: 'เพิ่ม Friday เข้า Telegram และเริ่มใช้งานได้ทันที ง่ายเหมือนคุยกับเพื่อน'
    },
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          ใช้งานได้<span className="gradient-text">ใน 3 ขั้นตอน</span>
        </h2>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 md:mb-16 last:mb-0">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
                {/* Number circle */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center text-navy font-bold text-2xl md:text-3xl shadow-xl">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-navy/50 border border-gold/20 rounded-2xl p-6 md:p-8 hover:border-gold/50 transition-all duration-300">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-cream">
                    {step.title}
                  </h3>
                  <p className="text-base md:text-lg text-cream/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-9 top-20 w-0.5 h-16 bg-gradient-to-b from-gold/50 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12 md:mt-16">
          <p className="text-lg md:text-xl text-gold font-semibold">
            ⚡ Setup เสร็จใน 15 นาที - เริ่มใช้งานได้ทันที
          </p>
        </div>
      </div>
    </section>
  )
}
