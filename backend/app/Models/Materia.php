<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materia extends Model
{
    use HasFactory;
     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'materias'; // Laravel asume 'materias' por defecto, pero es buena práctica especificarlo.

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'codigo',
        'asignatura',
        'semestre',
        'horas',
    ];

}
