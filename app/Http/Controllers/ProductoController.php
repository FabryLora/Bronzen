<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductoResource;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProductoResource::collection(Producto::all());
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'sometimes|string',
            'name' => 'sometimes|string',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'featured' => 'sometimes|boolean',
            'sub_categoria_id' => 'nullable|exists:sub_categorias,id',
        ]);

        $imagePath = $request->file('image')->store('images', 'public');
        $data["image"] = $imagePath;

        $producto = Producto::create($data);

        return new ProductoResource($producto);
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'featured' => 'sometimes|boolean',
            'code' => 'sometimes|string',
            'name' => 'sometmies|string',
            'image' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'sub_categoria_id' => 'nullable|exists:sub_categorias,id',
        ]);

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($producto->image) {
                $absolutePath = public_path('storage/' . $producto->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        $producto->update($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);

        if ($producto->image) {
            $absolutePath = public_path('storage/' . $producto->image);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $producto->delete();
    }
}
