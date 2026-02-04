import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => socket;

export const connectSocket = (userId: number, purpose: "otp" | "session" = "session") => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: { userId, purpose },
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.auth = { userId };
    socket.connect();
  }

  socket.on("connect", () => {
    console.log("WebSocket connected:", socket?.id);
  });

  socket.on("otp_required", (data) => {
    console.log(" OTP required:", data.message);
  });

  socket.on("otp_generated", (data) => {
    console.log(" OTP generated (dev):", data.otp);
  });

  socket.on("otp_response", (data) => {
    console.log(" OTP response:", data);
  });

  socket.on("otp_error", (data) => {
    console.error(" OTP error:", data.message);
  });

  socket.on("disconnect", () => {
    console.log(" WebSocket disconnected");
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
