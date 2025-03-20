import Spinner from "@/components/Spinner";
import React from "react";
import axios from "axios";

export default class CandidateNumber extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            is_processing: false,
            form_data: {},
            form_errors: {},
            candidate_photo_url: null,
        };
    }

    componentDidMount() {
        if (this.props.initialState) {
            this.props.switchPage("interviews");
        }
    }

    validateCID = async () => {
        this.setState({ is_processing: true, form_errors: {} });
        await axios
            .post("/api/v1/validate_candidate_no", this.state.form_data, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${this.props.token}`,
                },
            })
            .then((resp) => {
                this.setState({
                    is_processing: false,
                    candidate_photo_url: resp.data.photo_url,
                });
            })
            .catch((error) => {
                this.setState({
                    is_processing: false,
                    form_errors: error?.response?.data?.errors,
                });

                this.props.toastRef.current.show({
                    type: "error",
                    title: "Error",
                    msg: error?.response?.data?.message,
                });
            });
    };

    candidateConfirmed = async () => {
        this.setState({ is_processing: true, form_errors: {} });
        await axios
            .post("/api/v1/create_new_candidate", this.state.form_data, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${this.props.token}`,
                },
            })
            .then(() => {
                this.props.toastRef.current.show({
                    type: "success",
                    msg: "You can now proceed",
                });

                this.setState({
                    is_processing: false,
                    candidate_photo_url: null,
                });

                this.props.switchPage("interviews");
            })
            .catch((error) => {
                this.setState({
                    is_processing: false,
                    form_errors: error?.response?.data?.errors,
                });

                this.props.toastRef.current.show({
                    type: "error",
                    title: "Error",
                    msg: error?.response?.data?.message,
                });
            });
    };

    render() {
        const { is_processing, form_errors, candidate_photo_url } = this.state;

        return (
            <div className="flex h-full justify-center items-center">
                <div className="flex flex-col space-y-3">
                    <div
                        className={`flex justify-center ${
                            candidate_photo_url ? "" : "hidden"
                        }`}
                    >
                        <img
                            src={candidate_photo_url}
                            className="bg-yellow-600 bottom-5 flex items-center justify-center w-52 h-52 border-8 border-gray-400 rounded-full"
                            alt=""
                        />
                    </div>

                    <div className="flex flex-col">
                        <label>Candidate#:</label>
                        <input
                            onKeyUp={(event) => {
                                if (event.key == "Enter") {
                                    candidate_photo_url
                                        ? this.candidateConfirmed()
                                        : this.validateCID();
                                }
                            }}
                            name="candidate_no"
                            onChange={(event) =>
                                this.setState({
                                    form_data: {
                                        ...this.state.form_data,
                                        candidate_no: event.target.value,
                                    },
                                })
                            }
                            readOnly={candidate_photo_url || is_processing}
                            type="number"
                            placeholder="Type candidate num..."
                            className="input input-bordered max-w-xs"
                        />
                        <label className="text-red-500">
                            {form_errors?.candidate_no || form_errors?.error}
                        </label>
                    </div>
                    <div className="w-full flex items-center space-x-2 justify-end">
                        {is_processing ? (
                            <button
                                disabled
                                className="btn btn-sm disabled:bg-sky-100 font-extrabold"
                            >
                                <Spinner
                                    text={`${
                                        candidate_photo_url
                                            ? "saving"
                                            : "verifying"
                                    }...`}
                                    textSize="capitalize"
                                    className="w-5 h-5 border-dashed"
                                />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() =>
                                        this.setState({
                                            candidate_photo_url: null,
                                        })
                                    }
                                    className={`${
                                        candidate_photo_url ? "" : "hidden"
                                    } btn btn-sm hover:bg-red-800 bg-red-600 text-white uppercase font-extrabold`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={this.validateCID}
                                    className={`${
                                        candidate_photo_url ? "hidden" : ""
                                    } btn btn-sm bg-sky-600 hover:bg-sky-800 text-white uppercase font-extrabold`}
                                >
                                    Verify
                                </button>
                                <button
                                    onClick={this.candidateConfirmed}
                                    className={`${
                                        candidate_photo_url ? "" : "hidden"
                                    } btn btn-sm bg-green-600 hover:bg-green-800 text-white uppercase font-extrabold`}
                                >
                                    Next
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
