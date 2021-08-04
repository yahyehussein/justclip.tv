<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClipBulletChatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clip_bullet_chats', function (Blueprint $table) {
            $table->id();
            $table->integer('color')->nullable();
            $table->string('author');
            $table->text('text');
            $table->double('time');
            $table->string('type')->default('right');
            $table->json('emotes')->nullable();
            $table->foreignId('user_id')->index();
            $table->foreignId('clip_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clip_bullet_chats');
    }
}
