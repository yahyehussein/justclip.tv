<?php

namespace App\Http\Controllers;

use App\Models\ClipBulletChat;
use Illuminate\Http\Request;

class ClipbulletchatController extends Controller
{
    public function index(Request $request)
    {
        $clipBulletChat = ClipBulletChat::where('clip_id', $request->query('id'))->get();

        return response()->json([
            'code' => 0,
            'data' => $clipBulletChat
        ]);
    }
}
