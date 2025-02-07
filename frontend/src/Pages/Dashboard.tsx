import { useRef, useState } from "react";
import { CreateRoomModal } from "./CreateRoomModal";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export function Dashboard({ socket, loading }: { socket: WebSocket | null; loading: boolean }) {
    const [modal, setModal] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    async function JoinRoom() {
        const slug = inputRef.current?.value;
        if (!slug) return;

        try {
            const response = await axios.get(`${BACKEND_URL}/room/${slug}`);
            const roomId = response.data.roomId;

            if (socket && !loading) {
                socket.send(
                    JSON.stringify({
                        type: "JOIN_ROOM",
                        roomId,
                    })
                );
            }

            navigate(`/room/${slug}`);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white px-6">
            <h1 className="text-4xl font-bold mb-6">Hey, Chat!</h1>

            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                {/* Input Field */}
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter room name"
                        ref={inputRef}
                        className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={JoinRoom}
                        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all text-white font-semibold shadow-md"
                        disabled={loading}
                    >
                        {loading ? "Hold on.." : "JOIN ROOM"}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setModal(true)}
                        className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all text-white font-semibold shadow-md"
                    >
                        CREATE ROOM
                    </button>
                </div>
            </div>

            {/* Modal */}
            {modal && <CreateRoomModal onClose={() => setModal(false)} />}
        </div>
    );
}
