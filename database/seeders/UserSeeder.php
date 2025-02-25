<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Gmail User',
            'email' => "lmatemba5@gmail.com",
            'avatar' => "ACg8ocJXwpGiSaqGMecKEDjZ0FzkSRJPcm7-X2nANFxib9IDaWCprPg=s96-c",
            'remember_token' => Str::random(10),
            'country_id' => 1
        ]);

        $user->assignRole("Interviewer");

        $user = User::create([
            'name' => 'Lifa Matemba',
            'email' => "l.matemba@iera.org",
            'avatar' => "ACg8ocJXwpGiSaqGMecKEDjZ0FzkSRJPcm7-X2nANFxib9IDaWCprPg=s96-c",
            'remember_token' => Str::random(10),
            'country_id' => 1
        ]);

        $user->assignRole("Country Admin");
    }
}
