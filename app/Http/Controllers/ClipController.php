<?php

namespace App\Http\Controllers;

use App\Models\Clip;
use Hashids\Hashids;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\Broadcaster;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Http\Requests\StoreClipRequest;
use App\Http\Requests\UpdateClipRequest;
use App\Models\User;
use Meta;

class ClipController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token'])
            ->only(['create', 'store']);
    }

    public function index(Request $request)
    {
        $irl = [509658, 26936, 509660, 509659, 518203, 116747788, 509670, 417752, 509667, 509663, 509672, 509673, 509669, 509671, 515214];

        return Clip::when(Auth::check(), function ($query) use ($request) {
                switch ($request->query('vote')) {
                    case 'upvotes':
                        return $query->select('clips.*')
                            ->join('clip_votes', 'clips.id', '=', 'clip_votes.clip_id')
                            ->where('clip_votes.user_id', $request->user()->id)
                            ->where('clip_votes.vote_type', 1);
                        break;

                    case 'downvotes':
                        return $query->select('clips.*')
                            ->join('clip_votes', 'clips.id', '=', 'clip_votes.clip_id')
                            ->where('clip_votes.user_id', $request->user()->id)
                            ->where('clip_votes.vote_type', 0);
                        break;

                    default:
                        break;
                }
            })
            ->when($request->has('user_id'), function ($query) use ($request) {
                return $query->withTrashed();
            })
            ->when($request->query('feed') === 'following', function ($query) use ($request) {
                return $query->whereIntegerInRaw('broadcaster_id', Cache::rememberForever($request->user()->id . '-following', function () use ($request) {
                    return $request->user()->following()->get()->pluck('id')->toArray();
                }));
            })
            ->when($request->query('feed') === 'games', function ($query) use ($irl) {
                return $query->whereIntegerNotInRaw('category_id', $irl);
            })
            ->when($request->query('feed') === 'irl', function ($query) use ($irl) {
                return $query->whereIntegerInRaw('category_id', $irl);
            })
            ->when($request->has('user_id'), function ($query) use ($request) {
                return $query->where('user_id', $request->query('user_id'));
            })
            ->when($request->has('category_id'), function ($query) use ($request) {
                return $query->where('category_id', $request->query('category_id'));
            })
            ->when($request->has('broadcaster_id'), function ($query) use ($request) {
                return $query->where('broadcaster_id', $request->query('broadcaster_id'));
            })
            ->when(Auth::check() && $request->user()->blocked_broadcasters && $request->query('feed') !== 'home' && !$request->has('user_id') && !$request->has('broadcaster_id'), function ($query) use ($request) {
                return $query->whereNotIn('broadcaster_id', $request->user()->blocked_broadcasters);
            })
            ->when(Auth::check() && $request->user()->blocked_categories && $request->query('feed') !== 'home' && !$request->has('category_id'), function ($query) use ($request) {
                return $query->whereNotIn('category_id', $request->user()->blocked_categories);
            })
            ->withCount(['upvotes', 'downvotes', 'comments'])
            ->with([
                'user:id,login,display_name,avatar',
                'broadcaster',
                'category:id,name,box_art_url'
            ])
            ->when(Auth::check(), function ($query) use ($request) {
                return $query->with([
                    'voted' => function ($query) use ($request) {
                        $query->where('user_id', $request->user()->id);
                    }
                ]);
            })
            ->when($request->has('hot'), function ($query) {
                return $query->orderBy('score', 'desc')
                    ->orderBy('created_at', 'desc');
            })
            ->when($request->has('newest'), function ($query) {
                return $query->orderBy('created_at', 'desc');
            })
            ->when($request->has('top'), function ($query) use ($request) {
                switch ($request->query('t')) {
                    case 'week':
                        return $query->whereBetween('clips.created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                            ->orderByRaw('(upvotes_count - downvotes_count) DESC');
                        break;

                    case 'month':
                        return $query->whereMonth('clips.created_at', Carbon::now()->month)
                            ->orderByRaw('(upvotes_count - downvotes_count) DESC');
                        break;

                    case 'year':
                        return $query->whereYear('clips.created_at', Carbon::today()->year)
                            ->orderByRaw('(upvotes_count - downvotes_count) DESC');
                        break;

                    case 'all':
                        return $query->orderByRaw('(upvotes_count - downvotes_count) DESC');
                        break;

                    default:
                        return $query->whereDate('clips.created_at', Carbon::today())
                            ->orderByRaw('(upvotes_count - downvotes_count) DESC');
                        break;
                }
            })
            ->simplePaginate(10)
            ->appends(['feed' => $request->query('feed')])
            ->appends(['user_id' => $request->query('user_id')])
            ->appends(['category_id' => $request->query('category_id')])
            ->appends(['broadcaster_id' => $request->query('broadcaster_id')])
            ->appends(['hot' => $request->query('hot')])
            ->appends(['newest' => $request->query('newest')])
            ->appends(['top' => $request->query('top')])
            ->appends(['t' => $request->query('t')])
            ->appends(['vote' => $request->query('vote')]);
            // ->setPath('/json/clip');
    }

    public function create(Request $request)
    {
        $slug = $request->query('slug');

        $clip = Clip::where('slug', $slug)->first(['id', 'title', 'slug', 'broadcaster_id']);

        if ($clip) {
            abort(response()->json(['message' => "
                Duplicate clip
                <a
                    href='/clip/{$clip->slug}'
                    class='font-bold text-primary hover:underline'
                >
                    {$clip->title}
                </a>
            "], 409));
        }

        $clip = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/clips?id=$slug");

        abort_if(empty($clip->json()['data']), response()->json(['message' => 'This clip is no longer available'], 404));

        abort_if(in_array($clip->json()['data'][0]['game_id'], [498566, 488190, 29452, 2119110448]), response()->json(['message' => 'Clips with a main focus or sole purpose of Playing/Winning/Losing casino games (poker, slots, blackjack, etc...) are not allowed'], 403));

        if (!$clip->json()['data'][0]['video_id']) {
            if (Carbon::now()->diffInMinutes($clip->json()['data'][0]['created_at']) < 10) {
                abort(response()->json(['message' => "Try again after 1 - 2 mins 😭. Twitch is still processing the current stream video, we need the video id to prevent similar clips."], 404));
            }

            abort(response()->json(['message' => "This clip's past broadcast has expired"], 404));
        }

        $video = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])
        ->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/videos?id={$clip->json()['data'][0]['video_id']}")
        ->throw();

        // abort_if(Carbon::parse($video->json()['data']['0']['created_at'])->diffInDays(Carbon::now()) >= 30, response()->json(['message' => 'Clips that are 30 days or older is not allowed'], 403));

        $broadcaster = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])
        ->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/users?id={$clip->json()['data'][0]['broadcaster_id']}")
        ->throw();

        $channels = null;

        if (!app()->environment(['local', 'staging'])) {
            $channels = Http::withHeaders([
                    'Client-Id' => env('TWITCH_CLIENT_ID'),
                    'Accept' => 'application/vnd.twitchtv.v5+json'
                ])
                ->withToken($request->user()->access_token)->get("https://api.twitch.tv/kraken/channels/{$clip->json()['data'][0]['broadcaster_id']}");
        }

        $streaming = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/streams?user_id={$broadcaster->json()['data']['0']['id']}");

        $category = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/games?id=" . $clip->json()['data'][0]['game_id']);

        // Start Fake Users
        $user = Http::withHeaders([
            'Client-Id' => env('TWITCH_CLIENT_ID')
        ])
        ->withToken($request->user()->access_token)->get("https://api.twitch.tv/helix/users?id={$clip->json()['data'][0]['creator_id']}")
        ->throw();

        User::updateOrCreate(
            ["id" => $user->json()['data']['0']['id']],
            [
                "login" => $user->json()['data']['0']['login'],
                "display_name" => $user->json()['data']['0']['display_name'],
                'about' => $user->json()['data']['0']['description'],
                'avatar' => $user->json()['data']['0']['profile_image_url'],
            ]
        );
        // END Fake Users

        return [
            'slug' => $clip->json()['data'][0]['id'],
            'title' => $clip->json()['data'][0]['title'],
            'thumbnail' => $clip->json()['data'][0]['thumbnail_url'],
            'duration' => $clip->json()['data'][0]['duration'],
            'video_id' => (int) $clip->json()['data'][0]['video_id'],
            'category_id' =>  (int) $category->json()['data']['0']['id'] ?? null,
            'creator_id' => (int) $clip->json()['data'][0]['creator_id'],
            'broadcaster_id' => (int) $clip->json()['data'][0]['broadcaster_id'],
            'clip_created_at' => Carbon::parse($clip->json()['data'][0]['created_at']),
            'broadcaster' => array_merge($broadcaster->json()['data']['0'], ['banner' => $channels ? $channels->json()['profile_banner'] : null], $streaming->json()['data']['0'] ?? []),
            'category' => $category->json()['data']['0'] ? [
                'id' => (int) $category->json()['data']['0']['id'],
                'box_art_url' => $category->json()['data']['0']['box_art_url'],
                'name' => $category->json()['data']['0']['name']
            ] : null
        ];
    }

    public function store(StoreClipRequest $request)
    {
        DB::transaction(function () use ($request) {
            Broadcaster::updateOrCreate(
                ['id' => $request->input('broadcaster_id')],
                [
                    'login' => $request->input('broadcaster')['login'],
                    'display_name' => $request->input('broadcaster')['display_name'],
                    'about' => $request->input('broadcaster')['description'],
                    'avatar' => $request->input('broadcaster')['profile_image_url'],
                    'banner' => $request->input('broadcaster')['banner'],
                    'partner' => $request->input('broadcaster')['broadcaster_type'] === 'partner',
                    'type' => $request->input('broadcaster')['type'] ?? null,
                    'title' => $request->input('broadcaster')['title'] ?? null,
                    'category' => $request->input('broadcaster')['game_name'] ?? null,
                    'started_at' => $request->input('broadcaster')['started_at'] ?? Carbon::now()
                ]
            );

            if ($request->input('category')) {
                Category::updateOrCreate(
                    ['id' => $request->input('category_id')],
                    [
                        'name' => $request->input('category')['name'],
                        'box_art_url' => $request->input('category')['box_art_url']
                    ]
                );
            }

            $clip = new Clip();
            $clip->slug = $request->input('slug');
            $clip->title = $request->input('title');
            $clip->thumbnail = $request->input('thumbnail');
            $clip->duration = $request->input('duration');
            $clip->spoiler = $request->input('spoiler');
            $clip->loud = $request->input('loud');
            $clip->tos = $request->input('tos');
            $clip->video_id = $request->input('video_id');
            $clip->category_id = $request->input('category_id');
            $clip->creator_id = $request->input('creator_id');
            $clip->broadcaster_id = $request->input('broadcaster_id');
            // $clip->user_id = $request->user()->id;
            $clip->user_id = $request->input('creator_id');
            $clip->notify_comments = $request->input('notification');
            $clip->clip_created_at = $request->input('clip_created_at');
            $clip->created_at = $request->input('clip_created_at');
            $clip->save();
        });

        return redirect('/clip/' . $request->input('slug'));
    }

    public function show(Request $request, $slug, $comment_id = '')
    {
        $hashids = new Hashids('justclip');

        $clip = Clip::withTrashed()
            ->with([
                'user:id,login,display_name,avatar',
                'broadcaster',
                'category:id,name'
            ])
            ->when(Auth::check(), function ($query) use ($request) {
                return $query->with([
                    'voted' => function ($query) use ($request) {
                        $query->where('user_id', $request->user()->id);
                    }
                ]);
            })
            ->withCount(['upvotes', 'downvotes', 'views', 'comments'])
            ->where('slug', $slug)
            ->firstOrFail();

        Meta::set('twitter:card', 'summary_large_image');
        Meta::set('og:title', "{$clip->title}");
        Meta::set('og:description', "Watch {$clip->broadcaster->display_name}'s clip titled \"{$clip->title}\"");
        Meta::set('og:image', $clip->thumbnail);

        $clip->next = Clip::select([
                'clips.slug',
                'clips.thumbnail',
                'clips.title',
                'clips.duration',
                'broadcasters.display_name'
            ])
            ->when(Auth::check(), function ($query) use ($request) {
                return $query
                    ->leftJoin('clip_views', function ($join) use ($request) {
                        $join->on('clips.id', '=', 'clip_views.clip_id')
                            ->where('clip_views.user_id', $request->user()->id);
                    })
                    ->where('clip_views.user_id', null);
            })
            ->join('broadcasters', 'clips.broadcaster_id', '=', 'broadcasters.id')
            ->where('clips.id', '<>', $clip->id)
            ->where('clips.score', '<', $clip->score)
            ->orderBy('clips.score', 'desc')
            ->first();

        return Inertia::render('clip', [
            'clip' => $clip,
            'following' => Auth::check() ? $request->user()->isFollowing($clip->broadcaster) : false,
            'comment_id' => ($comment_id) ? "&comment_id={$hashids->decode($comment_id)[0]}" : null
        ]);
    }

    public function update(UpdateClipRequest $request, Clip $clip)
    {
        Clip::withoutSyncingToSearch(function () use ($request, $clip) {
            if ($request->has('out_of_context')) {
                $clip->out_of_context = $request->input('out_of_context');
                $clip->save();
            }

            if ($request->has('locked')) {
                $clip->locked = $request->input('locked');
                $clip->save();
            }

            if ($request->has('spoiler')) {
                $clip->spoiler = $request->input('spoiler');
                $clip->save();
            }

            if ($request->has('loud')) {
                $clip->loud = $request->input('loud');
                $clip->save();
            }

            // if ($request->has('tos')) {
            //     $clip->tos = $request->input('tos');
            //     $clip->save();
            // }

            if ($request->has('notifyComments')) {
                $clip->notify_comments = $request->input('notifyComments');
                $clip->save();
            }
        });

        if ($request->has('redirect')) {
            return redirect()->back();
        }
    }

    public function destroy(Request $request, $id)
    {
        $clip = Clip::withTrashed()->where('id', $id)->first();

        abort_if(!Gate::allows('update-delete-clip', $clip), 403);

        if ($request->user()->id === $clip->user_id) {
            DeleteClipAssets::dispatch($clip->thumbnail);

            $clip->forceDelete();

            if ($request->has('redirect')) {
                return redirect("/" . $request->query('redirect'));
            }
        } else {
            if ($clip->deleted_at) {
                $clip->deleted_by = null;

                $clip->save();

                $clip->restore();
            } else {
                $clip->delete();
            }

            if ($request->has('redirect')) {
                return redirect()->back();
            }
        }
    }
}
