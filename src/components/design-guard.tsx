
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

    const authorize = () => {
      // Native browser prompts for immediate, blocking authorization
      const username = window.prompt('Design Protection - Authorization Required\n\nEnter Username:');
      const password = window.prompt('Design Protection - Authorization Required\n\nEnter Password:');

      if (username === 'design@emenu.net' && password === 'admin031306') {
        sessionStorage.setItem('design_authorized', 'true');
        setIsAuthorized(true);
      } else {
        alert('Access Denied: Incorrect Username or Password.');
        // We removed window.location.reload() to prevent the infinite loop error.
        // The user can now use the manual "Retry" button on the UI.
      }
    };

    authorize();
  }, []);

  // Return a secure loading state while checking authorization to hide design elements
  if (!isAuthorized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0051B5] text-white">
        <div className="text-center space-y-8">
          <div className="h-16 w-16 border-4 border-t-white border-white/20 rounded-full animate-spin mx-auto"></div>
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-black tracking-tighter uppercase">Security Guard</h2>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Authenticating Design Access</p>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-white/20 transition-all active:scale-95"
            >
              Retry Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
