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

    /**
     * Busca una imagen correspondiente al código de producto
     * 
     * @param string $codigo Código del producto
     * @return string|null Ruta de la imagen o null si no se encuentra
     */
    private function buscarImagen($codigo)
    {
        // Verificar diferentes rutas posibles
        $posiblesRutas = [
            'images',
            'public/images',
            '/images',
            'app/public/images'
        ];

        $imagenes = [];
        $rutaUtilizada = '';

        // Intentar con diferentes rutas
        foreach ($posiblesRutas as $ruta) {
            $imgs = Storage::files($ruta);
            Log::info("Verificando ruta: " . $ruta . " - Archivos encontrados: " . count($imgs));

            if (!empty($imgs)) {
                $imagenes = $imgs;
                $rutaUtilizada = $ruta;
                break;
            }
        }

        // Si no encontramos nada, verificar disco público directamente
        if (empty($imagenes)) {
            $publicPath = public_path('storage/images');
            Log::info("Verificando ruta física: " . $publicPath);

            if (is_dir($publicPath)) {
                $files = scandir($publicPath);
                $files = array_diff($files, ['.', '..']);

                foreach ($files as $file) {
                    $imagenes[] = 'images/' . $file;
                }

                Log::info("Archivos encontrados en ruta física: " . count($imagenes));
                $rutaUtilizada = 'public/storage/images (físico)';
            }
        }

        if (empty($imagenes)) {
            Log::info("No se encontraron imágenes en ninguna ruta");
            return null;
        }

        Log::info("Ruta utilizada: " . $rutaUtilizada);
        Log::info("Buscando imagen para código: " . $codigo);
        Log::info("Total de imágenes encontradas: " . count($imagenes));

        // Buscar una imagen que coincida con el código
        foreach ($imagenes as $imagen) {
            // Obtener solo el nombre del archivo sin la ruta
            $nombreArchivo = basename($imagen);

            // Obtener la extensión del archivo
            $extension = pathinfo($nombreArchivo, PATHINFO_EXTENSION);

            // Eliminar la extensión para la comparación
            $nombreSinExtension = pathinfo($nombreArchivo, PATHINFO_FILENAME);

            Log::info("Comparando: " . $codigo . " con archivo: " . $nombreArchivo);

            // Verificar si el nombre del archivo comienza con el código
            if (preg_match('/^' . preg_quote($codigo, '/') . '\b/i', $nombreSinExtension)) {
                Log::info("Coincidencia encontrada: " . $imagen);
                // Devolver la ruta en el formato requerido
                return $imagen;
            }
        }

        Log::info("No se encontró imagen para: " . $codigo);
        return null;
    }

    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);

        // --- 1. Obtener datos de la segunda hoja como referencia ---
        $sheet2 = $spreadsheet->getSheet(1); // Obtener la segunda hoja (índice 1)
        $rowsSheet2 = $sheet2->toArray(null, true, true, true);

        $subProductoInfo = []; // Aquí almacenaremos los datos de la hoja 2

        foreach ($rowsSheet2 as $index => $row) {
            if ($index === 1) continue; // Saltar encabezado

            $codigoSubProducto = isset($row['A']) ? trim($row['A']) : null;
            $nombreProducto = isset($row['C']) ? trim($row['C']) : null;
            $medida = isset($row['D']) ? trim($row['D']) : null;
            $color = isset($row['E']) ? trim($row['E']) : null;

            if (!empty($codigoSubProducto) && !empty($nombreProducto)) {
                $subProductoInfo[$codigoSubProducto] = [
                    'producto' => $nombreProducto,
                    'medida' => $medida,
                    'color' => $color
                ];
            }
        }

        Log::info("Datos de la hoja 2 cargados correctamente: " . count($subProductoInfo));

        // --- 2. Procesar la primera hoja ---
        $sheet1 = $spreadsheet->getSheet(0); // Obtener la primera hoja (índice 0)
        $rowsSheet1 = $sheet1->toArray(null, true, true, true);

        $productosCache = []; // Cache para evitar consultas repetitivas

        foreach ($rowsSheet1 as $index => $row) {
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

                // --- Buscar información en la hoja 2 ---
                $productoNombre = isset($subProductoInfo[$codigo]) ? $subProductoInfo[$codigo]['producto'] : null;
                $medida = isset($subProductoInfo[$codigo]) ? $subProductoInfo[$codigo]['medida'] : null;
                $color = isset($subProductoInfo[$codigo]) ? $subProductoInfo[$codigo]['color'] : null;

                // Si no hay información en la hoja 2, usar la lógica anterior para el Producto
                if (!$productoNombre) {
                    $codigoBase = explode('-', $codigo)[0];
                    $productoNombre = explode('-', $descripcion)[0];
                }

                // --- Buscar o crear la Categoría ---
                $categoria = Categoria::firstOrCreate(['name' => $categoriaNombre]);

                // --- Buscar o crear la SubCategoría ---
                $subCategoria = SubCategoria::where('name', $subCategoriaNombre)
                    ->where('categoria_id', $categoria->id)
                    ->first();

                if (!$subCategoria) {
                    $subCategoria = SubCategoria::create([
                        'name' => $subCategoriaNombre,
                        'categoria_id' => $categoria->id
                    ]);
                }

                // --- Buscar o crear el Producto ---
                if (!isset($productosCache[$productoNombre])) {
                    $producto = Producto::firstOrCreate(
                        ['name' => $productoNombre],
                        ['sub_categoria_id' => $subCategoria->id]
                    );
                    $productosCache[$productoNombre] = $producto;
                } else {
                    $producto = $productosCache[$productoNombre];
                }

                // --- Buscar la imagen del producto ---
                $imagePath = $this->buscarImagen($codigo);

                // --- Buscar o crear el SubProducto ---
                SubProducto::updateOrCreate(
                    ['code' => $codigo],
                    [
                        'name' => $descripcion,
                        'producto_id' => $producto->id,
                        'min' => $minimo,
                        'bulto_cerrado' => $bultoCerrado,
                        'min_oferta' => $minimoOferta,
                        'precio_de_lista' => $precioLista,
                        'precio_de_oferta' => $precioOferta,
                        'image' => $imagePath,
                        'medida' => $medida, // Nuevo campo medida
                        'color' => $color // Nuevo campo color
                    ]
                );
            } catch (\Exception $e) {
                Log::error("Error en la hoja 1, fila {$index}: " . $e->getMessage());
                continue; // Ignorar filas con errores
            }
        }
    }
}
