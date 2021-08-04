<?php

namespace App\Models;

use App\Models\Clip;
use App\Models\Broadcaster;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'box_art_url'
    ];

    public function clips()
    {
        return $this->hasMany(Clip::class);
    }
}
