import React, { useState } from 'react';
import NavBar from "../components/Navbar";
import ProjectItem from "../components/ProjectItem";

const items = [
    {
        company: 'Real-Time Chat App with AI',
        role: 'Full Stack Developer',
        period: 'Present',
        description: 'Developed a real-time chat application with AI integration using React, Node.js, and Socket.io. Implemented features like user authentication, message encryption, and AI-powered chat suggestions.',
        image: '/images/chat_app.png'
    },
    {
        company: 'Ecommerce Site For Glasses',
        role: 'Full Stack Developer',
        period: '2025 May',
        description: 'Developed an e-commerce site for glasses using PHP, JS, and MySQL.',
        image: '/images/glasses_ecomm.png'
    },
    {
        company: 'Radius Telecoms, Inc.',
        role: 'IT End User Support',
        period: '2024 - Present',
        description: 'Provided technical support and troubleshooting for end users, managed hardware and software installations, and maintained IT documentation.',
        image: '/images/radius_office.jpg'
    },
    {
        company: 'Personal Portfolio Website',
        role: 'Full Stack Developer',
        period: '2023',
        description: 'Designed and developed a personal portfolio website using React, Tailwind CSS, and deployed on Netlify. Features include responsive design, interactive UI, and integration with social media.',
        image: '/images/porfolio.png'
    },
];

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-x-hidden">
            <NavBar />
            
            {/* Mobile Layout - Only show on small screens */}
            <div className="block md:hidden mt-20 px-4 sm:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    {items.map((item, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-blue-500/30 hover:border-blue-500/50"
                            onClick={() => setSelectedProject(item)}
                        >
                            <div className="flex items-start gap-4">
                                {item.image && (
                                    <img 
                                        src={item.image} 
                                        alt={item.company} 
                                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg flex-shrink-0" 
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <ProjectItem
                                        company={item.company}
                                        role={item.role}
                                        period={item.period}
                                        description={item.description}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Zigzag Timeline - Only show on medium screens and up */}
            <div className="hidden md:block mt-36 px-6">
                <div className="max-w-6xl mx-auto relative">
                    {/* Vertical timeline line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 transform -translate-x-1/2"></div>
                    
                    <div className="space-y-24">
                        {items.map((item, idx) => {
                            const isLeft = idx % 2 === 0;
                            return (
                                <div key={idx} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute left-1/2 top-1/2 w-6 h-6 bg-blue-500 border-4 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-lg animate-pulse hover:scale-110 transition-transform duration-300"></div>
                                    
                                    {/* Zigzag grid */}
                                    <div className="grid grid-cols-2 gap-16 items-center">
                                        {/* Left column: only show card if isLeft */}
                                        <div className="flex justify-end">
                                            {isLeft && (
                                                <div 
                                                    className="inline-block cursor-pointer group ml-4"
                                                    onClick={() => setSelectedProject(item)}
                                                >
                                                    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 max-w-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-blue-500/30 group-hover:border-blue-500/50 flex items-center gap-4">
                                                        {item.image && (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.company} 
                                                                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg"
                                                            />
                                                        )}
                                                        <ProjectItem
                                                            company={item.company}
                                                            role={item.role}
                                                            period={item.period}
                                                            description={item.description}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        {/* Right column: only show card if !isLeft */}
                                        <div className="flex justify-start">
                                            {!isLeft && (
                                                <div 
                                                    className="inline-block cursor-pointer group mr-4"
                                                    onClick={() => setSelectedProject(item)}
                                                >
                                                    <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6 max-w-md transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-blue-500/30 group-hover:border-blue-500/50 flex items-center gap-4">
                                                        <ProjectItem
                                                            company={item.company}
                                                            role={item.role}
                                                            period={item.period}
                                                            description={item.description}
                                                        />
                                                        {item.image && (
                                                            <img 
                                                                src={item.image} 
                                                                alt={item.company} 
                                                                className="w-20 h-20 object-cover rounded-full border-2 border-blue-400 shadow-lg"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Project Image Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-2xl relative max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <button
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl transition-colors duration-200"
                            onClick={() => setSelectedProject(null)}
                        >
                            &times;
                        </button>
                        
                        <div className="p-6">
                            {selectedProject.image && (
                                <div className="mb-6">
                                    <img 
                                        src={selectedProject.image} 
                                        alt={selectedProject.company}
                                        className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            )}
                            
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.company}</h2>
                                    <h3 className="text-lg text-blue-400 mb-1">{selectedProject.role}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{selectedProject.period}</p>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;