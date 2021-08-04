<?php

namespace App\Http\Controllers;

use App\Models\Clip;
use App\Models\ClipVote;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\RankingService;
use Illuminate\Support\Facades\DB;
use App\Notifications\BroadcasterVoted;

class ClipUpVoteController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token']);
    }

    public function store(Request $request, Clip $clip)
    {
        $user = $request->user();

        DB::table('clip_votes')
            ->upsert(
                [
                    'vote_type' => 1,
                    'clip_id' => $clip->id,
                    'user_id' => $user->id,
                    'client_ip' => $request->ip(),
                    'created_at' => Carbon::now()
                ],
                ['clip_id', 'user_id'],
            );

        if ($user->id === $clip->broadcaster_id) {
            Clip::withoutSyncingToSearch(function () use ($clip) {
                $clip->hearted = true;
                $clip->save();
            });

            if ($clip->user->notify_comments) {
                if ($clip->notify_comments) {
                    $clip->user->notify(new BroadcasterVoted('upvote', $clip));
                }
            }
        }

        Clip::withoutSyncingToSearch(function () use ($clip) {
            $rankingService = new RankingService();
            $clip->score = $rankingService->hotness($clip->upvotes()->count(), $clip->downvotes()->count(), $clip->created_at->timestamp);
            $clip->save();
        });
    }

    public function destroy(Request $request, Clip $clip)
    {
        ClipVote::where('clip_id', $clip->id)->where('user_id', $request->user()->id)->delete();

        Clip::withoutSyncingToSearch(function () use ($clip) {
            $rankingService = new RankingService();
            $clip->score = $rankingService->hotness($clip->upvotes()->count(), $clip->downvotes()->count(), $clip->created_at->timestamp);
            $clip->save();
        });
    }
}
