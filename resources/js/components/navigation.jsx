import React from "react";
import axios from "axios";

export default class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ALL_TABS: [
                "personal_details",
                "social_media_links",
                "education",
                "basic_islamic_knowledge",
                "dawah_knowledge",
                "dawah_experience",
                "travel",
                "people_skills",
                "language_skills",
                "computer_skills",
                "team_management",
                "reporting_skills",
                "complementary_skills",
                "interview_checklist",
                "recommendation",
                "additional_questions",
                "",
                "",
            ],
            queue: ["personal_details", "social_media_links", "education"],
            index: 2,
            currentPage: "personal_details",
            is_processing: false,
            form_data: {
                totalScore: [],
                wp: "0",
                pbl: "0",
                a: "0",
                pa: "0",
                ot: "0",
                candidate_no: undefined
            },
            form_errors: {},
            activeQuestion: 1,
        };
    }

    filterFormData = (currentPage, form_data) => {
        switch (currentPage) {
            case "social_media_links":
                const {
                    facebook_link,
                    twitter_link,
                    linkedin_link,
                    instagram_link,
                    related_to,
                    conducted_by,
                } = form_data;
                return {
                    facebook_link,
                    twitter_link,
                    linkedin_link,
                    instagram_link,
                    related_to,
                    conducted_by,
                };
            case "personal_details":
                const {
                    name,
                    age,
                    marital_status,
                    village,
                    ta,
                    district,
                    email,
                    phone,
                    gender,
                    conducted_by: conduct1,
                } = form_data;
                return {
                    name,
                    age,
                    marital_status,
                    village,
                    ta,
                    district,
                    email,
                    phone,
                    gender,
                    conducted_by: conduct1,
                };
            case "interview_checklist":
                const { wp, pbl, a, pa, ot, conducted_by: conduct2 } = form_data;
                return {
                    wp,
                    pbl,
                    a,
                    pa,
                    ot,
                    conducted_by: conduct2,
                };
            case "additional_questions":
                const {
                    conducted_by: conduct3,
                    when_to_start,
                    planned_holidays,
                    prev_org,
                    prev_org_objective,
                    iera_friends,
                    questions,
                    previous_job,
                } = form_data;

                return {
                    when_to_start,
                    planned_holidays,
                    prev_org,
                    prev_org_objective,
                    iera_friends,
                    questions,
                    previous_job,
                    conducted_by: conduct3,
                };
            default:
                return {
                    conducted_by: form_data.conducted_by,
                    [currentPage]: form_data[currentPage],
                    [currentPage + "_marks"]: form_data[currentPage + "_marks"],
                };
        }
    };

    validate = async (e) => {
        let { currentPage, form_data } = this.state;
        const data = {
            tab: currentPage,
            ...this.filterFormData(currentPage, form_data),
        };

        this.setState({
            is_processing: true,
        });

        await axios.post("/api/v1/validate_candidate_data", data, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${this.props.token}`
            }
        }).then((resp) => {
            if (currentPage == "additional_questions") {
                
                this.props.toastRef.current.show({
                    type: "success",
                    msg: "Interview form has been submitted successfully",
                    position: "center",
                    life: 5000,
                });

                this.setState({
                    ...this.state,
                    form_data: {
                        totalScore: [],
                        wp: "0",
                        pbl: "0",
                        a: "0",
                        pa: "0",
                        ot: "0",
                        candidate_no: undefined
                    },
                    form_errors: {},
                    activeQuestion: 1
                })

                this.props.updateCandidate()
            }else{
                this.next();
            }
        }).catch((error) => {
            this.setState({
                form_errors: error?.response?.data?.errors,
                is_processing: false,
            });
        });
    };

    sum = () => {
        const score =
            this.state.form_data?.totalScore?.reduce((a, b) => {
                return a + b;
            }, 0) | 0;

        return score;
    };

    next = (params) => {
        let { index, queue, ALL_TABS, currentPage, form_data } =
            params != null ? params : this.state;

        if (index < ALL_TABS.length - 1) {
            index += 1;

            if (index > 2) {
                queue.shift();
                queue.push(ALL_TABS[index]);
                currentPage = queue[0];
            }

            this.updateTotalScore(form_data);

            this.setState({
                queue,
                index,
                currentPage,
                form_data,
                form_errors: {},
                is_processing: false,
            });
        }
    };

    updateTotalScore = (form_data) => {
        Object.entries(form_data)
            .filter(
                (pred) =>
                    pred[0].includes("_marks") ||
                    ["wp", "pbl", "a", "pa", "ot"].includes(pred[0])
            )
            .forEach((entry, index) => {
                const mark = entry[1].split("/")[0];
                form_data.totalScore[index] = Number(mark);
            });
    };

    back = () => {
        let { index, queue, ALL_TABS, currentPage } = this.state;

        if (index > 0) {
            index -= 1;

            if (index > 1) {
                queue.pop();
                queue = [ALL_TABS[index - 2], ...queue];
                currentPage = queue[queue.length - 3];
            }

            this.setState({
                queue,
                index,
                currentPage,
            });
        }
    };
}
