import React, { useState, useEffect } from 'react';
import NavBar from "../components/Navbar";
import useTypingEffect from '../components/useTypingEffect';
import SkillItem from '../components/SkillItem';
import '../App.css';

import ReactLogo from '../components/images/react.png';
import JavaLogo from '../components/images/java.png';
import JSLogo from '../components/images/JavaScript.png';
import HTMLLogo from '../components/images/html.png';
import CSSLogo from '../components/images/CSS.png';
import TWLogo from '../components/images/Tailwind.png';
import PHPLogo from '../components/images/PHP.png';
import LaravelLogo from '../components/images/Laravel.png';
import MySqlLogo from '../components/images/mysql.png';
import GitLogo from '../components/images/git.png';
import GWorkLogo from '../components/images/gworkspace.png';
import OfficeLogo from '../components/images/office.png';
import CppLogo from '../components/images/cpp.png';
import PythonLogo from '../components/images/python.png';

function Skills() {
    const texts = ['  skills webdev', '  skills frontend', '  skills backend', '  skills platform', '  skills others'];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isTypingFinished, setIsTypingFinished] = useState(false);
    const [isSkillsVisible, setIsSkillsVisible] = useState(false);
    const [isText2Visible, setIsText2Visible] = useState(false);

    const typedText = useTypingEffect(texts[currentTextIndex], 150, setIsTypingFinished);

    const handleTerminalClick = () => {
        setCurrentContentIndex((prevIndex) => (prevIndex + 1) % skillContents.length);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setIsTypingFinished(false);
        setIsSkillsVisible(false);
        setIsText2Visible(false);
    };

    useEffect(() => {
        if (isTypingFinished) {
            setIsSkillsVisible(true);
        }
    }, [isTypingFinished]);

    useEffect(() => {
        if (isSkillsVisible) {
            setIsText2Visible(true);
        }
    }, [isSkillsVisible]);

    const skillContents = [
        [
            { skill: 'Java', ratings: '8/10', img: JavaLogo },
            { skill: 'JavaScript', ratings: '7/10', img: JSLogo },
            { skill: 'React', ratings: '7/10', img: ReactLogo },
        ],
        [
            { skill: 'HTML', ratings: '8/10', img: HTMLLogo },
            { skill: 'CSS', ratings: '6', img: CSSLogo },
            { skill: 'Tailwind CSS', ratings: '7/10', img: TWLogo },
        ],
        [
            { skill: 'PHP', ratings: '5/10', img: PHPLogo },
            { skill: 'Laravel', ratings: '3/10', img: LaravelLogo },
            { skill: 'MySQL', ratings: '5/10', img: MySqlLogo }
        ],
        [
            { skill: 'Git', ratings: '7/10', img: GitLogo },
            { skill: 'Google Workspace', ratings: '6/10', img: GWorkLogo },
            { skill: 'Microsoft Office Suite', ratings: '6/10', img: OfficeLogo }
        ],
        [
            { skill: 'C++', ratings: '7/10', img: CppLogo },
            { skill: 'Python', ratings: '5/10', img: PythonLogo }
        ]
    ];

    const [currentContentIndex, setCurrentContentIndex] = useState(0);

    return (
        <React.Fragment>
            <div className="h-screen font-inconsolata">
                <NavBar />
                <div className={`w-screen flex flex-wrap items-center justify-center h-[100%]`}>
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
                            <div className='flex flex-wrap items-center justify-center w-full my-5'>
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
                        {isText2Visible && (
                            <p className='text-gray-400'>
                                {'>>'}<span> Click anywhere in the terminal to continue</span><span className="cursor"></span>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Skills;
