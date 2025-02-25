import { createRoot } from "react-dom/client";
import React, { createRef } from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { InputText } from "primereact/inputtext";
import Spinner from "@/components/Spinner";
import Modal from "@/components/modal";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import VenueDetails from "@/pages/country-admin/venues/view-details";
import { X, ExternalLink, Trash2, Settings } from "lucide-react";
import consoleSilencer from "@/components/console-silencer";


export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            venues: this.props.venues,
            data: this.props.venues.data,
            form_errors: {},
            form_data: {},
            current_page: "venue_list",
        };

        this.toastRef = createRef();
        this.parentRef = createRef();
    }

    add_member_to_venue = (venue_id, member) => {
        const data = this.state.venues.data.map((v) => {
            if (v.id == venue_id) {
                v.team.push(member);
            }

            return v;
        });

        this.setState({
            venues: {
                ...this.state.venues,
                data,
            },
            data,
            openableVenue: data.filter((v) => v.id == venue_id)[0],
        });
    };

    remove_member_from_venue = (venue_id, member_id) => {
        const data = this.state.venues.data.map((v) => {
            if (v.id == venue_id) {
                v.team = v.team.filter((t) => t.id != member_id);
            }

            return v;
        });

        this.setState({
            venues: { ...this.state.venues, data },
            data,
            openableVenue: data.filter((v) => v.id == venue_id)[0],
        });
    };

    hideModal = () => {
        this.setState({
            showVenueModal: false,
            form_errors: {},
            form_data: {},
        });
    };

    hideConfirmModal = () => {
        this.setState({
            showConfirmModal: false,
            selectedVenue: null,
        });
    };

    create_venue = async () => {
        const { form_data } = this.state;

        this.setState({
            form_errors: {},
            is_processing: true,
        });

        await axios
            .post("/api/v1/venues", form_data, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.props.api_token}`
                }
            })
            .then((response) => {
                const data = [...this.state.venues.data, response.data.data];

                this.setState({
                    venues: {
                        ...this.state.venues,
                        data,
                    },
                    data,
                    form_errors: {},
                    form_data: {},
                    selectedVenue: response.data.data,
                    showVenueModal: false,
                    is_processing: false,
                });

                this.toastRef.current.show({
                    type: "success",
                    msg: "Operation successfully.",
                });
            })
            .catch((error) => {
                this.setState({
                    form_errors: error?.response?.data?.errors,
                    is_processing: false,
                });
            });
    };

    delete_venue = async (venue_id) => {
        let { venues } = this.state;

        this.setState({
            deleting_id: venue_id,
        });

        await axios
            .delete(`/api/v1/venues/${venue_id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${this.props.api_token}`
                }
            })
            .then(() => {
                venues = venues.data.filter((pred) => pred.id !== venue_id);

                this.setState({
                    venues: {
                        data: venues,
                    },
                    data: venues,
                    showConfirmModal: false,
                    openableVenue: null,
                    selectedVenue: null,
                    deleting_id: null,
                });

                this.toastRef.current.show({
                    type: "success",
                    msg: "Operation successfully.",
                });
            })
            .catch((error) => {
                this.setState({
                    showConfirmModal: false,
                    openableVenue: null,
                    selectedVenue: null,
                    deleting_id: null,
                });
            });
    };

    handleChange = ({ name, value }) => {
        const { form_data } = this.state;
        form_data[name] = value;

        this.setState({ form_data });
    };

    filter = (searchValue, searchFields = "") => {
        searchFields = searchFields.split(".");

        if (searchFields.length > 0) {
            const matchedUsers = this.state.venues.data.filter((pred) => {
                let obj = pred;

                for (let index = 0; index < searchFields.length; index++) {
                    obj = obj[searchFields[index]];
                }

                return obj
                    .toString()
                    .toLowerCase()
                    .includes(searchValue.toLowerCase());
            });

            this.setState({ data: matchedUsers });
        }
    };

    filterFunction = (field, props = { type: "text" }) => {
        if (props.readOnly) {
            return (
                <label className="max-w-xs text-green-500 font-extrabold">
                    {props.defaultValue}
                </label>
            );
        }

        return (
            <InputText
                onChange={(event) => this.filter(event.target.value, field)}
                className="input input-bordered font-light max-w-xs"
                placeholder="Search..."
                {...props}
            />
        );
    };

    getEmptyMessage = () => {
        const { data, venues } = this.state;

        return (
            <div className="flex justify-center items-center p-4 uppercase">
                {data.length == 0 && venues.data.length == 0 ? (
                    <span>No venues to display</span>
                ) : (
                    <span>No match found</span>
                )}
            </div>
        );
    };

    render() {
        const { data, selectedVenue, deleting_id, current_page } = this.state;

        return (
            <AuthenticatedLayout
                ref={this.parentRef}
                {...{ ...this.props, toastRef: this.toastRef }}
            >
                {current_page == "venue_list" ? (
                    <div className="min-h-fit mx-2 flex flex-col pt-6 px-2 sm:p-4">
                        <div className="w-full py-2 flex flex-row justify-between items-center">
                            <div>
                                <h1 className="font-bold text-lg sm:text-xl">
                                    Manage Venues
                                </h1>
                                <label className="text-sm sm:text-lg">
                                    Manage your venues here.
                                </label>
                            </div>
                            <button
                                onClick={() =>
                                    this.setState({ showVenueModal: true })
                                }
                                className="btn btn-square btn-sm w-24 p-2 borer border-gray-200"
                            >
                                New Venue
                            </button>
                        </div>
                        <div className="py-2 flex flex-row justify-between space-x-2 items-center max-w-fit">
                            <label
                                className={`px-2 py-1 rounded-lg text-wrap ${
                                    selectedVenue &&
                                    (this.state.openableVenue == null ||
                                        this.state.showConfirmModal == false)
                                        ? "bg-red-100"
                                        : "text-white"
                                }`}
                            >
                                <span
                                    className={`text-green-500 ${
                                        selectedVenue &&
                                        (this.state.openableVenue == null ||
                                            this.state.showConfirmModal ==
                                                false)
                                            ? ""
                                            : "text-white"
                                    }`}
                                >
                                    {selectedVenue?.name}
                                </span>
                            </label>
                            <X
                                onClick={() =>
                                    this.setState({
                                        selectedVenue: null,
                                    })
                                }
                                className={`p-2 cursor-pointer hover:text-red-500 btn btn-circle btn-sm ${
                                    selectedVenue &&
                                    (this.state.openableVenue == null ||
                                        this.state.showConfirmModal == false)
                                        ? ""
                                        : "cursor-default hover:cursor-default hover:text-white text-white hover:bg-white bg-white border-0 shadow-none"
                                }`}
                            />
                        </div>

                        <DataTable
                            className="rounded-lg shadow border bg-white overflow-y-hidden"
                            removableSort
                            value={data}
                            selectionMode="single"
                            selection={this.state.selectedVenue}
                            onSelectionChange={(e) =>
                                this.setState({ selectedVenue: e.value })
                            }
                            stripedRows
                            rowClassName="hover:bg-sky-100 border-t"
                            scrollable
                            filterDisplay="row"
                            emptyMessage={this.getEmptyMessage}
                        >
                            <Column
                                showFilterMenu={false}
                                headerClassName="uppercase border-r"
                                header="Name"
                                filter
                                filterElement={() =>
                                    this.filterFunction("name")
                                }
                                field="name"
                                style={{ minWidth: "15em" }}
                                className="border-r"
                                sortable
                                headerStyle={{
                                    backgroundColor: "#674EA7",
                                    color: "white",
                                }}
                            />
                            <Column
                                showFilterMenu={false}
                                headerClassName="uppercase border-r"
                                header="Opens on"
                                filterElement={() =>
                                    this.filterFunction("open_at_date")
                                }
                                style={{ minWidth: "15em" }}
                                field="open_at_date"
                                filter
                                className="border-r"
                                sortable
                                headerStyle={{
                                    backgroundColor: "#674EA7",
                                    color: "white",
                                }}
                            />
                            <Column
                                showFilterMenu={false}
                                headerClassName="uppercase border-r"
                                filterElement={() =>
                                    this.filterFunction("status")
                                }
                                header="Status"
                                field="status"
                                body={(venue) => (
                                    <label
                                        className={`badge border-0 w-20 text-white ${
                                            venue.status == "Active"
                                                ? "bg-green-500"
                                                : venue.status == "Pending"
                                                ? "bg-yellow-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {venue.status}
                                    </label>
                                )}
                                filter
                                className="border-r"
                                sortable
                                style={{ minWidth: "15em" }}
                                headerStyle={{
                                    backgroundColor: "#674EA7",
                                    color: "white",
                                }}
                            />

                            <Column
                                showFilterMenu={false}
                                headerClassName="uppercase border-r"
                                header="Link"
                                body={(venue) => (
                                    <div className="text-blue-500 max-w-fit">
                                        {venue.link && (
                                            <a
                                                className="tooltip"
                                                data-tip="Open Drive"
                                                target="_blank"
                                                href={`https://drive.google.com/drive/u/0/folders/${venue.link}`}
                                            >
                                                <ExternalLink />
                                            </a>
                                        )}
                                    </div>
                                )}
                                className="border-r"
                                style={{ minWidth: "5em" }}
                                headerStyle={{
                                    backgroundColor: "#674EA7",
                                    color: "white",
                                }}
                            />

                            <Column
                                headerStyle={{
                                    backgroundColor: "#674EA7",
                                    color: "white",
                                }}
                                showFilterMenu={false}
                                style={{ minWidth: "10em" }}
                                className=""
                                headerClassName="uppercase"
                                header="Action"
                                body={(venue) => (
                                    <div className="flex flex-row space-x-4 justify-center items-center">
                                        <div
                                            className="tooltip"
                                            data-tip="Manage Venue"
                                        >
                                            <Settings
                                                onClick={() =>
                                                    this.setState({
                                                        current_page: null,
                                                        openableVenue: venue,
                                                        selectedVenue: null,
                                                    })
                                                }
                                                className="font-extrabold"
                                                size={22}
                                            />
                                        </div>

                                        {deleting_id == venue.id ? (
                                            <Spinner
                                                text={null}
                                                className="border-solid w-3 h-3"
                                            />
                                        ) : (
                                            <div
                                                className="tooltip"
                                                data-tip="Delete Venue"
                                            >
                                                <Trash2
                                                    className="text-red-500 font-extrabold"
                                                    size={22}
                                                    onClick={() =>
                                                        this.setState({
                                                            openableVenue:
                                                                venue,
                                                            showConfirmModal: true,
                                                            current_page:
                                                                "venue_list",
                                                            selectedVenue: null,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </DataTable>

                        <Modal show={this.state.showVenueModal}>
                            <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                                <div className="rounded-t-lg p-2 border-b flex justify-between items-center" style={{backgroundColor: "#674EA7", color: 'white'}}>
                                    <label>CREATE VENUE</label>
                                    <button
                                        onClick={this.hideModal}
                                        className="btn btn-sm btn-ghost btn-circle"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="h-64 overflow-y-auto p-4 space-y-1">
                                    <div className="flex flex-col text-left space-y-0">
                                        <label htmlFor="district_name">
                                            District Name
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                this.handleChange(e.target)
                                            }
                                            defaultValue={
                                                this.state.form_data
                                                    .district_name
                                            }
                                            name="district_name"
                                            className="input input-bordered p-2"
                                        />
                                        <label className="text-red-500">
                                            {
                                                this.state.form_errors
                                                    ?.district_name
                                            }
                                        </label>
                                    </div>
                                    <div className="flex flex-col text-left space-y-0">
                                        <label htmlFor="venue_name">
                                            Venue Name
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                this.handleChange(e.target)
                                            }
                                            defaultValue={
                                                this.state.form_data.venue_name
                                            }
                                            name="venue_name"
                                            className="input input-bordered  p-2"
                                        />
                                        <label className="text-red-500">
                                            {this.state.form_errors?.venue_name}
                                        </label>
                                    </div>
                                    <div className="flex flex-col text-left space-y-0">
                                        <label htmlFor="open_at">
                                            Opening Date
                                        </label>
                                        <input
                                            onChange={(e) =>
                                                this.handleChange(e.target)
                                            }
                                            type="date"
                                            name="open_at"
                                            className="input input-bordered  p-2 min-w-full"
                                        />
                                        <label className="text-red-500">
                                            {this.state.form_errors?.open_at}
                                        </label>
                                    </div>
                                </div>
                                <div className="rounded-b-lg p-2 border flex justify-end items-center">
                                    <button
                                        onClick={this.create_venue}
                                        className="p-2 px-3 btn btn-md bg-slate-800 text-white borer border-gray-200"
                                    >
                                        {this.state.is_processing ? (
                                            <Spinner
                                                text="Processing..."
                                                className="border-solid h-5 w-5"
                                            />
                                        ) : (
                                            "CREATE"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        <Modal show={this.state.showConfirmModal}>
                            <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                                <div className="rounded-t-lg p-2 bg-gray-100 border-b flex justify-between items-center">
                                    <label>
                                        Delete (
                                        <b>{this.state?.openableVenue?.name}</b>
                                        )
                                    </label>
                                    <button
                                        onClick={this.hideConfirmModal}
                                        className="btn btn-sm btn-ghost btn-circle"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="h-fit p-4 space-y-1 text-left">
                                    Are you sure you want to delete this venue?
                                </div>
                                <div className="rounded-b-lg p-2 flex justify-end space-x-4 items-center">
                                    <button
                                        onClick={this.hideConfirmModal}
                                        className="p-2 px-3 btn btn-sm bg-gray-100  borer border-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            this.delete_venue(
                                                this.state.openableVenue.id
                                            )
                                        }
                                        className="p-2 px-3 btn btn-sm w-16 text-white bg-red-500  border-0"
                                    >
                                        {this.state.deleting_id ? (
                                            <Spinner
                                                text={null}
                                                className="w-4 h-4"
                                            />
                                        ) : (
                                            "Yes"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                ) : (
                    <VenueDetails
                        venue={this.state.openableVenue}
                        api_token={this.props.api_token}
                        users={this.props.users}
                        toastRef={this.toastRef}
                        add_member_to_venue={this.add_member_to_venue}
                        remove_member_from_venue={this.remove_member_from_venue}
                        goto={(current_page) =>
                            this.setState({ current_page, selectedVenue: null })
                        }
                    />
                )}
            </AuthenticatedLayout>
        );
    }
}

consoleSilencer()

const root = document.querySelector("#index-widget");

IndexPage.defaultProps = {
    ...JSON.parse(root.getAttribute("data")),
};

createRoot(root).render(<IndexPage />);
