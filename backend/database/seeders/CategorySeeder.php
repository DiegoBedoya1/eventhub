<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['id' => 1, 'name' => 'Académico'],
            ['id' => 2, 'name' => 'Social'],
            ['id' => 3, 'name' => 'Deportivo'],
            ['id' => 4, 'name' => 'Cultural'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['id' => $category['id']], $category);
        }
    }
}