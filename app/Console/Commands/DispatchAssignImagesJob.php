<?php

namespace App\Console\Commands;

use App\Jobs\AssignImagesToSubProductos;
use Illuminate\Console\Command;

class DispatchAssignImagesJob extends Command
{
    protected $signature = 'subproductos:queue-assign-images';
    protected $description = 'Poner en cola el job para asignar imágenes a subproductos';

    public function handle()
    {
        AssignImagesToSubProductos::dispatch();
        $this->info('El job ha sido enviado a la cola.');
        return Command::SUCCESS;
    }
}
