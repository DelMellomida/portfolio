import React from 'react';
import TechTags from './TechTags';

function ExperienceItem({ role, company, period, location, highlights = [], tech = [] }) {
    return (
        <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-white">{role}</h3>
            <p className="text-gray-400">{company} · {period}</p>
            {location && <p className="text-gray-500 text-sm mt-0.5">{location}</p>}
            {highlights.length > 0 && (
                <ul className="mt-3 space-y-2 text-gray-300 text-sm list-disc list-inside">
                    {highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                    ))}
                </ul>
            )}
            <TechTags tech={tech} />
        </div>
    );
}

export default ExperienceItem;
