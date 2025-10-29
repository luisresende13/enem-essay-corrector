import { supabase } from './supabaseClient';
import { Essay, Evaluation } from '../types';

type SampleEssay = Omit<Essay, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
type SampleEvaluation = Omit<Evaluation, 'id' | 'essay_id' | 'created_at'>;

interface SampleData {
  essay: SampleEssay;
  evaluation: SampleEvaluation;
}

export const SAMPLES: SampleData[] = [
  {
    essay: {
      title: '[Exemplo] O Estigma Associado às Doenças Mentais',
      image_url: '/exemplo-1.jpg',
      raw_transcription: `
No filme estadunidense "Joker", estrelado por Joaquin Phoenix, é tratada a vida de Arthur Fleck, um homem que, em virtude de suas doenças mentais, é seguido e discriminado pela cidade, sendo, inclusive, visto no seu quadro clínico. Assim como na obra cinematográfica abordada, afirma-se que na conjuntura brasileira contemporânea, devido a conceitos preconceituosos perpetuados ao longo da história humana, há um estigma relacionado aos transtornos mentais, uma vez que os indivíduos que possuem tais condições são marginalizados. Ademais, é preciso salientar, ainda, que a sociedade atual carece de informações a respeito de tal assunto, o que gera um estranhamento em torno da questão.

Em primeiro lugar, é necessário mencionar o período da Idade Média na Europa, em que os doentes mentais eram vistos como seres demoníacos, já que, naquela época, não havia estudos acerca dessa temática e, consequentemente, tais indivíduos eram denominados como amaldiçoados. É perceptível, então, que existe uma carga histórica para o estigma atual vivenciado pelas pessoas que têm transtornos mentais, ocasionando um intenso preconceito e exclusão. Outrossim, não se pode esquecer de que, atrelados a conceitos supracitados, tais indivíduos recebem títulos mentirosos, como, por exemplo, o estereótipo de que todos que possuem problemas psicológicos são incapazes de manter relacionamentos saudáveis, ou seja, não conseguem interagir com outros humanos de forma plena. Fica claro, pois, que as doenças mentais são tratadas de forma equivocada, ferindo a dignidade de toda a população.

Em segundo lugar, ressalta-se que há, no Brasil, uma evidente falta de informações sobre os transtornos mentais, forjando grande preconceito e estranhamento com a doença. Nesse sentido, é lícito agenciar o "Mito da Caverna", de Platão, em sua obra "A República", no qual homens, acorrentados em uma caverna, veem sombras na parede, acreditando, portanto, que aquilo era a sua realidade. De uma forma análoga à metáfora abordada, os brasileiros, sem os devidos conhecimentos acerca dos transtornos mentais, vivem na escuridão, isto é, na ignorância, disseminando atitudes preconceituosas. Logo, é existente a grande importância das informações, haja vista que a falta delas aumenta o estigma relacionado às doenças mentais, prejudicando a qualidade de vida das pessoas que as possuem.

Portanto, é mister salientar medidas para sanar os problemas discutidos. Posto isto, cabe à escola, por meio de gerações de ensino, realizar rodas de conversa com os alunos sobre a problemática do preconceito aos transtornos mentais, além de trazer informações científicas a respeito de tal questão. Essa ação pode se concretizar por meio da atuação de psiquiatras e professores de medicina, a fim de desconstruir a visão discriminatória dos estudantes, enquanto que aqueles irão receber dados/informações relevantes acerca dos dramas psiquiátricos. Espera-se, com essa medida, que o estigma associado às doenças mentais seja paulatinamente modificado.
      `.trim(),
      transcription: `
No filme estadunidense "Joker", estrelado por Joaquin Phoenix, é tratada a vida de Arthur Fleck, um homem que, em virtude de suas doenças mentais, é seguido e discriminado pela cidade, sendo, inclusive, visto no seu quadro clínico. Assim como na obra cinematográfica abordada, afirma-se que na conjuntura brasileira contemporânea, devido a conceitos preconceituosos perpetuados ao longo da história humana, há um estigma relacionado aos transtornos mentais, uma vez que os indivíduos que possuem tais condições são marginalizados. Ademais, é preciso salientar, ainda, que a sociedade atual carece de informações a respeito de tal assunto, o que gera um estranhamento em torno da questão.

Em primeiro lugar, é necessário mencionar o período da Idade Média na Europa, em que os doentes mentais eram vistos como seres demoníacos, já que, naquela época, não havia estudos acerca dessa temática e, consequentemente, tais indivíduos eram denominados como amaldiçoados. É perceptível, então, que existe uma carga histórica para o estigma atual vivenciado pelas pessoas que têm transtornos mentais, ocasionando um intenso preconceito e exclusão. Outrossim, não se pode esquecer de que, atrelados a conceitos supracitados, tais indivíduos recebem títulos mentirosos, como, por exemplo, o estereótipo de que todos que possuem problemas psicológicos são incapazes de manter relacionamentos saudáveis, ou seja, não conseguem interagir com outros humanos de forma plena. Fica claro, pois, que as doenças mentais são tratadas de forma equivocada, ferindo a dignidade de toda a população.

Em segundo lugar, ressalta-se que há, no Brasil, uma evidente falta de informações sobre os transtornos mentais, forjando grande preconceito e estranhamento com a doença. Nesse sentido, é lícito agenciar o "Mito da Caverna", de Platão, em sua obra "A República", no qual homens, acorrentados em uma caverna, veem sombras na parede, acreditando, portanto, que aquilo era a sua realidade. De uma forma análoga à metáfora abordada, os brasileiros, sem os devidos conhecimentos acerca dos transtornos mentais, vivem na escuridão, isto é, na ignorância, disseminando atitudes preconceituosas. Logo, é existente a grande importância das informações, haja vista que a falta delas aumenta o estigma relacionado às doenças mentais, prejudicando a qualidade de vida das pessoas que as possuem.

Portanto, é mister salientar medidas para sanar os problemas discutidos. Posto isto, cabe à escola, por meio de gerações de ensino, realizar rodas de conversa com os alunos sobre a problemática do preconceito aos transtornos mentais, além de trazer informações científicas a respeito de tal questão. Essa ação pode se concretizar por meio da atuação de psiquiatras e professores de medicina, a fim de desconstruir a visão discriminatória dos estudantes, enquanto que aqueles irão receber dados/informações relevantes acerca dos dramas psiquiátricos. Espera-se, com essa medida, que o estigma associado às doenças mentais seja paulatinamente modificado.
      `.trim(),
      status: 'evaluated',
    },
    evaluation: {
      overall_score: 800,
      competency_1_score: 160,
      competency_2_score: 160,
      competency_3_score: 160,
      competency_4_score: 160,
      competency_5_score: 160,
      competency_1_feedback: 'O texto demonstra um bom domínio da modalidade escrita formal da língua portuguesa. A estrutura sintática é, em geral, bem construída e a pontuação é adequada na maior parte do tempo. No entanto, alguns desvios pontuais impedem a nota máxima. Há o uso de uma vírgula redundante em \'salientar, ainda, que\' e construções que poderiam ser mais fluidas ou precisas, como \'é existente a grande importância\' (poderia ser \'existe grande importância\' ou \'a importância é grande\') e a expressão \'visto no seu quadro clínico\', que soa um pouco vaga. Apesar desses deslizes, a legibilidade e a adequação à norma culta são boas.',
      competency_2_feedback: 'A redação compreende plenamente o tema e desenvolve uma argumentação dentro da estrutura dissertativo-argumentativa. O repertório sociocultural utilizado é pertinente e produtivo, com a menção ao filme \'Joker\' para contextualizar o estigma, a referência à Idade Média para traçar uma raiz histórica e a analogia com o \'Mito da Caverna\' para discutir a desinformação. Contudo, para atingir a excelência, os argumentos poderiam ser mais aprofundados. A conexão entre a visão medieval e os estereótipos atuais, por exemplo, é afirmada, mas não explorada em detalhe, o que deixa a argumentação boa, mas não excelente.',
      competency_3_feedback: 'O projeto de texto é claro e bem executado. A tese é apresentada na introdução (o estigma é fruto de preconceito histórico e desinformação) e os parágrafos de desenvolvimento a sustentam de forma organizada e coerente, cada um abordando um dos pontos levantados. A progressão textual é lógica. O ponto que limita a pontuação é a falta de um desenvolvimento mais robusto dos argumentos. As informações são bem selecionadas e relacionadas, mas a interpretação e a defesa do ponto de vista poderiam ser mais aprofundadas com exemplos concretos da realidade brasileira ou dados que fortalecessem as afirmações.',
      competency_4_feedback: 'O candidato demonstra bom conhecimento dos mecanismos linguísticos para a construção da argumentação. O uso de operadores argumentativos é variado e eficaz para conectar os parágrafos e as ideias dentro deles (\'Ademais\', \'Em primeiro lugar\', \'Outrossim\', \'Nesse sentido\', \'Logo\', \'Portanto\'). A coesão referencial também é bem empregada. A nota não é máxima devido a pequenas repetições de palavras (\'preconceito\', \'estigma\') que poderiam ser substituídas por sinônimos para enriquecer o vocabulário e a uma leve redundância na conclusão ao usar \'Posto isto\' logo após \'Portanto\'.',
      competency_5_feedback: 'A proposta de intervenção está articulada com a discussão desenvolvida, focando no problema da desinformação. Ela apresenta os cinco elementos essenciais: Agente (a escola), Ação (realizar rodas de conversa e trazer informações científicas), Meio/Modo (atuação de psiquiatras e professores de medicina), Finalidade (desconstruir a visão discriminatória) e Detalhamento (o detalhamento do meio, ao especificar os profissionais envolvidos). No entanto, a proposta carece de maior especificidade para ser considerada excelente. A expressão \'por meio de gerações de ensino\' é vaga, e o trecho final (\'enquanto que aqueles irão receber dados...\') é um pouco confuso. Um maior detalhamento sobre a execução prática da ação a tornaria mais completa.',
      general_feedback: 'A redação apresenta um desempenho bom e muito consistente em todas as competências, demonstrando um candidato com bom domínio da escrita dissertativo-argumentativa. O texto é bem estruturado, aborda o tema corretamente e utiliza um repertório relevante. Os principais pontos de melhoria residem na profundidade da argumentação e no detalhamento da proposta de intervenção. Para alcançar a excelência, sugere-se aprofundar a análise dos argumentos com dados, exemplos concretos ou um raciocínio mais elaborado, ultrapassando o senso comum. Além disso, a proposta de intervenção, embora completa, se beneficiaria de maior especificidade e clareza em seus detalhes. A continuidade dos estudos e da prática certamente levará a notas ainda mais altas.'
    }
  },
  {
    essay: {
      title: 'Dependência Digital e as Consequências Sociais',
      image_url: '/exemplo-2.jpeg',
      raw_transcription: `
No ano de 2018 a Organização Mundial de Saúde classificou a dependência digital e a nomofobia como doenças do século. Hodiernamente, os jovens brasileiros sentem as consequências de uso desenfreado dos meios digitais para se conectar socialmente. Assim sendo, a priorização do digital é consequência da necessidade juvenil de se desenvolver em sociedade.

Primeiramente, é necessário analisar as causas dessa dependência. Segundo dados da Universidade Federal do Espírito Santo, 1 em cada 4 brasileiros é dependente digital. Esse contato constante e a necessidade de o jovem se manter conectado como forma de buscar pertencer à sociedade, o que contribui para o aumento da atividade nas redes digitais e, por consequência, a dependência desses meios em suas vidas sociais.

Em consonância, a série "Black Mirror", em seu episódio intitulado "Nosedive", retrata uma sociedade na qual a vida dos indivíduos é medida de acordo com seu desempenho digital. Nesse caminho, ocorre o descuido dos laços sociais e das aparências, o que faz referência para uma realidade onde o desempenho digital é determinante na vida pessoal. Desse modo, o bem-estar individual e coletivo é deixado em segundo plano e as consequências das aparências digitais não são priorizadas.

Portanto, são necessárias medidas a fim de mitigar as consequências dessa dependência nos jovens brasileiros. Para tanto, o Ministério da Educação, por meio de modificações na Base Comum Curricular, nas disciplinas de sociologia e filosofia, deve inserir a "Cidadania Digital" como obrigatória nos anos fundamentais da educação, visando a auxiliar crianças e adolescentes a como portar-se digitalmente, de modo que as mídias e meios digitais tornem-se aliados no desenvolvimento individual do corpo social. Somente assim, a realidade mostrada em "Black Mirror" continuará pertencente à ficção.
      `.trim(),
      transcription: `
No ano de 2018 a Organização Mundial de Saúde classificou a dependência digital e a nomofobia como doenças do século. Hodiernamente, os jovens brasileiros sentem as consequências de uso desenfreado dos meios digitais para se conectar socialmente. Assim sendo, a priorização do digital é consequência da necessidade juvenil de se desenvolver em sociedade.

Primeiramente, é necessário analisar as causas dessa dependência. Segundo dados da Universidade Federal do Espírito Santo, 1 em cada 4 brasileiros é dependente digital. Esse contato constante e a necessidade de o jovem se manter conectado como forma de buscar pertencer à sociedade, o que contribui para o aumento da atividade nas redes digitais e, por consequência, a dependência desses meios em suas vidas sociais.

Em consonância, a série "Black Mirror", em seu episódio intitulado "Nosedive", retrata uma sociedade na qual a vida dos indivíduos é medida de acordo com seu desempenho digital. Nesse caminho, ocorre o descuido dos laços sociais e das aparências, o que faz referência para uma realidade onde o desempenho digital é determinante na vida pessoal. Desse modo, o bem-estar individual e coletivo é deixado em segundo plano e as consequências das aparências digitais não são priorizadas.

Portanto, são necessárias medidas a fim de mitigar as consequências dessa dependência nos jovens brasileiros. Para tanto, o Ministério da Educação, por meio de modificações na Base Comum Curricular, nas disciplinas de sociologia e filosofia, deve inserir a "Cidadania Digital" como obrigatória nos anos fundamentais da educação, visando a auxiliar crianças e adolescentes a como portar-se digitalmente, de modo que as mídias e meios digitais tornem-se aliados no desenvolvimento individual do corpo social. Somente assim, a realidade mostrada em "Black Mirror" continuará pertencente à ficção.
      `.trim(),
      status: 'evaluated',
    },
    evaluation: {
      overall_score: 800,
      competency_1_score: 160,
      competency_2_score: 160,
      competency_3_score: 160,
      competency_4_score: 160,
      competency_5_score: 160,
      competency_1_feedback: 'O texto demonstra um bom domínio da modalidade escrita formal da língua portuguesa. O vocabulário é adequado e a estrutura sintática é, em geral, bem construída. No entanto, foram observados alguns desvios pontuais que impedem a nota máxima. No primeiro parágrafo, faltou a vírgula após o adjunto adverbial deslocado (\'No ano de 2018,\') e a preposição em \'consequências de uso\' (correto: \'do uso\'). No último parágrafo, a construção \'a como portar-se\' é redundante, sendo preferível \'a portar-se\' ou \'sobre como se portar\'. São desvios que não comprometem a compreensão, mas indicam a necessidade de maior atenção à norma culta.',
      competency_2_feedback: 'A redação compreende bem a proposta e desenvolve o tema dentro dos limites do texto dissertativo-argumentativo. O repertório sociocultural é produtivo e bem utilizado, com a menção à OMS, aos dados da UFES e à série \'Black Mirror\'. A referência à série é pertinente para ilustrar o argumento. Contudo, a articulação entre o repertório e a argumentação poderia ser mais aprofundada. No segundo parágrafo, o dado da UFES é apresentado, mas a análise sobre ele é breve. No terceiro, a conexão entre a ficção e a realidade brasileira poderia ser mais explorada, indo além da analogia. A argumentação é consistente, mas ganharia mais força com um desenvolvimento mais analítico.',
      competency_3_feedback: 'O projeto de texto é claro e bem executado. A redação está organizada com uma introdução que apresenta a tese, dois parágrafos de desenvolvimento que a sustentam e uma conclusão com proposta de intervenção. A progressão textual é lógica. No entanto, a argumentação, embora coerente, poderia ser mais aprofundada para defender o ponto de vista com maior contundência. O primeiro parágrafo de desenvolvimento aponta a causa da dependência, mas de forma um tanto circular. O segundo parágrafo usa uma analogia forte, mas a argumentação se torna mais expositiva sobre a série do que analítica sobre o problema real. Falta um pouco mais de densidade na defesa das ideias apresentadas.',
      competency_4_feedback: 'O texto demonstra bom conhecimento dos mecanismos linguísticos para a construção da argumentação. Há um uso consistente de conectivos para articular os parágrafos e as ideias (\'Primeiramente\', \'Em consonância\', \'Desse modo\', \'Portanto\'). A coesão intraparágrafos também é bem realizada. A única ressalva é o uso de \'Em consonância\' no início do terceiro parágrafo. Este conectivo indica concordância, mas o parágrafo introduz uma nova ideia (uma analogia/consequência) que não está necessariamente em \'consonância\' com a causa discutida anteriormente. Conectivos como \'Ademais\' ou \'Nesse viés\' seriam mais precisos. Apesar dessa pequena imprecisão, a coesão geral do texto é boa.',
      competency_5_feedback: 'A proposta de intervenção é bem articulada com a discussão desenvolvida ao longo do texto e respeita os direitos humanos. Ela apresenta claramente quatro dos cinco elementos essenciais: Agente (Ministério da Educação), Ação (inserir a \'Cidadania Digital\' como obrigatória), Modo/Meio (por meio de modificações na Base Comum Curricular, nas disciplinas de sociologia e filosofia) e Finalidade (auxiliar crianças e adolescentes a se portarem digitalmente). No entanto, falta o \'detalhamento\' de um desses elementos. Por exemplo, poderia ter detalhado a ação, explicando quais temas seriam abordados em \'Cidadania Digital\' (como segurança online, etiqueta digital, gerenciamento de tempo, etc.). A ausência de um detalhamento claro impede a atribuição da nota máxima.',
      general_feedback: 'A redação apresenta uma qualidade geral muito boa, com uma estrutura textual clara, argumentação coerente e um repertório sociocultural relevante. Os principais pontos fortes são a organização das ideias e a compreensão do tema. Para alcançar a excelência, é preciso atentar-se a três pontos principais: 1) Aprofundar a análise argumentativa nos parágrafos de desenvolvimento, indo além da exposição de dados e exemplos. 2) Realizar uma revisão gramatical mais atenta para eliminar pequenos desvios da norma culta. 3) Garantir que a proposta de intervenção contenha todos os cinco elementos exigidos, incluindo um detalhamento claro de um deles. Com esses ajustes, o texto tem grande potencial para atingir a nota máxima.'
    }
  },
  {
    essay: {
      title: 'A Invisibilidade do Registro Civil e a Cidadania',
      image_url: '/exemplo-3.jpg',
      raw_transcription: `
Em "Vidas secas", obra literária do modernista Graciliano Ramos, Fabiano e sua família vivem uma situação degradante marcada pela miséria. Na trama, os filhos do protagonista não recebem nomes, sendo chamados apenas como o "mais velho" e o "mais novo", recurso usado pelo autor para evidenciar a desumanização do indivíduo. Ao sair da ficção, sem desconsiderar o contexto histórico da obra, nota-se que a problemática apresentada ainda percorre a atualidade: a não garantia de cidadania pela invisibilidade da falta de registro civil. A partir desse contexto, não se pode hesitar - é imprescindível compreender os impactos gerados pela falta de identificação oficial da população.

Com efeito, é nítido que o deficitário registro civil repercute, sem dúvida, na persistente falta de pertencimento como cidadão brasileiro. Isso acontece, porque, como foi estudado pelo historiador José Murilo de Carvalho, para que haja uma cidadania completa no Brasil é necessária a existência dos direitos sociais, políticos e civis. Sob essa ótica, percebe-se que, quando o pilar civil não é garantido - em outras palavras, a não efetivação do direito devido à falta do registro em cartório - não é possível fazer com que a cidadania seja alcançada na sociedade. Dessa forma, da mesma maneira que o "mais novo" e o "mais velho" de Graciliano Ramos, quase 3 milhões de brasileiros continuam por ser invisibilizados: sem nome oficial, sem reconhecimento pelo Estado. E, por fim, sem a dignidade de um cidadão.

Além disso, a falta de sentimento de cidadania na população não registrada implica, também, na manutenção de uma sociedade historicamente excludente. Tal questão ocorre, pois, de acordo com a análise da antropóloga brasileira Lilia Schwarcz, desde a Independência do Brasil, não há a formação de um ideal de coletividade - ou seja, de uma "Nação" ao invés de, meramente, um "Estado". Com isso, a corrente de desigualdade social e exclusão do diferente remonta, sobretudo, no que diz respeito às pessoas que não tiveram acesso ao registro oficial, as quais, frequentemente, são obrigadas a lidar com situações humilhantes por parte do restante da sociedade: das mais diversas discriminações até o fato de não poderem ter qualquer outro documento se, antes, não tiverem sua identificação oficial.

Portanto, ao se entender que a falta de cidadania gerada pela invisibilidade do não registro está diretamente ligada à exclusão social, é tempo de combater esse grave problema. Assim, cabe ao Poder Executivo Federal, mais especificamente ao Ministério da Mulher, da Família e dos Direitos Humanos, ampliar o acesso aos cartórios de registro civil. Tal ação deverá ocorrer por meio da implantação de um Projeto Nacional de Incentivo à Identidade Civil, o qual irá articular, junto aos gestores dos municípios brasileiros, campanhas, divulgadas pela mídia socialmente engajada, que expliquem sobre a importância do registro oficial para a garantia da cidadania, além de instruções para se fazer o processo, a fim de mitigar as desigualdades geradas pela falta desses documentos. Afinal, assim como os meninos em "Vidas secas", toda a população merece ter a garantia e o reconhecimento do seu nome e identidade.
      `.trim(),
      transcription: `
Em "Vidas secas", obra literária do modernista Graciliano Ramos, Fabiano e sua família vivem uma situação degradante marcada pela miséria. Na trama, os filhos do protagonista não recebem nomes, sendo chamados apenas como o "mais velho" e o "mais novo", recurso usado pelo autor para evidenciar a desumanização do indivíduo. Ao sair da ficção, sem desconsiderar o contexto histórico da obra, nota-se que a problemática apresentada ainda percorre a atualidade: a não garantia de cidadania pela invisibilidade da falta de registro civil. A partir desse contexto, não se pode hesitar - é imprescindível compreender os impactos gerados pela falta de identificação oficial da população.

Com efeito, é nítido que o deficitário registro civil repercute, sem dúvida, na persistente falta de pertencimento como cidadão brasileiro. Isso acontece, porque, como foi estudado pelo historiador José Murilo de Carvalho, para que haja uma cidadania completa no Brasil é necessária a existência dos direitos sociais, políticos e civis. Sob essa ótica, percebe-se que, quando o pilar civil não é garantido - em outras palavras, a não efetivação do direito devido à falta do registro em cartório - não é possível fazer com que a cidadania seja alcançada na sociedade. Dessa forma, da mesma maneira que o "mais novo" e o "mais velho" de Graciliano Ramos, quase 3 milhões de brasileiros continuam por ser invisibilizados: sem nome oficial, sem reconhecimento pelo Estado. E, por fim, sem a dignidade de um cidadão.

Além disso, a falta de sentimento de cidadania na população não registrada implica, também, na manutenção de uma sociedade historicamente excludente. Tal questão ocorre, pois, de acordo com a análise da antropóloga brasileira Lilia Schwarcz, desde a Independência do Brasil, não há a formação de um ideal de coletividade - ou seja, de uma "Nação" ao invés de, meramente, um "Estado". Com isso, a corrente de desigualdade social e exclusão do diferente remonta, sobretudo, no que diz respeito às pessoas que não tiveram acesso ao registro oficial, as quais, frequentemente, são obrigadas a lidar com situações humilhantes por parte do restante da sociedade: das mais diversas discriminações até o fato de não poderem ter qualquer outro documento se, antes, não tiverem sua identificação oficial.

Portanto, ao se entender que a falta de cidadania gerada pela invisibilidade do não registro está diretamente ligada à exclusão social, é tempo de combater esse grave problema. Assim, cabe ao Poder Executivo Federal, mais especificamente ao Ministério da Mulher, da Família e dos Direitos Humanos, ampliar o acesso aos cartórios de registro civil. Tal ação deverá ocorrer por meio da implantação de um Projeto Nacional de Incentivo à Identidade Civil, o qual irá articular, junto aos gestores dos municípios brasileiros, campanhas, divulgadas pela mídia socialmente engajada, que expliquem sobre a importância do registro oficial para a garantia da cidadania, além de instruções para se fazer o processo, a fim de mitigar as desigualdades geradas pela falta desses documentos. Afinal, assim como os meninos em "Vidas secas", toda a população merece ter a garantia e o reconhecimento do seu nome e identidade.
      `.trim(),
      status: 'evaluated',
    },
    evaluation: {
      overall_score: 960,
      competency_1_score: 160,
      competency_2_score: 200,
      competency_3_score: 200,
      competency_4_score: 200,
      competency_5_score: 200,
      competency_1_feedback: 'O texto demonstra um bom domínio da modalidade escrita formal da língua portuguesa. A estrutura sintática é complexa e o vocabulário é adequado. No entanto, foram observados alguns desvios pontuais que impedem a nota máxima. No segundo parágrafo, a vírgula em \'Isso acontece, porque\' é desnecessária. No terceiro parágrafo, a regência do verbo \'remontar\' poderia ser mais precisa (\'remonta a\' em vez de \'remonta... no que diz respeito\'). Na conclusão, a expressão \'para se fazer o processo\' soa ligeiramente informal, podendo ser substituída por \'para realizar o processo\'. São deslizes pontuais em uma estrutura geral muito bem construída.',
      competency_2_feedback: 'A redação demonstra excelente compreensão do tema, abordando de forma completa a relação entre a falta de registro civil, a invisibilidade e a ausência de cidadania. A estrutura dissertativo-argumentativa é seguida com primor. O repertório sociocultural é vasto, pertinente e, mais importante, produtivo. A referência a \'Vidas Secas\' na introdução é muito bem articulada com o tema. Nos parágrafos de desenvolvimento, os conceitos de José Murilo de Carvalho sobre cidadania e de Lilia Schwarcz sobre a formação nacional são utilizados de forma eficaz para fundamentar solidamente a argumentação.',
      competency_3_feedback: 'O projeto de texto é claro e executado de maneira exemplar. As ideias são selecionadas, relacionadas e organizadas de forma lógica e coerente em defesa de um ponto de vista. A introdução apresenta a tese de forma eficaz, e os parágrafos de desenvolvimento a aprofundam com uma progressão clara: o primeiro foca na consequência direta (perda da cidadania) e o segundo, na consequência social mais ampla (manutenção da exclusão). A argumentação é consistente e convincente do início ao fim.',
      competency_4_feedback: 'O candidato demonstra excelente domínio dos mecanismos linguísticos necessários para a construção da argumentação. O uso de operadores argumentativos para conectar os parágrafos (\'Com efeito\', \'Além disso\', \'Portanto\') e as ideias dentro deles é variado e preciso, garantindo a fluidez e a clareza do texto. A coesão referencial é bem trabalhada, evitando repetições desnecessárias e contribuindo para a progressão textual. A articulação entre as partes do texto é impecável.',
      competency_5_feedback: 'A proposta de intervenção é excelente, pois está completa e bem articulada com a discussão desenvolvida ao longo do texto. Todos os cinco elementos essenciais estão presentes e bem definidos: o Agente (Poder Executivo Federal, detalhado como o Ministério da Mulher, da Família e dos Direitos Humanos), a Ação (ampliar o acesso aos cartórios/implantar um Projeto Nacional), o Modo/Meio (implantação do projeto com campanhas informativas), a Finalidade (\'a fim de mitigar as desigualdades\') e o Detalhamento (especificação sobre o conteúdo e divulgação das campanhas). A proposta é concreta, viável e respeita os direitos humanos.',
      general_feedback: 'A redação é de altíssimo nível, demonstrando maturidade intelectual e excelente domínio das competências exigidas pelo ENEM. Os pontos mais fortes são a argumentação sólida, o uso produtivo de um repertório diversificado e a estrutura textual coesa e coerente. A proposta de intervenção é exemplar. O único ponto que merece atenção é a revisão final do texto para eliminar pequenos desvios gramaticais e de sintaxe, o que garantiria a nota máxima em todas as competências. No geral, é um trabalho excelente que cumpre com brilhantismo o que foi proposto.'
    }
  }
];

export async function addSampleEssaysToUser(userId: string): Promise<void> {
  for (const sample of SAMPLES) {
    // Insert the essay
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .insert({
        ...sample.essay,
        user_id: userId,
      })
      .select()
      .single();

    if (essayError) {
      console.error('Error adding sample essay:', essayError);
      throw new Error('Failed to add sample essay');
    }

    // Insert the evaluation
    const { error: evaluationError } = await supabase
      .from('evaluations')
      .insert({
        ...sample.evaluation,
        essay_id: essay.id,
      });

    if (evaluationError) {
      console.error('Error adding sample evaluation:', evaluationError);
      // Optional: Delete the essay if the evaluation fails to be created
      await supabase.from('essays').delete().eq('id', essay.id);
      throw new Error('Failed to add sample evaluation');
    }
  }
}