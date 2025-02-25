export default {
    education: {
        question: {
            key: "education",
            title: [
                "Please tell us about your educational background.",
                "Any relevant certificates or degrees?",
            ],
        },
        info: {
            description:
                "Point is given if the candidate has a minimun of secondary level education",
            scores: ["Secondary/Certificate", "College", "Degree"],
        },
        maxMark: 3,
    },
    basic_islamic_knowledge: {
        question: {
            key: "basic_islamic_knowledge",
            title: "Please tell us about any Islamic education you have received?",
            emphasize: "Focus on aqeedah questions like:",
            description: [
                "Who is Allah and where is he? (some say Allah is everywhere)",
                "What does it mean to follow the messenger? (p.b.u.h)",
                "Why should we follow the companions?, etc",
            ],
        },
        info: {
            description:
                "Point is given if the candidate has foundational Islamic  knowledge. He needs to be able to explain who Allah is,recite Quran and know the 5 pillars of Islam.",
            scores: [
                "Basic Islamic Knowledge",
                "Intermediate/certificate",
                "Ijaazah/ Islamic Degree",
            ],
        },
        maxMark: 3,
    },
    dawah_knowledge: {
        question: {
            key: "dawah_knowledge",
            title: "Please describe how you would give da'wah to to a christian pastor and a farmer?",
            emphasize: "The interviewee should also:",
            description: ["Give aayat and ahaadeeh of da'wah"],
        },
        info: {
            description:
                "Point is given if the candidate understands what Da'wah is and is able to explain it.",
            scores: ["Basic", "Intermediate", "Advanced"],
        },
        maxMark: 3,
    },

    dawah_experience: {
        question: {
            key: "dawah_experience",
            title: "How can you afford to retain your shahadahs (new muslims) so that they do not go back to their old religion?",
            emphasize: "The interviewee should also give:",
            description: [
                "4 points that can make someone embrace islam (more fail to convince people)",
                "Say what they will do to have at least a shahadah per day?",
            ],
        },
        info: {
            description:
                "Point is given if the candidate has da'wah experience. Indicators are Shahadahs achieved and  dawah activities conducted.",
            scores: ["(0-2) years", "(2-4) years", "(5+) years"],
        },
        maxMark: 3,
    },
    travel: {
        question: {
            key: "travel",
            title: "Are you willing to travel to remote locations and villages with a short notice?",
            emphasize: "The interviewee should also:",
            description: [
                "Explain what he/she will do to create a good relationship with the villagers when he/she is living among them?",
            ],
        },
        info: {
            description:
                "Point is given if the candidate is able to travel to remote locations and villages plus able to be away from family for weeks.",
            scores: ["Local travel", "Remote villages", "Extended travel"],
        },
        maxMark: 3,
    },
    people_skills: {
        question: {
            key: "people_skills",
            title: ["Scenario: "],
            subtitle: "You are doing dawah to someone who is shouting about...",
            emphasize: "The interviewee should:",
            description: [
                "Describe how they will deal with this situation?",
                "Also explain how he/she would handle muslims of different sects in his/her community as da'ee?",
            ],
        },
        info: {
            description:
                "Point is given if the candidate is able to demostrate a level of emotional intelligence.",
            scores: [
                "Limited understanding / EQ",
                "Satisfactory understanding / EQ",
                "Excellent understanding / EQ",
            ],
        },
        maxMark: 3,
    },
    language_skills: {
        question: {
            key: "language_skills",
            title: "What local language(s) do you speak, if any?",
        },
        info: {
            description:
                "Points are given if the candidate is able to demostrate a level of fluency in the local languages.",
            scores: [
                "Beginner usage of local language",
                "Fluent in some other local dialects",
                "Fluent in all local dialects",
            ],
        },
        maxMark: 3,
    },
    computer_skills: {
        question: {
            key: "computer_skills",
            title: [
                "Do you know how to use MS Office or G-Suite?",
                "If yes, please explain",
            ],
        },
        info: {
            description:
                "Point is given if the candidate is able to demostrate a level of computer literacy.",
            scores: ["Basic", "Intermediate", "Advanced"],
        },
        maxMark: 3,
    },
    team_management: {
        question: {
            key: "team_management",
            title: [
                "Do you have experience of managing a team?",
                "If yes, please give details",
            ],
        },
        info: {
            description:
                "Point is given if the candidate is able to demostrate a level of management skills.",
            scores: ["Basic", "Advanced"],
        },
        maxMark: 2,
    },
    reporting_skills: {
        question: {
            key: "reporting_skills",
            title: [
                "What can you do to make sure that you are submitting",
                "your daily report in time?",
            ],
        },
        info: {
            description:
                "Point is given if the candidate has other skills relevant to the role.",
            scores: ["Basic", "Advanced"],
        },
        maxMark: 2,
    },
    complementary_skills: {
        question: {
            key: "complementary_skills",
            title: [
                "What other skills do you have that we have not already discussed that you feel would benefit this role?",
            ],
            emphasize: "For example:",
            description: [
                "Social media,video editing/production, marketing skills, strong networks etc",
            ],
        },
        info: {
            description:
                "Point is given if the candidate has other skills relevant to the role.",
            scores: ["Basic", "Advanced"],
        },
        maxMark: 2,
    },
    recommendation: {
        question: {
            key: "recommendation",
            title: ["What's your recommendation for this candidate?"],
        },
        info: {
            description: "Guideline on how to recommend, you can ",
            scores: [
                "Show that candidate was recommended by local partners/organizations/stakeholders ",
                "Show that interview raised awareness of additional skill sets",
                "Show that candidate is higly recommended",
                "Give reasons why candidate should be considered",
            ],
        },
        maxMark: 5,
    },
};
