import InfoIcon from "@/components/InfoIcon";

export default function QuestionTemplate({
    form_data,
    handleChange,
    details,
    form_errors,
}) {
    const { question, info, maxMark } = details;

    const arrayableMarks = () => {
        const allMarks = [];

        for (let i = 0; i <= maxMark; i++) {
            allMarks.push(i);
        }

        return allMarks;
    };

    const getQuestionTitle = () => {
        try {
            if (question.subtitle) {
                return (
                    <p>
                        {question.title.map((para, index) => {
                            return <span key={index}>{para}</span>;
                        })}{" "}
                        <span className="font-light">{question.subtitle}</span>
                    </p>
                );
            }
            return question.title.map((para, index) => {
                return <p key={index}>{para}</p>;
            });
        } catch (error) {
            return question.title;
        }
    };

    const getQuestionFocus = () => {
        const emphasize = question.emphasize;

        if (emphasize) {
            return <i className="mb-2 text-lg">{emphasize}</i>;
        }
    };

    const getQuestionDescription = () => {
        try {
            return (
                <ul className="list-decimal list-inside">
                    {question.description.map((para, index) => {
                        return <li key={index}> - {para}</li>;
                    })}
                </ul>
            );
        } catch (error) {
            return question.description;
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex space-y-3 sm:space-y-0 flex-col sm:flex-row justify-evenly items-center">
                <div className="flex flex-col w-full px-3 space-y-1">
                    <div className="flex justify-between">
                        <div className="w-11/12">
                            <div className="mb-3 font-semibold text-lg">
                                {getQuestionTitle()}
                            </div>
                            {getQuestionFocus()}
                            {getQuestionDescription()}
                        </div>

                        <div
                            className={`${
                                info.scores.length > 0 ? "" : "hidden"
                            } w-1/12 flex justify-end`}
                        >
                            <div className="dropdown dropdown-bottom dropdown-end dropdown-hover w-fit h-fit">
                                <div
                                    tabIndex={0}
                                    role="button"
                                    className="btn btn-circle btn-ghost btn-sm text-info p-0"
                                >
                                    <InfoIcon className="font-extrabold h-6 w-6" />
                                </div>
                                <div
                                    tabIndex={0}
                                    className="card border compact dropdown-content z-[1] shadow bg-base-100 rounded-box w-72"
                                >
                                    <div tabIndex={0} className="card-body">
                                        <div>
                                            {info.description}
                                            <ul className="list-decimal list-inside">
                                                {info.scores.map(
                                                    (score, index) => {
                                                        return (
                                                            <li key={index}>
                                                                {" "}
                                                                - {score}
                                                            </li>
                                                        );
                                                    }
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {[1].map((q) => {
                        const hashes = [question.key, question.key + "_marks"];
                        return (
                            <div
                                key={hashes[0]}
                                className="flex flex-col w-full"
                            >
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
                                    <textarea
                                        key={hashes[0] + hashes[1]}
                                        className={`${
                                            maxMark ? "w-10/12" : "w-full"
                                        } input input-bordered h-24 w-full sm:w-10/12 max-h-24 ${
                                            form_errors[question.key]
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        name={question.key}
                                        value={form_data[question.key]}
                                        onChange={(e) => handleChange(e.target)}
                                    ></textarea>
                                    <div
                                        className={`${
                                            maxMark ? "" : "hidden"
                                        } w-full sm:w-2/12 flex flex-col items-end`}
                                    >
                                        <label
                                            htmlFor={
                                                form_data[
                                                    question.key + "_marks"
                                                ]
                                            }
                                            className="text-left"
                                        >
                                            Score
                                        </label>
                                        <select
                                            key={hashes[1]}
                                            value={
                                                form_data[
                                                    question.key + "_marks"
                                                ]
                                            }
                                            defaultValue=""
                                            name={question.key + "_marks"}
                                            onChange={(e) =>
                                                handleChange(e.target)
                                            }
                                            className={`w-20 input input-bordered ${
                                                form_errors[
                                                    question.key + "_marks"
                                                ]
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                        >
                                            <option disabled value="">--</option>
                                            {arrayableMarks().map(
                                                (mark, index) => {
                                                    const value = `${mark}/${maxMark}`;
                                                    return (
                                                        <option
                                                            key={index}
                                                            value={mark}
                                                        >
                                                            {value}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <label className="text-red-500">
                                    {form_errors[question.key] ||
                                        form_errors[question.key + "_marks"]}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
