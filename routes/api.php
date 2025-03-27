<?php

use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\BannerInicioController;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\CliengoController;
use App\Http\Controllers\ContactInfoController;

use App\Http\Controllers\LogosController;
use App\Http\Controllers\SomosBronzenInicioController;

use Illuminate\Support\Facades\Route;



// Rutas de usuarios regulares (ya existentes)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/me', [UserAuthController::class, 'me']);
});

Route::post('/signup', [UserAuthController::class, 'signup']);
Route::post('/login', [UserAuthController::class, 'login']);
//index
Route::get('/banner-inicio', [BannerInicioController::class, 'index']);
Route::get('/contact-info', [ContactInfoController::class, 'index']);
Route::get("/logos", [LogosController::class, 'index']);
Route::get("/somos-bronzen-inicio", [SomosBronzenInicioController::class, 'index']);
Route::get("/catalogo", [CatalogoController::class, 'index']);

//download
Route::get('/catalogo/download/{id}', [CatalogoController::class, 'downloadFile']);

//cliengo
Route::get('/cliengo-config', [CliengoController::class, 'getCliengoConfig']);

// Rutas para admin
Route::prefix('admin')->group(function () {
    Route::post('/signup', [AdminAuthController::class, 'signup']);
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        //log
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
        //update data
        Route::put('/banner-inicio/{id}', [BannerInicioController::class, 'update']);
        Route::put("/logos/{id}", [LogosController::class, 'update']);
        Route::put('/contact-info/{id}', [ContactInfoController::class, 'update']);
        Route::put('/somos-bronzen-inicio/{id}', [SomosBronzenInicioController::class, 'update']);
        Route::put('/catalogo/{id}', [CatalogoController::class, 'update']);
    });
});
