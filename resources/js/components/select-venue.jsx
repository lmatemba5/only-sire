import Modal from "@/components/modal";
import React from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { Info } from "lucide-react";
import Spinner from "@/components/Spinner";
import SecondaryButton from "@/components/SecondaryButton";
import axios from "axios";

export default class SelectVenueModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            message: "Are you sure you want to delete this?",
            closeable: false,
            callBackParams: null,
            callBack: null,
            selected_venue_id: null,
            is_processing: false,
        };
    }

    toggle = ({ callBack, callBackParams } = {}) => {
        if (this.props.isVenueBound) {
            this.props.switchPage("create");
            return;
        }

        this.setState({
            visible: !this.state.visible,
            callBack,
            callBackParams,
            selected_venue_id: null,
            is_processing: false,
        });
    };

    handleChange = (selected_venue_id) => {
        this.setState({
            selected_venue_id: selected_venue_id > 0 ? selected_venue_id : null,
        });
    };

    handleGoClick = async () => {
        const { selected_venue_id: venue_id } = this.state;

        this.setState({
            is_processing: true,
        });

        await axios
            .post(
                "/api/v1/updateMyvenue",
                { venue_id },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.props.token}`,
                    },
                }
            )
            .then((resp) => {
                this.toggle();
                this.props.switchPage("create");
            })
            .catch((error) => {
            });
    };

    render() {
        const { visible, closeable, selected_venue_id, is_processing } =
            this.state;
        const { venues } = this.props;

        return (
            <section className={`space-y-6`}>
                <Modal
                    closeable={closeable}
                    show={visible}
                    onClose={this.toggle}
                >
                    <div className="p-6 bg-white rounded-lg">
                        <h2
                            className={`text-lg font-medium text-gray-900 mb-3 ${
                                venues.length == 0 ? "hidden" : ""
                            }`}
                        >
                            Select your current venue
                        </h2>

                        <div className="flex flex-col">
                            {venues.length > 0 ? (
                                venues.map((vn, index) => {
                                    return (
                                        <label
                                            key={index}
                                            className="cursor-pointer space-x-4 hover:bg-gray-200 p-3 rounded-lg"
                                        >
                                            <input
                                                type="checkbox"
                                                name="venue_id"
                                                checked={
                                                    selected_venue_id == vn.id
                                                }
                                                className="checkbox checkbox-accent"
                                                onChange={(e) =>
                                                    this.handleChange(
                                                        e.target.checked
                                                            ? vn.id
                                                            : 0
                                                    )
                                                }
                                            />
                                            <span className="label-text capitalize">
                                                {vn.venue_name} -{" "}
                                                {vn.district_name}
                                            </span>
                                        </label>
                                    );
                                })
                            ) : (
                                <div className="uppercase w-full h-12 flex space-x-3 justify-start items-center text-lg">
                                    <Info className="text-sky-600 h-8 w-8" />
                                    <label className="pt-1">
                                        No active venues
                                    </label>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end items-center space-x-3">
                            <SecondaryButton
                                onClick={this.toggle}
                                className={`ml-3 ${
                                    venues.length == 0 ? "hidden" : ""
                                }`}
                            >
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton
                                disabled={
                                    selected_venue_id == null &&
                                    venues.length > 0
                                }
                                onClick={
                                    venues.length > 0
                                        ? this.handleGoClick
                                        : this.toggle
                                }
                                className="ml-3"
                            >
                                {venues.length > 0 ? (
                                    is_processing ? (
                                        <Spinner align="row" />
                                    ) : (
                                        "Go"
                                    )
                                ) : (
                                    "OK"
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                </Modal>
            </section>
        );
    }
}
