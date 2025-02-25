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

        Schema::create('candidates', function (Blueprint $table) use($main_db){
            $table->id();
            $table->string('name')->nullable();
            $table->integer('age')->nullable();
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->enum('marital_status', ['Married', 'Single', 'Widow', 'Divorced'])->nullable();
            $table->string('village')->nullable();
            $table->string('ta')->nullable();
            $table->string('district')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('related_to')->nullable();
            $table->string('facebook_link')->nullable();
            $table->string('instagram_link')->nullable();
            $table->string('linkedin_link')->nullable();
            $table->string('twitter_link')->nullable();
            $table->foreignId('venue_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained($main_db.'.users')->cascadeOnUpdate()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
