import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    type RegisterSuccessResponse = {
        access_token: string;
        user: {
            full_name: string;
            email: string;
        };
        message?: string;
        errors?: Record<string, string[]>;
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    full_name: name,
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            });

            const data: RegisterSuccessResponse = await response.json();

            if (!response.ok) {
                const message = data?.errors
                    ? Object.values(data.errors)[0][0]
                    : data?.message || 'Error al crear la cuenta';
                throw new Error(message);
            }

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('user_name', data.user.full_name);

            toast.success('Cuenta creada exitosamente');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Error de red');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
            <Toaster />

            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-gray-900">
                    Crear cuenta
                </h1>
                <p className="text-center text-gray-500 mt-2">
                    Únete a EventHub
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Nombre completo
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Confirmar contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="
              w-full py-2 rounded-md
              bg-indigo-600 text-white font-medium
              hover:bg-indigo-700
              disabled:opacity-60
            "
                    >
                        {loading ? 'Creando cuenta…' : 'Crear cuenta'}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tienes cuenta?{' '}
                        <span
                            onClick={() => navigate('/login')}
                            className="text-indigo-600 cursor-pointer hover:underline"
                        >
                            Inicia sesión
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}
