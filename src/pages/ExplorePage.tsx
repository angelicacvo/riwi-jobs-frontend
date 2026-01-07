import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Briefcase, MapPin, Building2, DollarSign } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { Vacancy, ModalityEnum, Application } from '@/types';

const ExplorePage = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string>('all');

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
    const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.technologies.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesModality = modalityFilter === 'all' || v.modality === modalityFilter;
    return matchesSearch && matchesModality;
  });

  const getModalityBadge = (modality: string) => {
    const modalityUpper = modality.toUpperCase();
    const styles: Record<string, string> = {
      REMOTE: 'bg-success/10 text-success border-success/20',
      ONSITE: 'bg-warning/10 text-warning border-warning/20',
      HYBRID: 'bg-accent/10 text-accent border-accent/20',
    };
    const labels: Record<string, string> = { REMOTE: 'Remoto', ONSITE: 'Presencial', HYBRID: 'Hibrido' };
    return { style: styles[modalityUpper] || '', label: labels[modalityUpper] || modality };
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="w-8 h-8" />
            Explorar Vacantes
          </h1>
          <p className="text-muted-foreground mt-1">Encuentra tu proximo empleo</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar vacantes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={modalityFilter} onValueChange={setModalityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Modalidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value={ModalityEnum.REMOTE}>Remoto</SelectItem>
                  <SelectItem value={ModalityEnum.ONSITE}>Presencial</SelectItem>
                  <SelectItem value={ModalityEnum.HYBRID}>Hibrido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVacancies.map((vacancy) => {
              const modalityInfo = getModalityBadge(vacancy.modality);
              const hasApplied = myApplications.some(app => app.vacancyId === vacancy.id);
              return (
                <Link key={vacancy.id} to={`/vacancies/${vacancy.id}`}>
                  <Card className="h-full hover:shadow-lg hover:border-accent/50 transition-all">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{vacancy.title}</h3>
                        {hasApplied && <Badge variant="secondary">Postulado</Badge>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />{vacancy.company}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className={modalityInfo.style}>{modalityInfo.label}</Badge>
                        <Badge variant="outline">{vacancy.seniority}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{vacancy.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" />{vacancy.salaryRange}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExplorePage;
