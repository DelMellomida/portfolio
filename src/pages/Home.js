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
                <div className="homeContent mx-5 flex flex-wrap items-end justify-between flex-row h-[95%]">
                    <div className="textContent flex flex-wrap items-center justify-between flex-col">
                        <div>
                            <h1 className="text-[#5561f5] text-8xl text-left font-bold">Jhondel </h1>
                            <h1 className="text-[#5561f5] text-8xl text-left font-bold"> Mellomida</h1>
                            <TypingEffect />
                            <Socials />
                        </div>
                    </div>
                    <div>
                        <img src={meImage} alt="me" className="me scale-125 mr-10" />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;