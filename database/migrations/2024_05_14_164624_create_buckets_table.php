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
        Schema::create('buckets', function (Blueprint $table){
            $table->id();
            $table->integer('venue_id');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();;
            $table->integer('candidate_no')->nullable();
            $table->string('ph_google_drive_id')->nullable();
            $table->string('cv_google_drive_id')->nullable();
            $table->string('id_google_drive_id')->nullable();
            $table->foreignId('candidate_id')->nullable()->constrained()->nullOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buckets');
    }
};
