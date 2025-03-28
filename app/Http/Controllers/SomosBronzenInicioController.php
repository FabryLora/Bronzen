<?php

namespace App\Http\Controllers;

use App\Http\Resources\SomosBronzenInicioResource;
use App\Models\SomosBronzenInicio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class SomosBronzenInicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new SomosBronzenInicioResource(SomosBronzenInicio::first());
    }


    /**
     * Display the specified resource.
     */
    public function show(SomosBronzenInicio $somosBronzenInicio)
    {
        return new SomosBronzenInicioResource($somosBronzenInicio);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'text' => 'required|string',
            'image' => 'sometimes|file',
        ]);

        $somosBronzenInicio = SomosBronzenInicio::findOrFail($id);

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($somosBronzenInicio->image) {
                $absolutePath = public_path('storage/' . $somosBronzenInicio->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }



        $somosBronzenInicio->update($data);
    }
}
