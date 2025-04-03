<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubProductoResource;
use App\Models\SubProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class SubProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SubProductoResource::collection(SubProducto::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
            'orden' => 'sometimes|string',
            'image' => 'sometimes|file',
            'min' => 'required|numeric',
            'min_oferta' => 'nullable|numeric',
            'bulto_cerrado' => 'required|numeric',
            'precio_de_lista' => 'required|numeric',
            'precio_de_oferta' => 'nullable|numeric',
            'producto_id' => 'nullable|exists:productos,id',
            'color' => 'nullable|string',
            'medida' => 'nullable|string',
        ]);

        $imagePath = $request->file('image')->store('images', 'public');
        $data["image"] = $imagePath;

        $subProducto = SubProducto::create($data);

        return new SubProductoResource($subProducto);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {

        $subProducto = SubProducto::findOrFail($id);

        $data = $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
            'orden' => 'sometimes|string',
            'image' => 'sometimes|file',
            'min' => 'required|numeric',
            'min_oferta' => 'nullable|numeric',
            'bulto_cerrado' => 'required|numeric',
            'precio_de_lista' => 'required|numeric',
            'precio_de_oferta' => 'nullable|numeric',
            'producto_id' => 'nullable|exists:productos,id',
            'color' => 'nullable|string',
            'medida' => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($subProducto->image) {
                $absolutePath = public_path('storage/' . $subProducto->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $imagePath = $request->file('image')->store('images', 'public');
            $data["image"] = $imagePath;
        }

        $subProducto->update($data);

        return new SubProductoResource($subProducto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $subProducto = SubProducto::findOrFail($id);

        if ($subProducto->image) {
            $absolutePath = public_path('storage/' . $subProducto->image);
            if (File::exists($absolutePath)) {
                File::delete($absolutePath);
            }
        }

        $subProducto->delete();
    }
}
