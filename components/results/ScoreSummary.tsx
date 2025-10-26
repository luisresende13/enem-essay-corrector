interface ScoreSummaryProps {
  overallScore: number;
  competencies: Array<{
    number: number;
    title: string;
    score: number;
  }>;
}

export default function ScoreSummary({ overallScore, competencies }: ScoreSummaryProps) {
  // Calculate percentage
  const percentage = (overallScore / 1000) * 100;

  // Determine score level and color
  const getScoreLevel = (score: number) => {
    if (score >= 900) return { label: 'Excelente', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 700) return { label: 'Bom', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (score >= 500) return { label: 'Regular', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (score >= 300) return { label: 'Insuficiente', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Precário', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const scoreLevel = getScoreLevel(overallScore);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultado da Avaliação</h2>

      {/* Overall Score */}
      <div className={`${scoreLevel.bg} rounded-lg p-6 mb-6`}>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">Nota Final</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className={`text-6xl font-bold ${scoreLevel.color}`}>
              {overallScore}
            </span>
            <span className="text-2xl text-gray-500">/1000</span>
          </div>
          <p className={`text-lg font-semibold ${scoreLevel.color} mt-2`}>
            {scoreLevel.label}
          </p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
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
      </div>

      {/* Competencies Breakdown */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Pontuação por Competência
        </h3>
        <div className="space-y-3">
          {competencies.map((comp) => {
            const compPercentage = (comp.score / 200) * 100;
            return (
              <div key={comp.number}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Competência {comp.number}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {comp.score}/200
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      compPercentage >= 90
                        ? 'bg-green-600'
                        : compPercentage >= 70
                        ? 'bg-blue-600'
                        : compPercentage >= 50
                        ? 'bg-yellow-600'
                        : compPercentage >= 30
                        ? 'bg-orange-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${compPercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-600 mb-2">Legenda:</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded" />
            <span className="text-gray-600">900-1000: Excelente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded" />
            <span className="text-gray-600">700-899: Bom</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-600 rounded" />
            <span className="text-gray-600">500-699: Regular</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-600 rounded" />
            <span className="text-gray-600">300-499: Insuficiente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-600 rounded" />
            <span className="text-gray-600">0-299: Precário</span>
          </div>
        </div>
      </div>
    </div>
  );
}