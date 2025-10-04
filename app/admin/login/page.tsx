'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Fish, Loader as Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { user, loading: authLoading } = useAuth();

  // Si el usuario ya está autenticado, redirigir al admin
  useEffect(() => {
    if (!authLoading && user) {
      console.log('👤 User already authenticated, redirecting to admin...');
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  // Si ya está autenticado, no mostrar el formulario
  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prevenir interferencia de extensiones del navegador
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!formData.email || !formData.password) {
        throw new Error('Por favor completa todos los campos');
      }

      if (isSignUp) {
        // Sign up mode
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }

        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }

        const result = await signUp(formData.email, formData.password);
        
        if (result.user && !result.user.email_confirmed_at) {
          toast({
            title: 'Confirma tu email',
            description: 'Te hemos enviado un enlace de confirmación a tu email.',
          });
        } else if (result) {
          toast({
            title: 'Registro e inicio de sesión exitoso',
            description: 'Bienvenido al panel de administración',
          });
          router.push('/admin');
          router.refresh();
        }
      } else {
        // Sign in mode
        console.log('Starting login process...');
        console.log('Form data:', { email: formData.email, password: '***' });
        
        const result = await signIn(formData.email, formData.password);
        console.log('Login result:', result);
        
        if (result && result.user && result.session) {
          console.log('Login successful, user:', result.user.email);
          console.log('Session token exists:', !!result.session.access_token);
          console.log('User ID:', result.user.id);
          
          // Verificar que el middleware puede acceder a la sesión
          console.log('Checking session accessibility...');
          const { data: sessionCheck } = await supabase.auth.getSession();
          console.log('Session check result:', !!sessionCheck.session);
          
          toast({
            title: 'Inicio de sesión exitoso',
            description: 'Redirigiendo al panel de administración...',
          });
          
          // Redirección simple y directa sin timeouts
          console.log('Login successful, redirecting immediately...');
          window.location.replace('/admin');
          
        } else {
          console.log('Login failed - no user or session in result:', result);
          throw new Error('Error en la autenticación - datos de sesión incompletos');
        }
      }
    } catch (error: any) {
      console.error('Login error caught:', error);
      let errorMessage = 'Ha ocurrido un error inesperado';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión';
      } else if (error.message.includes('no autorizado')) {
        errorMessage = 'Email no autorizado para acceso administrativo';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Fish className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Crear Cuenta Admin' : 'Panel de Administración'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {isSignUp 
              ? 'Registra tu cuenta de administrador' 
              : 'Ingresa tus credenciales para continuar'
            }
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin_delivery@cabanita.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11"
              />
            </div>
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="h-11"
                />
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                </>
              ) : (
                isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({ email: '', password: '', confirmPassword: '' });
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {isSignUp 
                ? '¿Ya tienes cuenta? Inicia sesión' 
                : '¿Necesitas crear una cuenta? Regístrate'
              }
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                <strong>Usuarios autorizados:</strong><br />
                admin_delivery@cabanita.com • manager@cabanita.com • cajero@cabanita.com
              </p>
              <p className="text-xs text-blue-600 text-center mt-1">
                <strong>Contraseñas:</strong> admin123456 • manager123456 • cajero123456
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
