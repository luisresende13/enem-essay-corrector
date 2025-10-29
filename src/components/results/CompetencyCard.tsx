interface CompetencyCardProps {
  number: number;
  title: string;
  description: string;
  score: number;
  feedback: string;
}

export default function CompetencyCard({
  number,
  title,
  description,
  score,
  feedback,
}: CompetencyCardProps) {
  // Calculate percentage
  const percentage = (score / 200) * 100;

  // Determine score level and color
  const getScoreColor = (score: number) => {
    if (score >= 180) return 'text-green-600';
    if (score >= 140) return 'text-blue-600';
    if (score >= 100) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score === 200) return 'Excelente';
    if (score >= 160) return 'Bom';
    if (score >= 120) return 'Mediano';
    if (score >= 80) return 'Insuficiente';
    if (score >= 40) return 'Precário';
    return 'Muito Precário';
  };

  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
              {number}
            </span>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-2">{description}</p>
        </div>
        <div className="text-right ml-4">
          <div className={`text-3xl font-bold ${scoreColor}`}>{score}</div>
          <div className="text-sm text-gray-500">/200</div>
          <div className={`text-xs font-semibold ${scoreColor} mt-1`}>
            {scoreLabel}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              percentage >= 90
                ? 'bg-green-600'
                : percentage >= 70
                ? 'bg-blue-600'
                : percentage >= 50
                ? 'bg-yellow-600'
                : percentage >= 30
                ? 'bg-orange-600'
                : 'bg-red-600'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Feedback:</h4>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {feedback}
        </p>
      </div>
    </div>
  );
}