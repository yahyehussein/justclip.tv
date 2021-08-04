<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Connection;
use Illuminate\Http\Request;;

class UploadController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        return Inertia::render('upload');
    }
}
