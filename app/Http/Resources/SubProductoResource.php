<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubProductoResource extends JsonResource
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
            'image' => $this->image ? url("storage/{$this->image}") : null,
            'producto' => $this->productos->name,
            'productoId' => $this->productos->id,
            'categoria' => $this->productos->subCategoria->categorias->name,
            'categoriaId' => $this->productos->subCategoria->categorias->id,
            'subCategoriaId' => $this->productos->subCategoria->id,
            'subCategoria' => $this->productos->subCategoria->name,
            'min' => $this->min,
            'min_oferta' => $this->min_oferta,
            'bulto_cerrado' => $this->bulto_cerrado,
            'precio_de_lista' => $this->precio_de_lista,
            'precio_de_oferta' => $this->precio_de_oferta,
            'descuento' => $this->descuento,
            'stock' => $this->stock,
            'color' => $this->color,
            'medida' => $this->medida,
        ];
    }
}
