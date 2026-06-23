import React, { useState } from 'react';
import NavBar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Timeline from '../components/Timeline';
import ExperienceItem from '../components/ExperienceItem';
import TechTags from '../components/TechTags';
import { experience } from '../data/experience';

function Experience() {
    const [selectedExperience, setSelectedExperience] = useState(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 overflow-x-hidden pb-16">
            <NavBar />

            <div className="mt-24 md:mt-28">
                <PageHeader
                    title="Experience"
                    subtitle="Professional roles across software engineering, AI integration, and IT support."
                />
                <Timeline
                    items={experience}
                    getImage={(item) => item.image}
                    getItemLabel={(item) => item.company}
                    onItemClick={setSelectedExperience}
                    renderItem={(item) => (
                        <ExperienceItem
                            role={item.role}
                            company={item.company}
                            period={item.period}
                            location={item.location}
                            highlights={item.highlights}
                            tech={item.tech}
                        />
                    )}
                />
            </div>

            {selectedExperience && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl shadow-2xl relative max-w-2xl w-full max-h-[90vh] overflow-auto">
                        <button
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xl transition-colors duration-200"
                            onClick={() => setSelectedExperience(null)}
                        >
                            &times;
                        </button>

                        <div className="p-6">
                            {selectedExperience.image && (
                                <div className="mb-6">
                                    <img
                                        src={selectedExperience.image}
                                        alt={selectedExperience.company}
                                        className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg"
                                    />
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedExperience.role}</h2>
                                    <h3 className="text-lg text-blue-400 mb-1">{selectedExperience.company}</h3>
                                    <p className="text-gray-400 text-sm">{selectedExperience.period}</p>
                                    {selectedExperience.location && (
                                        <p className="text-gray-500 text-sm">{selectedExperience.location}</p>
                                    )}
                                </div>
                                <ul className="space-y-2 text-gray-300 leading-relaxed list-disc list-inside">
                                    {selectedExperience.highlights.map((highlight) => (
                                        <li key={highlight}>{highlight}</li>
                                    ))}
                                </ul>
                                <TechTags tech={selectedExperience.tech} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Experience;
