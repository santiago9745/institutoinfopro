<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerfilEstudiante extends Model
{
    protected $table = 'perfiles_estudiantes';

    protected $fillable = [
        'usuario_id',
        'codigo',
        'institucion',
        'celular_referencia',
        'referencia_nombre',
        'referencia_relacion',
        'como_se_entero',
        'responsable_inscripcion',
        'observaciones',
        'a_nombre_factura',
    ];
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
