import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Search, MapPin, Building2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { Vacancy, Application } from '@/types';
import { cn } from '@/lib/utils';

const CoderDashboard = () => {
  const { user } = useAuth();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacsData, appsData] = await Promise.all([
          vacancyService.getAll({ isActive: true, hasAvailableSlots: true, limit: 6 }),
          applicationService.getAll(),
        ]);
        setVacancies(vacsData);
        setMyApplications(appsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeApplicationsCount = myApplications.length;
  const maxApplications = 3;
  const canApply = activeApplicationsCount < maxApplications;

  const getModalityBadge = (modality: string) => {
    const modalityUpper = modality.toUpperCase();
    const styles: Record<string, string> = {
      REMOTE: 'bg-success/10 text-success border-success/20',
      ONSITE: 'bg-warning/10 text-warning border-warning/20',
      HYBRID: 'bg-accent/10 text-accent border-accent/20',
    };
    const labels: Record<string, string> = {
      REMOTE: 'Remoto',
      ONSITE: 'Presencial',
      HYBRID: 'Hibrido',
    };
    return { style: styles[modalityUpper] || '', label: labels[modalityUpper] || modality };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Quick Actions & Status */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="gradient-accent hover:opacity-90">
            <Link to="/explore"><Search className="w-4 h-4 mr-2" />Explorar Vacantes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/applications"><FileText className="w-4 h-4 mr-2" />Mis Postulaciones</Link>
          </Button>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
          <span className="text-sm text-muted-foreground">Postulaciones activas:</span>
          <span className={cn("font-bold", canApply ? "text-success" : "text-destructive")}>
            {activeApplicationsCount}/{maxApplications}
          </span>
        </div>
      </div>

      {/* My Applications Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Mis Postulaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myApplications.length > 0 ? (
            <div className="space-y-3">
              {myApplications.slice(0, 3).map((app) => (
                <Link
                  key={app.id}
                  to={`/vacancies/${app.vacancyId}`}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{app.vacancy?.title || 'Vacante'}</p>
                    <p className="text-sm text-muted-foreground">{app.vacancy?.company}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </Link>
              ))}
              {myApplications.length > 3 && (
                <Link to="/applications" className="block text-center text-sm text-accent hover:underline">
                  Ver todas ({myApplications.length})
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Aun no tienes postulaciones</p>
              <Button asChild className="gradient-accent">
                <Link to="/explore">Explorar Vacantes</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Vacancies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Vacantes Disponibles
          </h2>
          <Link to="/explore" className="text-sm text-accent hover:underline">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vacancies.slice(0, 6).map((vacancy) => {
            const modalityInfo = getModalityBadge(vacancy.modality);
            const hasApplied = myApplications.some(app => app.vacancyId === vacancy.id);

            return (
              <Link
                key={vacancy.id}
                to={`/vacancies/${vacancy.id}`}
                className="group"
              >
                <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-accent/50">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold group-hover:text-accent transition-colors">
                          {vacancy.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Building2 className="w-3.5 h-3.5" />
                          {vacancy.company}
                        </div>
                      </div>
                      {hasApplied && (
                        <Badge variant="secondary" className="text-xs">Postulado</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className={modalityInfo.style}>
                        {modalityInfo.label}
                      </Badge>
                      <Badge variant="outline">
                        {vacancy.seniority}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {vacancy.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        {vacancy.salaryRange}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoderDashboard;
