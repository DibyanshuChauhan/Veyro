import { Link } from "react-router-dom";

export default function AuthHeader({ actionLabel, actionTo }) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080a]/90 backdrop-blur-md border-b border-[#202026]">
      <div className="max-w-360 mx-auto px-6 sm:px-10 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="font-serif-luxury text-2xl sm:text-3xl tracking-[0.25em] text-[#f4f4f5] hover:text-[#d4af37] transition-colors uppercase select-none"
          >
            VEYRO
          </Link>
          <span className="hidden md:inline-block text-[10px] font-medium tracking-[0.25em] text-[#71717a] border-l border-[#27272a] pl-4">
            HAUTE COUTURE ARCHIVE
          </span>
        </div>

        <nav className="hidden lg:flex items-center space-x-10 text-[11px] font-medium tracking-[0.2em] text-[#a1a1aa] uppercase">
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Collections</span>
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Atelier</span>
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Archives</span>
          <span className="hover:text-[#f4f4f5] cursor-pointer transition-colors">Editorial</span>
        </nav>

        <div className="flex items-center space-x-6">
          <span className="hidden sm:inline-block text-[11px] font-medium tracking-[0.2em] text-[#71717a] hover:text-[#d4af37] cursor-pointer transition-colors">
            EN / USD
          </span>
          <Link
            to={actionTo}
            className="text-[11px] font-medium tracking-[0.2em] text-[#d4af37] hover:text-[#f4f4f5] border border-[#d4af37]/40 hover:border-[#d4af37] px-4 py-2 transition-all uppercase"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
