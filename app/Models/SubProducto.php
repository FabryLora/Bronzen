<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubProducto extends Model
{
    protected $guarded = [];

    public function productos()
    {
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
