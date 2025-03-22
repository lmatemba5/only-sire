export default function SocialMediaLinks({
    form_data,
    handleChange,
    form_errors
}) {

    return (
        <div className="space-y-3">
            <div className="flex space-y-3 sm:space-y-0 flex-col sm:flex-row justify-evenly items-center">
                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="facebook_link">Facebook</label>
                    <input
                        className={`w-full input input-bordered ${form_errors.facebook_link ? "border-red-500" : ""
                            }`}
                        name="facebook_link"
                        autoComplete="facebook_link"
                        value={form_data.facebook_link}
                        onChange={(e) => handleChange(e.target)}
                        placeholder="paste link or type no"
                    />
                    <label className="text-red-500">
                        {form_errors.facebook_link}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="instagram_link">Instagram</label>
                    <input
                        className={`w-full input input-bordered ${form_errors.instagram_link ? "border-red-500" : ""
                            }`}
                        name="instagram_link"
                        autoComplete="instagram_link"
                        value={form_data.instagram_link}
                        onChange={(e) => handleChange(e.target)}
                        placeholder="paste link or type no"
                    />
                    <label className="text-red-500">
                        {form_errors.instagram_link}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/3 px-3 space-y-1">
                    <label htmlFor="linkedin_link">Linkedin</label>
                    <input
                        className={`w-full input input-bordered ${form_errors.linkedin_link ? "border-red-500" : ""
                            }`}
                        name="linkedin_link"
                        autoComplete="linkedin_link"
                        value={form_data.linkedin_link}
                        onChange={(e) => handleChange(e.target)}
                        placeholder="paste link or type no"
                    />
                    <label className="text-red-500">
                        {form_errors.linkedin_link}
                    </label>
                </div>
            </div>

            <div className="flex space-y-3 sm:space-y-0 flex-col sm:flex-row justify-evenly items-center">
                <div className="flex flex-col w-full sm:w-1/2 px-3 space-y-1">
                    <label htmlFor="twitter_link">Twitter</label>
                    <input
                        className={`w-full input input-bordered ${form_errors.twitter_link ? "border-red-500" : ""
                            }`}
                        name="twitter_link"
                        autoComplete="twitter_link"
                        value={form_data.twitter_link}
                        onChange={(e) => handleChange(e.target)}
                        placeholder="paste link or type no"
                    />
                    <label className="text-red-500">
                        {form_errors.twitter_link}
                    </label>
                </div>

                <div className="flex flex-col w-full sm:w-1/2 px-3 space-y-1">
                    <label htmlFor="related_to">Related To</label>
                    <input
                        className={`w-full input input-bordered ${form_errors.related_to ? "border-red-500" : ""
                            }`}
                        name="related_to"
                        autoComplete="related_to"
                        value={form_data.related_to}
                        onChange={(e) => handleChange(e.target)}
                        placeholder="type name + relationship or type N/A"
                    />
                    <label className="text-red-500">
                        {form_errors.related_to}
                    </label>
                </div>
            </div>
        </div>
    );
}
