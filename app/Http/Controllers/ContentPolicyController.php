<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class ContentPolicyController extends Controller
{
    public function index()
    {
        return Inertia::render('content-policy');
    }
}
