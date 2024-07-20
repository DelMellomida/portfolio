import React from 'react';
import '../App.css';

function SkillItem(props) {
    return (
        <React.Fragment>
            <div className='flex flex-wrap items-center justify-center flex-row w-48 h-48 border-dashed border-gray-400 border-2 m-3 animate-zoomIn flex-col'>
                <img src={props.img} alt='skillPic' className='w-28 h-28 rounded-full'/>
                {console.log(props.img)}
                <h3 className='font-bold'>{props.skill}</h3>
            </div>
        </React.Fragment>
    );
}

export default SkillItem;
