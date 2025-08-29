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
        $carrerasActivas = Carrera::where('estado', 1)->get();
        return response()->json($carrerasActivas);
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
                'matricula' => 'nullable|numeric|min:0',
                'mensualidad' => 'nullable|numeric|min:0',
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
                'matricula' => 'nullable|numeric|min:0',
                'mensualidad' => 'nullable|numeric|min:0',
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
    public function destroy($id)
    {
        $carrera = Carrera::find($id);

        if (!$carrera) {
            return response()->json(['message' => 'Carrera no encontrada.'], 404);
        }

        try {
            // Empezar transacción para que todo se haga junto o no se haga
            \DB::beginTransaction();

            // Cambiar estado de la carrera a 0
            $carrera->estado = 0;
            $carrera->save();

            // Cambiar estado de todas las materias asociadas a 0
            $carrera->materias()->update(['estado' => 0]);

            \DB::commit();

            return response()->json(['message' => 'Carrera y materias asociadas eliminadas lógicamente.']);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['message' => 'Error al eliminar la carrera.', 'error' => $e->getMessage()], 500);
        }
    }
}
