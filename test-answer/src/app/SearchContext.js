"use client"

import React, { createContext, useCallback, useContext, useState } from "react"

const SearchContext = createContext(null)

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusToggles, setStatusToggles] = useState([
    { label: 'In Progress', isTrue: false },
    { label: 'Completed', isTrue: false },
  ])

  const toggleStatus = useCallback((label) => {
    setStatusToggles(prev => prev.map(item =>
      item.label === label ? { ...item, isTrue: !item.isTrue } : item
    ))
  }, [])

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, statusToggles, toggleStatus }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider')
  return ctx
}
