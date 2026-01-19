import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' // <--- AGREGA ESTA LÍNEA
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      // OJO: Verifica si tu backend devuelve "data.token" o "data.access_token"
      // Según lo que vimos en el registro, suele ser "access_token"
      localStorage.setItem('token', data.access_token || data.token);
      localStorage.setItem('name', data.user.full_name);
      localStorage.setItem('is_admin', String(data.user.is_admin));
      localStorage.setItem('user_id', data.user.id); 

      toast.success('Welcome back');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Email or password incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <Toaster />

      <div className="w-full max-w-[420px]  rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Bienvenido a EventHub
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Inicia Sesion
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                  w-full
                  px-3 py-2
                  rounded-md
                  border border-slate-300
                  bg-white
                  text-slate-900
                  placeholder-slate-400
                  focus:border-indigo-500
                  focus:ring-2 focus:ring-indigo-500/20
                "            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 p-4">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                        w-full
                        px-3 py-2
                        rounded-md
                        border border-slate-300
                        bg-white
                        text-slate-900
                        placeholder-slate-400
                        focus:border-indigo-500
                        focus:ring-2 focus:ring-indigo-500/20
                      "            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
                    w-full
                    p-3
                    px-3 py-2
                    rounded-md
                    border border-slate-300
                    bg-white
                    text-slate-900
                    placeholder-slate-400
                    focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-500/20
                  "          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500 mb-2">¿No tienes cuenta?</p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full py-2 px-4 bg-indigo-600 text-black font-big rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Crear una cuenta nueva
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
