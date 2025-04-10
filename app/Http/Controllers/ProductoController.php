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

    public function FeaturedProductos()
    {
        // Cargar explícitamente la relación subProductos
        $productos = Producto::where('featured', true)->with('subProductos')->get();
        return ProductoResource::collection($productos);
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
            'plano' => 'sometimes|file',
            'orden' => 'sometimes|string',
            'featured' => 'sometimes|boolean',
            'sub_categoria_id' => 'nullable|exists:sub_categorias,id',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        if ($request->hasFile('plano')) {
            $imagePath = $request->file('plano')->store('images', 'public');
            $data["plano"] = $imagePath;
        }





        $producto = Producto::create($data);

        return new ProductoResource($producto);
    }

    public function ProductoporSubCategoriaId($id)
    {
        $productos = Producto::where('sub_categoria_id', $id)->get();
        return ProductoResource::collection($productos);
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
            'name' => 'sometimes|string',
            'image' => 'sometimes|file',
            'plano' => 'sometimes|file',
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

        if ($request->hasFile('plano')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($producto->plano) {
                $absolutePath = public_path('storage/' . $producto->plano);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('plano')->store('images', 'public');
            $data["plano"] = $imagePath;
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

        if ($producto->plano) {
            $absolutePath = public_path('storage/' . $producto->plano);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $producto->delete();
    }
}
