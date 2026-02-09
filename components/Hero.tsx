'use client'

export default function Hero() {
  const scrollToWaitlist = () => {
    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="container-custom text-center relative z-10">
        <div className="animate-fadeInUp">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            พนักงานคนแรกที่ทุก CEO<br />
            <span className="gradient-text">ควรจ้าง</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-cream/80 mb-4 max-w-3xl mx-auto leading-relaxed">
            AI Executive Assistant ที่ทำงานให้คุณ <span className="text-gold font-semibold">24/7</span><br />
            <span className="text-base md:text-xl">ไม่มีวันลา ไม่มีวันลาออก</span>
          </p>

          <div className="mb-8 md:mb-12">
            <p className="text-xl md:text-3xl font-semibold text-gold">
              Setup ฿35,000 + <span className="text-lg text-cream/60">฿5,000/เดือน</span>
            </p>
          </div>

          <button
            onClick={scrollToWaitlist}
            className="bg-gold hover:bg-gold/90 text-navy px-8 md:px-12 py-4 md:py-5 rounded-full font-semibold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-gold/50"
          >
            สมัครรับสิทธิ์ Early Access
          </button>

          <p className="mt-6 text-sm text-cream/50">
            🎁 Early Access รับส่วนลด 40% ตลอดชีพ
          </p>
        </div>
      </div>
    </section>
  )
}
