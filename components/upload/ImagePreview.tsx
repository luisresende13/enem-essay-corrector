'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  disabled?: boolean;
}

export default function ImagePreview({ files, onRemove, disabled = false }: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (files.length === 0) {
    return null;
  }

  const getFilePreviewUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isPDF = (file: File): boolean => {
    return file.type === 'application/pdf';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Selected Files ({files.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="relative group border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Preview */}
            <div 
              className="aspect-[3/4] bg-gray-100 flex items-center justify-center cursor-pointer"
              onClick={() => setSelectedImage(index)}
            >
              {isPDF(file) ? (
                <div className="flex flex-col items-center justify-center p-4">
                  <svg
                    className="w-16 h-16 text-red-500 mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">PDF Document</p>
                </div>
              ) : (
                <Image
                  src={getFilePreviewUrl(file)}
                  alt={file.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>

            {/* File Info */}
            <div className="p-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(file.size)}
              </p>
            </div>

            {/* Remove Button */}
            {!disabled && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Remove file"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {/* Page Number Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
              Page {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && !isPDF(files[selectedImage]) && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
            onClick={() => setSelectedImage(null)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
            <Image
              src={getFilePreviewUrl(files[selectedImage])}
              alt={files[selectedImage].name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded">
            {files[selectedImage].name} - Page {selectedImage + 1} of {files.length}
          </div>
        </div>
      )}
    </div>
  );
}