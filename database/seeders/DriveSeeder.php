<?php

namespace Database\Seeders;

use App\Models\Drive;
use Illuminate\Database\Seeder;

class DriveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $drive_names = ["Photos", "IDs", "Interview Forms", "CVs", "Recordinds", "Certificates"];

        foreach ($drive_names as $key => $driveName) {

            $tagName = strtolower($driveName[0] . $driveName[1]);
            $description = "Keeps $driveName";

            if ($key == 2) {
                $name = explode(' ', $driveName)[1];
                $tagName = strtolower($name[0] . $name[1]);
            }

            Drive::create([
                'name' => $driveName,
                'description' => $description,
                'tag' => $tagName,
            ]);
        }
    }
}
