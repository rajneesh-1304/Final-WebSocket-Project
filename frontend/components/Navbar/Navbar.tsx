'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import './navbar.css';
import { logout } from '@/app/redux/features/users/userSlice';

interface NavbarProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchValue, setSearchValue }) => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="so-navbar">
      <div className="so-logo" onClick={() => router.push('/')}>
        <img
          src="https://cdn.sstatic.net/Sites/stackoverflow/company/img/logos/so/so-icon.svg"
          alt="Logo"
        />
        <span>stack<span className="orange-text">overflow</span></span>
      </div>

      <nav className="so-nav-links">
        <a href="/">Home</a>
        <a href="/question">Questions</a>
        <a href="/draft">Drafts Questions</a>
      </nav>

      <div className="so-search">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
        />
      </div>

      {/* Auth Buttons */}
      <div className="so-auth">
        {!currentUser ? (
          <>
            <button className="auth-btn login" onClick={() => router.push('/login')}>
              Log in
            </button>
            <button className="auth-btn signupp" onClick={() => router.push('/register')}>
              Sign up
            </button>
          </>
        ) : (
          <button className="auth-btn logout" onClick={handleLogout}>
            Log out
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
