<?php

namespace App\Http\Controllers;

use App\Models\Broadcaster;
use App\Models\Category;
use App\Models\Leaderboard;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $leaderboard = Leaderboard::whereDate('updated_at', Carbon::today())
            ->where('current_points', '>=', 1)
            ->when($request->has('broadcaster_id'), function ($query) use ($request) {
                return $query->whereJsonContains('broadcaster_id', (int) $request->query('broadcaster_id'));
            })
            ->when($request->has('category_id'), function ($query) use ($request) {
                return $query->whereJsonContains('category_id', (int) $request->query('category_id'));
            })
            ->with('user:id,login,display_name,avatar')
            ->orderBy('current_points', 'desc');


        if ($request->expectsJson()) {
            return $leaderboard->simplePaginate($request->query('limit'))
                ->appends(['limit' => $request->query('limit')])
                ->appends(['broadcaster_id' => $request->query('broadcaster_id')])
                ->appends(['category_id' => $request->query('category_id')])
                ->setPath('/json/leaderboard');
        }

        $broadcasterOrCategory = null;

        if ($request->has('broadcaster_id')) {
            $broadcasterOrCategory = Broadcaster::find($request->query('broadcaster_id'));
        } else if ($request->has('category_id')) {
            $broadcasterOrCategory = Category::find($request->query('category_id'));
        }

        return Inertia::render('leaderboard', [
            'broadcaster' => $request->query('broadcaster_id') ? $broadcasterOrCategory : null,
            'category' => $request->query('category_id') ? $broadcasterOrCategory : null,
            'leaderboard' => $leaderboard->simplePaginate(20)
                ->appends(['limit' => 20])
                ->appends(['broadcaster_id' => $request->query('broadcaster_id')])
                ->appends(['category_id' => $request->query('category_id')])
                ->setPath('/json/leaderboard')
        ]);
    }
}
