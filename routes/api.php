<?php

use App\Http\Controllers\UserAuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\BannerInicioController;
use App\Http\Controllers\ContactInfoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogosController;
use App\Http\Controllers\SurveyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



// Rutas de usuarios regulares (ya existentes)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/me', [UserAuthController::class, 'me']);
});

Route::post('/signup', [UserAuthController::class, 'signup']);
Route::post('/login', [UserAuthController::class, 'login']);

Route::get('/banner-inicio', [BannerInicioController::class, 'index']);
Route::get('/contact-info', [ContactInfoController::class, 'index']);

Route::get("/logos", [LogosController::class, 'index']);

// Rutas para admin
Route::prefix('admin')->group(function () {
    Route::post('/signup', [AdminAuthController::class, 'signup']);
    Route::post('/login', [AdminAuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::get('/me', [AdminAuthController::class, 'me']);
        Route::put('/banner-inicio/{id}', [BannerInicioController::class, 'update']);
        Route::put("/logos/{id}", [LogosController::class, 'update']);
        Route::put('/contact-info/{id}', [ContactInfoController::class, 'update']);
    });
});
