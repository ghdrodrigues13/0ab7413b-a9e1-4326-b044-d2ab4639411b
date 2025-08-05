import { useState } from 'react';
import { Episode, Character } from '@/types';
import { defaultCharacters } from '@/data/characters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, FileText, BookOpen, Check } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

export default function Export() {
  const { toast } = useToast();
  const [episodes] = useLocalStorage<Episode[]>('episodes', []);
  const [characters] = useLocalStorage<Character[]>('characters', defaultCharacters);
  const [selectedEpisodes, setSelectedEpisodes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'pdf'>('markdown');

  const toggleEpisode = (episodeId: string) => {
    setSelectedEpisodes(prev =>
      prev.includes(episodeId)
        ? prev.filter(id => id !== episodeId)
        : [...prev, episodeId]
    );
  };

  const selectAll = () => {
    setSelectedEpisodes(episodes.map(ep => ep.id));
  };

  const clearSelection = () => {
    setSelectedEpisodes([]);
  };

  const getCharacterName = (characterId: string) => {
    return characters.find(char => char.id === characterId)?.name || characterId;
  };

  const generateMarkdown = (episodesToExport: Episode[]) => {
    let markdown = '# Roteiros das Histórias de Aprendizagem\n\n';
    
    episodesToExport.forEach((episode, index) => {
      markdown += `## Episódio ${index + 1}: ${episode.title || 'Sem título'}\n\n`;
      
      if (episode.description) {
        markdown += `**Descrição:** ${episode.description}\n\n`;
      }
      
      if (episode.theme) {
        markdown += `**Tema:** ${episode.theme}\n\n`;
      }
      
      if (episode.objectives.length > 0) {
        markdown += `### Objetivos de Aprendizagem\n`;
        episode.objectives.forEach((obj, i) => {
          markdown += `${i + 1}. ${obj}\n`;
        });
        markdown += '\n';
      }
      
      if (episode.characters.length > 0) {
        markdown += `### Personagens\n`;
        episode.characters.forEach(charId => {
          const char = characters.find(c => c.id === charId);
          if (char) {
            markdown += `- **${char.name}:** ${char.role}\n`;
          }
        });
        markdown += '\n';
      }
      
      if (episode.conflict) {
        markdown += `### Conflito\n${episode.conflict}\n\n`;
      }
      
      if (episode.learningOutcome) {
        markdown += `### Resultado de Aprendizagem\n${episode.learningOutcome}\n\n`;
      }
      
      if (episode.cliffhanger) {
        markdown += `### Gancho\n${episode.cliffhanger}\n\n`;
      }
      
      markdown += '---\n\n';
    });
    
    return markdown;
  };

  const exportAsMarkdown = () => {
    if (selectedEpisodes.length === 0) {
      toast({
        title: "Nenhum episódio selecionado",
        description: "Selecione pelo menos um episódio para exportar",
        variant: "destructive"
      });
      return;
    }

    const episodesToExport = episodes.filter(ep => selectedEpisodes.includes(ep.id));
    const markdown = generateMarkdown(episodesToExport);
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roteiros-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportação concluída",
      description: `${selectedEpisodes.length} episódio(s) exportado(s) como Markdown`,
    });
  };

  const exportAsPDF = () => {
    if (selectedEpisodes.length === 0) {
      toast({
        title: "Nenhum episódio selecionado",
        description: "Selecione pelo menos um episódio para exportar",
        variant: "destructive"
      });
      return;
    }

    const episodesToExport = episodes.filter(ep => selectedEpisodes.includes(ep.id));
    const content = generateMarkdown(episodesToExport);
    
    // Simple HTML conversion for PDF
    const htmlContent = content
      .replace(/# /g, '<h1>')
      .replace(/## /g, '<h2>')
      .replace(/### /g, '<h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Roteiros das Histórias de Aprendizagem</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #333; border-bottom: 2px solid #333; }
              h2 { color: #666; margin-top: 30px; }
              h3 { color: #888; }
              hr { margin: 30px 0; }
            </style>
          </head>
          <body>${htmlContent}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({
      title: "PDF gerado",
      description: "Use Ctrl+P (Cmd+P) para salvar como PDF",
    });
  };

  const handleExport = () => {
    if (exportFormat === 'markdown') {
      exportAsMarkdown();
    } else {
      exportAsPDF();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Exportar Roteiros</h1>
        <p className="text-muted-foreground mt-2">
          Exporte seus episódios como Markdown ou PDF
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Export Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Configurações de Exportação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-3 block">Formato</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exportFormat === 'markdown'}
                    onCheckedChange={() => setExportFormat('markdown')}
                  />
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Markdown (.md)</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={exportFormat === 'pdf'}
                    onCheckedChange={() => setExportFormat('pdf')}
                  />
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">PDF</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex gap-2 mb-3">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Selecionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Limpar Seleção
                </Button>
              </div>
              
              <Button 
                onClick={handleExport} 
                disabled={selectedEpisodes.length === 0}
                className="w-full shadow-creative"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar {selectedEpisodes.length} Episódio(s)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Episode Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Episódios</CardTitle>
            <CardDescription>
              {episodes.length} episódio(s) disponível(is)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {episodes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum episódio criado ainda</p>
                <p className="text-sm">Crie episódios para poder exportá-los</p>
              </div>
            ) : (
              <div className="space-y-3">
                {episodes.map((episode, index) => (
                  <div 
                    key={episode.id}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Checkbox
                      checked={selectedEpisodes.includes(episode.id)}
                      onCheckedChange={() => toggleEpisode(episode.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {episode.title || `Episódio ${index + 1}`}
                        </span>
                        {episode.status === 'completed' && (
                          <Check className="w-4 h-4 text-success" />
                        )}
                      </div>
                      {episode.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {episode.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        {episode.theme && (
                          <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">
                            {episode.theme}
                          </span>
                        )}
                        {episode.characters.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {episode.characters.length} personagem(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}