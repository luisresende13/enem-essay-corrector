'use client';

import { useState } from 'react';

interface EssayFormProps {
  onSubmit: (data: { title: string; theme: string }) => void;
  disabled?: boolean;
}

export default function EssayForm({ onSubmit, disabled = false }: EssayFormProps) {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('');
  const [errors, setErrors] = useState<{ title?: string; theme?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { title?: string; theme?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (theme.trim() && theme.trim().length > 200) {
      newErrors.theme = 'Theme must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        title: title.trim(),
        theme: theme.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Field */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Essay Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors({ ...errors, title: undefined });
            }
          }}
          disabled={disabled}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${errors.title ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          placeholder="e.g., Redação ENEM 2024 - Tema X"
          maxLength={100}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/100 characters
        </p>
      </div>

      {/* Theme Field */}
      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
          Essay Theme (Optional)
        </label>
        <textarea
          id="theme"
          value={theme}
          onChange={(e) => {
            setTheme(e.target.value);
            if (errors.theme) {
              setErrors({ ...errors, theme: undefined });
            }
          }}
          disabled={disabled}
          rows={3}
          className={`
            w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
            ${errors.theme ? 'border-red-500' : 'border-gray-300'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          `}
          placeholder="e.g., Desafios para a formação educacional de surdos no Brasil"
          maxLength={200}
        />
        {errors.theme && (
          <p className="mt-1 text-sm text-red-600">{errors.theme}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {theme.length}/200 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled}
        className={`
          w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors
          ${disabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }
        `}
      >
        {disabled ? 'Uploading...' : 'Upload Essay'}
      </button>
    </form>
  );
}