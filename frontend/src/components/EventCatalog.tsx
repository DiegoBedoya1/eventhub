import { Search } from 'lucide-react';
import { Event } from '../types/event';
import { EventCard } from './EventCard';

interface EventCatalogProps {
  events: Event[];
  onViewDetails: (eventId: string) => void;
}

export function EventCatalog({ events, onViewDetails }: EventCatalogProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Events Grid */}
      {events.length > 0 ? (
        <div className="grid gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-[var(--color-border)]">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-[var(--color-text-light)] mb-2">
            No se encontraron eventos
          </h3>
          <p className="text-[var(--color-text-light)]">
            No hay eventos disponibles en este momento.
          </p>
        </div>
      )}
    </div>
  );
}