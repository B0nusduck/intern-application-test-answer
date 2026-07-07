import TodoSlide from "./todo-slide";

export default function TodoGrid({ todoLength, displayedCards, handleDeleteTodo, handleOpenTodoPopUp, handleOpenEditTodo}){
  return(
    <>
    {todoLength === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <p className="text-sm text-slate-500 font-medium">No tasks found. Click Add Task above to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {displayedCards.map((task) => (
            <TodoSlide
              key={task.id}
              title={task.title}
              content={task.content}
              dateTime={task.dateTime}
              completed={task.completed}
              onEdit={() => handleOpenEditTodo(task)}
              onDelete={() => handleDeleteTodo(task.id)}
              onOpen={() => handleOpenTodoPopUp(task)}
            />
          ))}
        </div>
      )}
    </>
  )
}