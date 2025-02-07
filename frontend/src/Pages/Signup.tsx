import axios from "axios";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function SignUp() {
    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username || !password) {
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/signup`, { username, password });
            navigate("/signin");
        } catch (err) {
            console.error("Sign-up error:", err);
        }
        setLoading(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-900 text-white px-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>


                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter your username"
                        ref={usernameRef}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        ref={passwordRef}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all text-white font-semibold shadow-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>
                <p className="text-center text-gray-400 mt-4">
                    Already have an account?{" "}
                    <a href="/signin" className="text-blue-400 hover:underline">
                        Sign In
                    </a>
                </p>
            </div>
        </div>
    );
}
