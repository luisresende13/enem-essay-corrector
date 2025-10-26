'use client';

import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Essay } from '@/types';
import EssayList from './EssayList';

interface EssayListClientProps {
  essays: (Essay & { evaluation?: { overall_score: number } | null })[];
}

export default function EssayListClient({ essays }: EssayListClientProps) {
  const router = useRouter();

  const handleDelete = async (essayId: string) => {
    try {
      const response = await fetch(`/api/essays/${essayId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete essay');
      }

      toast.success('Redação excluída com sucesso!');
      // Refresh the page to update the list
      router.refresh();
    } catch (error) {
      console.error('Error deleting essay:', error);
      toast.error('Erro ao excluir redação. Tente novamente.');
    }
  };

  return <EssayList essays={essays} onDelete={handleDelete} />;
}