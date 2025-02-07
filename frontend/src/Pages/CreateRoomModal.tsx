import axios from "axios";
import { useRef } from "react";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react"; // Importing Lucide Icons for Cross Icon

export function CreateRoomModal({ onClose }: { onClose: () => void }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    async function CreateRoom() {
        const slug = inputRef.current?.value;
        if (!slug) return;

        try {
            await axios.post(
                `${BACKEND_URL}/room`,
                { slug },
                {
                    headers: {
                        token: localStorage.getItem("token"),
                    },
                }
            );
            navigate(`/room/${slug}`);
            onClose(); // Close the modal after successful room creation
        } catch (error) {
            console.error("Error creating room:", error);
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-white transition-all"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4">Create a Room</h2>

                <input
                    type="text"
                    placeholder="Enter room name"
                    ref={inputRef}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={CreateRoom}
                    className="w-full mt-4 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all text-white font-semibold shadow-md"
                >
                    Create Room
                </button>
            </div>
        </div>
    );
}
