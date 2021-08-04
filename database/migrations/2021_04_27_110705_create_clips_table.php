<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClipsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clips', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->index();
            $table->string('title', 100);
            $table->text('thumbnail');
            $table->integer('duration');
            $table->integer('offset')->nullable();
            $table->string('mirror')->nullable();
            $table->boolean('spoiler')->nullable();
            $table->boolean('tos')->nullable();
            $table->boolean('locked')->nullable();
            $table->boolean('out_of_context')->nullable();
            $table->boolean('hearted')->nullable();
            $table->integer('video_id');
            $table->integer('category_id')->nullable();
            $table->integer('creator_id');
            $table->foreignId('broadcaster_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->boolean('notify_comments')->default(true);
            $table->double('score', 7)->default(0)->index();
            $table->timestamp('clip_created_at');
            $table->json('deleted_by')->nullable();
            $table->softDeletes($column = 'deleted_at')->index();
            $table->timestamps();
            $table->index(['created_at', 'updated_at']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('clips');
    }
}
