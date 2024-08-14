import React, { useState } from 'react';
import NavBar from "../components/Navbar";
import Socials from "../components/Socials";
import CustomInput from "../components/CustomInput";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const mailtoLink = `mailto:delmellomida@gmail.com?subject=Message from ${formData.name}&body=${formData.message} (${formData.email})`;
        window.location.href = mailtoLink;
    };

    const resumeLink = "/resume.pdf";

    return (
        <React.Fragment>
            <div className="h-screen overflow-auto flex flex-col justify-center items-center">
                <NavBar />
                <div className='contactContent mt-24 relative flex flex-col md:flex-row items-center justify-end bg-[#262626] w-[90%] md:w-[70%] h-fit rounded-2xl p-4 md:p-1 overflow-hidden'>
                    <div
                        className='hidden md:flex contact-image absolute inset-0 bg-cover bg-center w-full md:w-[50%] h-56 md:h-full rounded-2xl z-50'
                        style={{ backgroundImage: `url(/contact-bg.webp)` }}
                        alt="contact"
                    >
                    </div>
                    <div className='contact-content relative w-full md:w-1/2 p-6 z-20'>
                        <div className="text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">Let's Get in Touch</h1>
                            <p className="text-gray-600 mb-8">
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="w-full bg-[#262626] flex flex-col justify-center shadow-md rounded-lg">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="w-full md:w-[48%] mb-4 md:mb-0">
                                    <CustomInput
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="w-full md:w-[48%]">
                                    <CustomInput
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="relative p-2">
                                <label
                                    className="absolute -top-1 left-4 text-sm text-gray-500 bg-[#262626] px-1 transition-all duration-300"
                                    htmlFor="message"
                                >
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    id="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    className="w-full px-3 pt-6 pb-2 border bg-[#262626] rounded-lg focus:outline-none text-slate-300 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
                                Send Message
                            </button>
                        </form>
                        <div className='others flex flex-col md:flex-row items-center justify-center md:justify-between mt-4'>
                            <Socials />
                            <div className="flex justify-center mt-4 md:mt-0 md:ml-4">
                                <a href={resumeLink} target="_blank" rel="noopener noreferrer" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
                                    View My Resume
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Contact;
