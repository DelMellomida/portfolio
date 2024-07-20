import { Link } from "react-router-dom";

function Navbar() {
    return (
        <>
            <div className="navBar flex items-center justify-between flex-col z-10 transition-opacity">
                <div className='flex items-center justify-between flex-row m-5 w-full'>
                    <div className="logoContainer">
                        <img className="w-14 h-14 ml-8" src="/favicon.ico" alt="logo" />
                    </div>
                    <div className="menuBarContainer">
                        <ul className="menuBar flex items-center justify-between flex-row">
                            <li className="mr-10 text-gray-400 hover:text-amber-200 hover:scale-110 font-bold"><Link to='/'>home</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-lime-200 hover:scale-110 font-bold"><Link to='/about'>about</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-red-200 hover:scale-110 font-bold"><Link to='/skills'>skills</Link></li>
                            <li className="mr-10 text-gray-400 hover:text-violet-200 hover:scale-110 font-bold"><Link to='/projects'>projects</Link></li>
                            <li className="mr-14 text-gray-400 hover:text-blue-200 hover:scale-110 font-bold"><Link to='/contact'>contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="borderNav border-b w-[97.5%]"></div>
            </div>
        </>
    );
}

export default Navbar;