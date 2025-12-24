<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\Category;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        // Crear las categorías para la clasificación requerida [cite: 19, 33]
        $academico = Category::firstOrCreate(['name' => 'Académico']);
        $social = Category::firstOrCreate(['name' => 'Social']);


        Event::insert([
            [
                'title' => 'Seminario de Inteligencia Artificial',
                'description' => 'Charla sobre las últimas tendencias en IA y Machine Learning.',
                'location' => 'Auditorio Principal - Edificio de Postgrados',
                'start_time' => '2025-12-16 14:00:00',
                'end_time' => '2025-12-16 16:00:00',
                'category_id' => $academico->id,
                'type' => 'CERRADO',
                'max_capacity' => 150,
                'available_spots' => 150,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Torneo Relámpago de Ajedrez',
                'description' => 'Competencia amistosa entre estudiantes de todas las facultades.',
                'location' => 'Centro de Estudiantes',
                'start_time' => '2025-12-17 09:00:00',
                'end_time' => '2025-12-17 13:00:00',
                'category_id' => $social->id,
                'type' => 'ABIERTO',
                'max_capacity' => 100,
                'available_spots' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Workshop: Diseño UX/UI',
                'description' => 'Taller práctico sobre principios de diseño de experiencia de usuario.',
                'location' => 'Laboratorio de Diseño - FADCOM',
                'start_time' => '2025-12-19 10:00:00',
                'end_time' => '2025-12-19 12:00:00',
                'category_id' => $academico->id,
                'type' => 'CERRADO',
                'max_capacity' => 30,
                'available_spots' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
