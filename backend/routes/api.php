<?php

use App\Http\Controllers\AuthController; // This line is already present and correct.
use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{id}', [EventController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events', [EventController::class, 'store']);
    Route::post('/events/{id}/register', [EventController::class, 'register']);
    Route::delete('/events/{event_id}/cancel', [EventController::class, 'cancelRegistration']);
    Route::get('/myevents', [EventController::class, 'getMyEvents']);
});

Route::get('/events/{id}/participants', [EventController::class, 'getParticipants']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
