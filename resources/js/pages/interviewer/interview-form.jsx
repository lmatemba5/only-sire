import PrimaryButton from "@/components/PrimaryButton";
import { Undo2 } from "lucide-react";
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
import Modal from "@/components/modal";
import { X } from "lucide-react";

export default class Interviews extends Navigation {
    componentDidMount() {
        if (this.props.initialState) {
            let { form_data } = this.state;

            form_data = {
                ...form_data,
                ...this.props.initialState,
                conducted_by: localStorage.getItem("conducted_by"),
            };

            this.setState({
                form_data,
            });
        } else {
            this.setState({
                form_data: {
                    conducted_by: localStorage.getItem("conducted_by"),
                },
            });
        }
    }

    handleChange = ({ name, value }) => {
        const { form_data } = this.state;
        form_data[name] = value;
        this.setState({ form_data });

        if (name == "conducted_by") {
            localStorage.setItem("conducted_by", value);
        }
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
        const {
            currentPage,
            ALL_TABS,
            is_processing,
            form_errors,
            showSubmitButton,
        } = this.state;

        return (
            <>
                <div className="flex flex-col w-11/12 m-auto py-6">
                    <div className="text-lg uppercase flex justify-between items-center rounded-t-lg p-2  font-extrabold bg-sky-800 text-white">
                        <label>
                            {" "}
                            <span className="p-2 rounded mr-3">
                                Total Score:
                            </span>
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
                        <div className="space-y-3 border drop-shadow w-full bg-white rounded-b-lg">
                            <div
                                className={`w-full ${showSubmitButton ? 'hidden': 'flex'} items-center justify-between bg-gray-100 h-12 px-3`}
                            >
                                {this.state.queue.map((tab, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className={`font-bold text-xs sm:text-lg  uppercase ${
                                                tab == currentPage
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
                                className={`p-2 ${showSubmitButton ? 'hidden': ''}`}
                                style={{ minHeight: showSubmitButton ? '0px': "280px" }}
                            >
                                {this.renderCurrentPage()}
                            </div>

                            <div
                                className={`flex items-center justify-between pb-2 px-6 space-x-3`}
                            >
                                <input
                                    onChange={(e) =>
                                        this.handleChange(e.target)
                                    }
                                    defaultValue={
                                        this.state.form_data?.conducted_by
                                    }
                                    name="conducted_by"
                                    className={`input input-bordered w-6/12 ${showSubmitButton ? 'hidden': ''} ${
                                        form_errors &&
                                        form_errors["conducted_by"]
                                            ? "border border-red-500 placeholder-red-500"
                                            : ""
                                    }`}
                                    placeholder={`${
                                        form_errors &&
                                        form_errors["conducted_by"]
                                            ? "This field is required"
                                            : "Conducted by"
                                    }`}
                                />
                                <div style={{ minHeight: showSubmitButton ? "300px": '0px' }} className={`flex items-center space-x-3 ${showSubmitButton ? 'w-full justify-center': 'w-5/12 justify-end'}`}>
                                    <SecondaryButton
                                        className={`btn ${
                                            is_processing ? "hidden" : ""
                                        }`}
                                        disabled={currentPage == ALL_TABS[0]}
                                        onClick={() => this.back()}
                                    >
                                        Back
                                    </SecondaryButton>
                                    <PrimaryButton
                                        className={`btn ${showSubmitButton ? 'bg-green-600 hover:bg-green-600 active:bg-green-600 focus:ring-green-600 active:ring-green-600 focus:bg-green-600':''}`}
                                        onClick={() => showSubmitButton ? this.setState({ showConfirmModal: true }): this.validate()}
                                        disabled={is_processing}
                                    >
                                        {is_processing ? (
                                            <Spinner text="Processing..." />
                                        ) : (
                                            showSubmitButton ? "SUBMIT":"NEXT"
                                        )}
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.showConfirmModal}>
                    <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                        <div className="rounded-t-lg p-2 bg-gray-100 border-b flex justify-between items-center">
                            <label className="font-bold">SUBMIT FORM</label>
                            <button
                                onClick={() => {
                                    this.setState({
                                        showConfirmModal: false,
                                    });
                                }}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-fit p-4 space-y-1 text-left">
                           <span className="text-red-600">Are you sure you want to submit</span>?
                        </div>
                        <div className="rounded-b-lg p-2 flex justify-end space-x-4 items-center">
                            <button
                                onClick={() => {
                                    this.setState({
                                        showConfirmModal: false,
                                    });
                                }}
                                className="p-2 px-3 btn btn-sm bg-gray-100  borer border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={()=> this.validate()}
                                className="p-2 px-3 btn btn-sm w-16 text-white bg-red-600  border-0"
                            >
                                {this.state.is_processing ? (
                                    <Spinner
                                        text={null}
                                        className="border-solid w-3 h-3"
                                    />
                                ) : (
                                    "Yes"
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            </>
        );
    }
}
