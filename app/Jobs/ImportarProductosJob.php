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

            // Contador para estadísticas
            $contadorActualizados = 0;
            $contadorNoEncontrados = 0;

            // Iterar sobre cada fila del Excel
            foreach ($rows as $index => $row) {
                // Saltar la fila de encabezados
                if ($index === 1) continue;

                // Extraer datos de la fila
                $codigo = isset($row['A']) ? trim($row['A']) : null;
                $minimo = isset($row['E']) ? (int) $row['E'] : null;
                $precioLista = isset($row['G']) ? $this->convertirPrecio($row['G']) : null;
                $precioOferta = isset($row['I']) ? $this->convertirPrecio($row['I']) : null;
                $minimoOferta = isset($row['J']) ? (int) $row['J'] : null;

                // Validar que tengamos al menos el código y algún otro dato
                if (empty($codigo) || (!$minimo && !$precioLista && !$precioOferta && !$minimoOferta)) {
                    continue;
                }

                // Buscar el SubProducto por su código
                $subProducto = SubProducto::where('code', $codigo)->first();

                if ($subProducto) {
                    // Preparar los datos para actualizar
                    $datos = [];

                    if (!is_null($minimo)) $datos['min'] = $minimo;
                    if (!is_null($minimoOferta)) $datos['min_oferta'] = $minimoOferta;
                    if (!is_null($precioLista)) $datos['precio_de_lista'] = $precioLista;
                    if (!is_null($precioOferta)) $datos['precio_de_oferta'] = $precioOferta;

                    // Actualizar solo si hay datos para actualizar
                    if (!empty($datos)) {
                        $subProducto->update($datos);
                        $contadorActualizados++;

                        // Loguear información del producto actualizado
                        Log::info("SubProducto actualizado: {$codigo} - Precio Lista: {$precioLista} - Precio Oferta: {$precioOferta}");
                    }
                } else {
                    $contadorNoEncontrados++;
                    Log::warning("SubProducto no encontrado con código: {$codigo}");
                }
            }

            // Loguear estadísticas finales
            Log::info("Actualización de precios finalizada: {$contadorActualizados} productos actualizados, {$contadorNoEncontrados} no encontrados");
        } catch (\Exception $e) {
            Log::error("Error en ActualizarPreciosSubProductosJob: " . $e->getMessage());
            throw $e; // Re-lanzar la excepción para que el sistema de colas maneje el error
        }
    }
}
