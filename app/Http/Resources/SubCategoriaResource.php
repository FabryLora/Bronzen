<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubCategoriaResource extends JsonResource
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
            'name' => $this->name,
            'orden' => $this->orden,
            'image' => $this->image ? url("storage/{$this->image}") : null,
            'categoriaName' => $this->categorias?->name,
            'categoriaId' => $this->categorias?->id,
        ];
    }
}
