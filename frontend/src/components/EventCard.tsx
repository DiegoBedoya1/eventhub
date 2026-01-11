import { Clock, MapPin, Users, Tag } from 'lucide-react';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: string) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {
  const attendancePercentage = (event.attendees / event.capacity) * 100;
  const isAlmostFull = attendancePercentage >= 80;
  const isFull = event.attendees >= event.capacity;

  const categoryColors = {
    'Académico': 'bg-blue-100 text-blue-700 border-blue-200',
    'Social': 'bg-purple-100 text-purple-700 border-purple-200',
    'Deportivo': 'bg-green-100 text-green-700 border-green-200',
    'Cultural': 'bg-orange-100 text-orange-700 border-orange-200'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()]
    };
  };

  const dateInfo = formatDate(event.date);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--color-border)] group">
      <div className="flex">
        {/* Date Section */}
        <div className="bg-[var(--color-primary)] text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-sm opacity-90">{dateInfo.day}</span>
          <span className="text-4xl font-bold my-2">{dateInfo.date}</span>
          <span className="text-sm opacity-90">{dateInfo.month}</span>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="group-hover:text-[var(--color-secondary)] transition-colors">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs border ${categoryColors[event.category]}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {event.category}
                </span>
                {isFull && (
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">
                    Lleno
                  </span>
                )}
                {isAlmostFull && !isFull && (
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 border border-yellow-200">
                    Últimos cupos
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-[var(--color-text-light)] mb-6 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <Clock className="w-5 h-5 text-[var(--color-secondary)]" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <MapPin className="w-5 h-5 text-[var(--color-secondary)]" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[var(--color-secondary)]" />
              <span className="text-sm">
                <span className="font-semibold text-[var(--color-primary)]">{event.attendees}</span>
                <span className="text-[var(--color-text-light)]"> / {event.capacity} asistentes</span>
              </span>
            </div>

            <button
              onClick={() => onViewDetails(event.id)}
              className="bg-[var(--color-secondary)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary)] transition-colors"
            >
              Ver detalles
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-[var(--color-secondary)]'
              }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}