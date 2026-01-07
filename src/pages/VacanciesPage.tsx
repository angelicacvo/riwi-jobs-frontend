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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      result = result.filter(v => statusFilter === 'active' ? v.isActive : !v.isActive);
    }

    setFilteredVacancies(result);
  }, [vacancies, searchTerm, modalityFilter, statusFilter]);

  const fetchVacancies = async () => {
    try {
      const data = await vacancyService.getAll();
      setVacancies(data);
    } catch (error) {
      // Error handled by service
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (vacancy: Vacancy) => {
    try {
      await vacancyService.toggleActive(vacancy.id);
      Swal.fire({
        icon: 'success',
        title: vacancy.isActive ? 'Vacante desactivada' : 'Vacante activada',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchVacancies();
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo cambiar el estado',
      });
    }
  };

  const handleDelete = async (vacancy: Vacancy) => {
    const result = await Swal.fire({
      title: 'Eliminar vacante?',
      text: `Estas seguro de eliminar "${vacancy.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await vacancyService.delete(vacancy.id);
        Swal.fire({
          icon: 'success',
          title: 'Vacante eliminada',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchVacancies();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar',
        });
      }
    }
  };

  const getModalityBadge = (modality: string) => {
    const modalityUpper = String(modality).toUpperCase();
    const styles: Record<string, string> = {
      REMOTE: 'bg-success/10 text-success border-success/30',
      ONSITE: 'bg-warning/10 text-warning border-warning/30',
      HYBRID: 'bg-accent/10 text-accent border-accent/30',
    };
    const labels: Record<string, string> = {
      REMOTE: 'Remoto',
      ONSITE: 'Presencial',
      HYBRID: 'Hibrido',
    };
    return { style: styles[modalityUpper] || '', label: labels[modalityUpper] || modality };
  };

  const isAdmin = hasRole([UserRole.ADMIN]);
  const canManageVacancies = hasRole([UserRole.ADMIN, UserRole.GESTOR]);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-8 h-8" />
              Gestion de Vacantes
            </h1>
            <p className="text-muted-foreground mt-1">
              Administra las ofertas laborales
            </p>
          </div>
          {canManageVacancies && (
            <Button asChild className="gradient-accent hover:opacity-90">
              <Link to="/vacancies/new">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Vacante
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por titulo, empresa o tecnologias..."
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
                    <SelectItem value="remote">Remoto</SelectItem>
                    <SelectItem value="onsite">Presencial</SelectItem>
                    <SelectItem value="hybrid">Hibrido</SelectItem>
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

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Vacantes ({filteredVacancies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredVacancies.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No se encontraron vacantes</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Modalidad</TableHead>
                      <TableHead>Seniority</TableHead>
                      <TableHead>Cupos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVacancies.map((vacancy) => {
                      const modalityInfo = getModalityBadge(vacancy.modality);
                      return (
                        <TableRow key={vacancy.id}>
                          <TableCell className="font-medium">{vacancy.title}</TableCell>
                          <TableCell>{vacancy.company}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={modalityInfo.style}>
                              {modalityInfo.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{vacancy.seniority}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              {vacancy.maxApplicants}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={vacancy.isActive ? 'default' : 'secondary'}>
                              {vacancy.isActive ? 'Activa' : 'Inactiva'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/vacancies/${vacancy.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {canManageVacancies && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/vacancies/edit/${vacancy.id}`)}
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleActive(vacancy)}
                                  >
                                    {vacancy.isActive ? (
                                      <ToggleRight className="w-4 h-4 text-success" />
                                    ) : (
                                      <ToggleLeft className="w-4 h-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                </>
                              )}
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(vacancy)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacanciesPage;
