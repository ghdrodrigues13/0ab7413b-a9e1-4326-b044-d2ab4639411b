import { useState } from 'react';
import { Episode, Character } from '@/types';

export function useScriptGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateScript = async (episode: Episode, characters: Character[]): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Prepare episode data with character details
      const selectedCharacters = characters.filter(char => 
        episode.characters.includes(char.id)
      );

      const episodeData = {
        title: episode.title,
        description: episode.description,
        theme: episode.theme,
        objectives: episode.objectives.filter(obj => obj.trim()),
        characters: selectedCharacters,
        conflict: episode.conflict,
        learningOutcome: episode.learningOutcome,
        cliffhanger: episode.cliffhanger,
      };

      // Simulate AI generation for now with a detailed template
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading
      
      const episodeNumber = Math.floor(Math.random() * 100) + 1;
      
      let script = `# Roteiro – Episódio ${episodeNumber}\n\n`;
      
      script += `## 1. Dados Gerais\n`;
      script += `- **Título provisório:** ${episode.title || 'Sem título'}\n`;
      script += `- **Duração estimada:** até 5 min\n`;
      script += `- **Objetivos de aprendizagem:**\n`;
      episode.objectives.forEach(obj => {
        if (obj.trim()) script += `  - ${obj}\n`;
      });
      
      script += `\n## 2. Personagens em Cena\n`;
      selectedCharacters.forEach(char => {
        script += `- **${char.name}** (${char.role}): ${char.description}\n`;
      });
      
      script += `\n## 3. Cenários\n`;
      script += `- **Internos:** Sala de reuniões da Defesa Civil, Centro comunitário\n`;
      script += `- **Externos:** Ruas da comunidade, Praça central\n`;
      
      script += `\n## 4. Estrutura Narrativa\n`;
      script += `1. **Abertura / Gancho:**\n   ${episode.description || 'A equipe se reúne para discutir os próximos passos da implementação dos Nupdecs.'}\n`;
      script += `2. **Conflito / Dúvida:**\n   ${episode.conflict || 'Surgem dúvidas sobre como abordar as comunidades e quais critérios usar para priorização.'}\n`;
      script += `3. **Desenvolvimento:**\n   Os personagens visitam diferentes comunidades, ouvem os moradores e identificam as necessidades específicas de cada local.\n`;
      script += `4. **Síntese & Gancho próximo episódio:**\n   ${episode.cliffhanger || 'Uma situação inesperada força a equipe a repensar sua estratégia.'}\n`;
      
      script += `\n## 5. Diálogo\n`;
      script += `### Cena 1 - Sala de Reuniões\n`;
      if (selectedCharacters.length >= 2) {
        script += `- **${selectedCharacters[0].name}:** "Precisamos definir os critérios para escolher as primeiras comunidades. Não podemos começar sem um plano claro."\n`;
        script += `- **${selectedCharacters[1].name}:** "Concordo. Mas também precisamos ouvir o que as próprias comunidades têm a dizer sobre suas necessidades."\n`;
      }
      script += `\n### Cena 2 - Visita à Comunidade\n`;
      script += `- **Morador:** "Vocês já vieram aqui antes prometendo ajuda. Como sabemos que desta vez será diferente?"\n`;
      if (selectedCharacters.length > 0) {
        script += `- **${selectedCharacters[0].name}:** "Entendo sua desconfiança. Desta vez queremos construir algo junto com vocês, não para vocês."\n`;
      }
      
      script += `\n## 6. Descrição da Cena\n`;
      script += `- **Cena 1:** Interior da sala de reuniões com mapas da cidade espalhados sobre a mesa. Iluminação natural através de janelas grandes.\n`;
      script += `- **Cena 2:** Ambiente externo na comunidade, com casas simples ao fundo e moradores reunidos em círculo.\n`;
      script += `- **Cena 3:** Close-up nos rostos dos personagens mostrando determinação e esperança.\n`;
      
      script += `\n## 7. Descrição da Animação\n`;
      script += `- **Cena 1:** enquadramento: plano geral da sala; movimento de câmera: panorâmica lenta sobre os mapas\n`;
      script += `- **Cena 2:** enquadramento: plano médio do grupo; movimento de câmera: aproximação gradual\n`;
      script += `- **Cena 3:** enquadramento: close-up; movimento de câmera: estático com foco suave\n`;
      
      script += `\n## 8. B-roll\n`;
      script += `- **Cena 1:** Imagens de mapas e documentos sendo analisados\n`;
      script += `- **Cena 2:** Planos de estabelecimento da comunidade\n`;
      script += `- **Cena 3:** Detalhes das expressões dos moradores\n`;
      
      script += `\n## 9. Resultado de Aprendizagem\n`;
      script += `${episode.learningOutcome || 'Os participantes compreendem a importância da escuta ativa e do trabalho colaborativo na implementação dos Nupdecs.'}\n`;
      
      return script;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateScript,
    isGenerating,
    error,
  };
}