<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'title',
        'description', 
        'location',
        'start_time',
        'end_time',
        'category_id',
        'type',
        'max_capacity',
        'available_spots'
    ];
    public function registrations()
    {
        return $this->hasMany(Registration::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
