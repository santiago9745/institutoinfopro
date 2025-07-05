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
        Schema::create('carreras', function (Blueprint $table) {
            $table->increments('id');
            $table->enum('institucion', ['INFOPRO', 'CLADECORP']);
            $table->string('nombre', 150);
            $table->string('duracion', 50)->nullable();
            $table->string('modalidad', 50)->nullable();
            $table->string('horario', 100)->nullable();
            $table->timestamp('fecha_inicio')->nullable();
            $table->decimal('promo_matricula', 10, 2)->nullable();
            $table->decimal('promo_mensualidad', 10, 2)->nullable();
            $table->boolean('incluye_texto')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carreras');
    }
};
