<?php

namespace App\Http\Controllers;

use App\Models\Clip;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\ClipBulletChat;
use App\Models\Report;

class ReportController extends Controller
{
    public function __construct() {
        $this->middleware(['can:is-admin-mod', 'validate.token'])
            ->only(['clips', 'clipBulletChats', 'comments', 'users', 'destroy']);
    }

    public function clips(Request $request)
    {
        return Inertia::render('reports/clips', [
            'clips' => Clip::has('report')
                ->with('report')
                ->withCount('report')
                ->orderByDesc('report_count')
                ->paginate(20)
                ->setPath('/clips/reports'),
            'clips_count' => Clip::has('report')->count(),
            'clip_bullet_chats_count' => ClipBulletChat::has('report')->count(),
            'comments_count' => Comment::has('report')->count(),
            'users_count' => User::has('report')->count()

        ]);
    }

    public function clipBulletChats(Request $request)
    {
        return Inertia::render('reports/clip-bullet-chats', [
            'clipBulletChats' => ClipBulletChat::has('report')
                ->with(['clip', 'report'])
                ->withCount('report')
                ->orderByDesc('report_count')
                ->paginate(20)
                ->setPath('/clip-bullet-chats/reports'),
            'clips_count' => Clip::has('report')->count(),
            'clip_bullet_chats_count' => ClipBulletChat::has('report')->count(),
            'comments_count' => Comment::has('report')->count(),
            'users_count' => User::has('report')->count()
        ]);
    }

    public function comments(Request $request)
    {
        return Inertia::render('reports/comments', [
            'comments' => Comment::has('report')
                ->with(['user:id,login,display_name,avatar', 'clip', 'report'])
                ->withCount('report')
                ->orderByDesc('report_count')
                ->paginate(20)
                ->setPath('/comments/reports'),
            'clips_count' => Clip::has('report')->count(),
            'clip_bullet_chats_count' => ClipBulletChat::has('report')->count(),
            'comments_count' => Comment::has('report')->count(),
            'users_count' => User::has('report')->count()
        ]);
    }

    public function users(Request $request)
    {
        return Inertia::render('reports/users', [
            'users' => User::has('report')
                ->with('report')
                ->withCount('report')
                ->orderByDesc('report_count')
                ->paginate(20)
                ->setPath('/users/reports'),
            'clips_count' => Clip::has('report')->count(),
            'clip_bullet_chats_count' => ClipBulletChat::has('report')->count(),
            'comments_count' => Comment::has('report')->count(),
            'users_count' => User::has('report')->count()
        ]);
    }

    public function store(Request $request)
    {
        switch ($request->input('report')['type']) {
            case 'clip':
                $report = new Report(['report' => $request->input('report')]);
                $clip = Clip::find($request->input('clip_id'));
                $clip->report()->save($report);
                break;

            case 'bullet chat':
                $report = new Report(['report' => $request->input('report')]);
                $clipBulletChat = ClipBulletChat::find($request->input('bullet_chat_id'));
                $clipBulletChat->report()->save($report);
                break;

            case 'comment':
                $report = new Report(['report' => $request->input('report')]);
                $comment = Comment::find($request->input('comment_id'));
                $comment->report()->save($report);
                break;

            case 'user':
                $report = new Report(['report' => $request->input('report')]);
                $user = User::find($request->input('user_id'));
                $user->report()->save($report);
                break;

            default:
                break;
        }
    }

    public function destroy(Request $request, $id)
    {
        switch ($request->query('type')) {
            case 'clip':
                $clip = Clip::find($id);

                if ($request->query('approved') === "1") {
                    $clip->report()->delete();

                    $clip->deleted_by = [
                        'id' => $request->user()->id,
                        'login' => $request->user()->login,
                        'display_name' => $request->user()->display_name,
                        'rule' => $request->query('rule'),
                    ];

                    $clip->save();

                    $clip->delete();
                } else if ($request->query('approved') === "0") {
                    $clip->report()->delete();
                }

                break;

            case 'bullet chat':
                $clipBulletChat = ClipBulletChat::find($id);

                if ($request->query('approved') === "1") {
                    $clipBulletChat->report()->delete();
                    $clipBulletChat->delete();
                } else if ($request->query('approved') === "0") {
                    $clipBulletChat->report()->delete();
                }
                break;

            case 'comment':
                $comment = Comment::find($id);

                if ($request->query('approved') === "1") {
                    $comment->report()->delete();

                    foreach ($request->user()->roles as $value) {
                        if ($value->role === "admin") {
                            $comment->deleted_by = "admin";
                            $comment->save();
                            break;
                        } else if ($value->role === "global_mod") {
                            $comment->deleted_by = "global moderator";
                            $comment->save();
                            break;
                        }
                    }

                    $comment->delete();
                } else if ($request->query('approved') === "0") {
                    $comment->report()->delete();
                }
                break;

            case 'user':
                $user = User::find($id);

                if ($request->query('approved') === "1") {
                    $user->report()->delete();
                    $user->delete();
                } else if ($request->query('approved') === "0") {
                    $user->report()->delete();
                }
                break;

            default:
                break;
        }

        if (!$request->expectsJson()) {
            return redirect()->back();
        }
    }
}
