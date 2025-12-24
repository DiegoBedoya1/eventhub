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
        $events = Event::where('available_spots', '>', 0) // Opcional: mostrar solo con cupo
                       ->where('start_time', '>=', now()) // Solo eventos futuros
                       ->orderBy('start_time')
                       ->get();

        return response()->json($events);
    }

    // 2. Detalle del Evento (GET /api/events/{id})
    public function show($id)
    {
        return response()->json(Event::findOrFail($id));
    }

    // 3. Crear Evento (POST /api/events) 
    // Solo para organizadores
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required',
            'category_id' => 'required|exists:categories,id',
            'type' => 'required|in:ABIERTO,CERRADO',
            'max_capacity' => 'required|integer',
            'start_time' => 'required|date',
            // ... otras validaciones
        ]);

        // Inicializamos cupos disponibles igual a la capacidad máxima
        $validated['available_spots'] = $validated['max_capacity'];

        $event = Event::create($validated);
        return response()->json($event, 201);
    }

    // 4. Registrar Asistencia (POST /api/events/{id}/register)
    // Lógica crítica del diagrama "Modelo" 
    public function register(Request $request, $id)
    {
        $request->validate([
            'email' => 'required|email',
            'full_name' => 'required'
        ]);

        // Usamos una Transacción para evitar condiciones de carrera (Concurrency)
        // Esto soluciona el problema mencionado sobre la concurrencia en PHP  
        return DB::transaction(function () use ($request, $id) {
            
            // A. Buscar o crear usuario
            $user = User::firstOrCreate(
                ['email' => $request->email],
                ['full_name' => $request->full_name]
            );

            // B. Bloquear la fila del evento para lectura (Pessimistic Locking)
            // Esto evita que dos personas tomen el último cupo al mismo tiempo.
            $event = Event::lockForUpdate()->findOrFail($id);

            // C. Verificar regla de negocio: ¿Hay cupos? 
            if ($event->type === 'CERRADO' && $event->available_spots <= 0) {
                return response()->json(['message' => 'No hay cupos disponibles'], 409);
            }

            // D. Verificar si ya está registrado
            if (Registration::where('user_id', $user->id)->where('event_id', $event->id)->exists()) {
                return response()->json(['message' => 'Ya estás registrado'], 422);
            }

            // E. Registrar
            Registration::create([
                'user_id' => $user->id,
                'event_id' => $event->id,
                'status' => 'CONFIRMED'
            ]);

            // F. Restar cupo (Solo si es cerrado) 
            if ($event->type === 'CERRADO') {
                $event->decrement('available_spots');
            }

            return response()->json([
                'message' => '¡Registro Exitoso!', //  
                'cupos_restantes' => $event->available_spots
            ]);
        });
    }
}