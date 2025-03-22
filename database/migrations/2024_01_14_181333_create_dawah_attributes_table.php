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
        Schema::create('dawah_attributes', function (Blueprint $table) {
            $table->id();
            $table->json("education")->nullable();
            $table->json("basic_islamic_knowledge")->nullable();
            $table->json("dawah_knowledge")->nullable();
            $table->json("dawah_experience")->nullable();
            $table->json("travel")->nullable();
            $table->json("people_skills")->nullable();
            $table->json("language_skills")->nullable();
            $table->json("computer_skills")->nullable();
            $table->json("team_management")->nullable();
            $table->json("reporting_skills")->nullable();
            $table->json("complementary_skills")->nullable();
            $table->json("checklist")->nullable();
            $table->json("recommendation")->nullable();
            $table->json("addition_questions")->nullable();
            $table->foreignId('candidate_id')->nullable()->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dawah_attributes');
    }
};
