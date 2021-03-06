<?php

namespace App\Http\Controllers;

use App\Models\Broadcaster;
use Illuminate\Http\Request;

class StreamController extends Controller
{
    public function store(Request $request)
    {
        // Log::info([
        //     'body' => $request->getContent()
        // ]);

        // $hmac_message = $request->header('Twitch-Eventsub-Message-Id') . $request->header('Twitch-Eventsub-Message-Timestamp') . $request->getContent();
        // $expected_signature_header = 'sha256=' . hash('sha256', '4nP2bCnB.cF\c2{j' . $hmac_message);

        // Log::info([
        //     'hmac_message' => $hmac_message,
        //     'Twitch-Eventsub-Message-Signature' => $request->header('Twitch-Eventsub-Message-Signature'),
        //     'expected_signature_header' => $expected_signature_header,
        //     'varify' => $request->header('Twitch-Eventsub-Message-Signature') != $expected_signature_header
        // ]);

        if ($request->input('challenge')) {
            return response($request->input('challenge'), 200, ['Content-Type' => 'text/plain']);
        }

        switch ($request->input('subscription')['type']) {
            case 'channel.update':
                $broadcaster = Broadcaster::find($request->input('event')['broadcaster_user_id']);
                $broadcaster->title = $request->input('event')['title'];
                $broadcaster->category = $request->input('event')['category_name'];
                $broadcaster->timestamps = false;
                $broadcaster->save();
                break;

            case 'stream.online':
                $broadcaster = Broadcaster::find($request->input('event')['broadcaster_user_id']);
                $broadcaster->type = $request->input('event')['type'];
                $broadcaster->started_at = $request->input('event')['started_at'];
                $broadcaster->timestamps = false;
                $broadcaster->save();
                break;

            case 'stream.offline':
                $broadcaster = Broadcaster::find($request->input('event')['broadcaster_user_id']);
                $broadcaster->type = null;
                $broadcaster->title = null;
                $broadcaster->category = null;
                $broadcaster->timestamps = false;
                $broadcaster->save();
                break;

            default:
                break;
        }

        return response("", 200, ['Content-Type' => 'text/plain']);
    }
}
