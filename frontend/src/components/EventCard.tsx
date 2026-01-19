import { Clock, MapPin, Users, Tag } from 'lucide-react';
import { Event } from '../types/event';

// 1. CORRECCIÓN DE TIPO: Aquí definimos que el ID es un número
interface EventCardProps {
  event: Event;
  onViewDetails: (eventId: number) => void;
}

export function EventCard({ event, onViewDetails }: EventCardProps) {

  // 2. CORRECCIÓN DE LÓGICA MATEMÁTICA
  // Aseguramos que sean números para evitar NaN
  const maxCapacity = Number(event.max_capacity) || 0;
  const availableSpots = Number(event.available_spots) || 0;
  const asistentes = maxCapacity - availableSpots;

  const attendancePercentage = maxCapacity > 0 ? (asistentes / maxCapacity) * 100 : 0;
  const isAlmostFull = attendancePercentage >= 80;
  // Usamos availableSpots === 0 para saber si está lleno con certeza
  const isFull = availableSpots === 0;

  // 3. CORRECCIÓN DE DATOS FALTANTES
  // Si category es null (puede pasar), usamos 'General' para que no explote
  const categoryName = event.category?.name || 'General';

  // 4. NUEVA LÓGICA DE FECHAS (Adiós al .split error)
  // Esta función usa el motor de fechas del navegador, funciona con ' ' o con 'T'
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

    // Extraemos horas y minutos matemáticamente, no cortando texto
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const dateInfo = formatDate(event.start_time);

  // Diccionario de colores
  const categoryColors: Record<string, string> = {
    'Académico': 'bg-blue-100 text-blue-700 border-blue-200',
    'Social': 'bg-purple-100 text-purple-700 border-purple-200',
    'Deportivo': 'bg-green-100 text-green-700 border-green-200',
    'Cultural': 'bg-orange-100 text-orange-700 border-orange-200'
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-[var(--color-border)] group">
      <div className="flex h-full"> {/* h-full añadido para igualar alturas */}

        {/* Date Section (Tu diseño original) */}
        <div className="bg-[var(--color-primary)] text-white p-6 flex flex-col items-center justify-center min-w-[120px]">
          <span className="text-sm opacity-90">{dateInfo.day}</span>
          <span className="text-4xl font-bold my-2">{dateInfo.date}</span>
          <span className="text-sm opacity-90 uppercase">{dateInfo.month}</span>
        </div>

        <div className="flex-1 p-8 flex flex-col"> {/* flex-col para empujar el footer abajo */}
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

          {/* Grid de Hora y Lugar */}
          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto"> {/* mt-auto empuja esto si hay espacio */}
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <Clock className="w-5 h-5 text-[var(--color-secondary)]" />
              <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[var(--color-text-light)]">
              <MapPin className="w-5 h-5 text-[var(--color-secondary)]" />
              <span className="truncate" title={event.location}>{event.location}</span>
            </div>
          </div>

          {/* Footer con Asistentes y Botón */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[var(--color-secondary)]" />
              <span className="text-sm">
                <span className="font-semibold text-[var(--color-primary)]">{asistentes}</span>
                <span className="text-[var(--color-text-light)]"> / {maxCapacity} asistentes</span>
              </span>
            </div>

            <button
              onClick={() => onViewDetails(event.id)}
              className="bg-[var(--color-secondary)] text-white px-6 py-2.5 rounded-lg hover:bg-[var(--color-primary)] transition-colors cursor-pointer"
            >
              Ver detalles
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all ${isFull ? 'bg-red-500' : isAlmostFull ? 'bg-yellow-500' : 'bg-[var(--color-secondary)]'
                }`}
              style={{ width: `${Math.min(attendancePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}