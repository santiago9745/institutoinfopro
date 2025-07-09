<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cuota extends Model
{
     protected $fillable = [
        'usuario_id',
        'carrera_id',
        'fecha_vencimiento',
        'monto',
        'estado',
        'descripcion',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'carrera_id');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
}
