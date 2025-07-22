<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materias', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('carrera_id');
            $table->foreign('carrera_id')->references('id')->on('carreras');
            $table->string('codigo', 20);
            $table->string('asignatura', 150);
            $table->unsignedTinyInteger('semestre');
            $table->integer('horas');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materias');
    }
};
