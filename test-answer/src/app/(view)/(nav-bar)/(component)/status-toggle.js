import { useSearch } from '../../../SearchContext';

export default function StatusToggle(){
  const { statusToggles, toggleStatus } = useSearch();

  return(
    <>
      {statusToggles.map((btn) => (
        <button
          key={btn.label}
          onClick={() => toggleStatus(btn.label)}
          className={`grow transition-colors duration-200 font-medium text-center  rounded px-3 py-2.5 ${
            btn.isTrue 
              ? "text-indigo-600 bg-indigo-50/50"       // Active styles
              : "text-slate-600 hover:bg-indigo-50/50"  // Default styles
          }`}
        >
          {btn.label}
        </button>
      ))}
    </>
  )
}