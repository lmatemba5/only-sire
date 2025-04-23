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
        Schema::table('years', function (Blueprint $table) {
            $table->foreignId('country_id')->after('id')->default(1)->constrained('countries')->cascadeOnDelete()->cascadeOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('years', function (Blueprint $table) {
            $table->dropColumn('country_id');
        });
    }
};
