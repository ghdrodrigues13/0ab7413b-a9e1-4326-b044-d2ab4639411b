import { NavLink, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  Upload, 
  Download, 
  FileText,
  PenTool
} from 'lucide-react';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    title: 'Episódios',
    url: '/episodes',
    icon: BookOpen,
    description: 'Gerenciar episódios da história'
  },
  {
    title: 'Personagens',
    url: '/characters',
    icon: Users,
    description: 'Configurar personagens'
  },
  {
    title: 'Importar',
    url: '/import',
    icon: Upload,
    description: 'Adicionar conteúdo bruto'
  },
  {
    title: 'Exportar',
    url: '/export',
    icon: Download,
    description: 'Exportar roteiros'
  }
];

const toolItems = [
  {
    title: 'Editor',
    url: '/editor',
    icon: PenTool,
    description: 'Editor de episódios'
  },
  {
    title: 'Documentos',
    url: '/documents',
    icon: FileText,
    description: 'Gerenciar documentos'
  }
];

export function Sidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const getLinkClasses = (path: string) => cn(
    "transition-all duration-200 w-full flex items-center gap-3",
    isActive(path)
      ? "bg-primary text-primary-foreground shadow-md"
      : "hover:bg-secondary/50 text-foreground"
  );

  return (
    <SidebarComponent className={collapsed ? "w-16" : "w-64"}>
      <SidebarContent className="bg-gradient-subtle">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="animate-slide-in">
                <h2 className="font-semibold text-lg text-foreground">Narrativa</h2>
                <p className="text-xs text-muted-foreground">Pipeline de Histórias</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="p-0">
                    <NavLink 
                      to={item.url} 
                      className={getLinkClasses(item.url)}
                      title={collapsed ? item.description : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="animate-slide-in">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Ferramentas
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="p-0">
                    <NavLink 
                      to={item.url} 
                      className={getLinkClasses(item.url)}
                      title={collapsed ? item.description : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && (
                        <span className="animate-slide-in">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
}