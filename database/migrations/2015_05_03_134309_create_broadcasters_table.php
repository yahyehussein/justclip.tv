<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBroadcastersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('broadcasters', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('login')->index();
            $table->string('display_name');
            $table->text('about')->nullable();
            $table->text('avatar');
            $table->text('banner')->nullable();
            $table->json('subscriptions')->nullable();
            $table->string('type')->nullable();
            $table->string('title')->nullable();
            $table->string('category')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->boolean('partner');
            $table->double('votes')->default(0)->index();
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
        Schema::dropIfExists('broadcasters');
    }
}
