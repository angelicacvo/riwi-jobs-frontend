import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FileText, Trash2, Search, Building2, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/contexts/AuthContext';
import { Application, UserRole } from '@/types';

const ApplicationsPage = () => {
  const { hasRole, user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isCoder = hasRole([UserRole.CODER]);
  const isAdmin = hasRole([UserRole.ADMIN]);
  const canManageApplications = hasRole([UserRole.ADMIN, UserRole.GESTOR]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredApplications(applications.filter(app =>
        app.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.vacancy?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.vacancy?.company.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    } else {
      setFilteredApplications(applications);
    }
  }, [applications, searchTerm]);

  const fetchApplications = async () => {
    try {
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canDeleteApplication = (app: Application): boolean => {
    // Solo Admin puede eliminar postulaciones
    if (isAdmin) return true;
    // Coder solo puede eliminar sus propias postulaciones
    if (isCoder && app.userId === user?.id) return true;
    return false;
  };

  const handleDelete = async (app: Application) => {
    const result = await Swal.fire({
      title: 'Eliminar postulacion?',
      text: `¿Estas seguro de eliminar la postulacion a "${app.vacancy?.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      cancelButtonColor: 'hsl(240, 10%, 45%)',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await applicationService.delete(app.id);
        Swal.fire({
          icon: 'success',
          title: 'Postulacion eliminada',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchApplications();
      } catch (error: any) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo eliminar la postulacion',
        });
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-8 h-8" />
            {isCoder ? 'Mis Postulaciones' : 'Gestionar Postulaciones'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isCoder 
              ? 'Visualiza y gestiona tus postulaciones a vacantes' 
              : 'Administra las postulaciones de los candidatos'}
          </p>
        </div>

        {/* Search Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por vacante, empresa o candidato..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Postulaciones ({filteredApplications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                {searchTerm ? 'No se encontraron postulaciones' : 'No hay postulaciones registradas'}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vacante</TableHead>
                      <TableHead>Empresa</TableHead>
                      {!isCoder && <TableHead>Candidato</TableHead>}
                      <TableHead>Fecha de Postulacion</TableHead>
                      {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">
                          {app.vacancy?.title || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            {app.vacancy?.company || 'N/A'}
                          </div>
                        </TableCell>
                        {!isCoder && (
                          <TableCell>{app.user?.name || 'N/A'}</TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {new Date(app.appliedAt).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </div>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(app)}
                                className="text-destructive hover:text-destructive"
                                title="Eliminar postulacion"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
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

export default ApplicationsPage;
