'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/app/redux/hooks';

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const currentUser = useAppSelector(
    (state) => state.users.currentUser
  );

  useEffect(() => {

    if (!currentUser && pathname === '/') {
      router.replace('/login');
    }

  }, [currentUser, pathname, router]);

  return <>{children}</>;
}
