export default function TodoHeader({ todos, handleOpenCreateTodo, indexOfFirstCard, indexOfLastCard }){
  return(
    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Active Core Tasks</h2>
        <p className="text-xs text-slate-500 mt-1">
          Showing {todos.length === 0 ? 0 : indexOfFirstCard + 1}–{Math.min(indexOfLastCard, todos.length)} of {todos.length} entries
        </p>
      </div>

    <button onClick={handleOpenCreateTodo}
    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group shrink-0"
    >
      <svg className="w-4 h-4 mr-2 stroke-white transition-transform duration-200 group-hover:rotate-90" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
      </svg>
        Add Task
      </button>
    </div>
  )
}