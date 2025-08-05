import { useState } from 'react';
import { Episode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export default function Episodes() {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useLocalStorage<Episode[]>('episodes', []);

  const handleCreateEpisode = () => {
    const newEpisode: Episode = {
      id: `episode-${Date.now()}`,
      title: '',
      description: '',
      objectives: [],
      theme: '',
      characters: [],
      conflict: '',
      learningOutcome: '',
      cliffhanger: '',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEpisodes(prev => [...prev, newEpisode]);
    navigate(`/editor/${newEpisode.id}`);
  };

  const handleDeleteEpisode = (id: string) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== id));
  };

  const getStatusIcon = (status: Episode['status']) => {
    return status === 'completed' ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <Clock className="w-4 h-4 text-warning" />
    );
  };

  const getStatusColor = (status: Episode['status']) => {
    return status === 'completed' ? 'success' : 'warning';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Episódios</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os episódios da sua história de aprendizagem
          </p>
        </div>
        <Button 
          onClick={handleCreateEpisode}
          className="shadow-creative hover:shadow-glow transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Episódio
        </Button>
      </div>

      {episodes.length === 0 ? (
        <Card className="border-dashed border-2 border-muted text-center p-12">
          <CardContent className="space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
              <Plus className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Nenhum episódio criado</h3>
              <p className="text-muted-foreground mt-2">
                Comece criando seu primeiro episódio para estruturar sua história de aprendizagem.
              </p>
            </div>
            <Button onClick={handleCreateEpisode} size="lg" className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Episódio
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {episodes.map((episode, index) => (
            <Card 
              key={episode.id} 
              className="hover:shadow-creative transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(episode.status)}
                    <Badge variant={getStatusColor(episode.status) as any}>
                      {episode.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/editor/${episode.id}`)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEpisode(episode.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <CardTitle className="text-lg line-clamp-2">
                    {episode.title || `Episódio ${index + 1}`}
                  </CardTitle>
                  {episode.description && (
                    <CardDescription className="line-clamp-3 mt-2">
                      {episode.description}
                    </CardDescription>
                  )}
                </div>
                
                {episode.theme && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Tema: </span>
                    <span className="text-muted-foreground">{episode.theme}</span>
                  </div>
                )}
                
                {episode.characters.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-foreground">Personagens: </span>
                    <span className="text-muted-foreground">
                      {episode.characters.length} selecionado(s)
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                  Atualizado em {new Date(episode.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}