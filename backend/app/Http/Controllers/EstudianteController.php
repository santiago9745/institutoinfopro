<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Inscripcion;

class EstudianteController extends Controller
{
    public function listadoEstudiantes()
    {
        $inscripciones = Inscripcion::with('usuario', 'carrera')
            ->whereHas('usuario', function ($query) {
                // Opcional: filtrar solo usuarios con rol "estudiante" (4)
                $query->where('rol', 4);
            })
            ->get();

        // Retornar la data, por ejemplo en JSON (puedes cambiar a vista)
        return response()->json($inscripciones);
    }
}
