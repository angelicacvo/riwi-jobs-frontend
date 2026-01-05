import { useEffect, useState } from 'react';
import { Users, Briefcase, FileText, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/dashboard/StatsCard';
import { userService } from '@/services/userService';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { UserStats, VacancyStats, ApplicationStats, PopularVacancy } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  LineChart, Line, CartesianGrid
} from 'recharts';

const COLORS = ['hsl(12, 80%, 60%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(235, 45%, 40%)'];

const MetricsPage = () => {
  const { hasRole } = useAuth();
  const isAdmin = hasRole([UserRole.ADMIN]);
  
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [vacancyStats, setVacancyStats] = useState<VacancyStats | null>(null);
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);
  const [popularVacancies, setPopularVacancies] = useState<PopularVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises: Promise<any>[] = [
          vacancyService.getGeneralStats(),
          applicationService.getDashboard(),
          applicationService.getPopularVacancies(),
        ];
        
        if (isAdmin) {
          promises.push(userService.getStats());
        }

        const results = await Promise.all(promises);
        
        setVacancyStats(results[0]);
        setAppStats(results[1]);
        setPopularVacancies(results[2]);
        
        if (isAdmin && results[3]) {
          setUserStats(results[3]);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const userPieData = userStats ? [
    { name: 'Admin', value: userStats.usersByRole.ADMIN },
    { name: 'Gestor', value: userStats.usersByRole.GESTOR },
    { name: 'Coder', value: userStats.usersByRole.CODER },
  ] : [];

  const vacancyPieData = vacancyStats ? [
    { name: 'Activas', value: vacancyStats.activeVacancies },
    { name: 'Inactivas', value: vacancyStats.inactiveVacancies },
  ] : [];

  const popularBarData = popularVacancies.slice(0, 10).map(v => ({
    name: v.title.length > 20 ? v.title.substring(0, 20) + '...' : v.title,
    postulaciones: v.applicationsCount,
    empresa: v.company,
  }));

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Métricas y Estadísticas</h1>
          <p className="text-muted-foreground">Resumen del rendimiento de la plataforma</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isAdmin && (
            <StatsCard
              title="Total Usuarios"
              value={userStats?.totalUsers || 0}
              icon={Users}
              variant="accent"
            />
          )}
          <StatsCard
            title="Total Vacantes"
            value={vacancyStats?.totalVacancies || 0}
            icon={Briefcase}
            variant={isAdmin ? 'default' : 'accent'}
          />
          <StatsCard
            title="Vacantes Activas"
            value={vacancyStats?.activeVacancies || 0}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Total Postulaciones"
            value={appStats?.totalApplications || 0}
            icon={FileText}
            variant="warning"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Role (Admin only) */}
          {isAdmin && userStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Usuarios por Rol</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {userPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {userPieData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm text-muted-foreground">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vacancies Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estado de Vacantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={vacancyPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="hsl(160, 84%, 39%)" />
                      <Cell fill="hsl(230, 15%, 60%)" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-sm text-muted-foreground">Activas: {vacancyStats?.activeVacancies}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Inactivas: {vacancyStats?.inactiveVacancies}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Vacancies Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Vacantes más Populares</CardTitle>
          </CardHeader>
          <CardContent>
            {popularBarData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularBarData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{payload[0].payload.name}</p>
                              <p className="text-sm text-muted-foreground">{payload[0].payload.empresa}</p>
                              <p className="text-sm font-medium text-accent">
                                {payload[0].value} postulaciones
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="postulaciones" fill="hsl(12, 80%, 60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Postulaciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              {appStats?.recentApplications && appStats.recentApplications.length > 0 ? (
                <div className="space-y-3">
                  {appStats.recentApplications.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{app.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{app.vacancy?.title}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No hay postulaciones recientes</p>
              )}
            </CardContent>
          </Card>

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Vacantes con postulaciones</span>
                <span className="font-bold">{appStats?.vacanciesWithApplications || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Usuarios con postulaciones</span>
                <span className="font-bold">{appStats?.usersWithApplications || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-muted-foreground">Vacantes con cupos</span>
                <span className="font-bold">{vacancyStats?.vacanciesWithAvailableSlots || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                <span className="text-muted-foreground">Promedio postulaciones/vacante</span>
                <span className="font-bold text-accent">
                  {vacancyStats?.totalVacancies 
                    ? ((appStats?.totalApplications || 0) / vacancyStats.totalVacancies).toFixed(1)
                    : '0'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MetricsPage;
