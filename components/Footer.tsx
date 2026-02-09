export default function Footer() {
  return (
    <footer className="bg-navy/80 border-t border-gold/20 py-8 md:py-12">
      <div className="container-custom">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-gold mb-2">
              Get Your Friday
            </h3>
            <p className="text-sm text-cream/60">
              by <span className="text-gold">Limitless Club</span>
            </p>
          </div>

          <div className="flex justify-center gap-6 text-sm md:text-base">
            <a
              href="https://instagram.com/jeditrinupab"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-gold transition-colors duration-300"
            >
              @jeditrinupab
            </a>
            <span className="text-cream/30">|</span>
            <a
              href="https://instagram.com/lmtlessclub"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cream/60 hover:text-gold transition-colors duration-300"
            >
              @lmtlessclub
            </a>
          </div>

          <div className="flex justify-center gap-6 text-sm">
            <a
              href="#"
              className="text-cream/40 hover:text-gold transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <span className="text-cream/30">|</span>
            <a
              href="#"
              className="text-cream/40 hover:text-gold transition-colors duration-300"
            >
              Terms of Service
            </a>
          </div>

          <div className="text-xs text-cream/30 pt-6 border-t border-gold/10">
            © 2026 Get Your Friday. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
