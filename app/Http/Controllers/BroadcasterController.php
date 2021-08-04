<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Broadcaster;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\BlockController;

use Meta;

class BroadcasterController extends Controller
{
    public function index(Request $request)
    {
        if ($request->expectsJson()) {
            if (Auth::check() && $request->has('blocked')) {
                if ($request->user()->blocked_broadcasters) {
                    return Broadcaster::whereIn('id', $request->user()->blocked_broadcasters)->get();
                }

                return [];
            }

            return Broadcaster::has('clips')
                ->select()
                ->when(Auth::check() && $request->user()->blocked_broadcasters, function ($query) use ($request) {
                    return $query->whereNotIn('id', $request->user()->blocked_broadcasters);
                })
                ->orderBy('votes', 'desc')
                ->simplePaginate(20)
                ->setPath('/json/browse/broadcasters');
        }

        return Inertia::render('browse/broadcasters', [
            'broadcaster' => Broadcaster::has('clips')
                ->select()
                ->when(Auth::check() && $request->user()->blocked_broadcasters, function ($query) use ($request) {
                    return $query->whereNotIn('id', $request->user()->blocked_broadcasters);
                })
                ->orderBy('votes', 'desc')
                ->simplePaginate(20)
                ->setPath('/json/browse/broadcasters')
        ]);
    }

    public function show(Request $request, $login)
    {
        $broadcaster = Broadcaster::where('login', $login)->withCount('followers')->firstOrFail();

        Meta::set('og:title', "{$broadcaster->display_name}'s Clips - Justclip");
        Meta::set('og:description', $broadcaster->about);
        Meta::set('og:image', $broadcaster->avatar);

        return Inertia::render('broadcaster', [
            'broadcaster' => $broadcaster,
            'following' => Auth::check() ? $request->user()->isFollowing($broadcaster) : false
        ]);
    }
}
