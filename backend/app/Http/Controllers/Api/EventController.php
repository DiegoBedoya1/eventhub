<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use App\Models\Registration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventController extends Controller
{
    // 1. Catálogo de Eventos (GET /api/events)
    // Requerimiento: Ver catálogo semanal  
    public function index()
    {
        // Obtenemos todos los eventos, incluyendo su categoría (Académico/Social)
        // Se recomienda usar orderBy para mantener el catálogo organizado semanalmente
        $events = Event::with('category')->orderBy('start_time', 'asc')->get();

        return response()->json($events);
    }

    // 2. Detalle del Evento (GET /api/events/{id})
    public function show($id)
    {
        // Traemos el evento con su organizador y categoría
        $event = Event::with(['organizer', 'category'])->findOrFail($id);

        // Formateamos para la vista de Salvador
        return response()->json([
            'id' => $event->id,
            'titulo' => $event->title,
            // Formato: Lunes, 16 De Diciembre De 2024
            'fecha_visible' => $event->start_time->isoFormat('dddd, D [de] MMMM [de] YYYY'),
            // Formato: 14:00 - 16:00
            'horario' => $event->start_time->format('H:i') . ' - ' . $event->end_time->format('H:i'),
            'ubicacion' => $event->location,
            'organizador' => $event->organizer->full_name,
            'descripcion' => $event->description,
            'capacidad_maxima' => $event->max_capacity,
            'cupos_disponibles' => $event->available_spots,
            'inscritos' => $event->max_capacity - $event->available_spots,
            'tipo' => $event->type
        ]);
    }

    // Crear Evento (POST /api/events) 
    public function store(Request $request)
    {
        // 1. Validamos los datos técnicos del evento
        // Nota: YA NO pedimos 'user_id' en la validación porque lo tomamos del Token
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:ABIERTO,CERRADO',
            'max_capacity' => 'required|integer|min:1',
            'start_time' => 'required|date_format:Y-m-d H:i:s',
            'end_time' => 'required|date|after:start_time',
        ]);

        // 2. Verificamos si el usuario autenticado es admin
        // Auth::user() obtiene automáticamente al usuario que envió el Token/Sesión
        if (!$request->user()->is_admin) {
            return response()->json([
                'error' => 'No autorizado',
                'message' => 'Solo administradores pueden organizar eventos.'
            ], 403);
        }

        // 3. Preparamos los datos para guardar
        $validated['available_spots'] = $validated['max_capacity'];

        // 4. ASIGNACIÓN AUTOMÁTICA DEL ORGANIZADOR
        // Usamos la relación del usuario para crear el evento, así Laravel pone el user_id solo
        $event = $request->user()->events()->create($validated);

        return response()->json([
            'message' => 'Evento creado exitosamente',
            'organizer' => $request->user()->full_name,
            'data' => $event
        ], 201);
    }

    // (POST /api/events/{id}/register)
    public function register(Request $request, $id)
    {
        // 1. Obtenemos el usuario directamente del Token (inyectado por el middleware)
        $user = $request->user();

        return DB::transaction(function () use ($user, $id) {

            // buscar evento por id y bloquear updates
            $event = Event::lockForUpdate()->findOrFail($id);


            // verifciar si hay cupos]
            if ($event->type === 'CERRADO' && $event->available_spots <= 0) {
                return response()->json(['message' => 'No hay cupos disponibles'], 409);
            }

            // verificar si esta registrado
            $alreadyRegistered = Registration::where('user_id', $user->id)
                ->where('event_id', $event->id)
                ->exists();

            if ($alreadyRegistered) {
                return response()->json(['message' => 'Ya estas registrado en este evento'], 422);
            }

            // crear inscripcion
            Registration::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'status' => 'CONFIRMED'
            ]);

            // restar cupo
            if ($event->type === 'CERRADO') {
                $event->decrement('available_spots');
            }

            return response()->json([
                'message' => '¡Inscripción exitosa!',
                'user' => $user->full_name,
                'event' => $event->title,
                'available_spots' => $event->available_spots
            ]);
        });
    }


    public function cancelRegistration(Request $request, $eventId)
    {
        $user = $request->user();

        return DB::transaction(function () use ($user, $eventId) {

            $registration = Registration::where('user_id', $user->id)
                ->where('event_id', $eventId)
                ->first();

            if (!$registration) {
                return response()->json(['message' => 'No tienes un registro activo para este evento'], 404);
            }

            $registration->delete();

            $event = Event::lockForUpdate()->find($eventId);

            if ($event && $event->type === 'CERRADO') {
                $event->increment('available_spots');
            }

            return response()->json([
                'message' => 'Asistencia cancelada exitosamente',
                'available_spots' => $event ? $event->available_spots : null
            ]);
        });
    }


    public function getParticipants($id)
    {
        $event = Event::findOrFail($id);

        $participants = Registration::where('event_id', $id)
            ->with('user:id,full_name,email')
            ->get()
            ->pluck('user');

        return response()->json([
            'event_title' => $event->title,
            'total_participants' => $participants->count(),
            'participants' => $participants
        ]);
    }

    public function getMyEvents(Request $request)
    {
        $user = $request->user();

        $events = $user->events()
            ->with('category')
            ->withCount('registrations')
            ->orderBy('start_time', 'desc')
            ->get();

        return response()->json([
            $events
        ]);
    }
}
