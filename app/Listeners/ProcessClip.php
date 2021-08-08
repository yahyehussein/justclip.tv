<?php

namespace App\Listeners;

use App\Models\Clip;
use App\Events\ClipCreated;
use Illuminate\Support\Str;
use App\Models\ClipBulletChat;
use App\Notifications\ClipSimilar;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class ProcessClip implements ShouldQueue
{
    use InteractsWithQueue;

    public $afterCommit = true;
    public $deleteWhenMissingModels = true;

    private $emotes = [];
    private $offset = null;
    private $ClipBulletChats = [];
    private $previousEnd;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    private function chat($event, $start = null, $cursor = null, $time = null)
    {
        $parameter = "content_offset_seconds={$this->offset}";

        if ($cursor) {
            $parameter = "cursor=$cursor";
        }

        $chat = Http::withHeaders([
                'Accept' => 'application/vnd.twitchtv.v5+json',
                'Client-Id' => '00othjdvynvi0aiiyfhixi0nwbgaqx'
            ])
            ->get("https://api.twitch.tv/v5/videos/{$event->clip->video_id}/comments?${parameter}");

        if (!empty(count($chat->json()['comments']))) {
            $chatOffsetSeconds = $time ?? 0;
            $prevTime = null;
            $currentEnd = round($chat->json()['comments'][count($chat->json()['comments']) - 1]['content_offset_seconds']);

            if ($this->previousEnd !== $currentEnd) {
                foreach ($chat->json()['comments'] as $value) {
                    $duplicates = [];
                    $emotes = [];
                    $words = explode(" ", $value['message']['body']);

                    foreach ($this->emotes as $emote) {
                        if (in_array($emote['code'], $words) && !in_array($emote['code'], $duplicates)) {
                            $duplicates[] = $emote['code'];
                            $emotes[] = $emote;
                        }
                    }

                    $this->ClipBulletChats[] = [
                        'color' => ($value['message']['user_color'] ?? false) ? intval(substr($value['message']['user_color'], 1), 16) : null,
                        'author' => $value['commenter']['display_name'],
                        'text' => $value['message']['body'],
                        'time' => (round($value['content_offset_seconds']) > $prevTime && $prevTime) ? $chatOffsetSeconds++ : $chatOffsetSeconds,
                        'emotes' => json_encode($emotes),
                        'user_id' => $value['commenter']['_id'],
                        'clip_id' => $event->clip->id
                    ];

                    $prevTime = round($value['content_offset_seconds']);
                }
            }

            if (!$cursor) {
                $start = round($chat->json()['comments'][0]['content_offset_seconds']);
            }

            $cursor = $chat->json()['_next'] ?? null;

            if ($currentEnd < ($start + $event->clip->duration) && $cursor) {
                $this->previousEnd = $currentEnd;
                $this->chat($event, $start, $cursor, $chatOffsetSeconds);
            }
        }
    }

    /**
     * Handle the event.
     *
     * @param  ClipSaved  $event
     * @return void
     */
    public function handle(ClipCreated $event)
    {
        $globalEmotes = Cache::remember('global.emotes', 86400, function () use ($event) {
            $globalEmotes = Http::withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
                ->withToken($event->clip->user->access_token)
                ->get('https://api.twitch.tv/helix/chat/emotes/global');
            $bttvGlobalEmotes = Http::get('https://api.betterttv.net/3/cached/emotes/global');

            return [
                'twitch' => $globalEmotes->successful() ? $globalEmotes->json()['data'] : [],
                'betterttv' => $bttvGlobalEmotes->successful() ? $bttvGlobalEmotes->json() : []
            ];
        });

        $emotes = Cache::remember("broadcaster.{$event->clip->broadcaster->id}.emotes", 3600, function () use ($event) {
            $channelEmotes = Http::withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
                ->withToken($event->clip->user->access_token)
                ->get("https://api.twitch.tv/helix/chat/emotes?broadcaster_id={$event->clip->broadcaster->id}");
            $bttvEmotes = Http::get("https://api.betterttv.net/3/cached/users/twitch/{$event->clip->broadcaster->id}");
            $ffzEmotes = Http::get("https://api.frankerfacez.com/v1/room/id/{$event->clip->broadcaster->id}");

            return [
                'channel' => $channelEmotes->successful() ? $channelEmotes->json()['data'] : [],
                'betterttv' => $bttvEmotes->successful() ? array_merge($bttvEmotes->json()['channelEmotes'], $bttvEmotes->json()['sharedEmotes']) : [],
                'frankerfacez' => $ffzEmotes->successful() ? $ffzEmotes->json()['sets'][array_keys($ffzEmotes->json()['sets'])[0]]['emoticons'] : []
            ];
        });

        foreach ($globalEmotes['twitch'] as $value) {
            $this->emotes[] = [
              'code' => $value['name'],
              'url' => $value['images']['url_1x']
            ];
        }

        foreach ($emotes['channel'] as $value) {
            $this->emotes[] = [
              'code' => $value['name'],
              'url' => $value['images']['url_1x']
            ];
        }

        foreach ($globalEmotes['betterttv']  as $value) {
            $this->emotes[] = [
              'code' => $value['code'],
              'url' => "https://cdn.betterttv.net/emote/{$value['id']}/1x"
            ];
        }

        foreach ($emotes['betterttv']  as $value) {
            $this->emotes[] = [
              'code' => $value['code'],
              'url' => "https://cdn.betterttv.net/emote/{$value['id']}/1x"
            ];
        }

        foreach ($emotes['frankerfacez'] as $value) {
            $this->emotes[] = [
              'code' => $value['name'],
              'url' => $value['urls'][1]
            ];
        }

        $offset = Http::get("https://wjvtcijege.execute-api.us-east-1.amazonaws.com/clip_video_offset/{$event->clip->slug}");

        $clips = Clip::select('id', 'slug', 'title', 'offset', 'duration')
            ->whereNotNull('offset')
            ->where('video_id', $event->clip->video_id)->get();

        $duration = $event->clip->duration;

        foreach ($clips as $_clip) {
            if ($offset->json() > $_clip->offset && $offset->json() < ($_clip->offset + $_clip->duration)) {
                $event->clip->user->notify(new ClipSimilar($_clip));
                return $event->clip->forceDelete();
            } else if (($offset->json() + $duration) > $_clip->offset && ($offset->json() + $duration) < ($_clip->offset + $_clip->duration)) {
                $event->clip->user->notify(new ClipSimilar($_clip));
                return $event->clip->forceDelete();
            } else if ($_clip->offset > $offset->json() && $_clip->offset < ($offset->json() + $duration)) {
                $event->clip->user->notify(new ClipSimilar($_clip));
                return $event->clip->forceDelete();
            } else if (($_clip->offset + $_clip->duration) > $offset->json() && ($_clip->offset + $_clip->duration) < ($offset->json() + $duration)) {
                $event->clip->user->notify(new ClipSimilar($_clip));
                return $event->clip->forceDelete();
            }
        }

        $event->clip->offset = $offset->json();

        $event->clip->save();

        $this->offset = $offset->json();

        if ($this->offset) {
            $this->chat($event);
            ClipBulletChat::insert($this->ClipBulletChats);
        }

        $file = Str::uuid();

        Storage::disk('s3')->putFileAs('', $event->clip->thumbnail, "$file-preview-480x272.jpg");

        Storage::disk('s3')->putFileAs('', str_replace('-preview-480x272.jpg', '.mp4', $event->clip->thumbnail), "$file.mp4");

        $event->clip->thumbnail = "https://clips-media-assets.b-cdn.net/$file-preview-480x272.jpg";
        $event->clip->save();

        if ($event->clip->broadcaster->subscriptions) {
            return;
        }

        $channel_update = Http::asJson()
            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
            ->post('https://api.twitch.tv/helix/eventsub/subscriptions', [
                'type' => "channel.update",
                'version' => '1',
                'condition' => [
                    'broadcaster_user_id' => "{$event->clip->broadcaster->id}"
                ],
                'transport' => [
                    'method' => 'webhook',
                    'callback' => env('APP_URL') . '/api/webhooks/callback',
                    'secret' => '4nP2bCnB.cF\c2{j'
                ]
            ]);

        $stream_online = Http::asJson()
            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
            ->post('https://api.twitch.tv/helix/eventsub/subscriptions', [
                'type' => "stream.online",
                'version' => '1',
                'condition' => [
                    'broadcaster_user_id' => "{$event->clip->broadcaster->id}"
                ],
                'transport' => [
                    'method' => 'webhook',
                    'callback' => env('APP_URL') . '/api/webhooks/callback',
                    'secret' => '4nP2bCnB.cF\c2{j'
                ]
            ]);

        $stream_offline = Http::asJson()
            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
            ->post('https://api.twitch.tv/helix/eventsub/subscriptions', [
                'type' => "stream.offline",
                'version' => '1',
                'condition' => [
                    'broadcaster_user_id' => "{$event->clip->broadcaster->id}"
                ],
                'transport' => [
                    'method' => 'webhook',
                    'callback' => env('APP_URL') . '/api/webhooks/callback',
                    'secret' => '4nP2bCnB.cF\c2{j'
                ]
            ]);


        if ($channel_update->successful() && $stream_online->successful() && $stream_offline->successful()) {
            $event->clip->broadcaster->subscriptions = [
                'channel_update' => $channel_update->json()['data'][0]['id'],
                'stream_online' => $stream_online->json()['data'][0]['id'],
                'stream_offline' => $stream_offline->json()['data'][0]['id']
            ];

            $event->clip->broadcaster->save();
        }
    }
}
