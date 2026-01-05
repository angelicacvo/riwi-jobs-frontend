import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { Plus, Pencil, Trash2, Search, Users as UsersIcon } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole, CreateUserDto, UpdateUserDto } from '@/types';
import { cn } from '@/lib/utils';

const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  role: z.nativeEnum(UserRole),
});

type UserFormData = z.infer<typeof userSchema>;

const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', password: '', role: UserRole.CODER },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users;
    
    if (searchTerm) {
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(u => u.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      form.reset({ name: user.name, email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      form.reset({ name: '', email: '', password: '', role: UserRole.CODER });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        const updateData: UpdateUserDto = { name: data.name, email: data.email };
        
        // Only include password if it's not empty
        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
        }
        
        // Only allow role change if not changing own role
        if (editingUser.id !== currentUser?.id) {
          updateData.role = data.role;
        }
        
        await userService.update(editingUser.id, updateData);
        Swal.fire({ icon: 'success', title: '¡Actualizado!', text: 'Usuario actualizado correctamente', timer: 2000, showConfirmButton: false });
      } else {
        const createData: CreateUserDto = {
          name: data.name,
          email: data.email,
          password: data.password || '',
          role: data.role,
        };
        await userService.create(createData);
        Swal.fire({ icon: 'success', title: '¡Creado!', text: 'Usuario creado correctamente', timer: 2000, showConfirmButton: false });
      }
      
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar el usuario';
      Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
    }
  };

  const handleDelete = async (user: User) => {
    if (user.id === currentUser?.id) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No puedes eliminar tu propia cuenta' });
      return;
    }

    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `¿Estás seguro de eliminar a ${user.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'hsl(0, 84%, 60%)',
      cancelButtonColor: 'hsl(230, 15%, 45%)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await userService.delete(user.id);
        Swal.fire({ icon: 'success', title: '¡Eliminado!', text: 'Usuario eliminado correctamente', timer: 2000, showConfirmButton: false });
        fetchUsers();
      } catch (error: any) {
        const message = error.response?.data?.message || 'Error al eliminar el usuario';
        Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
      }
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = {
      ADMIN: 'bg-accent/10 text-accent border-accent/30',
      GESTOR: 'bg-success/10 text-success border-success/30',
      CODER: 'bg-warning/10 text-warning border-warning/30',
    };
    return styles[role];
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
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">{users.length} usuarios registrados</p>
          </div>
          
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-accent hover:opacity-90" onClick={() => handleOpenModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Usuario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingUser ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" {...form.register('name')} />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...form.register('email')} />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">
                    Contraseña {editingUser && '(dejar vacío para no cambiar)'}
                  </Label>
                  <Input id="password" type="password" {...form.register('password')} />
                  {form.formState.errors.password && (
                    <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select
                    value={form.watch('role')}
                    onValueChange={(value) => form.setValue('role', value as UserRole)}
                    disabled={editingUser?.id === currentUser?.id}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.CODER}>Coder</SelectItem>
                      <SelectItem value={UserRole.GESTOR}>Gestor</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {editingUser?.id === currentUser?.id && (
                    <p className="text-xs text-muted-foreground">No puedes cambiar tu propio rol</p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1 gradient-accent hover:opacity-90">
                    {editingUser ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                  <SelectItem value={UserRole.GESTOR}>Gestor</SelectItem>
                  <SelectItem value={UserRole.CODER}>Coder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('border', getRoleBadge(user.role))}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleOpenModal(user)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(user)}
                            disabled={user.id === currentUser?.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <UsersIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No se encontraron usuarios</p>
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

export default UsersPage;
