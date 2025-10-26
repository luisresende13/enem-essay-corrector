'use client';

import { useState } from 'react';
import { Essay } from '@/types';
import EssayCard from './EssayCard';

interface EssayListProps {
  essays: Essay[];
  onDelete?: (essayId: string) => void;
}

type FilterStatus = 'all' | 'uploaded' | 'transcribed' | 'evaluated';
type SortOption = 'date' | 'title';

export default function EssayList({ essays, onDelete }: EssayListProps) {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [sort, setSort] = useState<SortOption>('date');

  // Filter essays
  const filteredEssays = essays.filter((essay) => {
    if (filter === 'all') return true;
    return essay.status === filter;
  });

  // Sort essays
  const sortedEssays = [...filteredEssays].sort((a, b) => {
    if (sort === 'date') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="space-y-6">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Todas ({essays.length})
          </button>
          <button
            onClick={() => setFilter('uploaded')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'uploaded'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Enviadas ({essays.filter((e) => e.status === 'uploaded').length})
          </button>
          <button
            onClick={() => setFilter('transcribed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'transcribed'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Transcritas ({essays.filter((e) => e.status === 'transcribed').length})
          </button>
          <button
            onClick={() => setFilter('evaluated')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'evaluated'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Avaliadas ({essays.filter((e) => e.status === 'evaluated').length})
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date">Data</option>
            <option value="title">Título</option>
          </select>
        </div>
      </div>

      {/* Essay Grid */}
      {sortedEssays.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedEssays.map((essay) => (
            <EssayCard key={essay.id} essay={essay} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Nenhuma redação encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all'
              ? 'Comece enviando sua primeira redação.'
              : `Nenhuma redação com status "${filter}".`}
          </p>
        </div>
      )}
    </div>
  );
}