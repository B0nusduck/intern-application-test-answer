import React from 'react'
import DeleteBTN from './(slide-component)/delete-button';
import EditBTN from './(slide-component)/edit-button';
import DateTimeDisplay from './(slide-component)/date-time-display';

export default function TodoSlide({ title, dateTime, completed, onEdit, onDelete, content, onOpen }) {
  return (
    <div
      className="flex flex-col justify-between h-full min-h-55 max-h-70 bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 group cursor-pointer"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen?.();
        }
      }}
    >
      <div className="grow overflow-hidden">
        <h3 className={`text-lg font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-3 ${completed ? 'line-through text-slate-400 group-hover:text-slate-400' : ''}`}>
          {title}
        </h3>
        {content && (
          <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-4 overflow-hidden">
            {content}
          </p>
        )}
      </div>
      <DateTimeDisplay dateTime={dateTime}></DateTimeDisplay>
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className={`text-xs font-semibold uppercase tracking-wider ${completed ? 'text-emerald-600' : 'text-indigo-600'}`}>
          {completed ? 'Completed' : 'In Progress'}
        </span>
        <div className="flex items-center space-x-1" onClick={(event) => event.stopPropagation()}>
          <EditBTN onClick={(event) => {
            event.stopPropagation();
            onEdit?.(event);
          }}></EditBTN>
          <DeleteBTN onClick={(event) => {
            event.stopPropagation();
            onDelete?.(event);
          }}></DeleteBTN>
        </div>
      </div>
    </div>
  );
}