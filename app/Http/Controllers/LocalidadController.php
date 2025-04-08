<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocalidadResource;
use App\Models\Localidad;
use Illuminate\Http\Request;

class LocalidadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LocalidadResource::collection(Localidad::all());
    }


    public function show(Localidad $localidad)
    {
        return new LocalidadResource($localidad);
    }
}
