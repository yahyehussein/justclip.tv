<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Http\Requests\UpdateUserRequest;

class SettingController extends Controller
{
    public function __construct() {
        $this->middleware('auth')->only(['index']);
    }

    public function index()
    {
        return Inertia::render("settings");
    }

    public function updateNotifyComments(UpdateUserRequest $request, User $user)
    {
        if ($user->notify_comments) {
            User::withoutSyncingToSearch(function () use ($user) {
                $user->notify_comments = false;
                $user->save();
            });

            return redirect()->back();
        }

        User::withoutSyncingToSearch(function () use ($user) {
            $user->notify_comments = true;
            $user->save();
        });

        return redirect()->back();
    }

    public function updateNotifyReplies(UpdateUserRequest $request, User $user)
    {
        if ($user->notify_replies) {
            User::withoutSyncingToSearch(function () use ($user) {
                $user->notify_replies = false;
                $user->save();
            });

            return redirect()->back();
        }

        User::withoutSyncingToSearch(function () use ($user) {
            $user->notify_replies = true;
            $user->save();
        });

        return redirect()->back();
    }
}
