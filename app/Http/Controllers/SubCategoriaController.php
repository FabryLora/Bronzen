<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubCategoriaResource;
use App\Models\SubCategoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class SubCategoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $subCategorias = SubCategoria::with('categorias')->get();
        return SubCategoriaResource::collection($subCategorias);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        $imagePath = $request->file('image')->store('images', 'public');
        $data["image"] = $imagePath;

        $subCategoria = SubCategoria::create($data);

        return new SubCategoriaResource($subCategoria);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $subCategoria = SubCategoria::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'categoria_id' => 'nullable|exists:categorias,id',
        ]);

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($subCategoria->image) {
                $absolutePath = public_path('storage/' . $subCategoria->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        $subCategoria->update($data);

        return new SubCategoriaResource($subCategoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subCategoria = SubCategoria::findOrFail($id);

        if ($subCategoria->image) {
            $absolutePath = public_path('storage/' . $subCategoria->image);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $subCategoria->delete();

        return response()->noContent();
    }
}
