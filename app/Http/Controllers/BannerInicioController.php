<?php

namespace App\Http\Controllers;

use App\Http\Resources\bannerInicioResource;
use App\Models\bannerInicio;
use Illuminate\Http\Request;

class BannerInicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return bannerInicioResource::collection(bannerInicio::all());
    }


    /**
     * Display the specified resource.
     */
    public function show(bannerInicio $bannerInicio)
    {
        return new bannerInicioResource($bannerInicio);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'imagen' => 'sometimes|file',
            'titulo' => 'sometimes|string',
            'subtitulo' => 'sometimes|string',
            'video' => 'sometimes|string',
        ]);

        if ($request->hasFile('imagen')) {
            $imagePath = $request->file('imagen')->store('images', 'public');
            $data['imagen'] = $imagePath;
        }

        $bannerInicio = bannerInicio::find($id);
        $bannerInicio->update($data);

        return new bannerInicioResource($bannerInicio);
    }
}
