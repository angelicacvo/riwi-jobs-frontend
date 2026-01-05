import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { User, Mail, Lock, Shield, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, UpdateUserDto } from '@/types';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData: UpdateUserDto = {
        name: data.name,
        email: data.email,
      };

      if (data.password && data.password.length > 0) {
        updateData.password = data.password;
      }

      const updated = await userService.update(user.id, updateData);
      updateUser(updated);

      Swal.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: 'Tus datos han sido actualizados correctamente',
        timer: 2000,
        showConfirmButton: false,
      });

      form.setValue('password', '');
      form.setValue('confirmPassword', '');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al actualizar el perfil';
      Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
    } finally {
      setIsLoading(false);
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

  const getRoleDescription = (role: UserRole) => {
    const descriptions = {
      ADMIN: 'Acceso completo al sistema. Puedes gestionar usuarios, vacantes y ver todas las estadísticas.',
      GESTOR: 'Puedes crear y gestionar vacantes, ver postulaciones y acceder a métricas.',
      CODER: 'Puedes explorar vacantes disponibles y postularte a un máximo de 3 posiciones.',
    };
    return descriptions[role];
  };

  if (!user) {
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
      <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal</p>
        </div>

        {/* Role Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Tu Rol</CardTitle>
                  <CardDescription>Permisos en el sistema</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={cn('border text-sm py-1 px-3', getRoleBadge(user.role))}>
                {user.role}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{getRoleDescription(user.role)}</p>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Actualiza tus datos de perfil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nombre Completo
                </Label>
                <Input id="name" {...form.register('name')} className="h-11" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </Label>
                <Input id="email" type="email" {...form.register('email')} className="h-11" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Cambiar Contraseña
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deja estos campos vacíos si no deseas cambiar tu contraseña
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input id="password" type="password" {...form.register('password')} className="h-11" />
                    {form.formState.errors.password && (
                      <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input id="confirmPassword" type="password" {...form.register('confirmPassword')} className="h-11" />
                    {form.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 gradient-accent hover:opacity-90" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Cuenta creada el</span>
              <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
