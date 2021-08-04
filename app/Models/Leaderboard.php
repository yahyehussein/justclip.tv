<?php

namespace App\Models;

use Illuminate\Support\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Leaderboard extends Model
{
    use HasFactory;

    protected $fillable = [
        'previous_points',
        'current_points',
        'user_id',
        'broadcaster_id',
        'category_id'
    ];

    protected $casts = [
        'broadcaster_id' => 'array',
        'category_id' => 'array'
    ];

    protected $hidden = [
        'broadcaster_id',
        'category_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
