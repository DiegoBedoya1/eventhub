<?php
use App\Http\Controllers\AuthController; // This line is already present and correct.
use App\Http\Controllers\Api\EventController;
use Illuminate\Support\Facades\Route;

Route::get('/events', [EventController::class, 'index']);          
Route::post('/events', [EventController::class, 'store']);      

Route::get('/events/{id}', [EventController::class, 'show']);   
Route::post('/events/{id}/register', [EventController::class, 'register']); 
Route::get('/events/{id}/participants', [EventController::class, 'getParticipants']); 

Route::delete('/events/{event_id}/cancel', [EventController::class, 'cancelRegistration']);

Route::post('/login', [AuthController::class, 'login']);