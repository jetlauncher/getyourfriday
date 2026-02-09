export default function Problem() {
  const problems = [
    { icon: '😰', text: 'ทำทุกอย่างเอง ไม่มีใครช่วย' },
    { icon: '⏰', text: 'ไม่มีเวลาให้ตัวเอง ทำงานตลอด' },
    { icon: '💔', text: 'พนักงานลาออกบ่อย ต้องหาคนใหม่ทุกที' },
    { icon: '🔄', text: 'งานซ้ำๆ กินเวลามาก ไม่มีเวลาคิดกลยุทธ์' },
  ]

  return (
    <section className="section-padding bg-navy/50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 md:mb-16">
          คุณเคยรู้สึก<span className="gradient-text">แบบนี้ไหม?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-navy/80 border border-gold/20 rounded-2xl p-6 md:p-8 hover:border-gold/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-4xl md:text-5xl mb-4">{problem.icon}</div>
              <p className="text-base md:text-lg text-cream/90 leading-relaxed">{problem.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 md:mt-16 text-lg md:text-xl text-gold font-semibold">
          ถ้าคำตอบคือ "ใช่" แสดงว่าคุณต้องการ <span className="gradient-text">Friday</span>
        </p>
      </div>
    </section>
  )
}
