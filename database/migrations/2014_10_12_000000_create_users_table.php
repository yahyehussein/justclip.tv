<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('login')->index();
            $table->string('display_name');
            $table->string('email')->nullable();
            $table->string('about', 300)->nullable();
            $table->text('avatar');
            $table->json('blocked_broadcasters')->nullable();
            $table->json('blocked_categories')->nullable();
            $table->boolean('notify_comments')->default(true);
            $table->boolean('notify_replies')->default(true);
            $table->string('access_token');
            $table->string('refresh_token');
            $table->rememberToken();
            $table->softDeletes($column = 'deleted_at')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
