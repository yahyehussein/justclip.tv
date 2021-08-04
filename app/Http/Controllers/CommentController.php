<?php

namespace App\Http\Controllers;

use App\Http\Requests\DestroyCommentRequest;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Requests\UpdateCommentRequest;
use App\Models\ClipBulletChat;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token'])
            ->only(['store', 'update', 'destroy']);
    }

    public function index(Request $request)
    {
        return Comment::withTrashed()
            ->when($request->query('comment_id'), function ($query) use ($request) {
                $comment = $query->find($request->query('comment_id'));

                abort_if(!$comment, response()->json(['message' => 'Comment deleted by user'], 404));

                if ($comment->comment_id) {
                    return $comment->parent()
                        ->withTrashed()
                        ->with([
                            'children' => function ($query) use ($request) {
                                $query->where('id', $request->query('comment_id'))
                                    ->with([
                                        'user:id,login,display_name,avatar',
                                        'roles'
                                    ]);
                            }
                        ]);
                }

                return $query->where('id', $request->query('comment_id'));
            })
            ->when(!$request->query('comment_id'), function ($query) use ($request) {
                return $query->whereNull('comment_id');
            })
            ->where('clip_id', $request->query('clip_id'))
            ->with([
                'user:id,login,display_name,avatar',
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
                'downvotes',
                'reply_count as replies'
            ])
            ->when($request->has('best'), function ($query) {
                return $query->orderByRaw(DB::raw('
                    sticky DESC,
                    ((upvotes_count + 1.9208) / (upvotes_count + downvotes_count) - 1.96 *
                    SQRT((upvotes_count * downvotes_count) / (upvotes_count + downvotes_count) + 0.9604) /  (upvotes_count + downvotes_count)) / (1 + 3.8416 / (upvotes_count + downvotes_count))
                    DESC
                '));
            })
            ->when($request->has('newest'), function ($query) {
                return $query->latest();
            })
            ->when($request->has('oldest'), function ($query) use ($request) {
                return $query->oldest();
            })
            ->simplePaginate(20)
            ->appends(['clip_id' => $request->query('clip_id')])
            ->appends(['best' => $request->query('best')])
            ->appends(['newest' => $request->query('newest')])
            ->appends(['oldest' => $request->query('oldest')])
            ->setPath('/json/comments');
    }

    public function store(StoreCommentRequest $request)
    {
        $comment = new Comment();
        $comment->text = $request->input('text');
        $comment->clip_id = $request->input('clip_id');
        $comment->user_id = $request->user()->id;
        $comment->emotes =  $request->input('emotes');
        $comment->in_chat =  ClipBulletChat::where('clip_id', $request->input('clip_id'))->where('user_id', $request->user()->id)->first();
        $comment->comment_id = $request->input('comment_id');

        $comment->save();

        return [
            'id' => $comment->id,
            'text' => $comment->text,
            'emotes' => $comment->emotes,
            'created_at' => $comment->created_at,
            'updated_at' => $comment->updated_at,
            'deleted_at' => $comment->deleted_at,
            'upvotes' => 0,
            'downvotes' => 0,
            'in_chat' => $comment->in_chat,
            'comment_id' => $request->input('comment_id'),
            'user' => [
                'id' => $request->user()->id,
                'login' => $request->user()->login,
                'display_name' => $request->user()->display_name,
                'avatar' => $request->user()->avatar,
            ],
            'voted' => null,
            'replies' => 0,
            'roles' => $request->user()->roles
        ];
    }

    public function update(UpdateCommentRequest $request, Comment $comment)
    {
        if ($request->has('sticky')) {
            $comment->sticky = $request->input('sticky') === true ?: null;
            $comment->timestamps = false;

            $comment->save();
        } else {
            $comment->text = $request->input('text');
            $comment->emotes = $request->input('emotes');

            $comment->save();
        }
    }

    public function destroy(DestroyCommentRequest $request, Comment $comment)
    {
        $deleted_by = null;

        if ($comment->user_id !== $request->user()->id) {
            foreach ($request->user()->roles as $value) {
                if ($value->role === "admin") {
                    $deleted_by = "admin";
                } else if ($value->role === "global_mod") {
                    $deleted_by = "global moderator";
                }
            }
        }

        if ($deleted_by || Comment::where('comment_id', $comment->id)->exists()) {
            $comment->deleted_by = $deleted_by;

            $comment->save();

            $comment->delete();
        } else {
            $comment->forceDelete();
        }
    }
}
