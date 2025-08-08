<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Materia::where('estado', 1)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $request->validate([
                'codigo' => 'required|string|max:20|unique:materias,codigo',
                'asignatura' => 'required|string|max:150',
                'semestre' => 'required|integer|min:1',
                'horas' => 'required|integer|min:1',
                'carrera_id' => 'required|exists:carreras,id',
            ]);
            $materia = Materia::create($request->all());
            return response()->json($materia,201);
        }catch(ValidationException $e){
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors(), // Retorna los detalles específicos de los errores
            ], 422);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Ocurrió un error al **crear** la materia.',
                'error' => $e->getMessage(), // 👈 Aquí está el error real
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $materia = Materia::findOrFail($id);
        return response()->json($materia);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            $materia = Materia::findOrFail($id);
            $request->validate([
                'codigo' => 'required|string|max:20|unique:materias,codigo,' . $materia->id,
                'asignatura' => 'required|string|max:150',
                'semestre' => 'required|integer|min:1',
                'horas' => 'required|integer|min:1',
                'carrera_id' => 'required|exists:carreras,id',
            ]);
            $materia->update($request->all());
            return response()->json($materia);
        }catch(ValidationException $e){
            return response()->json([
                'message' => 'Los datos proporcionados no son válidos.',
                'errors' => $e->errors(), // Retorna los detalles específicos de los errores
            ], 422);
        }catch(\Exception $e){
            return response()->json([
                'message' => 'Ocurrió un error al actualizar la materia.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $materia = Materia::find($id);
        if (!$materia) {
            return response()->json(['message'=>'Materia no encontrada'],404);
        }
        $materia->estado=0;
        $materia->save();
        return response()->json(['message'=>'Materia eliminada correctamente']);
    }
}
