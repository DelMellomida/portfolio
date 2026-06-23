import React, { useState } from 'react';
import NavBar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Timeline from '../components/Timeline';
import ProjectItem from '../components/ProjectItem';
import TechTags from '../components/TechTags';
import { projects } from '../data/projects';

function Projects() {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-x-hidden pb-16">
            <NavBar />

            <div className="mt-24 md:mt-28">
                <PageHeader
                    title="Projects"
                    subtitle="Selected builds spanning AI agents, full-stack applications, and real-time systems."
                />
                <Timeline
                    items={projects}
                    getImage={(item) => item.image}
                    getItemLabel={(item) => item.title}
                    onItemClick={setSelectedProject}
                    renderItem={(item) => (
                        <ProjectItem
                            title={item.title}
                            role={item.role}
                            period={item.period}
                            description={item.description}
                            tech={item.tech}
                            links={item.links}
                        />
                    )}
                />
            </div>

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
                                        alt={selectedProject.title}
                                        className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedProject.title}</h2>
                                    <h3 className="text-lg text-blue-400 mb-1">{selectedProject.role}</h3>
                                    <p className="text-gray-400 text-sm mb-4">{selectedProject.period}</p>
                                </div>
                                <p className="text-gray-300 leading-relaxed">{selectedProject.description}</p>
                                <TechTags tech={selectedProject.tech} />
                                {selectedProject.links && (
                                    <div className="flex flex-wrap gap-3 pt-2">
                                        {selectedProject.links.demo && (
                                            <a
                                                href={selectedProject.links.demo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 text-sm"
                                            >
                                                View Demo
                                            </a>
                                        )}
                                        {selectedProject.links.repo && (
                                            <a
                                                href={selectedProject.links.repo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 text-sm"
                                            >
                                                View on GitHub
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Projects;
