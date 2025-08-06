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

      const response = await fetch('https://0ab7413b-a9e1-4326-b044-d2ab4639411b.supabase.co/functions/v1/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ episodeData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar roteiro');
      }

      return data.script;
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