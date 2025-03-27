<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class CliengoController extends Controller
{
    /**
     * Get Cliengo configuration
     */
    public function getCliengoConfig()
    {
        return response()->json([
            'script_url' => config('services.cliengo.script_url'),
            'website_id' => config('services.cliengo.website_id'),
            // Add any other Cliengo-related configuration
        ]);
    }
}
