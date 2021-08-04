<?php

namespace App\Http\Requests;

use App\Models\Clip;
use Illuminate\Foundation\Http\FormRequest;

class StoreCommentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $clip = Clip::find($this->input('clip_id'));

        return !$clip->locked;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            "text" => "required|string",
            "clip_id" => "required|integer|numeric",
            "emotes" => "sometimes|array"
        ];
    }
}
