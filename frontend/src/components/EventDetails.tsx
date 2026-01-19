import { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Info, Users, LockOpen } from 'lucide-react';
import { EventDetail } from '../types/event';

interface EventDetailsProps {
  event: EventDetail;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Lógica de evento Abierto/Cerrado
  const isOpen = event.tipo === 'ABIERTO';
  const porcentaje = !isOpen && event.capacidad_maxima > 0 
    ? (event.inscritos / event.capacidad_maxima) * 100 
    : 0;

  const handleRegister = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      // 1. ALERT NATIVO: Si no hay token
      alert("Debes iniciar sesión para poder registrarte.");
      return;
    }

    setIsRegistering(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({}) 
      });

      const data = await response.json();

      if (response.ok) {
        // 2. ALERT NATIVO: Éxito
        // El navegador pausa aquí hasta que el usuario da click en "Aceptar"
        alert(data.message || "¡Te has registrado correctamente!");
        
        // Al cerrar el alert, cerramos el modal automáticamente
        onClose(); 
      } else {
        // 3. ALERT NATIVO: Error del backend (ej: "Ya registrado")
        alert(data.message || "No se pudo completar el registro.");
      }

    } catch (error) {
      // 4. ALERT NATIVO: Error de red
      alert("Error de conexión con el servidor. Intenta más tarde.");
      console.error(error);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-start z-10">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text)]">
              {event.titulo}
            </h2>
            <div className="flex gap-2 mt-2">
              <span className="inline-block px-3 py-1 bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] rounded-full text-sm font-medium">
                {event.tipo}
              </span>
              {isOpen && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
                    <LockOpen className="w-3 h-3" />
                    Entrada Libre
                  </span>
                )}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Calendar className="w-6 h-6 text-[var(--color-secondary)] mt-1" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Fecha</p>
                <p className="text-[var(--color-text-light)] capitalize">{event.fecha_visible}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-[var(--color-secondary)] mt-1" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Horario</p>
                <p className="text-[var(--color-text-light)]">{event.horario}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-6 h-6 text-[var(--color-secondary)] mt-1" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Ubicación</p>
                <p className="text-[var(--color-text-light)]">{event.ubicacion}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <User className="w-6 h-6 text-[var(--color-secondary)] mt-1" />
              <div>
                <p className="font-semibold text-[var(--color-text)]">Organizador</p>
                <p className="text-[var(--color-text-light)]">{event.organizador}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-[var(--color-secondary)]" />
              <h3 className="font-semibold text-lg">Acerca del evento</h3>
            </div>
            <p className="text-[var(--color-text-light)] leading-relaxed whitespace-pre-wrap">
              {event.descripcion}
            </p>
          </div>

          {/* Estado de Cupos */}
          {isOpen ? (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
              <div className="bg-green-100 p-2 rounded-full">
                <LockOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-green-800">Evento de Cupos Ilimitados</p>
                <p className="text-sm text-green-700">Regístrate para confirmar tu participación.</p>
              </div>
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Users className="w-5 h-5" />
                  <span>Estado de cupos</span>
                </div>
                <span className="text-blue-700 font-medium">
                  {event.inscritos} / {event.capacidad_maxima} inscritos
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-3 text-center">
                {event.cupos_disponibles > 0 
                  ? `¡Quedan ${event.cupos_disponibles} lugares disponibles!` 
                  : 'Evento lleno'}
              </p>
            </div>
          )}

          {/* Botón de Acción */}
          <div className="pt-4 flex gap-4">
            <button
              onClick={handleRegister}
              disabled={(!isOpen && event.cupos_disponibles === 0) || isRegistering}
              className={`flex-1 text-white py-4 rounded-xl font-semibold text-lg shadow-lg transition-all 
                ${(!isOpen && event.cupos_disponibles === 0)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-secondary)] hover:bg-[var(--color-primary)]'
                }
                disabled:opacity-70`}
            >
              {isRegistering ? 'Procesando...' : 'Confirmar Asistencia'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}