<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $main_db = env('DB_DATABASE');

        Schema::create('teams', function (Blueprint $table) use($main_db){
            $table->id();
            $table->foreignId('user_id')->constrained($main_db.'.users')->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->boolean('is_verifier')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};
