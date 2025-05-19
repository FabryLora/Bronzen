<?php

namespace App\Jobs;

use App\Models\SubProducto;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AssignImagesToSubProductos implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número de veces que el trabajo puede intentar ejecutarse.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Timeout del trabajo en segundos.
     *
     * @var int
     */
    public $timeout = 120;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            // Obtener todos los archivos en la carpeta storage/images
            $files = Storage::disk('public')->files('images');

            // Obtener todos los subproductos
            $subProductos = SubProducto::all();

            $updatedCount = 0;

            foreach ($subProductos as $subProducto) {
                foreach ($files as $file) {
                    // Obtener solo el nombre del archivo sin la ruta
                    $fileName = basename($file);

                    // Separar el nombre del archivo por el punto para obtener el código
                    $parts = explode('.', $fileName);
                    $imageCode = $parts[0];

                    // Verificar si el código del subproducto coincide con el código de la imagen
                    if ($imageCode === $subProducto->code) {
                        // Guardar la ruta de la imagen en el campo 'image' del subproducto
                        $subProducto->image =  $file;
                        $subProducto->save();

                        $updatedCount++;
                        break; // Romper el ciclo una vez que se encuentra una coincidencia
                    }
                }
            }

            Log::info("AssignImagesToSubProductos job: Se han asignado imágenes a {$updatedCount} subproductos");
        } catch (\Exception $e) {
            Log::error("Error en AssignImagesToSubProductos job: " . $e->getMessage());
            throw $e; // Re-lanzar la excepción para que el job falle y pueda reintentar si es necesario
        }
    }
}
