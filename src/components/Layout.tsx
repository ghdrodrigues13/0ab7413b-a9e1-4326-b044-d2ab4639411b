import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-secondary rounded-md p-2">
                  <Menu className="w-4 h-4" />
                </SidebarTrigger>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">
                    Estruturador de Roteiros
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Histórias de Aprendizagem
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Dados salvos localmente
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="container max-w-7xl mx-auto p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}