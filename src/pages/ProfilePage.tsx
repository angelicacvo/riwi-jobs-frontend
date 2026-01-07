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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { userService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => !data.password || data.password === data.confirmPassword, { message: 'Las contrasenas no coinciden', path: ['confirmPassword'] });

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '', password: '', confirmPassword: '' },
  });

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const updateData: any = { name: data.name, email: data.email };
      if (data.password) updateData.password = data.password;
      const updated = await userService.update(user.id, updateData);
      updateUser(updated);
      form.reset({ name: updated.name, email: updated.email, password: '', confirmPassword: '' });
      Swal.fire({ icon: 'success', title: 'Perfil actualizado', timer: 1500, showConfirmButton: false });
    } catch (e: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: e.response?.data?.message || 'No se pudo actualizar' });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles = { ADMIN: 'bg-accent/10 text-accent', GESTOR: 'bg-success/10 text-success', CODER: 'bg-warning/10 text-warning' };
    return styles[role] || '';
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div><h1 className="text-3xl font-bold flex items-center gap-2"><User className="w-8 h-8" />Mi Perfil</h1></div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center text-2xl font-bold text-accent-foreground">{user?.name.charAt(0).toUpperCase()}</div>
              <div><CardTitle>{user?.name}</CardTitle><p className="text-muted-foreground">{user?.email}</p><Badge className={cn('mt-2', getRoleBadge(user?.role || UserRole.CODER))}><Shield className="w-3 h-3 mr-1" />{user?.role}</Badge></div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="space-y-2"><Label><User className="w-4 h-4 inline mr-2" />Nombre</Label><Input {...form.register('name')} />{form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}</div>
              <div className="space-y-2"><Label><Mail className="w-4 h-4 inline mr-2" />Email</Label><Input {...form.register('email')} type="email" />{form.formState.errors.email && <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>}</div>
              <div className="space-y-2"><Label><Lock className="w-4 h-4 inline mr-2" />Nueva Contrasena (opcional)</Label><Input {...form.register('password')} type="password" placeholder="Dejar vacio para mantener" /></div>
              <div className="space-y-2"><Label>Confirmar Contrasena</Label><Input {...form.register('confirmPassword')} type="password" />{form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}</div>
              <Button type="submit" disabled={isLoading} className="gradient-accent">{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : 'Guardar Cambios'}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;
