<?php

namespace App\Http\Controllers;

use App\Models\CommentVote;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CommentUpVoteController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token']);
    }

    public function store(Request $request, $comment_id)
    {
        DB::table('comment_votes')
            ->upsert(
                [
                    'vote_type' => 1,
                    'comment_id' => $comment_id,
                    'user_id' => $request->user()->id,
                    'client_ip' => $request->ip(),
                    'created_at' => Carbon::now()
                ],
                ['comment_id', 'user_id'],
            );
    }

    public function destroy(Request $request, $comment_id)
    {
        CommentVote::where('comment_id', $comment_id)->where('user_id', $request->user()->id)->delete();
    }
}
