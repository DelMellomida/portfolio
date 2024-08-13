import React from 'react';

const CustomInput = ({ type = "text", name, placeholder, value, onChange }) => {
    return (
        <div className="bg-[#262626] p-2 rounded-lg">
            <div className="relative bg-inherit">
                <input 
                    type={type} 
                    id={name} 
                    name={name} 
                    value={value}
                    onChange={onChange}
                    className="peer bg-[#262626] h-10 w-full rounded-lg text-gray-300 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" 
                    placeholder={placeholder} 
                    required
                />
                <label 
                    htmlFor={name} 
                    className="absolute left-2 -top-3 text-sm text-gray-500 bg-[#262626] mx-1 px-1 transition-all duration-300">
                    {placeholder}
                </label>
            </div>
        </div>
    );
};

export default CustomInput;
