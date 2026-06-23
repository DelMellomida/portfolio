import React from 'react';
import TechTags from './TechTags';

function ProjectItem({ title, role, period, description, tech = [], links }) {
    return (
        <div className="w-full max-w-md">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-gray-400">{role} · {period}</p>
            <p className="mt-2 text-gray-300 text-sm">{description}</p>
            <TechTags tech={tech} />
            {links && (links.demo || links.repo) && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {links.demo && (
                        <span className="text-xs text-blue-400">Demo available</span>
                    )}
                    {links.repo && (
                        <span className="text-xs text-blue-400">Source on GitHub</span>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProjectItem;
