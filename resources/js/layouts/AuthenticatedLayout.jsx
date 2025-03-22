import { ChevronRight, LogOut, Menu, X } from "lucide-react";
import Notification from "@/components/toast";
import SidebarManager from "@/partials/sidebars";
import React from "react";
import { Modal } from "flowbite-react";
import { Sidebar } from "primereact/sidebar";

export default class AuthenticatedLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDropdown: false,
            showSidebar: false,
        };
    }

    setShow = (showDropdown = false) => {
        this.setState({ showDropdown });
    };

    generateMonths = () => {
        const currentMonth = new Date().getMonth() + 1;
        const previousMonths = [];
        const year = new Date().getFullYear();

        for (let i = currentMonth; i > 0; i--) {
            previousMonths.push({
                id: i,
                name: new Date(`${i}-01-${year}`).toLocaleDateString(
                    "default",
                    { month: "long" }
                ),
                year,
            });
        }

        if (currentMonth == 1) {
            previousMonths.push(
                ...[
                    {
                        id: 12,
                        name: "December",
                        year: year - 1,
                    },
                    {
                        id: 11,
                        name: "November",
                        year: year - 1,
                    },
                ]
            );
        } else if (currentMonth == 2) {
            previousMonths.push(
                ...[
                    {
                        id: 12,
                        name: "December",
                        year: year - 1,
                    },
                ]
            );
        }

        return previousMonths;
    };

    toggleVenueModal = () => {
        document.querySelector("#venue_modal").showModal();
    };

    render() {
        const {auth} = this.props
        return (
            <div className="card flex justify-content-center font-serif h-screen w-screen">
                <div className="min-h-screen flex overflow-hidden max-w-screen-2xl">
                    <div className="min-h-screen flex flex-col w-full bg-gray-100 dark:bg-slate-600 overflow-hidden">
                        <header className="w-full flex items-center shadow bg-white dark:bg-slate-600 drop-shadow">
                            <div className="h-16 hidden lg:flex items-center justify-start space-x-2 font-bold p-4 pl-0 w-64 bg-white dark:bg-slate-600">
                                <img
                                    src="/images/logo.png"
                                    className="flex justify-center items-center w-16 border-gray-400 dark:bg-slate-600 rounded-full"
                                />
                                <label className="text-3xl dark:text-white">iERA</label>
                            </div>
                            <div className="flex flex-row max-h-16  w-full">
                                <div className="w-full navbar bg-white justify-between">
                                    <div className="flex flex-row space-x-3">
                                        <label
                                            onClick={() =>
                                                this.setState({
                                                    showSidebar: true,
                                                })
                                            }
                                            className="lg:hidden"
                                        >
                                            <Menu className="w-8 h-6 hover:cursor-pointer hover:text-blue-500" />
                                        </label>
                                        <label className="hidden lg:block">
                                            <Menu className="w-8 h-6 hover:text-blue-500" />
                                        </label>
                                        <div className="flex uppercase flex-row items-center">
                                            <label className="text-blue-600">{this.props.auth.user.role}</label>
                                            <ChevronRight size={16}/>
                                            <label className="">{this.props.activeTab.split('_').join(' ')}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center pr-3">
                                    <img
                                        onClick={() =>
                                            this.setState({
                                                showDropdown: true,
                                            })
                                        }
                                        src={auth?.user?.avatar ? 'https://lh3.googleusercontent.com/a/'+auth?.user?.avatar: "/images/user.png"}
                                        className="w-9 h-9 p-1 cursor-pointer hover:ring-2 hover:border-2 hover:border-gray-200 rounded-full hover:ring-gray-300"
                                    />
                                </div>
                            </div>
                        </header>
                        <main>
                            <aside className="fixed min-h-screen w-60 hidden lg:block bg-slate-900 text-white">
                                <SidebarManager {...this.props} />
                            </aside>
                            <div
                                className={`overflow-y-auto full-main-content lg:ml-60 flex flex-col bg-white dark:bg-slate-800`}
                            >
                                {this.props.children}
                            </div>
                        </main>
                    </div>
                </div>

                <Sidebar
                    visible={this.state.showSidebar}
                    onHide={() => this.setState({ showSidebar: false })}
                    className="max-w-60"
                    content={({hide }) => (
                        <div className="flex flex-col h-full max-w-fit px-0 bg-slate-800 text-white">
                            <div className="flex items-center justify-between pt-3 flex-shrink-0">
                                <span className="flex items-center gap-2">
                                    <img
                                        src="/images/logo.png"
                                        className="flex justify-center items-center w-16 border-gray-400 rounded-full"
                                    />
                                    <label className="text-3xl">iERA</label>
                                </span>
                                <span className="pr-3">
                                    <button onClick={hide} className="btn btn-md btn-circle btn-ghost border border-gray-200">
                                        <X />
                                    </button>
                                </span>
                            </div>
                            <ul className="w-60 min-h-full p-0">
                                <SidebarManager {...this.props} />
                            </ul>
                        </div>
                    )}
                ></Sidebar>

                <Notification ref={this.props.toastRef} />
                <Modal
                    className="max-w-fit p-0 max-h-fit mr-0 mt-16 ml-auto"
                    dismissible
                    show={this.state.showDropdown}
                    onClose={() => this.setShow(false)}
                >
                    <Modal.Body className="pb-2 pt-0 px-0 rounded-lg overflow-hidden w-36 border border-gray-300 shadow">
                        <div className="w-full border-b shadow py-1 bg-gray-100">
                            <label className="capitalize p-3">{auth.user.name}</label>
                        </div>
                        <form action="/logout" method="post">
                            <input
                                hidden
                                name="_token"
                                defaultValue={this.props.csrf_token}
                            />
                            <label
                                onClick={() => {
                                    this.setShow(false);
                                    document
                                        .querySelector("button#submit")
                                        .click();
                                }}
                                className="flex p-2 cursor-pointer justify-start items-center  hover:bg-gray-50 w-full border-0 border-transparent flex-row space-x-3"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </label>
                            <button hidden id="submit"></button>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}
