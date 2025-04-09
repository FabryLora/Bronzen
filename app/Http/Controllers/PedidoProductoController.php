<?php

namespace App\Http\Controllers;

use App\Http\Resources\PedidoProductoResource;
use App\Models\PedidoProducto;
use Illuminate\Http\Request;

class PedidoProductoController extends Controller
{
    public function index()
    {
        return PedidoProductoResource::collection(PedidoProducto::with('producto')->get());
    }

    public function store(Request $request)
    {
        $pedidoProducto = PedidoProducto::create($request->only(['pedido_id', 'subproducto_id', 'cantidad', 'subtotal_prod']));
        return new PedidoProductoResource($pedidoProducto);
    }

    public function show(PedidoProducto $pedidoProducto)
    {
        return new PedidoProductoResource($pedidoProducto->load('producto'));
    }

    public function update(Request $request, PedidoProducto $pedidoProducto)
    {
        $pedidoProducto->update($request->only(['cantidad', 'subtotal_prod']));
        return new PedidoProductoResource($pedidoProducto);
    }

    public function destroy(PedidoProducto $pedidoProducto)
    {
        $pedidoProducto->delete();
        return response()->json(['message' => 'Relación eliminada']);
    }
}
