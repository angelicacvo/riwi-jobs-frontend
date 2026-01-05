import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  BarChart3, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.GESTOR, UserRole.CODER] },
  { label: 'Usuarios', href: '/users', icon: Users, roles: [UserRole.ADMIN] },
  { label: 'Vacantes', href: '/vacancies', icon: Briefcase, roles: [UserRole.ADMIN, UserRole.GESTOR] },
  { label: 'Explorar Vacantes', href: '/explore', icon: Briefcase, roles: [UserRole.CODER] },
  { label: 'Postulaciones', href: '/applications', icon: FileText, roles: [UserRole.ADMIN, UserRole.GESTOR, UserRole.CODER] },
  { label: 'Métricas', href: '/metrics', icon: BarChart3, roles: [UserRole.ADMIN, UserRole.GESTOR] },
  { label: 'Mi Perfil', href: '/profile', icon: User, roles: [UserRole.ADMIN, UserRole.GESTOR, UserRole.CODER] },
];

const Sidebar = () => {
  const { user, hasRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = navItems.filter(item => hasRole(item.roles));

  const handleLogout = () => {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas salir?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'hsl(240, 50%, 12%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }
    });
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-accent text-accent-foreground';
      case UserRole.GESTOR:
        return 'bg-success text-success-foreground';
      case UserRole.CODER:
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 flex flex-col",
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center">
              <Code2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">Riwi Jobs</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
          <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
          <span className={cn("text-xs px-2 py-1 rounded-full mt-2 inline-block", getRoleBadgeColor(user.role))}>
            {user.role}
          </span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-sidebar-accent",
                isActive 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow" 
                  : "text-sidebar-foreground/80"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
