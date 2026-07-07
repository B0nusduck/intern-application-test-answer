"use client"

import { useEffect, useState } from 'react';
import { useSearch } from '../../../SearchContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useSearch();
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery || '');
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(localQuery || '');
  };

  return (
    <form onSubmit={handleSearch} className="grow relative mx-8 flex items-center">
      <input
        type="text"
        placeholder="Search for tasks..."
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-200/70 focus:bg-white text-sm text-slate-800 placeholder-slate-400 border border-transparent focus:border-indigo-500 rounded-full outline-none transition-all duration-200"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* Search Icon */}
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </form>
  );
}