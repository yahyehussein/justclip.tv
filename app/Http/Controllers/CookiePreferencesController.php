<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CookiePreferencesController extends Controller
{
    public function index()
    {
        return Inertia::render('account/cookiepreferences');
    }
}
