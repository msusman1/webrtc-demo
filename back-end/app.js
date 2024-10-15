const {Server} = require("socket.io");

const io = new Server({
    cors: {
        origin: "*", // Allow this origin
        methods: ["GET", "POST"],        // Allow these methods
        credentials: true,               // If you need to support cookies/auth
    },
});
io.on("connection", (socket) => {
    console.log("connection connected");
    socket.on("join", (data) => {
        socket.join(data.roomName)
        console.log("joined:", data);
    })
    socket.on("message", (data) => {
        console.log("new message:", data);
        io.to(data.roomName).emit("message", data);
    })
});
console.log("Signaling server listening on port 3000");
io.listen(3000);