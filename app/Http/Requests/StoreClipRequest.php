<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreClipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "slug" => "required|string",
            "title" => "required|string",
            "thumbnail" => "required|string",
            "duration" => "required|numeric",
            "mirror" => "sometimes|string",
            "spoiler" => "boolean",
            "tos" => "boolean",
            "notification" => "boolean",
            "video_id" => "required|integer|numeric",
            "category_id" => "required|integer|numeric",
            "creator_id" => "required|integer|numeric",
            "broadcaster_id" => "required|integer|numeric",
            "clip_created_at" => "required|date",
            'broadcaster.login' => "required|string",
            'broadcaster.display_name' => "required|string",
            'broadcaster.description' => "nullable|string",
            'broadcaster.profile_image_url' => "required|string",
            'broadcaster.banner' => "nullable|string",
            'broadcaster.broadcaster_type' => "nullable|string",
            'broadcaster.type' => "nullable|string",
            'broadcaster.title' => "sometimes|required|string",
            'broadcaster.game_name' => "sometimes|required|string",
            'broadcaster.started_at' => "sometimes|required|date",
            'category.name' => "required|string",
            'category.box_art_url' => "required|string",
        ];
    }
}
