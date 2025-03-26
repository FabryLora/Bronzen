<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\bannerInicio;
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
    }
}
