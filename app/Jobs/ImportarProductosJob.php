<?php

namespace App\Jobs;

use App\Models\Categoria;
use App\Models\SubCategoria;
use App\Models\SubProducto;
use App\Models\User;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;


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
                $nombre = isset($row[0]) ? trim($row[0]) : null;
                $cuit = isset($row[1]) ? (int) $row[1] : null;
                $domicilio = isset($row[2]) ? (int) $row[2] : null;
                $localidad = isset($row[3]) || null;
                $provincia = isset($row[4]) || null;
                $telefono = isset($row[5]) || null;
                $descuento_uno = isset($row[6]) || null;
                $descuento_dos = isset($row[7]) || null;
                $email = isset($row[9]) || null;


                User::updateOrCreate(
                    ['cuit' => $cuit],
                    [
                        'name' => $nombre,
                        'direccion' => $domicilio,
                        'localidad' => $localidad,
                        'provincia' => $provincia,
                        'telefono' => $telefono,
                        'descuento_adicional' => $descuento_uno,
                        'descuento_adicional_2' => $descuento_dos,
                        'email' => $email,
                        'tipo' => 'cliente',
                        'autorizado' => true,
                        'password' => Hash::make($cuit),
                    ]
                );
            }

            // Loguear estadísticas finales

        } catch (\Exception $e) {

            throw $e; // Re-lanzar la excepción para que el sistema de colas maneje el error
        }
    }
}
