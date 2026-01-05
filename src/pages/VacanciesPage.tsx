import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Briefcase, Eye, ToggleLeft, ToggleRight, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { vacancyService } from '@/services/vacancyService';
import { useAuth } from '@/contexts/AuthContext';
import { Vacancy, ModalityEnum, UserRole } from '@/types';
import { cn } from '@/lib/utils';

const VacanciesPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchVacancies();
  }, []);

  useEffect(() => {
    let result = vacancies;
    
    if (searchTerm) {
      result = result.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.technologies.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (modalityFilter !== 'all') {
      result = result.filter(v => v.modality === modalityFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(v => v.isActive === (statusFilter === 'active'));
    }
    
    setFilteredVacancies(result);
  }, [vacancies, searchTerm, modalityFilter, statusFilter]);

  const fetchVacancies = async () => {
    try {
      const data = await vacancyService.getAll();
      setVacancies(data);
    } catch (error) {
      console.error('Error fetching vacancies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (vacancy: Vacancy) => {
    const result = await Swal.fire({
      title: vacancy.isActive ? '¿Desactivar vacante?' : '¿Activar vacante?',
      text: vacancy.isActive 
        ? 'Los coders no podrán postularse mientras esté inactiva'
        : 'Los coders podrán postularse a esta vacante',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'hsl(240, 50%, 12%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: vacancy.isActive ? 'Sí, desactivar' : 'Sí, activar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await vacancyService.toggleActive(vacancy.id);
        Swal.fire({ 
          icon: 'success', 
          title: '¡Listo!', 
          text: `Vacante ${vacancy.isActive ? 'desactivada' : 'activada'} correctamente`,
          timer: 2000,
          showConfirmButton: false,
        });
        fetchVacancies();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error al cambiar el estado';
        Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
      }
    }
  };

  const handleDelete = async (vacancy: Vacancy) => {
    if (!hasRole([UserRole.ADMIN])) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Solo los administradores pueden eliminar vacantes' });
      return;
    }

    const result = await Swal.fire({
      title: '¿Eliminar vacante?',
      text: `¿Estás seguro de eliminar "${vacancy.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await vacancyService.delete(vacancy.id);
        Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Vacante eliminada correctamente', timer: 2000, showConfirmButton: false });
        fetchVacancies();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error al eliminar la vacante';
        Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
      }
    }
  };

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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Vacantes</h1>
            <p className="text-muted-foreground">{vacancies.length} vacantes registradas</p>
          </div>
          
          <Button asChild className="gradient-accent hover:opacity-90">
            <Link to="/vacancies/new">
              <Plus className="w-4 h-4 mr-2" />
              Crear Vacante
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por título, empresa o tecnologías..."
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="inactive">Inactivas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vacancies Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Modalidad</TableHead>
                    <TableHead>Cupos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVacancies.length > 0 ? (
                    filteredVacancies.map((vacancy) => {
                      const currentApps = vacancy.applications?.length || 0;
                      const availableSlots = vacancy.maxApplicants - currentApps;
                      
                      return (
                        <TableRow key={vacancy.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{vacancy.title}</p>
                              <p className="text-xs text-muted-foreground">{vacancy.location}</p>
                            </div>
                          </TableCell>
                          <TableCell>{vacancy.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn('border', getModalityBadge(vacancy.modality))}>
                              {getModalityLabel(vacancy.modality)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className={cn(
                                availableSlots === 0 && 'text-destructive font-medium'
                              )}>
                                {currentApps}/{vacancy.maxApplicants}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={vacancy.isActive ? 'default' : 'secondary'}>
                              {vacancy.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => navigate(`/vacancies/${vacancy.id}/edit`)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleToggleActive(vacancy)}
                              >
                                {vacancy.isActive ? (
                                  <ToggleRight className="w-4 h-4 text-success" />
                                ) : (
                                  <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                                )}
                              </Button>
                              {hasRole([UserRole.ADMIN]) && (
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDelete(vacancy)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No se encontraron vacantes</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacanciesPage;
