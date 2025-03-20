import { createRoot } from "react-dom/client";
import React, { createRef } from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Unlock, Lock, X, RotateCw, Ellipsis } from "lucide-react";
import Spinner from "@/components/Spinner";
import axios from "axios";
import Modal from "@/components/modal";
import consoleSilencer from "@/components/console-silencer";

export default class OfficersPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: this.props.users,
            data: this.props.users.data,
            roles: this.props.roles.data,
            locking: null,
            showCreateModal: false,
            showConfirmModal: false,
            selectedUser: null,
            role_updating: null,
            form_data: {},
            form_errors: {},
        };

        this.toastRef = createRef();
    }

    updateUser = async (user, role_name = null) => {
        this.setState({
            locking: role_name == null ? user.id : null,
            role_updating: role_name == null ? null : user.id,
        });

        await axios
            .patch(
                `/api/v1/users/${user.id}`,
                {
                    email: user.email,
                    name: user.name,
                    isLocked:
                        role_name == null
                            ? user.isLocked == 1
                                ? 0
                                : 1
                            : user.isLocked,
                    role: role_name ? role_name : user.role,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.props.api_token}`,
                    },
                }
            )
            .then(() => {
                const data = this.state.users.data.map((u) => {
                    if (role_name == null && u.id == user.id) {
                        u.isLocked = user.isLocked == 1 ? 0 : 1;
                    } else if (role_name != null && u.id == user.id) {
                        u.role = role_name;
                    }

                    return u;
                });

                this.setState({
                    locking: null,
                    role_updating: null,
                    users: {
                        ...this.state.users,
                        data,
                    },
                    data,
                    showConfirmModal: false,
                    showCreateModal: false,
                    selectedUser: null
                });

                if (role_name == null) {
                    this.toastRef.current.show({
                        type: "success",
                        msg: `User ${
                            user.isLocked == 0 ? "activated" : "locked"
                        } successfully`,
                    });
                } else {
                    this.toastRef.current.show({
                        type: "success",
                        msg: `User role updated.`,
                    });
                }
            })
            .catch((error) => {
                this.toastRef.current.show({
                    type: "error",
                    title: "There's an error",
                    msg: `Operation failed`,
                });

                this.setState({
                    locking: null,
                    role_updating: null
                });
            });
    };

    filter = (searchValue, searchFields = "") => {
        searchFields = searchFields.split(".");

        if (searchFields.length > 0) {
            const matchedUsers = this.state.users.data.filter((pred) => {
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
        const { data, users } = this.state;

        return (
            <div className="flex justify-center items-center p-4 uppercase">
                {data.length == 0 && users.data.length == 0 ? (
                    <span>No users to display</span>
                ) : (
                    <span>No match found</span>
                )}
            </div>
        );
    };

    handleChange = ({ name, value }) => {
        const { form_data } = this.state;
        form_data[name] = value;

        this.setState({ form_data });
    };

    add_user = async () => {
        this.setState({
            is_processing: true,
        });

        await axios
            .post(
                `/api/v1/users`,
                { ...this.state.form_data },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${this.props.api_token}`,
                    },
                }
            )
            .then((response) => {
                const data = [...this.state.users.data, response.data.data];

                this.setState({
                    is_processing: false,
                    form_data: {},
                    form_errors: {},
                    showCreateModal: false,
                    users: {
                        data,
                    },
                    data,
                });

                this.toastRef.current.show({
                    type: "success",
                    msg: "User added successfully.",
                });
            })
            .catch((error) => {
                this.setState({
                    form_errors: error?.response?.data?.errors,
                    is_processing: false,
                });
            });
    };

    render() {
        const { data, roles, role_updating, locking, selectedUser } =
            this.state;
        return (
            <AuthenticatedLayout
                {...{ ...this.props, toastRef: this.toastRef }}
            >
                <div className="h-screen mx-2 flex flex-col pt-6 px-2 sm:p-6">
                    <div className="w-full py-2">
                        <h1 className="font-bold text-lg sm:text-xl">
                            Manage Users
                        </h1>
                        <label className="text-xs sm:text-lg">
                            You can add, lock, unlock and update user role.
                        </label>
                    </div>
                    <div className="py-5 mb-5 relative flex justify-between items-center">
                        {selectedUser ? (
                            <div className="absolute left-0 flex max-w-fit min-h-5 space-x-3 flex-row justify-between items-center bg-red-100 px-2 py-1 rounded-lg">
                                <label>
                                    <span className="text-green-500">
                                        {selectedUser?.name}
                                    </span>{" "}
                                    is active
                                </label>{" "}
                                <X
                                    onClick={() =>
                                        this.setState({
                                            selectedUser: null,
                                        })
                                    }
                                    color="red"
                                    className="p-2 cursor-pointer btn btn-circle btn-sm"
                                />
                            </div>
                        ) : (
                            ""
                        )}
                        <div className="absolute right-0 flex flex-row">
                            <button
                                onClick={() =>
                                    this.setState({ showCreateModal: true })
                                }
                                className="btn btn-square btn-sm w-24 border border-gray-200"
                            >
                                New User
                            </button>
                        </div>
                    </div>

                    <DataTable
                        className="rounded-lg shadow border bg-white overflow-y-hidden"
                        removableSort
                        value={data}
                        selectionMode="single"
                        selection={this.state.selectedUser}
                        onSelectionChange={(e) =>
                            this.setState({ selectedUser: e.value })
                        }
                        stripedRows
                        rowClassName="hover:bg-sky-100 border-t"
                        scrollable
                        filterDisplay="row"
                        emptyMessage={this.getEmptyMessage}
                    >
                        <Column
                            headerClassName="uppercase border-r"
                            filterElement={() => this.filterFunction("name")}
                            header="Name"
                            showFilterMenu={false}
                            filter
                            field="name"
                            style={{ maxWidth: "15em" }}
                            className="border-r"
                            sortable
                            headerStyle={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                        />
                        <Column
                            headerClassName="uppercase border-r"
                            filterElement={() => this.filterFunction("email")}
                            showFilterMenu={false}
                            filter
                            style={{ maxWidth: "15em" }}
                            field="email"
                            className="border-r"
                            sortable
                            header="Email"
                            headerStyle={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                        />
                        <Column
                            headerClassName="uppercase border-r"
                            filterElement={() => this.filterFunction("country")}
                            showFilterMenu={false}
                            style={{ maxWidth: "10em" }}
                            field="country"
                            filter
                            className="border-r"
                            header="Country"
                            sortable
                            headerStyle={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                        />
                        <Column
                            headerClassName="uppercase border-r"
                            filterElement={() => this.filterFunction("role")}
                            showFilterMenu={false}
                            field="role"
                            header="Role"
                            filter
                            className="border-r"
                            sortable
                            style={{ maxWidth: "10em" }}
                            headerStyle={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                        />

                        <Column
                            headerClassName="uppercase"
                            className=""
                            header="Action"
                            headerStyle={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                            body={(user) => (
                                <div className="flex items-center space-x-4">
                                    {role_updating == user.id ? (
                                        <Spinner
                                            text={null}
                                            className="border-solid w-5 h-5"
                                        />
                                    ) : (
                                        <div className="dropdown dropdown-end dropdown-top">
                                            <div
                                                data-tip="Change Role"
                                                tabIndex={0}
                                                role="button"
                                                className="tooltip flex justify-center items-center btn btn-sm btn-circle border border-gray-200"
                                            >
                                                <Ellipsis className="p-1" />
                                            </div>
                                            <ul
                                                tabIndex={0}
                                                className="border dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                            >
                                                {roles
                                                    .filter(
                                                        (ro) =>
                                                            user.role != ro.name
                                                    )
                                                    .map((role, index) => {
                                                        return (
                                                            <li
                                                                key={index}
                                                                onClick={() =>
                                                                    this.updateUser(
                                                                        user,
                                                                        role.name
                                                                    )
                                                                }
                                                            >
                                                                <a>
                                                                    {role.name}
                                                                </a>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        </div>
                                    )}

                                    {user.isLocked == 0 ? (
                                        <div
                                            className="tooltip"
                                            data-tip="Lock"
                                        >
                                            <Lock
                                                className="text-red-500 font-extrabold"
                                                onClick={() =>
                                                    this.setState({
                                                        selectedUser: user,
                                                        showConfirmModal: true
                                                    })
                                                }
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            className="tooltip"
                                            data-tip="Unlock"
                                        >
                                            <Unlock
                                                className="text-green-500 font-extrabold"
                                                onClick={() =>
                                                    this.setState({
                                                        selectedUser: user,
                                                        showConfirmModal: true
                                                    })
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                    </DataTable>
                </div>

                <Modal show={this.state.showCreateModal}>
                    <div className="rounded-lg min-h-24 min-w-8 text-center bg-white drop-shadow border">
                        <div
                            className="rounded-t-lg p-2 border-b flex justify-between items-center"
                            style={{
                                backgroundColor: "#674EA7",
                                color: "white",
                            }}
                        >
                            <label>CREATE USER</label>
                            <button
                                onClick={() => {
                                    this.setState({
                                        showCreateModal: false,
                                        form_data: {},
                                        form_errors: {},
                                    });
                                }}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-64 overflow-y-auto p-4 space-y-1">
                            <div className="flex flex-col text-left space-y-0">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    onChange={(e) =>
                                        this.handleChange(e.target)
                                    }
                                    defaultValue={this.state.form_data.name}
                                    name="name"
                                    className="input input-bordered p-2"
                                />
                                <label className="text-red-500">
                                    {this.state.form_errors?.name}
                                </label>
                            </div>
                            <div className="flex flex-col text-left space-y-0">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={(e) =>
                                        this.handleChange(e.target)
                                    }
                                    defaultValue={this.state.form_data.email}
                                    name="email"
                                    className="input input-bordered  p-2"
                                />
                                <label className="text-red-500">
                                    {this.state.form_errors?.email}
                                </label>
                            </div>
                            <div className="text-left flex flex-col">
                                <label>Role</label>
                                <select
                                    name="role"
                                    defaultValue={
                                        this.state.form_data.role
                                            ? this.state.form_data.role
                                            : ""
                                    }
                                    onChange={(e) =>
                                        this.handleChange(e.target)
                                    }
                                    className="input input-bordered min-w-full"
                                >
                                    <option value={""} disabled>
                                        --Choose--
                                    </option>
                                    {roles.map((role, index) => {
                                        return (
                                            <option
                                                key={index}
                                                value={role.name}
                                            >
                                                {role.name}
                                            </option>
                                        );
                                    })}
                                </select>

                                {this.state?.form_errors?.role && (
                                    <label className="text-red-500">
                                        {this.state?.form_errors?.role}
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="rounded-b-lg p-2 border flex justify-end items-center">
                            <button
                                onClick={this.add_user}
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
                                {this.state?.selectedUser?.isLocked == 1
                                    ? "Unlock"
                                    : "Lock"}{" - "}
                                <b>{this.state?.selectedUser?.name}</b>
                            </label>
                            <button
                                onClick={() => {
                                    this.setState({
                                        showConfirmModal: false,
                                        selectedUser: null
                                    });
                                }}
                                className="btn btn-sm btn-ghost btn-circle"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="h-fit p-4 space-y-1 text-left">
                            Are you sure to{" "}
                            <span className={this.state?.selectedUser?.isLocked == 1 ? "text-green-600 font-bold":"text-red-600 font-bold"}>{this.state?.selectedUser?.isLocked == 1
                                    ? "unlock"
                                    : "lock"}</span>
                            {" "}
                            this user?
                        </div>
                        <div className="rounded-b-lg p-2 flex justify-end space-x-4 items-center">
                            <button
                                onClick={() => {
                                    this.setState({
                                        showConfirmModal: false,
                                        selectedUser: null
                                    });
                                }}
                                className="p-2 px-3 btn btn-sm bg-gray-100  borer border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    this.updateUser(this.state?.selectedUser)
                                }
                                className="p-2 px-3 btn btn-sm w-16 text-white bg-red-500  border-0"
                            >
                                {locking ? (
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
            </AuthenticatedLayout>
        );
    }
}

consoleSilencer();

const root = document.querySelector("#officers-widget");

OfficersPage.defaultProps = {
    ...JSON.parse(root.getAttribute("data")),
};

createRoot(root).render(<OfficersPage />);
