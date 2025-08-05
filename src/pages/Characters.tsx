import { useState } from 'react';
import { Character } from '@/types';
import { defaultCharacters } from '@/data/characters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Edit, Plus, Save } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function Characters() {
  const [characters, setCharacters] = useLocalStorage<Character[]>('characters', defaultCharacters);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter({ ...character });
    setIsDialogOpen(true);
  };

  const handleSaveCharacter = () => {
    if (!editingCharacter) return;
    
    setCharacters(prev => 
      prev.map(char => 
        char.id === editingCharacter.id ? editingCharacter : char
      )
    );
    
    setIsDialogOpen(false);
    setEditingCharacter(null);
  };

  const handleCreateCharacter = () => {
    const newCharacter: Character = {
      id: `character-${Date.now()}`,
      name: '',
      description: '',
      traits: [],
      role: ''
    };
    
    setEditingCharacter(newCharacter);
    setIsDialogOpen(true);
  };

  const updateEditingCharacter = (field: keyof Character, value: any) => {
    if (!editingCharacter) return;
    setEditingCharacter(prev => prev ? { ...prev, [field]: value } : null);
  };

  const addTrait = (trait: string) => {
    if (!editingCharacter || !trait.trim()) return;
    updateEditingCharacter('traits', [...editingCharacter.traits, trait.trim()]);
  };

  const removeTrait = (index: number) => {
    if (!editingCharacter) return;
    updateEditingCharacter('traits', editingCharacter.traits.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Personagens</h1>
          <p className="text-muted-foreground mt-2">
            Configure os personagens das suas histórias de aprendizagem
          </p>
        </div>
        <Button onClick={handleCreateCharacter} className="shadow-creative">
          <Plus className="w-4 h-4 mr-2" />
          Novo Personagem
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {characters.map((character, index) => (
          <Card 
            key={character.id} 
            className="hover:shadow-creative transition-all duration-300 animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{character.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {character.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditCharacter(character)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription className="line-clamp-3">
                {character.description}
              </CardDescription>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Características:</h4>
                <div className="flex flex-wrap gap-1">
                  {character.traits.map((trait, traitIndex) => (
                    <Badge key={traitIndex} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Character Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCharacter?.name ? 'Editar Personagem' : 'Novo Personagem'}
            </DialogTitle>
          </DialogHeader>
          
          {editingCharacter && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={editingCharacter.name}
                    onChange={(e) => updateEditingCharacter('name', e.target.value)}
                    placeholder="Nome do personagem"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Papel</label>
                  <Input
                    value={editingCharacter.role}
                    onChange={(e) => updateEditingCharacter('role', e.target.value)}
                    placeholder="Ex: Protagonista, Mentor, etc."
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={editingCharacter.description}
                  onChange={(e) => updateEditingCharacter('description', e.target.value)}
                  placeholder="Descrição detalhada do personagem"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Características</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingCharacter.traits.map((trait, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTrait(index)}
                    >
                      {trait} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nova característica"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTrait(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      addTrait(input.value);
                      input.value = '';
                    }}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveCharacter}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}