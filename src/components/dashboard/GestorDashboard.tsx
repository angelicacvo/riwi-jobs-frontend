import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from './StatsCard';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { VacancyStats, ApplicationStats, PopularVacancy } from '@/types';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const GestorDashboard = () => {
  const [vacancyStats, setVacancyStats] = useState<VacancyStats | null>(null);
  const [appStats, setAppStats] = useState<ApplicationStats | null>(null);
  const [popularVacancies, setPopularVacancies] = useState<PopularVacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacancies, apps, popular] = await Promise.all([
          vacancyService.getGeneralStats(),
          applicationService.getDashboard(),
          applicationService.getPopularVacancies(),
        ]);
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
          <Link to="/vacancies/new"><Plus className="w-4 h-4 mr-2" />Nueva Vacante</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/vacancies"><Briefcase className="w-4 h-4 mr-2" />Gestionar Vacantes</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/applications"><FileText className="w-4 h-4 mr-2" />Ver Postulaciones</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          variant="accent"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Vacancies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vacantes mas Populares</CardTitle>
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

        {/* Recent Vacancies */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vacantes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {vacancyStats?.mostRecentVacancies && vacancyStats.mostRecentVacancies.length > 0 ? (
              <div className="space-y-3">
                {vacancyStats.mostRecentVacancies.slice(0, 5).map((vacancy) => (
                  <Link
                    key={vacancy.id}
                    to={`/vacancies/${vacancy.id}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium">{vacancy.title}</p>
                      <p className="text-sm text-muted-foreground">{vacancy.company}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${vacancy.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {vacancy.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No hay vacantes recientes</p>
            )}
          </CardContent>
        </Card>
      </div>

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
                    <p className="font-medium">{app.user?.name || 'Usuario'}</p>
                    <p className="text-sm text-muted-foreground">
                      Se postulo a {app.vacancy?.title || 'Vacante'}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No hay postulaciones recientes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GestorDashboard;
