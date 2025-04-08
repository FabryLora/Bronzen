<?php

namespace App\Jobs;

use App\Models\SubProducto;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ImportarProductosJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $archivoPath;

    public function __construct($archivoPath)
    {
        $this->archivoPath = $archivoPath;
    }

    private function convertirPrecio($precio)
    {
        // Elimina cualquier carácter que no sea número, punto o coma
        $precio = preg_replace('/[^0-9.,]/', '', $precio);

        // Quita el punto de los miles
        $precio = str_replace('.', '', $precio);

        // Reemplaza la coma decimal por punto
        $precio = str_replace(',', '.', $precio);

        // Verifica si es numérico y lo castea a float
        return is_numeric($precio) ? (float)$precio : null;
    }

    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);

        $sheet1 = $spreadsheet->getSheet(0);
        $rowsSheet1 = $sheet1->toArray(null, true, true, true);

        foreach ($rowsSheet1 as $index => $row) {
            if ($index === 1) continue; // Saltar encabezado

            try {
                $codigo = isset($row['A']) ? trim($row['A']) : null;
                $rawPrecioLista = $row['G'] ?? null;
                $rawPrecioOferta = $row['I'] ?? null;

                $precioLista = $this->convertirPrecio($rawPrecioLista);
                $precioOferta = $this->convertirPrecio($rawPrecioOferta);

                if (empty($codigo)) continue;

                $subProducto = SubProducto::where('code', $codigo)->first();

                if ($subProducto) {
                    $cambio = false;
                    $logCambios = [];

                    if (!is_null($rawPrecioLista) && is_null($precioLista)) {
                        Log::warning("Precio de lista inválido en fila {$index}, código {$codigo}: {$rawPrecioLista}");
                    }

                    if (!is_null($rawPrecioOferta) && is_null($precioOferta)) {
                        Log::warning("Precio de oferta inválido en fila {$index}, código {$codigo}: {$rawPrecioOferta}");
                    }

                    if (!is_null($precioLista) && abs($subProducto->precio_de_lista - $precioLista) > 0.01) {
                        $logCambios[] = "precio_de_lista: {$subProducto->precio_de_lista} → {$precioLista}";
                        $subProducto->precio_de_lista = $precioLista;
                        $cambio = true;
                    }

                    if (!is_null($precioOferta) && abs($subProducto->precio_de_oferta - $precioOferta) > 0.01) {
                        $logCambios[] = "precio_de_oferta: {$subProducto->precio_de_oferta} → {$precioOferta}";
                        $subProducto->precio_de_oferta = $precioOferta;
                        $cambio = true;
                    }

                    if ($cambio) {
                        $subProducto->save();
                        Log::info("Actualizado SubProducto [{$codigo}]: " . implode(' | ', $logCambios));
                    }
                } else {
                    SubProducto::create([
                        'code' => $codigo,
                        'precio_de_lista' => $precioLista,
                        'precio_de_oferta' => $precioOferta,
                    ]);

                    Log::info("Creado nuevo SubProducto [{$codigo}] con precios - Lista: {$precioLista}, Oferta: {$precioOferta}");
                }
            } catch (\Exception $e) {
                Log::error("Error en la hoja 1, fila {$index}: " . $e->getMessage());
                continue;
            }
        }
    }
}
