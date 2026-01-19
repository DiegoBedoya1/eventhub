import { Calendar, PlusCircle, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === '1';
  const name  = localStorage.getItem('name');
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('is_admin');
    navigate('/login');
  };

  return (
    <header className="bg-[var(--color-primary)] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-lg p-2">
              <Calendar className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <div>
              <h1 className="text-white">ESPOL Eventos</h1>
              <p className="text-sm text-[var(--color-espol-light)] mt-0.5 text-center">
                Gestión de eventos académicos y sociales
              </p>
            </div>
            <div>
              <h2 className="p-8 text-white">Hola: {name}</h2>
      
            </div>
          </div>

          <nav className="flex gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-[var(--color-secondary)] text-white hover:bg-[var(--color-espol-blue)]"
            >
              <Calendar className="w-5 h-5" />
              Catálogo
            </Link>
            {localStorage.getItem('is_admin') === '1' && (
              <Link
                to="/create-event"
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-[var(--color-secondary)] text-white hover:bg-[var(--color-espol-blue)]"
              >
                <PlusCircle className="w-5 h-5" />
                Crear Evento
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-[var(--color-secondary)] text-white hover:bg-[var(--color-espol-blue)]"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}