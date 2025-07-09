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
        'promo_matricula',
        'promo_mensualidad',
        'incluye_texto',
    ];

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class);
    }
}
