<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClipView extends Model
{
    use HasFactory;

    protected $fillable = [
        'clip_id',
        'user_id',
        'client_ip'
    ];

    protected $hidden = [
        'client_ip'
    ];
}
