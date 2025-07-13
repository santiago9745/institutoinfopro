<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;

class CarreraController extends Controller
{
    public function index()
    {
        return response()->json(Carrera::all());
    }
}
