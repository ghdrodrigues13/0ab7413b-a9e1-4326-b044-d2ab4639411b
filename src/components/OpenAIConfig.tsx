import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function OpenAIConfig() {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma chave da API válida.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation with Supabase, this would be sent to an edge function
    // For now, we'll just show instructions
    toast({
      title: "Configuração necessária",
      description: "Configure a chave OPENAI_API_KEY no Supabase Edge Functions Secrets.",
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurar IA
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurar OpenAI</DialogTitle>
          <DialogDescription>
            Para usar a geração de roteiro com IA, você precisa configurar sua chave da API OpenAI no Supabase.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Chave da API OpenAI</label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="mt-1"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Para configurar:</p>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>Acesse o Supabase Dashboard</li>
              <li>Vá em Edge Functions → Secrets</li>
              <li>Adicione uma nova secret com nome: <code>OPENAI_API_KEY</code></li>
              <li>Cole sua chave da OpenAI como valor</li>
            </ol>
          </div>
          <Button onClick={handleSaveKey} className="w-full">
            Entendi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}