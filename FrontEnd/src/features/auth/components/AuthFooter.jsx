export default function AuthFooter() {
  return (
    <footer className="w-full bg-[#08080a] border-t border-[#1e1e24] py-8 px-6 sm:px-10 lg:px-16 mt-auto">
      <div className="max-w-360 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <span className="font-serif-luxury text-lg tracking-[0.2em] text-[#f4f4f5] uppercase select-none">
            VEYRO
          </span>
          <span className="text-[11px] text-[#71717a] tracking-wider">
            © {new Date().getFullYear()} VEYRO ATELIER. ALL RIGHTS RESERVED. ARCHIVAL PRESERVATION &amp; CURATION.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase">
          <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Client Service</span>
          <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Legal &amp; Regulatory</span>
          <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Privacy Protocol</span>
          <span className="hover:text-[#d4af37] cursor-pointer transition-colors">Bespoke Inquiries</span>
        </div>
      </div>
    </footer>
  );
}
