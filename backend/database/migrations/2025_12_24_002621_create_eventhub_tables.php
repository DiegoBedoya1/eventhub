<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
         
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // 'Social', 'Académico'
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique(); // Correo institucional
            $table->timestamps();
        });

        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->string('location');
            $table->foreignId('category_id')->constrained();
            
          
            $table->enum('type', ['ABIERTO', 'CERRADO'])->default('ABIERTO'); 
            $table->integer('max_capacity');
            $table->integer('available_spots'); // Campo contador para optimizar lectura
            
            $table->timestamps();
        });

       
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('event_id')->constrained();
            $table->enum('status', ['CONFIRMED', 'CANCELLED'])->default('CONFIRMED');
            $table->timestamps();

            // Evitar doble inscripción activa
            $table->unique(['user_id', 'event_id']);
        });
    }
};