<?php

namespace App\Http\Controllers;

use App\Http\Resources\FacturaResource;
use App\Models\Factura;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return FacturaResource::collection(Factura::all());
    }

    public function FacturaByUser($id)
    {
        $factura = Factura::where('user_id', $id)->get();
        return FacturaResource::collection($factura);
    }


    public function FacturaByPedido($id)
    {
        $factura = Factura::where('pedido_id', $id)->first();
        return new FacturaResource($factura);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'pedido_id' => 'required|exists:pedidos,id',
            'num_factura' => 'required|string',
            'importe' => 'required|string',
            'factura' => 'nullable|file',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($request->hasFile('factura')) {
            $imagePath = $request->file('factura')->store('images', 'public');
            $data["factura"] = $imagePath;
        }

        $factura = Factura::create($data);

        return new FacturaResource($factura);
    }
}
