import { Calendar, PlusCircle } from 'lucide-react';

interface HeaderProps {
  currentView: 'catalog' | 'create';
  onViewChange: (view: 'catalog' | 'create') => void;
}

export function Header({ currentView, onViewChange }: HeaderProps) {
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
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => onViewChange('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'catalog'
                  ? 'bg-white text-[var(--color-primary)]'
                  : 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-espol-blue)]'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Catálogo
            </button>
            <button
              onClick={() => onViewChange('create')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'create'
                  ? 'bg-white text-[var(--color-primary)]'
                  : 'bg-[var(--color-secondary)] text-white hover:bg-[var(--color-espol-blue)]'
              }`}
            >
              <PlusCircle className="w-5 h-5" />
              Crear Evento
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}