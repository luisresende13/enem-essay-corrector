'use client';

interface UploadProgressProps {
  current: number;
  total: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  message?: string;
}

export default function UploadProgress({ current, total, status, message }: UploadProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return 'bg-blue-600';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return (
          <svg
            className="animate-spin h-5 w-5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        );
      case 'complete':
        return (
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            className="h-5 w-5 text-red-600"
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
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return `Uploading files... (${current}/${total})`;
      case 'processing':
        return 'Processing essay...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return '';
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Status Icon and Text */}
      <div className="flex items-center mb-4">
        <div className="mr-3">{getStatusIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{getStatusText()}</p>
          {message && (
            <p className="text-xs text-gray-500 mt-1">{message}</p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full transition-all duration-300 ${getStatusColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}

      {/* Success Message */}
      {status === 'complete' && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            Your essay has been uploaded successfully! You can now view it in your dashboard.
          </p>
        </div>
      )}

      {/* Error Message */}
      {status === 'error' && message && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{message}</p>
        </div>
      )}

      {/* Percentage Display */}
      {(status === 'uploading' || status === 'processing') && (
        <div className="mt-2 text-right">
          <span className="text-xs font-medium text-gray-600">{percentage}%</span>
        </div>
      )}
    </div>
  );
}