import { createRoot } from "react-dom/client";
import consoleSilencer from "@/components/console-silencer";


export default function HomePage(){
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <a href="/login" className="btn">Login</a>
        </div>
    );
}

consoleSilencer();

createRoot(document.getElementById("root")).render(<HomePage />);