<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;

class BlockCategoryController extends Controller
{
    public function __construct() {
        $this->middleware(['auth', 'validate.token']);
    }

    public function block(Request $request, Category $category)
    {
        User::withoutSyncingToSearch(function () use ($request, $category) {
            if (empty($request->user()->blocked_categories)) {
                $request->user()->blocked_categories = [$category->id];

                $request->user()->save();
            } else {
                $blocked_categories = collect($request->user()->blocked_categories);
                $blocked_categories->push($category->id);

                $request->user()->blocked_categories = $blocked_categories->all();

                $request->user()->save();
            }
        });
    }

    public function unblock(Request $request, Category $category)
    {
        User::withoutSyncingToSearch(function () use ($request, $category) {
            if (!empty($request->user()->blocked_categories)) {
                $collection = collect($request->user()->blocked_categories);

                $blocked_categories = $collection->reject(function ($value) use ($category) {
                    return $value === $category->id;
                });

                $request->user()->blocked_categories = $blocked_categories->all();

                $request->user()->save();
            }
        });
    }
}
