<?php

use App\Http\Controllers\ClipController;
use App\Http\Controllers\DmcaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmoteController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\TermsController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClipViewController;
use App\Http\Controllers\ClipUpVoteController;
use App\Http\Controllers\BroadcasterController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\UserCommentController;
use App\Http\Controllers\ClipDownVoteController;
use App\Http\Controllers\CommentReplyController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\BlockCategoryController;
use App\Http\Controllers\CommentUpVoteController;
use App\Http\Controllers\ContentPolicyController;
use App\Http\Controllers\PrivacyPolicyController;
use App\Http\Controllers\ClipbulletchatController;
use App\Http\Controllers\CommentDownVoteController;
use App\Http\Controllers\BlockBroadcasterController;
use App\Http\Controllers\CookiePreferencesController;

// use Illuminate\Support\Facades\Route;
// use App\Models\Role;
// use App\Models\RoleUser;
// Route::get('/role', function () {
//     $role = new Role();
//     $role->role = 'admin';
//     $role->save();

//     $role = new RoleUser();
//     $role->user_id = 203331654;
//     $role->role_id = 1;
//     $role->save();
// });

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/ads.txt', function () {
	return response()->redirectTo(config('app.asset_url').'/ads.txt', 302, [
		'Content-Type' => 'text/plain',
		'Cache-Control' => 'public, max-age=3600',
	]);
});

Route::get('/popular', [HomeController::class, 'index'])->name('popular');

Route::get('/upload', [UploadController::class, 'index']);

Route::get('/browse', [BroadcasterController::class, 'index']);

Route::get('/search', [SearchController::class, 'index']);

Route::get('/terms', [TermsController::class, 'index']);

Route::get('/privacy-policy', [PrivacyPolicyController::class, 'index']);

Route::get('/content-policy', [ContentPolicyController::class, 'index']);

Route::get('/dmca', [DmcaController::class, 'index']);

Route::get('/settings', [SettingController::class, 'index'])->name('settings');

Route::get('/login', [LoginController::class, 'login'])->name('login');

Route::get('/logout', [LoginController::class, 'logout']);

Route::get('/login/callback', [LoginController::class, 'callback']);

Route::get('/clip/reports', [ReportController::class, 'clips']);

Route::get('/clip-bullet-chats/reports', [ReportController::class, 'clipBulletChats']);

Route::get('/comments/reports', [ReportController::class, 'comments']);

Route::get('/users/reports', [ReportController::class, 'users']);

Route::get('/browse/categories', [CategoryController::class, 'index']);

Route::get('/clip/create', [ClipController::class, 'create']);

Route::get('/account/cookiepreferences', [CookiePreferencesController::class, 'index']);

Route::get('/bullet/chat', [ClipbulletchatController::class, 'index']);

Route::get('/clippers/leaderboard', [LeaderboardController::class, 'index']);

Route::get('/category/{category_name}', [CategoryController::class, 'show'])->where('category_name', '.*');

Route::get('/broadcaster/{login}', [BroadcasterController::class, 'show']);

Route::resource('clip', ClipController::class)->except('index');

Route::resource('clip.upvote', ClipUpVoteController::class)->only(['store', 'destroy']);

Route::resource('clip.downvote', ClipDownVoteController::class)->only(['store', 'destroy']);

Route::resource('comments', CommentController::class)->only(['store', 'update', 'destroy']);

Route::resource('comment.upvote', CommentUpVoteController::class)->only(['store', 'destroy']);

Route::resource('comment.downvote', CommentDownVoteController::class)->only(['store', 'destroy']);

Route::resource('notifications', NotificationController::class)->only(['index', 'update', 'destroy']);

Route::resource('reports', ReportController::class)->only(['store', 'destroy']);

Route::post('/viewed', [ClipViewController::class, 'store']);

Route::patch('/follow/{broadcaster}', [FollowController::class, 'follow']);

Route::patch('/unfollow/{broadcaster}', [FollowController::class, 'unfollow']);

Route::patch('/block/{broadcaster}/broadcaster', [BlockBroadcasterController::class, 'block']);

Route::patch('/unblock/{broadcaster}/broadcaster', [BlockBroadcasterController::class, 'unblock']);

Route::patch('/block/{category}/category', [BlockCategoryController::class, 'block']);

Route::patch('/unblock/{category}/category', [BlockCategoryController::class, 'unblock']);

Route::patch('/settings/{user}/notify_comments', [SettingController::class, 'updateNotifyComments']);

Route::patch('/settings/{user}/notify_replies', [SettingController::class, 'updateNotifyReplies']);

Route::prefix('json')->group(function () {
    Route::get('/clip', [ClipController::class, 'index']);

    Route::get('/comments', [CommentController::class, 'index']);

    Route::get('/search/clippers', [SearchController::class, 'index']);

    Route::get('/search/clips', [SearchController::class, 'index']);

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::get('/leaderboard', [LeaderboardController::class, 'index']);

    Route::get('/browse/broadcasters', [BroadcasterController::class, 'index']);

    Route::get('/browse/categories', [CategoryController::class, 'index']);

    Route::get('/replies/{comment_id}', [CommentReplyController::class, 'index']);

    Route::get('/emotes/{broadcaster_id}', [EmoteController::class, 'index']);

    Route::get('/following', [FollowController::class, 'index']);

    Route::get('/{user_id}/comments', [UserCommentController::class, 'index']);

    Route::get('/{user_id}', [UserController::class, 'index']);
});

// FIX THIS SHIT THE PROFILE USER DATA IS CALLED ON EACH ROUTE CHANGE!!!!!

Route::get('/clip/{slug}/{comment_id?}', [ClipController::class, 'show']);

Route::get('/{login}', [UserController::class, 'index'])->name('clips');

Route::get('/{login}/comments', [UserController::class, 'index'])->name('comments');

Route::get('/{login}/following', [UserController::class, 'index'])->name('following');

Route::middleware('can:view-votes,login')->group(function () {
    Route::get('/{login}/upvotes', [UserController::class, 'index'])->name('upvotes');

    Route::get('/{login}/downvotes', [UserController::class, 'index'])->name('downvotes');
});


