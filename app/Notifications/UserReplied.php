<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserReplied extends Notification
{
    use Queueable;

    private $type;
    private $clip;
    private $comment;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($type, $clip, $comment)
    {
        $this->type = $type;
        $this->clip = $clip;
        $this->comment = $comment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'type' => $this->type,
            'user' => [
                'display_name' => $this->comment->user->display_name,
                'avatar' => $this->comment->user->avatar,
            ],
            'clip' => [
                'slug' => $this->clip->slug,
                'title' => $this->clip->title,
                'broadcaster_id' => $this->clip->broadcaster_id,
                'broadcaster' => [
                    'display_name' => $this->clip->broadcaster->display_name
                ],
                'category' => [
                    'name' => $this->clip->category->name
                ],
            ],
            'comment' => $this->comment
        ];
    }
}
