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
        return response()->json(Event::findOrFail($id));
    }

    // Crear Evento (POST /api/events) 
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string', 
            'location' => 'required|string',    
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:ABIERTO,CERRADO',
            'max_capacity' => 'required|integer|min:1',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time', 
        ]);
        // cupos disponibles igual a la capacidad máxima
        $validated['available_spots'] = $validated['max_capacity'];

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    // (POST /api/events/{id}/register)
    public function register(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'full_name' => 'required'
        ]);

        return DB::transaction(function () use ($request, $id) {

            // A. Buscar o crear usuario
            $user = User::firstOrCreate(
                ['email' => $request->email],
                ['full_name' => $request->full_name]
            );


            $event = Event::lockForUpdate()->findOrFail($id);

            //  ¿Hay cupos? 
            if ($event->type === 'CERRADO' && $event->available_spots <= 0) {
                return response()->json(['message' => 'No hay cupos disponibles'], 409);
            }

            // Verificar si ya está registrado
            if (Registration::where('user_id', $user->id)->where('event_id', $event->id)->exists()) {
                return response()->json(['message' => 'Ya estás registrado'], 422);
            }

            //  Registrar
            Registration::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'status' => 'CONFIRMED'
            ]);

            // restar cupo (Solo si es cerrado) 
            if ($event->type === 'CERRADO') {
                $event->decrement('available_spots');
            }

            return response()->json([
                'message' => '¡Registro Exitoso!', //  
                'cupos_restantes' => $event->available_spots
            ]);
        });
    }


    public function cancelRegistration(Request $request, $eventId)
    {
        // validamos que el usuario envie su correo para identificar su registro
        $request->validate([
            'email' => 'required|email'
        ]);

        return DB::transaction(function () use ($request, $eventId) {
            // buscar al usuario por su correo 
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json(['message' => 'Usuario no encontrado'], 404);
            }

            // buscar la inscripcion activa 
            $registration = Registration::where('user_id', $user->id)
                ->where('event_id', $eventId)
                ->first();

            if (!$registration) {
                return response()->json(['message' => 'No tienes un registro activo para este evento'], 404);
            }

            // eliminar el registro (Quitar a la persona)
            $registration->delete();

            // devolver el cupo al evento
            $event = Event::lockForUpdate()->find($eventId);
            if ($event->type === 'CERRADO') {
                $event->increment('available_spots'); // +1 cupo disponible [cite: 21]
            }

            return response()->json([
                'message' => 'Asistencia cancelada exitosamente',
                'cupos_actuales' => $event->available_spots
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
}
