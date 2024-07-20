import React from 'react';
import '../App.css';

function SkillItem(props) {
    return (
        <React.Fragment>
            <div className='flex flex-wrap items-center justify-center flex-row w-52 h-52 border-dashed border-gray-400 border-2 m-3 animate-zoomIn flex-col p-3'>
                {props.img ? (
                    <img src={props.img} alt={`${props.skill} logo`} className='w-28 h-28'/>
                ) : (
                    <div className='w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center'>
                        <span className='text-gray-500'>No Image</span>
                    </div>
                )}
                <h3 className='font-bold text-white mt-2'>{props.skill}</h3>
                <p className='text-gray-400'>Rating: {props.ratings}</p>
            </div>
        </React.Fragment>
    );
}

export default SkillItem;
