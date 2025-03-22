<?php

namespace App\Models;

use App\Casts\AttributeJson;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DawahAttribute extends Model
{
    use HasFactory;

    protected $fillable = [
        "candidate_id",
        "education->text",
        "education->marks",
        "basic_islamic_knowledge->text",
        "basic_islamic_knowledge->marks",
        "dawah_knowledge->text",
        "dawah_knowledge->marks",
        "dawah_experience->text",
        "dawah_experience->marks",
        "travel->text",
        "travel->marks",
        "people_skills->text",
        "people_skills->marks",
        "language_skills->text",
        "language_skills->marks",
        "computer_skills->text",
        "computer_skills->marks",
        "team_management->text",
        "team_management->marks",
        "reporting_skills->text",
        "reporting_skills->marks",
        "complementary_skills->text",
        "complementary_skills->marks",
        "checklist->wp",
        "checklist->pbl",
        "checklist->a",
        "checklist->pa",
        "checklist->ot",
        "recommendation->text",
        "recommendation->marks",
        "addition_questions->prev_job",
        "addition_questions->when_to_start",
        "addition_questions->planned_holidays",
        "addition_questions->prev_org",
        "addition_questions->prev_org_objective",
        "addition_questions->iera_friends",
        "addition_questions->questions",
    ];

    protected $casts = [
        "education" => AttributeJson::class,
        "basic_islamic_knowledge" => AttributeJson::class,
        "dawah_knowledge" => AttributeJson::class,
        "dawah_experience" => AttributeJson::class,
        "travel" => AttributeJson::class,
        "people_skills" => AttributeJson::class,
        "language_skills" => AttributeJson::class,
        "computer_skills" => AttributeJson::class,
        "team_management" => AttributeJson::class,
        "reporting_skills" => AttributeJson::class,
        "complementary_skills" => AttributeJson::class,
        "checklist" => AttributeJson::class,
        "recommendation" => AttributeJson::class,
        "addition_questions" => AttributeJson::class
    ];

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(Candidate::class, 'id', 'candidate_id');
    }
}
