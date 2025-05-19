<?php

namespace App\Http\Controllers;

use App\Jobs\AssignImagesToSubProductos;
use Illuminate\Http\Request;

class SubProductoImageController extends Controller
{
    public function dispatchAssignImagesJob()
    {
        // Despachar el job
        AssignImagesToSubProductos::dispatch();

        return response()->json([
            'success' => true,
            'message' => 'El proceso de asignación de imágenes se ha puesto en cola'
        ]);
    }
}
