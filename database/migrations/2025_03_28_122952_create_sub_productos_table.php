<?php

use App\Models\Producto;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sub_productos', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('name');
            $table->string('orden')->nullable();
            $table->string('image')->nullable();
            $table->foreignIdFor(Producto::class, 'producto_id')->nullable()->constrained();
            $table->integer('min');
            $table->integer('min_oferta')->nullable();
            $table->integer('bulto_cerrado');
            $table->decimal('precio_de_lista', 10, 2);
            $table->decimal('precio_de_oferta', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_productos');
    }
};
