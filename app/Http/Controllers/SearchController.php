<?php

namespace App\Http\Controllers;

use App\Models\Broadcaster;
use App\Models\Clip;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        switch ($request->query('type')) {
            case 'clippers':
                $users = User::search($request->query('q'))
                    ->simplePaginate(20)
                    ->appends(['type' => 'clippers'])
                    ->setPath('/json/search/clippers');

                $users->load('roles');

                if ($request->expectsJson()) {
                    return $users;
                }

                return Inertia::render('search', [
                    'q' => $request->query('q'),
                    'type' => $request->query('type'),
                    'clip' => $users
                ]);
                break;

            case 'clips':
                $clips = Clip::search($request->query('q'))
                    ->simplePaginate(20)
                    ->appends(['type' => 'clips'])
                    ->setPath('/json/search/clips');

                $clips->load([
                    'user:id,login,display_name',
                    'broadcaster:id,login,display_name,avatar',
                    'category:id,name'
                ]);

                if ($request->expectsJson()) {
                    return $clips;
                }

                return Inertia::render('search', [
                    'q' => $request->query('q'),
                    'type' => $request->query('type'),
                    'clip' => $clips
                ]);
                break;

            default:
                $users = User::search($request->query('q'))->simplePaginate(3);

                $users->load('roles');

                $clips = Clip::search($request->query('q'))->simplePaginate(3);

                $clips->load([
                    'user:id,login,display_name',
                    'broadcaster:id,login,display_name,avatar',
                    'category:id,name'
                ]);

                return Inertia::render('search', [
                    'q' => $request->query('q'),
                    'clipper' => $users,
                    'clip' => $clips
                ]);
                break;
        }
    }
}
