import React, { useState, useEffect } from 'react';
import NavBar from "../components/Navbar";
import useTypingEffect from '../components/useTypingEffect';
import SkillItem from '../components/SkillItem';
import '../App.css';

import ReactLogo from '../components/images/react.png';
import JSLogo from '../components/images/JavaScript.png';
import TWLogo from '../components/images/Tailwind.png';
import PHPLogo from '../components/images/PHP.png';
import MySqlLogo from '../components/images/mysql.png';
import GitLogo from '../components/images/git.png';
import PythonLogo from '../components/images/python.png';

function Skills() {
    const texts = ['  skills languages', '  skills cloud', '  skills databases', '  skills ai', '  skills other'];
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
            { skill: 'Python', ratings: 'Experienced', img: PythonLogo },
            { skill: 'FastAPI', ratings: 'Experienced', img: PythonLogo },
            { skill: 'Node.js', ratings: 'Experienced', img: JSLogo },
            { skill: 'React', ratings: 'Experienced', img: ReactLogo },
            { skill: 'Next.js', ratings: 'Proficient', img: ReactLogo },
            { skill: 'TypeScript', ratings: 'Proficient', img: JSLogo },
            { skill: 'PHP / Laravel', ratings: 'Proficient', img: PHPLogo },
            { skill: 'Tailwind CSS', ratings: 'Experienced', img: TWLogo },
        ],
        [
            { skill: 'AWS', ratings: 'Proficient' },
            { skill: 'GCP', ratings: 'Proficient' },
            { skill: 'Azure', ratings: 'Familiar' },
            { skill: 'Docker', ratings: 'Proficient' },
            { skill: 'OpenTelemetry', ratings: 'Experienced' },
            { skill: 'Grafana Cloud', ratings: 'Experienced' },
            { skill: 'CI/CD', ratings: 'Proficient' },
        ],
        [
            { skill: 'MongoDB', ratings: 'Experienced' },
            { skill: 'PostgreSQL', ratings: 'Proficient' },
            { skill: 'MySQL', ratings: 'Proficient', img: MySqlLogo },
            { skill: 'Supabase', ratings: 'Proficient' },
            { skill: 'ChromaDB', ratings: 'Experienced' },
        ],
        [
            { skill: 'OpenAI API', ratings: 'Experienced', img: PythonLogo },
            { skill: 'Anthropic API', ratings: 'Experienced' },
            { skill: 'Gemini API', ratings: 'Experienced' },
            { skill: 'LangChain', ratings: 'Proficient' },
            { skill: 'LangGraph', ratings: 'Proficient' },
            { skill: 'RAG / MCP', ratings: 'Experienced' },
            { skill: 'Agent Orchestration', ratings: 'Experienced' },
        ],
        [
            { skill: 'REST API Design', ratings: 'Experienced' },
            { skill: 'System Design', ratings: 'Proficient' },
            { skill: 'Active Directory', ratings: 'Proficient' },
            { skill: 'System Administration', ratings: 'Proficient' },
            { skill: 'Git', ratings: 'Experienced', img: GitLogo },
        ],
    ];

    const [currentContentIndex, setCurrentContentIndex] = useState(0);

    return (
        <React.Fragment>
            <div className="min-h-screen font-inconsolata bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
                <NavBar />
                <div className={`w-screen flex flex-wrap items-center justify-center py-28 md:py-20 min-h-screen`}>
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
                                        {skillContents[currentContentIndex].map((skill, index) => (
                                            <SkillItem
                                                key={index}
                                                skill={skill.skill}
                                                ratings={skill.ratings}
                                                img={skill.img}
                                            />
                                        ))}
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
