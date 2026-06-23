import React from 'react';

function PageHeader({ title, subtitle }) {
    return (
        <div className="text-center px-6 mb-12 md:mb-16">
            <h1 className="text-gray-300 text-4xl sm:text-5xl font-bold mb-3">{title}</h1>
            {subtitle && (
                <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">{subtitle}</p>
            )}
        </div>
    );
}

export default PageHeader;
