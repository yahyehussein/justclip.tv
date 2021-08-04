<?php

namespace App\Models;

use App\Models\User;
use App\Models\Report;
use App\Models\Comment;
use App\Models\Category;
use App\Models\ClipView;
use App\Events\ClipCreated;
use App\Models\Broadcaster;
use Laravel\Scout\Searchable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Clip extends Model
{
    use HasFactory, SoftDeletes, Searchable;

    protected $fillable = [
        'slug',
        'title',
        'thumbnail',
        'duration',
        'offset',
        'mirror',
        'spoiler',
        'tos',
        'hearted',
        'video_id',
        'category_id',
        'creator_id',
        'broadcaster_id',
        'user_id',
        'notify_comments',
        'video_created_at'
    ];

    protected $hidden = [
        'creator_id'
    ];

    protected $dispatchesEvents = [
        'created' => ClipCreated::class
    ];

    protected $casts = [
        'spoiler' => 'boolean',
        'tos' => 'boolean',
        'locked' => 'boolean',
        'out_of_context' => 'boolean',
        'hearted' => 'boolean',
        'notify_comments' => 'boolean',
        'deleted_by' => 'object'
    ];

    public function toSearchableArray()
    {
        $array = $this->toArray();

        $clipper = User::find($array['user_id']);

        return [
            'id' => $array['id'],
            'title' => $array['title'],
            'clipper' => $clipper ? $clipper->login : null,
            'broadcaster' => Broadcaster::find($array['broadcaster_id'])->login,
            'category' => Category::find($array['category_id'])->name
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function broadcaster()
    {
        return $this->belongsTo(Broadcaster::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function voted()
    {
        return $this->hasOne(ClipVote::class);
    }

    public function upvotes()
    {
        return $this->hasMany(ClipVote::class)->where('vote_type', 1);
    }

    public function downvotes()
    {
        return $this->hasMany(ClipVote::class)->where('vote_type', 0);
    }

    public function views()
    {
        return $this->hasMany(ClipView::class);
    }

    public function next()
    {
        return $this->hasOne(Clip::class, 'id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->withTrashed();
    }

    public function report()
    {
        return $this->morphOne(Report::class, 'reportable');
    }
}
