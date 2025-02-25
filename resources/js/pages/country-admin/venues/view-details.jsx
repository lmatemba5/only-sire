import { PlusCircle, Undo, Minus, X } from "lucide-react";
import React from "react";
import Spinner from "@/components/Spinner";
import Modal from "@/components/modal";
import axios from "axios";

export default class VenueDetails extends React.Component {
    hideConfirmModal = () => {
        this.setState({
            showConfirmModal: false,
            selectedMember: {},
        });
    };

    hideAddMemberModal = () => {
        this.setState({
            showAddMemberModal: false,
            is_processing: false,
            form_errors:{},
            form_data:{},
        });
    };

    add_member = async () => {
        this.setState({
            is_processing: true,
        });

        await axios
            .post(
                `/api/v1/teams`,
                { ...this.state.form_data, venue_id: this.props.venue.id }, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${this.props.api_token}`
                    }
                })
            .then((response) => {
                this.props.add_member_to_venue(
                    this.props.venue.id,
                    response.data.data
                );

                this.setState({
                    is_processing: false,
                    form_data: {},
                    form_errors: {},
                    showAddMemberModal: false,
                });

                this.props.toastRef.current.show({
                    type: "success",
                    msg: "Operation successful.",
                });
            })
            .catch((error) => {
                this.setState({
                    form_errors: error?.response?.data?.errors,
                    is_processing: false,
                });
            });
    };

    handleChange = ({ name, value }) => {
        const { form_data = {} } = this.state;
        form_data[name] = value;

        this.setState({ form_data });
    };

    remove_member = async () => {
        this.setState({
            member_id: this.state.selectedMember.id,
        });

        await axios
            .delete(`/api/v1/teams/${this.state.selectedMember.id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.props.api_token}`
                }
            })
            .then(() => {
                this.props.remove_member_from_venue(
                    this.props.venue.id,
                    this.state.selectedMember.id
                );

                this.setState({
                    selectedMember: null,
                    member_id: null,
                    showConfirmModal: false,
                });

                this.props.toastRef.current.show({
                    type: "success",
                    msg: "Operation successful.",
                });
            })
            .catch((error) => {
                this.setState({
                    selectedMember: null,
                    member_id: null,
                    showConfirmModal: false,
                });
            });
    };

    render() {
        return (
            <div className="h-full w-full pt-6 px-2 sm:px-4 pb-12">
                <div className="pb-6 text-sm flex justify-between items-center">
                    <div>
                        <label className="uppercase">
                            <span className="text-green-600 font-extrabold text-md sm:text-lg">
                                {this.props.venue.name}
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-center items-end">
                        <button
                            onClick={() => this.props.goto("venue_list")}
                            className="btn btn-sm bg-gray-100 flex space-x-2 border items-center justify-between border-gray-200 rounded-lg w-fit px-1"
                        >
                            <Undo size={25} /> <span>Back</span>
                        </button>
                    </div>
                </div>
                <div className="flex flex-col rounded-lg sm:border sm:shadow bg-white space-y-6 sm:space-y-0 sm:justify-between sm:flex-row">
                    <div className="relative flex flex-col w-full border rounded-lg shadow sm:rounded-none sm:w-8/12 sm:border-none sm:shadow-none">
                        <div className="uppercase rounded-t-lg sm:rounded-ss-lg sm:rounded-se-none p-2 flex justify-between items-center bg-gray-100 border-b">
                            <span className="font-extrabold uppercase text-blue-800">
                                Details
                            </span>
                        </div>

                        <label className="p-4 text-2xl h-1/5 font-extralight">
                            {this.props.venue.status == "Pending" ? (
                                <span>
                                    The venue is {" "}
                                    <span className="badge border-0 bg-yellow-500 text-white">
                                        Pending
                                    </span>
                                </span>
                            ) : this.props.venue.status == "Closed" ? (
                                <span>
                                    The venue is{" "}
                                    <span className="badge border-0 bg-red-500 text-white">
                                        Closed
                                    </span>
                                </span>
                            ) : (
                                <span>
                                    The venue is{" "}
                                    <span className="badge border-0 bg-green-500 text-white">
                                        Active
                                    </span>
                                </span>
                            )}
                        </label>

                        <div className="flex p-4 flex-col sm:flex-row sm:justify-between h-4/5 sm:items-center w-full space-y-3 sm:space-y-0 sm:space-x-2">
                            <label className="flex flex-col space-y-1 w-1/2">
                                <b className="text-xl uppercase">Venue Name</b>

                                <div className="p-inputgroup flex-1">
                                    <input
                                        readOnly
                                        placeholder="8"
                                        className="w-20 input input-bordered min-w-fit"
                                        name="venue_name"
                                        defaultValue={
                                            this.props.venue.name.split(",")[0]
                                        }
                                    />
                                </div>
                            </label>

                            <label className="flex flex-col space-y-1 w-1/2">
                                <b className="text-xl uppercase">
                                    Opening Date
                                </b>

                                <div className="flex-1">
                                    <input
                                        readOnly
                                        className="input input-bordered min-w-fit"
                                        type="text"
                                        name="open_at"
                                        defaultValue={
                                            this.props.venue.open_at_date
                                        }
                                    />
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="w-full sm:w-4/12 border rounded-lg shadow sm:rounded-none sm:border-none sm:shadow-none">
                        <div className="flex rounded-t-lg sm:rounded-ss-none sm:rounded-se-lg justify-between py-2 items-center bg-gray-100 uppercase p-2 border-b">
                            <span className="font-extrabold uppercase text-blue-800">
                                Drive Folders
                            </span>
                        </div>
                        <div className="border-l">
                            {this.props.venue.folders.map((folder, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            index % 2 == 1 ? "" : "bg-gray-50"
                                        } justify-between items-center w-full p-2`}
                                    >
                                        <span className="">
                                            {index + 1}.{" "}
                                            <span className="mx-2">
                                                {folder.name}
                                            </span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="w-full rounded-lg border bg-white mt-6">
                    <div className="flex justify-between items-center bg-gray-100 rounded-t-lg uppercase p-2 border-b">
                        <span className="font-extrabold uppercase text-blue-800">
                            Panel Members
                        </span>
                        <button
                            disabled={this.props.venue.link == null || this.props.venue.status == 'Closed'}
                            onClick={() =>
                                this.setState({ showAddMemberModal: true })
                            }
                            className="btn btn-circle btn-sm border-0 btn-ghost bg-transparent"
                        >
                            <PlusCircle size={20} />
                        </button>
                    </div>
                    <div className="h-fit max-h-72 overscroll-y-auto overflow-x-hidden">
                        <ol className="p-2 space-y-1">
                            {this.props.venue.team.length != 0 && (
                                <li
                                    className={`rounded-lg flex justify-between items-center py-2 px-3 italic font-extrabold`}
                                >
                                    <span className="hidden w-1/5 sm:block"></span>
                                    <label className="w-2/5">Name</label>
                                    <label className="hidden w-1/5 sm:block">
                                        Role
                                    </label>
                                    <label className="w-fit flex justify-end items-center">
                                        Action
                                    </label>
                                </li>
                            )}
                            {this.props.venue.team.map((member, index) => {
                                index = index + 1;
                                return (
                                    <li
                                        key={index}
                                        className={`border ${
                                            index % 2 == 1 ? "" : "bg-gray-50"
                                        } rounded-lg flex justify-between items-center py-2 px-3 bg-white hover:bg-gray-100`}
                                    >
                                        <span className="hidden w-1/5 sm:block">
                                            {index}.
                                        </span>
                                        <label className="w-2/5">
                                            {member.name}
                                        </label>
                                        <label className="hidden w-1/5 sm:block">
                                            {member.is_verifier == 0
                                                ? "Interviewer"
                                                : "Verification"}
                                        </label>
                                        <label className="w-fit flex justify-end items-center">
                                            <button
                                                disabled={
                                                    this.state?.member_id ==
                                                    member.id
                                                }
                                                className="btn-ghost flex btn-square btn-sm btn"
                                            >
                                                {this.state?.member_id ==
                                                member.id ? (
                                                    <Spinner
                                                        text={null}
                                                        className="w-4 h-4 border-solid"
                                                    />
                                                ) : (
                                                    <Minus
                                                        onClick={() =>
                                                            this.setState({
                                                                showConfirmModal: true,
                                                                selectedMember:
                                                                    member,
                                                            })
                                                        }
                                                        className="h-5 hover:text-red-600"
                                                    />
                                                )}
                                            </button>
                                        </label>
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </div>

                <div className="mt-6 min-h-6"></div>

                <Modal show={this.state?.showConfirmModal}>
                    <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                        <div className="rounded-t-lg p-2 bg-gray-100 border-b flex justify-between items-center">
                            <label>
                                Remove (
                                <b>{this.state?.selectedMember?.name}</b>)
                            </label>
                            <button
                                onClick={this.hideConfirmModal}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-fit p-4 space-y-1 text-left">
                            Are you sure you want to remove?
                        </div>
                        <div className="rounded-b-lg p-2 flex justify-end space-x-4 items-center">
                            <button
                                onClick={this.hideConfirmModal}
                                className="p-2 px-3 btn btn-sm bg-gray-100  borer border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => this.remove_member()}
                                className="p-2 px-3 btn btn-sm w-16 text-white bg-red-500  border-0"
                            >
                                {this.state?.member_id ? (
                                    <Spinner text={null} className="w-4 h-4" />
                                ) : (
                                    "Yes"
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>

                <Modal show={this.state?.showAddMemberModal}>
                    <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                        <div className="rounded-t-lg p-2 border-b flex justify-between items-center" style={{backgroundColor: "#674EA7", color: 'white'}}>
                            <label>ADD MEMBER</label>
                            <button
                                onClick={this.hideAddMemberModal}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-fit p-4 space-y-3 text-left flex flex-col">
                            <label>Role</label>
                            <select
                                name="is_verifier"
                                defaultValue={""}
                                onChange={(e) => this.handleChange(e.target)}
                                className="input input-bordered min-w-full"
                            >
                                <option value={""} disabled>
                                    --Choose--
                                </option>
                                <option value={0}>Interviewer</option>
                                <option value={1}>Verification</option>
                            </select>

                            {this.state?.form_errors?.is_verifier && (
                                <label className="text-red-500">
                                    The role is required.
                                </label>
                            )}

                            <label>User</label>
                            <select
                                name="user_id"
                                defaultValue={""}
                                onChange={(e) => this.handleChange(e.target)}
                                className="input input-bordered min-w-full"
                            >
                                <option value={""} disabled>
                                    --Choose--
                                </option>
                                {this.props.users
                                    .filter((u) => {
                                        if (
                                            this.props.venue.team.filter(
                                                (t) => t.name == u.name
                                            ).length > 0
                                        ) {
                                            return false;
                                        }

                                        return true;
                                    })
                                    .map((user, index) => {
                                        return (
                                            <option key={index} value={user.id}>
                                                {user.name}
                                            </option>
                                        );
                                    })}
                            </select>
                            {this.state?.form_errors?.user_id && (
                                <label className="text-red-500">
                                    The user is required.
                                </label>
                            )}
                        </div>
                        <div className="rounded-b-lg p-2 flex justify-end space-x-4 items-center">
                            <button
                                onClick={this.add_member}
                                className="p-2 px-3 btn btn-sm w-16 text-white bg-red-500  border-0"
                            >
                                {this.state?.is_processing ? (
                                    <Spinner text={null} className="w-4 h-4" />
                                ) : (
                                    "ADD"
                                )}
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
