import React from 'react';
import NavBar from "../components/Navbar";
import catImage from "../components/images/cat.png";

function About() {
    return (
        <React.Fragment>
            <div className="h-screen overflow-hidden text-gray-400">
                <NavBar />
                <div className='aboutContent mx-5 flex flex-col items-start justify-center h-[120%] py-10 md:py-20'>
                    <div className='flex flex-wrap items-start justify-between flex-row'>
                        <div className='w-[60%] ml-10'>
                            <h1 className='text-gray-300 text-5xl font-bold mb-6'>About Me</h1>
                            <p className='mt-3 text-gray-400 leading-relaxed'>
                                Hi, I'm <span className='text-white font-semibold'>Jhondel Mellomida</span>, a 3rd-year Computer Science student at Pamantasan ng Lungsod ng Pasig, driven by the goal of using technology to simplify and enhance lives. Through my academic journey, I've developed multiple websites, apps, and systems. Although I’ve had a brief internship experience, my dedication to learning and exploring new areas of tech has been a cornerstone of my growth.
                            </p>
                            <p className='mt-3 text-gray-400 leading-relaxed'>
                                I’m a versatile developer with a keen interest in frontend, backend, full stack, and app development. My strengths lie in logical problem-solving, persistent exploration, and an unwavering passion for coding. I’m always eager to tackle new challenges and push the boundaries of what’s possible.
                            </p>
                            <p className='mt-3 text-gray-400 leading-relaxed'>
                                Beyond the screen, I enjoy singing and cycling, and I have a deep interest in astronomy and physics. The boundless potential of technology motivates me, and I’m excited to work on projects that aim to make a meaningful impact.
                            </p>
                        </div>
                        <img src={catImage} alt="cat" className="m-0" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default About;
