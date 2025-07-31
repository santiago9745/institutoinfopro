<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Inscripcion;
use App\Models\Pago;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Cuota;

class EstudianteController extends Controller
{
    public function listadoEstudiantes()
    {
        try {
    $estudiantes = DB::table('users')
        ->leftJoin('inscripciones', 'users.id', '=', 'inscripciones.usuario_id')
        ->leftJoin('perfiles_estudiantes', 'users.id', '=', 'perfiles_estudiantes.usuario_id')
        ->leftJoin('carreras', 'inscripciones.carrera_id', '=', 'carreras.id')
        ->where('users.rol', 4)
        ->select(
            'users.id',
            'users.name',
            'users.apellido_paterno',
            'users.apellido_materno',
            'users.ci',
            'users.expedido',
            'users.celular',
            'users.telefono_fijo',
            'users.email',
            'perfiles_estudiantes.institucion',
            'perfiles_estudiantes.celular_referencia',
            'perfiles_estudiantes.referencia_nombre',
            'perfiles_estudiantes.referencia_relacion',
            'perfiles_estudiantes.como_se_entero',
            'perfiles_estudiantes.responsable_inscripcion',
            'perfiles_estudiantes.a_nombre_factura',
            'carreras.nombre as carrera_nombre',
            'carreras.duracion',
            'carreras.modalidad',
            'carreras.horario',
            'inscripciones.estado as estado_inscripcion',
            'inscripciones.fecha_inscripcion'
        )
        ->get();

    return response()->json($estudiantes, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener los estudiantes inscritos',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // Crear usuario
            $usuario = User::create([
                'name' => $request->name,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'ci' => $request->ci,
                'expedido' => $request->expedido,
                'celular' => $request->celular,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'rol' => 4, // por ejemplo, 4 para estudiante
            ]);

            // Crear inscripción
            $inscripcion = Inscripcion::create([
                'usuario_id' => $usuario->id,
                'carrera_id' => $request->carrera_id,
                'fecha_inscripcion' => $request->fecha_inscripcion,
                'estado' => $request->estado ?? 'activo',
            ]);

            // Crear cuota (deberías definir el monto y vencimiento)
            $cuota = Cuota::create([
                'usuario_id' => $usuario->id,
                'carrera_id' => $request->carrera_id,
                'fecha_vencimiento' => now()->addMonth(), // por ejemplo
                'monto' => $request->monto_pago ?? 0,
                'estado' => 'pendiente',
            ]);

            // Crear pago si corresponde
            if ($request->filled('monto_pago') && $request->filled('concepto_pago')) {
                Pago::create([
                    'usuario_id' => $usuario->id,
                    'cuota_id' => $cuota->id,
                    'monto' => $request->monto_pago,
                    'concepto' => $request->concepto_pago,
                    'fecha_pago' => $request->fecha_pago,
                ]);
                // Opcional: actualizar estado de cuota a pagada si corresponde
                $cuota->estado = 'pagada';
                $cuota->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Estudiante inscrito correctamente',
                'usuario_id' => $usuario->id,
                'inscripcion_id' => $inscripcion->id,
            ], 201);
        } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => true,
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
        }
    }
}
