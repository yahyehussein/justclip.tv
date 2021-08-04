<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->string('text', 2000);
            $table->foreignId('clip_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->json('emotes')->nullable();
            $table->json('in_chat')->nullable();
            $table->boolean('sticky')->default(false);
            $table->foreignId('comment_id')->nullable();
            $table->string('deleted_by')->nullable();
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
        Schema::dropIfExists('comments');
    }
}
