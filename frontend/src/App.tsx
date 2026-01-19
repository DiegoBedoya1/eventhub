import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { CreateEvent } from './components/CreateEvent';
import { EventCatalog } from './components/EventCatalog';
import { EventDetails } from './components/EventDetails';
import Login from './components/Login';
import Profile from './components/Profile';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { Event, EventDetail } from './types/event';

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const location = useLocation();

  const showHeaderAndFooter = location.pathname !== '/login';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error cargando el catálogo:", error);
    }
  };

  const handleViewDetails = async (eventId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`);
      const data = await response.json();
      setSelectedEvent(data);
    } catch (error) {
      console.error("Error", error);
    }
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="bg-[var(--color-background)]">
      {showHeaderAndFooter && <Header />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<EventCatalog events={events} onViewDetails={handleViewDetails} />}
            />
            <Route
              path="/create-event"
              element={<CreateEvent onEventCreated={fetchEvents} />}
            />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>

      </main>

      {selectedEvent && (
        <EventDetails
          event={selectedEvent}
          onClose={handleCloseDetails}
        />
      )}

      {showHeaderAndFooter && (
        <footer className="bg-[var(--color-primary)] text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm opacity-90">
              © 2026 ESPOL - Escuela Superior Politécnica del Litoral
            </p>
            <p className="text-xs opacity-75 mt-2">
              Plataforma de gestión de eventos académicos y sociales
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}