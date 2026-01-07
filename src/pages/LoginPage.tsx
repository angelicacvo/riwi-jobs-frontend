import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Code2, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalido').min(1, 'El email es requerido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email invalido').min(1, 'El email es requerido'),
  password: z.string().min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login(data.email, data.password);
      login(response.access_token, response.user);

      Swal.fire({
        icon: 'success',
        title: 'Bienvenido!',
        text: `Hola ${response.user.name}`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al iniciar sesion';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: Array.isArray(message) ? message[0] : message,
        confirmButtonColor: 'hsl(240, 50%, 12%)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authService.register(data.name, data.email, data.password);

      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso!',
        text: 'Tu cuenta ha sido creada. Ahora puedes iniciar sesion.',
        confirmButtonColor: 'hsl(240, 50%, 12%)',
      });

      setIsLogin(true);
      registerForm.reset();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrarse';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: Array.isArray(message) ? message[0] : message,
        confirmButtonColor: 'hsl(240, 50%, 12%)',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-glow">
            <Code2 className="w-7 h-7 text-accent-foreground" />
          </div>
          <span className="text-3xl font-bold text-primary-foreground">Riwi Jobs</span>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Ingresa tus credenciales para acceder'
                : 'Completa el formulario para registrarte'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLogin ? (
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    {...loginForm.register('email')}
                    className="h-11"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-sm text-destructive font-medium">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contrasena</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      {...loginForm.register('password')}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-accent hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ingresando...
                    </>
                  ) : (
                    'Iniciar Sesion'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Perez"
                    {...registerForm.register('name')}
                    className="h-11"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    {...registerForm.register('email')}
                    className="h-11"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-sm text-destructive font-medium">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-password">Contrasena</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="********"
                      {...registerForm.register('password')}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 gradient-accent hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-muted-foreground">
              {isLogin ? 'No tienes cuenta?' : 'Ya tienes cuenta?'}
              <Button
                variant="link"
                className="text-accent font-semibold px-1"
                onClick={() => {
                  setIsLogin(!isLogin);
                  loginForm.reset();
                  registerForm.reset();
                }}
              >
                {isLogin ? 'Registrate aqui' : 'Inicia sesion'}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
