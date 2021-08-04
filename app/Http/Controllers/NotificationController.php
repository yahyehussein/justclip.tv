<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = $request->user();

        $notifications = $user->notifications()
            ->simplePaginate(5)
            ->setPath('/json/notifications');

        $unread = collect(['unread' => $user->unreadNotifications->count()]);

        return $unread->merge($notifications);
    }

    public function update(Request $request, $id)
    {
        if ($id === "all") {
            $request->user()->unreadNotifications()->update(['read_at' => now()]);
        } else {
            $notification = Notification::find($id);
            $notification->read_at = now();

            $notification->save();
        }
    }

    public function destroy($id)
    {
        Notification::destroy($id);
    }
}
