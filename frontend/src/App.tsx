import { useState } from 'react';
import { EventCatalog } from './components/EventCatalog';
import { EventDetails } from './components/EventDetails';
import { mockEvents, getEventById } from './utils/mockData';

export default function App() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;

  const handleViewDetails = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleCloseDetails = () => {
    setSelectedEventId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">EventHub</h1>
        </div>
      </header>

      <main>
        <EventCatalog events={mockEvents} onViewDetails={handleViewDetails} />
      </main>

      {selectedEvent && (
        <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
      )}

      {/* Footer */}
      <footer className="bg-[var(--color-primary)] text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-90">
            © 2024 ESPOL - Escuela Superior Politécnica del Litoral
          </p>
          <p className="text-xs opacity-75 mt-2">
            Plataforma de gestión de eventos académicos y sociales
          </p>
        </div>
      </footer>
    </div>
  );
}
