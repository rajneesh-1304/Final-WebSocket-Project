'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { getSocket } from '@/components/websocket/websocket';
import { logout } from './redux/features/users/userSlice';

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch=useAppDispatch();

  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  socket.on("session_removed", (data) => {
    console.log("Kicking user Home Page:", data.message);
    dispatch(logout()); 
    // signOut(auth);     
    router.push("/login");
  });

  return () => { socket.off("session_removed"); };
}, [dispatch, router]);

  useEffect(() => {

    if (!currentUser && pathname === '/') {
      router.replace('/login');
    }

  }, [currentUser, pathname, router]);

  return <>{children}</>;
}
