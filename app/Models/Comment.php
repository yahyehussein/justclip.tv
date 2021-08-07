<?php

namespace App\Models;

use App\Models\Clip;
use App\Models\Role;
use App\Models\User;
use App\Models\Report;
use App\Models\CommentVote;
use App\Events\CommentCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class Comment extends Model
{
    use HasFactory;
    use HasRecursiveRelationships;
    use SoftDeletes;

    protected $casts = [
        'emotes' => 'array',
        'sticky' => 'boolean',
        'in_chat' => 'object',
        'top_clipper' => 'boolean'
    ];

    protected $dispatchesEvents = [
        'created' => CommentCreated::class
    ];

    public function getParentKeyName()
    {
        return 'comment_id';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function upvotes()
    {
        return $this->hasMany(CommentVote::class)->where('vote_type', 1);
    }

    public function downvotes()
    {
        return $this->hasMany(CommentVote::class)->where('vote_type', 0);
    }

    public function voted()
    {
        return $this->hasOne(CommentVote::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', null, 'user_id');
    }

    public function clip()
    {
        return $this->belongsTo(Clip::class);
    }

    public function report()
    {
        return $this->morphOne(Report::class, 'reportable');
    }

    public function comment()
    {
        return $this->belongsTo(Comment::class)->with('user:id,login,display_name');
    }

    public function reply_count()
    {
        return $this->hasManyOfDescendantsAndSelf(Comment::class)->withTrashedDescendants();
    }

    public function replies()
    {
        return $this->hasManyOfDescendantsAndSelf(Comment::class)
            ->withTrashedDescendants()
            ->orderByRaw(DB::raw('
                ((upvotes_count + 1.9208) / (upvotes_count + downvotes_count) - 1.96 *
                SQRT((upvotes_count * downvotes_count) / (upvotes_count + downvotes_count) + 0.9604) /  (upvotes_count + downvotes_count)) / (1 + 3.8416 / (upvotes_count + downvotes_count))
                DESC
            '));
    }
}
