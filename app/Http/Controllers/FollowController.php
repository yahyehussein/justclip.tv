<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Broadcaster;
use Illuminate\Http\Request;
use App\Jobs\CacheUserFollowOrUnfollow;

class FollowController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token'])
            ->only(['follow', 'unfollow']);
    }

    public function index(Request $request)
    {
        return User::find($request->query('user_id'))
            ->following()
            ->simplePaginate(20)
            ->appends(['user_id' => $request->query('user_id')])
            ->setPath('/json/following');
    }

    public function follow(Request $request, Broadcaster $broadcaster) {
        abort_if($request->user()->id === $broadcaster->id, response()->json(['message' => 'You cannot follow yourself, buddy.'], 403));

        abort_if(in_array($broadcaster->id, $request->user()->blocked_broadcasters ?? []), response()->json(['message' => 'You cannot follow a broadcaster you are currently blocking'], 403));

        $request->user()->follow($broadcaster);

        CacheUserFollowOrUnfollow::dispatch($request->user()->id);

        return response()->noContent(200);
    }

    public function unfollow(Request $request, Broadcaster $broadcaster) {
        $request->user()->unfollow($broadcaster);

        CacheUserFollowOrUnfollow::dispatch($request->user()->id);

        return response()->noContent(200);
    }
}
