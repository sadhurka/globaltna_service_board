'use client';

import './globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Re-verify login status when moving between pages
  useEffect(() => {
    setIsAdmin(!!localStorage.getItem('admin_token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    router.push('/');
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:;base64,=" />
      </head>
      <body>
        <nav className="nav">
          <Link href="/" className="nav-brand">
            Global<span>TNA</span>
          </Link>
          
          <div className="nav-menu">
            <Link href="/" className="nav-link">Browse Services</Link>
            
            {isAdmin ? (
              <>
                <Link href="/jobs/new" className="nav-post">+ Post a Service</Link>
                <button onClick={handleLogout} className="btn btn-ghost logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/admin" className="nav-link admin-login">Admin Login</Link>
            )}
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}