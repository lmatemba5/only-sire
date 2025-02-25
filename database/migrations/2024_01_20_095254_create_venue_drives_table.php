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
        Schema::create('venue_drives', function (Blueprint $table) {
            $table->id();
            $table->string('drive_name')->nullable();
            $table->string('drive_description')->nullable();
            $table->string('google_drive_id')->nullable();
            $table->foreignId('venue_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('drive_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venue_drives');
    }
};
