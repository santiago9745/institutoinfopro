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
        Schema::create('perfiles_estudiantes', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('usuario_id');
            $table->foreign('usuario_id')->references('id')->on('users');
            $table->enum('institucion', ['INFOPRO', 'CLADECORP']);
            $table->string('celular_referencia', 20)->nullable();
            $table->string('referencia_nombre', 100)->nullable();
            $table->string('referencia_relacion', 50)->nullable();
            $table->text('como_se_entero')->nullable();
            $table->string('responsable_inscripcion', 100)->nullable();
            $table->text('observaciones')->nullable();
            $table->string('a_nombre_factura', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfiles_estudiantes');
    }
};
