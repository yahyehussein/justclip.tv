<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClipController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\BroadcasterController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\StreamController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/clips', [ClipController::class, 'index']);

Route::get('/broadcasters', [BroadcasterController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::get('/broadcaster/{login}', [BroadcasterController::class, 'show']);

Route::get('/category/{category_name}', [CategoryController::class, 'show'])->where('category_name', '.*');

Route::get('/user/{login}', [UserController::class, 'index']);

// Route::get('/leaderboard', [LeaderboardController::class, 'index']);

Route::post('/webhooks/callback', [StreamController::class, 'store']);


