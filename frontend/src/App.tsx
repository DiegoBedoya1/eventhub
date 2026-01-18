import { useState } from 'react';
import { Header } from './components/Header';
import { CreateEvent } from './components/CreateEvent';
import { EventCatalog } from './components/EventCatalog';
import { EventDetails } from './components/EventDetails';
import { mockEvents, getEventById } from './utils/mockData';

export default function App() {
  const [currentView, setCurrentView] = useState<'catalog' | 'create'>('catalog');
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
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <main>
         {currentView === 'catalog' ? (
          <EventCatalog events={mockEvents} onViewDetails={handleViewDetails} />
        ) : (
          <CreateEvent />
        )}
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
