import React from 'react';
import NavBar from "../components/Navbar";
import catImage from "../components/images/cat.png";

function About() {
    return (
        <div className="mt-20 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-400 overflow-x-hidden">
            <NavBar />
            <div className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-20 min-h-[calc(100vh-80px)]">
                {/* Text Content */}
                <div className="w-full md:w-3/5 md:ml-10">
                    <h1 className="text-gray-300 text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center md:text-left">About Me</h1>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        Hi, I'm <span className="text-white font-semibold">Jhondel Mellomida</span>, a 3rd-year Computer Science student at Pamantasan ng Lungsod ng Pasig, driven by the goal of using technology to simplify and enhance lives. Through my academic journey, I've developed multiple websites, apps, and systems. Although I’ve had a brief internship experience, my dedication to learning and exploring new areas of tech has been a cornerstone of my growth.
                    </p>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        I’m a versatile developer with a keen interest in frontend, backend, full stack, and app development. My strengths lie in logical problem-solving, persistent exploration, and an unwavering passion for coding. I’m always eager to tackle new challenges and push the boundaries of what’s possible.
                    </p>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        Beyond the screen, I enjoy singing and cycling, and I have a deep interest in astronomy and physics. The boundless potential of technology motivates me, and I’m excited to work on projects that aim to make a meaningful impact.
                    </p>
                </div>
                {/* Cat Image */}
                <div className="flex justify-center items-center w-full md:w-2/5 mb-8 md:mb-0">
                    <img
                        src={catImage}
                        alt="cat"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md h-auto border-4 border-[#5561f5] shadow-xl transition-transform duration-300 hover:scale-105 object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

export default About;