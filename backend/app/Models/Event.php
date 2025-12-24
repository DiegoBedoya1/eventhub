<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; // <--- ESTA LÍNEA ES LA QUE FALTA

class Event extends Model {
    protected $guarded = []; // Permite asignación masiva para simplificar
    
    public function registrations() {
        return $this->hasMany(Registration::class);
    }
}