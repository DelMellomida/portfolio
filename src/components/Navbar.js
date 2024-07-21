import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <div className="navBar fixed top-0 left-0 bg-[#282c34] w-full z-50 text-white flex items-center justify-between flex-col transition-opacity">
                <div className='flex items-center justify-between flex-row m-5 w-full'>
                    <div className="logoContainer">
                        <img className="w-14 h-14 ml-8" src="/favicon.ico" alt="logo" />
                    </div>
                    <div className="menuBarContainer hidden md:flex">
                        <ul className="menuBar flex items-center justify-between flex-row">
                            <li className="mr-10 text-gray-400 hover:text-amber-200 hover:scale-110 font-bold"><Link to='/'>home</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-lime-200 hover:scale-110 font-bold"><Link to='/about'>about</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-red-200 hover:scale-110 font-bold"><Link to='/skills'>skills</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-violet-200 hover:scale-110 font-bold"><Link to='/projects'>projects</Link></li>
                            <li className="mr-14 text-gray-400 hover:text-blue-200 hover:scale-110 font-bold"><Link to='/contact'>contact</Link></li>
                        </ul>
                    </div>
                    <div className="md:hidden flex items-center mr-7">
                        <button onClick={toggleMenu} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 text-white transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out z-50`}>
                    <div className="flex flex-col h-full">
                        <button onClick={toggleMenu} className="text-white text-2xl p-4 self-end">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <ul className="flex flex-col items-start pl-8 pt-8 space-y-4">
                            <li className="text-gray-400 hover:text-amber-200 font-bold"><Link to='/' onClick={toggleMenu}>home</Link></li>
                            <li className="text-gray-400 hover:text-lime-200 font-bold"><Link to='/about' onClick={toggleMenu}>about</Link></li>
                            <li className="text-gray-400 hover:text-red-200 font-bold"><Link to='/skills' onClick={toggleMenu}>skills</Link></li>
                            <li className="text-gray-400 hover:text-violet-200 font-bold"><Link to='/projects' onClick={toggleMenu}>projects</Link></li>
                            <li className="text-gray-400 hover:text-blue-200 font-bold"><Link to='/contact' onClick={toggleMenu}>contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="borderNav border-b w-[97.5%]"></div>
            </div>
        </>
    );
}

export default Navbar;
