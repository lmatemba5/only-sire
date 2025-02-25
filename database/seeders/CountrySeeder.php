<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Continent;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Country::create([
            'name' => 'Malawi',
            'continent_id' => Continent::create(['name' => 'Africa'])->id
        ]);
    }
}
