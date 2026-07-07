export default function MobileLayout({ menuIsOpen, toggleMenu}){
  return(
    <div className="md:hidden flex items-center">
      <button
        onClick={() => toggleMenu()}
        className="text-slate-600 hover:text-indigo-600 focus:outline-none p-2"
        aria-label="Toggle menu"
      >
        {menuIsOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>
    </div>
  )
}