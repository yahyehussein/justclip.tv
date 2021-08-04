<?php

namespace App\Events;

use App\Models\Clip;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class ClipCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $clip;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Clip $clip)
    {
        $this->clip = $clip;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('channel-name');
    }
}
