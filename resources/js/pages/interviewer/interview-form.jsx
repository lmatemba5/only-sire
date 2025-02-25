import PrimaryButton from "@/components/PrimaryButton";
import {Undo2} from "lucide-react";
import React from "react";
import PersonalDetails from "@/partials/form/PersonalDetails";
import SocialMediaLinks from "@/partials/form/SocialMediaLinks";
import QuestionTemplate from "@/partials/form/QuestionTemplate";
import QuestionsDatabase from "@/partials/form/QuestionsDatabase";
import Navigation from "@/components/navigation";
import CheckList from "@/partials/form/Checklist";
import Spinner from "@/components/Spinner";
import AdditionalQuestions from "@/partials/form/AdditionalQuestions";
import SecondaryButton from "@/components/SecondaryButton";

export default class Interviews extends Navigation {
    componentDidMount() {
        if (this.props.initialState) {
            let { form_data } = this.state;

            form_data = {
                ...form_data,
                ...this.props.initialState,
                conducted_by: this.props.conducted_by
            };

            this.setState({
                form_data,
            });
        }
    }

    handleChange = ({ name, value }) => {
        const { form_data } = this.state;
        form_data[name] = value;
        this.setState({ form_data });
    };

    addQNext = () => {
        const { activeQuestion } = this.state;
        if (activeQuestion < 7) {
            this.setState({
                activeQuestion: activeQuestion + 1,
            });
            return;
        }

        this.validate();
    };

    addQBack = () => {
        const { activeQuestion } = this.state;
        if (activeQuestion - 1 < 1) {
            this.back();
            return;
        }

        this.setState({
            activeQuestion: activeQuestion - 1,
        });
    };

    renderCurrentPage() {
        const { currentPage } = this.state;

        switch (currentPage) {
            case "social_media_links":
                return (
                    <SocialMediaLinks
                        toastRef={this.props.toastRef}
                        form_errors={this.state.form_errors}
                        form_data={this.state.form_data}
                        handleChange={this.handleChange}
                    />
                );
            case "personal_details":
                return (
                    <PersonalDetails
                        form_errors={this.state.form_errors}
                        form_data={this.state.form_data}
                        handleChange={this.handleChange}
                    />
                );
            case "interview_checklist":
                return (
                    <CheckList
                        updateTotalScore={this.updateTotalScore}
                        form_errors={this.state.form_errors}
                        form_data={this.state.form_data}
                        handleChange={this.handleChange}
                    />
                );
            case "additional_questions":
                return (
                    <AdditionalQuestions
                        addQBack={this.addQBack}
                        addQNext={this.addQNext}
                        conducted_by={this.state.form_data?.conducted_by}
                        is_processing={this.state.is_processing}
                        activeQuestion={this.state.activeQuestion}
                        form_errors={this.state.form_errors}
                        form_data={this.state.form_data}
                        handleChange={this.handleChange}
                    />
                );
            default:
                return (
                    <QuestionTemplate
                        form_errors={this.state.form_errors}
                        form_data={this.state.form_data}
                        handleChange={this.handleChange}
                        details={QuestionsDatabase[currentPage]}
                    />
                );
        }
    }

    render() {
        const { currentPage, ALL_TABS, is_processing, form_errors } =
            this.state;

        return (
            <div className="flex flex-col w-11/12 m-auto py-6">
                <div className="text-lg uppercase flex justify-between items-center rounded-t-lg p-2  font-extrabold bg-sky-800 text-white">
                    <label>
                        {" "}
                        <span className="p-2 rounded mr-3">Total Score:</span>
                        <span className="text-xl ">{this.sum()}</span>
                    </label>

                    <button
                        onClick={() => this.props.switchPage(null)}
                        className="btn btn-sm btn-circle border border-gray-300"
                    >
                        <Undo2 />
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between space-y-6 sm:space-y-0">
                    <div className="space-y-3 rounded-lg border drop-shadow w-full bg-white rounded-b-lg">
                        <div
                            className={`w-full flex items-center justify-between bg-gray-100 h-12 px-3`}
                        >
                            {this.state.queue.map((tab, index) => {
                                return (
                                    <label
                                        key={index}
                                        className={`font-bold text-xs sm:text-lg  uppercase ${tab == currentPage
                                                ? "text-blue-600 ease-[cubic-bezier(0.95,0.05,0.795,0.035)]"
                                                : ""
                                            }`}
                                    >
                                        {tab.split("_").join(" ")}
                                    </label>
                                );
                            })}
                        </div>

                        <div
                            className={`p-2 h-fit`}
                            style={{ minHeight: "280px" }}
                        >
                            {this.renderCurrentPage()}
                        </div>

                        <div
                            className={`flex items-center justify-between pb-2 px-6 space-x-3 ${currentPage == "additional_questions"
                                    ? "hidden"
                                    : ""
                                }`}
                        >
                            <input
                                onChange={(e) => this.handleChange(e.target)}
                                defaultValue={this.props?.conducted_by}
                                name="conducted_by"
                                className={`input input-bordered w-6/12 ${form_errors && form_errors["conducted_by"]
                                        ? "border border-red-500 placeholder-red-500"
                                        : ""
                                    }`}
                                placeholder={`${form_errors && form_errors["conducted_by"]
                                        ? "This field is required"
                                        : "Conducted by"
                                    }`}
                            />
                            <div className="flex items-center justify-end space-x-3 w-5/12">
                                <SecondaryButton
                                    className={`btn ${is_processing ? 'hidden' : ''}`}
                                    disabled={currentPage == ALL_TABS[0]}
                                    onClick={() => this.back()}
                                >
                                    Back
                                </SecondaryButton>
                                <PrimaryButton
                                    className={`btn`}
                                    onClick={() => this.validate()}
                                    disabled={is_processing}
                                >
                                    {is_processing ? (
                                        <Spinner text="Processing..." />
                                    ) : (
                                        "NEXT"
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
