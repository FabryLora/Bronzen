<?php

use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\BannerInicioController;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CliengoController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\ExcelUploadController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\LogosController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\SomosBronzenInicioController;
use App\Http\Controllers\SubCategoriaController;
use App\Http\Controllers\SubProductoController;
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
Route::get("/categorias", [CategoriaController::class, 'index']);
Route::get("/sub-categorias", [SubCategoriaController::class, 'index']);
Route::get("/productos", [ProductoController::class, 'index']);
Route::get("/sub-productos", [SubProductoController::class, 'index']);

//get singles

Route::get('/sub-categories/categories/{id}', [SubCategoriaController::class, 'SubCategoriaporCategoriaId']);
Route::get('/productos/sub-categories/{id}', [ProductoController::class, 'ProductoporSubCategoriaId']);
Route::get('/sub-productos/productos/{id}', [SubProductoController::class, 'mostrarSubPRoductosPorProductoId']);


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
        Route::apiResource('/categorias', CategoriaController::class);
        Route::apiResource('/sub-categorias', SubCategoriaController::class);
        Route::apiResource('/productos', ProductoController::class);
        Route::apiResource('/sub-productos', SubProductoController::class);



        //excel
        Route::post('/importar-excel', [ImportController::class, 'importar']);
    });
});
