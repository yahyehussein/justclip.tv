<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClipVote extends Model
{
    use HasFactory;

    protected $fillable = [
        'clip_id',
        'user_id',
        'vote_type',
        'client_ip'
    ];

    protected $hidden = [
        'client_ip'
    ];
}
