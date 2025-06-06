import React from 'react';
import '../App.css';

function ProjectItem(props) {
    return (
        <React.Fragment>
            <div className='w-80 bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition'>
              <h3 className='text-xl font-bold text-white'>{props.role}</h3>
              <p className='text-gray-400'>{props.company} · {props.period} </p>
              <p className='mt-2 text-gray-300'>{props.description} </p>
            </div>
        </React.Fragment>
    );
};

export default ProjectItem;
