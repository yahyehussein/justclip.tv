<?php

namespace App\Models;

use App\Models\Clip;
use App\Models\ClipVote;
use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Broadcaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'login',
        "display_name",
        'about',
        'avatar',
        'banner',
        'partner',
        'votes',
        'channel_id',
        'type',
        'title',
        'category',
        'started_at'
    ];

    protected $casts = [
        'partner' => 'boolean',
        'subscriptions' => 'object'
    ];

    public function clips()
    {
       return $this->hasMany(Clip::class);
    }

    public function upvotes()
    {
        return $this->hasManyThrough(ClipVote::class, Clip::class)
            ->where('vote_type', 1)
            ->whereDate('clip_votes.created_at', Carbon::today());
    }

    public function downvotes()
    {
        return $this->hasManyThrough(ClipVote::class, Clip::class)
            ->where('vote_type', 0)
            ->whereDate('clip_votes.created_at', Carbon::today());
    }

    public function followers() {
        return $this->hasManyThrough(User::class, Follow::class, 'broadcaster_id', 'id', 'id', 'user_id');
    }
}
