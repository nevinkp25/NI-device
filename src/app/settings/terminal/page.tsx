
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Terminal Connectivity sub-page is deprecated.
 * All settings are now unified in the main /settings page.
 */
export default function TerminalConnectivityPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/settings');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="h-8 w-8 border-4 border-[#0051B5]/20 border-t-[#0051B5] rounded-full animate-spin" />
    </div>
  );
}
