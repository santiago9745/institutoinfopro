<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carrera extends Model
{
    protected $fillable = [
        'institucion',
        'nombre',
        'duracion',
        'modalidad',
        'horario',
        'fecha_inicio',
        'matricula',
        'mensualidad',
        'incluye_texto',
        'estado'
    ];

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }
    public function materias()
    {
        return $this->hasMany(Materia::class, 'carrera_id');
    }
}
