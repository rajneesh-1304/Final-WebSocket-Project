'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { getSocket } from '@/components/websocket/websocket';
import { logout } from '../redux/features/users/userSlice';

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch=useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');
      return;
    }

    if (currentUser) {
      router.replace('/');
    }
  }, [currentUser, router]);

  useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("session_removed", (data) => {
    console.log("Kicking user Logout page:", data.message);
    dispatch(logout()); 
    // signOut(auth);    
    router.push("/login");
  });

  return () => { socket.off("session_removed"); };
}, [dispatch, router]);


  return <>{children}</>;
}
