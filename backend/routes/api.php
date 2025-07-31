<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use LaravelJsonApi\Laravel\Routing\ResourceRegistrar;
use App\Http\Controllers\Api\V2\Auth\LoginController;
use App\Http\Controllers\Api\V2\Auth\LogoutController;
use App\Http\Controllers\Api\V2\Auth\RegisterController;
use App\Http\Controllers\Api\V2\Auth\ForgotPasswordController;
use App\Http\Controllers\Api\V2\Auth\ResetPasswordController;
use App\Http\Controllers\Api\V2\MeController;
use LaravelJsonApi\Laravel\Facades\JsonApiRoute;
use LaravelJsonApi\Laravel\Http\Controllers\JsonApiController;
use App\Models\User;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EstudianteController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\CarreraController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| ...
|
*/

// Rutas de autenticación que NO requieren un token (para obtener uno o registrarse)
Route::prefix('v2')->middleware('json.api')->group(function () {
    Route::post('/login', LoginController::class)->name('login');
    Route::post('/register', RegisterController::class);
    Route::post('/password-forgot', ForgotPasswordController::class); // Asumo que es ForgotController
    Route::post('/password-reset', ResetPasswordController::class)->name('password.reset');
});

Route::middleware('auth:api', 'json.api')->prefix('v2')->group(function () {
    Route::post('/logout', LogoutController::class); // Esta sí requiere autenticación
    // Aquí irían tus otras rutas protegidas, como 'me' si está protegida por Passport/Sanctum
    Route::get('/materias', [MateriaController::class, 'index']);
    Route::post('/materias', [MateriaController::class, 'store']);
    Route::put('/materias/{id}', [MateriaController::class, 'update']);
});

Route::get('/users', function () {
    return User::all();
});
Route::post('/users', [UserController::class, 'agregar']);
Route::put('/users/{id}', [UserController::class, 'update']);

Route::get('/carreras', [CarreraController::class, 'index']);
Route::post('carreras', [CarreraController::class, 'store']);   
Route::put('carreras/{id}', [CarreraController::class, 'update']);
Route::get('/materias', [CarreraController::class, 'materias']);

JsonApiRoute::server('v2')->prefix('v2')->resources(function (ResourceRegistrar $server) {
    $server->resource('users', JsonApiController::class);
    Route::get('me', [MeController::class, 'readProfile']);
    Route::patch('me', [MeController::class, 'updateProfile']);
});

// Otras rutas (sin autenticación explícita de grupo)
Route::prefix('v2')->group(function () {
    Route::get('/estudiantes-inscritos', [EstudianteController::class, 'listadoEstudiantes']);
});
Route::post('/inscripciones', [EstudianteController::class, 'store']);