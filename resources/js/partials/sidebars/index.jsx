import {
    Building,
    Home,
    ScrollText,
    Users,
} from "lucide-react";

export default function SidebarManager(props) {
    const {
        activeTab,
        auth: {
            user: { role },
        },
    } = props;

    return (
        <div className="full-sidebar overflow-y-auto p-4 space-y-3 flex flex-col">
            <ul className="space-y-1 capitalize py-4 ">
                <li
                    className={`hover:bg-slate-500 hover:text-white rounded-lg p-1 pl-0 border ${
                        activeTab == "dashboard"
                            ? "border-slate-600 bg-slate-600"
                            : "border-slate-700"
                    }`}
                >
                    <a
                        href="/dashboard"
                        className={`flex items-center w-full space-x-2 p-1 `}
                    >
                        <Home className="h-5" />
                        <span>Dashboard</span>
                    </a>
                </li>

                <li>
                    <div className="my-6 text-xs font-extrabold uppercase  text-white">
                        <label className="">Interviews</label>
                    </div>
                </li>

                {(role == "Country Admin") && (
                    <>
                        <li
                            className={`hover:bg-slate-500 hover:text-white rounded-lg p-1 pl-0 border ${
                                activeTab == "users"
                                    ? "border-slate-600 bg-slate-600"
                                    : "border-slate-700"
                            }`}
                        >
                            <a
                                href="/users"
                                className={`flex items-center w-full p-1  space-x-2`}
                            >
                                <Users className="h-5" />
                                <span>Users</span>
                            </a>
                        </li>

                        <li
                            className={`hover:bg-slate-500 hover:text-white rounded-lg p-1 pl-0 border ${
                                activeTab == "venues"
                                    ? "border-slate-600 bg-slate-600"
                                    : "border-slate-700"
                            }`}
                        >
                            <a
                                href="/venues"
                                className={`flex items-center w-full p-1  space-x-2`}
                            >
                                <Building className="h-5" />
                                <span>Venues</span>
                            </a>
                        </li>
                    </>
                )}

                <li
                    className={`hover:bg-slate-500 hover:text-white rounded-lg p-1 pl-0 border  ${
                        activeTab == "interviews"
                            ? "border-slate-600 bg-slate-600"
                            : "border-slate-700"
                    }`}
                >
                    <a
                        href="/interviews"
                        className={`flex items-center w-full p-1  space-x-2`}
                    >
                        <ScrollText className="h-5" />
                        <span>New Interview</span>
                    </a>
                </li>
            </ul>
        </div>
    );
}
