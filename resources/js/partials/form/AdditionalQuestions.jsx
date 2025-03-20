import QuestionTemplate from "@/partials/form/QuestionTemplate";

export default function AdditionalQuestions({
    form_data,
    form_errors,
    handleChange,
    activeQuestion
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
                                description: ["Note that you can release the candidate after this question."],
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
                                key: "prev_job",
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

    return renderCurrentQuestion()
}
