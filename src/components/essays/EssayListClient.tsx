'use client';

import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Essay } from '../../types';
import * as apiService from '../../services/apiService';
import EssayList from './EssayList';

interface EssayListClientProps {
  essays: (Essay & { evaluation?: { overall_score: number } | null })[];
  onDelete: (essayId: string) => void;
}

export default function EssayListClient({ essays, onDelete }: EssayListClientProps) {
  const navigate = useNavigate();

  const handleDelete = async (essayId: string) => {
    try {
      await apiService.deleteEssay(essayId);
      toast.success('Redação excluída com sucesso!');
      onDelete(essayId);
    } catch (error) {
      console.error('Error deleting essay:', error);
      toast.error('Falha ao excluir a redação. Por favor, tente novamente.');
    }
  };

  return <EssayList essays={essays} onDelete={handleDelete} />;
}