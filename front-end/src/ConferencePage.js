import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {MessageSquare, Video, X} from 'lucide-react'
import {io} from "socket.io-client";


export default function ConferencePage({roomName, personName}) {
    const navigate = useNavigate()
    const [chatMessages, setChatMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const socket = io("http://localhost:3000")
        setSocket(socket)
        socket.on('connect', () => {
            console.log("Connected")
            socket.emit("join", {personName: personName, roomName: roomName})
        })
        socket.on("message", (data) => {
            setChatMessages([...chatMessages, data])
            console.log("new message in front end:", data);
        })
    }, [])

    const handleLeaveRoom = () => {
        navigate('/')
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            const finalMsg = {message: newMessage, personName: personName}
            setChatMessages([...chatMessages, finalMsg])
            socket.emit("message", {roomName: roomName, personName: personName, message: newMessage})
            setNewMessage('')
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">

            <div className="flex-1 p-4 overflow-auto">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, index) => (
                        <div key={index}
                             className="aspect-video bg-gray-300 rounded-lg flex items-center justify-center">
                            <Video className="h-12 w-12 text-gray-400"/>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-[300px] bg-white border-l border-gray-200 flex flex-col h-full">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{roomName}</h2>
                </div>
                <div className="flex-1 p-4 overflow-y-auto ">
                    {chatMessages.map((chat, index) => (
                        <div key={index} className="mb-4 flex items-end space-x-2">
                            <div className="max-w-sm rounded-lg bg-amber-100 p-3 shadow-md">
                                <p className="text-sm text-gray-700">{chat.message}</p>
                                <p className="text-xs text-gray-500 mt-1">{chat.personName}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 outline-none border border-gray-300 rounded px-2 py-1"
                        />
                        <button type="submit">
                            <MessageSquare className="h-4 w-4"/>
                        </button>
                    </div>
                </form>
            </div>


            <button
                onClick={handleLeaveRoom}
                className="absolute  text-sm  rounded-2xl top-4 right-4 bg-red-500 hover:bg-red-600 px-2 py-1 text-white"
            >
                Leave Room
            </button>
        </div>
    )
}