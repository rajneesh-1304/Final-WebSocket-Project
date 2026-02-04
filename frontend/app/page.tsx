'use client'
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { fetchUsersThunk, logout } from "./redux/features/users/userSlice";
import { getSocket } from "@/components/websocket/websocket";
import { useRouter } from "next/navigation";

export default function Home() {
  const dispatch=useAppDispatch();
  const currentUser = useAppSelector(state => state.users.currentUser)
  const router = useRouter;
  const fetch = async ()=>{
    await dispatch(fetchUsersThunk());
  }
  useEffect(() => {
      const socket = getSocket();
      if (!socket) return;
  
      socket.on("session_removed", async (data) => {
        console.log("Session removed:", data.message);
        dispatch(logout());
      });
  
      socket.on("disconnect", async (reason) => {
        console.log("Socket disconnected:", reason);
        dispatch(logout());
      });
  
      return () => {
        socket.off("session_removed");
        socket.off("disconnect");
      };
    }, [dispatch, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
    </div>
  );
}
