<?php

namespace App\Http\Controllers;

use App\Models\Clip;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class UserCommentController extends Controller
{
    public function index(Request $request, $user_id)
    {
        return Clip::select(['id','slug','title','thumbnail','user_id','broadcaster_id','spoiler','tos','score','created_at'])
            ->whereHas('comments', function ($query) use ($user_id)  {
                $query->withTrashed()->where('user_id', $user_id);
            })
            ->with([
                'comments' => function ($query) use ($request, $user_id) {
                    $query->withTrashed()
                        ->where('user_id', $user_id)
                        ->with(['user:id,login,display_name,avatar', 'roles'])
                        ->when(Auth::check(), function ($query) use ($request) {
                            return $query->with([
                                'voted' => function ($query) use ($request) {
                                    $query->where('user_id', $request->user()->id);
                                }
                            ]);
                        })
                        ->withCount([
                            'upvotes',
                            'downvotes',
                            'reply_count as replies'
                        ])
                        ->latest();
                }
            ])
            ->when($request->has('hot'), function ($query) {
                return $query->orderBy('score', 'desc');
            })
            ->when($request->has('newest'), function ($query) {
                return $query->orderBy('created_at', 'desc');
            })
            ->simplePaginate(10)
            ->appends(['hot' => $request->query('hot')])
            ->appends(['newest' => $request->query('newest')])
            ->setPath("/json/$user_id/comments");
    }
}
