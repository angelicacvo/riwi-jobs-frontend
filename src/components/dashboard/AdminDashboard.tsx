import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Briefcase, FileText, TrendingUp, Plus, Settings, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from './StatsCard';
import { userService } from '@/services/userService';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { UserStats, VacancyStats, ApplicationStats, PopularVacancy } from '@/types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const COLORS = ['hsl(12, 80%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)'];

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [vacancyStats, setVacancyStats] = useState<VacancyStats | null>(null);
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);
  const [popularVacancies, setPopularVacancies] = useState<PopularVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, vacancies, apps, popular] = await Promise.all([
          userService.getStats(),
          vacancyService.getGeneralStats(),
          applicationService.getDashboard(),
          applicationService.getPopularVacancies(),
        ]);
        setUserStats(users);
        setVacancyStats(vacancies);
        setAppStats(apps);
        setPopularVacancies(popular.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = userStats ? [
    { name: 'Admin', value: userStats.usersByRole.ADMIN },
    { name: 'Gestor', value: userStats.usersByRole.GESTOR },
    { name: 'Coder', value: userStats.usersByRole.CODER },
  ] : [];

  const barData = popularVacancies.map(v => ({
    name: v.title.length > 15 ? v.title.substring(0, 15) + '...' : v.title,
    postulaciones: v.applicationsCount,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="gradient-accent hover:opacity-90">
          <Link to="/users"><Users className="w-4 h-4 mr-2" />Gestionar Usuarios</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/vacancies"><Briefcase className="w-4 h-4 mr-2" />Gestionar Vacantes</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/applications"><FileText className="w-4 h-4 mr-2" />Ver Postulaciones</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/metrics"><BarChart className="w-4 h-4 mr-2" />Métricas</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Usuarios"
          value={userStats?.totalUsers || 0}
          icon={Users}
          variant="accent"
        />
        <StatsCard
          title="Vacantes Activas"
          value={vacancyStats?.activeVacancies || 0}
          icon={Briefcase}
          variant="success"
          description={`${vacancyStats?.totalVacancies || 0} totales`}
        />
        <StatsCard
          title="Total Postulaciones"
          value={appStats?.totalApplications || 0}
          icon={FileText}
          variant="warning"
        />
        <StatsCard
          title="Vacantes con Cupos"
          value={vacancyStats?.vacanciesWithAvailableSlots || 0}
          icon={TrendingUp}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Vacancies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vacantes más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={barData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="postulaciones" fill="hsl(12, 80%, 60%)" radius={[0, 4, 4, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          {appStats?.recentApplications && appStats.recentApplications.length > 0 ? (
            <div className="space-y-3">
              {appStats.recentApplications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{app.user?.name || 'Usuario'}</p>
                    <p className="text-sm text-muted-foreground">
                      Se postuló a {app.vacancy?.title || 'Vacante'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay actividad reciente</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
