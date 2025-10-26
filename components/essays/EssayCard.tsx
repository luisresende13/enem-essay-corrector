'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Essay } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EssayCardProps {
  essay: Essay & { evaluation?: { overall_score: number } | null };
  onDelete?: (essayId: string) => void;
}

const statusConfig = {
  uploaded: {
    label: 'Enviada',
    color: 'bg-blue-100 text-blue-800',
  },
  transcribed: {
    label: 'Transcrita',
    color: 'bg-yellow-100 text-yellow-800',
  },
  evaluated: {
    label: 'Avaliada',
    color: 'bg-green-100 text-green-800',
  },
};

export default function EssayCard({ essay, onDelete }: EssayCardProps) {
  const status = statusConfig[essay.status];
  const timeAgo = formatDistanceToNow(new Date(essay.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDelete && confirm('Tem certeza que deseja excluir esta redação?')) {
      onDelete(essay.id);
    }
  };

  return (
    <Link href={`/essays/${essay.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        {/* Image Thumbnail */}
        <div className="relative h-48 bg-gray-200">
          <Image
            src={essay.image_url}
            alt={essay.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {essay.title}
            </h3>
            <span
              className={`ml-2 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${status.color}`}
            >
              {status.label}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{timeAgo}</p>
            {essay.status === 'evaluated' && essay.evaluation && (
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-900">
                  {essay.evaluation.overall_score}
                </span>
                <span className="text-xs text-gray-500">/1000</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Ver detalhes →
            </span>
            {onDelete && (
              <button
                onClick={handleDelete}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}