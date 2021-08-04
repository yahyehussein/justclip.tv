<?php

namespace App\Providers;

use App\Events\ClipCreated;
use App\Listeners\NotifyUser;
use App\Events\CommentCreated;
use App\Listeners\ProcessClip;
use Illuminate\Auth\Events\Registered;
use SocialiteProviders\Manager\SocialiteWasCalled;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ClipCreated::class => [
            ProcessClip::class,
        ],
        CommentCreated::class => [
            NotifyUser::class,
        ],
        SocialiteWasCalled::class => [
            // add your listeners (aka providers) here
            'SocialiteProviders\\Twitch\\TwitchExtendSocialite@handle'
        ],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
