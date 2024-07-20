import React, { useState, useEffect } from 'react';
import NavBar from "../components/Navbar";
import useTypingEffect from '../components/useTypingEffect';
import SkillItem from '../components/SkillItem';
import '../App.css';

// Import images
import ReactLogo from '../components/images/react.png';
import JavaLogo from '../components/images/java.png'
import JSLogo from '../components/images/JavaScript.png'

function Skills() {
    const texts = ['  skills dev', '  projects dev', '  achievements dev'];
    const nextTexts = ['']
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [isSkillsVisible, setIsSkillsVisible] = useState(false);

    const typedText = useTypingEffect(texts[currentTextIndex], 150, setIsTypingFinished);

    const skillContents = [
        [
            { skill: 'Java', ratings: '7', img: JavaLogo },
            { skill: 'JavaScript', ratings: '8', img: JSLogo},
            { skill: 'React', ratings: '7', img: ReactLogo},
        ],
        [
            { skill: 'HTML', ratings: '9' },
            { skill: 'CSS', ratings: '8' },
            { skill: 'Tailwind CSS', ratings: '7' },
        ],
        [
            "Something"
        ]
    ];

    const [currentContentIndex, setCurrentContentIndex] = useState(0);

    const handleTerminalClick = () => {
        setCurrentContentIndex((prevIndex) => (prevIndex + 1) % skillContents.length);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTypingFinished(false);
        setIsSkillsVisible(false);
    };

    useEffect(() => {
        if (isTypingFinished) {
            setIsSkillsVisible(true);
        }
    }, [isTypingFinished]);

    return (
        <React.Fragment>
            <div className="h-screen overflow-hidden font-inconsolata">
                <NavBar />
                <div className={`w-screen flex flex-wrap items-center justify-center h-[80%]`}>
                    <div className={`terminal bg-[#1d2026] m-5 p-4 w-full md:w-6/12 rounded-lg flex flex-wrap items-start flex-col shadow-lg shadow-gray-900 ${isSkillsVisible ? 'terminal-expanded' : ''}`} 
                    onClick={handleTerminalClick}
                    >
                        <div className='flex flex-wrap flex-row justify-between items-center w-full mb-7'>
                            <ul className='flex flex-wrap flex-row'>
                                <li className='bg-red-300 w-4 h-4 rounded-full'></li>
                                <li className='bg-orange-300 w-4 h-4 ml-4 rounded-full'></li>
                                <li className='bg-green-300 w-4 h-4 ml-4 rounded-full'></li>
                            </ul>
                            <div className='flex-grow flex justify-center'>
                                <p className='text-gray-400 text-center pr-14'>jhondel-cli</p>
                            </div>
                        </div>
                        <p className='text-gray-400'>
                            jhondel@dev:-$<span>{typedText}</span><span className="cursor"></span>
                        </p>
                        {isSkillsVisible && (
                            <div className='flex flex-wrap items-center justify-center w-full mt-5'>
                                <div className='skills flex flex-wrap items-center justify-center flex-row'>
                                    <div className='text-gray-400 flex flex-wrap items-center justify-evenly flex-row'>
                                        {Array.isArray(skillContents[currentContentIndex])
                                            ? skillContents[currentContentIndex].map((skill, index) => (
                                                <SkillItem
                                                    key={index}
                                                    skill={skill.skill}
                                                    ratings={skill.ratings}
                                                    img={skill.img}
                                                />
                                            ))
                                            : skillContents[currentContentIndex]}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Skills;
