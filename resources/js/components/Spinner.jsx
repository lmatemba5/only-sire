import React from "react";

export default function Spinner({
    textSize = "text-sm",
    className = "w-6 h-6 border-solid",
    text = "Just a moment...",
    align = "row",
    hidden = false,
    mainClass=""
}) {
    return (
        <div
            hidden={hidden}
            className={`flex flex-row items-center font-bold ${
                align == "row"
                    ? "space-x-2"
                    : "flex-col justify-center space-y-2"
            } `+mainClass}
        >
            <span
                className={
                    "animate-spin border-4 border-t-blue-800 border-r-blue-800 rounded-full " +
                    className
                }
            ></span>
           {
            text ?
            <label className={textSize}>{text}</label>:
            undefined
           }
        </div>
    );
}
