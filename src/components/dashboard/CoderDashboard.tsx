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
    const styles = {
      REMOTE: 'bg-success/10 text-success border-success/20',
      ONSITE: 'bg-warning/10 text-warning border-warning/20',
      HYBRID: 'bg-accent/10 text-accent border-accent/20',
    };
    return styles[modality as keyof typeof styles] || 'bg-muted text-muted-foreground';
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
      {/* Application Counter */}
      <Card className={cn(
        'border-2',
        activeApplicationsCount >= maxApplications ? 'border-destructive/50 bg-destructive/5' : 'border-accent/30 bg-accent/5'
      )}>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center',
                activeApplicationsCount >= maxApplications ? 'bg-destructive/20' : 'bg-accent/20'
              )}>
                <FileText className={cn(
                  'w-6 h-6',
                  activeApplicationsCount >= maxApplications ? 'text-destructive' : 'text-accent'
                )} />
              </div>
              <div>
                <p className="text-lg font-bold">
                  Postulaciones activas: {activeApplicationsCount}/{maxApplications}
                </p>
                <p className="text-sm text-muted-foreground">
                  {canApply 
                    ? `Puedes postularte a ${maxApplications - activeApplicationsCount} vacante(s) más`
                    : 'Has alcanzado el límite de postulaciones activas'}
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/applications">Ver mis postulaciones</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild className="gradient-accent hover:opacity-90">
          <Link to="/explore"><Search className="w-4 h-4 mr-2" />Explorar Vacantes</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/applications"><FileText className="w-4 h-4 mr-2" />Mis Postulaciones</Link>
        </Button>
      </div>

      {/* My Applications */}
      {myApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Mis Postulaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myApplications.map((app) => (
                <div key={app.id} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{app.vacancy?.title}</p>
                      <p className="text-sm text-muted-foreground">{app.vacancy?.company}</p>
                    </div>
                    <Badge variant={app.vacancy?.isActive ? 'default' : 'secondary'}>
                      {app.vacancy?.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Postulado: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to={`/vacancies/${app.vacancyId}`}>Ver Vacante</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Vacancies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Vacantes Disponibles
          </h2>
          <Button asChild variant="ghost">
            <Link to="/explore">Ver todas</Link>
          </Button>
        </div>

        {vacancies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vacancies.map((vacancy) => (
              <Card key={vacancy.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={cn('border', getModalityBadge(vacancy.modality))}>
                      {vacancy.modality === 'REMOTE' ? 'Remoto' : vacancy.modality === 'ONSITE' ? 'Presencial' : 'Híbrido'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {vacancy.maxApplicants - (vacancy.applications?.length || 0)} cupos
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {vacancy.title}
                  </h3>
                  
                  <div className="space-y-1 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{vacancy.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{vacancy.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{vacancy.salaryRange}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {vacancy.technologies.split(',').slice(0, 3).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/vacancies/${vacancy.id}`}>Ver Detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay vacantes disponibles en este momento</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CoderDashboard;
