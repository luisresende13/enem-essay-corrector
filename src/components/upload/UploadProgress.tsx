'use client';

type UploadStatus = 'idle' | 'uploading' | 'transcribing' | 'reconstructing' | 'saving' | 'complete' | 'error';

interface UploadProgressProps {
  status: UploadStatus;
  message?: string;
}

export default function UploadProgress({ status, message }: UploadProgressProps) {
  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Enviando sua redação...';
      case 'transcribing':
        return 'Extraindo texto da imagem...';
      case 'reconstructing':
        return 'Reconstruindo o texto transcrito...';
      case 'saving':
        return 'Salvando a redação...';
      case 'complete':
        return 'Envio concluído!';
      case 'error':
        return 'Ocorreu um erro';
      default:
        return 'Preparando para enviar...';
    }
  };

  const isProcessing = ['uploading', 'transcribing', 'reconstructing', 'saving'].includes(status);

  const getStatusColor = () => {
    if (isProcessing) return 'bg-blue-600';
    if (status === 'complete') return 'bg-green-600';
    if (status === 'error') return 'bg-red-600';
    return 'bg-gray-600';
  };

  const getStatusIcon = () => {
    if (isProcessing) {
      return (
        <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }
    if (status === 'complete') {
      return (
        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
    if (status === 'error') {
      return (
        <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className="mr-3">{getStatusIcon()}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{getStatusText()}</p>
          {message && (
            <p className="text-xs text-red-600 mt-1">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}