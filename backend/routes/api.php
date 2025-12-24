<?php

use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index']);          
Route::post('/events', [EventController::class, 'store']);          
Route::get('/events/{id}', [EventController::class, 'show']);   
Route::post('/events/{id}/register', [EventController::class, 'register']); // Confirmar Asistencia
Route::delete('/events/{event_id}/cancel', [EventController::class, 'cancelRegistration']);
Route::get('/events/{id}/participants', [EventController::class, 'getParticipants']); 
