export default function Testimonials() {
  const testimonials = [
    {
      quote: 'Friday ช่วยให้ผมมีเวลากลับไปทำในสิ่งที่สำคัญจริงๆ แทนที่จะติดอยู่กับงาน admin ตลอดเวลา',
      name: 'คุณภูมิ',
      business: 'CEO, E-commerce Startup',
    },
    {
      quote: 'ตอนแรกไม่เชื่อว่า AI จะดีขนาดนี้ แต่หลังจากใช้งาน 2 สัปดาห์ ไม่สามารถจินตนาการว่าจะทำงานโดยไม่มี Friday ได้อย่างไร',
      name: 'คุณนิดา',
      business: 'Founder, Digital Agency',
    },
    {
      quote: 'จากที่เคยจ้างผู้ช่วยส่วนตัว 2 คน ตอนนี้ Friday ทำงานได้ครอบคลุมกว่า และไม่เคยลา ไม่เคยลืม ไม่เคยผิดพลาด',
      name: 'คุณเจมส์',
      business: 'Managing Director, Investment Firm',
    },
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-4">
          <p className="text-gold text-lg md:text-xl font-semibold mb-6">
            1,000+ ผู้ประกอบการไทยเชื่อมั่นใน Limitless Club
          </p>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          คำแนะนำจาก<span className="gradient-text">ผู้ใช้จริง</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-navy/50 border border-gold/20 rounded-2xl p-6 md:p-8 hover:border-gold/50 transition-all duration-300"
            >
              <div className="text-gold text-4xl mb-4">"</div>
              <p className="text-sm md:text-base text-cream/80 mb-6 leading-relaxed italic">
                {testimonial.quote}
              </p>
              <div className="border-t border-gold/20 pt-4">
                <p className="font-semibold text-cream">{testimonial.name}</p>
                <p className="text-sm text-cream/60">{testimonial.business}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-gold/20 to-transparent border border-gold/30 rounded-full px-6 md:px-8 py-3 md:py-4">
            <p className="text-sm md:text-base text-cream/90">
              <span className="text-gold font-semibold">จาก Workshop สู่ Product</span> — เราใช้ระบบนี้เองทุกวัน
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
