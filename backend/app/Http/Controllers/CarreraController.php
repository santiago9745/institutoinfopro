<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use Illuminate\Validation\ValidationException;
use App\Models\Materia;

class CarreraController extends Controller
{
    public function index()
    {
        return response()->json(Carrera::all());
    }
    public function store(Request $request)
    {
        try {
            $request->validate([
                'institucion' => 'required|in:INFOPRO,CLADECORP',
                'nombre' => 'required|string|max:150|unique:carreras,nombre',
                'duracion' => 'nullable|string|max:50',
                'modalidad' => 'nullable|string|max:50',
                'horario' => 'nullable|string|max:100',
                'fecha_inicio' => 'nullable|date',
                'promo_matricula' => 'nullable|numeric|min:0',
                'promo_mensualidad' => 'nullable|numeric|min:0',
                'incluye_texto' => 'nullable|boolean',
            ]);

            $carrera = Carrera::create($request->all());

            return response()->json($carrera, 201);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al crear la carrera.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
     public function show($id)
    {
        $carrera = Carrera::find($id);

        if (!$carrera) {
            return response()->json(['message' => 'Carrera no encontrada'], 404);
        }

        return response()->json($carrera);
    }
     public function update(Request $request, $id)
    {
        $carrera = Carrera::find($id);

        if (!$carrera) {
            return response()->json(['message' => 'Carrera no encontrada'], 404);
        }

        try {
            $request->validate([
                'institucion' => 'required|in:INFOPRO,CLADECORP',
                'nombre' => 'required|string|max:150|unique:carreras,nombre,'.$carrera->id,
                'duracion' => 'nullable|string|max:50',
                'modalidad' => 'nullable|string|max:50',
                'horario' => 'nullable|string|max:100',
                'fecha_inicio' => 'nullable|date',
                'promo_matricula' => 'nullable|numeric|min:0',
                'promo_mensualidad' => 'nullable|numeric|min:0',
                'incluye_texto' => 'nullable|boolean',
            ]);

            $carrera->update($request->all());

            return response()->json($carrera);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Ocurrió un error al actualizar la carrera.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function materias(Request $request)
    {
        $carreraId = $request->query('carrera_id'); // Obtener carrera_id de la query string

        if (!$carreraId) {
            return response()->json([], 200);
        }

        // Consultar las materias filtrando por carrera_id
        $materias = Materia::where('carrera_id', $carreraId)->get();

        return response()->json($materias);
    }
}
