import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/contexts/AuthContext';
import { Vacancy, UserRole, Application } from '@/types';

const VacancyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  const isCoder = hasRole([UserRole.CODER]);
  const isAdminOrGestor = hasRole([UserRole.ADMIN, UserRole.GESTOR]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const [vacancyData, applicationsData] = await Promise.all([
          vacancyService.getById(id),
          isCoder ? applicationService.getAll() : Promise.resolve([]),
        ]);
        setVacancy(vacancyData);
        setMyApplications(applicationsData);
      } catch (error) {
        // Error handled by service
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isCoder]);

  const hasApplied = myApplications.some(app => app.vacancyId === id);
  const canApply = isCoder && !hasApplied && vacancy?.isActive;

  const handleApply = async () => {
    if (!id) return;
    setIsApplying(true);
    try {
      await applicationService.create(id);
      Swal.fire({ icon: 'success', title: 'Postulacion enviada', timer: 2000, showConfirmButton: false });
      const apps = await applicationService.getAll();
      setMyApplications(apps);
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo postular' });
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return <Layout><div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div></Layout>;
  }

  if (!vacancy) {
    return <Layout><p className="text-center py-12">Vacante no encontrada</p></Layout>;
  }

  const getModalityLabel = (m: string) => {
    const modalityUpper = m.toUpperCase();
    return ({ REMOTE: 'Remoto', ONSITE: 'Presencial', HYBRID: 'Hibrido' }[modalityUpper] || m);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{vacancy.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />{vacancy.company}
                  <MapPin className="w-4 h-4 ml-2" />{vacancy.location}
                </div>
              </div>
              <Badge variant={vacancy.isActive ? 'default' : 'secondary'}>{vacancy.isActive ? 'Activa' : 'Inactiva'}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getModalityLabel(vacancy.modality)}</Badge>
              <Badge variant="outline">{vacancy.seniority}</Badge>
              <Badge variant="outline"><DollarSign className="w-3 h-3 mr-1" />{vacancy.salaryRange}</Badge>
              <Badge variant="outline"><Users className="w-3 h-3 mr-1" />{vacancy.maxApplicants} cupos</Badge>
            </div>
            <Separator />
            <div><h3 className="font-semibold mb-2">Descripcion</h3><p className="text-muted-foreground">{vacancy.description}</p></div>
            <div><h3 className="font-semibold mb-2">Tecnologias</h3><p className="text-muted-foreground">{vacancy.technologies}</p></div>
            {vacancy.softSkills && <div><h3 className="font-semibold mb-2">Habilidades blandas</h3><p className="text-muted-foreground">{vacancy.softSkills}</p></div>}
            <Separator />
            <div className="flex gap-3">
              {isCoder && (
                hasApplied ? <Badge variant="secondary" className="px-4 py-2">Ya te postulaste</Badge> :
                <Button onClick={handleApply} disabled={!canApply || isApplying} className="gradient-accent">{isApplying ? 'Enviando...' : 'Postularme'}</Button>
              )}
              {isAdminOrGestor && (
                <>
                  <Button variant="outline" asChild><Link to={`/vacancies/edit/${vacancy.id}`}><Pencil className="w-4 h-4 mr-2" />Editar</Link></Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacancyDetailPage;
