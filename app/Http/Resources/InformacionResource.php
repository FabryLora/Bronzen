<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InformacionResource extends JsonResource
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
            'informacion' => $this->informacion,
            'descuento_reparto' => $this->descuento_reparto,
            'descuento_general' => $this->descuento_general,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
