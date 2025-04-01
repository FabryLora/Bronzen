<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "mail" => $this->mail,
            "phone" => $this->phone,
            "second_phone" => $this->second_phone,
            "wp" => $this->wp,
            "fb" => $this->fb,

        ];
    }
}
