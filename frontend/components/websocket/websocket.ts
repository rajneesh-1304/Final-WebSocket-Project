import { Socket, io } from "socket.io-client"
function connectWebSocket(id: any) {
    const url = 'http://localhost:5000';

    const socket = io(url, {
        auth: {
            id: id
        }
    },)
    socket.on("connect", () => {
        console.log("Connected")
        socket.on('otp_sent', (data) => {
            alert('OTP Sent! Status: ' + data.status);
        });
    })
    socket.on("disconnect", () => {
        console.log("Disconnected")
    })
    socket.on("connect_error", async err => {
        console.log(`connect_error due to ${err.message}`)
        await fetch("/api/socket")
    })

    socket.on('otp_sent', (data) => {
        console.log('Server response:', data);
    });
}

export default connectWebSocket;