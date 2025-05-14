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
use Illuminate\Support\Facades\Cache;

class ImportarProductosJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $archivoPath;
    protected $imageCache = [];
    protected $imageDirectoryChecked = false;
    protected $imagePath = null;

    /**
     * Create a new job instance.
     *
     * @param string $archivoPath
     * @return void
     */
    public function __construct($archivoPath)
    {
        $this->archivoPath = $archivoPath;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $filePath = Storage::path($this->archivoPath);
        $spreadsheet = IOFactory::load($filePath);

        // Cargar datos de la segunda hoja (subproductos)
        $subProductoInfo = $this->cargarDatosSubProductos($spreadsheet->getSheet(1));

        // Procesar la primera hoja (productos principales)
        $this->procesarProductos($spreadsheet->getSheet(0), $subProductoInfo);
    }

    /**
     * Carga los datos de la hoja de subproductos
     * 
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @return array
     */
    private function cargarDatosSubProductos($sheet)
    {
        $rows = $sheet->toArray(null, true, true, true);
        $subProductoInfo = [];

        foreach ($rows as $index => $row) {
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

        Log::info("Datos de la hoja 2 cargados: " . count($subProductoInfo) . " registros");
        return $subProductoInfo;
    }

    /**
     * Procesa los productos de la hoja principal
     * 
     * @param \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet
     * @param array $subProductoInfo
     * @return void
     */
    private function procesarProductos($sheet, $subProductoInfo)
    {
        $rows = $sheet->toArray(null, true, true, true);
        $productosCache = [];
        $categoriasCache = [];
        $subCategoriasCache = [];
        $totalProcesados = 0;
        $totalErrores = 0;

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

                // Obtener información desde la hoja de subproductos
                $productoNombre = null;
                $medida = null;
                $color = null;

                if (isset($subProductoInfo[$codigo])) {
                    $productoNombre = $subProductoInfo[$codigo]['producto'];
                    $medida = $subProductoInfo[$codigo]['medida'];
                    $color = $subProductoInfo[$codigo]['color'];
                } else {
                    // Fallback si no hay info en la hoja 2
                    $codigoBase = explode('-', $codigo)[0];
                    $productoNombre = explode('-', $descripcion)[0];
                }

                // Obtener categoría usando caché local
                if (!isset($categoriasCache[$categoriaNombre])) {
                    $categoriasCache[$categoriaNombre] = Categoria::firstOrCreate(['name' => $categoriaNombre]);
                }
                $categoria = $categoriasCache[$categoriaNombre];

                // Obtener subcategoría usando caché local
                $cacheKey = $categoriaNombre . '|' . $subCategoriaNombre;
                if (!isset($subCategoriasCache[$cacheKey])) {
                    $subCategoriasCache[$cacheKey] = SubCategoria::firstOrCreate(
                        ['name' => $subCategoriaNombre, 'categoria_id' => $categoria->id]
                    );
                }
                $subCategoria = $subCategoriasCache[$cacheKey];

                // Obtener producto usando caché local
                if (!isset($productosCache[$productoNombre])) {
                    $productosCache[$productoNombre] = Producto::firstOrCreate(
                        ['name' => $productoNombre],
                        ['sub_categoria_id' => $subCategoria->id]
                    );
                }
                $producto = $productosCache[$productoNombre];

                // Buscar imagen solo si es necesario
                $imagePath = $this->encontrarImagenParaProducto($codigo);

                // Actualizar o crear subproducto
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
                        'medida' => $medida,
                        'color' => $color
                    ]
                );

                $totalProcesados++;
            } catch (\Exception $e) {
                Log::error("Error en la fila {$index}: " . $e->getMessage());
                $totalErrores++;
            }
        }

        Log::info("Proceso completado. Total procesados: {$totalProcesados}. Errores: {$totalErrores}");
    }

    /**
     * Convierte un precio en formato de texto a float
     * 
     * @param string $precio
     * @return float|null
     */
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

    /**
     * Encuentra una imagen para un producto basado en su código
     * 
     * @param string $codigo
     * @return string|null
     */
    private function encontrarImagenParaProducto($codigo)
    {
        // Verificar si ya tenemos esta imagen en caché
        if (isset($this->imageCache[$codigo])) {
            return $this->imageCache[$codigo];
        }

        // Si ya verificamos que no hay directorio de imágenes, no seguir buscando
        if ($this->imageDirectoryChecked && $this->imagePath === null) {
            return null;
        }

        // Si aún no hemos detectado el directorio de imágenes, intentarlo ahora
        if (!$this->imageDirectoryChecked) {
            $this->detectarDirectorioImagenes();
        }

        // Si no se encontró ningún directorio de imágenes válido
        if ($this->imagePath === null) {
            return null;
        }

        // Buscar la imagen para este código específico
        $result = $this->buscarImagenEnDirectorio($codigo);

        // Guardar en caché para evitar búsquedas repetidas
        $this->imageCache[$codigo] = $result;

        return $result;
    }

    /**
     * Detecta dónde están almacenadas las imágenes
     * 
     * @return void
     */
    private function detectarDirectorioImagenes()
    {
        $this->imageDirectoryChecked = true;

        // Lista de posibles rutas para verificar
        $posiblesRutas = [
            'images',
            'public/images',
            '/images',
            'app/public/images'
        ];

        // Intentar con diferentes rutas de Storage
        foreach ($posiblesRutas as $ruta) {
            if (Storage::exists($ruta) && count(Storage::files($ruta)) > 0) {
                $this->imagePath = $ruta;
                Log::info("Directorio de imágenes encontrado: {$ruta}");
                return;
            }
        }

        // Verificar directorio físico si no se encontró en Storage
        $publicPath = public_path('storage/images');
        if (is_dir($publicPath)) {
            $files = scandir($publicPath);
            $files = array_diff($files, ['.', '..']);

            if (count($files) > 0) {
                $this->imagePath = 'public_path';
                Log::info("Directorio de imágenes encontrado en ruta física: {$publicPath}");
                return;
            }
        }

        Log::warning("No se encontró ningún directorio de imágenes válido");
    }

    /**
     * Busca una imagen para un código específico en el directorio detectado
     * 
     * @param string $codigo
     * @return string|null
     */
    private function buscarImagenEnDirectorio($codigo)
    {
        $imagenes = [];

        // Obtener lista de imágenes según el tipo de directorio detectado
        if ($this->imagePath === 'public_path') {
            $files = scandir(public_path('storage/images'));
            $files = array_diff($files, ['.', '..']);
            foreach ($files as $file) {
                $imagenes[] = ['path' => 'images/' . $file, 'name' => $file];
            }
        } else {
            $files = Storage::files($this->imagePath);
            foreach ($files as $file) {
                $imagenes[] = ['path' => $file, 'name' => basename($file)];
            }
        }

        // Buscar imagen que coincida con el código
        foreach ($imagenes as $imagen) {
            // Eliminar la extensión para la comparación
            $nombreSinExtension = pathinfo($imagen['name'], PATHINFO_FILENAME);

            // Verificar si el nombre del archivo comienza con el código
            if (preg_match('/^' . preg_quote($codigo, '/') . '\b/i', $nombreSinExtension)) {
                return $imagen['path'];
            }
        }

        return null;
    }
}
