<?php

namespace App\Http\Controllers;

use App\Models\Broadcaster;
use App\Models\User;
use Illuminate\Http\Request;

class BlockBroadcasterController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token']);
    }

    public function block(Request $request, Broadcaster $broadcaster)
    {
        abort_if($request->user()->isFollowing($broadcaster), response()->json(['message' => 'Cannot block a broadcaster you are following'], 403));

        User::withoutSyncingToSearch(function () use ($request, $broadcaster) {
            if (empty($request->user()->blocked_broadcasters)) {
                $request->user()->blocked_broadcasters = [$broadcaster->id];

                $request->user()->save();
            } else {
                $blocked_broadcasters = collect($request->user()->blocked_broadcasters);
                $blocked_broadcasters->push($broadcaster->id);

                $request->user()->blocked_broadcasters = $blocked_broadcasters->all();

                $request->user()->save();
            }
        });
    }

    public function unblock(Request $request, Broadcaster $broadcaster)
    {
        User::withoutSyncingToSearch(function () use ($request, $broadcaster) {
            if (!empty($request->user()->blocked_broadcasters)) {
                $collection = collect($request->user()->blocked_broadcasters);

                $blocked_broadcasters = $collection->reject(function ($value) use ($broadcaster) {
                    return $value === $broadcaster->id;
                });

                $request->user()->blocked_broadcasters = $blocked_broadcasters->all();

                $request->user()->save();
            }
        });
    }
}
