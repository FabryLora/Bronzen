<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
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
            'code' => $this->code,
            'orden' => $this->orden,
            'name' => $this->name,
            'featured' => $this->featured,
            'image' => $this->image ? url("storage/{$this->image}") : null,
            'plano' => $this->plano ? url("storage/{$this->plano}") : null,
            'subCategoria' => $this->subCategoria->name,
            'categoria' => $this->subCategoria->categorias->name,
            'subProductos' => SubProductoResource::collection($this->whenLoaded("subProductos")),
        ];
    }
}
