<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use App\Models\SubProducto;

class CargarImagenesSubProductos extends Command
{
    protected $signature = 'subproductos:cargar-imagenes';
    protected $description = 'Carga las imágenes a los subproductos desde la carpeta /storage/app/public/images';

    public function handle()
    {
        $fotos = Storage::disk('public')->files('images');
        $contador = 0;

        foreach ($fotos as $foto) {
            $filename = pathinfo(basename($foto), PATHINFO_FILENAME);
            $code = explode(' ', $filename)[0];

            $subproducto = SubProducto::where('code', $code)->first();
            if (!$subproducto) {
                continue;
            }

            $subproducto->image = $foto;
            $subproducto->save();
            $contador++;
        }

        $this->info("Se actualizaron {$contador} subproductos con imágenes.");
    }
}
