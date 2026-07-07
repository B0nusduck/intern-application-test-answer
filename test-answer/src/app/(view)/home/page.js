"use client"

import React, { useEffect, useMemo, useState } from 'react'
import { useSearch } from '../../SearchContext'
import TodoHeader from './(page-component)/todo-header'
import PageControlFooter from './(page-component)/todo-page-control-footer'
import TodoGrid from './(page-component)/todo-grid'
import TodoPopup from './(page-component)/todo-popup'

export default function TodoPage() {
  const { searchQuery, statusToggles } = useSearch()
  const cardsPerPage = 12
  const [currentPage, setCurrentPage] = useState(1)
  const [popUpTask, setPopUpTask] = useState(null)
  const [popupMode, setPopupMode] = useState('view')
  const [todos, setTodos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  
  // #region search
  const selectedStatuses = statusToggles
    .filter(toggle => toggle.isTrue)
    .map(toggle => toggle.label.toLowerCase().replace(/\s+/g, '-'))

  const filteredTodos = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim().toLowerCase()

    return todos.filter(task => {
      const matchesSearch = !normalizedSearchQuery || [task.title, task.content]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(normalizedSearchQuery))

      if (!matchesSearch) {
        return false
      }

      if (selectedStatuses.length === 0) {
        return true
      }

      return selectedStatuses.some(status => {
        if (status === 'completed') {
          return Boolean(task.completed)
        }

        if (status === 'in-progress') {
          return !Boolean(task.completed)
        }

        return true
      })
    })
  }, [todos, searchQuery, selectedStatuses.join(',')])
  // #endregion

  // #region load page content
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()

        const trimmedQuery = searchQuery.trim()
        if (trimmedQuery) {
          params.set('search', trimmedQuery)
        }

        selectedStatuses.forEach(status => params.append('status', status))

        const queryString = params.toString()
        const response = await fetch(`/api/todos${queryString ? `?${queryString}` : ''}`)
        if (!response.ok) {
          throw new Error('Unable to load tasks from the database.')
        }

        const data = await response.json()
        setTodos(data)
        setErrorMessage('')
      } catch (error) {
        setErrorMessage(error.message || 'Unable to load tasks from the database.')
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [searchQuery, selectedStatuses.join(',')])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedStatuses.join(',')])
  // #endregion

  // #region edit and delete data
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Unable to delete the task.')
      }
      
      setTodos(prev => {
        const updatedTodos = prev.filter(item => item.id !== id)
        const totalPagesAfterDelete = Math.ceil(updatedTodos.length / cardsPerPage) || 1
        if (currentPage > totalPagesAfterDelete) {
          setCurrentPage(totalPagesAfterDelete)
        }
        return updatedTodos
      })
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error.message || 'Unable to delete the task.')
    }
  }

  const handleSaveTodo = async (taskData) => {
    try {
      const payload = {
        ...taskData,
        title: taskData.title || '',
        content: taskData.content || '',
        completed: Boolean(taskData.completed),
        dateTime: taskData.dateTime || null,
      }

      if (popupMode === 'create') {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        
        if (!response.ok) {
          throw new Error('Unable to create the task.')
        }
        
        const createdTask = await response.json()
        setTodos(prev => [createdTask, ...prev])
        setPopUpTask(createdTask)
        setPopupMode('view')
        setErrorMessage('')
        return
      }

      const response = await fetch(`/api/todos/${taskData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Unable to update the task.')
      }

      const savedTask = await response.json()
      setTodos(prev => prev.map(item => item.id === savedTask.id ? savedTask : item))
      setPopUpTask(savedTask)
      setPopupMode('view')
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(popupMode === 'create' ? 'Unable to create the task.' : 'Unable to update the task.')
    }
  }
  // #endregion

  // #region pop up state
  const handleOpenCreateTodo = () => {
    setPopUpTask(null)
    setPopupMode('create')
  }
  
  const handleOpenTodoPopUp = (task) => {
    setPopUpTask(task)
    setPopupMode('view')
  }

  const handleOpenEditTodo = (task) => {
    setPopUpTask(task)
    setPopupMode('edit')
  }

  const handleClosePopUp = () => {
    setPopUpTask(null)
    setPopupMode('view')
  }
  //#endregion

  // #region pagination statistic
  const totalPages = Math.ceil(filteredTodos.length / cardsPerPage) || 1
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const indexOfLastCard = safeCurrentPage * cardsPerPage
  const indexOfFirstCard = indexOfLastCard - cardsPerPage
  const currentDisplayedCards = filteredTodos.slice(indexOfFirstCard, indexOfLastCard)
  // #endregion

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <TodoHeader
        todos={filteredTodos}
        handleOpenCreateTodo={handleOpenCreateTodo}
        indexOfFirstCard={indexOfFirstCard}
        indexOfLastCard={indexOfLastCard}
      ></TodoHeader>

      {errorMessage ? (
        <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
          Loading tasks from the database...
        </div>
      ) : null}

      <TodoPopup
        selectedTask={popUpTask}
        popupMode={popupMode}
        onClose={handleClosePopUp}
        onSave={handleSaveTodo}
      ></TodoPopup>

      <TodoGrid
        todoLength={filteredTodos.length}
        displayedCards={currentDisplayedCards}
        handleDeleteTodo={handleDeleteTodo}
        handleOpenTodoPopUp={handleOpenTodoPopUp}
        handleOpenEditTodo={handleOpenEditTodo}
      ></TodoGrid>

      <PageControlFooter
        todoLength={filteredTodos.length}
        cardsPerPage={cardsPerPage}
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}></PageControlFooter>
    </div>
  )
}