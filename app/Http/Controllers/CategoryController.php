<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Meta;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->expectsJson()) {
            if (Auth::check() && $request->has('blocked')) {
                if ($request->user()->blocked_categories) {
                    return Category::whereIn('id', $request->user()->blocked_categories)->get();
                }

                return [];
            }

            return Category::has('clips')
                ->withCount('clips')
                ->when(Auth::check() && $request->user()->blocked_categories, function ($query) use ($request) {
                    return $query->whereNotIn('id', $request->user()->blocked_categories);
                })
                ->orderBy('clips_count', 'desc')
                ->simplePaginate(20)
                ->appends(['query' => 'categories'])
                ->setPath('/json/browse/categories');
        }

        return Inertia::render('browse/categories', [
            'category' => Category::has('clips')
                ->withCount('clips')
                ->when(Auth::check() && $request->user()->blocked_categories, function ($query) use ($request) {
                    return $query->whereNotIn('id', $request->user()->blocked_categories);
                })
                ->orderBy('clips_count', 'desc')
                ->simplePaginate(20)
                ->appends(['query' => 'categories'])
                ->setPath('/json/browse/categories')
        ]);
    }

    public function show($category_name)
    {
        $category = Category::where('name', urldecode($category_name))->firstOrFail();

        Meta::set('og:title', "{$category->name} Clips - Justclip");
        Meta::set('og:image', preg_replace('/{width}x{height}/i', '138x184', $category->box_art_url));

        return Inertia::render('category', [
            'category' => [
                'id' => $category->id,
                'name' => $category->name,
                'box_art_url' => $category->box_art_url
            ]
        ]);
    }
}
