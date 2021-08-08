<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class EmoteController extends Controller
{
   public function index($broadcaster_id)
   {
       return Cache::remember("broadcaster.{$broadcaster_id}.clip.emotes", 3600, function () use ($broadcaster_id) {
            $bttvEmotes = Http::get("https://api.betterttv.net/3/cached/users/twitch/{$broadcaster_id}");
            $ffzEmotes = Http::get("https://api.frankerfacez.com/v1/room/id/{$broadcaster_id}");

            return [
                'betterttv' => $bttvEmotes->successful() ? array_merge($bttvEmotes->json()['channelEmotes'], $bttvEmotes->json()['sharedEmotes']) : [],
                'frankerfacez' => $ffzEmotes->successful() ? $ffzEmotes->json()['sets'][array_keys($ffzEmotes->json()['sets'])[0]]['emoticons'] : []
            ];
        });
   }
}
