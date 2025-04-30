
import { useLoaderData } from "react-router-dom";
export default function Profile() {
    const data = useLoaderData();

    return (
        <div className="py-10 px-6 bg-black/10 backdrop-blur ">
            <div className="max-w-3xl mx-auto bg-black/30 backdrop-blur shadow-md rounded-lg p-8">
                <div className="flex flex-col items-center text-center">
                    <img
                        src={data.avatar_url}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mb-4"
                    />
                    <h1 className="text-3xl font-semibold text-gray-100 mb-2">Darshil Naliyapara</h1>
                    <p className="text-gray-300 text-sm mb-4">Web Developer | Tech Enthusiast | Lifelong Learner</p>
                    <p className="text-gray-200 leading-relaxed text-md">
                        Hey there! 👋 I'm a passionate developer with a love for clean UI, smooth UX, and solving real-world
                        problems with code. I'm currently exploring the depths of React, Tailwind CSS, and modern web frameworks.
                        When I'm not coding, you'll probably find me exploring new gadgets, listening to tech podcasts, or
                        catching up on sci-fi flicks. Let's build something awesome together!
                    </p>
                    <h1 className="text-2xl font-semibold text-gray-100 mb-2">Github Followers: {data.followers}</h1>


                    <div className="mt-6 space-x-4">
                        <a
                            href="https://github.com/DarshilNaliyapara"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition"
                        >
                            GitHub
                        </a>
                        <a
                            href="mailto:darshil6675@gmail.com"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                        >
                            Contact Me
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export const fetchgithubinfo = async () => {
    try {
        const response = await fetch("https://api.github.com/users/DarshilNaliyapara");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching GitHub Info:", error);
    }
}