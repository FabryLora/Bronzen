<?php

namespace App\Http\Controllers;

use App\Http\Resources\InformacionResource;
use App\Models\Informacion;
use Illuminate\Console\View\Components\Info;
use Illuminate\Http\Request;

class InformacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new InformacionResource(Informacion::first());
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'informacion' => 'sometimes',
            'descuento_reparto' => 'sometimes|integer',
            'descuento_general' => 'sometimes|integer',
        ]);

        $informacion = Informacion::findOrFail($id);

        $informacion->update($data);
    }
}
