import { useState, useEffect } from 'react';
import { EventCard } from './EventCard';
import { AttendanceTable } from './AttendanceTable'; // Corrected import path
import { X, Users, Settings } from 'lucide-react';
import { Event } from '../types/event';

export function MyEvents() {
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(false);
    useEffect(() => {
        fetchMyEvents();
    }, []);

    const fetchMyEvents = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://127.0.0.1:8000/api/myevents', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const rawData = await res.json(); // Esto recibe [[...]]

            // === CORRECCIÓN AQUÍ ===
            // Si rawData[0] es un array, úsalo. Si no, usa rawData normal.
            const dataToMap = Array.isArray(rawData[0]) ? rawData[0] : rawData;

            const mappedEvents = dataToMap.map((e: any) => ({
                id: e.id,
                title: e.title,          // Tu JSON ya trae "title", no "titulo"
                description: e.description,
                start_time: e.start_time, // Tu JSON ya trae "start_time"
                end_time: e.end_time,
                location: e.location,
                category: e.category || { name: 'General' },
                type: e.type,
                max_capacity: Number(e.max_capacity),
                available_spots: Number(e.available_spots),
                // Asegúrate de inicializar participants como array vacío
                participants: []
            }));

            setMyEvents(mappedEvents);
        } catch (e) {
            console.error("Error:", e);
        } finally {
            setLoadingAction(false);
        }
    };

    const handleOpenAdminDetails = async (event: Event) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/events/${event.id}/participants`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            // CONSOLA PARA DEBUG (Puedes quitarla luego)
            console.log("Participantes cargados:", data);

            // Actualizamos el evento seleccionado inyectándole la lista que llegó
            setSelectedEvent({
                ...event,
                participants: data.participants || [], // Usamos el array o vacío por seguridad
                total_participants: data.total_participants // Guardamos el total por si quieres mostrarlo
            });

        } catch (error) {
            console.error("Error cargando participantes", error);
            // Si falla, abrimos el modal igual pero sin lista
            setSelectedEvent({ ...event, participants: [] });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Settings className="text-indigo-600" /> Gestión de Mis Eventos
            </h1>

            <div className="grid gap-6">
                {myEvents.map((event, index) => (
                    <EventCard
                        key={`${event.id}-${index}`}
                        event={event}
                        onViewDetails={() => handleOpenAdminDetails(event)}
                    />
                ))}
            </div>

            {/* MODAL DE ADMINISTRACIÓN (Distinto al EventDetails normal) */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                            <div>
                                <h2 className="text-xl font-bold">{selectedEvent.titulo}</h2>
                                <p className="text-sm text-gray-500">Panel de Administración</p>
                            </div>
                            <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X />
                            </button>
                        </div>

                        <div className="p-8">
                            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                                <Users className="text-indigo-600 w-5 h-5" />
                                Lista de Asistentes ({selectedEvent.participants.length})
                            </h3>



                            <AttendanceTable participants={selectedEvent.participants} />

                        
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}