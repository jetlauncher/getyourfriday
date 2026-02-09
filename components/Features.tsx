export default function Features() {
  const features = [
    {
      icon: '🧠',
      title: 'จำทุกอย่างเกี่ยวกับธุรกิจคุณ',
      subtitle: 'Memory',
      description: 'จดจำประวัติ ความชอบ และข้อมูลสำคัญทุกอย่างของธุรกิจคุณ ไม่ต้องบอกซ้ำ'
    },
    {
      icon: '💬',
      title: 'คุยผ่าน Telegram / LINE ได้ทันที',
      subtitle: 'Instant Chat',
      description: 'ไม่ต้องเปิด App ใหม่ คุยผ่านแชทที่คุณใช้อยู่แล้วทุกวัน ง่ายและสะดวก'
    },
    {
      icon: '⚡',
      title: 'ทำงาน Automate ได้ 24/7',
      subtitle: 'Always On',
      description: 'ทำงานให้คุณตลอด 24 ชั่วโมง ไม่เคยหยุด ไม่เคยลา ไม่เคยป่วย'
    },
    {
      icon: '📊',
      title: 'วิเคราะห์ข้อมูล สรุปรายงาน',
      subtitle: 'Smart Analytics',
      description: 'อ่านข้อมูล วิเคราะห์ และสรุปรายงานให้คุณในรูปแบบที่เข้าใจง่าย'
    },
    {
      icon: '📧',
      title: 'ช่วยตอบ email, แชท, ติดตามลูกค้า',
      subtitle: 'Auto Response',
      description: 'ตอบข้อความ จัดการลูกค้า และติดตามงานแทนคุณอัตโนมัติ'
    },
    {
      icon: '🇹🇭',
      title: 'เข้าใจภาษาไทยอย่างสมบูรณ์',
      subtitle: 'Thai Native',
      description: 'ออกแบบมาสำหรับคนไทยโดยเฉพาะ เข้าใจบริบทและวัฒนธรรมการทำงานแบบไทย'
    },
  ]

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Friday</span> คือ AI Executive Assistant
          </h2>
          <p className="text-lg md:text-xl text-cream/80">ส่วนตัวของคุณ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-navy/50 border border-gold/20 rounded-2xl p-6 md:p-8 hover:border-gold/60 transition-all duration-300 group hover:bg-navy/80"
            >
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gold">
                {feature.subtitle}
              </h3>
              <h4 className="text-base md:text-lg font-bold mb-3 text-cream">
                {feature.title}
              </h4>
              <p className="text-sm md:text-base text-cream/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
