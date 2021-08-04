<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;

use Meta;

class UserController extends Controller
{
    // FIX THIS SHIT COUNT IS CALLED ON EVERY ROUTE CHANGE CLIPS, COMMENTS, FOLLOWING, UPVOTES AND DOWNVOTES

    public function index(Request $request, $idOrlogin)
    {
        $user = User::where('id', $idOrlogin)
            ->orWhere('login', $idOrlogin)
            ->with('roles')
            ->withCount([
                'clip_upvotes',
                'clip_downvotes',
                'comment_upvotes',
                'comment_downvotes'
            ])
            ->firstOrFail();

        if ($request->expectsJson()) {
            return $user;
        }

        Meta::set('og:title', "{$user->display_name} - Justclip");
        Meta::set('og:description', $user->about);
        Meta::set('og:image', $user->avatar);

        $path = explode('/', substr(parse_url($request->url())['path'], 1));

        $view = 'profile/clips';

        if (count($path) > 1) {
            $view = 'profile/' . $path[1];
        }

        return Inertia::render($view, [
            'user' => $user
        ]);
    }
}
