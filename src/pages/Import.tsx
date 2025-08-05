import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Video, File, Save } from 'lucide-react';
import { RawContent } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';

export default function Import() {
  const { toast } = useToast();
  const [rawContent, setRawContent] = useLocalStorage<RawContent[]>('rawContent', []);
  const [newContent, setNewContent] = useState({
    name: '',
    type: 'other' as RawContent['type'],
    content: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setNewContent({
        name: file.name,
        type: getFileType(file.name),
        content: content
      });
    };
    reader.readAsText(file);
  };

  const getFileType = (filename: string): RawContent['type'] => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'txt':
      case 'doc':
      case 'docx':
        return 'script';
      case 'mp4':
      case 'avi':
      case 'mov':
        return 'video';
      default:
        return 'other';
    }
  };

  const handleSaveContent = () => {
    if (!newContent.name.trim() || !newContent.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome e o conteúdo",
        variant: "destructive"
      });
      return;
    }

    const content: RawContent = {
      id: `content-${Date.now()}`,
      name: newContent.name,
      type: newContent.type,
      content: newContent.content,
      uploadedAt: new Date()
    };

    setRawContent(prev => [...prev, content]);
    setNewContent({ name: '', type: 'other', content: '' });
    
    toast({
      title: "Conteúdo salvo",
      description: "O conteúdo foi adicionado com sucesso",
    });
  };

  const getTypeIcon = (type: RawContent['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5" />;
      case 'script':
        return <File className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  const getTypeLabel = (type: RawContent['type']) => {
    switch (type) {
      case 'pdf':
        return 'PDF';
      case 'script':
        return 'Roteiro';
      case 'video':
        return 'Vídeo';
      default:
        return 'Outro';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Importar Conteúdo</h1>
        <p className="text-muted-foreground mt-2">
          Adicione materiais brutos que servirão como base para seus episódios
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Adicionar Novo Conteúdo
            </CardTitle>
            <CardDescription>
              Carregue arquivos ou cole texto diretamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Upload de Arquivo</label>
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".txt,.pdf,.doc,.docx,.mp4,.avi,.mov"
                className="block w-full mt-1 text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
            </div>

            <div className="border-t pt-4">
              <label className="text-sm font-medium">Ou adicione manualmente:</label>
              
              <div className="space-y-3 mt-2">
                <Input
                  placeholder="Nome do conteúdo"
                  value={newContent.name}
                  onChange={(e) => setNewContent(prev => ({ ...prev, name: e.target.value }))}
                />
                
                <select
                  value={newContent.type}
                  onChange={(e) => setNewContent(prev => ({ ...prev, type: e.target.value as RawContent['type'] }))}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="other">Outro</option>
                  <option value="pdf">PDF</option>
                  <option value="script">Roteiro</option>
                  <option value="video">Vídeo</option>
                </select>
                
                <Textarea
                  placeholder="Cole ou digite o conteúdo aqui..."
                  value={newContent.content}
                  onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                />
                
                <Button onClick={handleSaveContent} className="w-full shadow-creative">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Conteúdo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo Importado</CardTitle>
            <CardDescription>
              {rawContent.length} item(s) disponível(is)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rawContent.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum conteúdo importado ainda</p>
                <p className="text-sm">Adicione arquivos ou texto para começar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rawContent.map((content, index) => (
                  <div 
                    key={content.id} 
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-primary">
                        {getTypeIcon(content.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{content.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {getTypeLabel(content.type)} • {new Date(content.uploadedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {content.content.substring(0, 100)}...
                        </div>
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