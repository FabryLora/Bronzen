<?php

namespace App\Http\Controllers;

use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PedidoController extends Controller
{
    public function index()
    {
        return PedidoResource::collection(Pedido::with('productos')->get());
    }

    public function store(Request $request)
    {

        $data = $request->validate([
            'user_id' => 'nullable | exists:users,id',
            'tipo_entrega' => 'nullable | string',
            'mensaje' => 'sometimes | string',
            'archivo' => 'sometimes | file',
            'descuento' => 'nullable | numeric',
            'subtotal' => 'nullable | numeric',
            'iva' => 'nullable | numeric',
            'total' => 'nullable | numeric',
            'entregado' => 'nullable | boolean',
        ]);

        // Guardar la nueva imagen
        if ($request->hasFile('archivo')) {
            $archivoPath = $request->file('archivo')->store('files', 'public');
            $data["archivo"] = $archivoPath;
        }

        $pedido = Pedido::create($data);


        return new PedidoResource($pedido);
    }

    public function show(Pedido $pedido)
    {
        return new PedidoResource($pedido->load('productos'));
    }

    public function showByUserId($id)
    {
        return PedidoResource::collection(Pedido::where('user_id', $id)->with('productos')->get());
    }

    public function update(Request $request, Pedido $pedido)
    {
        $data = $request->validate([
            'user_id' => 'nullable | exists:users,id',
            'tipo_entrega' => 'nullable | string',
            'mensaje' => 'sometimes | string',
            'archivo' => 'sometimes | file',
            'subtotal' => 'nullable | numeric',
            'descuento' => 'nullable | numeric',
            'iva' => 'nullable | numeric',
            'total' => 'nullable | numeric',
            'entregado' => 'nullable | boolean',
        ]);

        // Guardar la nueva imagen
        if ($request->hasFile('archivo')) {
            // Eliminar la imagen existente del sistema de archivos
            if ($pedido->archivo) {
                $absolutePath = public_path('storage/' . $pedido->image);
                if (File::exists($absolutePath)) {
                    File::delete($absolutePath);
                }
            }

            // Guardar la nueva imagen
            $archivoPath = $request->file('archivo')->store('files', 'public');
            $data["archivo"] = $archivoPath;
        }

        $pedido->update($data);

        return new PedidoResource($pedido);
    }

    public function destroy(Pedido $pedido)
    {
        $pedido->delete();
        return response()->json(['message' => 'Pedido eliminado']);
    }
}
