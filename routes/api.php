<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\UserAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Rutas públicas
Route::post('/users/register', [UserAuthController::class, 'register']);
Route::post('/users/login', [UserAuthController::class, 'login']);
Route::post('/admins/register', [AdminAuthController::class, 'register']);
Route::post('/admins/login', [AdminAuthController::class, 'login']);

// Rutas protegidas para usuarios regulares
Route::middleware(['auth:sanctum', 'ability:user'])->group(function () {
    Route::get('/users/profile', [UserAuthController::class, 'profile']);
    Route::post('/users/logout', [UserAuthController::class, 'logout']);
    // Otras rutas para usuarios
});

// Rutas protegidas para administradores
Route::middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    Route::get('/admins/dashboard', [AdminAuthController::class, 'dashboard']);
    Route::post('/admins/logout', [AdminAuthController::class, 'logout']);
    // Otras rutas para administradores
});

// Ruta para verificar token de usuario
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
