<?php

namespace App\Models;

use App\Models\Clip;
use App\Models\Report;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClipBulletChat extends Model
{
    use HasFactory;

    protected $fillable = [
        'color',
        'author',
        'text',
        'time',
        'emotes',
        'user_id',
        'clip_id'
    ];

    protected $casts = [
        'emotes' => 'array'
    ];

    public function clip()
    {
        return $this->belongsTo(Clip::class);
    }

    public function report()
    {
        return $this->morphOne(Report::class, 'reportable');
    }
}
