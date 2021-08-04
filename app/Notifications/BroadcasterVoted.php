<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Models\Notification as NotificationModel;
use Illuminate\Notifications\Messages\MailMessage;

class BroadcasterVoted extends Notification implements ShouldQueue
{
    use Queueable;

    private $type;
    private $clip;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($type, $clip)
    {
        $this->type = $type;
        $this->clip = $clip;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        $notification = NotificationModel::where('data->type', $this->type)
            ->where('data->user->id', $this->clip->broadcaster->id)
            ->where('data->clip->id', $this->clip->id)
            ->exists();

        if ($notification) {
            return [];
        }

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
                'id' => $this->clip->broadcaster->id,
                'display_name' => $this->clip->broadcaster->display_name,
                'avatar' => $this->clip->broadcaster->avatar,
            ],
            'clip' => [
                'id' => $this->clip->id,
                'slug' => $this->clip->slug,
                'title' => $this->clip->title,
                'broadcaster_id' => $this->clip->broadcaster_id,
                'broadcaster' => [
                    'display_name' => $this->clip->broadcaster->display_name
                ],
                'category' => [
                    'name' => $this->clip->category->name
                ],
            ]
        ];
    }
}
