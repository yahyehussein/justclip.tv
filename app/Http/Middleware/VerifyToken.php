<?php

namespace App\Http\Middleware;

use Closure;
use Redirect;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class VerifyToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        $client_id = env('TWITCH_CLIENT_ID');
        $client_secret = env('TWITCH_CLIENT_SECRET');
        $access_token = $user->access_token;
        $refresh_token = $user->refresh_token;

        $validate = Http::withToken($access_token, 'OAuth')
            ->get('https://id.twitch.tv/oauth2/validate');

        if ($validate->failed()) {
            $token = Http::asForm()
            ->post('https://id.twitch.tv/oauth2/token', [
                'grant_type' => 'refresh_token',
                'refresh_token' => $refresh_token,
                'client_id' => $client_id,
                'client_secret' => $client_secret,
            ]);

            if ($token->failed()) {
                Http::post("https://id.twitch.tv/oauth2/revoke?client_id={$client_id}&token={$access_token}");

                Auth::logout();

                $request->session()->invalidate();

                $request->session()->regenerateToken();

                session(['_redirect' => url()->previous()]);

                session(['_action' => [
                    'clip_id' => $request->route('clip')->id ?? null,
                    'comment_id' => $request->route('comment'),
                    'broadcaster_id' => $request->input('broadcaster_id'),
                    'upvote' => basename(url()->current()) === 'upvote'? 1 : null,
                    'downvote' => basename(url()->current()) === 'downvote' ? 0 : null,
                    'follow' => basename(url()->current()) === 'follow',
                    'unfollow' => basename(url()->current()) === 'unfollow'
                ]]);

                if ($request->acceptsJson()) {
                    return abort(401);
                }

                return route('signIn');
            }

            User::withoutSyncingToSearch(function () use ($user, $token) {
                $user->access_token = $token->json()['access_token'];
                $user->refresh_token = $token->json()['refresh_token'];

                $user->save();
            });
        }

        return $next($request);
    }
}
