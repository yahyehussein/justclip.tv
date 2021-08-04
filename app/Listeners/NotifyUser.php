<?php

namespace App\Listeners;

use App\Models\Clip;
use App\Models\User;
use App\Models\Comment;
use App\Events\CommentCreated;
use App\Notifications\UserReplied;
use App\Notifications\UserCommented;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyUser implements ShouldQueue
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  CommentCreated  $event
     * @return void
     */
    public function handle(CommentCreated $event)
    {
        $clip = Clip::find($event->comment->clip_id);

        if ($event->comment->comment_id) {
            $comment_id = Comment::find($event->comment->comment_id);

            if ($comment_id->user->notify_replies) {
                if ($event->comment->user_id !== $comment_id->user_id) {
                    $comment_id->user->notify(new UserReplied('reply', $clip, $event->comment));
                }
            }
        } else {
            if ($event->comment->user_id !== $clip->user_id) {
                if ($clip->user->notify_comments) {
                    if ($clip->notify_comments) {
                        $clip->user->notify(new UserCommented('comment', $clip, $event->comment));
                    }
                }
            }
        }
    }
}
