<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'tipo_entrega' => $this->tipo_entrega,
            'mensaje' => $this->mensaje,
            'archivo_url' => $this->archivo ? url("storage/" . $this->archivo) : null,
            'subtotal' => $this->subtotal,
            'descuento' => $this->descuento,
            'iva' => $this->iva,
            'total' => $this->total,
            'entregado' => $this->entregado,
            'facturaId' => $this->factura ? $this->factura->id : null,
            'productos' => PedidoProductoResource::collection(resource: $this->productos),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
