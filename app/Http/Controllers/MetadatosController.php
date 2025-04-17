<?php

namespace App\Http\Controllers;

use App\Http\Resources\MetadatosResource;
use App\Models\Metadatos;
use Illuminate\Http\Request;

class MetadatosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return MetadatosResource::collection(Metadatos::all());
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'seccion' => 'required',
            'description' => 'required',
            'keywords' => 'required',
        ]);

        $metadatos = Metadatos::create($data);

        return new MetadatosResource($metadatos);
    }

    /**
     * Display the specified resource.
     */
    public function show(Metadatos $metadatos)
    {
        return new MetadatosResource($metadatos);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $metadatos = Metadatos::findOrFail($id);

        $data = $request->validate([
            'seccion' => 'required',
            'descripcion' => 'sometimes',
            'keywords' => 'sometimes',
        ]);

        $metadatos->update($data);

        return response()->json($metadatos);
    }
}
