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
        Schema::create('materia_prerequisitos', function (Blueprint $table) {
            $table->unsignedInteger('materia_id');
            $table->unsignedInteger('prerequisito_id');

            $table->primary(['materia_id', 'prerequisito_id']);

            $table->foreign('materia_id')->references('id')->on('materias')->onDelete('cascade');
            $table->foreign('prerequisito_id')->references('id')->on('materias')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materia_prerequisitos');
    }
};
