<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\bannerInicio;
use App\Models\Catalogo;
use App\Models\ContactInfo;
use App\Models\SomosBronzenInicio;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'pablo',
            'password' => bcrypt('pablopablo'),
        ]);

        Admin::factory()->create([
            'name' => 'pablo',
            'password' => bcrypt('pablopablo'),
        ]);

        bannerInicio::factory()->create([
            'titulo' => 'Visite nuestro Showroom',
            'subtitulo' => 'Contacte a su vendedor.',
            'imagen' => 'imagen',
            'video' => 'https://www.youtube.com/watch?v=uFNKNTMbHlQ',
        ]);

        Catalogo::factory()->create([
            'title' => 'Descargue nuestro catálogo 2025',
            'image' => 'test',
            'file' => 'test',
        ]);

        SomosBronzenInicio::factory()->create([
            'title' => 'SOMOS BRONZEN',
            'text' => '<h2>Están, estás, estamos.</h2><p><br></p><p><br></p><p>Los herrajes están presentes en todo.</p><p>En cada puerta, en cada ventana, en cada mueble.</p><p>Están en cocinas, livings y baños, en forma de aluminio, madera o vidrio.</p><p>Siempre facilitando el movimiento y aportando diseño.</p><p><br></p><p>En BRONZEN lo sabemos y por eso estamos con vos.</p><p>En todas las soluciones, en todos los espacios, en todos los materiales.</p><p><br></p><p>Comprometidos en ofrecerte todo para garantizarte el mejor servicio,</p><p>con stock permanente, entrega inmediata en todo el país</p><p>y el precio más conveniente, siempre.</p><p><br></p><p>Porque sabemos que para estar en todo lo que necesitás</p><p>tenemos que estar en todo.</p>',
            'image' => 'imagen',
        ]);


        ContactInfo::factory()->create([
            'mail' => 'info@bronzen.com.ar',
            'phone' => '4586-2949/2950',
            'second_phone' => '15-6908-9893',
            'wp' => '5491123348428',
        ]);
    }
}
