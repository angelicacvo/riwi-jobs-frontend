import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, Building2, DollarSign, Filter } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { Vacancy, ModalityEnum, Application } from '@/types';
import { cn } from '@/lib/utils';

const ExplorePage = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const locations = [...new Set(vacancies.map(v => v.location))];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vacsData, appsData] = await Promise.all([
          vacancyService.getAll({ isActive: true, hasAvailableSlots: true }),
          applicationService.getAll(),
        ]);
        setVacancies(vacsData);
        setMyApplications(appsData);
      } catch (error) {
        console.error('Error fetching vacancies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVacancies = vacancies.filter(v => {
    const matchesSearch = searchTerm === '' || 
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.technologies.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModality = modalityFilter === 'all' || v.modality === modalityFilter;
    const matchesLocation = locationFilter === 'all' || v.location === locationFilter;
    
    return matchesSearch && matchesModality && matchesLocation;
  });

  const hasApplied = (vacancyId: string) => myApplications.some(app => app.vacancyId === vacancyId);

  const getModalityLabel = (modality: ModalityEnum) => {
    const labels = { REMOTE: 'Remoto', ONSITE: 'Presencial', HYBRID: 'Híbrido' };
    return labels[modality];
  };

  const getModalityBadge = (modality: ModalityEnum) => {
    const styles = {
      REMOTE: 'bg-success/10 text-success border-success/30',
      ONSITE: 'bg-warning/10 text-warning border-warning/30',
      HYBRID: 'bg-accent/10 text-accent border-accent/30',
    };
    return styles[modality];
  };

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
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Explorar Vacantes</h1>
          <p className="text-muted-foreground">
            {filteredVacancies.length} vacantes disponibles
            {myApplications.length > 0 && ` • ${myApplications.length}/3 postulaciones activas`}
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por título, empresa o tecnología..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value={ModalityEnum.REMOTE}>Remoto</SelectItem>
                  <SelectItem value={ModalityEnum.ONSITE}>Presencial</SelectItem>
                  <SelectItem value={ModalityEnum.HYBRID}>Híbrido</SelectItem>
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vacancies Grid */}
        {filteredVacancies.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVacancies.map((vacancy) => {
              const currentApps = vacancy.applications?.length || 0;
              const availableSlots = vacancy.maxApplicants - currentApps;
              const applied = hasApplied(vacancy.id);

              return (
                <Card 
                  key={vacancy.id} 
                  className={cn(
                    "hover:shadow-lg transition-all duration-200 group overflow-hidden",
                    applied && "ring-2 ring-success/50"
                  )}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="outline" className={cn('border', getModalityBadge(vacancy.modality))}>
                        {getModalityLabel(vacancy.modality)}
                      </Badge>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded-full',
                        availableSlots <= 2 ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                      )}>
                        {availableSlots} cupos
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1 group-hover:text-accent transition-colors line-clamp-2">
                      {vacancy.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vacancy.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vacancy.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{vacancy.salaryRange}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {vacancy.technologies.split(',').slice(0, 4).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
                          {tech.trim()}
                        </span>
                      ))}
                      {vacancy.technologies.split(',').length > 4 && (
                        <span className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded-full">
                          +{vacancy.technologies.split(',').length - 4}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">
                      {vacancy.seniority}
                    </p>

                    {applied ? (
                      <div className="p-2 bg-success/10 border border-success/30 rounded-lg text-center">
                        <span className="text-sm text-success font-medium">✓ Ya postulado</span>
                      </div>
                    ) : (
                      <Button asChild className="w-full gradient-accent hover:opacity-90">
                        <Link to={`/vacancies/${vacancy.id}`}>Ver Detalles</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron vacantes</h3>
            <p className="text-muted-foreground mb-4">
              Intenta ajustar los filtros de búsqueda
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setModalityFilter('all');
              setLocationFilter('all');
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
