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
                            <li className="mr-7 text-gray-400 hover:text-amber-200 hover:scale-110"><a href='/Home'>home</a></li>
                            <li className="mr-7 text-gray-400 hover:text-lime-200 hover:scale-110"><a href='/About'>about</a></li>
                            <li className="mr-7 text-gray-400 hover:text-red-200 hover:scale-110"><a href='/Skills'>skills</a></li>
                            <li className="mr-7 text-gray-400 hover:text-violet-200 hover:scale-110"><a href='/Projects'>projects</a></li>
                            <li className="mr-20 text-gray-400 hover:text-blue-200 hover:scale-110"><a href='/Contact'>contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="borderNav border-b w-[97.5%]"></div>
            </div>
        </>
    );
}

export default Navbar;