<?php

namespace App\Http\Controllers;

use App\Http\Resources\VendedorResource;
use App\Models\Vendedor;
use Illuminate\Http\Request;

class VendedorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return VendedorResource::collection(
            Vendedor::all()
        );
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $vendedor = Vendedor::create($data);
        return new VendedorResource($vendedor);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([

            'name' => 'nullable|string|max:255',
        ]);

        $vendedor = Vendedor::findOrFail($id);
        $vendedor->update($data);

        return new VendedorResource($vendedor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $vendedor = Vendedor::findOrFail($id);
        $vendedor->delete();

        return response()->json(['message' => 'Vendedor deleted successfully'], 204);
    }
}
