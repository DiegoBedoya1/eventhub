import { Clock, MapPin, Users, Tag, LockOpen } from 'lucide-react';
import { Event } from '../types/event';

interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: number) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {

  // 1. Validamos si es evento abierto
  const isOpen = event.type === 'ABIERTO';

  // Cálculos matemáticos (solo relevantes si NO es abierto)
  const maxCapacity = Number(event.max_capacity) || 0;
  const availableSpots = Number(event.available_spots) || 0;
  const asistentes = maxCapacity - availableSpots;

  const attendancePercentage = maxCapacity > 0 ? (asistentes / maxCapacity) * 100 : 0;
  const isAlmostFull = attendancePercentage >= 80;
  const isFull = availableSpots === 0;

  const categoryName = event.category?.name || 'General';

  const formatDate = (isoString: string) => {
    if (!isoString) return { day: '-', date: '-', month: '-' };
    const date = new Date(isoString);
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    return {
      day: days[date.getDay()] || '-',
      date: date.getDate() || '-',
      month: months[date.getMonth()] || '-'
    };
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const dateInfo = formatDate(event.start_time);

  const categoryColors: Record<string, string> = {
    'Académico': 'bg-blue-100 text-blue-700 border-blue-200',
    'Social': 'bg-purple-100 text-purple-700 border-purple-200',
    'Deportivo': 'bg-green-100 text-green-700 border-green-200',
    'Cultural': 'bg-orange-100 text-orange-700 border-orange-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--color-border)] group">
      <div className="flex h-full">

        {/* Date Section */}
        <div className="bg-[var(--color-primary)] text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-sm opacity-90">{dateInfo.day}</span>
          <span className="text-4xl font-bold my-2">{dateInfo.date}</span>
          <span className="text-sm opacity-90 uppercase">{dateInfo.month}</span>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="group-hover:text-[var(--color-secondary)] transition-colors font-bold text-lg">
                {event.title}
              </h3>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs border ${categoryColors[categoryName] || 'bg-gray-100'}`}>
                  <Tag className="w-3 h-3 inline mr-1" />
                  {categoryName}
                </span>
                
                {/* CONDICIONAL: Solo mostrar alertas de cupo si NO es abierto */}
                {!isOpen && isFull && (
                  <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 border border-red-200">
                    Lleno
                  </span>
                )}
                {!isOpen && isAlmostFull && !isFull && (
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

          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <Clock className="w-5 h-5 text-[var(--color-secondary)]" />
              <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <MapPin className="w-5 h-5 text-[var(--color-secondary)]" />
              <span className="truncate" title={event.location}>{event.location}</span>
            </div>
          </div>

          {/* Footer modificado */}
          <div className="flex items-center justify-between mb-4">
            
            {/* CONDICIONAL: Mostrar contador O texto de entrada libre */}
            {isOpen ? (
               <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                 <LockOpen className="w-4 h-4" />
                 <span className="text-sm font-medium">Entrada Libre</span>
               </div>
            ) : (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[var(--color-secondary)]" />
                <span className="text-sm">
                  <span className="font-semibold text-[var(--color-primary)]">{asistentes}</span>
                  <span className="text-[var(--color-text-light)]"> / {maxCapacity} asistentes</span>
                </span>
              </div>
            )}

            <button
              onClick={() => onViewDetails(event.id)}
              className="bg-[var(--color-secondary)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
            >
              Ver detalles
            </button>
          </div>

          {/* CONDICIONAL: Barra de progreso solo si NO es abierto */}
          {!isOpen && (
            <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all ${isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-[var(--color-secondary)]'
                  }`}
                style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
              />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}