import { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Building,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Event } from "../types/event";

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
}

export function EventDetails({
  event,
  onClose,
}: EventDetailsProps) {
  const [isRegistered, setIsRegistered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const attendancePercentage =
    (event.attendees / event.capacity) * 100;
  const isFull = event.attendees >= event.capacity;
  const availableSpots = event.capacity - event.attendees;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistered(true);
    setShowForm(false);
    // In real app: save to database
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-[rgb(255,255,255)] bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-6 sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-white mb-2 font-[Acme] italic font-bold">
                {event.title}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-black bg-white bg-opacity-20 px-3 py-1 rounded-full">
                  {event.category}
                </span>
                {isFull && (
                  <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Evento lleno
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {isRegistered && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-green-900 mb-1">
                  ¡Registro confirmado!
                </h4>
                <p className="text-sm text-green-700">
                  Has confirmado tu asistencia a este evento.
                  Recibirás un recordatorio antes del evento.
                </p>
              </div>
            </div>
          )}

          {/* Event Info Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-4 bg-[var(--color-espol-light)] rounded-lg">
              <Calendar className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--color-text-light)]">
                  Fecha
                </p>
                <p className="font-medium capitalize">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[var(--color-espol-light)] rounded-lg">
              <Clock className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--color-text-light)]">
                  Horario
                </p>
                <p className="font-medium">
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[var(--color-espol-light)] rounded-lg">
              <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--color-text-light)]">
                  Ubicación
                </p>
                <p className="font-medium">{event.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[var(--color-espol-light)] rounded-lg">
              <Building className="w-5 h-5 text-[var(--color-primary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--color-text-light)]">
                  Organizador
                </p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-3">Descripción</h3>
            <p className="text-[var(--color-text-light)] leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Requirements */}
          {event.requirements &&
            event.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3">Requisitos</h3>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle className="w-5 h-5 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--color-text-light)]">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Capacity */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--color-primary)]" />
                <h4>Capacidad</h4>
              </div>
              <span className="text-sm">
                <span className="font-semibold text-[var(--color-primary)]">
                  {event.attendees}
                </span>
                <span className="text-[var(--color-text-light)]">
                  {" "}
                  / {event.capacity}
                </span>
              </span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all ${isFull
                  ? "bg-red-500"
                  : attendancePercentage >= 80
                    ? "bg-yellow-500"
                    : "bg-[var(--color-secondary)]"
                  }`}
                style={{
                  width: `${Math.min(attendancePercentage, 100)}%`,
                }}
              />
            </div>
            {!isFull && (
              <p className="text-sm text-[var(--color-text-light)] mt-2">
                {availableSpots}{" "}
                {availableSpots === 1
                  ? "cupo disponible"
                  : "cupos disponibles"}
              </p>
            )}
          </div>

          {/* boton aqui */}
          
        </div>
      </div>
    </div>
  );
}
