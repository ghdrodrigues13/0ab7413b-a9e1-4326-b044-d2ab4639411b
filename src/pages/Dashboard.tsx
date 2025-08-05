import { Episode } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Upload, Download, Plus, BarChart3 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [episodes] = useLocalStorage<Episode[]>('episodes', []);
  
  const completedEpisodes = episodes.filter(ep => ep.status === 'completed').length;
  const draftEpisodes = episodes.filter(ep => ep.status === 'draft').length;

  const quickActions = [
    {
      title: 'Novo Episódio',
      description: 'Criar um novo episódio',
      icon: Plus,
      action: () => navigate('/episodes'),
      color: 'bg-gradient-primary'
    },
    {
      title: 'Personagens',
      description: 'Gerenciar personagens',
      icon: Users,
      action: () => navigate('/characters'),
      color: 'bg-gradient-creative'
    },
    {
      title: 'Importar',
      description: 'Adicionar conteúdo',
      icon: Upload,
      action: () => navigate('/import'),
      color: 'bg-secondary'
    },
    {
      title: 'Exportar',
      description: 'Baixar roteiros',
      icon: Download,
      action: () => navigate('/export'),
      color: 'bg-accent'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center space-y-4 py-8">
        <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto flex items-center justify-center shadow-glow">
          <BookOpen className="w-10 h-10 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground">
            Estruturador de Roteiros
          </h1>
          <p className="text-xl text-muted-foreground mt-2">
            Transforme conteúdo bruto em histórias de aprendizagem envolventes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-creative transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Episódios</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{episodes.length}</div>
            <p className="text-xs text-muted-foreground">
              {episodes.length === 0 ? 'Comece criando seu primeiro episódio' : 'episódios criados'}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-creative transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <BarChart3 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completedEpisodes}</div>
            <p className="text-xs text-muted-foreground">
              episódios finalizados
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-creative transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
            <BarChart3 className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{draftEpisodes}</div>
            <p className="text-xs text-muted-foreground">
              rascunhos pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Ações Rápidas</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card 
              key={action.title}
              className="cursor-pointer hover:shadow-creative transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={action.action}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 ${action.color} rounded-lg mx-auto flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Episodes */}
      {episodes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Episódios Recentes</h2>
            <Button variant="outline" onClick={() => navigate('/episodes')}>
              Ver Todos
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {episodes.slice(0, 3).map((episode, index) => (
              <Card 
                key={episode.id}
                className="cursor-pointer hover:shadow-creative transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(`/editor/${episode.id}`)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-1">
                    {episode.title || 'Episódio Sem Título'}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {episode.description || 'Sem descrição'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      episode.status === 'completed' 
                        ? 'bg-success/20 text-success' 
                        : 'bg-warning/20 text-warning'
                    }`}>
                      {episode.status === 'completed' ? 'Concluído' : 'Rascunho'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(episode.updatedAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started */}
      {episodes.length === 0 && (
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">Bem-vindo!</h3>
              <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Comece criando seu primeiro episódio ou importe conteúdo bruto para estruturar suas histórias de aprendizagem.
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate('/episodes')} className="shadow-creative">
                <Plus className="w-4 h-4 mr-2" />
                Criar Episódio
              </Button>
              <Button variant="outline" onClick={() => navigate('/import')}>
                <Upload className="w-4 h-4 mr-2" />
                Importar Conteúdo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}