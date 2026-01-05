import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FileText, Trash2, Search, Eye, Building2, Calendar } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { applicationService } from '@/services/applicationService';
import { useAuth } from '@/contexts/AuthContext';
import { Application, UserRole } from '@/types';
import { cn } from '@/lib/utils';

const ApplicationsPage = () => {
  const { user, hasRole } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const isCoder = hasRole([UserRole.CODER]);
  const isAdmin = hasRole([UserRole.ADMIN]);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredApplications(applications.filter(app =>
        app.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleDelete = async (application: Application) => {
    const result = await Swal.fire({
      title: '¿Eliminar postulación?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      cancelButtonColor: 'hsl(230, 15%, 45%)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await applicationService.delete(application.id);
        Swal.fire({ icon: 'success', title: '¡Eliminado!', timer: 1500, showConfirmButton: false });
        fetchApplications();
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

  // Coder View - Cards
  if (isCoder) {
    return (
      <Layout>
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Mis Postulaciones</h1>
              <p className="text-muted-foreground">
                {applications.length}/3 postulaciones activas
              </p>
            </div>
            {applications.length < 3 && (
              <Button asChild className="gradient-accent hover:opacity-90">
                <Link to="/explore">Explorar Vacantes</Link>
              </Button>
            )}
          </div>

          {applications.length >= 3 && (
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="py-4">
                <p className="text-warning font-medium text-center">
                  ⚠️ Has alcanzado el límite de 3 postulaciones activas
                </p>
              </CardContent>
            </Card>
          )}

          {applications.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant={app.vacancy?.isActive ? 'default' : 'secondary'}>
                        {app.vacancy?.isActive ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-1">{app.vacancy?.title}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Building2 className="w-4 h-4" />
                      <span>{app.vacancy?.company}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      <span>Postulado: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link to={`/vacancies/${app.vacancyId}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Vacante
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sin postulaciones</h3>
              <p className="text-muted-foreground mb-4">
                Aún no te has postulado a ninguna vacante
              </p>
              <Button asChild className="gradient-accent hover:opacity-90">
                <Link to="/explore">Explorar Vacantes</Link>
              </Button>
            </Card>
          )}
        </div>
      </Layout>
    );
  }

  // Admin/Gestor View - Table
  return (
    <Layout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Postulaciones</h1>
          <p className="text-muted-foreground">{applications.length} postulaciones registradas</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, email, vacante o empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Vacante</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{app.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{app.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/vacancies/${app.vacancyId}`}
                          className="hover:text-accent transition-colors"
                        >
                          {app.vacancy?.title}
                        </Link>
                      </TableCell>
                      <TableCell>{app.vacancy?.company}</TableCell>
                      <TableCell>{new Date(app.appliedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={app.vacancy?.isActive ? 'default' : 'secondary'}>
                          {app.vacancy?.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link to={`/vacancies/${app.vacancyId}`}>
                              <Eye className="w-4 h-4" />
                            </Link>
                          </Button>
                          {isAdmin && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(app)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No se encontraron postulaciones</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ApplicationsPage;
