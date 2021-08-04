<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class News extends Model
{
    use HasFactory;

    protected $casts = [
        'tweet_id' => 'string'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
