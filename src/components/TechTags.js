import React from 'react';

function TechTags({ tech = [] }) {
    if (!tech.length) return null;

    return (
        <div className="flex flex-wrap gap-1.5 mt-3">
            {tech.map((tag) => (
                <span
                    key={tag}
                    className="text-xs bg-blue-500/10 border border-blue-500/30 text-blue-300 rounded-full px-2 py-0.5"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

export default TechTags;
