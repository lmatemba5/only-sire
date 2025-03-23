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
        Schema::create('venues', function (Blueprint $table){
            $table->id();
            $table->string('district_name', 255);
            $table->string('venue_name', 255);
            $table->foreignId('month_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('year_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('country_id')->constrained("countries")->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('google_drive_id')->nullable();
            $table->string('google_sheet_id')->nullable();
            $table->date('open_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};
