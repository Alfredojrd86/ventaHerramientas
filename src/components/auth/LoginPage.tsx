import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener la URL a la que debe redirigir después del login
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Credenciales incorrectas');
    }
  };

  const fillDemoCredentials = (userType: 'admin' | 'tenant') => {
    if (userType === 'admin') {
      setEmail('admin@demo.com');
      setPassword('admin123');
    } else {
      setEmail('tenant@demo.com');
      setPassword('tenant123');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            🏢 Acceso Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para acceder al dashboard
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error de autenticación
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </span>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">Credenciales de demo:</p>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('admin')}
                  className="w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-blue-800">👨‍💼 Super Admin</div>
                  <div className="text-sm text-blue-600">admin@demo.com / admin123</div>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('tenant')}
                  className="w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="font-medium text-green-800">👩‍💼 Dueño de Tienda</div>
                  <div className="text-sm text-green-600">tenant@demo.com / tenant123</div>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Acceso seguro con autenticación
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-600">
            <p className="mb-2">🔐 <strong>Niveles de Acceso:</strong></p>
            <ul className="space-y-1 text-xs">
              <li>• <strong>Super Admin:</strong> Acceso completo a todo</li>
              <li>• <strong>Tenant Owner:</strong> Solo sus propias tiendas</li>
            </ul>
          </div>
          
          <div className="mt-4">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              ← Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
