export default function CheckList({ handleChange, form_data }) {
    return (
        <div>
            <div className="grid grid-cols-2 gap-6 w-2/3 mx-auto py-8">
                {[
                    "checklist_well_presented",
                    "checklist_positive_body_language",
                    "checklist_attentive",
                    "checklist_postive_attitude",
                    "checklist_on_time",
                ].map((name, index) => {
                    name = name.split("_").slice(1);
                    const keyedName = name
                        .map((s) => {
                            return s.charAt(0);
                        })
                        .join("");
                    return (
                        <div
                            key={index}
                            className="w-full p-2 mx-auto my-auto text-2xl hover:bg-gray-200 hover:rounded-lg"
                        >
                            <label className="cursor-pointer space-x-4">
                                <input
                                    type="checkbox"
                                    name={keyedName}
                                    checked={Number(form_data[keyedName]) != 0}
                                    className="checkbox checkbox-accent"
                                    onChange={(e) =>
                                        handleChange({
                                            name: e.target.name,
                                            value: `${Number(
                                                e.target.checked
                                            )}`,
                                        })
                                    }
                                />
                                <span className="label-text capitalize">
                                    {name.join(" ")}
                                </span>
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
