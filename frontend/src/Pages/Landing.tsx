import { useNavigate } from "react-router-dom";
import chatLogo from "../assets/chat-logo.webp";
import { Navbar } from "../Components/Navbar";

export function Landing() {
    const navigate = useNavigate()
    return (
        <div className="h-screen w-screen flex flex-col">
            <Navbar />
            <div className="flex flex-col lg:flex-row justify-center gap-20 items-center h-full w-full bg-gradient-to-br from-gray-900 to-black px-6 lg:px-20">
                <div className="max-w-lg text-center lg:text-left flex flex-col gap-6">
                    <h1 className="text-5xl lg:text-6xl text-white font-extrabold leading-tight">
                        Connect Instantly <br /> with Customers
                    </h1>
                    <p className="text-gray-300 text-lg lg:text-xl">
                        Experience seamless, user-friendly messaging that brings people together effortlessly.
                    </p>
                    <button onClick={() => navigate('/dashboard')} className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all text-white text-lg shadow-lg">
                        Start Chatting Now
                    </button>
                </div>
                <div className="mt-10 lg:mt-0">
                    <img src={chatLogo} alt="Chat Logo" className="w-80 lg:w-[500px] drop-shadow-lg" />
                </div>
            </div>
        </div>
    );
}
