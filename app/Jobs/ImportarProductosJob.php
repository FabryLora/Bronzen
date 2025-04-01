<?php

namespace App\Jobs;

use App\Models\Categoria;
use App\Models\SubCategoria;
use App\Models\Producto;
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
        $precio = str_replace(['$', ' '], '', $precio);
        $precio = str_replace('.', '', $precio); // Quita separador de miles
        $precio = str_replace(',', '.', $precio); // Reemplaza coma decimal por punto

        return is_numeric($precio) ? (float)$precio : null;
    }




    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray(null, true, true, true);

        $productosCache = []; // Cache para evitar consultas repetitivas

        foreach ($rows as $index => $row) {
            if ($index === 1) continue; // Saltar encabezado

            try {
                $codigo = isset($row['A']) ? trim($row['A']) : null;
                $descripcion = isset($row['B']) ? trim($row['B']) : null;
                $categoriaNombre = isset($row['C']) ? trim($row['C']) : null;
                $subCategoriaNombre = isset($row['D']) ? trim($row['D']) : null;
                $precioLista = isset($row['G']) ? $this->convertirPrecio($row['G']) : null;
                $precioOferta = isset($row['I']) ? $this->convertirPrecio($row['I']) : null;
                $minimo = isset($row['E']) ? (int) $row['E'] : null;
                $bultoCerrado = isset($row['F']) ? (int) $row['F'] : null;
                $minimoOferta = isset($row['J']) ? (int) $row['J'] : null;

                if (empty($codigo) || empty($descripcion)) {
                    continue; // Ignorar filas sin código o descripción
                }

                // Extraer código base y variante
                $codigoBase = explode('-', $codigo)[0]; // Extrae la parte antes del primer "-"
                $variante = str_replace($codigoBase . '-', '', $codigo); // Resto como variante

                // Extraer nombre base del producto
                $nombreBase = explode('-', $descripcion)[0]; // Antes del primer "-"
                $nombreSubProducto = str_replace($nombreBase . ' - ', '', $descripcion);

                // Buscar o crear la Categoría
                $categoria = Categoria::firstOrCreate(['name' => $categoriaNombre]);

                // Buscar o crear la SubCategoría
                $subCategoria = SubCategoria::where('name', $subCategoriaNombre)
                    ->where('categoria_id', $categoria->id)
                    ->first();

                if (!$subCategoria) {
                    $subCategoria = SubCategoria::create([
                        'name' => $subCategoriaNombre,
                        'categoria_id' => $categoria->id
                    ]);
                }

                // Buscar o crear el Producto
                if (!isset($productosCache[$codigoBase])) {
                    $producto = Producto::firstOrCreate(
                        ['code' => $codigoBase],
                        ['name' => $nombreBase, 'sub_categoria_id' => $subCategoria->id]
                    );
                    $productosCache[$codigoBase] = $producto;
                } else {
                    $producto = $productosCache[$codigoBase];
                }

                // Buscar o crear el SubProducto
                SubProducto::updateOrCreate(
                    ['code' => $codigo],
                    [
                        'name' => $nombreSubProducto,
                        'producto_id' => $producto->id,
                        'min' => $minimo,
                        'bulto_cerrado' => $bultoCerrado,
                        'min_oferta' => $minimoOferta,
                        'precio_de_lista' => $precioLista,
                        'precio_de_oferta' => $precioOferta
                    ]
                );
            } catch (\Exception $e) {
                Log::error("Error en la fila {$index}: " . $e->getMessage());
                continue; // Ignorar filas con errores
            }
        }
    }
}
