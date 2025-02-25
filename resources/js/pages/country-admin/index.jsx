import { createRoot } from "react-dom/client";
import React, { createRef } from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import consoleSilencer from "@/components/console-silencer";

export default class IndexPage extends React.Component {
    parentRef = createRef();
    toastRef = createRef();

    render() {
        return (
            <AuthenticatedLayout
                ref={this.parentRef}
                {...{ ...this.props, toastRef: this.toastRef }}
            >
                <div className="h-screen flex flex-col justify-center items-center">
                    <label className="uppercase text-4xl mb-6 font-bold">Dashboard</label>
                    <img
                        src="/images/coming-soon.png"
                        className="text-slate-800 font-extrabold uppercase h-20"
                    />
                </div>
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
