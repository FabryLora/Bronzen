<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'cuit' => $this->cuit,
            'direccion' => $this->direccion,
            'provincia' => $this->provincia,
            'localidad' => $this->localidad,
            'descuento_general' => $this->descuento_general,
            'descuento_adicional' => $this->descuento_adicional,
            'descuento_adicional_2' => $this->descuento_adicional_2,
            'tipo' => $this->tipo,
            'autorizado' => $this->autorizado,
            'vendedor' => new UserResource($this->whenLoaded('vendedor')),
            'vendedor_id' => $this->vendedor_id,
            'clientes' => UserResource::collection($this->whenLoaded('clientes')),
        ];
    }
}
