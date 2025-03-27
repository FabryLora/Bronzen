<?php

namespace App\Http\Controllers;

use App\Http\Resources\CatalogoResource;
use App\Models\Catalogo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class CatalogoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CatalogoResource::collection(Catalogo::all());
    }


    /**
     * Display the specified resource.
     */
    public function show(Catalogo $catalogo)
    {
        return new CatalogoResource($catalogo);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'file' => 'sometimes|file',
            'image' => 'sometimes|file',
        ]);

        $catalogo = Catalogo::findOrFail($id);

        if ($request->hasFile('file')) {
            // Eliminar el archivo existente del sistema de archivos
            if ($catalogo->file) {
                $absolutePath = public_path('storage/' . $catalogo->file);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar el nuevo archivo
            $filePath = $request->file('file')->store('files', 'public');
            $data["file"] = $filePath;
        }

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($catalogo->image) {
                $absolutePath = public_path('storage/' . $catalogo->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        $catalogo->update($data);
    }

    public function downloadFile($filename)
    {
        $path = storage_path("app/public/files/" . $filename); // Ruta correcta

        if (file_exists($path)) {
            return response()->download($path);
        }

        return response()->json(['message' => 'Archivo no encontrado'], 404);
    }
}
