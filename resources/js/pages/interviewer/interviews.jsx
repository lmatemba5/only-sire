import { createRoot } from "react-dom/client";
import React, { createRef } from "react";
import Interviews from "@/pages/interviewer/interview-form";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import SelectVenueModal from "@/components/select-venue";
import Spinner from "@/components/Spinner";
import CandidateNumber from "@/pages/interviewer/candidatenumber";
import axios from "axios";
import consoleSilencer from "@/components/console-silencer";

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: null,
            is_deleting: false,
            candidate: this.props.candidate,
            candidate_no: null
        };

        this.toastRef = createRef(null);
        this.venueRef = createRef(null);
        this.parentRef = createRef(null);
    }

    switchPage = (currentPage) => {
        this.setState({ currentPage });
    };

    updateCandidate = () => {
        this.setState({ currentPage: null, candidate: null, candidate_no: null });
    };

    destroyTempCandidate = async () => {
        this.setState({
            is_deleting: true,
        });

        await axios
            .delete(
                `/api/v1/destroy_temporary_candidate`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.props.api_token}`,
                    },
                }
            )
            .then(() => {
                this.toastRef.current.show({
                    type: "success",
                    msg: "Deleted Successfully",
                });

                this.setState({
                    is_deleting: false,
                    candidate: null,
                    candidate_no: null,
                    currentPage: null,
                });
            })
            .catch((error) => {
            });
    };

    renderCurrentPage() {
        let { currentPage } = this.state;

        currentPage =
            currentPage != null && this.state?.candidate_no
                ? "interviews"
                : currentPage;

        switch (currentPage) {
            case "interviews":
                return (
                    <Interviews
                        switchPage={this.switchPage}
                        toastRef={this.toastRef}
                        initialState={this.state.candidate}
                        conducted_by={this.props.conducted_by}
                        updateCandidate={this.updateCandidate}
                        token={this.props.api_token}
                    />
                );
            case "create":
                return (
                    <CandidateNumber
                        switchPage={this.switchPage}
                        toastRef={this.toastRef}
                        initialState={this.state.candidate}
                        parentRef={this.parentRef.current}
                        token={this.props.api_token}
                    />
                );
            default:
                return this.rendeHome();
        }
    }

    rendeHome() {
        return (
            <div className="flex justify-center items-center w-full h-full">
                <div className="flex flex-col justify-center items-center space-x-3 space-y-3 sm:space-y-0">
                    <div className="mb-12">
                        <img
                            src="/images/interview-panel.png"
                            className="text-slate-800 font-extrabold uppercase w-40"
                        />
                    </div>

                    {this.state.candidate ? (
                        this.state.is_deleting == false ? (
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => this.switchPage("create")}
                                    className="btn badge-warning bg-yellow-600 text-white"
                                >
                                    Resume
                                </button>
                                <button
                                    onClick={this.destroyTempCandidate}
                                    className="btn badge-error bg-red-600 text-white"
                                >
                                    Discard
                                </button>
                            </div>
                        ) : (
                            <Spinner
                                text="Discarding...."
                                align="col"
                                className="w-12 h-12"
                                textSize="uppercase font-extrabold text-lg mt-4"
                            />
                        )
                    ) : (
                        <button
                            onClick={() => this.venueRef.current.toggle()}
                            className="btn bg-sky-600 hover:bg-sky-800 text-white"
                        >
                            Start
                        </button>
                    )}
                </div>
            </div>
        );
    }

    render() {
        return (
            <AuthenticatedLayout
                ref={this.parentRef}
                {...{ ...this.props, toastRef: this.toastRef }}
            >
                {this.renderCurrentPage()}

                <SelectVenueModal
                    ref={this.venueRef}
                    toastRef={this.toastRef}
                    {...this.props}
                    token={this.props.api_token}
                    isVenueBound={this.props.auth.user.venue_id != null}
                    switchPage={this.switchPage}
                />
            </AuthenticatedLayout>
        );
    }
}

consoleSilencer();

const root = document.querySelector("#index-widget");

IndexPage.defaultProps = {
    ...JSON.parse(root.getAttribute("data")),
};

createRoot(root).render(<IndexPage />);
