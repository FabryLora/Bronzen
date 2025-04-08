<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProvinciaResource;
use App\Models\Provincia;
use Illuminate\Http\Request;

class ProvinciaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProvinciaResource::collection(Provincia::with("localidades")->get());
    }


    /**
     * Display the specified resource.
     */
    public function show(Provincia $provincia)
    {
        $provincia->load("localidades");
        return new ProvinciaResource($provincia);
    }
}
