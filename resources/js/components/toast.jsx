import React, { createRef } from "react";
import { Toast } from "primereact/toast";
import "primereact/resources/themes/lara-light-cyan/theme.css";

export default class Notification extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            position: "top-right",
        };

        this.toast = createRef(null);
    }

    getClassName = (type) => {
        switch (type) {
            case "success":
                return "border border-l-8 border-l-green-600";
            case "error":
                return "border border-l-8 border-l-red-600";
            case "warn":
                return "border border-l-8 border-l-yellow-600";
            default:
                return "border border-l-8 border-l-sky-600";
        }
    };

    show = ({
        type = "info",
        msg = "sample message",
        title = "Success",
        life = 3000,
        position = null,
    } = {}) => {
        if (position) {
            this.setState({ position });
        }

        this.toast.current.replace({
            severity: type,
            summary: title,
            detail: msg,
            className: this.getClassName(type) + " text-sm",
            life,
        });
    };

    render() {
        return <Toast className="max-w-xs animate-shake" ref={this.toast} />;
    }
}
