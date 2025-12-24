<?php

use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index']);           // Catálogo
Route::post('/events', [EventController::class, 'store']);          // Crear (Organizador)
Route::get('/events/{id}', [EventController::class, 'show']);       // Detalle
Route::post('/events/{id}/register', [EventController::class, 'register']); // Confirmar Asistencia