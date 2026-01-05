import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import GestorDashboard from '@/components/dashboard/GestorDashboard';
import CoderDashboard from '@/components/dashboard/CoderDashboard';
import Layout from '@/components/layout/Layout';

const DashboardPage = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.GESTOR:
        return <GestorDashboard />;
      case UserRole.CODER:
        return <CoderDashboard />;
      default:
        return <div>Dashboard no disponible</div>;
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            ¡Hola, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido a tu panel de {user?.role.toLowerCase()}
          </p>
        </div>
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default DashboardPage;
