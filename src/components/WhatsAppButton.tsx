export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919752210368?text=Hello%20ELITE%20MAKLER%2C%20I%20am%20interested%20in%20a%20luxury%20property%20in%20Indore."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-[#25D366]
                 text-white flex items-center justify-center text-2xl
                 shadow-[0_8px_24px_rgba(37,211,102,0.4)]
                 hover:scale-110 hover:shadow-[0_12px_32px_rgba(37,211,102,0.6)]
                 transition-all duration-300 group"
    >
      {/* WhatsApp SVG icon */}
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15
                 -.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075
                 -.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059
                 -.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52
                 .149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52
                 -.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51
                 -.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372
                 -.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074
                 .149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625
                 .712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413
                 .248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.112.553 4.095 1.518 5.814L0 24l6.335-1.518
                 A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818
                 a9.818 9.818 0 01-5.006-1.371l-.36-.213-3.727.893.924-3.618-.234-.372
                 A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58
                 21.818 12 17.42 21.818 12 21.818z"/>
      </svg>

      {/* Tooltip */}
      <span className="absolute right-16 bg-[#11161E] text-white text-xs font-medium
                       px-3 py-1.5 rounded whitespace-nowrap opacity-0 pointer-events-none
                       group-hover:opacity-100 transition-opacity
                       after:content-[''] after:absolute after:left-full after:top-1/2
                       after:-translate-y-1/2 after:border-4 after:border-transparent
                       after:border-l-[#11161E]">
        Chat with us
      </span>
    </a>
  )
}

