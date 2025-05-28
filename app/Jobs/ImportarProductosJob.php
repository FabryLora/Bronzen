<?php

namespace App\Jobs;

use App\Models\Categoria;
use App\Models\SubCategoria;
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
        // Si el precio es numérico (como el valor 11188.2076988439)
        if (is_numeric($precio)) {
            // Redondear a 2 decimales y devolver directamente
            return round((float)$precio, 2);
        }

        // Si no es numérico, es probable que sea una cadena con formato (como "$ 11.188,21")
        // Elimina cualquier carácter que no sea número, punto o coma
        $precio = preg_replace('/[^0-9.,]/', '', $precio);

        // Determinar si usa formato europeo (11.188,21) o americano (11,188.21)
        $tieneComaPuntoDecimal = preg_match('/^\d{1,3}(.\d{3})+(,\d+)$/', $precio);

        if ($tieneComaPuntoDecimal) {
            // Formato europeo: 11.188,21
            // Quita el punto de los miles
            $precio = str_replace('.', '', $precio);
            // Reemplaza la coma decimal por punto
            $precio = str_replace(',', '.', $precio);
        } else {
            // Formato americano: 11,188.21
            // Quita la coma de los miles
            $precio = str_replace(',', '', $precio);
        }

        // Verifica si es numérico y lo castea a float
        return is_numeric($precio) ? round((float)$precio, 2) : null;
    }

    public function handle()
    {
        try {
            $filePath = Storage::path($this->archivoPath);
            $spreadsheet = IOFactory::load($filePath);

            // Obtener la primera hoja del Excel
            $sheet = $spreadsheet->getSheet(0);
            $rows = $sheet->toArray(null, true, true, true);



            // Iterar sobre cada fila del Excel
            foreach ($rows as $index => $row) {
                // Saltar la fila de encabezados
                if ($index === 1) continue;

                // Extraer datos de la fila
                $codigo = isset($row[0]) ? trim($row[0]) : null;
                $minimo = isset($row[4]) ? (int) $row[4] : null;
                $bultocerrado = isset($row[5]) ? (int) $row[5] : null;
                $precioLista = isset($row[6]) ? $this->convertirPrecio($row[6]) : null;
                $precioOferta = isset($row[8]) ? $this->convertirPrecio($row[8]) : null;
                $minimoOferta = isset($row[9]) ? (int) $row[9] : null;


                $subproducto = SubProducto::where('codigo', $codigo)->first();


                if ($subproducto) {
                    $subproducto->update(
                        [
                            'min' => $minimo,
                            'bulto_cerrado' => $bultocerrado,
                            'precio_de_lista' => $precioLista,
                            'precio_de_oferta' => $precioOferta,
                            'min_oferta' => $minimoOferta,
                        ]
                    );
                }
            }

            // Loguear estadísticas finales

        } catch (\Exception $e) {

            throw $e; // Re-lanzar la excepción para que el sistema de colas maneje el error
        }
    }
}
