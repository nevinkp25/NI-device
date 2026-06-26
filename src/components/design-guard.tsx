
'use client';

import { useState, useEffect } from 'react';

/**
 * DesignGuard Component
 * 
 * Provides a global security layer for the application design.
 * Prompts for credentials on mount and persists authorization in session storage.
 */
export function DesignGuard({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check session storage to avoid re-prompting on every navigation within the same session
    const authStatus = sessionStorage.getItem('design_authorized');
    if (authStatus === 'true') {
      setIsAuthorized(true);
      return;
    }

    // Native browser prompts for immediate, blocking authorization
    const username = window.prompt('Design Protection - Authorization Required\n\nEnter Username:');
    const password = window.prompt('Design Protection - Authorization Required\n\nEnter Password:');

    if (username === 'design@emenu.net' && password === 'admin031306') {
      sessionStorage.setItem('design_authorized', 'true');
      setIsAuthorized(true);
    } else {
      alert('Access Denied: Incorrect Username or Password.');
      window.location.reload(); // Force reload to re-trigger the guard
    }
  }, []);

  // Return a secure loading state while checking authorization to hide design elements
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0051B5] text-white">
        <div className="text-center space-y-6">
          <div className="h-16 w-16 border-4 border-t-white border-white/20 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tighter uppercase">Security Guard</h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Authenticating Design Access</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
