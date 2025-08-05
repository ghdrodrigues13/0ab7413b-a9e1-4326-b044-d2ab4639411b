import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Episode, Character } from '@/types';
import { defaultCharacters } from '@/data/characters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, ArrowLeft, Users, Target, BookOpen, Zap, FileText } from 'lucide-react';
import { useLocalStorage, useAutoSave } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function EpisodeEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [episodes, setEpisodes] = useLocalStorage<Episode[]>('episodes', []);
  const [characters] = useLocalStorage<Character[]>('characters', defaultCharacters);
  const [episode, setEpisode] = useState<Episode | null>(null);

  // Auto-save episode data
  useAutoSave(`episode-${id}`, episode, 2000);

  useEffect(() => {
    if (!id) return;
    
    const foundEpisode = episodes.find(ep => ep.id === id);
    if (foundEpisode) {
      setEpisode(foundEpisode);
    } else {
      // If episode not found, redirect back
      navigate('/episodes');
    }
  }, [id, episodes, navigate]);

  const updateEpisode = (field: keyof Episode, value: any) => {
    if (!episode) return;
    
    const updatedEpisode = {
      ...episode,
      [field]: value,
      updatedAt: new Date()
    };
    
    setEpisode(updatedEpisode);
  };

  const handleSave = () => {
    if (!episode) return;
    
    setEpisodes(prev => 
      prev.map(ep => ep.id === episode.id ? episode : ep)
    );
    
    toast({
      title: "Episódio salvo",
      description: "Suas alterações foram salvas com sucesso.",
    });
  };

  const toggleCharacter = (characterId: string) => {
    if (!episode) return;
    
    const isSelected = episode.characters.includes(characterId);
    const newCharacters = isSelected
      ? episode.characters.filter(id => id !== characterId)
      : [...episode.characters, characterId];
    
    updateEpisode('characters', newCharacters);
  };

  const addObjective = () => {
    if (!episode) return;
    updateEpisode('objectives', [...episode.objectives, '']);
  };

  const updateObjective = (index: number, value: string) => {
    if (!episode) return;
    const newObjectives = [...episode.objectives];
    newObjectives[index] = value;
    updateEpisode('objectives', newObjectives);
  };

  const removeObjective = (index: number) => {
    if (!episode) return;
    const newObjectives = episode.objectives.filter((_, i) => i !== index);
    updateEpisode('objectives', newObjectives);
  };

  const markAsCompleted = () => {
    if (!episode) return;
    updateEpisode('status', 'completed');
    handleSave();
    toast({
      title: "Episódio concluído",
      description: "O episódio foi marcado como concluído.",
    });
  };

  const generateScript = () => {
    if (!episode) return '';
    
    const episodeNumber = episodes.findIndex(ep => ep.id === episode.id) + 1;
    
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
    script += `- **Internos:** [A definir]\n`;
    script += `- **Externos:** [A definir]\n`;
    
    script += `\n## 4. Estrutura Narrativa\n`;
    script += `1. **Abertura / Gancho:**\n   ${episode.description || '[A definir]'}\n`;
    script += `2. **Conflito / Dúvida:**\n   ${episode.conflict || '[A definir]'}\n`;
    script += `3. **Desenvolvimento:**\n   [A definir]\n`;
    script += `4. **Síntese & Gancho próximo episódio:**\n   ${episode.cliffhanger || '[A definir]'}\n`;
    
    script += `\n## 5. Diálogo (quando houver)\n`;
    script += `### Cena 1\n`;
    script += `- **[Personagem]:** "[Diálogo a definir]"\n`;
    
    script += `\n## 6. Descrição da Cena\n`;
    script += `- **Cena 1:** [Descrição a definir]\n`;
    
    script += `\n## 7. Descrição da Animação\n`;
    script += `- **Cena 1:** enquadramento: [A definir]; movimento de câmera: [A definir]\n`;
    
    script += `\n## 8. B-roll (quando houver)\n`;
    script += `- **Cena 1:** [Descrição a definir]\n`;
    
    script += `\n## 9. Resultado de Aprendizagem\n`;
    script += `${episode.learningOutcome || '[A definir]'}\n`;
    
    return script;
  };

  if (!episode) {
    return <div>Carregando...</div>;
  }

  const selectedCharacters = characters.filter(char => 
    episode.characters.includes(char.id)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/episodes')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Editor de Episódio</h1>
            <p className="text-muted-foreground">
              {episode.status === 'completed' ? 'Episódio Concluído' : 'Rascunho'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleSave} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Roteiro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Roteiro Gerado</DialogTitle>
                <DialogDescription>
                  Roteiro baseado nas informações preenchidas do episódio
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] w-full">
                <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded-lg">
                  {generateScript()}
                </pre>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          
          {episode.status === 'draft' && (
            <Button onClick={markAsCompleted} className="shadow-creative">
              <BookOpen className="w-4 h-4 mr-2" />
              Concluir
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título do Episódio</label>
                <Input
                  value={episode.title}
                  onChange={(e) => updateEpisode('title', e.target.value)}
                  placeholder="Digite o título do episódio"
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={episode.description}
                  onChange={(e) => updateEpisode('description', e.target.value)}
                  placeholder="Descreva brevemente o episódio"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Tema Central</label>
                <Input
                  value={episode.theme}
                  onChange={(e) => updateEpisode('theme', e.target.value)}
                  placeholder="Qual o tema principal deste episódio?"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivos de Aprendizagem
              </CardTitle>
              <CardDescription>
                Defina os objetivos que os alunos devem alcançar com este episódio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {episode.objectives.map((objective, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    placeholder={`Objetivo ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeObjective(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    ×
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addObjective} className="w-full">
                Adicionar Objetivo
              </Button>
            </CardContent>
          </Card>

          {/* Story Elements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Elementos da História
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Conflito</label>
                <Textarea
                  value={episode.conflict}
                  onChange={(e) => updateEpisode('conflict', e.target.value)}
                  placeholder="Qual é o conflito ou desafio principal deste episódio?"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Resultado de Aprendizagem</label>
                <Textarea
                  value={episode.learningOutcome}
                  onChange={(e) => updateEpisode('learningOutcome', e.target.value)}
                  placeholder="O que os personagens (e alunos) aprendem ao final?"
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Gancho (Cliffhanger)</label>
                <Textarea
                  value={episode.cliffhanger}
                  onChange={(e) => updateEpisode('cliffhanger', e.target.value)}
                  placeholder="Como termina o episódio? Qual o gancho para o próximo?"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Character Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Personagens
              </CardTitle>
              <CardDescription>
                Selecione os personagens que aparecerão neste episódio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {characters.map((character) => (
                <div 
                  key={character.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={episode.characters.includes(character.id)}
                    onCheckedChange={() => toggleCharacter(character.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{character.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {character.description}
                    </div>
                    <Badge variant="outline" className="text-xs mt-1">
                      {character.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Characters Summary */}
          {selectedCharacters.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personagens Selecionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedCharacters.map((character) => (
                    <div key={character.id} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm font-medium">{character.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}