<?php

namespace App\Http\Controllers;

use App\Http\Resources\LogosResource;
use App\Models\Logos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class LogosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return LogosResource::collection(Logos::all());
    }


    /**
     * Display the specified resource.
     */
    public function show(Logos $logos)
    {
        return new LogosResource($logos);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $logos = Logos::find($id);

        $data = $request->validate([
            "principal" => "file|mimes:jpg,jpeg,png,gif|sometimes",
            "secundario" => "file|mimes:jpg,jpeg,png,gif|sometimes",
        ]);

        if ($request->hasFile('principal')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($logos->principal) {
                $absolutePath = public_path('storage/' . $logos->principal);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('principal')->store('images', 'public');
            $data["principal"] = $imagePath;
        }

        if ($request->hasFile('secundario')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($logos->secundario) {
                $absolutePath = public_path('storage/' . $logos->secundario);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('secundario')->store('images', 'public');
            $data["secundario"] = $imagePath;
        }

        $logos->update($data);
        return response()->json($logos);
    }
}
