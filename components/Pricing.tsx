'use client'

export default function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '5,000',
      period: '/เดือน',
      features: [
        '1 AI Assistant',
        'Telegram integration',
        'Basic automations',
        'Memory & context',
        'Email support',
      ],
      highlight: false,
    },
    {
      name: 'Business',
      price: '9,900',
      period: '/เดือน',
      features: [
        '3 AI Assistants',
        'LINE + Telegram',
        'Advanced automations',
        'Priority support',
        'Custom workflows',
        'Team collaboration',
      ],
      highlight: true,
    },
    {
      name: 'Enterprise',
      price: '29,900',
      period: '/เดือน',
      features: [
        'Unlimited AI Assistants',
        'Custom integrations',
        'Dedicated support',
        'API access',
        'White-label option',
        'SLA guarantee',
      ],
      highlight: false,
    },
  ]

  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="section-padding bg-navy/50">
      <div className="container-custom">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
          แพ็กเกจที่<span className="gradient-text">เหมาะกับคุณ</span>
        </h2>
        <p className="text-center text-cream/70 mb-12 md:mb-16 text-base md:text-lg">
          เลือกแผนที่เหมาะกับธุรกิจของคุณ ยกเลิกได้ทุกเมื่อ
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 md:p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-2 border-gold transform md:scale-105 shadow-2xl shadow-gold/30'
                  : 'bg-navy border border-gold/20 hover:border-gold/50'
              }`}
            >
              {plan.highlight && (
                <div className="text-center mb-4">
                  <span className="bg-gold text-navy px-4 py-1 rounded-full text-sm font-bold">
                    POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center text-gold">
                {plan.name}
              </h3>

              <div className="text-center mb-6 md:mb-8">
                <span className="text-4xl md:text-5xl font-bold text-cream">
                  ฿{plan.price}
                </span>
                <span className="text-cream/60 text-lg">{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm md:text-base">
                    <span className="text-gold mr-3 mt-1 flex-shrink-0">✓</span>
                    <span className="text-cream/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={scrollToWaitlist}
                className={`w-full py-3 md:py-4 rounded-full font-semibold transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gold text-navy hover:bg-gold/90 shadow-lg'
                    : 'bg-navy border-2 border-gold text-gold hover:bg-gold hover:text-navy'
                }`}
              >
                เริ่มใช้งาน
              </button>
            </div>
          ))}
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
            <div className="flex justify-between items-center pt-3">
              <span className="font-bold text-gold">⚡ Friday AI Assistant</span>
              <span className="text-gold font-bold text-xl">฿5,000/เดือน</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
