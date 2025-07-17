import { createRoot } from "react-dom/client";
import consoleSilencer from "@/components/console-silencer";

export default function HomePage() {
    return (
        <>
            <nav class="bg-white shadow-lg fixed w-full z-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 flex items-center">
                                <span class="text-xl font-bold text-blue-600">
                                    SIRE
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center space-x-20">
                            <div class="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                                <a
                                    href="#features"
                                    class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    Features
                                </a>
                                <a
                                    href="#updates"
                                    class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    Updates
                                </a>
                                <a
                                    href="#integrations"
                                    class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    Integrations
                                </a>
                                <a
                                    href="#about"
                                    class="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium"
                                >
                                    About Us
                                </a>
                            </div>
                            <a
                                href="/login"
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 transform hover:scale-105"
                            >
                                Login <i class="fas fa-sign-in-alt ml-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <section
                id="home"
                class="hero-bg min-h-screen flex items-center pt-16"
            >
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight ">
                            Revolutionizing The Hiring Process
                        </h1>
                        <p class="text-xl text-gray-200 mb-8">
                            The tool that simplifies interviewing,
                            making the process smooth and less exhausting.
                        </p>
                        <div class="absolute bottom-0 mx-auto pb-16">
                            <a
                                href="#"
                                class="bg-white hover:bg-gray-100 text-blue-600 px-6 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105 text-center"
                            >
                                Watch Demo{" "}
                                <i class="fas fa-play-circle ml-2"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-20 bg-gray-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div id="features" class="text-center mb-16">
                        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything you need to streamline your interview
                            process
                        </h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="feature-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
                            <div class="feature-icon text-blue-500 text-4xl mb-6">
                                <i class="fas fa-calendar-check"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">
                                Automated Scheduling
                            </h3>
                            <p class="text-gray-600">
                                SIRE automatically manages your venues, access
                                permissions, and invitations for a seamless
                                experience.
                            </p>
                        </div>

                        <div class="feature-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
                            <div class="feature-icon text-blue-500 text-4xl mb-6">
                                <i class="fas fa-chart-bar"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">
                                Candidate Analytics
                            </h3>
                            <p class="text-gray-600">
                                Data-driven comparison tools that analyze key
                                candidate attributes for smarter and more
                                transparent hiring.
                            </p>
                        </div>

                        <div class="feature-card bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300">
                            <div class="feature-icon text-blue-500 text-4xl mb-6">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3 class="text-xl font-bold text-gray-900 mb-3">
                                Collaborative Evaluation
                            </h3>
                            <p class="text-gray-600">
                                Multiple interviewers can provide feedback in
                                real-time, with all notes consolidated in one
                                place.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="py-20 bg-white">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="text-center mb-16">
                        <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            What People Say
                        </h2>
                        <p class="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
                            Trusted by top-level management and hiring teams
                            worldwide.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div class="testimonial-card bg-gray-50 p-8 rounded-xl shadow-md transition duration-300">
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0">
                                    <img
                                        class="h-12 w-12 rounded-full"
                                        src="https://reports.ieraafrica.org/img/avatars/annonymous.png"
                                        alt="Shaheedah Saidi"
                                    />
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-gray-900">
                                        Shaheedah Saidi
                                    </h4>
                                    <p class="text-gray-600">
                                        Assistant Country Admin, Latam
                                    </p>
                                </div>
                            </div>
                            <div class="text-yellow-400 mb-4">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <p class="text-gray-700 italic">
                                "SIRE has reduced our time-to-hire by 40%. The
                                collaborative evaluation feature ensures all
                                interviewers are aligned, and we're making
                                better hiring decisions as a result."
                            </p>
                        </div>

                        <div class="testimonial-card bg-gray-50 p-8 rounded-xl shadow-md transition duration-300">
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0">
                                    <img
                                        class="h-12 w-12 rounded-full"
                                        src="https://reports.ieraafrica.org/img/avatars/annonymous.png"
                                        alt="Elias Pemba"
                                    />
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-gray-900">
                                        Elias Pemba
                                    </h4>
                                    <p class="text-gray-600">
                                        NGO Coordinator, Malawi
                                    </p>
                                </div>
                            </div>
                            <div class="text-yellow-400 mb-4">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <p class="text-gray-700 italic">
                                "The automated scheduling alone is worth the
                                investment. No more back-and-forth emails trying
                                to coordinate interviews across time zones. Our
                                interviewers love the seamless experience too."
                            </p>
                        </div>

                        <div class="testimonial-card bg-gray-50 p-8 rounded-xl shadow-md transition duration-300">
                            <div class="flex items-center mb-4">
                                <div class="flex-shrink-0">
                                    <img
                                        class="h-12 w-12 rounded-full"
                                        src="https://reports.ieraafrica.org/img/avatars/annonymous.png"
                                        alt="Ragheef Sharif"
                                    />
                                </div>
                                <div class="ml-4">
                                    <h4 class="text-lg font-bold text-gray-900">
                                        Ragheef Sharif
                                    </h4>
                                    <p class="text-gray-600">
                                        Operations Manager, Malawi
                                    </p>
                                </div>
                            </div>
                            <div class="text-yellow-400 mb-4">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <p class="text-gray-700 italic">
                                "As a fast-growing organization, we needed a
                                system that could scale with us. SIRE's
                                flexibility and comprehensive reporting help us
                                maintain hiring quality as we expand rapidly."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="bg-gray-50 py-16">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 class="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
                        Ready to Transform Your Hiring Process?
                    </h2>
                    <p class="text-xl text-gray-900 max-w-3xl mx-auto mb-8">
                        Start using SIRE today.
                    </p>
                    <div class="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="/login"
                            class="border bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-md text-lg font-medium transition duration-300 transform hover:scale-105"
                        >
                            Start Now <i class="fas fa-rocket ml-2"></i>
                        </a>
                    </div>
                </div>
            </section>

            <footer class="bg-gray-900 text-white pt-16 pb-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <h3 class="text-lg font-bold mb-4">SIRE</h3>
                            <p class="text-gray-400">
                                The complete solution for modern and smart
                                hiring.
                            </p>
                        </div>

                        <div>
                            <h3 class="text-lg font-bold mb-4">Product</h3>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        href="#features"
                                        class="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        Features
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#home"
                                        class="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        Integrations
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#home"
                                        class="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        Updates
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="text-lg font-bold mb-4">Resources</h3>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        href="#home"
                                        class="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        Help Center
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 class="text-lg font-bold mb-4">Company</h3>
                            <ul class="space-y-2">
                                <li>
                                    <a
                                        href="#home"
                                        class="text-gray-400 hover:text-white transition duration-300"
                                    >
                                        About Us
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p class="text-gray-400 mb-4 md:mb-0">
                            ©{` ${new Date().getFullYear()} `}
                            SIRE. All rights reserved.
                        </p>
                        <div class="flex space-x-6">
                            <a
                                href="#home"
                                class="text-gray-400 hover:text-white transition duration-300"
                            >
                                <i class="fab fa-twitter text-xl"></i>
                            </a>
                            <a
                                href="#home"
                                class="text-gray-400 hover:text-white transition duration-300"
                            >
                                <i class="fab fa-linkedin text-xl"></i>
                            </a>
                            <a
                                href="#home"
                                class="text-gray-400 hover:text-white transition duration-300"
                            >
                                <i class="fab fa-facebook text-xl"></i>
                            </a>
                            <a
                                href="#home"
                                class="text-gray-400 hover:text-white transition duration-300"
                            >
                                <i class="fab fa-instagram text-xl"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
}

consoleSilencer();

createRoot(document.getElementById("root")).render(<HomePage />);
