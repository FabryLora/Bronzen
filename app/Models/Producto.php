<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $guarded = [];

    public function subCategoria()
    {
        return $this->belongsTo(SubCategoria::class);
    }

    public function subProductos()
    {
        return $this->hasMany(SubProducto::class);
    }
}
