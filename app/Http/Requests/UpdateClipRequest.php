<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('update-delete-clip', $this->clip);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'out_of_context' => 'sometimes|required|boolean',
            'locked' => 'sometimes|required|boolean',
            'spoiler' => 'sometimes|required|boolean',
            'tos' => 'sometimes|required|boolean',
            'notifyComments' => 'sometimes|required|boolean',
        ];
    }
}
