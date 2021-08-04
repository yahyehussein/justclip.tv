<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'reportable_type',
        'reportable_id',
        'report'
    ];

    protected $casts = [
        'report' => 'array'
    ];

    public function reportable()
    {
        return $this->morphTo();
    }
}
