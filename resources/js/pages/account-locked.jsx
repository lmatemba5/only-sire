import { Lock, LogOut} from "lucide-react";
import { createRoot } from "react-dom/client";
import consoleSilencer from "@/components/console-silencer";

export default function AccountLockedPage(props) {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen space-y-8">
            <Lock size={50} className="text-sky-900 font-extrabold" />
            <label className=" text-sky-900 uppercase font-extrabold">
                Account Locked
            </label>

            <form action="/logout" method="post">
                <input
                    hidden
                    name="_token"
                    defaultValue={props.csrf_token}
                />
                <label
                    onClick={() => {
                        document.querySelector("button#submit").click();
                    }}
                    className="rounded-lg flex p-2 px-3 justify-start items-center  hover:bg-red-500 w-full bg-red-600 flex-row space-x-3"
                >
                    <LogOut size={15} color="white"/>
                    <span className="text-white">Logout</span>
                </label>
                <button hidden id="submit"></button>
            </form>
        </div>
    );
}

consoleSilencer();

const root = document.getElementById("account-locked-widget");

AccountLockedPage.defaultProps = {
    ...JSON.parse(root.getAttribute("data")),
};

createRoot(root).render( <AccountLockedPage />);
