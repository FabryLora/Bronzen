<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class CategoriaController extends Controller
{

    public function index()
    {
        return CategoriaResource::collection(Categoria::orderBy('orden', 'asc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'sometimes',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'show_text' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }


        $categoria = Categoria::create($data);

        return new CategoriaResource($categoria);
    }



    public function update(Request $request, $id)
    {

        $categoria = Categoria::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'show_text' => 'sometimes|boolean',
        ]);

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($categoria->image) {
                $absolutePath = public_path('storage/' . $categoria->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        $categoria->update($data);

        return new CategoriaResource($categoria);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);

        if ($categoria->image) {
            $absolutePath = public_path('storage/' . $categoria->image);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $categoria->delete();

        return response()->noContent();
    }
}
