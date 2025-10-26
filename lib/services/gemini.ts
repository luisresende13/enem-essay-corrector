import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiEvaluationResult } from '@/types';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// ENEM Competencies detailed criteria
const ENEM_CRITERIA = `
COMPETÊNCIA 1 (0-200 pontos): Demonstrar domínio da modalidade escrita formal da língua portuguesa
- Ortografia e acentuação corretas
- Pontuação adequada
- Concordância verbal e nominal
- Regência verbal e nominal
- Uso apropriado de conectivos
- Ausência de marcas de oralidade
- Vocabulário adequado ao registro formal

COMPETÊNCIA 2 (0-200 pontos): Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento
- Compreensão completa do tema proposto
- Desenvolvimento do tema sem tangenciá-lo
- Repertório sociocultural produtivo (referências, dados, citações)
- Argumentação consistente e bem fundamentada
- Articulação entre tema e conhecimentos de diferentes áreas

COMPETÊNCIA 3 (0-200 pontos): Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos
- Organização clara das ideias
- Coerência argumentativa
- Progressão textual lógica
- Relação adequada entre informações, fatos e opiniões
- Defesa consistente de um ponto de vista
- Estrutura dissertativo-argumentativa bem definida

COMPETÊNCIA 4 (0-200 pontos): Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação
- Uso adequado de conectivos e operadores argumentativos
- Coesão referencial (pronomes, sinônimos, hiperônimos)
- Coesão sequencial (progressão temática)
- Articulação eficiente entre parágrafos
- Encadeamento lógico das ideias
- Ausência de repetições desnecessárias

COMPETÊNCIA 5 (0-200 pontos): Elaborar proposta de intervenção para o problema abordado
- Proposta de intervenção clara e detalhada
- Respeito aos direitos humanos
- Presença dos 5 elementos: agente, ação, modo/meio, finalidade, detalhamento
- Relação direta com o tema e a argumentação desenvolvida
- Viabilidade e especificidade da proposta

NÍVEIS DE PONTUAÇÃO POR COMPETÊNCIA:
- 200 pontos: Excelente domínio
- 160 pontos: Bom domínio
- 120 pontos: Domínio mediano
- 80 pontos: Domínio insuficiente
- 40 pontos: Domínio precário
- 0 pontos: Desclassificação ou ausência total
`;

/**
 * Evaluates an essay using Google Gemini API
 * @param transcription - The transcribed essay text
 * @returns Structured evaluation result with scores and feedback
 */
export async function evaluateWithGemini(
  transcription: string
): Promise<GeminiEvaluationResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  if (!transcription || transcription.trim().length < 50) {
    throw new Error('Transcription is too short to evaluate');
  }

  try {
    // Use pro-2.5-pro for better quality
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-pro',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    });

    const prompt = `
Você é um avaliador especializado em redações do ENEM (Exame Nacional do Ensino Médio). 
Sua tarefa é avaliar a seguinte redação segundo as 5 competências do ENEM, fornecendo uma pontuação de 0 a 200 para cada competência e feedback detalhado.

CRITÉRIOS DE AVALIAÇÃO:
${ENEM_CRITERIA}

REDAÇÃO A SER AVALIADA:
"""
${transcription}
"""

INSTRUÇÕES:
1. Avalie cuidadosamente cada competência
2. Atribua uma pontuação de 0 a 200 para cada competência (use apenas valores: 0, 40, 80, 120, 160, 200)
3. Forneça feedback específico e construtivo para cada competência
4. Identifique pontos fortes e áreas de melhoria
5. No feedback geral, resuma a avaliação e dê orientações para melhorar

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem \`\`\`json):
{
  "competency_1": {
    "score": 160,
    "feedback": "Feedback detalhado sobre domínio da língua portuguesa..."
  },
  "competency_2": {
    "score": 160,
    "feedback": "Feedback detalhado sobre compreensão do tema..."
  },
  "competency_3": {
    "score": 160,
    "feedback": "Feedback detalhado sobre organização de informações..."
  },
  "competency_4": {
    "score": 160,
    "feedback": "Feedback detalhado sobre mecanismos linguísticos..."
  },
  "competency_5": {
    "score": 160,
    "feedback": "Feedback detalhado sobre proposta de intervenção..."
  },
  "general_feedback": "Feedback geral sobre a redação..."
}
`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // Parse JSON response
    let evaluation: GeminiEvaluationResult;
    try {
      evaluation = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Invalid JSON response from Gemini API');
    }

    // Validate response structure
    validateEvaluationResult(evaluation);

    return evaluation;
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini evaluation failed: ${error.message}`);
    }
    throw new Error('Gemini evaluation failed: Unknown error');
  }
}

/**
 * Validates the structure and values of the evaluation result
 */
function validateEvaluationResult(result: any): asserts result is GeminiEvaluationResult {
  const requiredCompetencies = ['competency_1', 'competency_2', 'competency_3', 'competency_4', 'competency_5'];
  
  for (const comp of requiredCompetencies) {
    if (!result[comp]) {
      throw new Error(`Missing ${comp} in evaluation result`);
    }
    
    const score = result[comp].score;
    const feedback = result[comp].feedback;
    
    if (typeof score !== 'number' || score < 0 || score > 200) {
      throw new Error(`Invalid score for ${comp}: ${score}`);
    }
    
    if (typeof feedback !== 'string' || feedback.length < 10) {
      throw new Error(`Invalid feedback for ${comp}`);
    }
  }
  
  if (!result.general_feedback || typeof result.general_feedback !== 'string' || result.general_feedback.length < 10) {
    throw new Error('Invalid general_feedback in evaluation result');
  }
}

/**
 * Calculates overall score from competency scores
 */
export function calculateOverallScore(evaluation: GeminiEvaluationResult): number {
  return (
    evaluation.competency_1.score +
    evaluation.competency_2.score +
    evaluation.competency_3.score +
    evaluation.competency_4.score +
    evaluation.competency_5.score
  );
}