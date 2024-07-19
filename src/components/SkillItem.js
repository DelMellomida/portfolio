import React from 'react';
import '../App.css';

function SkillItem({ skill }) {
    return (
        <React.Fragment>
            <div className='flex flex-wrap items-center justify-center flex-row w-48 h-48 border-dashed border-gray-400 border-2 m-3 animate-zoomIn'>
                {skill}
            </div>
        </React.Fragment>
    );
}

export default SkillItem;
