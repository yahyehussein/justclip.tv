<?php

namespace App\Models;

use App\Models\Clip;
use App\Models\News;
use App\Models\Role;
use App\Models\Follow;
use App\Models\Report;
use App\Models\Comment;
use App\Models\ClipVote;
use App\Models\CommentVote;
use Laravel\Scout\Searchable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'login',
        "display_name",
        'email',
        'about',
        'avatar',
        'access_token',
        'refresh_token'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'email',
        'access_token',
        'refresh_token',
        'remember_token'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'background' => 'array',
        'blocked_broadcasters' => 'array',
        'blocked_categories' => 'array'
    ];

    public $incrementing = false;

    public function toSearchableArray()
    {
        $array = $this->toArray();

        return [
            'id' => $array['id'],
            'login' => $array['login'],
            'display_name' => $array['display_name']
        ];
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function clips()
    {
        return $this->hasMany(Clip::class);
    }

    public function news()
    {
        return $this->hasMany(News::class);
    }

    public function clip_upvotes()
    {
        return $this->hasManyThrough(ClipVote::class, Clip::class)->where('vote_type', 1);
    }

    public function clip_downvotes()
    {
        return $this->hasManyThrough(ClipVote::class, Clip::class)->where('vote_type', 0);
    }

    public function comment_upvotes()
    {
        return $this->hasManyThrough(CommentVote::class, Comment::class)->where('vote_type', 1);
    }

    public function comment_downvotes()
    {
        return $this->hasManyThrough(CommentVote::class, Comment::class)->where('vote_type', 0);
    }

    public function follow(Broadcaster $broadcaster) {
        if(!$this->isFollowing($broadcaster)) {
            Follow::create([
                'user_id' => auth()->id(),
                'broadcaster_id' => $broadcaster->id
            ]);
        }
    }

    public function unfollow(Broadcaster $broadcaster) {
        Follow::where('user_id', auth()->id())->where('broadcaster_id', $broadcaster->id)->delete();
    }

    public function isFollowing(Broadcaster $broadcaster) {
        return $this->following()->where('broadcasters.id', $broadcaster->id)->exists();
    }

    public function following() {
        return $this->hasManyThrough(Broadcaster::class, Follow::class, 'user_id', 'id', 'id', 'broadcaster_id');
    }

    public function report()
    {
        return $this->morphOne(Report::class, 'reportable');
    }
}
