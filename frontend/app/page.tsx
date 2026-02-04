'use client'
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { useEffect } from "react";
import { fetchUsersThunk } from "./redux/features/users/userSlice";
import connectWebSocket from "@/components/websocket/websocket";

export default function Home() {
  const dispatch=useAppDispatch();
  const currentUser = useAppSelector(state => state.users.currentUser)
  const fetch = async ()=>{
    await dispatch(fetchUsersThunk());
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
    </div>
  );
}
