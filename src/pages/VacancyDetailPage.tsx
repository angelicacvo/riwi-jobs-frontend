import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ArrowLeft, Building2, MapPin, DollarSign, Users, Calendar, Pencil, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { vacancyService } from '@/services/vacancyService';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/contexts/AuthContext';
import { Vacancy, UserRole, Application } from '@/types';
import { cn } from '@/lib/utils';

const VacancyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
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
        console.error('Error fetching vacancy:', error);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la vacante' });
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, isCoder, navigate]);

  const handleApply = async () => {
    if (!vacancy || !user) return;

    // Check if already applied
    if (myApplications.some(app => app.vacancyId === vacancy.id)) {
      Swal.fire({ icon: 'warning', title: 'Ya aplicaste', text: 'Ya te has postulado a esta vacante' });
      return;
    }

    // Check max applications
    if (myApplications.length >= 3) {
      Swal.fire({ icon: 'warning', title: 'Límite alcanzado', text: 'Ya tienes 3 postulaciones activas' });
      return;
    }

    // Check if vacancy is active
    if (!vacancy.isActive) {
      Swal.fire({ icon: 'warning', title: 'Vacante inactiva', text: 'Esta vacante no está disponible actualmente' });
      return;
    }

    // Check available slots
    const currentApps = vacancy.applications?.length || 0;
    if (currentApps >= vacancy.maxApplicants) {
      Swal.fire({ icon: 'warning', title: 'Sin cupos', text: 'Esta vacante ya no tiene cupos disponibles' });
      return;
    }

    const result = await Swal.fire({
      title: '¿Postularte a esta vacante?',
      text: `¿Deseas postularte a "${vacancy.title}" en ${vacancy.company}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'hsl(14, 100%, 60%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: 'Sí, postularme',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      setIsApplying(true);
      try {
        await applicationService.create(vacancy.id);
        Swal.fire({ 
          icon: 'success', 
          title: '¡Postulación exitosa!', 
          text: 'Tu postulación ha sido registrada',
          timer: 2000,
          showConfirmButton: false,
        });
        navigate('/applications');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error al postularte';
        Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
      } finally {
        setIsApplying(false);
      }
    }
  };

  const handleToggleActive = async () => {
    if (!vacancy) return;

    const result = await Swal.fire({
      title: vacancy.isActive ? '¿Desactivar vacante?' : '¿Activar vacante?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'hsl(240, 50%, 12%)',
      confirmButtonText: vacancy.isActive ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        const updated = await vacancyService.toggleActive(vacancy.id);
        setVacancy(updated);
        Swal.fire({ icon: 'success', title: '¡Listo!', timer: 1500, showConfirmButton: false });
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
      }
    }
  };

  const handleDelete = async () => {
    if (!vacancy) return;

    const result = await Swal.fire({
      title: '¿Eliminar vacante?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await vacancyService.delete(vacancy.id);
        Swal.fire({ icon: 'success', title: '¡Eliminada!', timer: 1500, showConfirmButton: false });
        navigate('/vacancies');
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
      }
    }
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

  if (!vacancy) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vacante no encontrada</p>
        </div>
      </Layout>
    );
  }

  const currentApps = vacancy.applications?.length || 0;
  const availableSlots = vacancy.maxApplicants - currentApps;
  const hasApplied = myApplications.some(app => app.vacancyId === vacancy.id);
  const canApply = isCoder && vacancy.isActive && availableSlots > 0 && !hasApplied && myApplications.length < 3;

  const getModalityLabel = (modality: string) => {
    const labels: Record<string, string> = { REMOTE: 'Remoto', ONSITE: 'Presencial', HYBRID: 'Híbrido' };
    return labels[modality] || modality;
  };

  const getModalityBadge = (modality: string) => {
    const styles: Record<string, string> = {
      REMOTE: 'bg-success/10 text-success border-success/30',
      ONSITE: 'bg-warning/10 text-warning border-warning/30',
      HYBRID: 'bg-accent/10 text-accent border-accent/30',
    };
    return styles[modality] || 'bg-muted text-muted-foreground';
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant={vacancy.isActive ? 'default' : 'secondary'}>
                    {vacancy.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                  <Badge variant="outline" className={cn('border', getModalityBadge(vacancy.modality))}>
                    {getModalityLabel(vacancy.modality)}
                  </Badge>
                </div>
                <CardTitle className="text-2xl md:text-3xl">{vacancy.title}</CardTitle>
              </div>

              {isAdminOrGestor && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/vacancies/${vacancy.id}/edit`}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleToggleActive}>
                    {vacancy.isActive ? (
                      <><ToggleRight className="w-4 h-4 mr-2" />Desactivar</>
                    ) : (
                      <><ToggleLeft className="w-4 h-4 mr-2" />Activar</>
                    )}
                  </Button>
                  {hasRole([UserRole.ADMIN]) && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Empresa</p>
                  <p className="font-medium">{vacancy.company}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Ubicación</p>
                  <p className="font-medium">{vacancy.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Salario</p>
                  <p className="font-medium">{vacancy.salaryRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Cupos</p>
                  <p className={cn('font-medium', availableSlots === 0 && 'text-destructive')}>
                    {availableSlots} de {vacancy.maxApplicants}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{vacancy.description}</p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-semibold mb-2">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                {vacancy.technologies.split(',').map((tech, i) => (
                  <span key={i} className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Nivel de Experiencia</h3>
                <p className="text-muted-foreground">{vacancy.seniority}</p>
              </div>
              {vacancy.softSkills && (
                <div>
                  <h3 className="font-semibold mb-2">Habilidades Blandas</h3>
                  <p className="text-muted-foreground">{vacancy.softSkills}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Publicada el {new Date(vacancy.createdAt).toLocaleDateString()}
            </div>

            {/* CTA for Coders */}
            {isCoder && (
              <div className="pt-4 border-t">
                {hasApplied ? (
                  <div className="p-4 bg-success/10 border border-success/30 rounded-lg text-center">
                    <p className="text-success font-medium">✓ Ya estás postulado a esta vacante</p>
                  </div>
                ) : (
                  <Button 
                    onClick={handleApply}
                    disabled={!canApply || isApplying}
                    className="w-full h-12 text-lg gradient-accent hover:opacity-90"
                  >
                    {isApplying ? 'Postulando...' : 'Postularme a esta vacante'}
                  </Button>
                )}
                {!canApply && !hasApplied && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {!vacancy.isActive && 'Esta vacante no está activa'}
                    {vacancy.isActive && availableSlots === 0 && 'No hay cupos disponibles'}
                    {vacancy.isActive && availableSlots > 0 && myApplications.length >= 3 && 'Has alcanzado el límite de 3 postulaciones'}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacancyDetailPage;
