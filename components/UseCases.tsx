export default function UseCases() {
  const useCases = [
    {
      icon: '💼',
      name: 'Sales Assistant',
      points: [
        'ติดตามลูกค้าอัตโนมัติ',
        'วิเคราะห์โอกาสการขาย',
        'จัดการ pipeline และรายงาน'
      ]
    },
    {
      icon: '📋',
      name: 'Admin Assistant',
      points: [
        'จัดการเอกสาร และตารางงาน',
        'ประสานงานทีม',
        'จัดการ email และนัดหมาย'
      ]
    },
    {
      icon: '💰',
      name: 'Finance Advisor',
      points: [
        'ติดตาม cash flow',
        'วิเคราะห์รายรับ-รายจ่าย',
        'สรุปรายงานทางการเงิน'
      ]
    },
    {
      icon: '✍️',
      name: 'Content Creator',
      points: [
        'เขียนโพสต์ social media',
        'สร้างเนื้อหาการตลาด',
        'วางแผน content calendar'
      ]
    },
    {
      icon: '💬',
      name: 'Customer Support',
      points: [
        'ตอบคำถามลูกค้า 24/7',
        'แก้ปัญหาเบื้องต้น',
        'บันทึกและรายงานปัญหา'
      ]
    },
  ]

  return (
    <section className="section-padding bg-navy/50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          เลือก <span className="gradient-text">Friday</span> ที่เหมาะกับธุรกิจคุณ
        </h2>
        <p className="text-center text-cream/70 mb-12 md:mb-16 text-base md:text-lg">
          หรือสร้างแบบกำหนดเองได้ตามที่คุณต้องการ
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-navy border border-gold/30 rounded-2xl p-6 md:p-8 hover:border-gold transition-all duration-300 hover:shadow-xl hover:shadow-gold/20 group"
            >
              <div className="text-5xl md:text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {useCase.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gold">
                {useCase.name}
              </h3>
              <ul className="space-y-3">
                {useCase.points.map((point, i) => (
                  <li key={i} className="flex items-start text-sm md:text-base text-cream/80">
                    <span className="text-gold mr-2 mt-1">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-base md:text-lg text-cream/60">
            + อีกหลายร้อย templates สำหรับทุกประเภทธุรกิจ
          </p>
        </div>
      </div>
    </section>
  )
}
