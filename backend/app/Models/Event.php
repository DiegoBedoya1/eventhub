<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model; 
use Illuminate\Database\Eloquent\Relations\BelongsTo; 

class Event extends Model {
    protected $guarded = []; 
    
    public function registrations() {
        return $this->hasMany(Registration::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}