<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class LoginController extends Controller
{
    public function login()
    {
        session(['_redirect' => url()->previous()]);
        return Socialite::driver('twitch')->redirect();
    }

    public function callback()
    {
        $login = Socialite::driver('twitch')->user();

        $banned = User::onlyTrashed()->find($login->getId());

        abort_if($banned->deleted_at ?? false, 403);

        $user = User::updateOrCreate(
            ["id" => $login->getId()],
            [
                "login" => $login->getName(),
                "display_name" => $login->getNickname(),
                'email' => $login->getEmail(),
                'about' => $login->user['description'],
                'avatar' => $login->getAvatar(),
                'access_token' => $login->token,
                'refresh_token' => $login->refreshToken
            ]
        );

        Auth::login($user, true);

        return redirect(session('_redirect'));
    }

    public function logout(Request $request)
    {
        if (Auth::check()) {
            $client_id = env('TWITCH_CLIENT_ID');
            $token = $request->user()->access_token;

            Http::post("https://id.twitch.tv/oauth2/revoke?client_id={$client_id}&token={$token}");

            Auth::logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();
        }

        return redirect('/');
    }
}
