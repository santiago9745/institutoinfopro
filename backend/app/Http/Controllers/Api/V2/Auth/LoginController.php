<?php

namespace App\Http\Controllers\Api\V2\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V2\Auth\LoginRequest;
use LaravelJsonApi\Core\Document\Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param \App\Http\Requests\Api\V2\Auth\LoginRequest $request
     *
     * @return \Symfony\Component\HttpFoundation\Response|\LaravelJsonApi\Core\Document\Error
     * @throws \Exception
     */
    public function __invoke(LoginRequest $request): Response|Error
    {
        $user = User::where('email', $request->email)->first();
    
        if (!$user || !Hash::check($request->password, $user->password)) {
            // Retorna un error controlado si el usuario no existe o la contraseña es incorrecta
            return Error::fromArray([
                'title'  => 'Credenciales inválidas',
                'detail' => 'El email o la contraseña son incorrectos.',
                'status' => 401,
            ]);
        }
    
        // Si pasa la validación, sigue con la petición al oauth/token
        $client = DB::table('oauth_clients')->where('password_client', 1)->first();
    
        if (!$client) {
            return Error::fromArray([
                'title' => 'Configuración OAuth',
                'detail' => 'No se encontró cliente OAuth configurado para password_client.',
                'status' => 500,
            ]);
        }
        
        $req = Request::create(config('app.url') . '/oauth/token', 'POST', [
            'grant_type'    => 'password',
            'client_id'     => $client->id,
            'client_secret' => $client->secret,
            'username'      => $request->email,
            'password'      => $request->password,
            'scope'         => '',
        ]);
    
        $response = app()->handle($req);
    
        if ($response->getStatusCode() !== Response::HTTP_OK) {
            $content = json_decode($response->getContent(), true);
            return Error::fromArray([
                'title'  => Response::$statusTexts[$response->getStatusCode()],
                'detail' => $content['message'] ?? 'Error desconocido',
                'status' => $response->getStatusCode(),
            ]);
        }
    
        return $response;
    }
}
