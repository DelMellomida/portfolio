import React from 'react';
import NavBar from "../components/Navbar";
import TypingEffect from "../components/Typing";
import meImage from "../components/images/me.png";
import Socials from "../components/Socials";

function Home() {
    return (
        <React.Fragment>
            <div className="h-screen overflow-hidden">
                <NavBar />
                <div className="homeContent mx-5 flex flex-col md:flex-row items-center justify-center md:justify-between h-[100%] md:h-[115%] sm:h-[110%] mt-[100px] md:mt-0">
                    <div className="textContent flex flex-col items-center md:items-start justify-end md:justify-end h-[70%]">
                        <div>
                            <h1 className="text-[#5561f5] text-5xl md:text-8xl text-center md:text-left font-bold">Jhondel</h1>
                            <h1 className="text-[#5561f5] text-5xl md:text-8xl text-center md:text-left font-bold">Mellomida</h1>
                            <TypingEffect />
                            <Socials />
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <img src={meImage} alt="me" className="me scale-125 xl:scale-150 mx-auto md:mx-0" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;
