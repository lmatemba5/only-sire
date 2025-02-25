import { InputText } from "primereact/inputtext";

export default function PersonalDetails({
    form_data={},
    handleChange,
    form_errors={},
}) {
    return (
        <div className="space-y-1">
            <div className="flex space-y-1 sm:space-y-0 flex-col sm:flex-row justify-evenly items-center">
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="name">Full Name</label>
                    <input
                        autoComplete="name"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.name ? "border-red-500" : ""
                        }`}
                        defaultValue={form_data?.name}
                        name="name"
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm">
                        {form_errors?.name}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="gender">Gender</label>
                    <select
                        name="gender"
                        value={form_data?.gender || ""}
                        onChange={(e) => handleChange(e.target)}
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.gender ? "border-red-500" : ""
                        }`}
                    >
                        <option disabled value="">
                            --select--
                        </option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <label className="text-red-500 text-sm">
                        {form_errors?.gender}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="age">Age</label>
                    <InputText
                        keyfilter="int"
                        autoComplete="age"
                        type="number"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.age ? "border-red-500" : ""
                        }`}
                        defaultValue={form_data?.age}
                        name="age"
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm">
                        {form_errors?.age}
                    </label>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-evenly items-center space-y-3 sm:space-y-0">
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="marital_status">Marital Status</label>
                    <select
                        name="marital_status"
                        value={form_data?.marital_status || ""}
                        onChange={(e) => handleChange(e.target)}
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.marital_status ? "border-red-500" : ""
                        }`}
                    >
                        <option disabled value="">
                            --select--
                        </option>
                        <option value="Married">Married</option>
                        <option value="Single">Single</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widow">Widowed</option>
                    </select>
                    <label className="text-red-500 text-sm">
                        {form_errors?.marital_status}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="village">Village</label>
                    <input
                        autoComplete="village"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.village ? "border-red-500" : ""
                        }`}
                        name="village"
                        defaultValue={form_data?.village}
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm">
                        {form_errors?.village}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="ta">T/A</label>
                    <input
                        autoComplete="ta"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.ta ? "border-red-500" : ""
                        }`}
                        name="ta"
                        defaultValue={form_data?.ta}
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm">
                        {form_errors?.ta}
                    </label>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center">
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="district">District</label>
                    <input
                        autoComplete="district"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.district ? "border-red-500" : ""
                        }`}
                        name="district"
                        defaultValue={form_data?.district}
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm">
                        {form_errors?.district}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="phone">Phone</label>
                    <input
                        autoComplete="phone"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.phone ? "border-red-500" : ""
                        }`}
                        name="phone"
                        defaultValue={form_data?.phone}
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm -top-2">
                        {form_errors?.phone}
                    </label>
                </div>
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="email">Email</label>
                    <InputText
                        keyfilter="email"
                        autoComplete="email"
                        type="email"
                        className={`w-full input input-bordered max-h-10 ${
                            form_errors?.email ? "border-red-500" : ""
                        }`}
                        name="email"
                        defaultValue={form_data?.email}
                        onChange={(e) => handleChange(e.target)}
                    />
                    <label className="text-red-500 text-sm -top-2">
                        {form_errors?.email}
                    </label>
                </div>
            </div>
        </div>
    );
}
