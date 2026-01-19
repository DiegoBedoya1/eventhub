import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Info, Users, LockOpen, LogOut, CheckCircle } from 'lucide-react';
import { EventDetail } from '../types/event';

interface EventDetailsProps {
  event: EventDetail;
  onClose: () => void;
}

export function EventDetails({ event, onClose }: EventDetailsProps) {
  // Estados de carga separados para no bloquear toda la UI
  const [isRegistering, setIsRegistering] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  
  const [amIRegistered, setAmIRegistered] = useState(false);

  // Inicializamos con tipos explícitos <number> para evitar errores de TS
  const [currentSpots, setCurrentSpots] = useState<number>(event.cupos_disponibles);
  const [currentInscritos, setCurrentInscritos] = useState<number>(event.inscritos);

  const isOpen = event.tipo === 'ABIERTO';

  // 1. CARGA INICIAL: Verificar si estoy inscrito
  useEffect(() => {
    let isMounted = true; // Para evitar actualizaciones si se cierra el modal
    console.log("FETCH DESDE USE EFFECT");

    const checkRegistration = async () => {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      if (!userId || !token) return;

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/participants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.participants) {
            const isRegistered = data.participants.some((p: any) => p.id === Number(userId));
            setAmIRegistered(isRegistered);
            // Sincronizamos inscritos reales
            setCurrentInscritos(data.total_participants || 0);
          }
        }
      } catch (error) {
        console.error("Error verificando estado:", error);
      }
    };

    checkRegistration();
    return () => { isMounted = false; };
  }, [event.id]);

  // 2. ACCIÓN: INSCRIBIRSE
  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Debes iniciar sesión para inscribirte.");

    setIsRegistering(true);
    try {
      
      const res = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const data = await res.json();

      if (res.ok) {
        alert("¡Inscripción exitosa!");
        setAmIRegistered(true);
        if (!isOpen) {
          setCurrentInscritos(prev => prev + 1);
          setCurrentSpots(prev => prev - 1);
        }
      } else {
        alert(data.message || "No se pudo realizar la inscripción.");
      }
    } catch (error) {
      alert("Error de conexión. Inténtalo más tarde.");
    } finally {
      setIsRegistering(false);
    }
  };

  // 3. ACCIÓN: CANCELAR
  const handleCancel = async () => {
    const token = localStorage.getItem('token');
    if (!confirm("¿Estás seguro de que deseas cancelar tu asistencia?")) return;

    setIsCanceling(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/cancel`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const data = await res.json();

      if (res.ok) {
        alert("Tu asistencia ha sido cancelada.");
        setAmIRegistered(false);
        
        // Actualizamos cupos con el dato exacto del backend si existe
        if (typeof data.available_spots === 'number') {
          setCurrentSpots(data.available_spots);
          // Recalculamos inscritos basándonos en la capacidad máxima
          const max = Number(event.capacidad_maxima) || 0;
          setCurrentInscritos(max - data.available_spots);
        } else if (!isOpen) {
           // Fallback manual si el backend no devuelve el dato
           setCurrentInscritos(prev => Math.max(0, prev - 1));
           setCurrentSpots(prev => prev + 1);
        }
      } else {
        alert(data.message || "Error al cancelar la asistencia.");
      }
    } catch (error) {
      alert("Error de conexión al cancelar.");
    } finally {
      setIsCanceling(false);
    }
  };

  // Cálculo visual de la barra
  const porcentaje = !isOpen && event.capacidad_maxima > 0
    ? (currentInscritos / event.capacidad_maxima) * 100
    : 0;

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
          {/* Info Grid (Iconos) */}
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

          {/* Estado de Cupos Visual */}
          {!isOpen && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-blue-900 font-semibold">
                  <Users className="w-5 h-5" />
                  <span>Estado de cupos</span>
                </div>
                <span className="text-blue-700 font-medium">
                  {currentInscritos} / {event.capacidad_maxima} inscritos
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                />
              </div>
              <p className="text-sm text-blue-600 mt-3 text-center">
                {currentSpots > 0
                  ? `¡Quedan ${currentSpots} lugares disponibles!`
                  : 'Evento lleno'}
              </p>
            </div>
          )}

          {/* BOTONES DE ACCIÓN: Aquí decidimos qué botón mostrar */}
          <div className="pt-4 flex gap-4">
            
            {amIRegistered ? (
              // === CASO 1: YA ESTOY REGISTRADO (Botón Rojo) ===
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="flex-1 bg-red-50 text-red-600 border border-red-200 py-4 rounded-xl font-bold text-lg hover:bg-red-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCanceling ? (
                   <span>Procesando...</span>
                ) : (
                   <>
                     <LogOut className="w-5 h-5" />
                     Cancelar mi Asistencia
                   </>
                )}
              </button>
            ) : (
              // === CASO 2: NO ESTOY REGISTRADO (Botón Principal) ===
              <button
                onClick={handleRegister}
                disabled={(!isOpen && currentSpots === 0) || isRegistering}
                className={`flex-1 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                  ${(!isOpen && currentSpots === 0) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[var(--color-secondary)] hover:bg-[var(--color-primary)] cursor-pointer'
                  }
                  disabled:opacity-70`}
              >
                {isRegistering ? (
                  <span>Inscribiendo...</span>
                ) : (
                  (!isOpen && currentSpots === 0) ? 'Sin Cupos' : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Inscribirme al Evento
                    </>
                  )
                )}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}