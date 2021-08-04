<?php

namespace App\Providers;

use App\Models\Clip;
use App\Models\Comment;
use App\Models\User;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        Gate::define('is-admin-mod', function (User $user) {
            if (!empty($user->roles)) {
                foreach ($user->roles as $value) {
                    if ($value->role === "admin") {
                        return true;
                    } else if ($value->role === "global_mod") {
                        return true;
                    }
                }
            }
        });

        Gate::define('update-delete-clip', function (User $user, Clip $clip) {
            if ($user->id === $clip->user_id) {
                return true;
            } else if (!empty($user->roles)) {
                foreach ($user->roles as $value) {
                    if ($value->role === "admin") {
                        return true;
                    } else if ($value->role === "global_mod") {
                        return true;
                    }
                }
            }
        });

        Gate::define('update-delete-comment', function (User $user, Comment $comment) {
            if ($user->id === $comment->user_id) {
                return true;
            } else if (!empty($user->roles)) {
                foreach ($user->roles as $value) {
                    if ($value->role === "admin") {
                        return true;
                    } else if ($value->role === "global_mod") {
                        return true;
                    }
                }
            }
        });

        Gate::define('update-steam-settings', function (User $auth, User $user) {
            if ($auth->id === $user->id) {
                if ($auth->connections->keyBy('provider')['steam'] ?? null) {
                    return true;
                }
            }
        });

        Gate::define('update-user-settings', function (User $auth, User $user) {
            if ($auth->id === $user->id) {
                return true;
            }
        });

        Gate::define('view-votes', function (User $user, $login) {
            return $user->login === $login;
        });
    }
}
