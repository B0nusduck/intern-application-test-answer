"use client";

import React, { useEffect, useState } from 'react';

export default function TodoPopup({ selectedTask, popupMode = 'view', onClose, onSave }) {
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedDateTime, setEditedDateTime] = useState('');
  const [editedCompleted, setEditedCompleted] = useState(false);

  useEffect(() => {
    if (popupMode === 'create') {
      setEditedTitle('');
      setEditedContent('');
      setEditedCompleted(false);
      setEditedDateTime('');
      return;
    }

    if (selectedTask) {
      setEditedTitle(selectedTask.title || '');
      setEditedContent(selectedTask.content || '');
      setEditedCompleted(Boolean(selectedTask.completed));

      const initialDateTime = selectedTask.dateTime
        ? new Date(selectedTask.dateTime).toISOString().slice(0, 16)
        : '';

      setEditedDateTime(initialDateTime);
    }
  }, [popupMode, selectedTask]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedTask && popupMode !== 'create') return;
    
    onSave?.({
      ...(selectedTask || {}),
      title: editedTitle.trim() || '',
      content: editedContent.trim() || '',
      completed: editedCompleted,
      dateTime: editedDateTime || null,
    });
  };
  
  const handleClosePopUp = () => {
    onClose?.();
  };
  
  if (!selectedTask && popupMode !== 'create') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6"
      onMouseDown={handleClosePopUp}
    >
      <div
        className="w-full max-w-5xl max-h-[70vh] overflow-hidden rounded-3xl bg-white p-8 shadow-2xl relative flex flex-col"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="pt-5 overflow-y-auto pr-2">
          <div className="flex items-center justify-between gap-3 mb-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${(selectedTask?.completed) ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
              {selectedTask?.completed ? 'Completed' : 'In Progress'}
            </span>
            {popupMode !== 'edit' && (
              <span className="text-sm text-slate-500">{selectedTask?.dateTime}</span>
            )}
          </div>

          {popupMode === 'edit' || popupMode === 'create' ? (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="edit-title" className="mb-2 block text-sm font-semibold text-slate-700">
                  Task title
                </label>
                <input
                  id="edit-title"
                  value={editedTitle}
                  onChange={(event) => setEditedTitle(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
                  placeholder="Enter a task title"
                />
              </div>

              <div>
                <label htmlFor="edit-content" className="mb-2 block text-sm font-semibold text-slate-700">
                  Task details
                </label>
                <textarea
                  id="edit-content"
                  value={editedContent}
                  onChange={(event) => setEditedContent(event.target.value)}
                  rows={8}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
                  placeholder="Describe the task in more detail"
                />
              </div>

              <div>
                <label htmlFor="edit-datetime" className="mb-2 block text-sm font-semibold text-slate-700">
                  Due date and time
                </label>
                <input
                  id="edit-datetime"
                  type="datetime-local"
                  value={editedDateTime}
                  onChange={(event) => setEditedDateTime(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-400"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Leave this blank if you do not want to set a date and time.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-700">Completed</p>
                  <p className="text-xs text-slate-500">Toggle whether this task is finished.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={editedCompleted}
                    onChange={(event) => setEditedCompleted(event.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-indigo-600"></div>
                  <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></div>
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClosePopUp}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  {popupMode === 'create' ? 'Create task' : 'Save changes'}
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-slate-800">{selectedTask.title}</h3>
              <p className="mt-5 text-base leading-7 text-slate-600 whitespace-pre-line">
                {selectedTask.content || 'No additional details provided for this task.'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}