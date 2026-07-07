export default function({ dateTime }){
  <div className="mt-4 flex items-center space-x-1.5 text-xs font-medium text-slate-400">
    <svg 
      className="w-4 h-4 text-slate-400 shrink-0" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <span className="truncate">{dateTime}</span>
  </div>
}