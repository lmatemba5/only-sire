import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Spinner from "@/components/Spinner";
import QuestionTemplate from "@/partials/form/QuestionTemplate";

export default function AdditionalQuestions({
    is_processing,
    form_data,
    form_errors,
    handleChange,
    addQNext,
    addQBack,
    activeQuestion,
    conducted_by,
}) {
    const renderCurrentQuestion = () => {
        switch (activeQuestion) {
            case 2:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "when_to_start",
                                title: "If offered this role, when will you be available to start?",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            case 3:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "planned_holidays",
                                title: "Do you have any pre-planned holidays?",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            case 4:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "prev_org",
                                title: "What organisations are you and/or have you been working with?",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            case 5:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "prev_org_objective",
                                title: "What is the nature of this organisation (what do they do , what are their objectives)?",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            case 6:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "iera_friends",
                                title: "Do you have family or friends working with IERA?",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            case 7:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "questions",
                                title: ["Do you have any questions?"],
                                emphasize:
                                    "(Other contact or emergency details)",
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
            default:
                return (
                    <QuestionTemplate
                        {...{ form_data, form_errors, handleChange }}
                        details={{
                            question: {
                                key: "previous_job",
                                title: [
                                    "What is your previous / current job / notice period / current ",
                                    "or previous salary",
                                ],
                                description: [],
                            },
                            info: {
                                description: "",
                                scores: [],
                            },
                        }}
                    />
                );
        }
    };

    return (
        <div
            className="flex justify-between flex-col"
            style={{ minHeight: "330px" }}
        >
            {renderCurrentQuestion()}

            <div
                className={`flex items-center justify-between  px-2 space-x-3`}
            >
                <input
                    onChange={(e) => handleChange(e.target)}
                    defaultValue={conducted_by}
                    name="conducted_by"
                    className={`input input-bordered w-7/12 ${
                        form_errors["conducted_by"]
                            ? "border border-red-500 placeholder-red-500"
                            : ""
                    }`}
                    placeholder={`${
                        form_errors["conducted_by"]
                            ? "This field is required"
                            : "Conducted by you and ... type"
                    }`}
                />

                <div
                    className={`flex items-center justify-end  px-2 space-x-3`}
                >
                    <SecondaryButton className="btn" onClick={() => addQBack()}>
                        Back
                    </SecondaryButton>
                    <PrimaryButton
                        className={`btn btn-primary ${
                            activeQuestion != 7 ? "" : "hidden"
                        }`}
                        onClick={() => addQNext()}
                    >
                        NEXT
                    </PrimaryButton>
                    <PrimaryButton
                        disabled={is_processing}
                        className={`${
                            activeQuestion != 7 ? "hidden" : ""
                        } btn btn-success bg-green-600 hover:bg-green-800`}
                        onClick={() => addQNext()}
                    >
                        {is_processing ? (
                            <Spinner text="Processing..." className="w-6 h-6" />
                        ) : (
                            "SUBMIT"
                        )}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
}
