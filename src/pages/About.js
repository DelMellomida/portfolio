import React from 'react';
import NavBar from "../components/Navbar";
import catImage from "../components/images/cat.png";

function About() {
    return (
        <div className="mt-20 min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-400 overflow-x-hidden">
            <NavBar />
            <div className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 py-10 md:py-20 min-h-[calc(100vh-80px)]">
                <div className="w-full md:w-3/5 md:ml-10">
                    <h1 className="text-gray-300 text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center md:text-left">About Me</h1>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        Hi, I'm <span className="text-white font-semibold">Jhondel Mellomida</span>, a Software Engineer with hands-on experience across the full development lifecycle — backend systems, API development, cloud infrastructure, and observability. I've built and shipped production systems in Python, FastAPI, Node.js, C#/.NET, and React, including a company-adopted agent framework and a language-agnostic observability platform using OpenTelemetry and Grafana Cloud.
                    </p>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        I'm currently working part-time as a Software Engineer at Ellinov Technologies while completing my <span className="text-white font-semibold">Bachelor of Science in Computer Science, Cum Laude</span> at Pamantasan ng Lungsod ng Pasig, graduating June 2026. I'm a President's Lister and Dean's Lister across all recognized semesters, with additional specialization in AI/LLM integration and RAG pipelines.
                    </p>
                    <p className="mt-3 text-gray-400 leading-relaxed text-base md:text-lg">
                        Beyond the screen, I enjoy singing and cycling, and I have a deep interest in astronomy and physics. I'm excited to work on projects that bridge technical implementation with meaningful business outcomes.
                    </p>
                    <div className="mt-8 border-t border-gray-700 pt-6">
                        <h2 className="text-white text-xl font-semibold mb-3">Education & Certifications</h2>
                        <ul className="space-y-2 text-gray-400 text-sm md:text-base">
                            <li><span className="text-white">BS Computer Science, Cum Laude</span> — Pamantasan ng Lungsod ng Pasig (June 2026)</li>
                            <li><span className="text-white">AI Engineering Track</span> — Devcon Philippines (May 2026 – Present)</li>
                            <li>Anthropic: MCP, Agent Skills, AI Fluency Framework & Foundations</li>
                            <li>Cloud (Trainocate): GCP Infrastructure Fundamentals, Introduction to AWS</li>
                            <li>JavaScript & HTML Certifications · AWS Developer Learning Plan (In Progress)</li>
                        </ul>
                    </div>
                </div>
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
