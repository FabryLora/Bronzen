<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'pedidoId' => $this->pedido ? $this->pedido->id : null,
            'num_factura' => $this->num_factura,
            'importe' => $this->importe,
            'factura' => $this->factura ? url("storage/" . $this->factura) : null,
            'created_at' => date('Y-m-d', strtotime($this->created_at)),
        ];
    }
}
