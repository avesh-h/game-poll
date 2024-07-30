'use client';
import { useEffect, useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Loader from './Loader/loader';
import { connectSocket } from '@/socket';

const UNGUARDED_ROUTES = ['/login', '/register'];

//Rough implemented for as a example but didn't use it in the project yet and use this in main layout as provider if you want

const AuthGuard = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const isUnGuardRoute = UNGUARDED_ROUTES.includes(pathname);
    setLoading(true);

    if (status === 'loading') {
      return;
    } else if (status === 'authenticated') {
      //Stay on current route
      // connectSocket();
      router.push('gamesList');
    } else if (status === 'unauthenticated' && isUnGuardRoute) {
      //Navigate to login
      router.push('/login');
    }
    setLoading(false);
  }, [pathname, router, status]);

  // console.log('loading', loading);

  if (loading) {
    return <Loader />;
  }
  return <>{children}</>;
};

export default AuthGuard;
