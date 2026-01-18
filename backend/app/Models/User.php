<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens; // Para usar tokens con tu frontend de Vite
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Si quieres que el password se encripte automáticamente (Laravel 10+)
    protected $casts = [
        'password' => 'hashed',
    ];

    public function events()
    {
        // Un usuario puede organizar muchos eventos
        return $this->hasMany(Event::class);
    }
}
