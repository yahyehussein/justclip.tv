<?php

namespace App\Http\Controllers;

use App\Models\ClipView;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ClipViewController extends Controller
{
    public function store(Request $request)
    {
        $viewed = new ClipView();
        $viewed->clip_id = $request->input('clip_id');
        $viewed->user_id = Auth::check() ? $request->user()->id : null;
        $viewed->client_ip = $request->ip();

        $viewed->save();
    }
}
