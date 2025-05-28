<?php

use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BannerInicioController;
use App\Http\Controllers\CatalogoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\CliengoController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\DescargarArchivo;
use App\Http\Controllers\ExcelUploadController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\ImportController;
use App\Http\Controllers\InformacionController;
use App\Http\Controllers\LogosController;
use App\Http\Controllers\MassMailController;
use App\Http\Controllers\MetadatosController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\PedidoProductoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\SendContactInfoController;
use App\Http\Controllers\SendPedidoController;
use App\Http\Controllers\SomosBronzenInicioController;
use App\Http\Controllers\SubCategoriaController;
use App\Http\Controllers\SubProductoController;
use App\Http\Controllers\SubProductoImageController;
use App\Http\Controllers\SubscriberController;
use App\Http\Controllers\VendedorAuthController;
use App\Models\Provincia;
use Illuminate\Support\Facades\Route;



// Rutas de usuarios regulares (ya existentes)
Route::middleware('auth:sanctum')->group(callback: function () {
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/me', [UserAuthController::class, 'me']);
    Route::get('/allusers', [UserAuthController::class, 'allUsers']);
    Route::get('/showuser/{id}', [UserAuthController::class, 'showUser']);
    Route::post('/sendpedido', [SendPedidoController::class, 'sendReactEmail']);

    //Pedidos

});



Route::post('/sendcontact', [SendContactInfoController::class, 'sendReactEmail']);


Route::post('/sendmassmail', [MassMailController::class, 'sendMassReactEmail']);

Route::apiResource('/metadatos', MetadatosController::class);
Route::apiResource('/pedidos', PedidoController::class);
Route::apiResource('/pedido-productos', PedidoProductoController::class);
Route::apiResource('/subscriber', SubscriberController::class);

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
Route::get("/provincias", [ProvinciaController::class, 'index']);
Route::get("/informacion", [InformacionController::class, 'index']);
Route::get("/facturas", [FacturaController::class, 'index']);


//get singles

Route::get('/sub-categories/categories/{id}', [SubCategoriaController::class, 'SubCategoriaporCategoriaId']);
Route::get('/productos/sub-categories/{id}', [ProductoController::class, 'ProductoporSubCategoriaId']);
Route::get('/sub-productos/productos/{id}', [SubProductoController::class, 'mostrarSubPRoductosPorProductoId']);
Route::get('/featured-products', [ProductoController::class, 'FeaturedProductos']);
Route::get('/pedidos-usuarios/{id}', action: [PedidoController::class, 'showByUserId']);
Route::get('/busqueda/{id}', [ProductoController::class, 'ProductoPorName']);
Route::get('/facturas/{id}', [FacturaController::class, 'FacturaByPedido']);
Route::get('/facturas-user/{id}', [FacturaController::class, 'FacturaByUser']);

Route::post('/subproductos/queue-assign-images', [SubProductoImageController::class, 'dispatchAssignImagesJob']);

//download
Route::get('/catalogo/download/{id}', [CatalogoController::class, 'downloadFile']);
Route::get('/descargar-archivo/{id}', [DescargarArchivo::class, 'descargarArchivo']);


//cliengo
Route::get('/cliengo-config', [CliengoController::class, 'getCliengoConfig']);

Route::get('/cargar-fotos', [SubProductoController::class, 'cargarImagenes']);



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
        Route::apiResource('/clientes', UserAuthController::class);
        Route::put('/informacion/{id}', [InformacionController::class, 'update']);
        Route::post('/guardar-factura', [FacturaController::class, 'store']);

        Route::get('/me-admin', [AdminController::class, 'me']);

        Route::put('/admin/{id}', [AdminController::class, 'update']);
        Route::delete('/admin/{id}', [AdminController::class, 'destroy']);
        Route::get('/alladmins', [AdminController::class, 'index']);




        //excel
        Route::post('/importar-excel', [ImportController::class, 'importar']);
    });
});
