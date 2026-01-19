import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        setLoading(true);

        let data: any = null;

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

            // Parseo seguro del JSON
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                const message = data?.errors
                    ? (Object.values(data.errors)[0] as string[])[0]
                    : data?.message || 'Error al crear la cuenta';
                throw new Error(message);
            }

            // Guardar sesión
            localStorage.setItem('token', data.access_token || data.token);
            localStorage.setItem('name', data.user.full_name);
            localStorage.setItem('is_admin', String(data.user.is_admin));
            localStorage.setItem('user_id', data.user.id); // <--- AGREGA ESTO

            toast.success('Cuenta creada exitosamente');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center ">
            <Toaster />

            <div className="w-full max-w-[420px]  rounded-2xl shadow-xl p-8">
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
              w-full py-3 rounded-lg
              bg-indigo-600 text-black font-bold
              hover:bg-indigo-700
              shadow-lg shadow-indigo-500/30
              transition-all
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
