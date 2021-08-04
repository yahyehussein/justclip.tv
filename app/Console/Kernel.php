<?php

namespace App\Console;

use App\Models\Clip;
use App\Models\User;
use App\Models\Broadcaster;
use App\Models\Leaderboard;
use Illuminate\Support\Carbon;
use App\Services\RankingService;
use Illuminate\Support\Facades\Http;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Calculate Broadcasters Today Votes
        $schedule->call(function () {
            Broadcaster::withCount(['upvotes', 'downvotes'])
            ->chunkById(200, function ($broadcasters) {
                $broadcasters->each(function ($broadcaster) {
                    $broadcaster->votes = $broadcaster->upvotes_count - $broadcaster->downvotes_count;
                    $broadcaster->timestamps = false;
                    $broadcaster->save();
                });
            }, $column = 'id');
        })->hourly();

        // Rank Leaderboard
        $schedule->call(function () {
            User::with(['clips' => function($query) {
                    $query->whereDate('clips.created_at', Carbon::today())
                        ->withCount(['upvotes', 'downvotes']);
                }])
                ->chunkById(200, function ($users) {
                    $users->each(function ($user) {
                        if ($user->clips->isNotEmpty()) {
                            $broadcaster_id = collect([]);
                            $category_id = collect([]);
                            $current_points = 0;

                            foreach ($user->clips as $clip) {
                                $current_points += $clip->upvotes_count - $clip->downvotes_count;

                                if ($clip->upvotes_count - $clip->downvotes_count >= 1) {
                                    $broadcaster_id->push($clip->broadcaster_id);
                                    $category_id->push($clip->category_id);
                                }
                            }

                            Leaderboard::updateOrCreate(
                                ['user_id' => $user->id],
                                [
                                    'current_points' => $current_points,
                                    'broadcaster_id' => $broadcaster_id,
                                    'category_id' => $category_id
                                ]
                            );
                        }
                    });
                }, $column = 'id');
        })->hourly();

        // Score Clips
        $schedule->call(function () {
            Clip::withoutSyncingToSearch(function () {
                Clip::withCount(['upvotes', 'downvotes'])
                ->chunkById(200, function ($clips) {
                    $clips->each(function ($clip) {
                        $rankingService = new RankingService();
                        $clip->score = $rankingService->hotness($clip->upvotes_count, $clip->downvotes_count, $clip->created_at->timestamp);
                        $clip->save();
                    });
                }, $column = 'id');
            });
        })->everySixHours();

        // Store previous_rank Leaderboard
        $schedule->call(function () {
            Leaderboard::chunkById(200, function ($leaderboards) {
                $leaderboards->each(function ($leaderboard) {
                    $leaderboard->previous_points = $leaderboard->current_points;
                    $leaderboard->current_points = 0;
                    $leaderboard->save();
                });
            }, $column = 'id');
        })->daily();

        // Unsubscribe Inactive Broadcasters eventSub
        $schedule->call(function () {
            Broadcaster::whereNotNull('subscriptions')
                ->whereNotBetween('updated_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->chunkById(200, function ($broadcasters) {
                    $broadcasters->each(function ($broadcaster) {
                        Http::asJson()
                            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
                            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
                            ->delete("https://api.twitch.tv/helix/eventsub/subscriptions?id={$broadcaster->subscriptions->channel_update}");

                        Http::asJson()
                            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
                            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
                            ->delete("https://api.twitch.tv/helix/eventsub/subscriptions?id={$broadcaster->subscriptions->stream_online}");

                        Http::asJson()
                            ->withHeaders(['Client-Id' => env('TWITCH_CLIENT_ID')])
                            ->withToken(env('TWITCH_APP_ACCESS_TOKEN'))
                            ->delete("https://api.twitch.tv/helix/eventsub/subscriptions?id={$broadcaster->subscriptions->stream_offline}");

                        $broadcaster->subscriptions = null;
                        $broadcaster->timestamps = false;
                        $broadcaster->save();
                    });
                }, $column = 'id');
        })->weekly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
