<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Inscripcion;
use App\Models\Pago;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\Cuota;
use App\Models\PerfilEstudiante;
use App\Mail\UsuarioRegistrado;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class EstudianteController extends Controller
{
    public function listadoEstudiantes()
    {
        try {
    $estudiantes = DB::table('users')
        ->leftJoin('inscripciones', 'users.id', '=', 'inscripciones.usuario_id')
        ->leftJoin('perfiles_estudiantes', 'users.id', '=', 'perfiles_estudiantes.usuario_id')
        ->leftJoin('carreras', 'inscripciones.carrera_id', '=', 'carreras.id')
        ->leftJoin('pagos', 'users.id', '=', 'pagos.usuario_id')
        ->where('users.rol', 4)
        ->where('users.estado',1)
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
            'perfiles_estudiantes.observaciones',
            'carreras.id as carrera_id',
            'carreras.nombre as carrera_nombre',
            'carreras.duracion',
            'carreras.modalidad',
            'carreras.horario',
            'inscripciones.estado as estado_inscripcion',
            'inscripciones.fecha_inscripcion',
            'pagos.monto as monto_pago',
            'pagos.concepto as concepto_pago',
            'pagos.fecha_pago',

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
            $passwordPlano = Str::random(10);
            // 1. Crear usuario
            $usuario = User::create([
                'name' => $request->name,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'ci' => $request->ci,
                'expedido' => $request->expedido,
                'celular' => $request->celular,
                'email' => $request->email,
                'password' => $passwordPlano,
                'rol' => 4, // estudiante
                'estado' => 1
            ]);

            // 2. Crear perfil estudiante
            PerfilEstudiante::create([
                'usuario_id' => $usuario->id,
                'institucion' => $request->institucion,
                'codigo' => $request->codigo_estudiante,
                'celular_referencia' => $request->celular_referencia,
                'referencia_nombre' => $request->referencia_nombre,
                'referencia_relacion' => $request->referencia_relacion,
                'como_se_entero' => $request->como_se_entero,
                'responsable_inscripcion' => $request->responsable_inscripcion,
                'observaciones' => $request->observaciones,
                'a_nombre_factura' => $request->a_nombre_factura
            ]);

            // 3. Crear inscripción
            $inscripcion = Inscripcion::create([
                'usuario_id' => $usuario->id,
                'carrera_id' => $request->carrera_id,
                'fecha_inscripcion' => $request->fecha_inscripcion,
                'estado' => $request->estado ?? 'por_iniciar',
            ]);

            // 4. Crear cuota
            $cuota = Cuota::create([
                'usuario_id' => $usuario->id,
                'carrera_id' => $request->carrera_id,
                'fecha_vencimiento' => now()->addMonth(),
                'monto' => $request->monto_pago ?? 0,
                'estado' => 'pendiente',
            ]);

            // 5. Crear pago si corresponde
            if ($request->filled('monto_pago') && $request->filled('concepto_pago')) {
                Pago::create([
                    'usuario_id' => $usuario->id,
                    'cuota_id' => $cuota->id,
                    'monto' => $request->monto_pago,
                    'concepto' => $request->concepto_pago,
                    'fecha_pago' => $request->fecha_pago,
                ]);

                $cuota->estado = 'pagada';
                $cuota->save();
            }

            Mail::to($usuario->email)->send(new UsuarioRegistrado($usuario, $passwordPlano));

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


    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'apellido_paterno' => 'required|string|max:255',
                'apellido_materno' => 'nullable|string|max:255',
                'ci' => 'required|string|max:20',
                'celular' => 'required|string|max:20',
                'email' => 'required|email|unique:users,email,' . $id,
                'password' => 'nullable|string|min:6',
                'carrera_id' => 'required|integer|exists:carreras,id',
                'fecha_inscripcion' => 'required|date',
                'estado' => 'nullable|in:por_iniciar,activo,inactivo,abandonado,finalizado',
            ]);

            // 1. Actualizar Usuario
            $usuario = User::findOrFail($id);
            $usuario->name = $request->input('name');
            $usuario->apellido_paterno = $request->input('apellido_paterno');
            $usuario->apellido_materno = $request->input('apellido_materno');
            $usuario->celular = $request->input('celular');
            $usuario->ci = $request->input('ci');
            $usuario->expedido = $request->input('expedido');
            $usuario->email = $request->input('email');

            if ($request->filled('password')) {
                $usuario->password = bcrypt($request->input('password'));
            }
            $usuario->save();

            // 2. Actualizar Perfil Estudiante
            $perfil = PerfilEstudiante::where('usuario_id', $usuario->id)->firstOrFail();
            $perfil->institucion = $request->input('institucion');
            $perfil->celular_referencia = $request->input('celular_referencia');
            $perfil->referencia_nombre = $request->input('referencia_nombre');
            $perfil->referencia_relacion = $request->input('referencia_relacion');
            $perfil->como_se_entero = $request->input('como_se_entero');
            $perfil->responsable_inscripcion = $request->input('responsable_inscripcion');
            $perfil->observaciones = $request->input('observaciones');
            $perfil->a_nombre_factura = $request->input('a_nombre_factura');
            $perfil->save();

            // 3. Actualizar Inscripción
            $inscripcion = Inscripcion::where('usuario_id', $usuario->id)->firstOrFail();
            $inscripcion->carrera_id = $request->input('carrera_id');
            $inscripcion->fecha_inscripcion = $request->input('fecha_inscripcion');
            if ($request->has('estado')) {
                $inscripcion->estado = $request->input('estado');
            }
            $inscripcion->save();

            DB::commit();
            
            return response()->json([
                'message' => 'Registro actualizado correctamente',
                'usuario' => $usuario,
                'inscripcion' => $inscripcion
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar registro',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function delete($id)
    {
        $estudiante=User::find($id);
        if (!$estudiante) {
            return response()->json(['menssage'=>'EL estudiante no se pudo eliminar'],404);
        }
        $estudiante->estado=0;
        $estudiante->save();
        return response()->json(['message'=>'estudiante eliminado correctamente']);
    }
}
