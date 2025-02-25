import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React from "react";
import { createRoot } from "react-dom/client";
import consoleSilencer from "@/components/console-silencer";

export default class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {},
            is_processing: false,
            is_redirecting: false,
            show_password: false,
        };
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.setState({
            is_processing: true,
            errors: {},
        });

        const data = Object.fromEntries(new FormData(event.target));

        await axios
            .post("/login", data)
            .then(() => {
                this.setState({
                    is_processing: false,
                    errors: {},
                    is_redirecting: true,
                });

                window.location.href = "/dashboard";
            })
            .catch((error) => {
                this.setState({
                    is_processing: false,
                    errors: {
                        email: error?.response?.data?.message,
                    },
                });
            });
    };

    handleGoogleLogin = () => {
        this.setState({
            is_processing: false,
            errors: {},
            is_redirecting: true,
        });

        window.location.href = "/google_login";
    };

    render() {
        const { is_processing, errors, is_redirecting } = this.state;

        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="w-10/12 md:w-4/12 mx-auto rounded-xl p-6 bg-white shadow drop-shadow-2xl">
                    <form
                        onSubmit={this.handleSubmit}
                        className="flex flex-col space-y-2 mb-6"
                    >
                        <input
                            name="_token"
                            value={this.props.csrf_token}
                            hidden
                        />

                        <div className="flex flex-col space-y-1">
                            <input
                                className=" input input-bordered rounded-lg border border-gray-200 p-2 px-3"
                                type="email"
                                required
                                name="email"
                                placeholder="Email"
                            />
                        </div>
                        {errors?.email && (
                            <label className="text-red-500">
                                {errors?.email}
                            </label>
                        )}

                        <div className="flex flex-col space-y-1 relative">
                            <input
                                className="input input-bordered  mt-4 rounded-lg border border-gray-200 p-2 px-3"
                                type={this.state.show_password ? "text" : "password"}
                                required
                                name="password"
                                placeholder="Password"
                            />
                            {
                                !this.state.show_password ? (
                                    <EyeOff
                                        className="absolute top-6 right-4 cursor-pointer"
                                        onClick={() =>
                                            this.setState({
                                                show_password: true,
                                            })
                                        }
                                        color="gray"
                                    />
                                ) : (
                                    <Eye
                                        className="absolute top-6 right-4 cursor-pointer"
                                        onClick={() =>
                                            this.setState({
                                                show_password: false,
                                            })
                                        }
                                        color="gray"
                                    />
                                )
                            }
                        </div>

                        <div>
                            {is_redirecting ? (
                                <div className="w-full rounded-lg bg-green-500 text-white italic text-center p-2  mt-4">
                                    redirecting.....
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={is_processing}
                                    className="btn hover:bg-blue-400 bg-blue-600 w-full text-white p-3 mt-4 font-bold rounded-lg"
                                >
                                    {is_processing ? (
                                        <div className="flex space-x-2 justify-center items-center">
                                            <svg
                                                className="animate-spin h-5 w-5 mr-3 border-4 border-gray-400 border-l-white border-t-white rounded-full"
                                                viewBox="0 0 24 24"
                                            ></svg>
                                            <label className="capitalize">
                                                Processing...
                                            </label>
                                        </div>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="flex flex-col justify-center items-center space-y-4">
                        <fieldset className="w-full border-t-2">
                            <legend className="text-center w-2/12">Or</legend>
                        </fieldset>
                        <button
                            disabled={is_processing || is_redirecting}
                            className="gsi-material-button btn w-full"
                            onClick={this.handleGoogleLogin}
                        >
                            <div className="gsi-material-button-content-wrapper">
                                <div className="gsi-material-button-icon">
                                    <svg
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 48 48"
                                        style={{ display: "block" }}
                                    >
                                        <path
                                            fill="#EA4335"
                                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                                        ></path>
                                        <path
                                            fill="#4285F4"
                                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                                        ></path>
                                        <path
                                            fill="#FBBC05"
                                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                                        ></path>
                                        <path
                                            fill="#34A853"
                                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                                        ></path>
                                        <path
                                            fill="none"
                                            d="M0 0h48v48H0z"
                                        ></path>
                                    </svg>
                                </div>
                                <span className="gsi-material-button-contents">
                                    Sign in with Google
                                </span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

consoleSilencer();

const root = document.getElementById("login-widget");

LoginPage.defaultProps = {
    ...JSON.parse(root.getAttribute("data")),
};

createRoot(root).render(<LoginPage />);
