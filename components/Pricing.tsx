'use client'

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding bg-navy/50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-text">ลงทุนครั้งเดียว</span> ได้พนักงานตลอดชีพ
        </h2>
        <p className="text-center text-cream/70 mb-12 md:mb-16 text-base md:text-lg">
          Setup ครั้งเดียว + ดูแลรายเดือน — ถูกกว่าจ้างพนักงาน 5 เท่า
        </p>

        {/* Single Plan */}
        <div className="max-w-lg mx-auto mb-12 md:mb-16">
          <div className="bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold rounded-2xl p-8 md:p-10 shadow-2xl shadow-gold/30">
            <div className="text-center mb-2">
              <span className="bg-gold text-navy px-4 py-1 rounded-full text-sm font-bold">
                GET YOUR FRIDAY
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-cream mt-4">
              AI Executive Assistant
            </h3>

            {/* Setup Fee */}
            <div className="text-center mb-2">
              <span className="text-cream/60 text-sm uppercase tracking-wider">ค่า Setup (ครั้งเดียว)</span>
            </div>
            <div className="text-center mb-6">
              <span className="text-5xl md:text-6xl font-bold text-gold">
                ฿35,000
              </span>
            </div>

            {/* Monthly */}
            <div className="text-center mb-8 pb-8 border-b border-gold/30">
              <span className="text-cream/60 text-sm">+ ดูแลรายเดือน </span>
              <span className="text-2xl md:text-3xl font-bold text-cream">
                ฿5,000
              </span>
              <span className="text-cream/60 text-lg">/เดือน</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'AI Assistant ส่วนตัวสำหรับธุรกิจคุณ',
                'จำทุกอย่างเกี่ยวกับธุรกิจ (Memory)',
                'ใช้งานผ่าน Telegram / LINE ได้ทันที',
                'ทำงาน 24/7 ไม่มีวันหยุด',
                'ตอบแชทลูกค้า ติดตาม Sales',
                'สรุปรายงาน วิเคราะห์ข้อมูล',
                'เขียน Content โพสต์โซเชียล',
                'จัดการนัดหมาย ติดตามงาน',
                'Setup เสร็จภายใน 24 ชั่วโมง',
                'ซัพพอร์ตตลอด ยกเลิกได้ทุกเมื่อ',
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm md:text-base">
                  <span className="text-gold mr-3 mt-1 flex-shrink-0">✓</span>
                  <span className="text-cream/80">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/onboard"
              className="block w-full py-4 rounded-full font-semibold text-center transition-all duration-300 bg-gold text-navy hover:bg-gold/90 shadow-lg text-lg"
            >
              เริ่มต้นใช้งาน Friday →
            </a>
          </div>
        </div>

        {/* Comparison */}
        <div className="max-w-3xl mx-auto bg-navy/80 border border-gold/30 rounded-2xl p-6 md:p-8">
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-center text-gold">
            เปรียบเทียบกับการจ้างพนักงาน
          </h3>
          <div className="space-y-3 text-sm md:text-base text-cream/80">
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <span>💼 เงินเดือนพนักงาน</span>
              <span className="text-red-400 font-semibold">฿15,000-30,000/เดือน</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <span>🏥 ประกันสังคม</span>
              <span className="text-red-400 font-semibold">฿750+/เดือน</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <span>🌴 วันลา ลาป่วย</span>
              <span className="text-red-400 font-semibold">~1-2 เดือน/ปี</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <span>💔 ความเสี่ยงลาออก</span>
              <span className="text-red-400 font-semibold">สูง</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-gold/20">
              <span>📚 Training พนักงานใหม่</span>
              <span className="text-red-400 font-semibold">1-3 เดือน</span>
            </div>
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-gold">⚡ Friday AI Assistant</span>
              <span className="text-gold font-bold text-xl">฿5,000/เดือน</span>
            </div>
            <div className="text-center pt-4 text-cream/50 text-sm">
              * Setup ฿35,000 ครั้งเดียว — เทียบเท่า training พนักงานใหม่ 2 สัปดาห์
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
