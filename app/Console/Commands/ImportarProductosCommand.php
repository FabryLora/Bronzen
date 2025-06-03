<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ImportarProductosJob;
use Illuminate\Support\Facades\Storage;

class ImportarProductosCommand extends Command
{
    protected $signature = 'importar:productos {archivo}';
    protected $description = 'Importar productos desde un archivo Excel y despachar el Job';

    public function handle()
    {
        $archivo = $this->argument('archivo');

        if (!Storage::disk('public')->exists($archivo)) {
            $this->error("El archivo '{$archivo}' no existe en storage.");
            return 1;
        }

        ImportarProductosJob::dispatch($archivo);
        $this->info("Job despachado exitosamente para el archivo: {$archivo}");

        return 0;
    }
}
