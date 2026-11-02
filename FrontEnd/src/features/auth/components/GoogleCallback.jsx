export default function GoogleCallback({
  text = "Continue with Google",
  onClick,
  showDivider = false,
  dividerText = "OR",
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      console.log("Initiating Google Authentication flow");
    }
  };

  const buttonElement = (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`w-full py-3.5 px-5 bg-[#0c0c0f] hover:bg-[#141419] border border-[#27272a] hover:border-[#d4af37]/60 text-[#f4f4f5] hover:text-[#f2ca50] transition-all duration-300 flex items-center justify-center gap-3.5 group cursor-pointer select-none active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(212,175,55,0.12)] ${className}`}
      {...props}
    >
      {/* Official Multi-Color Google Mark */}
      <svg
        className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
      <span className="text-[11px] font-semibold tracking-[0.22em] uppercase font-sans-luxury">
        {text}
      </span>
    </button>
  );

  if (!showDivider) {
    return buttonElement;
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative flex items-center justify-center pt-2">
        <div className="grow border-t border-[#232329]" />
        <span className="px-3.5 text-[9px] font-medium tracking-[0.25em] text-[#71717a] uppercase bg-[#121216] select-none">
          {dividerText}
        </span>
        <div className="grow border-t border-[#232329]" />
      </div>
      {buttonElement}
    </div>
  );
}

