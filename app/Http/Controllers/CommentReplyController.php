<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CommentReplyController extends Controller
{
    public function index(Request $request, $comment_id)
    {
        // BUG descendants duplicate and order by
        return Comment::withTrashed()
            ->find($comment_id)
            ->replies()
            ->with([
                'user:id,login,display_name,avatar',
                'comment:id,user_id,comment_id',
                'roles'
            ])
            ->when(Auth::check(), function ($query) use ($request) {
                return $query->with([
                    'voted' => function ($query) use ($request) {
                        $query->where('user_id', $request->user()->id);
                    }
                ]);
            })
            ->withCount([
                'upvotes',
                'downvotes'
            ])
            ->simplePaginate(10)
            ->setPath("/json/replies/$comment_id");
    }
}
